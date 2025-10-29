// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoiEUmi8gVW7Hbu1R7F3B4F8YFhTm0lx4",
  authDomain: "roblox-capstone.firebaseapp.com",
  projectId: "roblox-capstone",
  storageBucket: "roblox-capstone.firebasestorage.app",
  messagingSenderId: "627088834761",
  appId: "1:627088834761:web:ca27c8a36132a040214d18",
  measurementId: "G-MMH7NEF46M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase(app);