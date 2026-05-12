# ✈️ AI Travel Planner

An AI-powered travel itinerary planner built using **React.js**, **FastAPI**, and **Google Gemini AI**.  
The application generates personalized day-wise travel plans based on destination, budget, interests, and travel type.

---

# 🚀 Features

- 🤖 AI-generated travel itineraries using Gemini AI
- 📅 Day-wise travel planning
- 💰 Budget-aware recommendations
- 🌍 Personalized travel suggestions
- 🖼️ Dynamic destination images using Unsplash API
- 🌤️ Weather forecast integration
- 📱 Responsive modern UI
- ⚡ FastAPI backend + React frontend architecture

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Axios
- CSS3

## Backend
- FastAPI
- Python
- Gemini AI API
- Pydantic

## APIs Used
- Google Gemini API
- Unsplash API
- OpenWeatherMap API

---

# 📂 Project Structure

```bash
ai-travel-planner/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │
│   ├── .env
│   ├── package.json
│
├── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ai-travel-planner.git
cd ai-travel-planner
```

---

# 🔹 Backend Setup

## Create Virtual Environment

```bash
cd backend
python -m venv venv
```

## Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Create `.env`

Inside `backend/.env`

```env
GEMINI_API_KEY=your_gemini_api_key
```

---

## Run Backend

```bash
uvicorn main:app --reload
```

Backend runs on:

```txt
http://127.0.0.1:8000
```

---

# 🔹 Frontend Setup

## Install Dependencies

```bash
cd frontend
npm install
```

---

## Create `.env`

Inside `frontend/.env`

```env
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key
VITE_WEATHER_API_KEY=your_weather_api_key
```

---

## Run Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# 🧠 How It Works

1. User enters:
   - Destination
   - Budget
   - Number of days
   - Interests
   - Travel type

2. React frontend sends request to FastAPI backend.

3. Backend sends prompt to Gemini AI.

4. Gemini AI generates structured itinerary.

5. Frontend displays:
   - Destination image
   - Trip summary
   - Day-wise itinerary
   - Travel tips
   - Food suggestions

---

# 📸 Screenshots

## Home Page

_Add screenshot here_

## AI Generated Itinerary

_Add screenshot here_

---

# 🔐 Environment Variables

## Backend

```env
GEMINI_API_KEY=
```

## Frontend

```env
VITE_UNSPLASH_ACCESS_KEY=
VITE_WEATHER_API_KEY=
```

---

# 📌 Future Enhancements

- 🔐 User Authentication
- 💾 Save Trips to Database
- 📄 PDF Export
- 🗺️ Google Maps Integration
- ❤️ Favorite Trips
- 📱 Mobile App Version

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit changes
4. Push the branch
5. Create Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Swarna Champa Murmu**

- GitHub: https://github.com/swarnacmurmu
- LinkedIn: https://linkedin.com/in/swarna-champa-murmu

---