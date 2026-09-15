"use client";

import Link from "next/link";
import { Wallet, Plus } from "lucide-react";

interface NavbarProps {
  onAddTransaction?: () => void;
}

export default function Navbar({ onAddTransaction }: NavbarProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Expense<span className="text-indigo-600">Mate</span>
          </span>
        </Link>

        {/* Right Section: User details & Actions */}
        <div className="flex items-center gap-4">
          {/* User info */}
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-slate-900">Welcome, Alex</div>
            <div className="text-xs text-slate-400">alex@example.com</div>
          </div>

          {/* Add Transaction Button */}
          <button
            onClick={onAddTransaction}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Alex Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="absolute">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
