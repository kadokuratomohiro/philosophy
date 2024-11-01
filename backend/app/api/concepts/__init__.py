"""
概念分析APIの初期化モジュール
依存関係:
- core.concept_extractor
- core.knowledge_base
"""

from fastapi import APIRouter
from typing import Dict, List, Optional
from pydantic import BaseModel
import logging
from pathlib import Path

from ..core.concept_extractor import ConceptExtractor
from ..core.knowledge_base import KnowledgeBase

# ルーターの初期化
router = APIRouter(prefix="/concepts", tags=["concepts"])

class ConceptConfig(BaseModel):
    """概念設定管理クラス"""
    ontology_path: Path
    extraction_methods: List[str]
    threshold: float
    language: str = "ja"
    max_concepts: int = 100
    
    class Config:
        arbitrary_types_allowed = True

# グローバル変数
_concept_extractor: Optional[ConceptExtractor] = None
_knowledge_base: Optional[KnowledgeBase] = None
_config: Optional[ConceptConfig] = None

async def load_ontology() -> bool:
    """
    オントロジーデータの読み込み
    
    Returns:
        bool: 読み込み成功の場合True
    """
    try:
        if not _config or not _knowledge_base:
            return False
            
        await _knowledge_base.load_ontology(_config.ontology_path)
        logging.info(f"Ontology loaded from {_config.ontology_path}")
        return True
    except Exception as e:
        logging.error(f"Failed to load ontology: {str(e)}")
        return False

async def setup_extractors(config: ConceptConfig) -> bool:
    """
    概念抽出器の設定

    Args:
        config (ConceptConfig): 設定オブジェクト

    Returns:
        bool: 設定成功の場合True
    """
    global _concept_extractor, _knowledge_base, _config
    
    try:
        _config = config
        _knowledge_base = KnowledgeBase()
        _concept_extractor = ConceptExtractor(
            methods=config.extraction_methods,
            threshold=config.threshold,
            language=config.language,
            max_concepts=config.max_concepts
        )
        
        success = await load_ontology()
        if success:
            _concept_extractor.set_knowledge_base(_knowledge_base)
            logging.info("Concept extractors setup completed")
            return True
        return False
    except Exception as e:
        logging.error(f"Failed to setup extractors: {str(e)}")
        return False

# APIエンドポイントのインポート
from .routes import *

__all__ = [
    "router",
    "ConceptConfig",
    "load_ontology",
    "setup_extractors"
]