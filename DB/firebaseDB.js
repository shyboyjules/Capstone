// DB/firebaseDB.js
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { app } from "./firebase.js";

export const db = getFirestore(app);
