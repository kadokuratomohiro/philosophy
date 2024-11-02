from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class Template(BaseModel):
    """思考実験のテンプレートを定義するモデル"""
    id: str = Field(..., description="テンプレートの一意識別子")
    name: str = Field(..., description="テンプレート名")
    description: str = Field(..., description="テンプレートの説明")
    structure: dict = Field(..., description="実験の構造を定義するスキーマ")
    variables: List[dict] = Field(default_factory=list, description="カスタマイズ可能な変数のリスト")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        schema_extra = {
            "example": {
                "id": "trolley-problem",
                "name": "トロッリー問題",
                "description": "倫理的なジレンマを探求する古典的な思考実験",
                "structure": {
                    "scenario": "template",
                    "questions": ["ethical_choice", "justification"],
                    "variables": ["num_people", "context"]
                },
                "variables": [
                    {"name": "num_people", "type": "integer", "default": 5},
                    {"name": "context", "type": "string", "default": "通常の線路"}
                ]
            }
        }

class Result(BaseModel):
    """思考実験の結果を記録するモデル"""
    id: str = Field(..., description="結果の一意識別子")
    experiment_id: str = Field(..., description="関連する実験のID")
    responses: dict = Field(..., description="実験への回答データ")
    analysis: Optional[dict] = Field(None, description="結果の分析データ")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict = Field(default_factory=dict, description="追加のメタデータ")

    class Config:
        schema_extra = {
            "example": {
                "id": "result-123",
                "experiment_id": "exp-456",
                "responses": {
                    "ethical_choice": "レバーを引く",
                    "justification": "より多くの命を救うため"
                },
                "analysis": {
                    "ethical_framework": "功利主義的",
                    "key_concepts": ["倫理", "責任", "結果主義"]
                }
            }
        }

class Experiment(BaseModel):
    """思考実験を定義するメインモデル"""
    id: str = Field(..., description="実験の一意識別子")
    title: str = Field(..., description="実験のタイトル")
    description: str = Field(..., description="実験の詳細な説明")
    template_id: Optional[str] = Field(None, description="使用するテンプレートのID")
    configuration: dict = Field(..., description="実験の設定と変数")
    status: str = Field(default="draft", description="実験のステータス")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    results: List[Result] = Field(default_factory=list, description="実験の結果リスト")
    
    class Config:
        schema_extra = {
            "example": {
                "id": "exp-456",
                "title": "現代版トロッリー問題",
                "description": "自動運転車のエッジケースにおける倫理的判断",
                "template_id": "trolley-problem",
                "configuration": {
                    "num_people": 3,
                    "context": "自動運転車のシナリオ"
                },
                "status": "active"
            }
        }

    def add_result(self, result: Result):
        """実験結果を追加するメソッド"""
        self.results.append(result)
        self.updated_at = datetime.utcnow()

    def analyze_results(self) -> dict:
        """実験結果の分析を行うメソッド"""
        # 基本的な統計分析を実装
        analysis = {
            "total_responses": len(self.results),
            "response_summary": {},
            "patterns": [],
            "timestamp": datetime.utcnow()
        }
        return analysis