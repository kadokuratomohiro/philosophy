from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.services.concept_service import ConceptService
from app.schemas.concept import (
    Concept,
    ConceptMap,
    Definition,
    ConceptExtractRequest,
    ConceptExtractResponse
)

router = APIRouter(
    prefix="/concepts",
    tags=["concepts"]
)

class ConceptController:
    def __init__(self, concept_service: ConceptService = Depends()):
        self.concept_service = concept_service

    async def extract_concepts(self, text: str) -> List[Concept]:
        """
        テキストから概念を抽出する
        
        Args:
            text (str): 分析対象のテキスト
            
        Returns:
            List[Concept]: 抽出された概念のリスト
        
        Raises:
            HTTPException: 概念抽出に失敗した場合
        """
        try:
            return await self.concept_service.extract_concepts(text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_relations(self, concept_id: str) -> ConceptMap:
        """
        指定された概念の関連マップを取得する
        
        Args:
            concept_id (str): 概念ID
            
        Returns:
            ConceptMap: 概念の関連マップ
        
        Raises:
            HTTPException: 関連マップの取得に失敗した場合
        """
        try:
            return await self.concept_service.get_concept_relations(concept_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_definition(self, concept_id: str) -> Definition:
        """
        指定された概念の定義を取得する
        
        Args:
            concept_id (str): 概念ID
            
        Returns:
            Definition: 概念の定義情報
            
        Raises:
            HTTPException: 定義の取得に失敗した場合
        """
        try:
            return await self.concept_service.get_concept_definition(concept_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ルートハンドラーの定義
@router.post("/extract", response_model=ConceptExtractResponse)
async def extract_concepts(
    request: ConceptExtractRequest,
    controller: ConceptController = Depends()
):
    """テキストから概念を抽出するエンドポイント"""
    concepts = await controller.extract_concepts(request.text)
    return ConceptExtractResponse(concepts=concepts)

@router.get("/relations/{concept_id}", response_model=ConceptMap)
async def get_relations(
    concept_id: str,
    controller: ConceptController = Depends()
):
    """概念の関連マップを取得するエンドポイント"""
    return await controller.get_relations(concept_id)

@router.get("/definition/{concept_id}", response_model=Definition)
async def get_definition(
    concept_id: str,
    controller: ConceptController = Depends()
):
    """概念の定義を取得するエンドポイント"""
    return await controller.get_definition(concept_id)