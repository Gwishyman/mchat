import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7Vyb3q3sSTxM8aTpNCJYq54t_5ankMow",
  authDomain: "mchat-58bbb.firebaseapp.com",
  projectId: "mchat-58bbb",
  storageBucket: "mchat-58bbb.appspot.com",
  messagingSenderId: "74608920062",
  appId: "1:74608920062:web:d3bd36ac95918b231becaf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
