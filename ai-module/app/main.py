from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import CarbonMetricsInput, RecommendationResponse, ActionCard
import uvicorn

app = FastAPI(
    title="EcoTrack AI Recommendation Engine",
    description="Rule-based environmental analytics parsing real-time consumption vectors.",
    version="1.0.0"
)

# Enable Cross-Origin Resource Sharing (CORS) for local microservices communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/recommendations", response_model=RecommendationResponse)
def generate_recommendations(metrics: CarbonMetricsInput):
    total = (
        metrics.transport_emission + 
        metrics.electricity_emission + 
        metrics.food_emission + 
        metrics.shopping_emission
    )
    
    # Handle empty log fallback gracefully
    if total == 0:
        return RecommendationResponse(
            recommendation_score=100,
            weekly_prediction_kg=0.0,
            total_estimated_reduction_kg=0.0,
            action_cards=[
                ActionCard(
                    title="Begin Log Inserts",
                    category="GENERAL",
                    impact="LOW",
                    advice="Log your footprint attributes using the calculation tool to unlock AI evaluations.",
                    estimated_reduction_kg=0.0
                )
            ]
        )

    # Calculate ratios for conditional logic triggers
    transport_pct = metrics.transport_emission / total
    electricity_pct = metrics.electricity_emission / total
    food_pct = metrics.food_emission / total

    action_cards = []
    total_saved = 0.0

    # TRIGGER 1: Transport greater than 40%
    if transport_pct > 0.40:
        saved = metrics.transport_emission * 0.35  # Estimate 35% reduction from public transit
        total_saved += saved
        action_cards.append(
            ActionCard(
                title="Transition to Public Transit",
                category="TRANSPORT",
                impact="HIGH",
                advice="Your transport allocation exceeds 40%. Swapping driving for trains or public buses can significantly lower this value.",
                estimated_reduction_kg=round(saved, 2)
            )
        )

    # TRIGGER 2: Electricity greater than 30%
    if electricity_pct > 0.30:
        saved = metrics.electricity_emission * 0.15  # Estimate 15% reduction from smart use
        total_saved += saved
        action_cards.append(
            ActionCard(
                title="Optimize Appliance Cycles",
                category="ELECTRICITY",
                impact="MEDIUM",
                advice="Electricity makes up over 30% of your footprint. Unplug standby devices and use energy-efficient appliances where possible.",
                estimated_reduction_kg=round(saved, 2)
            )
        )

    # TRIGGER 3: Food greater than 50%
    if food_pct > 0.50:
        saved = metrics.food_emission * 0.25  # Estimate 25% reduction from plant-based alternatives
        total_saved += saved
        action_cards.append(
            ActionCard(
                title="Adopt a Plant-Forward Diet",
                category="FOOD",
                impact="HIGH",
                advice="Your food choices account for over half your total emissions. Integrating more plant-based alternatives directly lowers your daily impact.",
                estimated_reduction_kg=round(saved, 2)
            )
        )

    # Baseline card if no specific threshold thresholds are crossed
    if not action_cards:
        saved = total * 0.10
        total_saved += saved
        action_cards.append(
            ActionCard(
                title="Incremental Consumption Reductions",
                category="SHOPPING",
                impact="LOW",
                advice="Your carbon footprint vectors are well-balanced. Try reducing non-essential shopping to refine your scores further.",
                estimated_reduction_kg=round(saved, 2)
            )
        )

    # Calculate AI recommendation rating score (higher is better, max 100)
    # Penalizes high daily totals; e.g., 50kg limit baseline
    score_penalty = min(int((total / 50.0) * 100), 90)
    calculated_score = 100 - score_penalty

    # Project weekly forecast parameters
    weekly_forecast = total * 7

    return RecommendationResponse(
        recommendation_score=calculated_score,
        weekly_prediction_kg=round(weekly_forecast, 2),
        total_estimated_reduction_kg=round(total_saved, 2),
        action_cards=action_cards
    )

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)