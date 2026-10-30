import os
import zipfile
import datetime

SNAPSHOTS_DIR = r"D:\Hacktoberfest2026_GitLaunch\snapshots"
os.makedirs(SNAPSHOTS_DIR, exist_ok=True)

timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
zip_path = os.path.join(SNAPSHOTS_DIR, f"backup_full_project_{timestamp}.zip")

SOURCES = [
    (r"D:\Hacktoberfest2026_GitLaunch\current", "current"),
    (r"D:\Hacktoberfest2026_GitLaunch\GoSource", "GoSource")
]

EXCLUDE_DIRS = {"node_modules", ".venv", "venv", "__pycache__", ".git"}
EXCLUDE_EXTS = {".pyc", ".tmp", ".log"}

print("Starting backup compression to Drive D...")
total_files = 0

with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
    for src_dir, arc_prefix in SOURCES:
        if not os.path.exists(src_dir):
            continue
        for root, dirs, files in os.walk(src_dir):
            # Exclude unwanted directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in EXCLUDE_EXTS:
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, src_dir)
                archive_name = os.path.join(arc_prefix, rel_path)
                zf.write(full_path, archive_name)
                total_files += 1

size_mb = os.path.getsize(zip_path) / (1024 * 1024)
print(f"SUCCESS: Snapshot created successfully on Drive D!")
print(f"File: {zip_path}")
print(f"Total files archived: {total_files}")
print(f"Archive size: {size_mb:.2f} MB")
