"use client";

import { useState, useEffect } from "react";
import { X, Save, DollarSign, AlertCircle, Trash2 } from "lucide-react";

interface Transaction {
  id: string | number;
  title: string;
  category?: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date?: string;
}

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onTransactionUpdated: () => void;
  categoriesList?: Array<{ id: string | number; name: string; type: string }>;
}

export default function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  onTransactionUpdated,
  categoriesList = [],
}: EditTransactionModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title || "");
      setAmount(Math.abs(transaction.amount).toString());
      setCategory(transaction.category || "General");
      setType(transaction.type || (transaction.amount > 0 ? "INCOME" : "EXPENSE"));
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const defaultCategories = [
    { name: "Housing", type: "EXPENSE" },
    { name: "Food", type: "EXPENSE" },
    { name: "Transport", type: "EXPENSE" },
    { name: "Entertainment", type: "EXPENSE" },
    { name: "Bills", type: "EXPENSE" },
    { name: "Income", type: "INCOME" },
    { name: "Others", type: "EXPENSE" },
    { name: "General", type: "EXPENSE" },
  ];

  const categoriesToDisplay = categoriesList.length > 0 ? categoriesList : defaultCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/transactions/${transaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          amount: parseFloat(amount),
          type,
          categoryName: category,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update transaction.");
      }

      onTransactionUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Edit Transaction</h3>
          <p className="text-xs text-slate-400">Update transaction details below.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Title / Description
            </label>
            <input
              type="text"
              required
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Amount ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "EXPENSE" | "INCOME")}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
              >
                <option value="EXPENSE">Expense (-)</option>
                <option value="INCOME">Income (+)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-600 capitalize"
            >
              {categoriesToDisplay.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
