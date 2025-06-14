"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export default function RoomInvitePage() {
  const params = useParams();
  const id = params && 'id' in params ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;
  const searchParams = useSearchParams();
  const parentEmail = searchParams ? searchParams.get("email") || "" : "";
  const [room, setRoom] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchRoom = async () => {
      if (!id) return;
      const snap = await getDoc(doc(db, "rooms", id));
      if (snap.exists()) {
        setRoom({ id: snap.id, ...snap.data() });
      }
    };
    fetchRoom();
  }, [id]);

  const handleJoin = async () => {
    if (!user || !room || !id) return;
    // すでにメンバーなら何もしない
    if (room.members?.some((m: any) => m.uid === user.uid)) {
      setStatus("すでに参加済みです");
      return;
    }
    await updateDoc(doc(db, "rooms", id), {
      members: arrayUnion({ uid: user.uid, role: "parent", name: user.displayName || user.email || "" })
    });
    setStatus("参加しました！");
    router.push(`/rooms/${id}`);
  };

  if (!room) return <div>読み込み中...</div>;

  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">親子の部屋に招待されています</h1>
      <p className="mb-4">部屋名: <span className="font-semibold">{room.roomName}</span></p>
      {!user ? (
        <div>
          <p>参加するにはログインしてください。</p>
          <a href="/auth/signin" className="text-blue-600 underline">ログインページへ</a>
        </div>
      ) : (
        <div>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded"
            onClick={handleJoin}
            disabled={status === "参加しました！" || status === "すでに参加済みです"}
          >
            この部屋に参加する
          </button>
          {status && <div className="mt-4 text-green-600">{status}</div>}
        </div>
      )}
    </div>
  );
} 