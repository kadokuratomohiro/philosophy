from datetime import datetime
from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class LogicStructure(BaseModel):
    """論理構造を表現するモデル"""
    type: str = Field(..., description="論理構造の種類（演繹、帰納、アブダクション等）")
    premises: List[str] = Field(default_factory=list, description="前提となる命題のリスト")
    conclusion: str = Field(..., description="結論となる命題")
    connections: List[Dict[str, str]] = Field(
        default_factory=list, 
        description="命題間の論理的つながりを表現する辞書のリスト"
    )
    validity_score: float = Field(
        default=0.0, 
        ge=0.0, 
        le=1.0, 
        description="論理構造の妥当性スコア（0.0〜1.0）"
    )

class Analysis(BaseModel):
    """命題の分析結果を表現するモデル"""
    key_concepts: List[str] = Field(default_factory=list, description="抽出された主要概念")
    logical_fallacies: List[Dict[str, str]] = Field(
        default_factory=list, 
        description="検出された論理的誤謬"
    )
    strength_score: float = Field(
        default=0.0, 
        ge=0.0, 
        le=1.0, 
        description="議論の強さを示すスコア"
    )
    suggestions: List[str] = Field(
        default_factory=list, 
        description="改善のための提案"
    )
    counter_arguments: List[str] = Field(
        default_factory=list, 
        description="可能な反論"
    )

class Proposition(BaseModel):
    """命題を表現するメインモデル"""
    id: str = Field(..., description="命題の一意識別子")
    text: str = Field(..., description="命題の本文")
    concepts: List[str] = Field(default_factory=list, description="関連する概念のリスト")
    structure: Optional[LogicStructure] = Field(None, description="命題の論理構造")
    analysis: Optional[Analysis] = Field(None, description="命題の分析結果")
    source: Optional[str] = Field(None, description="命題の出典")
    author: Optional[str] = Field(None, description="命題の作成者")
    created_at: datetime = Field(default_factory=datetime.now, description="作成日時")
    updated_at: datetime = Field(default_factory=datetime.now, description="更新日時")
    tags: List[str] = Field(default_factory=list, description="分類タグ")
    
    class Config:
        schema_extra = {
            "example": {
                "id": "prop_001",
                "text": "すべての人間は死ぬ。ソクラテスは人間である。したがって、ソクラテスは死ぬ。",
                "concepts": ["人間", "死", "ソクラテス"],
                "structure": {
                    "type": "演繹",
                    "premises": [
                        "すべての人間は死ぬ",
                        "ソクラテスは人間である"
                    ],
                    "conclusion": "ソクラテスは死ぬ",
                    "connections": [
                        {"type": "含意", "from": "premise1", "to": "conclusion"}
                    ],
                    "validity_score": 1.0
                }
            }
        }