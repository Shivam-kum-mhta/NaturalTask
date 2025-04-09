import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

export async function getUserTasks(userId) {
  const tasksRef = collection(db, "users", userId, "tasks");

  try {
    const querySnapshot = await getDocs(tasksRef);
    const tasks = [];

    querySnapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return tasks;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
}

// // Example usage
// getUserTasks("1acdf72f-2d1a-4506-8c5c-62eb2c0d1cf2")
//   .then((tasks) => console.log("User tasks:", tasks))
//   .catch((error) => console.error("Error:", error));
