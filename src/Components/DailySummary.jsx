import React, { useEffect, useState } from "react";
import { expenseService } from "../services/expenseServices";
import { Link } from "react-router-dom";

function DailySummary({ date = new Date().toLocaleDateString("en-GB") }) {
  const [summary, setSummary] = useState({});
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        // fetch all daily records
        const allDailyRecords = await expenseService.getDailyRecords();
        const dailyItems = allDailyRecords.data[date] || {}; // today's items
        setItems(dailyItems);

        // compute category-wise totals
        const categoryTotals = Object.values(dailyItems).reduce((acc, item) => {
          const cat = item.category || "misc";
          acc[cat] = (acc[cat] || 0) + Number(item.total);
          return acc;
        }, {});

        setSummary(categoryTotals);
      } catch (error) {
        console.error("Error fetching daily summary:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [date]);

  if (loading) return <p>Loading summary...</p>;

  const totalAmount = Object.values(items).reduce((sum, item) => sum + item.total, 0);

  return (
    <div>
      <h2>Daily Summary ({date})</h2>

      <h3>Category Totals</h3>
      <ul>
        {Object.entries(summary).map(([category, total]) => (
          <li key={category}>
            {category}: ₹{total}
          </li>
        ))}
      </ul>

      <h3>All Expenses Today</h3>
      {Object.entries(items).map(([name, item]) => (
        <div key={name} style={{ marginBottom: "8px" }}>
          <strong>{name}</strong> ({item.category}) - Qty: {item.quantity}, Price: ₹{item.price}, Total: ₹{item.total}
        </div>
      ))}

      <hr />
      <h4>Total Spent Today: ₹{totalAmount}</h4>
      <hr />
      <Link to="/weeklyMonthy">Weekly</Link>
    </div>
  );
}

export default DailySummary;
