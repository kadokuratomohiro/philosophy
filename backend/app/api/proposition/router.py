from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.services.proposition_service import PropositionService
from app.schemas.proposition import (
    PropositionAnalysis,
    Concept,
    ValidationResult,
    PropositionRequest,
    ValidationRequest
)

router = APIRouter(prefix="/proposition", tags=["proposition"])

class PropositionController:
    def __init__(self, proposition_service: PropositionService = Depends(PropositionService)):
        self.proposition_service = proposition_service

    async def analyze_proposition(self, text: str) -> PropositionAnalysis:
        """
        命題のテキストを解析し、論理構造を抽出する
        
        Args:
            text (str): 解析する命題のテキスト
            
        Returns:
            PropositionAnalysis: 解析結果を含むオブジェクト
        """
        try:
            return await self.proposition_service.analyze(text)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def get_concepts(self) -> List[Concept]:
        """
        システムに登録されている全ての概念を取得する
        
        Returns:
            List[Concept]: 概念のリスト
        """
        try:
            return await self.proposition_service.get_all_concepts()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def validate_logic(self, analysis: PropositionAnalysis) -> ValidationResult:
        """
        命題の論理的妥当性を検証する
        
        Args:
            analysis (PropositionAnalysis): 検証する命題の解析結果
            
        Returns:
            ValidationResult: 検証結果を含むオブジェクト
        """
        try:
            return await self.proposition_service.validate(analysis)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

# ルートの定義
@router.post("/analyze", response_model=PropositionAnalysis)
async def analyze_proposition_route(
    request: PropositionRequest,
    controller: PropositionController = Depends()
) -> PropositionAnalysis:
    """
    命題解析エンドポイント
    """
    return await controller.analyze_proposition(request.text)

@router.get("/concepts", response_model=List[Concept])
async def get_concepts_route(
    controller: PropositionController = Depends()
) -> List[Concept]:
    """
    概念取得エンドポイント
    """
    return await controller.get_concepts()

@router.post("/validate", response_model=ValidationResult)
async def validate_logic_route(
    request: ValidationRequest,
    controller: PropositionController = Depends()
) -> ValidationResult:
    """
    論理検証エンドポイント
    """
    return await controller.validate_logic(request.analysis)
