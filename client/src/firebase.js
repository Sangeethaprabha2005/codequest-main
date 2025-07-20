// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyANCYUjLZ1ACAcgM4uqeIFJigG7C31Sr98",
  authDomain: "intern-auth-app.firebaseapp.com",
  projectId: "intern-auth-app",
  storageBucket: "intern-auth-app.appspot.com",
  messagingSenderId: "190888476398",
  appId: "1:190888476398:web:c70eab2e23aec786a57dff"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
