import sqlite3
from pathlib import Path
from typing import Optional

DB_PATH = Path("/tmp/video-cutter/db.sqlite3")


def _connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = _connect()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            email         TEXT    UNIQUE NOT NULL,
            name          TEXT    NOT NULL DEFAULT '',
            refresh_token TEXT    NOT NULL DEFAULT '',
            created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()


def upsert_user(email: str, name: str, refresh_token: str) -> sqlite3.Row:
    conn = _connect()
    try:
        conn.execute(
            """
            INSERT INTO users (email, name, refresh_token)
            VALUES (?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
                name          = excluded.name,
                refresh_token = CASE
                    WHEN excluded.refresh_token != '' THEN excluded.refresh_token
                    ELSE refresh_token
                END
            """,
            (email, name, refresh_token),
        )
        conn.commit()
        return conn.execute(
            "SELECT * FROM users WHERE email = ?", (email,)
        ).fetchone()
    finally:
        conn.close()


def get_user_by_id(user_id: int) -> Optional[sqlite3.Row]:
    conn = _connect()
    try:
        return conn.execute(
            "SELECT * FROM users WHERE id = ?", (user_id,)
        ).fetchone()
    finally:
        conn.close()
