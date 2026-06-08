import json
import os
import re
import subprocess
from pathlib import Path
from typing import List, Tuple


def get_video_duration(filepath: str) -> float:
    result = subprocess.run(
        [
            "ffprobe", "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            filepath,
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    data = json.loads(result.stdout)
    return float(data["format"]["duration"])


def detect_silences(
    filepath: str,
    threshold: float = -40.0,
    duration: float = 0.5,
) -> List[Tuple[float, float]]:
    cmd = [
        "ffmpeg", "-i", filepath,
        "-vn", "-ac", "1", "-ar", "16000",
        "-af", f"silencedetect=n={threshold}dB:d={duration}",
        "-f", "null", "-",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)

    silences: List[Tuple[float, float]] = []
    silence_start: float | None = None

    for line in result.stderr.split("\n"):
        if "silence_start" in line:
            m = re.search(r"silence_start: ([\d.e+\-]+)", line)
            if m:
                silence_start = float(m.group(1))
        elif "silence_end" in line and silence_start is not None:
            m = re.search(r"silence_end: ([\d.e+\-]+)", line)
            if m:
                silences.append((silence_start, float(m.group(1))))
                silence_start = None

    return silences


def calculate_speech_intervals(
    silences: List[Tuple[float, float]],
    duration: float,
    min_clip_duration: float = 1.0,
) -> List[Tuple[float, float]]:
    if not silences:
        return [(0.0, duration)] if duration >= min_clip_duration else []

    intervals: List[Tuple[float, float]] = []
    prev_end = 0.0

    for silence_start, silence_end in silences:
        if silence_start > prev_end:
            if silence_start - prev_end >= min_clip_duration:
                intervals.append((prev_end, silence_start))
        prev_end = silence_end

    if duration - prev_end >= min_clip_duration:
        intervals.append((prev_end, duration))

    return intervals


def cut_video(
    filepath: str,
    intervals: List[Tuple[float, float]],
    output_dir: str,
) -> List[str]:
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    output_files: List[str] = []

    for i, (start, end) in enumerate(intervals):
        output_path = os.path.join(output_dir, f"clip_{i + 1:03d}.mp4")
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", filepath,
                "-ss", str(start),
                "-to", str(end),
                "-c", "copy",
                output_path,
            ],
            capture_output=True,
            check=True,
        )
        output_files.append(output_path)

    return output_files
