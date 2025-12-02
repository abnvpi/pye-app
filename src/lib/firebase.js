// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBoik16-6ynoPUsjBUzzWP55mFUvfgOD5k",
    authDomain: "pye1-1252c.firebaseapp.com",
    projectId: "pye1-1252c",
    storageBucket: "pye1-1252c.firebasestorage.app",
    messagingSenderId: "123971248008",
    appId: "1:123971248008:web:389e74d0551cf3fe29643d",
    measurementId: "G-N2TF9VW4YS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { db, auth, storage, analytics };
