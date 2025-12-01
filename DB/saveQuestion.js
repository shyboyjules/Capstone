import { ref, set, get } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";
import { db } from "./firebase.js";

// Save a new question or update an existing one
export async function saveQuestionToFirebase(question, choices, answer, teacherId, key = null) {
    try {
        // Load existing questions
        const snapshot = await get(ref(db, "Questions"));
        const questions = snapshot.exists() ? snapshot.val() : {};

        // Determine next Q number if adding new
        if (!key) {
            let maxQ = 0;
            Object.keys(questions).forEach(k => {
                if (k.startsWith("Q")) {
                    const num = parseInt(k.slice(1));
                    if (num > maxQ) maxQ = num;
                }
            });
            key = "Q" + (maxQ + 1);
        }

        // Convert choices array to object with letter keys: {a: "choice1", b: "choice2", ...}
        const choicesObj = {};
        const letters = ['A', 'B', 'C', 'D'];
        if (Array.isArray(choices)) {
            choices.forEach((choice, index) => {
                if (index < letters.length) {
                    choicesObj[letters[index]] = choice;
                }
            });
        }

        
        await set(ref(db, `Questions/${key}`), {
            // legacy keys
            text: question,
            Choices: choicesObj,
            CorrectAnswer: answer,
            question: question,
            teacherId: teacherId,
            createdAt: Date.now()
        });

        return key; // return Q number
    } catch (error) {
        console.error("Error saving question:", error);
        return null;
    }
}

// Load all questions from Firebase
export async function loadQuestionsFromFirebase() {
    try {
        const snapshot = await get(ref(db, "Questions"));
        return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
        console.error("Error loading questions:", error);
        return {};
    }
}
