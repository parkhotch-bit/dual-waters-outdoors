import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Writes subscriber email to Firestore `emails` collection
export async function subscribeEmail(email) {
  return addDoc(collection(db, "emails"), {
    email: email.toLowerCase().trim(),
    subscribedAt: serverTimestamp(),
  });
}
