"use client";
import { getRoomById } from '@/lib/rooms';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Image from 'next/image';

export default function RoomDetailPage() {
  const params = useParams();
  const id = params && 'id' in params ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [notification, setNotification] = useState<string>('');
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const modalContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'rooms', id as string), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setRoom({ id: snap.id, ...data });
        setMessages(data.messages || []);
        setAnalyses(data.analyses || []);
        // 新しいメンバーが参加した場合、通知を表示
        if (data.members?.length > (room?.members?.length || 0)) {
          const newMember = data.members[data.members.length - 1];
          setNotification(`${newMember.name || newMember.uid}が参加しました！`);
          setTimeout(() => setNotification(''), 3000);
        }
      }
    });
    return () => unsub();
  }, [id, room?.members?.length]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input && !imageFile) || !user) return;
    let imageUrl = '';
    if (imageFile) {
      setUploading(true);
      const storage = getStorage();
      const fileRef = storageRef(storage, `rooms/${id}/chatImages/${Date.now()}_${imageFile.name}`);
      await uploadBytes(fileRef, imageFile);
      imageUrl = await getDownloadURL(fileRef);
      setUploading(false);
    }
    const msg = {
      text: input,
      uid: user.uid,
      name: user.displayName || '',
      createdAt: new Date(),
      imageUrl: imageUrl || '',
    };
    await updateDoc(doc(db, 'rooms', id as string), {
      messages: arrayUnion(msg),
    });
    setInput('');
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const shareAnalysis = async (analysis: any) => {
    if (!user || !id) return;
    await updateDoc(doc(db, 'rooms', id), {
      analyses: arrayUnion({
        ...analysis,
        sharedBy: user.uid,
        sharedByName: user.displayName || user.email || '',
        sharedAt: new Date(),
      }),
    });
  };

  // PDFダウンロード処理
  const handleDownloadPDF = async () => {
    if (!modalContentRef.current) return;
    const canvas = await html2canvas(modalContentRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // 画像サイズをA4に合わせて調整
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${selectedAnalysis?.title || 'analysis'}.pdf`);
  };

  // メッセージ削除処理
  const handleDeleteMessage = async (msg: any) => {
    if (!id || !user) return;
    // 画像があればStorageから削除
    if (msg.imageUrl) {
      try {
        const storage = getStorage();
        // 画像URLからパスを抽出
        const url = new URL(msg.imageUrl);
        const path = decodeURIComponent(url.pathname.replace(/^\//, ''));
        const imgRef = storageRef(storage, path);
        await deleteObject(imgRef);
      } catch (e) {
        // 画像が既に削除されていても無視
      }
    }
    // Firestoreからメッセージ削除
    await updateDoc(doc(db, 'rooms', id), {
      messages: messages.filter((m) => {
        // createdAt, uid, text, imageUrlすべて一致で判定
        return !(
          m.uid === msg.uid &&
          m.createdAt?.seconds === msg.createdAt?.seconds &&
          m.text === msg.text &&
          m.imageUrl === msg.imageUrl
        );
      })
    });
  };

  if (!user) return <div>ログインが必要です。</div>;
  if (!room) return <div>読み込み中...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* ヘッダーセクション */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{room.roomName}</h1>
        <p className="text-gray-600 mb-4">目標：{room.goal || '教育投資の検討'}</p>
        
        {/* メンバーセクション */}
        <div className="flex items-center gap-4">
          {room.members?.map((m: any, i: number) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
              <span className={`text-xl ${m.role === 'child' ? 'text-blue-500' : 'text-green-500'}`}>
                {m.role === 'child' ? '👤' : '👨‍👩‍👧‍👦'}
              </span>
              <span className="font-medium">{m.name || m.uid}</span>
              <span className="text-sm text-gray-500">({m.role === 'child' ? '子' : '親'})</span>
            </div>
          ))}
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg shadow-sm animate-fade-in">
          {notification}
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 分析履歴・資料セクション */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-500">📊</span>
            分析履歴・資料
          </h2>
          <div className="space-y-4">
            {analyses.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                分析履歴はありません
              </div>
            ) : (
              analyses.map((analysis, i) => (
                <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="font-bold text-lg mb-2">{analysis.title || '分析結果'}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    共有者: {analysis.sharedByName || analysis.sharedBy}
                    <br />
                    {new Date(analysis.sharedAt.toDate()).toLocaleString()}
                  </div>
                  <div className="text-gray-700 line-clamp-2 mb-3">{analysis.content}</div>
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    onClick={() => { setSelectedAnalysis(analysis); setShowModal(true); }}
                  >
                    <span>詳細を見る</span>
                    <span>→</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* チャットセクション */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-500">💬</span>
            チャット
          </h2>
          <div className="border rounded-lg p-4 h-[400px] overflow-y-auto bg-gray-50 mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                まずは将来の夢について話してみましょう
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="mb-4 relative group">
                  <div className={`flex items-start gap-2 ${msg.uid === user?.uid ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.uid === user?.uid ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {msg.uid === user?.uid ? '👤' : '👨‍👩‍👧‍👦'}
                    </div>
                    <div className={`flex flex-col ${msg.uid === user?.uid ? 'items-end' : 'items-start'}`}>
                      <div className="text-sm text-gray-500 mb-1">
                        {msg.name || msg.uid}
                        <span className="ml-2 text-xs">
                          {new Date(msg.createdAt.toDate()).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        msg.uid === user?.uid 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white border'
                      }`}>
                        {msg.text}
                      </div>
                      {msg.imageUrl && (
                        <div className="mt-2">
                          <img 
                            src={msg.imageUrl} 
                            alt="添付画像" 
                            className="max-w-xs max-h-40 rounded-lg border shadow-sm" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {user && msg.uid === user.uid && (
                    <button
                      className="absolute top-0 right-0 text-xs text-red-500 opacity-0 group-hover:opacity-100 bg-white bg-opacity-80 rounded-full p-1 border border-red-200 hover:bg-red-100 transition-opacity"
                      title="削除"
                      onClick={() => handleDeleteMessage(msg)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* メッセージ入力フォーム */}
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input 
                className="w-full border rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder="メッセージを入力..." 
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => fileInputRef.current?.click()}
              >
                📎
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={e => setImageFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50" 
              type="submit" 
              disabled={uploading || (!input && !imageFile)}
            >
              {uploading ? '送信中...' : '送信'}
            </button>
          </form>
          {imageFile && (
            <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
              <span>📎</span>
              <span>{imageFile.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* モーダル */}
      {showModal && selectedAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative" ref={modalContentRef}>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4">{selectedAnalysis.title || '分析結果'}</h3>
            <div className="text-sm text-gray-600 mb-4">
              共有者: {selectedAnalysis.sharedByName || selectedAnalysis.sharedBy}
              <br />
              {new Date(selectedAnalysis.sharedAt.toDate()).toLocaleString()}
            </div>
            <div className="mb-6 whitespace-pre-wrap text-gray-700">{selectedAnalysis.content}</div>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleDownloadPDF}
            >
              PDFダウンロード
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 