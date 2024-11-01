from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from pydantic import BaseModel
from app.services import visualization_service
from app.schemas import visualization
from app.core.security import get_current_user
from fastapi.responses import FileResponse
import logging

router = APIRouter(prefix="/visualize", tags=["visualization"])
logger = logging.getLogger(__name__)

class VisualizationController:
    def __init__(self, visualization_service=visualization_service):
        self.visualization_service = visualization_service

    async def create_logic_tree(self, analysis_id: str, current_user: dict):
        """
        論理ツリーの可視化を生成する
        """
        try:
            graph = await self.visualization_service.generate_logic_tree(
                analysis_id=analysis_id,
                user_id=current_user["id"]
            )
            return visualization.GraphResponse(
                id=str(graph.id),
                nodes=graph.nodes,
                edges=graph.edges,
                layout=graph.layout
            )
        except Exception as e:
            logger.error(f"Logic tree generation failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate logic tree visualization"
            )

    async def create_concept_map(self, concepts: List[str], current_user: dict):
        """
        概念マップの可視化を生成する
        """
        try:
            graph = await self.visualization_service.generate_concept_map(
                concepts=concepts,
                user_id=current_user["id"]
            )
            return visualization.GraphResponse(
                id=str(graph.id),
                nodes=graph.nodes,
                edges=graph.edges,
                layout=graph.layout
            )
        except Exception as e:
            logger.error(f"Concept map generation failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate concept map visualization"
            )

    async def export_visualization(self, viz_id: str, format: str, current_user: dict):
        """
        可視化をエクスポートする
        """
        try:
            file_path = await self.visualization_service.export_graph(
                viz_id=viz_id,
                format=format,
                user_id=current_user["id"]
            )
            return FileResponse(
                path=file_path,
                filename=f"visualization.{format}",
                media_type=f"image/{format}"
            )
        except Exception as e:
            logger.error(f"Visualization export failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to export visualization"
            )

controller = VisualizationController()

@router.post("/logic-tree", response_model=visualization.GraphResponse)
async def create_logic_tree(
    request: visualization.LogicTreeRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    論理ツリーの可視化エンドポイント
    """
    return await controller.create_logic_tree(request.analysis_id, current_user)

@router.post("/concept-map", response_model=visualization.GraphResponse)
async def create_concept_map(
    request: visualization.ConceptMapRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    概念マップの可視化エンドポイント
    """
    return await controller.create_concept_map(request.concepts, current_user)

@router.get("/export/{viz_id}")
async def export_visualization(
    viz_id: str,
    format: str = "png",
    current_user: dict = Depends(get_current_user)
):
    """
    可視化のエクスポートエンドポイント
    """
    if format not in ["png", "svg", "pdf"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported export format"
        )
    return await controller.export_visualization(viz_id, format, current_user)