import { writable } from "svelte/store";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, DocumentSnapshot, getFirestore, onSnapshot, type DocumentData } from "firebase/firestore";
import { updateAuthStore, type AuthUser } from "./auth";


const firebaseConfig = {
  apiKey: "AIzaSyCDBubFrwW2OGFXDf3ndr1Ih3m1gDn2gPI",
  authDomain: "chess-b5e8d.firebaseapp.com",
  projectId: "chess-b5e8d",
  storageBucket: "chess-b5e8d.appspot.com",
  messagingSenderId: "590413205228",
  appId: "1:590413205228:web:0d983f5dfb7f5cdca85fc9",
  measurementId: "G-K4C55QE72T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


auth.onAuthStateChanged((user) => {
  updateAuthStore({
    isLoggedIn: user !== null,
    user
  })
})


const firebaseStore = writable({
  app, auth, db
})


export async function createRoom(data: Object) {
  const docRef = await addDoc(collection(db, "rooms"), data)
  return docRef
}

type callbackFn = (snapshot: DocumentSnapshot<DocumentData>) => void
export function roomSnapshot(roomId: string, callback: callbackFn) {
  const snapshot = onSnapshot(doc(db, "rooms", roomId), callback)
  return snapshot
}

export const firebaseStoreSub = firebaseStore.subscribe;