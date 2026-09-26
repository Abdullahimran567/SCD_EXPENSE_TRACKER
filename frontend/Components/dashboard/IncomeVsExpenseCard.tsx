"use client";

import { BarChart2 } from "lucide-react";

interface MonthChartItem {
  month: string;
  income: number;
  expense: number;
}

interface IncomeVsExpenseCardProps {
  data?: MonthChartItem[];
  hasChartData?: boolean;
}

export default function IncomeVsExpenseCard({ data = [], hasChartData = false }: IncomeVsExpenseCardProps) {
  const chartData = data;
  const isDataAvailable = hasChartData || (chartData.length > 0 && chartData.some((d) => d.income > 0 || d.expense > 0));
  const maxVal = Math.max(...chartData.map((d) => Math.max(d.income, d.expense)), 100);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full min-h-[300px]">
      {/* Header & Legend */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Income vs. Expense</h3>
          <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
        </div>

        {/* Legend */}
        {isDataAvailable && (
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-200" />
              <span>Expense</span>
            </div>
          </div>
        )}
      </div>

      {!isDataAvailable ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mb-2.5">
            <BarChart2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">No monthly trends recorded</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Income and expense comparison bars will automatically populate over time as transactions are recorded.
          </p>
        </div>
      ) : (
        /* Bar Chart Container */
        <div className="mt-4 flex-1 flex flex-col justify-end">
          {/* Y Axis Grid lines & Bars */}
          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-200 relative">
            <div className="absolute inset-x-0 top-0 border-b border-slate-100 border-dashed pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 border-b border-slate-100 border-dashed pointer-events-none" />

            {chartData.map((d) => {
              const incomeHeight = maxVal > 0 ? `${(d.income / maxVal) * 100}%` : "0%";
              const expenseHeight = maxVal > 0 ? `${(d.expense / maxVal) * 100}%` : "0%";

              return (
                <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-md pointer-events-none z-10 whitespace-nowrap">
                    Inc: ${d.income.toLocaleString()} | Exp: ${d.expense.toLocaleString()}
                  </div>

                  {/* Dual Bars */}
                  <div className="flex items-end gap-1.5 w-full justify-center h-full">
                    <div
                      className="w-2.5 sm:w-3.5 bg-indigo-600 rounded-t-sm transition-all duration-300 hover:bg-indigo-700 min-h-[2px]"
                      style={{ height: d.income > 0 ? incomeHeight : "2px" }}
                    />
                    <div
                      className="w-2.5 sm:w-3.5 bg-indigo-200 rounded-t-sm transition-all duration-300 hover:bg-indigo-300 min-h-[2px]"
                      style={{ height: d.expense > 0 ? expenseHeight : "2px" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between gap-2 px-2 mt-2 text-xs font-medium text-slate-400">
            {chartData.map((d) => (
              <div key={d.month} className="flex-1 text-center">
                {d.month}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
