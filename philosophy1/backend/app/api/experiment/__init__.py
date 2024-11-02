from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

# Core dependencies
from app.core.experiment_engine import ExperimentEngine
from app.services.experiment_service import ExperimentService

# Router initialization
router = APIRouter(prefix="/api/experiments", tags=["experiments"])

class ExperimentConfig(BaseModel):
    """思考実験の設定を管理するための設定クラス"""
    
    class Config:
        arbitrary_types_allowed = True
        
    id: str
    title: str
    description: Optional[str]
    variables: Dict[str, str]
    conditions: List[str]
    max_iterations: int = 100
    timeout_seconds: int = 300
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    
    def validate_config(self) -> bool:
        """設定の妥当性を検証するメソッド"""
        return (
            len(self.title) > 0 and
            len(self.variables) > 0 and
            len(self.conditions) > 0 and
            self.max_iterations > 0 and
            self.timeout_seconds > 0
        )

# Service instantiation
experiment_service = ExperimentService()
experiment_engine = ExperimentEngine()

# Import route handlers
from .routes import *

# Initialize default configurations
DEFAULT_CONFIG = ExperimentConfig(
    id="default",
    title="Default Experiment",
    description="Default thought experiment configuration",
    variables={
        "premise": "",
        "conclusion": ""
    },
    conditions=[
        "logical_consistency",
        "conceptual_clarity"
    ]
)

__all__ = [
    "router",
    "ExperimentConfig",
    "experiment_service",
    "experiment_engine",
    "DEFAULT_CONFIG"
]