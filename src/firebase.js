import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDerPZ2K6QQsagzOBkypS0ZKRbDhd5c5JI",
  authDomain: "fintech-d46fc.firebaseapp.com",
  projectId: "fintech-d46fc",
  storageBucket: "fintech-d46fc.appspot.com",
  messagingSenderId: "442710059860",
  appId: "1:442710059860:web:6b75e0b2c38b4e05e376c1",
};

const app = initializeApp(firebaseConfig);

// ✅ THIS WAS MISSING
export const auth = getAuth(app);
export const db = getFirestore(app);