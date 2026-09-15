"use client";

import { AlertCircle } from "lucide-react";

export default function MonthlyBudgetCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      {/* Header & Badge */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Monthly Budget</h3>
          <p className="text-xs text-slate-400 mt-0.5">June 2026 - $5,000 limit</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/80">
          84% used
        </span>
      </div>

      {/* Main Stat */}
      <div className="mt-4">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          $4,200
        </span>
        <span className="text-xs font-medium text-slate-400 ml-1.5">spent</span>
      </div>

      {/* Colorful Gradient Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500"
            style={{ width: "84%" }}
          />
        </div>
      </div>

      {/* Warning Notice */}
      <div className="mt-4 text-xs font-medium text-amber-600 flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
        <span>Only $800 left this month.</span>
      </div>
    </div>
  );
}
