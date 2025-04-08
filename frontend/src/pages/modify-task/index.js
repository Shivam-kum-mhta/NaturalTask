import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../db/firebase"; // Import Firestore instance
import { getUserId } from "../../getUserId/getUserId"; // Function to get the user ID

/**
 * Function to modify a task in Firestore.
 * @param {string} taskId - The ID of the task to modify.
 * @param {Object} updatedData - The updated task data.
 */
export async function modifyTask(taskId, updatedData) {
    try {
        // Get the user ID
        const userId = await getUserId();

        // Reference to the specific task document
        const taskRef = doc(db, "users", userId, "tasks", taskId);

        // Update the task document with the new data
        await updateDoc(taskRef, updatedData);

        console.log("Task successfully updated:", taskId);
    } catch (error) {
        console.error("Error updating task:", error);
    }
}