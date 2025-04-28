"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyChart from "@/components/MonthlyCharts";
import CategoryPieChart from "@/components/CategoryPieCharts";

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  // Monthly data aggregation
  const monthlyData = transactions.reduce((acc: any, transaction: any) => {
    const month = new Date(transaction.date).toLocaleString("default", {
      month: "short",
    });
    const existing = acc.find((item: any) => item.month === month);

    if (existing) {
      existing.total += transaction.amount;
    } else {
      acc.push({ month, total: transaction.amount });
    }
    return acc;
  }, []);

  // Category breakdown
  const categoryData = transactions.reduce((acc: any, transaction: any) => {
    const existing = acc.find(
      (item: any) => item.category === transaction.category
    );
    if (existing) {
      existing.total += transaction.amount;
    } else {
      acc.push({ category: transaction.category, total: transaction.amount });
    }
    return acc;
  }, []);

  // Total expenses
  const totalExpenses = transactions.reduce((sum: number, transaction: any) => {
    return sum + transaction.amount;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-blue-600">
          Personal Finance Visualizer
        </h1>
        <p className="text-gray-500 text-md">
          Track your spending. Stay in control.
        </p>
      </div>

      {/* Transaction Form */}
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <TransactionForm />
        </div>
      </div>

      {/* Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TransactionList transactions={transactions} />
        <MonthlyChart data={monthlyData} />
      </div>

      {/* Category Breakdown */}
      <CategoryPieChart data={categoryData} />

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-auto">
        {/* Total Expenses Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl text-center font-semibold">Total Expenses</h3>
          <p className="text-6xl font-bold text-blue-600 text-center mt-16">
            ₹ {totalExpenses}
          </p>
        </div>

        {/* Category Breakdown Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Category Breakdown
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scroll-smooth">
            <ul className="space-y-2">
              {categoryData.map((cat: any) => (
                <li key={cat.category} className="flex justify-between">
                  <div>
                    <p className="font-medium">{cat.category}</p>
                    <p className="text-gray-500 text-sm">
                      {cat.count} transaction(s)
                    </p>
                  </div>
                  <p className="text-blue-600 font-semibold">₹ {cat.total}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Most Recent Transactions Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-5 text-center">
            Most Recent Transactions
          </h3>
          <ul className="space-y-4">
            {transactions
              .slice() // make a shallow copy so we don't mutate original
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              ) // latest first
              .slice(0, 5) // pick top 5
              .map((transaction) => (
                <li key={transaction._id} className="flex justify-between">
                  <p>{transaction.description}</p>
                  <p className="text-blue-600">₹ {transaction.amount}</p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
