// DB/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoiEUmi8gVW7Hbu1R7F3B4F8YFhTm0lx4",
  authDomain: "roblox-capstone.firebaseapp.com",
  databaseURL: "https://roblox-capstone-default-rtdb.firebaseio.com",
  projectId: "roblox-capstone",
  storageBucket: "roblox-capstone.firebasestorage.app",
  messagingSenderId: "627088834761",
  appId: "1:627088834761:web:ca27c8a36132a040214d18",
  measurementId: "G-MMH7NEF46M"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };
