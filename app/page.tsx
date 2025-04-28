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
      setBudgets([]); // Fallback to empty array if not an array
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-blue-600">
          Personal Finance Visualizer
        </h1>
        <p className="text-gray-500 text-md">
          Track your spending. Stay in control.
        </p>
      </div>

      {/* Transaction Form + Budget Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Transaction Form */}
        <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col justify-between min-h-[420px] hover:shadow-lg transition">
          <TransactionForm onAdd={fetchTransactions} />
        </div>

        {/* Budget Form */}
        <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col justify-between min-h-[420px] hover:shadow-lg transition">
          <BudgetForm onAdd={fetchBudgets} />
        </div>
      </div>

      {/* Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <TransactionList transactions={transactions} />
        <MonthlyChart data={monthlyData} />
      </div>

      {/* Category Breakdown */}
      <CategoryPieChart data={categoryData} />

      {/* Budget vs Actual */}
      <div className="mt-12 bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
        <h3 className="text-2xl font-semibold text-center mb-6">
          Budget vs Actual Comparison
        </h3>
        <div className="mt-4 flex justify-center">
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border rounded-md"
          />
        </div>
        <BudgetVsActualChart
          data={budgets.map((budget: any) => {
            const actualSpending = transactions
              .filter((t: any) => t.category === budget.category)
              .reduce(
                (sum: number, transaction: any) => sum + transaction.amount,
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

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {/* Total Expenses */}
        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-center items-center">
          <h3 className="text-xl font-semibold mb-4">Total Expenses</h3>
          <p className="text-5xl font-bold text-blue-600">₹ {totalExpenses}</p>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Category Breakdown
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-4">
            <ul className="space-y-2">
              {categoryData.map((cat: any) => (
                <li key={cat.category} className="flex justify-between">
                  <p className="font-medium">{cat.category}</p>
                  <p className="text-blue-500 font-semibold">₹ {cat.total}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Most Recent Transactions */}
        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Most Recent Transactions
          </h3>
          <ul className="space-y-4">
            {transactions
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .slice(0, 5)
              .map((transaction) => (
                <li key={transaction._id} className="flex justify-between">
                  <p>{transaction.description}</p>
                  <p className="text-blue-500 font-semibold">
                    ₹ {transaction.amount}
                  </p>
                </li>
              ))}
          </ul>
        </div>
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Spending Insights
          </h3>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500">No transactions yet.</p>
          ) : (
            <div className="space-y-4 text-center">
              <p>
                <span className="font-semibold">Top Spending Category:</span>{" "}
                {
                  categoryData.reduce(
                    (prev: { total: number; }, curr: { total: number; }) => (curr.total > prev.total ? curr : prev),
                    { category: "", total: 0 }
                  ).category
                }
              </p>
              <p>
                <span className="font-semibold">Total Spend this Month:</span> ₹{" "}
                {totalExpenses}
              </p>
              <p>
                <span className="font-semibold">
                  Categories Stayed Under Budget:
                </span>{" "}
                {
                  budgets.filter((budget: any) => {
                    const actualSpending = transactions
                      .filter((t: any) => t.category === budget.category)
                      .reduce(
                        (sum: number, transaction: any) =>
                          sum + transaction.amount,
                        0
                      );
                    return actualSpending <= budget.amount;
                  }).length
                }
              </p>
              <p>
                <span className="font-semibold">Categories Over Budget:</span>{" "}
                {
                  budgets.filter((budget: any) => {
                    const actualSpending = transactions
                      .filter((t: any) => t.category === budget.category)
                      .reduce(
                        (sum: number, transaction: any) =>
                          sum + transaction.amount,
                        0
                      );
                    return actualSpending > budget.amount;
                  }).length
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
