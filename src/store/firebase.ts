import { writable } from "svelte/store";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, DocumentSnapshot, getDoc, getFirestore, onSnapshot, setDoc, updateDoc, type DocumentData } from "firebase/firestore";
import { updateAuthStore, type AuthUser } from "./auth";
import { chessStoreSub, updateChessStore, type ChessStore } from "./chess";


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

export async function updateRoomDoc(roomId: string, data: any) {
  console.log(data)
  await updateDoc(doc(db, 'rooms', roomId), data)
}
export function handleRoom(roomId: string, currentUser: AuthUser) {
  if (!currentUser) return


  let chessStoreData: ChessStore = {
    fen: '',
    opponent: '',
    me: currentUser,
    color: 'white'
  };

  roomSnapshot(roomId, (docSnap) => {
    if (!docSnap.exists()) {
      console.log('invalid roomId')
      return
    }
    const data = docSnap.data();

    if (data['user1'] && !data['user2'] && data['user1'] != currentUser.uid) {
      updateRoomDoc(roomId, {
        'user2': currentUser.uid
      })
    }
    if (data['fen'] && data['fen'] as string != chessStoreData['fen']) {
      chessStoreData['fen'] = data['fen']
    }
    chessStoreData['opponent'] = data['user2']

    if (currentUser.uid == data['user1']) {
      chessStoreData['color'] = "white";
    } else if (currentUser.uid == data['user2']) {
      chessStoreData['color'] = "black";
    }

    chessStoreData['me'] = data['user1']
    updateChessStore(chessStoreData)
  })
}

type callbackFn = (snapshot: DocumentSnapshot<DocumentData>) => void

export function roomSnapshot(roomId: string, callback: callbackFn) {
  const snapshot = onSnapshot(doc(db, "rooms", roomId), callback)
  return snapshot
}

export const firebaseStoreSub = firebaseStore.subscribe;