import asyncio
import logging
import uuid
from pathlib import Path
from typing import Any, Dict

import googleapiclient.discovery as gdisco
from fastapi import BackgroundTasks, FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from starlette.middleware.sessions import SessionMiddleware

from auth import build_flow, refresh_credentials
from config import get_settings
from database import get_user_by_id, init_db, upsert_user
from drive import create_folder, download_file, upload_clip
from processor import (
    calculate_speech_intervals,
    cut_video,
    detect_silences,
    get_video_duration,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

INPUT_DIR = Path("/tmp/video-cutter/input")
OUTPUT_DIR = Path("/tmp/video-cutter/output")

_jobs: Dict[str, Dict[str, Any]] = {}

cfg = get_settings()
app = FastAPI(title="Video Cutter")
app.add_middleware(SessionMiddleware, secret_key=cfg.secret_key, max_age=86400 * 7)
templates = Jinja2Templates(directory="templates")


# ── Startup ───────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def _startup() -> None:
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    init_db()


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.get("/")
async def index(request: Request):
    return RedirectResponse(
        "/app" if request.session.get("user_id") else "/auth/google"
    )


@app.get("/auth/google")
async def auth_start(request: Request):
    flow = build_flow()
    url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    request.session["oauth_state"] = state
    return RedirectResponse(url)


@app.get("/auth/callback")
async def auth_callback(request: Request, code: str, state: str):
    if state != request.session.get("oauth_state"):
        raise HTTPException(400, "OAuth state mismatch — please try again")

    flow = build_flow()
    flow.fetch_token(code=code)
    creds = flow.credentials

    user_svc = gdisco.build(
        "oauth2", "v2", credentials=creds, cache_discovery=False
    )
    info = user_svc.userinfo().get().execute()

    row = upsert_user(
        email=info["email"],
        name=info.get("name", info["email"]),
        refresh_token=creds.refresh_token or "",
    )
    request.session["user_id"] = int(row["id"])
    return RedirectResponse("/app")


@app.get("/auth/logout")
async def auth_logout(request: Request):
    request.session.clear()
    return RedirectResponse("/")


@app.get("/auth/token")
async def auth_token(request: Request):
    """Returns a fresh access token for the Google Drive Picker."""
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(401, "Not authenticated")
    user = get_user_by_id(user_id)
    if not user or not user["refresh_token"]:
        raise HTTPException(401, "Missing credentials — please log in again")
    creds = await asyncio.to_thread(refresh_credentials, user["refresh_token"])
    return {"access_token": creds.token}


# ── App page ──────────────────────────────────────────────────────────────────

@app.get("/app")
async def app_page(request: Request):
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse("/auth/google")
    user = get_user_by_id(user_id)
    return templates.TemplateResponse(
        "app.html",
        {
            "request": request,
            "user_name": user["name"] if user else "",
            "google_client_id": cfg.google_client_id,
            "google_api_key": cfg.google_api_key,
        },
    )


# ── Process ───────────────────────────────────────────────────────────────────

class ProcessRequest(BaseModel):
    file_id: str
    filename: str


@app.post("/process", status_code=202)
async def process(
    body: ProcessRequest,
    request: Request,
    bg: BackgroundTasks,
):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(401, "Not authenticated")
    user = get_user_by_id(user_id)
    if not user or not user["refresh_token"]:
        raise HTTPException(401, "Missing credentials")

    job_id = str(uuid.uuid4())
    _jobs[job_id] = {
        "status": "pending",
        "step": None,
        "filename": body.filename,
        "clip_count": 0,
        "folder_url": None,
        "error": None,
    }
    bg.add_task(
        _run, job_id, body.file_id, body.filename, str(user["refresh_token"])
    )
    return {"job_id": job_id}


@app.get("/status/{job_id}")
async def status(job_id: str, request: Request):
    if not request.session.get("user_id"):
        raise HTTPException(401, "Not authenticated")
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return {"job_id": job_id, **job}


# ── Background task ───────────────────────────────────────────────────────────

async def _run(
    job_id: str, file_id: str, filename: str, refresh_token: str
) -> None:
    _jobs[job_id]["status"] = "processing"
    base = Path(filename).stem
    input_path = str(INPUT_DIR / f"{job_id}_{filename}")

    try:
        creds = await asyncio.to_thread(refresh_credentials, refresh_token)
        cfg = get_settings()

        _jobs[job_id]["step"] = "downloading"
        log.info("[%s] downloading %s from Drive", job_id, filename)
        await asyncio.to_thread(download_file, file_id, input_path, creds)

        _jobs[job_id]["step"] = "analysing"
        duration = await asyncio.to_thread(get_video_duration, input_path)
        silences = await asyncio.to_thread(
            detect_silences,
            input_path,
            cfg.silence_threshold,
            cfg.silence_duration,
        )
        intervals = calculate_speech_intervals(
            silences, duration, cfg.min_clip_duration
        )
        log.info("[%s] %.0fs → %d intervals", job_id, duration, len(intervals))

        _jobs[job_id]["step"] = "cutting"
        output_dir = str(OUTPUT_DIR / job_id)
        clips = await asyncio.to_thread(
            cut_video, input_path, intervals, output_dir
        )

        _jobs[job_id]["step"] = "uploading"
        folder_id, folder_url = await asyncio.to_thread(
            create_folder, base, creds
        )
        for i, clip_path in enumerate(clips, 1):
            clip_name = f"{base}_{i}.mp4"
            await asyncio.to_thread(
                upload_clip, clip_path, folder_id, clip_name, creds
            )
            log.info("[%s] uploaded %s (%d/%d)", job_id, clip_name, i, len(clips))

        _jobs[job_id].update(
            status="done",
            step="done",
            clip_count=len(clips),
            folder_url=folder_url,
        )
        Path(input_path).unlink(missing_ok=True)
        log.info("[%s] done → %s", job_id, folder_url)

    except Exception as exc:
        log.exception("[%s] failed", job_id)
        _jobs[job_id].update(status="error", error=str(exc))
