import React, { useEffect, useState } from "react";
import { expenseService } from "../services/expenseServices";
import Button from "../common/Button";
import { Link } from "react-router-dom";

function MonthlySavings() {
  const [dailyRecords, setDailyRecords] = useState({});
  const [monthlySavings, setMonthlySavings] = useState({});
  const [grandSavings, setGrandSavings] = useState(0);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const res = await expenseService.getDailyRecords();
        setDailyRecords(res.data);
      } catch (err) {
        console.error("Error fetching daily records:", err);
      }
    }
    fetchRecords();
  }, []);

  useEffect(() => {
    const tempSavings = {};
    let totalSavings = 0;

    Object.entries(dailyRecords).forEach(([dateStr, items]) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      const monthKey = `${year}-${month.toString().padStart(2, "0")}`;

      if (!tempSavings[monthKey]) tempSavings[monthKey] = { income: 0, expense: 0 };

      Object.values(items).forEach((item) => {
        if (item.category === "income") tempSavings[monthKey].income += item.total;
        else tempSavings[monthKey].expense += item.total;
      });
    });

    // Calculate savings per month
    Object.entries(tempSavings).forEach(([month, data]) => {
      data.savings = data.income - data.expense;
      totalSavings += data.savings;
    });

    setMonthlySavings(tempSavings);
    setGrandSavings(totalSavings);
  }, [dailyRecords]);

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">Monthly Savings</h2>
      {Object.entries(monthlySavings).length === 0 ? (
        <p>No records found</p>
      ) : (
        <div className="list-group mb-3">
          {Object.entries(monthlySavings).map(([month, data]) => (
            <div key={month} className="list-group-item d-flex justify-content-between">
              <span>{month}</span>
              <span>
                Income: ₹{data.income} | Expenses: ₹{data.expense} | Savings: ₹{data.savings}
              </span>
            </div>
          ))}
        </div>
      )}
      <hr />
      <h4 className="text-success">Total Savings: ₹{grandSavings}</h4>

      {/* Navigation block */}
      <div className="mt-4">
        <h5 className="text-secondary">Navigate:</h5>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/">
            <Button label="Actual Tracking" />
          </Link>
          <Link to="/frequent">
            <Button label="Frequent List" />
          </Link>
          <Link to="/daily">
            <Button label="Daily Summary" />
          </Link>
          <Link to="/edit">
            <Button label="Edit" />
          </Link>
          <Link to="/weeklyMonthy">
            <Button label="Weekly/Monthly Summary" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MonthlySavings;
