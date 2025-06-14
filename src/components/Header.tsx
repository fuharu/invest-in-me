"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // ページごとのパスとラベル
  const navLinks = [
    { href: "/howto", label: "使い方" },
    { href: "/comparison", label: "分析・比較" },
    { href: "/analysis", label: "AI分析" },
    { href: "/result", label: "プレゼン資料" },
    { href: "/dashboard", label: "ダッシュボード" },
    { href: "/feedback", label: "フィードバック" },
  ];

  return (
    <header className="w-full bg-white text-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* ロゴ */}
        <div className="flex items-center gap-2 min-w-[100px]">
          <Link href="/" className="focus:outline-none">
            <span className="font-bold text-lg tracking-tight cursor-pointer hover:text-indigo-600 transition-colors">私に投資して！</span>
          </Link>
        </div>
        {/* ナビゲーション */}
        <nav className="flex-1 flex justify-center">
          <div className="flex gap-8 text-sm font-medium">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  `hover:text-indigo-600 pb-1 transition-colors` +
                  (pathname === link.href ? " border-b-2 border-indigo-600 font-bold" : " border-b-2 border-transparent")
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
        {/* 右側ボタン */}
        <div className="flex items-center gap-3 min-w-[180px] justify-end">
          {loading ? null : user ? (
            <LogoutButton />
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-transparent border border-indigo-600 rounded text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors font-semibold"
              >
                サインアップ
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 