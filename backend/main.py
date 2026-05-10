from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

@app.get("/")
def home():
    return {"message": "Backend is running"}

@app.post("/generate-trip")
def generate_trip(trip: TripRequest):
    return {
        "destination": trip.destination,
        "days": trip.days,
        "budget": trip.budget,
        "interests": trip.interests,
        "plan": [
            {
                "day": 1,
                "morning": f"Visit popular places in {trip.destination}",
                "afternoon": "Try local food",
                "evening": "Explore nearby markets"
            }
        ]
    }