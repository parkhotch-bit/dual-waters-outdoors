import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Firestore schema for a post:
// {
//   title: string,
//   slug: string,          // URL-safe unique identifier, e.g. "may-trip-report-snake-river"
//   excerpt: string,       // 1-2 sentence summary shown on cards
//   body: string,          // Markdown content
//   category: string,      // "trip-report" | "gear" | "economy" | "tips"
//   tags: string[],        // e.g. ["trout", "wyoming", "fly-fishing"]
//   featuredImage: string, // Image URL
//   publishedAt: Timestamp,
//   createdAt: Timestamp,
//   updatedAt: Timestamp,
// }

export function usePosts({ category, tag, max } = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let constraints = [orderBy("publishedAt", "desc")];
    if (category) constraints.push(where("category", "==", category));
    if (tag) constraints.push(where("tags", "array-contains", tag));
    if (max) constraints.push(limit(max));

    const q = query(collection(db, "posts"), ...constraints);
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [category, tag, max]);

  return { posts, loading };
}

export function usePost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const q = query(collection(db, "posts"), where("slug", "==", slug));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const d = snap.docs[0];
          setPost({ id: d.id, ...d.data() });
        } else {
          setPost(null);
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [slug]);

  return { post, loading };
}

export function createPost(data) {
  return addDoc(collection(db, "posts"), {
    ...data,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export function updatePost(id, data) {
  return updateDoc(doc(db, "posts", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export function deletePost(id) {
  return deleteDoc(doc(db, "posts", id));
}
