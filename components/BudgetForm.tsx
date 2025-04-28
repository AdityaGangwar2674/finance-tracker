// components/BudgetForm.tsx
import { useState } from "react";

const BudgetForm = ({ onAdd }: { onAdd: () => void }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [month, setMonth] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !amount || !month) {
      alert("Please fill in all fields.");
      return;
    }

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
      alert("Budget added successfully");
      onAdd();
      setCategory("");
      setAmount(0);
      setMonth("");
    } else {
      alert(data.error || "Failed to add budget");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 mt-5 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold">Set Monthly Budget</h2>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 p-2 w-full border rounded-md"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-2 p-2 w-full border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="mt-2 p-2 w-full border rounded-md"
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg"
      >
        Set Budget
      </button>
    </form>
  );
};

export default BudgetForm;
