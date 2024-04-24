import { credential } from "firebase-admin";
import { getApp, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function initializeAppIfNecessary() {
  try {
    return getApp();
  } catch (any) {
    return initializeApp({
      credential: credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY,
      }),
    });
  }
}

export const firebaseAdmin = initializeAppIfNecessary();
export const authAdmin = getAuth(firebaseAdmin);
export const dbAdmin = getFirestore(firebaseAdmin);
