"use client";

export default function TransactionList({
  transactions,
}: {
  transactions: any[];
}) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });

    if (res.ok) {
      window.location.reload(); // refresh page
    } else {
      alert("Failed to delete transaction");
    }
  };

  if (!transactions.length)
    return <p className="text-center">No transactions yet.</p>;

  return (
    <div className="mt-8 space-y-4">
      {transactions.map((tx) => (
        <div
          key={tx._id}
          className="p-4 bg-gray-50 rounded shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{tx.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(tx.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-semibold">₹ {tx.amount}</p>
            <button
              onClick={() => handleDelete(tx._id)}
              className="text-red-500 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
