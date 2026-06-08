from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload


def _svc(creds: Credentials):
    return build("drive", "v3", credentials=creds, cache_discovery=False)


def download_file(file_id: str, dest_path: str, creds: Credentials) -> None:
    request = _svc(creds).files().get_media(fileId=file_id)
    with open(dest_path, "wb") as fh:
        dl = MediaIoBaseDownload(fh, request, chunksize=16 * 1024 * 1024)
        done = False
        while not done:
            _, done = dl.next_chunk()


def create_folder(name: str, creds: Credentials) -> tuple[str, str]:
    svc = _svc(creds)
    f = svc.files().create(
        body={"name": name, "mimeType": "application/vnd.google-apps.folder"},
        fields="id,webViewLink",
    ).execute()
    folder_id = f["id"]
    folder_url = f.get(
        "webViewLink", f"https://drive.google.com/drive/folders/{folder_id}"
    )
    return folder_id, folder_url


def upload_clip(filepath: str, folder_id: str, name: str, creds: Credentials) -> None:
    _svc(creds).files().create(
        body={"name": name, "parents": [folder_id]},
        media_body=MediaFileUpload(filepath, mimetype="video/mp4", resumable=True),
        fields="id",
    ).execute()
