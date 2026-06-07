import json
import os

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

_SCOPES = ["https://www.googleapis.com/auth/drive.file"]


def _service(credentials_json: str):
    creds = Credentials.from_service_account_info(
        json.loads(credentials_json),
        scopes=_SCOPES,
    )
    return build("drive", "v3", credentials=creds)


def upload_to_drive(filepath: str, folder_id: str, credentials_json: str) -> str:
    svc = _service(credentials_json)

    file_id = (
        svc.files()
        .create(
            body={"name": os.path.basename(filepath), "parents": [folder_id]},
            media_body=MediaFileUpload(filepath, resumable=True),
            fields="id,webViewLink",
        )
        .execute()["id"]
    )

    svc.permissions().create(
        fileId=file_id,
        body={"type": "anyone", "role": "reader"},
    ).execute()

    return f"https://drive.google.com/file/d/{file_id}/view"
