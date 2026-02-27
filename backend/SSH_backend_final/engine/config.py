"""
Shared configuration module for the engine.
Reads the OPENAI_API_KEY directly from the .env file,
bypassing os.getenv for maximum reliability.
"""

import os
from pathlib import Path

def _load_api_key() -> str:
    """Read OPENAI_API_KEY directly from .env file."""
    # First try os.environ (in case it was set externally)
    key = os.environ.get("OPENAI_API_KEY")
    if key:
        return key

    # Read directly from .env file
    env_file = Path(__file__).resolve().parent.parent / ".env"
    if env_file.exists():
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("OPENAI_API_KEY"):
                    _, _, value = line.partition("=")
                    value = value.strip().strip('"').strip("'")
                    if value:
                        os.environ["OPENAI_API_KEY"] = value
                        return value

    raise ValueError("OPENAI_API_KEY not found in environment variables or .env file")


# Load on import
OPENAI_API_KEY = _load_api_key()
