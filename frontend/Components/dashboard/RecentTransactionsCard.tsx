"use client";

import { ShoppingCart, ArrowDownLeft, Music, Zap, Coffee, Tag, Receipt } from "lucide-react";

export interface TransactionItem {
  id: string | number;
  title: string;
  category?: string;
  date: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  iconBg?: string;
  iconColor?: string;
  icon?: any;
}

interface RecentTransactionsCardProps {
  transactions?: TransactionItem[];
  onAddTransaction?: () => void;
}

export default function RecentTransactionsCard({ transactions = [], onAddTransaction }: RecentTransactionsCardProps) {
  const list = transactions;

  const getCategoryIcon = (categoryName?: string, type?: string) => {
    if (type === "INCOME") return { Icon: ArrowDownLeft, bg: "bg-emerald-50 border border-emerald-100", color: "text-emerald-500" };
    const lower = (categoryName || "").toLowerCase();
    if (lower.includes("food") || lower.includes("grocery") || lower.includes("coffee")) {
      return { Icon: ShoppingCart, bg: "bg-orange-50 border border-orange-100", color: "text-orange-500" };
    }
    if (lower.includes("entertainment") || lower.includes("music") || lower.includes("spotify")) {
      return { Icon: Music, bg: "bg-rose-50 border border-rose-100", color: "text-rose-500" };
    }
    if (lower.includes("bill") || lower.includes("utility") || lower.includes("electricity")) {
      return { Icon: Zap, bg: "bg-indigo-50 border border-indigo-100", color: "text-indigo-500" };
    }
    return { Icon: Tag, bg: "bg-slate-50 border border-slate-100", color: "text-slate-500" };
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Recent Transactions</h3>
        {list.length > 0 && (
          <button className="text-xs font-medium text-indigo-600 hover:underline">
            View all
          </button>
        )}
      </div>

      {list.length === 0 ? (
        /* Empty State */
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mb-2.5">
            <Receipt className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">No transactions recorded yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Start logging your daily income and expense transactions to populate your feed.
          </p>
          {onAddTransaction && (
            <button
              onClick={onAddTransaction}
              className="mt-4 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
            >
              + Add Transaction
            </button>
          )}
        </div>
      ) : (
        /* Transaction List */
        <div className="space-y-3.5">
          {list.map((t) => {
            const style = getCategoryIcon(t.category, t.type);
            const IconComponent = t.icon || style.Icon;
            const isIncome = t.type === "INCOME" || t.amount > 0;
            const iconBg = t.iconBg || style.bg;
            const iconColor = t.iconColor || style.color;

            return (
              <div key={t.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  {/* Icon Container */}
                  <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} shrink-0 transition group-hover:scale-105`}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Details */}
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {t.date}
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div
                  className={`text-xs sm:text-sm font-bold ${
                    isIncome ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {isIncome ? `+$${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `-$${Math.abs(t.amount).toFixed(2)}`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
