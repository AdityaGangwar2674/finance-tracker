"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyChart from "@/components/MonthlyCharts";

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

  // ✅ Convert transactions to monthly data
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

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-12">
      {/* ✅ Title and Subtext */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-blue-600">
          Personal Finance Visualizer
        </h1>
        <p className="text-gray-500 text-md">
          Track your spending. Stay in control.
        </p>
      </div>

      {/* ✅ Centered Form */}
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <TransactionForm />
        </div>
      </div>

      {/* ✅ Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TransactionList transactions={transactions} />
        <MonthlyChart data={monthlyData} />
      </div>
    </div>
  );
}
