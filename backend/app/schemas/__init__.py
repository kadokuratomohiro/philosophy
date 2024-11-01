"""
Schema initialization module for the FastAPI backend.
This module exports all schema classes used in the application.
"""

from .proposition import PropositionSchema, PropositionCreate, PropositionUpdate
from .concept import ConceptSchema, ConceptCreate, ConceptUpdate
from .thought_experiment import ThoughtExperimentSchema, ThoughtExperimentCreate, ThoughtExperimentUpdate
from .common import ResponseSchema, ErrorSchema

# Export all schemas
__all__ = [
    # Proposition schemas
    'PropositionSchema',
    'PropositionCreate',
    'PropositionUpdate',
    
    # Concept schemas
    'ConceptSchema',
    'ConceptCreate',
    'ConceptUpdate',
    
    # Thought experiment schemas
    'ThoughtExperimentSchema',
    'ThoughtExperimentCreate',
    'ThoughtExperimentUpdate',
    
    # Common schemas
    'ResponseSchema',
    'ErrorSchema'
]