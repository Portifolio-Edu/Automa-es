import os
import sys
import subprocess
import json

SILENCE_THRESHOLD = "-30dB"
SILENCE_DURATION = "1.5"  # seconds
MIN_CLIP_DURATION = 10.0  # seconds

def get_video_duration(filepath):
    cmd = [
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration", "-of",
        "default=noprint_wrappers=1:nokey=1", filepath
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return float(result.stdout.strip())

def detect_silences(filepath):
    cmd = [
        "ffmpeg", "-i", filepath,
        "-vn", "-ac", "1", "-ar", "16000",
        "-af", f"silencedetect=noise={SILENCE_THRESHOLD}:d={SILENCE_DURATION}",
        "-f", "null", "-"
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    silences = []
    for line in result.stderr.split("\n"):
        if "silence_start" in line:
            start = float(line.split("silence_start: ")[1])
            silences.append({"start": start, "end": None})
        elif "silence_end" in line:
            parts = line.split("silence_end: ")[1].split(" | ")
            end = float(parts[0])
            if silences and silences[-1]["end"] is None:
                silences[-1]["end"] = end
    return silences

def calculate_speech_intervals(silences, duration):
    intervals = []
    current_start = 0.0

    for silence in silences:
        if silence["end"] is None:
            continue

        speech_end = silence["start"]
        if speech_end - current_start >= MIN_CLIP_DURATION:
            intervals.append((current_start, speech_end))

        current_start = silence["end"]

    if duration - current_start >= MIN_CLIP_DURATION:
        intervals.append((current_start, duration))

    return intervals

def cut_video(filepath, intervals, output_dir):
    clips = []
    base_name = os.path.splitext(os.path.basename(filepath))[0]

    for i, (start, end) in enumerate(intervals):
        output_file = os.path.join(output_dir, f"{base_name}_clip_{i+1:03d}.mp4")

        cmd = [
            "ffmpeg", "-y", "-i", filepath,
            "-ss", str(start), "-to", str(end),
            "-c", "copy", output_file
        ]

        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if os.path.exists(output_file):
            clips.append(output_file)

    return clips

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Video file path required."}))
        sys.exit(1)

    filepath = sys.argv[1]
    if not os.path.exists(filepath):
        print(json.dumps({"error": f"File not found: {filepath}"}))
        sys.exit(1)

    output_dir = os.path.join(os.path.dirname(filepath), "processed_clips")
    os.makedirs(output_dir, exist_ok=True)

    try:
        duration = get_video_duration(filepath)
        silences = detect_silences(filepath)
        intervals = calculate_speech_intervals(silences, duration)

        clips = cut_video(filepath, intervals, output_dir)

        print(json.dumps({"success": True, "clips": clips}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
