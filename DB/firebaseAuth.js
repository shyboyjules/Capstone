// DB/firebaseAuth.js
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { app } from "./firebase.js";

export const auth = getAuth(app);
