import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
    interests: "",
    travel_type: "",
  });

  const [tripPlan, setTripPlan] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateTrip = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setTripPlan(null);

      const response = await axios.post("http://127.0.0.1:8000/generate-trip", {
        destination: formData.destination,
        days: Number(formData.days),
        budget: Number(formData.budget),
        interests: formData.interests,
        travel_type: formData.travel_type,
      });

      setTripPlan(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong. Please check if backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="hero">
        <h1>AI Travel Planner</h1>
        <p>Create personalized day-wise travel plans using AI</p>
      </div>

      <form onSubmit={generateTrip} className="form">
        <input name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} required />
        <input type="number" name="days" placeholder="Number of days" value={formData.days} onChange={handleChange} min="1" required />
        <input type="number" name="budget" placeholder="Budget in ₹" value={formData.budget} onChange={handleChange} min="1" required />
        <input name="interests" placeholder="Interests: beach, shopping, food" value={formData.interests} onChange={handleChange} required />
        <input name="travel_type" placeholder="Travel type: solo, family, friends, couple" value={formData.travel_type} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Trip"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {tripPlan && (
        <div className="result">
          <div className="result-header">
            <h2>{tripPlan.destination} Trip Plan</h2>
            <p>{tripPlan.days} Days • ₹{tripPlan.budget} • {tripPlan.travel_type}</p>
          </div>

          <div className="summary-card">
            <h3>Trip Summary</h3>
            <p>{tripPlan.summary}</p>
            <p><b>Budget Note:</b> {tripPlan.budget_note}</p>
          </div>

          <h3 className="section-title">Day-wise Itinerary</h3>

          {tripPlan.itinerary?.map((day) => (
            <div key={day.day} className="day-card">
              <div className="day-header">
                <span>Day {day.day}</span>
                <h3>{day.title}</h3>
              </div>

              <div className="activity-grid">
                <div>
                  <h4>Morning</h4>
                  <p>{day.morning}</p>
                </div>

                <div>
                  <h4>Afternoon</h4>
                  <p>{day.afternoon}</p>
                </div>

                <div>
                  <h4>Evening</h4>
                  <p>{day.evening}</p>
                </div>
              </div>

              <div className="extra-info">
                <p><b>Estimated Cost:</b> ₹{day.estimated_cost}</p>
                <p><b>Food Suggestion:</b> {day.food_suggestion}</p>
                <p><b>Travel Tip:</b> {day.travel_tip}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;