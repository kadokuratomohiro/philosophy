from fastapi import APIRouter, HTTPException
from typing import Dict, List, Optional
import json
import os

from app.core.nlp_engine import NLPEngine
from app.core.logic_analyzer import LogicAnalyzer

# APIルーター初期化
router = APIRouter()

class PropositionConfig:
    """命題解析の設定を管理するクラス"""
    
    def __init__(self):
        self.nlp_engine: Optional[NLPEngine] = None
        self.logic_analyzer: Optional[LogicAnalyzer] = None
        self.concepts_db: Dict = {}
        self.validation_rules: List[Dict] = []
        
    def initialize(self, 
                  nlp_config_path: str = "config/nlp_config.json",
                  concepts_path: str = "data/concepts.json"):
        """設定の初期化"""
        self.nlp_engine = NLPEngine()
        self.logic_analyzer = LogicAnalyzer()
        self.concepts_db = self.load_concepts(concepts_path)
        self._load_validation_rules()

    def _load_validation_rules(self):
        """バリデーションルールの読み込み"""
        rules_path = "config/validation_rules.json"
        if os.path.exists(rules_path):
            with open(rules_path, 'r') as f:
                self.validation_rules = json.load(f)

# グローバル設定インスタンス
config = PropositionConfig()

def load_concepts(concepts_path: str = "data/concepts.json") -> Dict:
    """
    概念データベースを読み込む
    
    Args:
        concepts_path: 概念データベースのパス
        
    Returns:
        Dict: 読み込まれた概念データ
        
    Raises:
        FileNotFoundError: データベースファイルが存在しない場合
    """
    try:
        with open(concepts_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def validate_input(proposition: str) -> bool:
    """
    入力された命題の検証
    
    Args:
        proposition: 検証する命題文字列
        
    Returns:
        bool: 検証結果
        
    Raises:
        HTTPException: 入力が無効な場合
    """
    if not proposition or len(proposition.strip()) == 0:
        raise HTTPException(
            status_code=400,
            detail="Empty proposition is not allowed"
        )
    
    if len(proposition) > 1000:
        raise HTTPException(
            status_code=400,
            detail="Proposition too long (max 1000 characters)"
        )
    
    # 基本的な文字列検証
    invalid_chars = set('<>{}[]\\')
    if any(char in proposition for char in invalid_chars):
        raise HTTPException(
            status_code=400,
            detail="Proposition contains invalid characters"
        )
    
    return True

# 初期化時に設定を読み込む
config.initialize()

# エクスポートするオブジェクト
__all__ = ['router', 'config', 'load_concepts', 'validate_input']