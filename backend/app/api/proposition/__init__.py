"""
Proposition API initialization module.
Handles the configuration and setup of NLP and logic analysis components.
"""

from fastapi import APIRouter
from typing import Optional
import logging
from dataclasses import dataclass

# Import core dependencies
from app.core.nlp_engine import NLPEngine
from app.core.logic_analyzer import LogicAnalyzer

# Initialize router
router = APIRouter(prefix="/api/proposition", tags=["proposition"])

@dataclass
class PropositionConfig:
    """Configuration class for proposition analysis settings."""
    nlp_model_name: str = "en_core_web_lg"
    logic_rules_path: str = "app/config/logic_rules.yaml"
    max_token_length: int = 1000
    confidence_threshold: float = 0.85
    enable_cache: bool = True
    cache_ttl: int = 3600  # 1 hour

    def validate(self) -> bool:
        """Validate configuration settings."""
        return (
            self.max_token_length > 0 and
            0 < self.confidence_threshold <= 1 and
            self.cache_ttl > 0
        )

# Global instances
_nlp_engine: Optional[NLPEngine] = None
_logic_analyzer: Optional[LogicAnalyzer] = None
_config: Optional[PropositionConfig] = None

async def initialize_nlp() -> None:
    """
    Initialize NLP engine with configured settings.
    Should be called during application startup.
    """
    global _nlp_engine, _config
    
    try:
        _config = PropositionConfig()
        if not _config.validate():
            raise ValueError("Invalid proposition configuration")
            
        _nlp_engine = NLPEngine(
            model_name=_config.nlp_model_name,
            max_length=_config.max_token_length
        )
        await _nlp_engine.initialize()
        
        logging.info("NLP engine initialized successfully")
    except Exception as e:
        logging.error(f"Failed to initialize NLP engine: {str(e)}")
        raise

async def setup_analyzers() -> None:
    """
    Set up logic analyzers and related components.
    Should be called after NLP initialization.
    """
    global _logic_analyzer, _nlp_engine, _config
    
    if not _nlp_engine:
        raise RuntimeError("NLP engine must be initialized first")
        
    try:
        _logic_analyzer = LogicAnalyzer(
            nlp_engine=_nlp_engine,
            rules_path=_config.logic_rules_path,
            confidence_threshold=_config.confidence_threshold
        )
        await _logic_analyzer.setup()
        
        if _config.enable_cache:
            _logic_analyzer.enable_caching(ttl=_config.cache_ttl)
            
        logging.info("Logic analyzers setup completed")
    except Exception as e:
        logging.error(f"Failed to setup logic analyzers: {str(e)}")
        raise

# Export necessary components
__all__ = [
    "router",
    "PropositionConfig",
    "initialize_nlp",
    "setup_analyzers"
]
