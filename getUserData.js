import { getDatabase, ref, get, child } from "firebase/database";

async function getUserData(userId) {
    const db = getDatabase();
    const dbRef = ref(db);

    try {
        const snapshot = await get(child(dbRef, `users/${userId}`));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No data available for the given user ID.");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user data:", error);
        throw error;
    }
}

export default getUserData;