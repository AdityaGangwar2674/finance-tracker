"use client";

import { useState } from "react";
import { Calendar, DollarSign, Tag, BarChart3 } from "lucide-react";

const BudgetForm = ({ onAdd }: { onAdd: () => void }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [month, setMonth] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!category || !amount || !month) {
      alert("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          amount,
          month,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const successMessage = document.getElementById("success-message");
        if (successMessage) {
          successMessage.classList.remove("hidden");
          setTimeout(() => {
            successMessage.classList.add("hidden");
          }, 3000);
        }

        onAdd();
        setCategory("");
        setAmount(0);
        setMonth("");
      } else {
        alert(data.error || "Failed to add budget");
      }
    } catch (error) {
      console.error("Error setting budget:", error);
      alert("An error occurred while setting the budget.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        Monthly Budget
      </h2>

      <div
        id="success-message"
        className="hidden bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded"
        role="alert"
      >
        <div className="flex">
          <div className="py-1">
            <svg
              className="h-6 w-6 text-green-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium">Budget set successfully!</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              className="block w-full pl-12 pr-3 py-3 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-600 bg-gray-50 rounded-lg appearance-none"
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Budget Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <div className="absolute inset-y-0 left-11 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
              className="block w-full pl-16 pr-3 py-3 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-600 bg-gray-50 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Month
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="block w-full pl-12 pr-3 py-3 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-600 bg-gray-50 rounded-lg"
            />
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
            <BarChart3 className="h-5 w-5 mr-2" />
          )}
          {isSubmitting ? "Setting..." : "Set Budget"}
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;
