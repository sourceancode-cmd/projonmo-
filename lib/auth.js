import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getApps } from "firebase/app";

export function getAuthInstance() {
  return getAuth(getApps()[0]);
}

export async function login(email, password) {
  return signInWithEmailAndPassword(getAuthInstance(), email, password);
}

export async function logout() {
  return firebaseSignOut(getAuthInstance());
}
