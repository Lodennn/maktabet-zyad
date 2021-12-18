// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKDlaqci74TEBKh9JhV-bJAnsOJIjJEEY",
  authDomain: "maktabet-zyad.firebaseapp.com",
  projectId: "maktabet-zyad",
  storageBucket: "maktabet-zyad.appspot.com",
  messagingSenderId: "948259923956",
  appId: "1:948259923956:web:56ab1bc4b1dbe2d2adbba1",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

export default db;
