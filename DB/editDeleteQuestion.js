import { ref, update, remove } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";
import { db } from "./firebase.js";

// Helper: convert choices array to object with letter keys (a, b, c, d...)
function choicesArrayToObj(choices) {
    const choicesObj = {};
    const letters = ['A', 'B', 'C', 'D'];
    if (Array.isArray(choices)) {
        choices.forEach((choice, index) => {
            if (index < letters.length) choicesObj[letters[index]] = choice;
        });
    }
    return choicesObj;
}

// Full update (question, choices, answer)
export async function updateQuestionInFirebase(key, question, choices, answer) {
    try {
        const choicesObj = choicesArrayToObj(choices);
        // Write legacy keys and canonical question, but do NOT write canonical `choices`
        await update(ref(db, `Questions/${key}`), {
            question: question,
            text: question,
            Choices: choicesObj,
            CorrectAnswer: answer,
            updatedAt: Date.now()
        });
        return true;
    } catch (error) {
        console.error("Error updating question:", error);
        return false;
    }
}

// Update only the question text
export async function updateQuestionText(key, question) {
    try {
        await update(ref(db, `Questions/${key}`), { question, text: question, updatedAt: Date.now() });
        return true;
    } catch (error) {
        console.error("Error updating question text:", error);
        return false;
    }
}

// Update only the choices (accepts array)
export async function updateQuestionChoices(key, choices) {
    try {
        const choicesObj = choicesArrayToObj(choices);
        await update(ref(db, `Questions/${key}`), { Choices: choicesObj, updatedAt: Date.now() });
        return true;
    } catch (error) {
        console.error("Error updating question choices:", error);
        return false;
    }
}

// Update only the correct answer
export async function updateQuestionAnswer(key, answer) {
    try {
        await update(ref(db, `Questions/${key}`), { CorrectAnswer: answer, updatedAt: Date.now() });
        return true;
    } catch (error) {
        console.error("Error updating question answer:", error);
        return false;
    }
}

// Delete a question
export async function deleteQuestionFromFirebase(key) {
    try {
        await remove(ref(db, `Questions/${key}`));
        return true;
    } catch (error) {
        console.error("Error deleting question:", error);
        return false;
    }
}