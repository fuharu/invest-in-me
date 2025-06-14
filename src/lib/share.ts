import { db } from './firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';

export async function saveShareData(data: any) {
  const docRef = await addDoc(collection(db, 'shares'), data);
  return docRef.id;
}

export async function getShareData(id: string) {
  const docRef = doc(db, 'shares', id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data();
  } else {
    return null;
  }
} 