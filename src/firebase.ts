// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBPjGq8JZHCqRgJyIHARxRml_-07k0csdY",
  authDomain: "student-app-a21fd.firebaseapp.com",
  projectId: "student-app-a21fd",
  storageBucket: "student-app-a21fd.firebasestorage.app",
  messagingSenderId: "1054024272599",
  appId: "1:1054024272599:web:c4a45052c001d1c084be92"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
