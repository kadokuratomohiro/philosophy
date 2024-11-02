"""
Core module initialization file for LogicLens backend.
This module contains core functionality and configurations for the application.
"""

from typing import Dict, Any
import os

# Version information
__version__ = "1.0.0"

# Environment configuration
ENV: str = os.getenv("NODE_ENV", "development")

# Default configurations
DEFAULT_CONFIG: Dict[str, Any] = {
    "development": {
        "DATABASE_NAME": "philosophical_analyzer",
        "ENCRYPTION_KEY": "local_dev_key",
        "DEBUG": True,
        "API_PREFIX": "/api/v1"
    },
    "production": {
        "DATABASE_NAME": "philosophical_analyzer_prod",
        "ENCRYPTION_KEY": os.getenv("ENCRYPTION_KEY", ""),
        "DEBUG": False,
        "API_PREFIX": "/api/v1"
    }
}

# Get current configuration based on environment
config: Dict[str, Any] = DEFAULT_CONFIG.get(ENV, DEFAULT_CONFIG["development"])

# Application metadata
APP_NAME = "LogicLens"
APP_DESCRIPTION = "A philosophical analysis and logical reasoning platform"
APP_VERSION = __version__

# Export commonly used variables
__all__ = [
    "__version__",
    "ENV",
    "config",
    "APP_NAME",
    "APP_DESCRIPTION",
    "APP_VERSION"
]