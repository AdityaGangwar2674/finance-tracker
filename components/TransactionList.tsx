"use client";

import { useState } from "react";
import { Trash2, Search, Filter } from "lucide-react";

export default function TransactionList({
  transactions,
  onDelete,
}: {
  transactions: any[];
  onDelete?: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirmDelete === id) {
      setDeletingId(id);
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });
        if (res.ok && onDelete) onDelete();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      } finally {
        setDeletingId(null);
        setConfirmDelete(null);
      }
    } else {
      setConfirmDelete(id);
      setTimeout(() => {
        setConfirmDelete(null);
      }, 3000);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || transaction.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["", ...new Set(transactions.map((t) => t.category))];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      Travel: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Shopping: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Utilities: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      Entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Other: "bg-gray-100 text-gray-800 dark:bg-zinc-800/50 dark:text-zinc-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-zinc-800/50 dark:text-zinc-300";
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 dark:text-zinc-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="block w-full pl-10 pr-8 py-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 dark:text-zinc-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 appearance-none"
          >
            <option value="">All Categories</option>
            {categories
              .filter((cat) => cat !== "")
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400 dark:text-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        className={`space-y-3 overflow-y-auto ${
          transactions.length > 5 ? "max-h-96 pr-2" : ""
        }`}
      >
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-zinc-800/30 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700">
            <p className="text-gray-500 dark:text-zinc-400">No transactions found</p>
          </div>
        ) : (
          filteredTransactions
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
                    {new Date(transaction.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  <div className="font-medium text-gray-800 dark:text-zinc-200">
                    {transaction.description}
                  </div>

                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                        transaction.category
                      )}`}
                    >
                      {transaction.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="font-semibold text-lg text-gray-900 dark:text-zinc-100 mr-4">
                    ₹{transaction.amount}
                  </div>

                  <button
                    onClick={() => handleDelete(transaction._id)}
                    disabled={deletingId === transaction._id}
                    title={confirmDelete === transaction._id ? "Click again to confirm" : "Delete"}
                    className={`p-1.5 rounded-full transition-all ${
                      deletingId === transaction._id
                        ? "opacity-50 cursor-not-allowed"
                        : confirmDelete === transaction._id
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse"
                        : "text-gray-400 dark:text-zinc-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
