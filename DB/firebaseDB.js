// DB/firebaseDB.js
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js"; // ✅ Changed from Firestore
import { app } from "./firebase.js";

export const db = getDatabase(app); // ✅ Now db points to Realtime Database
