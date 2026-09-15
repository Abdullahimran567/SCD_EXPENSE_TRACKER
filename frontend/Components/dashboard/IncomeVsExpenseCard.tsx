"use client";

export default function IncomeVsExpenseCard() {
  const chartData = [
    { month: "Jan", income: 5800, expense: 3800 },
    { month: "Feb", income: 6100, expense: 4100 },
    { month: "Mar", income: 5900, expense: 3900 },
    { month: "Apr", income: 6200, expense: 4300 },
    { month: "May", income: 6300, expense: 4000 },
    { month: "Jun", income: 6400, expense: 4200 },
  ];

  const maxVal = 7000;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header & Legend */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Income vs. Expense</h3>
          <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
        </div>

        {/* Legend */}
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
      </div>

      {/* Bar Chart Container */}
      <div className="mt-4 flex-1 flex flex-col justify-end">
        {/* Y Axis Grid lines & Bars */}
        <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-200 relative">
          {/* Y Axis Grid line overlays */}
          <div className="absolute inset-x-0 top-0 border-b border-slate-100 border-dashed pointer-events-none" />
          <div className="absolute inset-x-0 top-1/2 border-b border-slate-100 border-dashed pointer-events-none" />

          {chartData.map((d) => {
            const incomeHeight = `${(d.income / maxVal) * 100}%`;
            const expenseHeight = `${(d.expense / maxVal) * 100}%`;

            return (
              <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on Hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-md pointer-events-none z-10 whitespace-nowrap">
                  Inc: ${d.income} | Exp: ${d.expense}
                </div>

                {/* Dual Bars */}
                <div className="flex items-end gap-1.5 w-full justify-center h-full">
                  {/* Income Bar */}
                  <div
                    className="w-2.5 sm:w-3.5 bg-indigo-600 rounded-t-sm transition-all duration-300 hover:bg-indigo-700"
                    style={{ height: incomeHeight }}
                  />
                  {/* Expense Bar */}
                  <div
                    className="w-2.5 sm:w-3.5 bg-indigo-200 rounded-t-sm transition-all duration-300 hover:bg-indigo-300"
                    style={{ height: expenseHeight }}
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
    </div>
  );
}
