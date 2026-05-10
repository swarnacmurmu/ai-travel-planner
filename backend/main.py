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

    prompt = f"""
    Create a detailed travel itinerary.

    Destination: {trip.destination}
    Days: {trip.days}
    Budget: {trip.budget}
    Interests: {trip.interests}
    Travel Type: {trip.travel_type}

    For each day provide:
    - Morning activity
    - Afternoon activity
    - Evening activity
    - Estimated daily budget

    Keep response simple and readable.
    """

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt
    )

    return {
        "destination": trip.destination,
        "days": trip.days,
        "budget": trip.budget,
        "interests": trip.interests,
        "travel_type": trip.travel_type,
        "ai_plan": response.text
    }