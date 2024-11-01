"""
Core module initialization file for the LogicMind FastAPI backend.
This module contains core functionality and configurations.
"""

from pathlib import Path

# Define the root directory of the application
ROOT_DIR = Path(__file__).parent.parent.parent

# Version information
__version__ = "1.0.0"
__author__ = "LogicMind Team"

# Import core components (if any are added later)
# from .config import Config
# from .security import Security
# from .database import Database

# Export commonly used components
__all__ = [
    'ROOT_DIR',
    '__version__',
    '__author__',
]