from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class ExperimentCreate(BaseModel):
    """思考実験作成用のスキーマ"""
    title: str = Field(..., min_length=1, max_length=200, description="実験のタイトル")
    description: str = Field(..., min_length=1, max_length=2000, description="実験の説明")
    hypothesis: str = Field(..., min_length=1, max_length=1000, description="実験の仮説")
    variables: List[str] = Field(default=[], description="実験で考慮する変数")
    assumptions: List[str] = Field(default=[], description="実験の前提条件")
    tags: List[str] = Field(default=[], description="実験に関連するタグ")

    class Config:
        schema_extra = {
            "example": {
                "title": "トロッコ問題",
                "description": "道徳的ジレンマに関する思考実験",
                "hypothesis": "功利主義的判断と義務論的判断の対立",
                "variables": ["人数", "直接性", "意図"],
                "assumptions": ["全ての人命は等価である", "他の選択肢は存在しない"],
                "tags": ["倫理学", "道徳", "功利主義"]
            }
        }

class ExperimentResponse(BaseModel):
    """思考実験結果用のスキーマ"""
    id: UUID
    title: str
    description: str
    hypothesis: str
    variables: List[str]
    assumptions: List[str]
    tags: List[str]
    conclusions: List[str] = Field(default=[], description="実験から導き出された結論")
    implications: List[str] = Field(default=[], description="実験の含意")
    created_at: datetime
    updated_at: datetime
    author_id: Optional[UUID] = None
    is_published: bool = False
    
    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "title": "トロッコ問題",
                "description": "道徳的ジレンマに関する思考実験",
                "hypothesis": "功利主義的判断と義務論的判断の対立",
                "variables": ["人数", "直接性", "意図"],
                "assumptions": ["全ての人命は等価である", "他の選択肢は存在しない"],
                "tags": ["倫理学", "道徳", "功利主義"],
                "conclusions": ["状況依存的な道徳判断の存在", "直接性が道徳判断に影響を与える"],
                "implications": ["道徳的直観の限界", "規範倫理学の複雑性"],
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00",
                "author_id": "123e4567-e89b-12d3-a456-426614174000",
                "is_published": True
            }
        }

class ExperimentUpdate(BaseModel):
    """思考実験更新用のスキーマ"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1, max_length=2000)
    hypothesis: Optional[str] = Field(None, min_length=1, max_length=1000)
    variables: Optional[List[str]] = None
    assumptions: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    conclusions: Optional[List[str]] = None
    implications: Optional[List[str]] = None
    is_published: Optional[bool] = None