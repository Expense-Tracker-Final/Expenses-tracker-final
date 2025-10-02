import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Navbar from "../../common/Navbar";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  // --- Static data ---
  const totalSpent = 500;
  const topCategory = "Food & Beverage";
  const numberOfCategories = 4;

  // Bar chart data
  const categoryData = [
    { name: "Food", total: 200 },
    { name: "Travel", total: 120 },
    { name: "Entertainment", total: 150 },
    { name: "Others", total: 30 },
  ];

  const navigate = useNavigate();

  return (
    <>
      <div className="container mt-4">
        {/* Row 1: KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm text-center p-4" style={{ height: "180px" }}>
              <h6>Total Spent</h6>
              <h2 className="fw-bold text-success mt-3">₹{totalSpent}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm text-center p-4" style={{ height: "180px" }}>
              <h6>Most Spent On</h6>
              <h2 className="fw-bold text-primary mt-3">{topCategory}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm text-center p-4" style={{ height: "180px" }}>
              <h6>Number of Categories</h6>
              <h2 className="fw-bold text-warning mt-3">{numberOfCategories}</h2>
            </div>
          </div>
        </div>

        {/* Row 2: Chart + Budget Card */}
        <div className="row g-3">
          {/* Bar Chart (8 cols) */}
          <div className="col-md-8">
            <div className="card shadow-sm p-4" style={{ height: "350px" }}>
              <h5 className="mb-3">Spending by Category</h5>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={categoryData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#0d6efd" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Move to Budget Card (4 cols) */}
          <div className="col-md-4">
            <div
              className="card shadow-sm p-4 d-flex flex-column align-items-center justify-content-center text-center"
              style={{ height: "350px" }}
            >
              <h5>💰 Budget Planner</h5>
              <p className="text-muted small mt-2">
                Move to your budget page to add your budget and track spending effectively.
              </p>
              <button className="btn btn-primary fw-bold mt-3" onClick={() => navigate('/')}>Move to Budget →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
