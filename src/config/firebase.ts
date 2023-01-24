import { authStoreSet } from "../store";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
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
  authStoreSet({
    isLoggedIn: user !== null,
    user
  })
})

export { auth, db, app };