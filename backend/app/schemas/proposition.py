from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class PropositionInput(BaseModel):
    """命題入力のスキーマ定義"""
    text: str = Field(..., description="命題のテキスト", min_length=1)
    concepts: List[str] = Field(default=[], description="関連する概念のリスト")
    context: Optional[str] = Field(None, description="命題の文脈")

    class Config:
        schema_extra = {
            "example": {
                "text": "すべての人間は死すべき存在である。ソクラテスは人間である。したがって、ソクラテスは死すべき存在である。",
                "concepts": ["人間", "死", "ソクラテス"],
                "context": "三段論法の例"
            }
        }

class LogicalStructure(BaseModel):
    """論理構造の分析結果"""
    premises: List[str] = Field(..., description="前提となる命題")
    conclusion: str = Field(..., description="結論")
    structure_type: str = Field(..., description="論理構造の種類")
    valid_form: bool = Field(..., description="論理形式の妥当性")

class AnalysisResult(BaseModel):
    """命題分析の結果スキーマ"""
    id: str = Field(..., description="分析結果のユニークID")
    original_text: str = Field(..., description="元の命題テキスト")
    logical_structure: LogicalStructure
    identified_concepts: List[str] = Field(..., description="抽出された概念")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    confidence_score: float = Field(..., ge=0, le=1, description="分析の信頼度スコア")

class ValidationError(BaseModel):
    """バリデーションエラーの詳細"""
    error_type: str
    description: str
    location: Optional[str] = None

class ValidationResponse(BaseModel):
    """論理的妥当性の検証結果スキーマ"""
    is_valid: bool = Field(..., description="論理的に妥当かどうか")
    reasoning: str = Field(..., description="妥当性の説明")
    errors: List[ValidationError] = Field(default=[], description="検出された論理エラー")
    suggestions: List[str] = Field(default=[], description="改善のための提案")
    
    class Config:
        schema_extra = {
            "example": {
                "is_valid": True,
                "reasoning": "三段論法の形式が正しく、前提から結論が必然的に導かれる",
                "errors": [],
                "suggestions": ["より具体的な例を追加することで説得力が増す可能性があります"]
            }
        }