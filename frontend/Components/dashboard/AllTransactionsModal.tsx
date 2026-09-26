"use client";

import { useState, useEffect } from "react";
import { X, Search, Trash2, Edit2, ArrowDownLeft, ShoppingCart, Music, Zap, Coffee, Tag, AlertCircle } from "lucide-react";

interface Transaction {
  id: string | number;
  title: string;
  category?: string;
  date: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
}

interface AllTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onTransactionDeleted: () => void;
}

export default function AllTransactionsModal({
  isOpen,
  onClose,
  onEditTransaction,
  onTransactionDeleted,
}: AllTransactionsModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [error, setError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/transactions?limit=100`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.transactions)) {
        const formatted = data.transactions.map((t: any) => ({
          id: t.id,
          title: t.title,
          category: t.category?.name || "General",
          date: t.date ? new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Today",
          amount: t.type === "INCOME" ? Number(t.amount) : -Number(t.amount),
          type: t.type,
        }));
        setTransactions(formatted);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setDeletingId(id);
    setError("");

    try {
      const res = await fetch(`${backendUrl}/transactions/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete transaction.");
      }

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      onTransactionDeleted();
    } catch (err: any) {
      setError(err.message || "Failed to delete transaction");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(search.toLowerCase()))
  );

  const getCategoryIcon = (categoryName?: string, type?: string) => {
    if (type === "INCOME") return { Icon: ArrowDownLeft, bg: "bg-emerald-50 border border-emerald-100", color: "text-emerald-500" };
    const lower = (categoryName || "").toLowerCase();
    if (lower.includes("food") || lower.includes("grocery") || lower.includes("coffee")) {
      return { Icon: ShoppingCart, bg: "bg-orange-50 border border-orange-100", color: "text-orange-500" };
    }
    if (lower.includes("entertainment") || lower.includes("music") || lower.includes("spotify")) {
      return { Icon: Music, bg: "bg-rose-50 border border-rose-100", color: "text-rose-500" };
    }
    if (lower.includes("bill") || lower.includes("utility") || lower.includes("electricity")) {
      return { Icon: Zap, bg: "bg-indigo-50 border border-indigo-100", color: "text-indigo-500" };
    }
    return { Icon: Tag, bg: "bg-slate-50 border border-slate-100", color: "text-slate-500" };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">All Transactions</h3>
          <p className="text-xs text-slate-400">View, edit, or delete your transaction history.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
          />
        </div>

        {error && (
          <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Loading transactions...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching transactions found.
            </div>
          ) : (
            filteredTransactions.map((t) => {
              const style = getCategoryIcon(t.category, t.type);
              const IconComponent = style.Icon;
              const isIncome = t.type === "INCOME" || t.amount > 0;

              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${style.bg} ${style.color} shrink-0`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{t.title}</div>
                      <div className="text-[11px] text-slate-500">
                        {t.category} • {t.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`text-sm font-bold ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>
                      {isIncome
                        ? `+$${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : `-$${Math.abs(t.amount).toFixed(2)}`}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onEditTransaction(t);
                          onClose();
                        }}
                        title="Edit transaction"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={deletingId === t.id}
                        title="Delete transaction"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
