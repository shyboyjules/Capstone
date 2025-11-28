// DB/protect.js
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

// 🛡️ Call this inside dashboard pages
export function protectRoute(requiredRole) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // ❌ Not logged in → Go back to login
            window.location.href = "../landing/index.html";
            return;
        }

        // 🔍 Check Firestore role
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            auth.signOut();
            window.location.href = "../landing/index.html";
            return;
        }

        const role = userDoc.data()?.role?.trim();

        console.log(`🔐 Current role from Firestore: '${role}' | Required: '${requiredRole}'`);

        // ❌ If wrong role → force out
        if (role !== requiredRole) {
            alert("Access denied. You are not authorized to view this page.");
            window.location.href = "../landing/index.html";
        }
    });
}
