// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8q0VG33RpBTlCcxm8bwa3rgsilkMowq8",
  authDomain: "naturaltask-6c6db.firebaseapp.com",
  projectId: "naturaltask-6c6db",
  storageBucket: "naturaltask-6c6db.firebasestorage.app",
  messagingSenderId: "12789069261",
  appId: "1:12789069261:web:9e63e9b2751b69a4ae4084",
  measurementId: "G-EF6ECNVKBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export only the Firestore instance
export { db };