"""
Models initialization file for LogicLens application.
This file exports all model classes for easy access throughout the application.
"""

from .proposition import Proposition
from .concept import Concept
from .logical_structure import LogicalStructure
from .validation_result import ValidationResult

# Export all models for easy import elsewhere
__all__ = [
    'Proposition',
    'Concept',
    'LogicalStructure',
    'ValidationResult'
]