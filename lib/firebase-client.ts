import { getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const CLIENT_CONFIG = {
  apiKey: "AIzaSyCdoWLYawBXH-yNaAlhRwzCzUgBMYpTT8s",
  authDomain: "headpace-4b780.firebaseapp.com",
  projectId: "headpace-4b780",
  storageBucket: "headpace-4b780.appspot.com",
  messagingSenderId: "545714997845",
  appId: "1:545714997845:web:cfefc789badd7d60efe2dc",
  measurementId: "G-7JV64BXCPS",
};

function initializeAppIfNecessary() {
  try {
    return getApp();
  } catch (any) {
    return initializeApp(CLIENT_CONFIG);
  }
}

export const firebaseClient = initializeAppIfNecessary();
export const authClient = getAuth(firebaseClient);
export const dbClient = getFirestore(firebaseClient);
