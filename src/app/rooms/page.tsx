"use client";
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { createRoom } from '@/lib/rooms';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const fetchRooms = async () => {
      const q = query(collection(db, 'rooms'), where('members', 'array-contains', { uid: user.uid }));
      const snap = await getDocs(q);
      setRooms(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchRooms();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName || !parentEmail || !user) return;
    setLoading(true);
    const id = await createRoom({
      childUid: user.uid,
      childName: user.displayName || '',
      roomName,
      parentEmail,
    });
    setLoading(false);
    const link = `${window.location.origin}/rooms/invite/${id}?email=${encodeURIComponent(parentEmail)}`;
    setInviteLink(link);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('招待リンクをコピーしました');
  };

  if (!user) return <div>ログインが必要です。</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">親子の部屋一覧</h1>
      <form onSubmit={handleCreate} className="mb-8 p-4 border rounded bg-white">
        <div className="mb-2">
          <label className="block font-semibold">部屋名</label>
          <input className="border rounded px-2 py-1 w-full" value={roomName} onChange={e => setRoomName(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">親のメールアドレス</label>
          <input className="border rounded px-2 py-1 w-full" type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} required />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit" disabled={loading}>{loading ? '作成中...' : '部屋を作成'}</button>
      </form>
      {inviteLink && (
        <div className="mb-8 p-4 border rounded bg-white">
          <h2 className="font-semibold mb-2">招待リンク</h2>
          <div className="flex gap-2">
            <input className="border rounded px-2 py-1 flex-1" value={inviteLink} readOnly />
            <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={copyInviteLink}>コピー</button>
          </div>
        </div>
      )}
      <div>
        <h2 className="font-semibold mb-2">参加中の部屋</h2>
        <ul>
          {rooms.length === 0 && <li>部屋がありません</li>}
          {rooms.map(room => (
            <li key={room.id} className="mb-2 border-b pb-2">
              <a href={`/rooms/${room.id}`} className="text-blue-600 underline">{room.roomName}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 