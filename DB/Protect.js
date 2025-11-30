import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  get
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

import { app } from "./firebase.js";

// single auth + db instances (consistent across app)
const auth = getAuth(app);
const db = getDatabase(app);

// Ensure session persistence is the browser session (cleared when browser ends)
setPersistence(auth, browserSessionPersistence).catch((err) => {
  // non-fatal: log and continue
  console.warn("Could not set session persistence:", err && err.message);
});

// NOTE: removed automatic sign-out on unload because it also fired
// during normal in-app navigation and caused protected pages to redirect.
// Rely on `browserSessionPersistence` and explicit logout instead.


export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Mark session for protected routes
  try { sessionStorage.setItem("loggedIn", "true"); } catch (e) {}

  const snapshot = await get(ref(db, "users/" + firebaseUser.uid));

  if (!snapshot.exists()) throw new Error("User record missing!");

  const data = snapshot.val();

  if (data.role === "admin") {
    window.location.href = "../AdminDashboard/home.html";
  } else {
    window.location.href = "../UserDashboard/home.html";
  }

  return data;
}

// protectRoute ensures only authenticated users of a given role can access a page
export function protectRoute(expectedRole) {
  // Use Firebase auth state to verify and redirect if not authorized
  // Avoid relying solely on sessionStorage because it may be missing in some flows.
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "../landing/index.html";
      return;
    }

    try {
      const snap = await get(ref(db, `users/${user.uid}`));
      if (!snap.exists()) {
        await signOut(auth);
        window.location.href = "../landing/index.html";
        return;
      }
      const data = snap.val();

      // allow 'user' to match 'user' or 'student' normalized names if needed
      const role = (data.role || "").toLowerCase();
      const expected = (expectedRole || "").toLowerCase();

      if (expected && role !== expected && !(expected === "user" && role === "student")) {
        // role mismatch
        await signOut(auth);
        window.location.href = "../landing/index.html";
        return;
      }
    } catch (err) {
      console.error("protectRoute error:", err);
      try { await signOut(auth); } catch (e) {}
      window.location.href = "../landing/index.html";
    }
  });
}
