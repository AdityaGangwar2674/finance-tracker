"use client";

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

export default function MonthlyChart({
  data,
}: {
  data: { month: string; total: number }[];
}) {
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const sortedData = [...data].sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  );

  const average =
    data.length > 0
      ? data.reduce((sum, item) => sum + item.total, 0) / data.length
      : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <p className="text-gray-600">{`${label}`}</p>
          <p className="text-lg font-bold text-blue-600">{`₹${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (value: number) => {
    return value > average ? "#ef4444" : "#3b82f6";
  };

  return (
    <div className="w-full h-full">
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No data available</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sortedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
              barSize={40}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.2}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.total)}
                    fillOpacity={0.9}
                  />
                ))}
              </Bar>

              {average > 0 && (
                <Bar
                  dataKey={() => average}
                  fill="none"
                  stroke="#475569"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Monthly Average"
                  legendType="none"
                  barSize={0}
                />
              )}
            </BarChart>
          </ResponsiveContainer>

          <div className="flex justify-end mt-2">
            <div className="flex items-center text-sm text-gray-500">
              <span className="inline-block w-3 h-0.5 bg-gray-400 mr-1.5 border-dashed"></span>
              <span>Monthly Average: </span>
              <span className="ml-1 font-semibold">
                ₹{average.toLocaleString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
