"use client";

export default function TransactionList({
  transactions,
}: {
  transactions: any[];
}) {
  if (!transactions.length)
    return <p className="text-center">No transactions yet.</p>;

  return (
    <div className="mt-8 space-y-4">
      {transactions.map((tx) => (
        <div
          key={tx._id}
          className="p-4 bg-gray-50 rounded shadow-sm flex justify-between"
        >
          <div>
            <p className="font-medium">{tx.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(tx.date).toLocaleDateString()}
            </p>
          </div>
          <p className="font-semibold">₹ {tx.amount}</p>
        </div>
      ))}
    </div>
  );
}
