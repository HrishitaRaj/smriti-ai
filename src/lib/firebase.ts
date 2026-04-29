// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔥 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDGyYf_ggZ7zAgzF60zt7m_tRbByOBL_MY",
  authDomain: "smriti-ai-5181b.firebaseapp.com",
  projectId: "smriti-ai-5181b",
  storageBucket: "smriti-ai-5181b.firebasestorage.app",
  messagingSenderId: "683694047589",
  appId: "1:683694047589:web:30495b93ef35ea7ccc218c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);