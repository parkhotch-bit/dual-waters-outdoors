import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Firestore schema for a product:
// {
//   name: string,
//   description: string,
//   price: number,            // in dollars, e.g. 28.00
//   images: string[],         // image URLs
//   variants: string[],       // e.g. ["S","M","L","XL"] or ["One Size"]
//   stripeLink: string,       // Stripe Payment Link URL for direct checkout
//   inStock: boolean,
//   category: string,         // "apparel" | "accessories" | "other"
//   createdAt: Timestamp,
//   updatedAt: Timestamp,
// }

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  return { products, loading };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(
      doc(db, "products", id),
      (snap) => {
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
        else setProduct(null);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [id]);

  return { product, loading };
}

export function createProduct(data) {
  return addDoc(collection(db, "products"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export function updateProduct(id, data) {
  return updateDoc(doc(db, "products", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export function deleteProduct(id) {
  return deleteDoc(doc(db, "products", id));
}
