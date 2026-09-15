"use client";

import { ShoppingCart, ArrowDownLeft, Music, Zap, Coffee } from "lucide-react";

export interface TransactionItem {
  id: string | number;
  title: string;
  date: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  iconBg: string;
  iconColor: string;
  icon: any;
}

export default function RecentTransactionsCard() {
  const transactions: TransactionItem[] = [
    {
      id: 1,
      title: "Grocery Store",
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
      date: "May 21, 2026",
      amount: -6.50,
      type: "EXPENSE",
      iconBg: "bg-amber-50 border border-amber-100",
      iconColor: "text-amber-500",
      icon: Coffee,
    },
  ];

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
        {transactions.map((t) => {
          const IconComponent = t.icon;
          const isIncome = t.type === "INCOME";

          return (
            <div key={t.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                {/* Icon Container */}
                <div className={`p-2.5 rounded-xl ${t.iconBg} ${t.iconColor} shrink-0 transition group-hover:scale-105`}>
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
                {isIncome ? `+$${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `-$${Math.abs(t.amount).toFixed(2)}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
