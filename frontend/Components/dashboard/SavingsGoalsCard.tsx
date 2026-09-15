"use client";

import { Target, Plus } from "lucide-react";

interface SavingsGoalsCardProps {
  onCreateGoal?: () => void;
}

export default function SavingsGoalsCard({ onCreateGoal }: SavingsGoalsCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 sm:p-12 shadow-xs text-center flex flex-col items-center justify-center">
      {/* Icon Circle */}
      <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
        <Target className="w-6 h-6" />
      </div>

      {/* Main Empty State Text */}
      <h3 className="text-base font-bold text-slate-900">
        No recent savings goals
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1.5 leading-relaxed">
        Set a target like a vacation fund or emergency savings and watch your progress grow over time.
      </p>

      {/* Action Button */}
      <button
        onClick={onCreateGoal}
        className="mt-5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition shadow-2xs flex items-center gap-1.5"
      >
        <Plus className="w-4 h-4 text-slate-500" />
        <span>Create Savings Goal</span>
      </button>
    </div>
  );
}
