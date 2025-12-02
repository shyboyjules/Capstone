// DB/loadUserProfile.js

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";
import { app, db } from "./firebase.js";

const auth = getAuth(app);

export function loadUserProfile() {
  const nameEl = document.querySelector(".profile-info h4");       // username
  const roleEl = document.querySelector(".profile-info small");    // role or ID
  const avatarEl = document.querySelector(".profile-avatar");

  if (!nameEl || !roleEl || !avatarEl) return;

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const snapshot = await get(child(ref(db), "users/" + user.uid));
    if (!snapshot.exists()) return;

    const data = snapshot.val();

    // Username
    const displayName = data.username || "User";

    // Role
    const role = data.role || "user";

    // UserId
    const userId = data.UserId || "Unknown";

    // ✨ Apply username
    nameEl.textContent = displayName;

    // ✨ ROLE LOGIC
    if (role === "user") {
      // Student → show ID
      roleEl.textContent = "ID: " + userId;
    } else {
      // Teacher/Admin → show actual role
      roleEl.textContent =
        role.charAt(0).toUpperCase() + role.slice(1);
    }

    // ✨ Avatar initials
    const initials = displayName
      .toString()
      .split(" ")
      .map(word => word[0] || "")
      .join("")
      .toUpperCase();

    avatarEl.textContent = initials;
  });
}
