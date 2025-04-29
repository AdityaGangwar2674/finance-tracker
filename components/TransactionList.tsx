"use client";

import { useState } from "react";
import { Trash2, Search, Filter } from "lucide-react";

export default function TransactionList({
  transactions,
}: {
  transactions: any[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirmDelete === id) {
      try {
        await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });

        window.location.reload();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    } else {
      setConfirmDelete(id);
      // Reset after 3 seconds
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

  // Extract unique categories
  const categories = ["", ...new Set(transactions.map((t) => t.category))];

  // Get category color class
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: "bg-orange-100 text-orange-800",
      Travel: "bg-green-100 text-green-800",
      Shopping: "bg-blue-100 text-blue-800",
      Utilities: "bg-yellow-100 text-yellow-800",
      Entertainment: "bg-purple-100 text-purple-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="w-full">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
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
              className="h-5 w-5 text-gray-400"
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

      {/* Transaction List */}
      <div
        className={`space-y-3 overflow-y-auto ${
          transactions.length > 5 ? "max-h-96 pr-2" : ""
        }`}
      >
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          filteredTransactions
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col">
                  {/* Date */}
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(transaction.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  {/* Description */}
                  <div className="font-medium text-gray-800">
                    {transaction.description}
                  </div>

                  {/* Category Badge */}
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
                  {/* Amount */}
                  <div className="font-semibold text-lg text-gray-900 mr-4">
                    ₹{transaction.amount}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className={`p-1.5 rounded-full ${
                      confirmDelete === transaction._id
                        ? "bg-red-100 text-red-600"
                        : "text-gray-400 hover:text-red-500 hover:bg-gray-100"
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
