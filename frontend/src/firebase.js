import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmBoB3KElZ8qnY1qhepN6rxjSaf5EiPpM",
  authDomain: "ai-travel-planner-1fc07.firebaseapp.com",
  projectId: "ai-travel-planner-1fc07",
  storageBucket: "ai-travel-planner-1fc07.firebasestorage.app",
  messagingSenderId: "818137669150",
  appId: "1:818137669150:web:455d9de3d5f60e914e180f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

