from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID, uuid4

class Node(BaseModel):
    """ノードモデル - グラフの頂点を表現"""
    id: UUID = Field(default_factory=uuid4)
    label: str
    type: str = "default"
    properties: Dict[str, Any] = Field(default_factory=dict)
    position: Dict[str, float] = Field(
        default_factory=lambda: {"x": 0.0, "y": 0.0}
    )
    style: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        arbitrary_types_allowed = True

class Edge(BaseModel):
    """エッジモデル - ノード間の関係を表現"""
    id: UUID = Field(default_factory=uuid4)
    source: UUID
    target: UUID
    label: Optional[str] = None
    type: str = "default"
    properties: Dict[str, Any] = Field(default_factory=dict)
    style: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        arbitrary_types_allowed = True

class Graph(BaseModel):
    """グラフモデル - ノードとエッジの集合を表現"""
    id: UUID = Field(default_factory=uuid4)
    name: str
    description: Optional[str] = None
    nodes: List[Node] = Field(default_factory=list)
    edges: List[Edge] = Field(default_factory=list)
    properties: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        arbitrary_types_allowed = True

    def add_node(self, node: Node) -> None:
        """グラフにノードを追加"""
        self.nodes.append(node)
        self.updated_at = datetime.utcnow()

    def add_edge(self, edge: Edge) -> None:
        """グラフにエッジを追加"""
        # エッジのsourceとtargetが存在するか確認
        if not any(n.id == edge.source for n in self.nodes) or \
           not any(n.id == edge.target for n in self.nodes):
            raise ValueError("Source or target node does not exist in the graph")
        
        self.edges.append(edge)
        self.updated_at = datetime.utcnow()

    def remove_node(self, node_id: UUID) -> None:
        """グラフからノードを削除（関連するエッジも削除）"""
        self.nodes = [n for n in self.nodes if n.id != node_id]
        self.edges = [e for e in self.edges 
                     if e.source != node_id and e.target != node_id]
        self.updated_at = datetime.utcnow()

    def remove_edge(self, edge_id: UUID) -> None:
        """グラフからエッジを削除"""
        self.edges = [e for e in self.edges if e.id != edge_id]
        self.updated_at = datetime.utcnow()

    def get_node(self, node_id: UUID) -> Optional[Node]:
        """指定されたIDのノードを取得"""
        return next((n for n in self.nodes if n.id == node_id), None)

    def get_edge(self, edge_id: UUID) -> Optional[Edge]:
        """指定されたIDのエッジを取得"""
        return next((e for e in self.edges if e.id == edge_id), None)