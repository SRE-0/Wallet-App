// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeU4ttZYwgfBtbpkDPodiyFa8SBv0PPZk",
  authDomain: "wallet-sre404.firebaseapp.com",
  projectId: "wallet-sre404",
  storageBucket: "wallet-sre404.firebasestorage.app",
  messagingSenderId: "62430680430",
  appId: "1:62430680430:web:2f66e2b6a8a3bf36eddd7f",
  measurementId: "G-WRGJJJCY03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore correctly
export const db = getFirestore(app);