"use client";

import { PieChart } from "lucide-react";

interface CategoryItem {
  name: string;
  amount: number;
  percentage: number;
  color?: string;
}

interface SpendingByCategoryCardProps {
  categories?: CategoryItem[];
}

export default function SpendingByCategoryCard({ categories = [] }: SpendingByCategoryCardProps) {
  const hasData = categories && categories.length > 0 && categories.some(c => c.amount > 0);
  const totalAmount = categories.reduce((acc, c) => acc + c.amount, 0);

  const getBgColor = (idx: number, customColor?: string) => {
    if (customColor && customColor.startsWith("bg-")) return customColor;
    const colors = ["bg-indigo-600", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-blue-500", "bg-slate-400"];
    return colors[idx % colors.length];
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Spending by Category</h3>
        <span className="text-xs font-medium text-slate-400">
          This month
        </span>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mb-2.5">
            <PieChart className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">No category spending yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Log your first expense transaction to view an automated breakdown by category.
          </p>
        </div>
      ) : (
        /* Donut Chart & Legend Layout */
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Donut Chart Visualization (SVG) */}
          <div className="sm:col-span-5 flex justify-center relative">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="4.5"
                />
                {categories.map((cat, idx) => {
                  // Calculate dynamic strokeDasharray & strokeDashoffset
                  const previousPercentageSum = categories.slice(0, idx).reduce((sum, c) => sum + c.percentage, 0);
                  const dashLength = (cat.percentage / 100) * 87.96; // 2 * pi * 14 = 87.96
                  const spaceLength = 87.96 - dashLength;
                  const offset = -(previousPercentageSum / 100) * 87.96;
                  const strokeColor = cat.color?.startsWith("#") ? cat.color : (["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"][idx % 5]);

                  return (
                    <circle
                      key={cat.name}
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="4.5"
                      strokeDasharray={`${dashLength} ${spaceLength}`}
                      strokeDashoffset={offset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>

              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  TOTAL
                </span>
                <span className="text-lg font-extrabold text-slate-900 mt-0.5">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="sm:col-span-7 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
            {categories.map((cat, idx) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${getBgColor(idx, cat.color)} shrink-0`} />
                <span className="text-slate-500 font-medium truncate">{cat.name}</span>
                <span className="text-slate-900 font-bold ml-auto">${cat.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
