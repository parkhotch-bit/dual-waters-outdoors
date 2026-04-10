import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setProfile(snap.data());
          }
        } catch (err) {
          console.error("Failed to load user profile:", err.code, err.message);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signUp(email, password, name, role = "guest") {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      name,
      email,
      role,
      bio: "",
      avatar: "",
      createdAt: serverTimestamp(),
    });
    return cred;
  }

  async function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle(role = "guest") {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const ref = doc(db, "users", cred.user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: cred.user.uid,
        name: cred.user.displayName,
        email: cred.user.email,
        role,
        bio: "",
        avatar: cred.user.photoURL || "",
        createdAt: serverTimestamp(),
      });
    }
    return cred;
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function updateProfile(data) {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), data, { merge: true });
    setProfile((prev) => ({ ...prev, ...data }));
  }

  function logOut() {
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signInWithGoogle, logOut, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}