"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="mx-auto mb-4 flex max-w-6xl items-center gap-8 border-b border-slate-400 px-4 py-2 md:px-8">
      <Link href="/" className="text-2xl tracking-tight">
        <span className="font-bold">Fin</span>
        <span className="text-slate-500">AI</span>
      </Link>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className={`rounded-md px-3 py-2 font-medium ${pathname === "/dashboard" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          Dasbor
        </Link>
        <Link
          href="/transactions"
          className={`rounded-md px-3 py-2 font-medium ${pathname === "/transactions" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          Transaksi
        </Link>
      </div>
    </nav>
  );
}
