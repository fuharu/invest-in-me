"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchRooms = async () => {
      setLoading(true);
      // 自分がメンバーの部屋を取得
      const q = query(collection(db, "rooms"), where("members", "array-contains", { uid: user.uid, name: user.displayName || user.email || "", role: "child" }));
      const snap = await getDocs(q);
      const myRooms: any[] = [];
      snap.forEach(doc => {
        myRooms.push({ id: doc.id, ...doc.data() });
      });
      setRooms(myRooms);
      setLoading(false);
    };
    fetchRooms();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-indigo-900">ダッシュボード</h1>
        <div className="flex gap-2 flex-wrap">
          <Link href="/rooms" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">新しい部屋を作成</Link>
          <Link href="/form/step1" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">プレゼン資料を作成</Link>
          <Link href="/analysis" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">AI分析を始める</Link>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">自分の部屋一覧</h2>
        {loading ? (
          <div>読み込み中...</div>
        ) : rooms.length === 0 ? (
          <div className="text-gray-500">まだ部屋がありません。<Link href="/rooms" className="text-blue-600 underline">新しく作成しましょう！</Link></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {rooms.map(room => (
              <div key={room.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2 border hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-indigo-800">{room.roomName}</div>
                  <span className="text-xs text-gray-500">{room.createdAt ? new Date(room.createdAt.seconds * 1000).toLocaleDateString() : ""}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">メンバー数: {room.members?.length || 1}</div>
                <Link href={`/rooms/${room.id}`} className="mt-auto px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-center">部屋に入る</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 