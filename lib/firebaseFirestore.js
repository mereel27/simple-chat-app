import {
  getFirestore,
  /* collection,
  onSnapshot,
  addDoc,
  query, */
  setDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { app } from './firebaseConfig';
export const db = getFirestore(app);

export const addUser = async (uid, data) => {
  await setDoc(doc(db, 'users', uid), data);
};

export const updateUser = async (uid, field, value) => {
  const dataRef = doc(db, 'users', uid);
  await updateDoc(dataRef, {
    [field]: value,
  });
};
