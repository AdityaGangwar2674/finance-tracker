"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BudgetVsActualChart({ data }: { data: any[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h3 className="text-xl font-semibold mb-4 text-center">
        Budget vs Actual Chart
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
          <Bar dataKey="actual" fill="#EF4444" name="Actual Spend" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
