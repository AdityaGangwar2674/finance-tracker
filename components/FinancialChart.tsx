"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Calendar, CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  amount: number;
  date: string;
  category: string;
}

interface FinancialChartProps {
  transactions: Transaction[];
  initialView?: "month" | "year";
}

export default function FinancialChart({ transactions, initialView = "month" }: FinancialChartProps) {
  const [viewType, setViewType] = useState<"month" | "year">(initialView);
  
  // Default to current month/year
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear().toString());

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartData = useMemo(() => {
    if (viewType === "month") {
      const [year, month] = selectedMonth.split("-").map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      
      const days = Array.from({ length: daysInMonth }, (_, i) => ({
        label: (i + 1).toString(),
        total: 0,
        fullDate: `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
      }));

      transactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === year && d.getMonth() + 1 === month) {
          const dayIndex = d.getDate() - 1;
          if (days[dayIndex]) {
            days[dayIndex].total += t.amount;
          }
        }
      });
      return days;
    } else {
      const year = parseInt(selectedYear);
      const months = monthNames.map((name, i) => ({
        label: name,
        total: 0,
        monthIndex: i
      }));

      transactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === year) {
          months[d.getMonth()].total += t.amount;
        }
      });
      return months;
    }
  }, [transactions, viewType, selectedMonth, selectedYear]);

  const average = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.total, 0) / chartData.length 
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-800 p-4 shadow-xl rounded-2xl border border-gray-100 dark:border-zinc-700 animate-in fade-in zoom-in duration-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            {viewType === "month" ? `Day ${label}` : label}
          </p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-zinc-800/30 p-4 rounded-3xl border border-gray-100 dark:border-zinc-800/50">
        <div className="flex p-1 bg-gray-200/50 dark:bg-zinc-800 rounded-xl">
          <button
            onClick={() => setViewType("month")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewType === "month" 
                ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Monthly View
          </button>
          <button
            onClick={() => setViewType("year")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewType === "year" 
                ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300"
            }`}
          >
            <CalendarRange className="w-4 h-4" />
            Yearly View
          </button>
        </div>

        <div className="flex items-center gap-3">
          {viewType === "month" ? (
            <div className="flex gap-2">
              <select
                value={selectedMonth.split("-")[1]}
                onChange={(e) => setSelectedMonth(`${selectedMonth.split("-")[0]}-${e.target.value}`)}
                className="px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-zinc-100 transition-all cursor-pointer"
              >
                {monthNames.map((name, i) => (
                  <option key={name} value={String(i + 1).padStart(2, '0')}>{name}</option>
                ))}
              </select>
              <select
                value={selectedMonth.split("-")[0]}
                onChange={(e) => setSelectedMonth(`${e.target.value}-${selectedMonth.split("-")[1]}`)}
                className="px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-zinc-100 transition-all cursor-pointer"
              >
                {Array.from({ length: 5 }, (_, i) => now.getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          ) : (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-zinc-100 transition-all cursor-pointer"
            >
              {Array.from({ length: 5 }, (_, i) => now.getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        {chartData.every(d => d.total === 0) ? (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-800/20 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
             <p className="text-gray-400 font-medium">No transactions found for this {viewType}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} stroke="#94a3b8" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                interval={viewType === "month" ? 2 : 0}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 8 }} />
              <Bar dataKey="total" radius={[6, 6, 6, 6]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.total > average ? "#3b82f6" : "#6366f1"}
                    fillOpacity={entry.total === 0 ? 0.1 : 0.9}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
          <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">
            Total: <span className="text-gray-900 dark:text-zinc-100">₹{chartData.reduce((s, d) => s + d.total, 0).toLocaleString()}</span>
          </span>
        </div>
        <div className="text-xs font-bold text-gray-400">
           {viewType === "month" ? "Daily Breakdown" : "Monthly Breakdown"}
        </div>
      </div>
    </div>
  );
}
