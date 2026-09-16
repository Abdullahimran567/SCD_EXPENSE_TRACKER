"use client";

import { ShoppingCart, ArrowDownLeft, Music, Zap, Coffee, DollarSign, Tag } from "lucide-react";

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
}

export default function RecentTransactionsCard({ transactions }: RecentTransactionsCardProps) {
  const defaultTransactions: TransactionItem[] = [
    {
      id: 1,
      title: "Grocery Store",
      category: "Food & Dining",
      date: "May 28, 2026",
      amount: -120.50,
      type: "EXPENSE",
      iconBg: "bg-orange-50 border border-orange-100",
      iconColor: "text-orange-500",
      icon: ShoppingCart,
    },
    {
      id: 2,
      title: "Salary Deposit",
      category: "Income",
      date: "May 25, 2026",
      amount: 3200.00,
      type: "INCOME",
      iconBg: "bg-emerald-50 border border-emerald-100",
      iconColor: "text-emerald-500",
      icon: ArrowDownLeft,
    },
    {
      id: 3,
      title: "Spotify Premium",
      category: "Entertainment",
      date: "May 24, 2026",
      amount: -11.99,
      type: "EXPENSE",
      iconBg: "bg-rose-50 border border-rose-100",
      iconColor: "text-rose-500",
      icon: Music,
    },
    {
      id: 4,
      title: "Electricity Bill",
      category: "Bills",
      date: "May 22, 2026",
      amount: -145.00,
      type: "EXPENSE",
      iconBg: "bg-indigo-50 border border-indigo-100",
      iconColor: "text-indigo-500",
      icon: Zap,
    },
    {
      id: 5,
      title: "Starbucks Coffee",
      category: "Food & Dining",
      date: "May 21, 2026",
      amount: -6.50,
      type: "EXPENSE",
      iconBg: "bg-amber-50 border border-amber-100",
      iconColor: "text-amber-500",
      icon: Coffee,
    },
  ];

  const list = transactions && transactions.length > 0 ? transactions : defaultTransactions;

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
        <button className="text-xs font-medium text-indigo-600 hover:underline">
          View all
        </button>
      </div>

      {/* Transaction List */}
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
    </div>
  );
}
