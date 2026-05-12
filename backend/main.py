import os
import json
from datetime import datetime

from dotenv import load_dotenv
from google import genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient

load_dotenv()

gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

mongo_client = MongoClient(os.getenv("MONGODB_URL"))
db = mongo_client["ai_travel_planner"]
trips_collection = db["trips"]

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
    Generate a travel itinerary in STRICT JSON format.

    Destination: {trip.destination}
    Days: {trip.days}
    Budget: {trip.budget} INR
    Interests: {trip.interests}
    Travel Type: {trip.travel_type}

    Return ONLY valid JSON.

    Example format:

    {{
      "summary": "Short summary here",
      "budget_note": "Budget explanation here",
      "itinerary": [
        {{
          "day": 1,
          "title": "North Goa Beaches",
          "morning": "Visit Baga Beach",
          "afternoon": "Lunch and shopping",
          "evening": "Sunset dinner",
          "estimated_cost": 2000,
          "food_suggestion": "Try Goan seafood",
          "travel_tip": "Rent a scooter"
        }}
      ]
    }}

    Do not include markdown.
    Do not include explanation text.
    Do not write ```json.
    Generate exactly {trip.days} itinerary objects.
    """

    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        cleaned_text = response.text.strip()
        cleaned_text = cleaned_text.replace("```json", "").replace("```", "").strip()

        try:
            ai_data = json.loads(cleaned_text)
        except Exception:
            raise HTTPException(
                status_code=500,
                detail="AI response was not valid JSON. Please try again."
            )

        trip_document = {
            "destination": trip.destination,
            "days": trip.days,
            "budget": trip.budget,
            "interests": trip.interests,
            "travel_type": trip.travel_type,
            "summary": ai_data.get("summary", ""),
            "budget_note": ai_data.get("budget_note", ""),
            "itinerary": ai_data.get("itinerary", []),
            "created_at": datetime.utcnow()
        }

        insert_result = trips_collection.insert_one(trip_document)

        return {
            "id": str(insert_result.inserted_id),
            "destination": trip.destination,
            "days": trip.days,
            "budget": trip.budget,
            "interests": trip.interests,
            "travel_type": trip.travel_type,
            "summary": ai_data.get("summary", ""),
            "budget_note": ai_data.get("budget_note", ""),
            "itinerary": ai_data.get("itinerary", [])
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI or database operation failed: {str(e)}"
        )
    


    @app.get("/saved-trips")
def get_saved_trips():
    trips = []

    for trip in trips_collection.find().sort("created_at", -1):
        trip["_id"] = str(trip["_id"])
        trip["created_at"] = str(trip["created_at"])
        trips.append(trip)

    return {"saved_trips": trips}