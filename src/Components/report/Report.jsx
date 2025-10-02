import React from "react";
import BarChartReport from "./Charts/BarChartReport";
import PieChartReport from "./Charts/PieChartReport";

const Report = () => {
  // Sample data for Top Expenses
  const topExpenses = [
    { name: "Pizza", category: "Food", amount: 250 },
    { name: "Flight", category: "Travel", amount: 200 },
    { name: "Concert Ticket", category: "Entertainment", amount: 150 },
    { name: "Groceries", category: "Food", amount: 120 },
    { name: "Movie", category: "Entertainment", amount: 100 },
  ];

  // Sample insights
  const insights = [
    { title: "Highest Spending", value: "Food 🍔", color: "text-danger" },
    { title: "Lowest Spending", value: "Others 📦", color: "text-success" },
    { title: "Average Monthly Spend", value: "₹400", color: "text-primary" },
  ];

  return (
    <div className="container mt-4">
      <h2 className="frequent-title mb-4 text-center">📊 Expense Reports</h2>

      {/* Row 1: Pie Chart + Bar Chart */}
      <div className="row g-4">
        <div className="col-md-6">
          <PieChartReport />
        </div>
        <div className="col-md-6">
          <BarChartReport />
        </div>
      </div>

      {/* Row 2: Top 5 Expenses Table */}
      <div className="row g-4 mt-4">
        <div className="col-12">
          <div className="card shadow-sm p-4 frequent-card">
            <h5 className="mb-3 frequent-title">Top 5 Expenses</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {topExpenses.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3: Insights Cards */}
      <div className="row g-4 mt-4">
        {insights.map((insight, index) => (
          <div className="col-md-4" key={index}>
            <div className="card shadow-sm text-center p-4 frequent-card">
              <h6>{insight.title}</h6>
              <h2 className={`fw-bold mt-3 ${insight.color}`}>{insight.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Report;
