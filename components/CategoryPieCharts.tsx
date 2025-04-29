"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Sector,
} from "recharts";

export default function CategoryPieChart({
  data,
}: {
  data: { category: string; total: number }[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Category colors with enhanced palette
  const CATEGORY_COLORS: { [key: string]: string } = {
    Food: "#f97316", // orange-500
    Travel: "#10b981", // emerald-500
    Shopping: "#3b82f6", // blue-500
    Utilities: "#eab308", // yellow-500
    Entertainment: "#8b5cf6", // violet-500
    Other: "#6b7280", // gray-500
  };

  // Sort data by total amount
  const sortedData = [...data].sort((a, b) => b.total - a.total);

  // Calculate total expenses
  const totalExpenses = data.reduce((sum, item) => sum + item.total, 0);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percent = ((payload[0].value / totalExpenses) * 100).toFixed(1);
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <p className="text-gray-600 font-medium">{payload[0].name}</p>
          <p className="text-lg font-bold text-blue-600">
            ₹{payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{percent}% of total</p>
        </div>
      );
    }
    return null;
  };

  // Active shape renderer
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      value,
    } = props;

    const percent = ((value / totalExpenses) * 100).toFixed(1);

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 16}
          fill={fill}
        />
        <text
          x={cx}
          y={cy - 15}
          textAnchor="middle"
          fill="#333"
          fontSize={16}
          fontWeight={600}
        >
          {payload.category}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="#3b82f6"
          fontSize={20}
          fontWeight={700}
        >
          ₹{value.toLocaleString()}
        </text>
        <text
          x={cx}
          y={cy + 35}
          textAnchor="middle"
          fill="#6b7280"
          fontSize={14}
        >
          {percent}% of total
        </text>
      </g>
    );
  };

  // Custom legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center mt-4 gap-4">
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            className={`flex items-center cursor-pointer px-3 py-1.5 rounded-full transition ${
              activeIndex === index ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
            onClick={() =>
              setActiveIndex(activeIndex === index ? undefined : index)
            }
          >
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <div className="w-full h-full">
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No expense data available</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              {/* Main pie chart */}
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="total"
                nameKey="category"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.category] || "#9ca3af"}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>

          {/* Summary */}
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Top Category
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {sortedData.length > 0 ? sortedData[0].category : "N/A"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Categories
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {sortedData.length}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
