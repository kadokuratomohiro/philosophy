from typing import List, Optional
from pydantic import BaseModel, Field

class LogicalStructure(BaseModel):
    """論理構造を表すスキーマ"""
    subject: str = Field(..., description="命題の主語")
    predicate: str = Field(..., description="命題の述語")
    modifiers: List[str] = Field(default_factory=list, description="修飾語のリスト")
    relations: List[str] = Field(default_factory=list, description="関係性のリスト")

class Concept(BaseModel):
    """概念を表すスキーマ"""
    id: str = Field(..., description="概念の一意識別子")
    name: str = Field(..., description="概念の名称")
    definition: str = Field(..., description="概念の定義")
    related_concepts: List[str] = Field(default_factory=list, description="関連する概念のIDリスト")
    user_defined: bool = Field(default=False, description="ユーザー定義の概念かどうか")

class Issue(BaseModel):
    """問題点を表すスキーマ"""
    type: str = Field(..., description="問題の種類")
    description: str = Field(..., description="問題の説明")
    severity: str = Field(..., description="問題の重要度")

class ValidationResult(BaseModel):
    """妥当性検証結果を表すスキーマ"""
    is_valid: bool = Field(..., description="妥当性の判定結果")
    issues: List[Issue] = Field(default_factory=list, description="検出された問題点のリスト")
    suggestions: List[str] = Field(default_factory=list, description="改善提案のリスト")

class PropositionInput(BaseModel):
    """命題入力用のスキーマ"""
    text: str = Field(..., min_length=1, description="命題のテキスト")
    context: Optional[str] = Field(None, description="命題の文脈情報")
    language: str = Field(default="en", description="命題の言語")

class AnalysisResponse(BaseModel):
    """分析結果を表すスキーマ"""
    id: str = Field(..., description="分析結果の一意識別子")
    original_text: str = Field(..., description="元の命題テキスト")
    structure: LogicalStructure = Field(..., description="論理構造の分析結果")
    concepts: List[Concept] = Field(default_factory=list, description="抽出された概念のリスト")
    validity: ValidationResult = Field(..., description="妥当性検証の結果")
    timestamp: str = Field(..., description="分析実行時のタイムスタンプ")

    class Config:
        schema_extra = {
            "example": {
                "id": "analysis_123",
                "original_text": "All humans are mortal",
                "structure": {
                    "subject": "humans",
                    "predicate": "mortal",
                    "modifiers": ["all"],
                    "relations": ["are"]
                },
                "concepts": [
                    {
                        "id": "concept_1",
                        "name": "human",
                        "definition": "A member of the species Homo sapiens",
                        "related_concepts": ["mortality"],
                        "user_defined": False
                    }
                ],
                "validity": {
                    "is_valid": True,
                    "issues": [],
                    "suggestions": []
                },
                "timestamp": "2024-11-03T00:39:00Z"
            }
        }