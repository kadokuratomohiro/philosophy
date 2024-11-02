from typing import List, Dict, Any
import spacy
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import logging
from dataclasses import dataclass

# 必要なNLTKリソースをダウンロード
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

@dataclass
class ConceptNode:
    """概念ノードを表すデータクラス"""
    name: str
    weight: float
    related_concepts: List[str]

class NLPEngine:
    """
    自然言語処理エンジン
    テキストの解析、概念抽出、構造分析を行う
    """

    def __init__(self):
        """NLPエンジンの初期化"""
        try:
            self.nlp = spacy.load('en_core_web_sm')
        except OSError:
            logging.error("Spacyモデルがインストールされていません。")
            raise
        
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))

    def parse_text(self, text: str) -> Dict[str, Any]:
        """
        テキストを解析し、基本的な言語特徴を抽出

        Args:
            text (str): 解析対象のテキスト

        Returns:
            Dict[str, Any]: 解析結果を含む辞書
        """
        doc = self.nlp(text)
        
        return {
            'tokens': [token.text for token in doc],
            'lemmas': [token.lemma_ for token in doc],
            'pos_tags': [token.pos_ for token in doc],
            'entities': [(ent.text, ent.label_) for ent in doc.ents],
            'sentences': [sent.text for sent in doc.sents]
        }

    def extract_concepts(self, text: str) -> List[ConceptNode]:
        """
        テキストから重要な概念を抽出

        Args:
            text (str): 概念を抽出するテキスト

        Returns:
            List[ConceptNode]: 抽出された概念のリスト
        """
        doc = self.nlp(text)
        concepts = []
        
        # 名詞句と固有表現を抽出
        noun_phrases = [chunk.text for chunk in doc.noun_chunks]
        entities = [ent.text for ent in doc.ents]
        
        # 重要度計算とコンセプトノード作成
        concept_weights = {}
        for phrase in set(noun_phrases + entities):
            # 重要度を計算（出現頻度とテキスト長を考慮）
            weight = text.count(phrase) * len(phrase.split())
            related = self._find_related_concepts(phrase, doc)
            concepts.append(ConceptNode(
                name=phrase,
                weight=weight,
                related_concepts=related
            ))
        
        return sorted(concepts, key=lambda x: x.weight, reverse=True)

    def analyze_structure(self, text: str) -> Dict[str, Any]:
        """
        テキストの論理構造を分析

        Args:
            text (str): 分析対象のテキスト

        Returns:
            Dict[str, Any]: 構造分析結果
        """
        doc = self.nlp(text)
        
        structure = {
            'main_verbs': [],
            'subjects': [],
            'objects': [],
            'clauses': [],
            'logical_connectors': []
        }
        
        for sent in doc.sents:
            clause = {}
            for token in sent:
                if token.dep_ == 'ROOT':
                    structure['main_verbs'].append(token.text)
                elif token.dep_ == 'nsubj':
                    structure['subjects'].append(token.text)
                elif token.dep_ in ['dobj', 'pobj']:
                    structure['objects'].append(token.text)
                elif token.dep_ == 'mark' and token.text.lower() in ['if', 'then', 'because', 'therefore']:
                    structure['logical_connectors'].append(token.text)
            
            structure['clauses'].append(str(sent))

        return structure

    def _find_related_concepts(self, concept: str, doc: spacy.tokens.Doc) -> List[str]:
        """
        特定の概念に関連する他の概念を見つける

        Args:
            concept (str): 対象概念
            doc (spacy.tokens.Doc): 解析済みドキュメント

        Returns:
            List[str]: 関連概念のリスト
        """
        related = []
        concept_doc = self.nlp(concept)
        
        for token in doc:
            if token.text not in concept and \
               token.pos_ in ['NOUN', 'PROPN'] and \
               token.similarity(concept_doc) > 0.5:
                related.append(token.text)
        
        return list(set(related))[:5]  # 上位5件まで
