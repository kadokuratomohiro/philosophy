from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class ConceptExtraction(BaseModel):
    """
    概念抽出のためのスキーマ
    
    Attributes:
        text (str): 分析対象のテキスト
        max_concepts (int): 抽出する最大概念数
        min_relevance (float): 関連性の最小スコア
    """
    text: str = Field(..., description="分析対象のテキスト")
    max_concepts: Optional[int] = Field(default=10, description="抽出する最大概念数", ge=1, le=50)
    min_relevance: Optional[float] = Field(default=0.5, description="関連性の最小スコア", ge=0.0, le=1.0)

class RelationMap(BaseModel):
    """
    概念間の関係を表すスキーマ
    
    Attributes:
        source_concept (str): 元の概念
        target_concept (str): 関連する概念
        relation_type (str): 関係の種類
        strength (float): 関係の強さ
        context (str): 関係の文脈
    """
    source_concept: str = Field(..., description="元の概念")
    target_concept: str = Field(..., description="関連する概念")
    relation_type: str = Field(..., description="関係の種類")
    strength: float = Field(..., description="関係の強さ", ge=0.0, le=1.0)
    context: Optional[str] = Field(None, description="関係の文脈")

class DefinitionResponse(BaseModel):
    """
    概念の定義レスポンスを表すスキーマ
    
    Attributes:
        concept (str): 概念名
        definition (str): 概念の定義
        examples (List[str]): 概念の例
        related_concepts (List[Dict[str, float]]): 関連する概念とその関連度
        sources (List[str]): 定義のソース
    """
    concept: str = Field(..., description="概念名")
    definition: str = Field(..., description="概念の定義")
    examples: List[str] = Field(default_factory=list, description="概念の例")
    related_concepts: List[Dict[str, float]] = Field(
        default_factory=list,
        description="関連する概念とその関連度"
    )
    sources: List[str] = Field(default_factory=list, description="定義のソース")

    class Config:
        schema_extra = {
            "example": {
                "concept": "論理的思考",
                "definition": "事実や証拠に基づいて合理的に推論を行う思考プロセス",
                "examples": [
                    "三段論法による推論",
                    "因果関係の分析"
                ],
                "related_concepts": [
                    {"批判的思考": 0.85},
                    {"演繹的推論": 0.75}
                ],
                "sources": [
                    "哲学辞典",
                    "論理学入門"
                ]
            }
        }