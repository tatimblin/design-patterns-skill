#!/usr/bin/env python3
"""Fetch a RefactoringGuru design-patterns repo for a given language.

Usage:
    python fetch_repo.py <language>

Example:
    python fetch_repo.py typescript
    python fetch_repo.py python

The repo is cloned into .claude/skills/design-patterns/repos/<language>/
relative to the git root. If the directory already exists and contains files,
the clone is skipped.
"""

import os
import shutil
import subprocess
import sys

SUPPORTED_LANGUAGES = {
    "typescript": "design-patterns-typescript",
    "python": "design-patterns-python",
    "java": "design-patterns-java",
    "cpp": "design-patterns-cpp",
    "php": "design-patterns-php",
    "csharp": "design-patterns-csharp",
    "swift": "design-patterns-swift",
    "dart": "design-patterns-dart",
    "ruby": "design-patterns-ruby",
    "go": "design-patterns-go",
    "kotlin": "design-patterns-kotlin",
    "rust": "design-patterns-rust",
    "delphi": "design-patterns-delphi",
}

TIMEOUT_SECONDS = 30


def git_root() -> str:
    """Return the git repository root directory."""
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, check=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Error: not inside a git repository or git is not installed.")
        sys.exit(1)
    return result.stdout.strip()


def fetch_repo(language: str) -> str:
    """Clone the RefactoringGuru repo for the given language.

    Returns the absolute path to the cloned repo directory.
    Raises SystemExit on errors (with a message, never a traceback).
    """
    lang = language.lower()
    if lang not in SUPPORTED_LANGUAGES:
        print(f"Unsupported language: {lang}")
        print(f"Supported: {', '.join(sorted(SUPPORTED_LANGUAGES))}")
        sys.exit(1)

    repo_name = SUPPORTED_LANGUAGES[lang]
    root = git_root()
    dest = os.path.join(root, ".claude", "skills", "design-patterns", "repos", lang)

    # Skip if already cloned
    if os.path.isdir(dest) and os.listdir(dest):
        print(f"Already exists: {dest}")
        return dest

    url = f"https://github.com/RefactoringGuru/{repo_name}.git"
    os.makedirs(os.path.dirname(dest), exist_ok=True)

    print(f"Cloning {url} into {dest} ...")
    try:
        subprocess.run(
            ["git", "clone", "--depth", "1", url, dest],
            timeout=TIMEOUT_SECONDS,
            check=True,
        )
    except subprocess.TimeoutExpired:
        shutil.rmtree(dest, ignore_errors=True)
        print(f"Clone timed out after {TIMEOUT_SECONDS}s. Skipping.")
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        shutil.rmtree(dest, ignore_errors=True)
        print(f"Clone failed (exit {e.returncode}). Skipping.")
        sys.exit(1)

    print(f"Done: {dest}")
    return dest


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <language>")
        print(f"Supported: {', '.join(sorted(SUPPORTED_LANGUAGES))}")
        sys.exit(1)
    fetch_repo(sys.argv[1])
