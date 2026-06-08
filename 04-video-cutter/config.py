from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # FFmpeg
    silence_threshold: float = -40.0
    silence_duration: float = 0.5
    min_clip_duration: float = 1.0

    # Google OAuth2
    google_client_id: str
    google_client_secret: str
    google_api_key: str = ""  # optional – improves Picker quota tracking

    # App
    app_url: str = "http://localhost:8000"
    secret_key: str

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings() -> Settings:
    return Settings()
