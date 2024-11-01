from fastapi import APIRouter
from typing import Dict, Any, Optional
from pydantic import BaseModel
from enum import Enum

# Core dependencies
from app.core.graph_generator import GraphGenerator
from app.core.layout_engine import LayoutEngine

# Initialize router
router = APIRouter()

class RendererType(Enum):
    """サポートされるレンダラータイプの定義"""
    D3 = "d3"
    PLOTLY = "plotly"
    NETWORKX = "networkx"
    CUSTOM = "custom"

class LayoutType(Enum):
    """サポートされるレイアウトタイプの定義"""
    FORCE_DIRECTED = "force_directed"
    HIERARCHICAL = "hierarchical"
    CIRCULAR = "circular"
    GRID = "grid"

class VisualizationConfig(BaseModel):
    """可視化設定を管理するクラス"""
    renderer: RendererType
    layout: LayoutType
    width: int = 800
    height: int = 600
    theme: str = "light"
    animation_enabled: bool = True
    interactive: bool = True
    custom_settings: Optional[Dict[str, Any]] = None

    class Config:
        use_enum_values = True

def setup_renderers() -> Dict[str, Any]:
    """
    レンダラーの設定を初期化する
    
    Returns:
        Dict[str, Any]: 設定されたレンダラーの設定
    """
    renderers = {
        RendererType.D3.value: {
            "module": "d3",
            "settings": {
                "transitions": True,
                "responsiveness": True
            }
        },
        RendererType.PLOTLY.value: {
            "module": "plotly",
            "settings": {
                "mode": "markers+lines",
                "responsive": True
            }
        },
        RendererType.NETWORKX.value: {
            "module": "networkx",
            "settings": {
                "node_color": "#1f77b4",
                "edge_color": "#7f7f7f"
            }
        }
    }
    return renderers

def configure_layouts() -> Dict[str, Any]:
    """
    レイアウトエンジンの設定を初期化する
    
    Returns:
        Dict[str, Any]: 設定されたレイアウトの設定
    """
    layouts = {
        LayoutType.FORCE_DIRECTED.value: {
            "algorithm": "force_directed",
            "parameters": {
                "charge": -30,
                "link_distance": 100,
                "gravity": 0.1
            }
        },
        LayoutType.HIERARCHICAL.value: {
            "algorithm": "dagre",
            "parameters": {
                "rankdir": "TB",
                "align": "UL",
                "ranksep": 50
            }
        },
        LayoutType.CIRCULAR.value: {
            "algorithm": "circular",
            "parameters": {
                "radius": None,
                "start_angle": 0,
                "end_angle": 2 * 3.14159
            }
        },
        LayoutType.GRID.value: {
            "algorithm": "grid",
            "parameters": {
                "width": None,
                "height": None
            }
        }
    }
    return layouts

# Default configuration
default_config = VisualizationConfig(
    renderer=RendererType.D3,
    layout=LayoutType.FORCE_DIRECTED,
    width=1024,
    height=768,
    theme="light",
    animation_enabled=True,
    interactive=True
)

# Initialize renderers and layouts
renderers = setup_renderers()
layouts = configure_layouts()

# Export configuration
__all__ = [
    "router",
    "VisualizationConfig",
    "RendererType",
    "LayoutType",
    "setup_renderers",
    "configure_layouts",
    "default_config"
]