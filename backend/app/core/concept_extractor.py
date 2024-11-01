from typing import List, Dict, Tuple, Set
import spacy
import networkx as nx
from collections import defaultdict
import logging
from dataclasses import dataclass

# ログ設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Concept:
    """概念を表現するデータクラス"""
    name: str
    importance: float
    context: List[str]
    related_concepts: Set[str]

class ConceptExtractor:
    """
    テキストから概念を抽出し、概念間の関係を分析するためのエンジン
    """
    
    def __init__(self):
        """初期化処理"""
        try:
            # spaCyの英語モデルをロード
            self.nlp = spacy.load("en_core_web_sm")
            # 概念グラフの初期化
            self.concept_graph = nx.Graph()
        except Exception as e:
            logger.error(f"Initialization error: {str(e)}")
            raise

    def extract_main_concepts(self, text: str) -> List[Concept]:
        """
        テキストから主要な概念を抽出する
        
        Args:
            text (str): 分析対象のテキスト
            
        Returns:
            List[Concept]: 抽出された概念のリスト
        """
        try:
            # テキストを解析
            doc = self.nlp(text)
            
            # 名詞句と固有表現を抽出
            concepts = defaultdict(lambda: {"count": 0, "context": [], "related": set()})
            
            for chunk in doc.noun_chunks:
                concept_text = chunk.root.text.lower()
                concepts[concept_text]["count"] += 1
                concepts[concept_text]["context"].append(chunk.sent.text)
                
            # 重要度の計算
            total_mentions = sum(c["count"] for c in concepts.values())
            
            return [
                Concept(
                    name=name,
                    importance=data["count"] / total_mentions,
                    context=data["context"],
                    related_concepts=data["related"]
                )
                for name, data in concepts.items()
            ]
            
        except Exception as e:
            logger.error(f"Concept extraction error: {str(e)}")
            return []

    def analyze_relations(self, concepts: List[Concept]) -> List[Tuple[str, str, float]]:
        """
        概念間の関係を分析する
        
        Args:
            concepts (List[Concept]): 分析対象の概念リスト
            
        Returns:
            List[Tuple[str, str, float]]: 関係性のリスト (概念1, 概念2, 関係の強さ)
        """
        try:
            relations = []
            
            # 共起関係に基づく関係分析
            for i, concept1 in enumerate(concepts):
                for concept2 in concepts[i+1:]:
                    # 文脈の重なりを計算
                    context_overlap = len(
                        set(concept1.context) & set(concept2.context)
                    ) / len(set(concept1.context) | set(concept2.context))
                    
                    if context_overlap > 0:
                        relations.append((
                            concept1.name,
                            concept2.name,
                            context_overlap
                        ))
                        
            return relations
            
        except Exception as e:
            logger.error(f"Relation analysis error: {str(e)}")
            return []

    def build_concept_map(self, concepts: List[Concept], relations: List[Tuple[str, str, float]]) -> nx.Graph:
        """
        概念マップを構築する
        
        Args:
            concepts (List[Concept]): 概念リスト
            relations (List[Tuple[str, str, float]]): 関係性リスト
            
        Returns:
            nx.Graph: 概念マップグラフ
        """
        try:
            # グラフの初期化
            self.concept_graph.clear()
            
            # ノードの追加
            for concept in concepts:
                self.concept_graph.add_node(
                    concept.name,
                    importance=concept.importance,
                    context=concept.context
                )
            
            # エッジの追加
            for source, target, weight in relations:
                self.concept_graph.add_edge(
                    source,
                    target,
                    weight=weight
                )
            
            return self.concept_graph
            
        except Exception as e:
            logger.error(f"Concept map building error: {str(e)}")
            return nx.Graph()

    def process_text(self, text: str) -> Tuple[List[Concept], nx.Graph]:
        """
        テキストを処理して概念マップを生成する統合メソッド
        
        Args:
            text (str): 分析対象のテキスト
            
        Returns:
            Tuple[List[Concept], nx.Graph]: 抽出された概念リストと概念マップ
        """
        concepts = self.extract_main_concepts(text)
        relations = self.analyze_relations(concepts)
        concept_map = self.build_concept_map(concepts, relations)
        
        return concepts, concept_map
spacy
networkx
python -m spacy download en_core_web_sm