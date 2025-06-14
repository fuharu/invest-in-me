import { db } from './firebase';
import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// 部屋を新規作成
export async function createRoom({ childUid, childName, roomName, parentEmail }: {
  childUid: string;
  childName: string;
  roomName: string;
  parentEmail: string;
}) {
  const docRef = await addDoc(collection(db, 'rooms'), {
    roomName,
    members: [
      { uid: childUid, role: 'child', name: childName },
      { uid: parentEmail, role: 'parent', name: '' },
    ],
    messages: [],
    analyses: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

// 部屋情報を取得
export async function getRoomById(roomId: string) {
  const docRef = doc(db, 'rooms', roomId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  } else {
    return null;
  }
}

// 親が部屋に参加（メールアドレスで）
export async function joinRoom(roomId: string, parentName: string) {
  const docRef = doc(db, 'rooms', roomId);
  await updateDoc(docRef, {
    'members': arrayUnion({ role: 'parent', name: parentName })
  });
} 