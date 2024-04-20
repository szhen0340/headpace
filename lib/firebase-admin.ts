import serviceAccount from "./service-account.json";
import { credential } from "firebase-admin";
import { ServiceAccount, getApp, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function initializeAppIfNecessary() {
  try {
    return getApp();
  } catch (any) {
    return initializeApp({
      credential: credential.cert(serviceAccount as ServiceAccount),
    });
  }
}

export const firebaseAdmin = initializeAppIfNecessary();
export const authAdmin = getAuth(firebaseAdmin);
export const dbAdmin = getFirestore(firebaseAdmin);
