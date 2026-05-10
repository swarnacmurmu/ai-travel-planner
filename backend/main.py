import os
import json
from dotenv import load_dotenv
from google import genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: int
    interests: str
    travel_type: str

@app.get("/")
def home():
    return {"message": "Backend is running"}

@app.post("/generate-trip")
def generate_trip(trip: TripRequest):
    if trip.days <= 0:
        raise HTTPException(status_code=400, detail="Days must be greater than 0")

    if trip.budget <= 0:
        raise HTTPException(status_code=400, detail="Budget must be greater than 0")

    activities = [
        "Visit famous tourist attractions",
        "Explore local food spots",
        "Go for shopping and street markets",
        "Visit beaches or nature spots",
        "Try adventure or outdoor activities",
        "Explore cultural and historical places",
        "Relax at cafes and scenic viewpoints"
    ]

    plan = []
    daily_budget = trip.budget // trip.days

    for day in range(1, trip.days + 1):
        activity = activities[(day - 1) % len(activities)]

        budget_breakdown = {
            "stay": daily_budget * 40 // 100,
            "food": daily_budget * 25 // 100,
            "travel": daily_budget * 20 // 100,
            "activities": daily_budget * 15 // 100
        }

        plan.append({
            "day": day,
            "morning": f"{activity} in {trip.destination}",
            "afternoon": f"Have lunch and explore nearby places in {trip.destination}",
            "evening": f"Enjoy a {trip.travel_type}-friendly evening experience in {trip.destination}",
            "estimated_cost": daily_budget,
            "budget_breakdown": budget_breakdown
        })

    return {
        "destination": trip.destination,
        "days": trip.days,
        "budget": trip.budget,
        "interests": trip.interests,
        "travel_type": trip.travel_type,
        "plan": plan
    }