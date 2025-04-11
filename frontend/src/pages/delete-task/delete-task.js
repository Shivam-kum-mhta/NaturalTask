import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../db/firebase"; // Import Firestore instance
import { getUserId } from "../../getUserId/getUserId"; // Function to get the user ID
import { deleteAlarm } from "../../alarms/delete_alarm.js";

/**
 * Function to delete a task from Firestore.
 * @param {string} taskId - The ID of the task to delete.
 */
export async function deleteTask(task) {
    try {
        console.log("Deleting task:", task.id);
        // Get the user ID
        const userId = await getUserId();
        console.log("User ID:", userId);
        // Reference to the specific task document
        const taskRef = doc(db, "users", userId, "tasks", task.id);
        console.log("any last word?");
        await deleteDoc(taskRef);
        console.log("Task successfully deleted.");

        // Verify if the task was actually deleted
        const deletedTask = await getDoc(taskRef);
        if (!deletedTask.exists()) {
            console.log("Task deletion confirmed.");
        } else {
            console.warn("Task still exists after deletion attempt.");
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        console.log("Extension is deleting alarm?");
        deleteAlarm(task);
    }
}