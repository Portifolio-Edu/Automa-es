from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    silence_threshold: float = -40.0
    silence_duration: float = 0.5
    min_clip_duration: float = 1.0
    drive_folder_id: str = ""
    google_credentials_json: str = ""

    model_config = {"env_file": ".env"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
