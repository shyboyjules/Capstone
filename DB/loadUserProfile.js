// DB/loadUserProfile.js

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";
import { app, db } from "./firebase.js";

const auth = getAuth(app);

export function loadUserProfile() {
  const nameEl = document.querySelector(".profile-info h4");
  const roleEl = document.querySelector(".profile-info small");
  const avatarEl = document.querySelector(".profile-avatar");

  if (!nameEl || !roleEl || !avatarEl) return;

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const snapshot = await get(child(ref(db), "users/" + user.uid));
    if (!snapshot.exists()) return;

    const data = snapshot.val();

    // --- NEW LOGIC ---
    let displayName;

    if (data.role === "user") {
      // Use robloxId for users
      displayName = data.robloxId || "No Roblox ID";
    } else {
      // Use username for teacher/admin
      displayName = data.username;
    }

    nameEl.textContent = displayName;

    roleEl.textContent = data.role.charAt(0).toUpperCase() + data.role.slice(1);

    // Avatar initials based on displayName
    const initials = displayName
      .toString()
      .split(" ")
      .map(x => x[0] ?? "")
      .join("")
      .toUpperCase();

    avatarEl.textContent = initials;
  });
}