import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Routes, Route, Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { auth } from "./firebase";
import "./App.css";

function App() {
  const [destinationImage, setDestinationImage] = useState("");
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
    interests: "",
    travel_type: "",
  });

  const [tripPlan, setTripPlan] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        fetchSavedTrips(currentUser.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const fetchDestinationImage = async (destination) => {
    try {
      const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${destination} travel&client_id=${accessKey}`
      );

      const imageUrl = response.data.results[0]?.urls?.regular;
      setDestinationImage(imageUrl || "");
    } catch (error) {
      console.log("Image fetch failed", error);
      setDestinationImage("");
    }
  };

  const fetchSavedTrips = async (email) => {
    try {
      if (!user?.email) return;

      const response = await axios.get(
        `http://127.0.0.1:8000/saved-trips/${user.email}`
      );
      setSavedTrips(response.data.saved_trips);
    } catch (error) {
      console.log("Failed to fetch saved trips", error);
    }
  };

  const generateTrip = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setTripPlan(null);
      setDestinationImage("");

      const response = await axios.post("http://127.0.0.1:8000/generate-trip", {
        destination: formData.destination,
        days: Number(formData.days),
        budget: Number(formData.budget),
        interests: formData.interests,
        travel_type: formData.travel_type,
        user_email: user?.email || "",
      });

      setTripPlan(response.data);
      fetchDestinationImage(formData.destination);
      fetchSavedTrips();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong. Please check if backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const input = document.getElementById("trip-result");

    if (!input || !tripPlan) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${tripPlan.destination}-trip-plan.pdf`);
  };

  const homePage = (
    <div className="container">
      <div className="hero">
        <h1>AI Travel Planner</h1>
        <p>Create personalized day-wise travel plans using AI</p>

        {user ? (
          <div className="user-info">
            <p>Logged in as: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>

      <form onSubmit={generateTrip} className="form">
        <input
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
          min="1"
          required
        />

        <input
          type="number"
          name="budget"
          placeholder="Budget in ₹"
          value={formData.budget}
          onChange={handleChange}
          min="1"
          required
        />

        <input
          name="interests"
          placeholder="Interests: beach, shopping, food"
          value={formData.interests}
          onChange={handleChange}
          required
        />

        <input
          name="travel_type"
          placeholder="Travel type: solo, family, friends, couple"
          value={formData.travel_type}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Trip"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {tripPlan && (
        <div className="result" id="trip-result">
          {destinationImage && (
            <img
              src={destinationImage}
              alt={tripPlan.destination}
              className="destination-image"
            />
          )}

          <div className="result-header">
            <h2>{tripPlan.destination} Trip Plan</h2>
            <p>
              {tripPlan.days} Days • ₹{tripPlan.budget} •{" "}
              {tripPlan.travel_type}
            </p>

            <button className="download-btn" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>

          <div className="summary-card">
            <h3>Trip Summary</h3>
            <p>{tripPlan.summary}</p>
            <p>
              <b>Budget Note:</b> {tripPlan.budget_note}
            </p>
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
                <p>
                  <b>Estimated Cost:</b> ₹{day.estimated_cost}
                </p>
                <p>
                  <b>Food Suggestion:</b> {day.food_suggestion}
                </p>
                <p>
                  <b>Travel Tip:</b> {day.travel_tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {savedTrips.length > 0 && (
        <div className="saved-trips-section">
          <h2>Saved Trips</h2>

          <div className="saved-trips-grid">
            {savedTrips.map((trip) => (
              <div
                key={trip._id}
                className="saved-trip-card"
                onClick={() => openSavedTrip(trip)}
              >
                <h3>{trip.destination}</h3>

                <p>
                  {trip.days} Days • ₹{trip.budget}
                </p>

                <p className="saved-trip-type">{trip.travel_type}</p>

                <p className="saved-trip-summary">
                  {trip.summary?.slice(0, 130)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  const openSavedTrip = (trip) => {
    setTripPlan({
      id: trip._id,
      destination: trip.destination,
      days: trip.days,
      budget: trip.budget,
      interests: trip.interests,
      travel_type: trip.travel_type,
      summary: trip.summary,
      budget_note: trip.budget_note,
      itinerary: trip.itinerary,
    });

    fetchDestinationImage(trip.destination);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Routes>
      <Route path="/" element={homePage} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;