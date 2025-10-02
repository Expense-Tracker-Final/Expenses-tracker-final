import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Food", value: 300 },
  { name: "Travel", value: 200 },
  { name: "Entertainment", value: 150 },
  { name: "Others", value: 100 },
];

const COLORS = ["#456882", "#0d6efd", "#ffc107", "#dc3545"];

function PieChartReport() {
  return (
    <div className="card shadow-sm p-4 frequent-card">
      <h5 className="mb-3 frequent-title">Expense Distribution</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartReport;
