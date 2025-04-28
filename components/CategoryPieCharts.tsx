import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function CategoryPieChart({
  data,
}: {
  data: { category: string; total: number }[];
}) {
  const CATEGORY_COLORS: { [key: string]: string } = {
    Food: "#FF8042",
    Travel: "#00C49F",
    Shopping: "#0088FE",
    Utilities: "#FFBB28",
    Entertainment: "#8A2BE2",
    Other: "#888888",
  };

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[entry.category] || "#CCCCCC"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
