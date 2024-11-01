from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.services import proposition_service
from app.schemas.proposition import (
    PropositionAnalysis,
    PropositionHistory,
    PropositionValidation,
    ThoughtExperiment,
    PropositionCreate
)
from app.core.auth import get_current_user
from app.schemas.user import User

router = APIRouter(prefix="/propositions", tags=["propositions"])

class PropositionController:
    def __init__(self, service: proposition_service.PropositionService):
        self.service = service

@router.post("/analyze", response_model=PropositionAnalysis)
async def analyze_proposition(
    proposition: PropositionCreate,
    current_user: User = Depends(get_current_user),
    controller: PropositionController = Depends()
):
    """
    命題のテキストを分析し、論理構造、概念マップ、妥当性を評価します。
    """
    try:
        analysis = await controller.service.analyze(
            text=proposition.text,
            user_id=current_user.id
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/history", response_model=List[PropositionHistory])
async def get_history(
    current_user: User = Depends(get_current_user),
    controller: PropositionController = Depends()
):
    """
    ユーザーの命題分析履歴を取得します。
    """
    try:
        history = await controller.service.get_user_history(user_id=current_user.id)
        return history
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/validate/{proposition_id}", response_model=PropositionValidation)
async def validate_logic(
    proposition_id: str,
    current_user: User = Depends(get_current_user),
    controller: PropositionController = Depends()
):
    """
    特定の命題の論理的妥当性を検証します。
    """
    try:
        validation = await controller.service.validate_proposition(
            proposition_id=proposition_id,
            user_id=current_user.id
        )
        return validation
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/experiments/{proposition_id}", response_model=ThoughtExperiment)
async def generate_experiment(
    proposition_id: str,
    current_user: User = Depends(get_current_user),
    controller: PropositionController = Depends()
):
    """
    命題に基づいて思考実験を生成します。
    """
    try:
        experiment = await controller.service.generate_thought_experiment(
            proposition_id=proposition_id,
            user_id=current_user.id
        )
        return experiment
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Rate limiting middleware
from app.core.rate_limit import rate_limit
router.dependencies.append(Depends(rate_limit))

# Error handling middleware
@router.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return {
        "status": "error",
        "message": str(exc),
        "details": exc.__class__.__name__
    }