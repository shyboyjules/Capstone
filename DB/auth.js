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
export async function registerUser(email, password, username, role = "user", userIdInput) {
  try {

    // ⭐ Require UserId only for students
    if (role === "user") {
      if (!userIdInput || userIdInput.trim() === "" || isNaN(userIdInput)) {
        throw new Error("User ID must be a valid number.");
      }
    }

    // Convert to number
    const userId = Number(userIdInput);

    // -----------------------------
    // ⭐ CHECK IF STUDENT STATS EXIST
    // Path: Students/Stats/{UserId}
    // -----------------------------
    let statsRef = ref(db, `Students/Stats/${userId}`);
    let statsSnap = await get(statsRef);

    // -----------------------------
    // ⭐ IF NOT EXIST → CREATE DEFAULT STATS
    // -----------------------------
    if (!statsSnap.exists() && role === "user") {
      await set(statsRef, {
        UserId: userId,
        CorrectAnswers: 0,
        WrongAnswers: 0,
        Level: 0,
        TimeSpent: 0
      });
      console.log("🆕 Created new Student Stats for UserId:", userId);
    }

    // -----------------------------
    // ⭐ CONTINUE NORMAL REGISTRATION
    // -----------------------------
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth display name
    await updateProfile(user, { displayName: username });

    // Data saved to users/{uid}
    const userData = {
      username,
      email,
      role,
      createdAt: Date.now(),
    };

    if (role === "user") {
      userData.UserId = userId;
    }

    // Save user data
    await set(ref(db, "users/" + user.uid), userData);

    console.log("✅ Registered successfully — User + Stats saved");
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
