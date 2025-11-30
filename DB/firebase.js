// DB/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyApwQ-HzMOh0SGn-Xm0m6cxb86DI7Gbakk",
  authDomain: "math-quest-479e3.firebaseapp.com",
  databaseURL: "https://math-quest-479e3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "math-quest-479e3",
  storageBucket: "math-quest-479e3.firebasestorage.app",
  messagingSenderId: "105467575154",
  appId: "1:105467575154:web:0fda6056ac97df74c8bbeb",
  measurementId: "G-HHQM24BXV1"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const analytics = getAnalytics(app);
