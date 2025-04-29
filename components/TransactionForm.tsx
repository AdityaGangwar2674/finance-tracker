"use client";

import { useState } from "react";
import { Calendar, CreditCard, Tag, FileText, Send } from "lucide-react";

export default function TransactionForm({ onAdd }: { onAdd?: () => void }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const transaction = {
      amount: parseFloat(amount),
      date,
      description,
      category,
    };

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });

      if (res.ok) {
        setAmount("");
        setDate("");
        setDescription("");
        setCategory("");
        if (onAdd) onAdd();
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "Food", label: "Food" },
    { value: "Travel", label: "Travel" },
    { value: "Shopping", label: "Shopping" },
    { value: "Utilities", label: "Utilities" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        New Transaction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <div className="absolute inset-y-0 left-11 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="block w-full pl-16 pr-3 py-3 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-600 bg-gray-50 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="block w-full pl-12 pr-3 py-3 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-600 bg-gray-50 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="block w-full pl-12 pr-3 py-3 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-600 bg-gray-50 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="block w-full pl-12 pr-3 py-3 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-600 bg-gray-50 rounded-lg appearance-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-all duration-150"
        >
          {isSubmitting ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <Send className="h-5 w-5 mr-2" />
          )}
          {isSubmitting ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
}
