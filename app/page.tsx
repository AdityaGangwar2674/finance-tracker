"use client";

import { useState, useEffect, useCallback } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyChart from "@/components/MonthlyCharts";
import CategoryPieChart from "@/components/CategoryPieCharts";
import BudgetForm from "@/components/BudgetForm";
import BudgetVsActualChart from "@/components/BudgetVsActualChart";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToastContainer, useToast } from "@/components/Toast";
import { UserMenu } from "@/components/UserMenu";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { toasts, addToast, removeToast } = useToast();
  const router = useRouter();
  const isSameMonth = (date: string) => {
    const d = new Date(date);
    return (
      d.getFullYear() === parseInt(selectedMonth.split("-")[0]) &&
      d.getMonth() + 1 === parseInt(selectedMonth.split("-")[1])
    );
  };

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch("/api/transactions");
      if (res.status === 401) return router.push("/login");
      const data = await res.json();
      setTransactions(data);
    } catch {
      addToast("Failed to load transactions", "error");
    }
  }, [router, addToast]);

  const fetchBudgets = useCallback(async () => {
    if (!selectedMonth) return;
    try {
      const res = await fetch(`/api/budget?month=${selectedMonth}`);
      if (res.status === 401) return router.push("/login");
      const data = await res.json();
      if (Array.isArray(data)) setBudgets(data);
      else setBudgets([]);
    } catch {
      addToast("Failed to load budgets", "error");
    }
  }, [selectedMonth, router, addToast]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return router.push("/login");

        const data = await res.json();
        setUser(data.user);

        await Promise.all([fetchTransactions(), fetchBudgets()]);
      } catch {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    init();
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
      (item: any) => item.category === transaction.category,
    );
    if (existing) existing.total += transaction.amount;
    else
      acc.push({ category: transaction.category, total: transaction.amount });
    return acc;
  }, []);

  const monthlyExpenses = transactions
    .filter((t: any) => isSameMonth(t.date))
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const monthlyCategoryData = transactions
    .filter((t: any) => isSameMonth(t.date))
    .reduce((acc: any, t: any) => {
      const existing = acc.find((item: any) => item.category === t.category);
      if (existing) existing.total += t.amount;
      else acc.push({ category: t.category, total: t.amount });
      return acc;
    }, []);

  const topCategoryThisMonth =
    monthlyCategoryData.length > 0
      ? monthlyCategoryData.reduce(
          (prev: any, curr: any) => (curr.total > prev.total ? curr : prev),
          { category: "None", total: 0 },
        ).category
      : "None";

  const daysInMonth = new Date(
    parseInt(selectedMonth.split("-")[0]),
    parseInt(selectedMonth.split("-")[1]),
    0,
  ).getDate();
  const avgDailySpend = daysInMonth > 0 ? monthlyExpenses / daysInMonth : 0;

  const selectedMonthLabel = new Date(selectedMonth + "-02").toLocaleString(
    "default",
    { month: "long", year: "numeric" },
  );

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
  };

  const getBudgetVsActualData = () => {
    return budgets.map((budget: any) => {
      const actualSpending = transactions
        .filter(
          (t: any) =>
            t.category === budget.category && isSameMonth(t.date),
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-950 dark:to-zinc-900 min-h-screen transition-colors duration-300">
      <header className="bg-white dark:bg-zinc-900 shadow-sm dark:shadow-zinc-800/50 py-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 sm:mb-0">
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {user && <UserMenu user={user} />}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-6 mt-4 sm:mt-0">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Finesse Finance
              </h1>
              <p className="text-gray-500 mt-2">
                Your personal finance companion
              </p>
            </div>

            <nav className="flex space-x-1 bg-gray-100 dark:bg-zinc-800/50 p-1 rounded-xl">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-zinc-800/50">
                <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">
                  This Month
                </h3>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ₹{monthlyExpenses.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                  {selectedMonthLabel}
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-zinc-800/50">
                <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">
                  Top Category
                </h3>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {topCategoryThisMonth}
                </p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                  this month
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-zinc-800/50">
                <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">
                  On Budget
                </h3>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {budgets.filter((budget: any) => {
                    const actualSpending = transactions
                      .filter(
                        (t: any) =>
                          t.category === budget.category &&
                          isSameMonth(t.date),
                      )
                      .reduce(
                        (sum: number, transaction: any) =>
                          sum + transaction.amount,
                        0,
                      );
                    return actualSpending <= budget.amount;
                  }).length || 0}{" "}
                  <span className="text-gray-400 text-lg font-normal">
                    categories
                  </span>
                </p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                  this month
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-zinc-800/50">
                <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">
                  Over Budget
                </h3>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {budgets.filter((budget: any) => {
                    const actualSpending = transactions
                      .filter(
                        (t: any) =>
                          t.category === budget.category &&
                          isSameMonth(t.date),
                      )
                      .reduce(
                        (sum: number, transaction: any) =>
                          sum + transaction.amount,
                        0,
                      );
                    return actualSpending > budget.amount;
                  }).length || 0}{" "}
                  <span className="text-gray-400 text-lg font-normal">
                    categories
                  </span>
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-zinc-800/50">
                <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">
                  Avg Daily Spend
                </h3>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
                  ₹{Math.round(avgDailySpend).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                  per day this month
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800/50 h-full overflow-auto">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-4 flex items-center sticky top-0 bg-white dark:bg-zinc-900 pt-1 pb-2">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                  Recent Transactions
                </h3>
                <div className="h-96 overflow-y-auto">
                  <TransactionList
                    transactions={transactions.slice(0, 5)}
                    onDelete={() => {
                      fetchTransactions();
                      addToast("Transaction deleted", "info");
                    }}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800/50">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                  Monthly Expenses
                </h3>
                <div className="mt-15">
                  <MonthlyChart data={monthlyData} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800/50">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-4 flex items-center">
                <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                Category Breakdown
              </h3>
              <CategoryPieChart data={categoryData} />
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800/50">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 flex items-center">
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
                        isSameMonth(t.date),
                    )
                    .reduce(
                      (sum: number, transaction: any) =>
                        sum + transaction.amount,
                      0,
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
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800/50 max-w-2xl mx-auto">
            <TransactionForm
              onAdd={() => {
                fetchTransactions();
                addToast("Transaction added successfully!", "success");
              }}
            />
          </div>
        )}

        {activeTab === "budget" && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800/50 max-w-2xl mx-auto">
            <BudgetForm
              onAdd={() => {
                fetchBudgets();
                addToast("Budget set successfully!", "success");
              }}
            />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800/50">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-6 flex items-center">
                <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                Monthly Spending Trends
              </h3>
              <MonthlyChart data={monthlyData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800/50 flex flex-col h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                  Category Breakdown
                </h3>
                <div className="flex-grow">
                  <CategoryPieChart data={categoryData} />
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800/50 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 flex items-center">
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

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800/50">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-6 flex items-center">
                <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                All Transactions
              </h3>
              <TransactionList
                transactions={transactions}
                onDelete={() => {
                  fetchTransactions();
                  addToast("Transaction deleted", "info");
                }}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-zinc-900 py-6 mt-12 border-t border-gray-100 dark:border-zinc-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Finesse Finance © 2026 | Your Personal Finance Companion</p>
        </div>
      </footer>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-40 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600 dark:text-zinc-400 font-medium">
              Loading your data...
            </p>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
