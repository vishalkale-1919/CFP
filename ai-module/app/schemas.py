from pydantic import BaseModel, Field
from typing import List, Dict, Any

class CarbonMetricsInput(BaseModel):
    transport_emission: float = Field(..., gte=0, description="Transport emission in kg")
    electricity_emission: float = Field(..., gte=0, description="Electricity emission in kg")
    food_emission: float = Field(..., gte=0, description="Food emission in kg")
    shopping_emission: float = Field(..., gte=0, description="Shopping emission in kg")

class ActionCard(BaseModel):
    title: str
    category: str
    impact: str  # HIGH, MEDIUM, LOW
    advice: str
    estimated_reduction_kg: float

class RecommendationResponse(BaseModel):
    recommendation_score: int
    weekly_prediction_kg: float
    total_estimated_reduction_kg: float
    action_cards: List[ActionCard]