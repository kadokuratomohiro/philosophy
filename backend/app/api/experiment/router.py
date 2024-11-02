from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..services import experiment_service
from ..schemas import experiment
from ..core.auth import get_current_user

router = APIRouter(
    prefix="/experiments",
    tags=["experiments"]
)

class ExperimentController:
    """思考実験の制御を行うハンドラクラス"""
    
    @router.post("/create", response_model=experiment.ExperimentResponse)
    async def create_experiment(
        exp: experiment.ExperimentCreate,
        current_user = Depends(get_current_user)
    ):
        """新しい思考実験を作成するエンドポイント
        
        Args:
            exp: 作成する思考実験のデータ
            current_user: 認証済みユーザー情報
            
        Returns:
            作成された思考実験の情報
        """
        try:
            result = await experiment_service.create_experiment(exp, current_user.id)
            return result
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"実験の作成に失敗しました: {str(e)}"
            )

    @router.get("/templates", response_model=List[experiment.ExperimentTemplate])
    async def get_templates(
        current_user = Depends(get_current_user)
    ):
        """利用可能な思考実験テンプレートを取得するエンドポイント
        
        Args:
            current_user: 認証済みユーザー情報
            
        Returns:
            テンプレートのリスト
        """
        try:
            templates = await experiment_service.get_experiment_templates()
            return templates
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"テンプレートの取得に失敗しました: {str(e)}"
            )

    @router.put("/{exp_id}", response_model=experiment.ExperimentResponse)
    async def update_experiment(
        exp_id: str,
        exp_update: experiment.ExperimentUpdate,
        current_user = Depends(get_current_user)
    ):
        """既存の思考実験を更新するエンドポイント
        
        Args:
            exp_id: 更新対象の実験ID
            exp_update: 更新データ
            current_user: 認証済みユーザー情報
            
        Returns:
            更新された思考実験の情報
        """
        try:
            # 実験の所有者確認
            experiment = await experiment_service.get_experiment(exp_id)
            if experiment.user_id != current_user.id:
                raise HTTPException(
                    status_code=403,
                    detail="この実験を更新する権限がありません"
                )
                
            updated_exp = await experiment_service.update_experiment(
                exp_id,
                exp_update
            )
            return updated_exp
            
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"実験の更新に失敗しました: {str(e)}"
            )

# ルーターインスタンスの作成
experiment_router = APIRouter()
controller = ExperimentController()

# ルートの登録
experiment_router.include_router(router)