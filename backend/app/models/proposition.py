from sqlalchemy import Column, String, Boolean, JSON, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from typing import List, Optional
from datetime import datetime
import uuid

Base = declarative_base()

# 命題と概念の中間テーブル
proposition_concept = Table(
    'proposition_concept',
    Base.metadata,
    Column('proposition_id', String, ForeignKey('propositions.id')),
    Column('concept_id', String, ForeignKey('concepts.id'))
)

class Proposition(Base):
    """命題モデル"""
    __tablename__ = 'propositions'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    text = Column(String, nullable=False)
    structure = Column(JSON, nullable=False)  # LogicalStructureを格納
    validity = Column(JSON)  # ValidationResultを格納
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat())

    # リレーションシップ
    concepts = relationship("Concept", secondary=proposition_concept, back_populates="propositions")
    analyses = relationship("Analysis", back_populates="proposition")

    def to_dict(self):
        """命題をディクショナリ形式に変換"""
        return {
            "id": self.id,
            "text": self.text,
            "structure": self.structure,
            "validity": self.validity,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "concepts": [concept.to_dict() for concept in self.concepts]
        }

class Analysis(Base):
    """分析結果モデル"""
    __tablename__ = 'analyses'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    proposition_id = Column(String, ForeignKey('propositions.id'))
    result = Column(JSON, nullable=False)
    method = Column(String, nullable=False)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

    # リレーションシップ
    proposition = relationship("Proposition", back_populates="analyses")

    def to_dict(self):
        """分析結果をディクショナリ形式に変換"""
        return {
            "id": self.id,
            "proposition_id": self.proposition_id,
            "result": self.result,
            "method": self.method,
            "created_at": self.created_at
        }

class Concept(Base):
    """概念モデル"""
    __tablename__ = 'concepts'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    definition = Column(String, nullable=False)
    related_concepts = Column(JSON, default=list)
    user_defined = Column(Boolean, default=True)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat())

    # リレーションシップ
    propositions = relationship("Proposition", secondary=proposition_concept, back_populates="concepts")

    def to_dict(self):
        """概念をディクショナリ形式に変換"""
        return {
            "id": self.id,
            "name": self.name,
            "definition": self.definition,
            "related_concepts": self.related_concepts,
            "user_defined": self.user_defined,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }