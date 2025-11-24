import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Load user info into dashboard UI
 * elements must exist:
 *  - .profile-info h4
 *  - .profile-info small
 *  - .profile-avatar
 */
export function loadUserProfile() {
  const nameEl = document.querySelector(".profile-info h4");
  const roleEl = document.querySelector(".profile-info small");
  const avatarEl = document.querySelector(".profile-avatar");

  if (!nameEl || !roleEl || !avatarEl) {
    console.warn("⚠ Missing profile HTML elements.");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return;

    const data = snap.data();

    nameEl.textContent = data.username;
    roleEl.textContent = data.role[0].toUpperCase() + data.role.slice(1);

    // Avatar initials
    const initials = data.username
      .split(" ")
      .map((w) => w[0].toUpperCase())
      .join("")
      .slice(0, 2);

    avatarEl.textContent = initials;
  });
}
