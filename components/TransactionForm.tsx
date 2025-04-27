"use client"; // 👈 make sure you have this!

import { useState } from "react";

export default function TransactionForm() {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, date, description }),
    });

    setLoading(false);

    if (res.ok) {
      window.location.reload(); // refresh after adding
    } else {
      alert("Failed to add transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        className="input"
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="input"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="input"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white py-2 mx-40 px-4 rounded hover:bg-blue-600"
      >
        {loading ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
}
