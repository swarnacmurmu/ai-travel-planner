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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateTrip = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await axios.post("http://127.0.0.1:8000/generate-trip", {
        destination: formData.destination,
        days: Number(formData.days),
        budget: Number(formData.budget),
        interests: formData.interests,
        travel_type: formData.travel_type,
      });

      setTripPlan(response.data);
    } catch (err) {
      setError("Something went wrong. Please check if backend is running.");
    }
  };

  return (
    <div className="container">
      <h1>AI Travel Planner</h1>

      <form onSubmit={generateTrip} className="form">
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="days"
          placeholder="Number of days"
          value={formData.days}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={formData.budget}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="interests"
          placeholder="Interests: beaches, food, shopping"
          value={formData.interests}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="travel_type"
          placeholder="Travel type: solo, family, friends, couple"
          value={formData.travel_type}
          onChange={handleChange}
          required
        />

        <button type="submit">Generate Trip</button>
      </form>

      {error && <p className="error">{error}</p>}

      {tripPlan && (
        <div className="result">
          <h2>Trip Plan for {tripPlan.destination}</h2>
          <p><b>Days:</b> {tripPlan.days}</p>
          <p><b>Budget:</b> ₹{tripPlan.budget}</p>
          <p><b>Interests:</b> {tripPlan.interests}</p>
          <p><b>Travel Type:</b> {tripPlan.travel_type}</p>

          {tripPlan.plan.map((day) => (
            <div key={day.day} className="day-card">
              <h3>Day {day.day}</h3>
              <p><b>Morning:</b> {day.morning}</p>
              <p><b>Afternoon:</b> {day.afternoon}</p>
              <p><b>Evening:</b> {day.evening}</p>
              <p><b>Estimated Cost:</b> ₹{day.estimated_cost}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;