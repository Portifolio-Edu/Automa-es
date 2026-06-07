import asyncio
import logging
import uuid
from pathlib import Path
from typing import Any, Dict

from fastapi import BackgroundTasks, FastAPI, File, HTTPException, UploadFile

from config import get_settings
from drive import upload_to_drive
from processor import (
    calculate_speech_intervals,
    cut_video,
    detect_silences,
    get_video_duration,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

app = FastAPI(title="Video Cutter API", version="1.0.0")

INPUT_DIR = Path("/tmp/video-cutter/input")
OUTPUT_DIR = Path("/tmp/video-cutter/output")

_jobs: Dict[str, Dict[str, Any]] = {}


@app.on_event("startup")
async def _startup() -> None:
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


@app.post("/upload", status_code=202)
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
):
    job_id = str(uuid.uuid4())
    input_path = INPUT_DIR / f"{job_id}_{file.filename}"
    input_path.write_bytes(await file.read())

    _jobs[job_id] = {
        "status": "pending",
        "filename": file.filename,
        "clip_count": 0,
        "clips": [],
        "error": None,
    }

    background_tasks.add_task(_process, job_id, str(input_path))
    return {"job_id": job_id, "status": "pending"}


@app.get("/status/{job_id}")
async def job_status(job_id: str):
    job = _jobs.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"job_id": job_id, **job}


async def _process(job_id: str, input_path: str) -> None:
    cfg = get_settings()
    _jobs[job_id]["status"] = "processing"
    log.info("[%s] start — %s", job_id, input_path)

    try:
        duration = await asyncio.to_thread(get_video_duration, input_path)
        log.info("[%s] duration=%.2fs", job_id, duration)

        silences = await asyncio.to_thread(
            detect_silences, input_path, cfg.silence_threshold, cfg.silence_duration
        )
        log.info("[%s] silences=%d", job_id, len(silences))

        intervals = calculate_speech_intervals(silences, duration, cfg.min_clip_duration)
        log.info("[%s] intervals=%d", job_id, len(intervals))

        output_dir = str(OUTPUT_DIR / job_id)
        clips = await asyncio.to_thread(cut_video, input_path, intervals, output_dir)
        log.info("[%s] clips cut=%d", job_id, len(clips))

        drive_clips = []
        for clip_path in clips:
            url = await asyncio.to_thread(
                upload_to_drive, clip_path, cfg.drive_folder_id, cfg.google_credentials_json
            )
            drive_clips.append({"file": Path(clip_path).name, "url": url})
            log.info("[%s] uploaded %s", job_id, Path(clip_path).name)

        _jobs[job_id].update(
            status="done",
            clip_count=len(drive_clips),
            clips=drive_clips,
        )
        Path(input_path).unlink(missing_ok=True)
        log.info("[%s] done — %d clips", job_id, len(drive_clips))

    except Exception as exc:
        log.exception("[%s] failed", job_id)
        _jobs[job_id].update(status="error", error=str(exc))
