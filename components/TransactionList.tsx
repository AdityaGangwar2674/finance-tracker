"use client";

import { Trash2 } from "lucide-react";

export default function TransactionList({
  transactions,
}: {
  transactions: any[];
}) {
  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmed) return;

    await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });

    window.location.reload();
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>

      {/* ✨ Scrollable after 2 items */}
      <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
        {transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex items-center justify-between border p-2 rounded shadow-sm"
          >
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()} - ₹
                {transaction.amount}
              </p>
            </div>
            <button
              onClick={() => handleDelete(transaction._id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
