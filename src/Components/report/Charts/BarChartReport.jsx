import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { name: "Food", amount: 300 },
  { name: "Travel", amount: 200 },
  { name: "Entertainment", amount: 150 },
  { name: "Others", amount: 100 },
];

function BarChartReport() {
  return (
    <div className="card shadow-sm p-4 frequent-card">
      <h5 className="mb-3 frequent-title">Spending by Category</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#456882" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartReport;
