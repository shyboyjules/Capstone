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
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

//
// ✅ Register user with a specific role
//
export async function registerUser(email, password, username, role = "user") {
  try {
    // 👇 make sure role parameter is actually used
    console.log(`🚀 Creating account with role: ${role}`);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set display name in Firebase Auth
    await updateProfile(user, { displayName: username });

    // ✅ Save user data in Firestore (correct role passed in)
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      role: role, // ⚠️ DO NOT hard-code this
      createdAt: new Date().toISOString()
    });

    console.log(`✅ ${role} account created & saved in Firestore:`, user.uid);
    return user;
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    throw error;
  }
}

//
// ✅ Login user and redirect based on their Firestore role
//
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔍 Fetch user role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      throw new Error("User record not found in Firestore!");
    }

    const userData = userDoc.data();
    console.log("✅ Logged in as:", userData.role);

    // 🚀 Redirect to the correct dashboard folder
    switch (userData.role) {
      case "admin":
        window.location.href = "../home admin/home_admin.html";
        break;
      case "teacher":
        window.location.href = "../home teacher/home_teacher.html";
        break;
      case "user":
        window.location.href = "../home user/Home.html";
        break;
      default:
        // fallback if role missing
        alert("No role assigned. Redirecting to default home.");
        window.location.href = "../Home.html";
        break;
    }

    return user;
  } catch (error) {
    console.error("❌ Login error:", error.message);
    alert("Login failed: " + error.message);
    throw error;
  }
}

//
// ✅ Monitor authentication state (optional)
//
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("🔐 Signed in:", user.email);
  } else {
    console.log("🚪 Signed out");
  }
});
