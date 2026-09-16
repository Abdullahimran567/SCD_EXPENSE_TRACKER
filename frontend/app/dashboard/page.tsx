"use client";

import { useState, useEffect } from "react";
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
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const fetchDashboardSummary = async () => {
    try {
      const res = await fetch(`${backendUrl}/dashboard/summary`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSummary(data.summary);
        if (data.user) setUser(data.user);
        else if (data.summary?.user) setUser(data.summary.user);
      }
    } catch (err) {
      console.error("Failed to load dashboard summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Dashboard Navbar */}
      <Navbar onAddTransaction={() => setIsModalOpen(true)} user={user} />

      {/* Main Dashboard Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Top Grid: Left (Cards 1, 2, 3) & Right (Cards 4, 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (60-65% width on large screens) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Total Balance */}
            <TotalBalanceCard
              totalBalance={summary?.totalBalance}
              growthPercentage={summary?.growthPercentage}
              monthlyIncome={summary?.monthlyIncome}
              monthlyExpenses={summary?.monthlyExpenses}
              savings={summary?.savings}
            />

            {/* Card 2: Monthly Budget */}
            <MonthlyBudgetCard budget={summary?.budget} />

            {/* Card 3: Spending by Category */}
            <SpendingByCategoryCard categories={summary?.categoryBreakdown} />
          </div>

          {/* Right Column (35-40% width on large screens) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 4: Income vs. Expense Bar Chart */}
            <IncomeVsExpenseCard data={summary?.incomeVsExpense} />

            {/* Card 5: Recent Transactions List */}
            <RecentTransactionsCard transactions={summary?.recentTransactions} />
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
        onTransactionAdded={fetchDashboardSummary}
      />
    </div>
  );
}
