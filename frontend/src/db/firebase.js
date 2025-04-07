// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export {db}