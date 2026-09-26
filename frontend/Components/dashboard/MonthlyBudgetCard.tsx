"use client";

import { AlertCircle, PlusCircle } from "lucide-react";

interface MonthlyBudgetCardProps {
  budget?: {
    limit: number;
    spent: number;
    percentageUsed: number;
    remaining: number;
    isSet?: boolean;
    monthName?: string;
    year?: number;
  };
  onSetBudget?: () => void;
}

export default function MonthlyBudgetCard({ budget, onSetBudget }: MonthlyBudgetCardProps) {
  const isSet = budget?.isSet ?? (budget?.limit ? budget.limit > 0 : false);
  const limit = budget?.limit ?? 0;
  const spent = budget?.spent ?? 0;
  const percentageUsed = budget?.percentageUsed ?? 0;
  const remaining = budget?.remaining ?? 0;
  const monthName = budget?.monthName ?? new Date().toLocaleString("en-US", { month: "long" });
  const year = budget?.year ?? new Date().getFullYear();

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      {/* Header & Badge */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Monthly Budget</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {monthName} {year} {isSet ? `- $${limit.toLocaleString()} limit` : "(No limit set)"}
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
          isSet 
            ? percentageUsed > 90 
              ? "bg-rose-50 text-rose-700 border-rose-200" 
              : "bg-amber-50 text-amber-700 border-amber-200/80" 
            : "bg-slate-100 text-slate-500 border-slate-200"
        }`}>
          {isSet ? `${percentageUsed}% used` : "Unset"}
        </span>
      </div>

      {/* Main Stat */}
      <div className="mt-4">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          ${spent.toLocaleString()}
        </span>
        <span className="text-xs font-medium text-slate-400 ml-1.5">spent</span>
      </div>

      {/* Colorful Gradient Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500"
            style={{ width: `${Math.min(100, percentageUsed)}%` }}
          />
        </div>
      </div>

      {/* Notice / Empty state info */}
      <div className="mt-4 text-xs font-medium flex items-center justify-between">
        {isSet ? (
          <div className="text-amber-600 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span>Only ${remaining.toLocaleString()} left this month.</span>
          </div>
        ) : (
          <div className="text-slate-500 flex items-center gap-1.5 w-full justify-between">
            <span>No monthly budget cap set yet.</span>
            {onSetBudget && (
              <button
                onClick={onSetBudget}
                className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Set Budget</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
