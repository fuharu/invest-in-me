"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-gray-700 border-t mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">&copy; {new Date().getFullYear()} 私に投資して！ All rights reserved.</div>
        <div className="flex gap-6 text-sm">
          <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:underline">利用規約</Link>
          <Link href="/company" className="hover:underline">運営会社</Link>
          <Link href="/feedback" className="hover:underline">お問い合わせ</Link>
        </div>
      </div>
    </footer>
  );
} 