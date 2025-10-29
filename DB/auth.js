import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getDatabase(app);

async function saveUserProfile(uid, username, email, profilePicUrl) {
    await set(ref(db, 'users/' + uid), {
        username,
        email,
        profilePicUrl: profilePicUrl || null
    });
}

export async function signUpAndRegisterUser(email, password, username, profilePicUrl) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: username, photoURL: profilePicUrl });
    await saveUserProfile(user.uid, username, email, profilePicUrl);
    return user;
}

export function observeAuthState(callback) {
    return onAuthStateChanged(auth, callback);
}

/**
 * Registers a new user with email and password and saves additional profile data to Realtime Database.
 * @param {string} email The user's email address.
 * @param {string} password The user's chosen password.
 * @param {string} username The user's chosen username/display name.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credential.
 */
export async function registerUser(email, password, username) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await set(ref(db, 'users/' + user.uid), {
            email: user.email,
            username: username,
            createdAt: new Date().toISOString()
        });
        console.log("User registered and data saved:", user.uid);
        return userCredential;
    } catch (error) {
        console.error("Error during registration or data saving:", error.message);
        throw error;
    }
}

export async function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}