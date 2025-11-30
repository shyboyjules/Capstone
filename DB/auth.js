// DB/auth.js

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import {
  ref,
  set,
  get,
  child
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

import { app, db } from "./firebase.js";

const auth = getAuth(app);

// ⭐ Make login expire when browser closes
setPersistence(auth, browserSessionPersistence);

//
// REGISTER USER
//
export async function registerUser(email, password, username, role = "user", robloxId) {
  try {

    // ⭐ Roblox ID REQUIRED only for users
    if (role === "user" && (!robloxId || robloxId.trim() === "")) {
      throw new Error("Roblox ID is required for students.");
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save display name
    await updateProfile(user, { displayName: username });

    // ⭐ Prepare data object
    const userData = {
      username,
      email,
      role,
      createdAt: Date.now()
    };

    // ⭐ Add robloxId ONLY if user is a student
    if (role === "user") {
      userData.robloxId = robloxId;
    }

    // Save to Realtime Database
    await set(ref(db, "users/" + user.uid), userData);

    console.log("✅ Registered & saved");
    return user;

  } catch (error) {
    console.error("❌ Registration error:", error.message);
    throw error;
  }
}

//
// LOGIN USER
//
export async function loginUser(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    const snapshot = await get(child(ref(db), "users/" + user.uid));

    if (!snapshot.exists()) {
      throw new Error("User data missing in Realtime Database!");
    }

    const userInfo = snapshot.val();

    console.log("Role:", userInfo.role);

    // Mark logged in session
    try { sessionStorage.setItem("loggedIn", "true"); } catch (e) {}

    // ⭐ Redirect by role
    if (userInfo.role === "admin") {
      window.location.href = "../home admin/home_admin.html";
    } 
    else if (userInfo.role === "teacher") {
      window.location.href = "../home teacher/home_teacher.html";
    }
    else {
      window.location.href = "../home user/Home.html";
    }

    return user;

  } catch (error) {
    console.error("❌ Login error:", error.message);
    alert(error.message);
    throw error;
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) console.log("🔐 Logged in:", user.email);
  else console.log("🚪 Logged out");
});

// Logout helper used by pages
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Logout error:', err && err.message);
  }
  try { sessionStorage.removeItem('loggedIn'); } catch (e) {}
  window.location.href = "../landing/index.html";
}
