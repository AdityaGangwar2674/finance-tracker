import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyChart from "@/components/MonthlyCharts";

async function getTransactions() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/transactions`,
    {
      cache: "no-store",
    }
  );
  return res.json();
}

function groupByMonth(transactions: any[]) {
  const grouped: { [key: string]: number } = {};

  transactions.forEach((tx) => {
    const month = new Date(tx.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    grouped[month] = (grouped[month] || 0) + tx.amount;
  });

  return Object.keys(grouped).map((month) => ({
    month,
    total: grouped[month],
  }));
}

export default async function Home() {
  const transactions = await getTransactions();
  const monthlyData = groupByMonth(transactions);

  return (
    <main className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Personal Finance Tracker
      </h1>

      <TransactionForm onAdd={() => {}} />

      <TransactionList transactions={transactions} />

      <MonthlyChart data={monthlyData} />
    </main>
  );
}
