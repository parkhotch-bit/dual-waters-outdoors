import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCGzFb4eRRgyxEP0BBpalGARZhqO-gAcAo",
  authDomain: "driftwild-ec530.firebaseapp.com",
  projectId: "driftwild-ec530",
  storageBucket: "driftwild-ec530.firebasestorage.app",
  messagingSenderId: "718264156481",
  appId: "1:718264156481:web:bdfcd611622f123bd2a1c0",
  measurementId: "G-KNRWPXMYF4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
