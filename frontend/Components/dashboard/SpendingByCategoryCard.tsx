"use client";

export default function SpendingByCategoryCard() {
  const categories = [
    { name: "Housing", amount: 1680, color: "bg-indigo-600", stroke: "#6366f1", percent: 40 },
    { name: "Food", amount: 840, color: "bg-emerald-500", stroke: "#10b981", percent: 20 },
    { name: "Transport", amount: 630, color: "bg-amber-500", stroke: "#f59e0b", percent: 15 },
    { name: "Entertainment", amount: 420, color: "bg-rose-500", stroke: "#ef4444", percent: 10 },
    { name: "Others", amount: 630, color: "bg-slate-300", stroke: "#cbd5e1", percent: 15 },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Spending by Category</h3>
        <button className="text-xs font-medium text-indigo-600 hover:underline">
          This month
        </button>
      </div>

      {/* Donut Chart & Legend Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Donut Chart Visualization (SVG) */}
        <div className="sm:col-span-5 flex justify-center relative">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* SVG Ring Background */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="4.5"
              />
              {/* Segments calculation */}
              {/* Housing: 40% -> strokeDasharray="40 60", strokeDashoffset="0" */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#6366f1"
                strokeWidth="4.5"
                strokeDasharray="35.18 52.77"
                strokeDashoffset="0"
                className="transition-all duration-500"
              />
              {/* Food: 20% -> offset = -35.18 */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#10b981"
                strokeWidth="4.5"
                strokeDasharray="17.59 70.36"
                strokeDashoffset="-35.18"
                className="transition-all duration-500"
              />
              {/* Transport: 15% -> offset = -52.77 */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="4.5"
                strokeDasharray="13.19 74.76"
                strokeDashoffset="-52.77"
                className="transition-all duration-500"
              />
              {/* Entertainment: 10% -> offset = -65.96 */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#ef4444"
                strokeWidth="4.5"
                strokeDasharray="8.79 79.16"
                strokeDashoffset="-65.96"
                className="transition-all duration-500"
              />
              {/* Others: 15% -> offset = -74.75 */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="4.5"
                strokeDasharray="13.20 74.75"
                strokeDashoffset="-74.75"
                className="transition-all duration-500"
              />
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                TOTAL
              </span>
              <span className="text-lg font-extrabold text-slate-900 mt-0.5">
                $4,200
              </span>
            </div>
          </div>
        </div>

        {/* Legend Grid */}
        <div className="sm:col-span-7 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${cat.color} shrink-0`} />
              <span className="text-slate-500 font-medium">{cat.name}</span>
              <span className="text-slate-900 font-bold ml-auto">${cat.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
