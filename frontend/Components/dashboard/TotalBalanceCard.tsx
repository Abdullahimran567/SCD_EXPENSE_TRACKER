"use client";

import { TrendingUp, ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";

interface TotalBalanceCardProps {
  totalBalance?: number;
  growthPercentage?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  savings?: number;
}

export default function TotalBalanceCard({
  totalBalance = 0,
  growthPercentage = 0,
  monthlyIncome = 0,
  monthlyExpenses = 0,
  savings = 0,
}: TotalBalanceCardProps) {
  const isNegative = totalBalance < 0;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
          Total Balance
        </div>
        
        {/* Main Amount & Growth Badge */}
        <div className="flex items-baseline gap-3">
          <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isNegative ? "text-rose-600" : "text-slate-900"}`}>
            ${Math.abs(totalBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            {isNegative && <span className="text-xs text-rose-500 font-semibold ml-1">(Deficit)</span>}
          </span>
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200/60">
            <TrendingUp className="w-3 h-3" />
            <span>{growthPercentage > 0 ? `+${growthPercentage}%` : `${growthPercentage}%`}</span>
          </span>
        </div>
      </div>

      {/* Sub-Metrics Section */}
      <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-slate-100">
        {/* Monthly Income */}
        <div>
          <div className="text-xs text-slate-400 font-normal mb-1">Monthly Income</div>
          <div className="text-sm sm:text-base font-bold text-emerald-600 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
            <span>${monthlyIncome.toLocaleString()}</span>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div>
          <div className="text-xs text-slate-400 font-normal mb-1">Monthly Expenses</div>
          <div className="text-sm sm:text-base font-bold text-rose-500 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <span>${monthlyExpenses.toLocaleString()}</span>
          </div>
        </div>

        {/* Savings */}
        <div>
          <div className="text-xs text-slate-400 font-normal mb-1">Savings</div>
          <div className="text-sm sm:text-base font-bold text-indigo-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>${savings.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
