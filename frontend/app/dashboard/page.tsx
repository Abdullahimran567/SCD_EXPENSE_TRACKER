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
import AddCategoryModal from "@/Components/dashboard/AddCategoryModal";
import EditTransactionModal from "@/Components/dashboard/EditTransactionModal";
import AllTransactionsModal from "@/Components/dashboard/AllTransactionsModal";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAllTransactionsModalOpen, setIsAllTransactionsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const [summary, setSummary] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${backendUrl}/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
    fetchCategories();
  }, []);

  const handleCategoryAdded = () => {
    fetchCategories();
    fetchDashboardSummary();
  };

  const handleOpenEdit = (tx: any) => {
    setEditingTransaction(tx);
    setIsEditModalOpen(true);
  };

  const handleDeleteTransaction = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const res = await fetch(`${backendUrl}/transactions/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchDashboardSummary();
      } else {
        alert(data.message || "Failed to delete transaction");
      }
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Dashboard Navbar */}
      <Navbar
        onAddTransaction={() => setIsModalOpen(true)}
        onAddCategory={() => setIsCategoryModalOpen(true)}
        user={user}
      />

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
            <IncomeVsExpenseCard
              data={summary?.incomeVsExpense}
              hasChartData={summary?.hasChartData}
            />

            {/* Card 5: Recent Transactions List */}
            <RecentTransactionsCard
              transactions={summary?.recentTransactions}
              onAddTransaction={() => setIsModalOpen(true)}
              onEditTransaction={handleOpenEdit}
              onDeleteTransaction={handleDeleteTransaction}
              onViewAll={() => setIsAllTransactionsModalOpen(true)}
            />
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
        onOpenAddCategory={() => setIsCategoryModalOpen(true)}
        categoriesList={categories}
      />

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction}
        onTransactionUpdated={fetchDashboardSummary}
        categoriesList={categories}
      />

      {/* All Transactions Modal */}
      <AllTransactionsModal
        isOpen={isAllTransactionsModalOpen}
        onClose={() => setIsAllTransactionsModalOpen(false)}
        onEditTransaction={handleOpenEdit}
        onTransactionDeleted={fetchDashboardSummary}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
}
