"use client";

import { useState } from "react";
import Navbar from "@/Components/dashboard/Navbar";
import TotalBalanceCard from "@/Components/dashboard/TotalBalanceCard";
import MonthlyBudgetCard from "@/Components/dashboard/MonthlyBudgetCard";
import SpendingByCategoryCard from "@/Components/dashboard/SpendingByCategoryCard";
import IncomeVsExpenseCard from "@/Components/dashboard/IncomeVsExpenseCard";
import RecentTransactionsCard from "@/Components/dashboard/RecentTransactionsCard";
import SavingsGoalsCard from "@/Components/dashboard/SavingsGoalsCard";
import AddTransactionModal from "@/Components/dashboard/AddTransactionModal";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Dashboard Navbar */}
      <Navbar onAddTransaction={() => setIsModalOpen(true)} />

      {/* Main Dashboard Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Top Grid: Left (Cards 1, 2, 3) & Right (Cards 4, 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (60-65% width on large screens) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Total Balance */}
            <TotalBalanceCard />

            {/* Card 2: Monthly Budget */}
            <MonthlyBudgetCard />

            {/* Card 3: Spending by Category */}
            <SpendingByCategoryCard />
          </div>

          {/* Right Column (35-40% width on large screens) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 4: Income vs. Expense Bar Chart */}
            <IncomeVsExpenseCard />

            {/* Card 5: Recent Transactions List */}
            <RecentTransactionsCard />
          </div>
        </div>

        {/* Bottom Full-Width Section (Card 6) */}
        <div className="w-full">
          {/* Card 6: Savings Goals Empty State */}
          <SavingsGoalsCard onCreateGoal={() => setIsModalOpen(true)} />
        </div>
      </main>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
