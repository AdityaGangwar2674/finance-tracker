"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { useState } from "react";

interface BudgetData {
  category: string;
  budget: number;
  actual: number;
}

export default function BudgetVsActualChart({ data }: { data: BudgetData[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const enrichedData = data.map((item) => {
    const percentage = item.budget > 0 ? (item.actual / item.budget) * 100 : 0;
    return {
      ...item,
      percentage: Math.round(percentage),
      diff: item.budget - item.actual,
    };
  });

  const sortedData = [...enrichedData].sort(
    (a, b) => b.percentage - a.percentage,
  );

  const totalBudget = sortedData.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = sortedData.reduce((sum, item) => sum + item.actual, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage =
    totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const overBudgetCategories = sortedData.filter(
    (item) => item.actual > item.budget,
  ).length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const overBudget = data.actual > data.budget;

      return (
        <div className="bg-white dark:bg-zinc-800 p-4 shadow-lg rounded-lg border border-gray-100 dark:border-zinc-700">
          <p className="font-medium text-gray-900 dark:text-zinc-100 mb-2">
            {data.category}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Budget</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ₹{data.budget.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Actual</p>
              <p
                className={`text-lg font-bold ${
                  overBudget ? "text-red-600" : "text-green-600"
                }`}
              >
                ₹{data.actual.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-zinc-700">
            <p className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-zinc-300">
                Status:
              </span>
              <span
                className={`text-sm font-medium ${
                  overBudget ? "text-red-600" : "text-green-600"
                }`}
              >
                {overBudget
                  ? `Over by ₹${(data.actual - data.budget).toLocaleString()}`
                  : `Under by ₹${(data.budget - data.actual).toLocaleString()}`}
              </span>
            </p>
            <p className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-600 dark:text-zinc-300">
                Used:
              </span>
              <span
                className={`text-sm font-medium ${
                  data.percentage > 100 ? "text-red-600" : "text-blue-600"
                }`}
              >
                {data.percentage}% of budget
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className="flex flex-wrap justify-center gap-2 mt-1">
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            className={`flex items-center cursor-pointer px-2 py-1 rounded-full transition text-xs
              ${activeIndex === index ? "bg-gray-100 dark:bg-zinc-800" : "hover:bg-gray-50 dark:hover:bg-zinc-800/50"}`}
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          >
            <div
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium text-gray-700 dark:text-zinc-300">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const getBarFill = (actual: number, budget: number) => {
    return actual > budget ? "#ef4444" : "#10b981";
  };

  const BudgetProgressBar = ({ percentage }: { percentage: number }) => {
    const barColor = percentage > 100 ? "bg-red-500" : "bg-blue-500";
    const cappedPercentage = Math.min(percentage, 100);

    return (
      <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 mt-1">
        <div
          className={`${barColor} h-2 rounded-full`}
          style={{ width: `${cappedPercentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-zinc-800/30 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700">
          <p className="text-gray-500 dark:text-zinc-400">
            No budget data available
          </p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800/50">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Total Budget
              </p>
              <p className="text-lg font-bold text-blue-800 dark:text-blue-300">
                ₹{totalBudget.toLocaleString()}
              </p>
            </div>

            <div
              className={`text-center p-2 rounded-lg shadow-sm border ${
                totalSpent > totalBudget
                  ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50"
                  : "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/50"
              }`}
            >
              <p
                className={`text-xs font-medium uppercase tracking-wide ${
                  totalSpent > totalBudget
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                Total Spent
              </p>
              <p
                className={`text-lg font-bold ${
                  totalSpent > totalBudget
                    ? "text-red-800 dark:text-red-300"
                    : "text-green-800 dark:text-green-300"
                }`}
              >
                ₹{totalSpent.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-center p-2 bg-gray-50 dark:bg-zinc-800/50 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-700">
              <p className="text-xs font-medium text-gray-600 dark:text-zinc-400 uppercase tracking-wide">
                Remaining
              </p>
              <p
                className={`text-lg font-bold ${
                  totalRemaining >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{Math.abs(totalRemaining).toLocaleString()}
                <span className="text-xs font-normal ml-1">
                  {totalRemaining >= 0 ? "left" : "over"}
                </span>
              </p>
            </div>

            <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow-sm border border-purple-100 dark:border-purple-800/50">
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                Budget Usage
              </p>
              <p
                className={`text-lg font-bold ${
                  overallPercentage > 100 ? "text-red-600" : "text-purple-700"
                }`}
              >
                {overallPercentage}%
              </p>
              <BudgetProgressBar percentage={overallPercentage} />
            </div>
          </div>

          <div className="flex-grow min-h-0">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <BarChart
                data={sortedData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
                barGap={0}
                barCategoryGap={15}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  height={40}
                  tickMargin={5}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  tickFormatter={(value) => `₹${value}`}
                  width={40}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                />
                <Legend
                  content={renderLegend}
                  verticalAlign="top"
                  height={30}
                />

                <Bar
                  dataKey="budget"
                  fill="#3b82f6"
                  name="Budget"
                  radius={[3, 3, 0, 0]}
                  fillOpacity={0.7}
                />

                <Bar
                  dataKey="actual"
                  name="Actual"
                  radius={[3, 3, 0, 0]}
                  fillOpacity={0.9}
                >
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarFill(entry.actual, entry.budget)}
                    />
                  ))}
                </Bar>

                <ReferenceLine y={0} stroke="#f1f5f9" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50">
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                Over Budget
              </p>
              <p className="text-base font-bold text-amber-700 dark:text-amber-300">
                {overBudgetCategories}/{sortedData.length}
              </p>
            </div>

            <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
              <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                Most Efficient
              </p>
              <p
                className="text-base font-bold text-green-700 dark:text-green-300 truncate"
                title={
                  sortedData.length > 0
                    ? [...sortedData].sort(
                        (a, b) => a.percentage - b.percentage,
                      )[0].category
                    : "N/A"
                }
              >
                {sortedData.length > 0
                  ? [...sortedData].sort(
                      (a, b) => a.percentage - b.percentage,
                    )[0].category
                  : "N/A"}
              </p>
            </div>

            <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50">
              <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
                Highest Overspend
              </p>
              <p
                className="text-base font-bold text-red-700 dark:text-red-300 truncate"
                title={
                  sortedData.some((item) => item.actual > item.budget)
                    ? [...sortedData]
                        .filter((item) => item.actual > item.budget)
                        .sort(
                          (a, b) => b.actual - b.budget - (a.actual - a.budget),
                        )[0].category
                    : "None"
                }
              >
                {sortedData.some((item) => item.actual > item.budget)
                  ? [...sortedData]
                      .filter((item) => item.actual > item.budget)
                      .sort(
                        (a, b) => b.actual - b.budget - (a.actual - a.budget),
                      )[0].category
                  : "None"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
