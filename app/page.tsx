"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyChart from "@/components/MonthlyCharts";
import CategoryPieChart from "@/components/CategoryPieCharts";
import BudgetForm from "@/components/BudgetForm";
import BudgetVsActualChart from "@/components/BudgetVsActualChart";

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-02");
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  const fetchBudgets = async () => {
    if (!selectedMonth) return;

    const res = await fetch(`/api/budget?month=${selectedMonth}`);
    const data = await res.json();

    if (Array.isArray(data)) {
      setBudgets(data);
    } else {
      setBudgets([]);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, [selectedMonth]);

  const monthlyData = transactions.reduce((acc: any, transaction: any) => {
    const month = new Date(transaction.date).toLocaleString("default", {
      month: "short",
    });
    const existing = acc.find((item: any) => item.month === month);
    if (existing) existing.total += transaction.amount;
    else acc.push({ month, total: transaction.amount });
    return acc;
  }, []);

  const categoryData = transactions.reduce((acc: any, transaction: any) => {
    const existing = acc.find(
      (item: any) => item.category === transaction.category
    );
    if (existing) existing.total += transaction.amount;
    else
      acc.push({ category: transaction.category, total: transaction.amount });
    return acc;
  }, []);

  const totalExpenses = transactions.reduce(
    (sum: number, transaction: any) => sum + transaction.amount,
    0
  );

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
  };

  const getBudgetVsActualData = () => {
    return budgets.map((budget: any) => {
      const actualSpending = transactions
        .filter(
          (t: any) =>
            t.category === budget.category && t.date.startsWith(selectedMonth)
        )
        .reduce((sum: number, transaction: any) => sum + transaction.amount, 0);
      return {
        category: budget.category,
        budget: budget.amount,
        actual: actualSpending,
      };
    });
  };

  const TABS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "transactions", label: "Add Transaction" },
    { id: "budget", label: "Set Budget" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <header className="bg-white shadow-md py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Finesse Finance
              </h1>
              <p className="text-gray-500 mt-2">
                Your personal finance companion
              </p>
            </div>

            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">
                  Total Expenses
                </h3>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ₹{totalExpenses.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">
                  Top Category
                </h3>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {categoryData.length > 0
                    ? categoryData.reduce(
                        (prev: any, curr: any) =>
                          curr.total > prev.total ? curr : prev,
                        { category: "None", total: 0 }
                      ).category
                    : "None"}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">
                  On Budget
                </h3>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {budgets.filter((budget: any) => {
                    const actualSpending = transactions
                      .filter((t: any) => t.category === budget.category)
                      .reduce(
                        (sum: number, transaction: any) =>
                          sum + transaction.amount,
                        0
                      );
                    return actualSpending <= budget.amount;
                  }).length || 0}{" "}
                  <span className="text-gray-400 text-lg font-normal">
                    categories
                  </span>
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">
                  Over Budget
                </h3>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {budgets.filter((budget: any) => {
                    const actualSpending = transactions
                      .filter(
                        (t: any) =>
                          t.category === budget.category &&
                          t.date.startsWith(selectedMonth)
                      )
                      .reduce(
                        (sum: number, transaction: any) =>
                          sum + transaction.amount,
                        0
                      );
                    return actualSpending > budget.amount;
                  }).length || 0}{" "}
                  <span className="text-gray-400 text-lg font-normal">
                    categories
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full overflow-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center sticky top-0 bg-white pt-1 pb-2">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                  Recent Transactions
                </h3>
                <div className="h-96 overflow-y-auto">
                  <TransactionList transactions={transactions.slice(0, 5)} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                  Monthly Expenses
                </h3>
                <div className="mt-15">
                  <MonthlyChart data={monthlyData} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                Category Breakdown
              </h3>
              <CategoryPieChart data={categoryData} />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                  Budget vs Actual
                </h3>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="mt-2 sm:mt-0 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <BudgetVsActualChart
                data={budgets.map((budget: any) => {
                  const actualSpending = transactions
                    .filter(
                      (t: any) =>
                        t.category === budget.category &&
                        t.date.startsWith(selectedMonth)
                    )
                    .reduce(
                      (sum: number, transaction: any) =>
                        sum + transaction.amount,
                      0
                    );
                  return {
                    category: budget.category,
                    budget: budget.amount,
                    actual: actualSpending,
                  };
                })}
              />
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <TransactionForm onAdd={fetchTransactions} />
          </div>
        )}

        {activeTab === "budget" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <BudgetForm onAdd={fetchBudgets} />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                Monthly Spending Trends
              </h3>
              <MonthlyChart data={monthlyData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                  Category Breakdown
                </h3>
                <div className="flex-grow">
                  <CategoryPieChart data={categoryData} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                    Budget Performance
                  </h3>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  />
                </div>
                <div className="flex-grow overflow-hidden">
                  <BudgetVsActualChart data={getBudgetVsActualData()} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                All Transactions
              </h3>
              <TransactionList transactions={transactions} />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white py-6 mt-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Finesse Finance © 2025 | Your Personal Finance Companion</p>
        </div>
      </footer>
    </div>
  );
}
