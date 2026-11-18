"use client";
import { useEffect, useState } from "react";
import {
  collection, doc, getDoc, getDocs, addDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const STATUS = { ongoing: "চলমান", upcoming: "আসন্ন", completed: "সম্পন্ন" };

export async function getAll(name) {
  const snap = await getDocs(collection(db, name));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getOne(name, id) {
  const snap = await getDoc(doc(db, name, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function submit(name, data) {
  return addDoc(collection(db, name), { ...data, createdAt: serverTimestamp() });
}

export function useList(name) {
  const [state, setState] = useState({ items: [], loading: true, error: false });
  useEffect(() => {
    let alive = true;
    getAll(name)
      .then((items) => alive && setState({ items, loading: false, error: false }))
      .catch(() => alive && setState({ items: [], loading: false, error: true }));
    return () => { alive = false; };
  }, [name]);
  return state;
}

export function useDoc(name, id) {
  const [state, setState] = useState({ data: null, loading: true, error: false });
  useEffect(() => {
    let alive = true;
    if (!id) {
      setState({ data: null, loading: false, error: false });
      return;
    }
    getOne(name, id)
      .then((data) => alive && setState({ data, loading: false, error: false }))
      .catch(() => alive && setState({ data: null, loading: false, error: true }));
    return () => { alive = false; };
  }, [name, id]);
  return state;
}
