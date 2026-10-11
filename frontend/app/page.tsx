"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">

      {/* HEADER */}
      <header className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-600 text-white rounded-md">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">SpendSmart</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-600 hover:text-slate-900 transition"
            >
              Sign in
            </Link>
            <Link
              href="/sign"
              className="text-sm px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Track your spending,<br />
            <span className="text-emerald-600">simply.</span>
          </h1>

          <p className="text-slate-500 text-lg">
            Log expenses, set a monthly budget, and see where your money goes — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/sign"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition"
            >
              Create free account
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-md transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} SpendSmart
      </footer>

    </div>
  );
}
