"""
Schema initialization file for LogicLens API.
This file exports all schema models to be used throughout the application.
"""

from .proposition import PropositionSchema, PropositionCreateSchema, PropositionUpdateSchema
from .concept import ConceptSchema, ConceptCreateSchema, ConceptUpdateSchema
from .validation import ValidationResultSchema
from .logical_structure import LogicalStructureSchema
from .relation import RelationSchema

# Export all schemas for easy access
__all__ = [
    'PropositionSchema',
    'PropositionCreateSchema',
    'PropositionUpdateSchema',
    'ConceptSchema',
    'ConceptCreateSchema',
    'ConceptUpdateSchema',
    'ValidationResultSchema',
    'LogicalStructureSchema',
    'RelationSchema',
]