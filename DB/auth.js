// DB/auth.js

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Register user and save to Firestore
export async function registerUser(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: username });

    // ✅ Save to Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      createdAt: new Date().toISOString()
    });

    console.log("✅ User created & saved in Firestore:", user.uid);
    return user;
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    throw error;
  }
}

// ✅ Login user
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("❌ Login error:", error.message);
    throw error;
  }
}
