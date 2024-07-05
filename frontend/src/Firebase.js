import { initializeApp } from "firebase/app";
import { getStorage} from 'firebase/storage';
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk-SQJZg8lwvcoQwTy9Lm7n9EiwOkZI8s",
  authDomain: "vide-hub.firebaseapp.com",
  projectId: "vide-hub",
  storageBucket: "vide-hub.appspot.com",
  messagingSenderId: "775233635789",
  appId: "1:775233635789:web:0aa4792bea29e545483084",
  measurementId: "G-8TZBP9JJJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)
export const db = getFirestore(app)