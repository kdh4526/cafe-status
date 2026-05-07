import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnWyozLVZy-u3aDGRX1YcpbCKNJB4iemY",
  authDomain: "cafe-status-30a08.firebaseapp.com",
  projectId: "cafe-status-30a08",
  storageBucket: "cafe-status-30a08.firebasestorage.app",
  messagingSenderId: "319439556148",
  appId: "1:319439556148:web:8b10d9f366740bff090461",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);