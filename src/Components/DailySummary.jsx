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

        // compute category-wise details
        const categorySummary = {};
        Object.entries(dailyItems).forEach(([name, item]) => {
          if (!categorySummary[item.category]) categorySummary[item.category] = {};
          categorySummary[item.category][name] = {
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          };
        });

        setSummary(categorySummary);
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

      {Object.entries(summary).map(([category, items]) => {
        const categoryTotal = Object.values(items).reduce((sum, item) => sum + item.total, 0);
        return (
          <div key={category} style={{ marginBottom: "16px" }}>
            <h3>{category}</h3>
            <ul>
              {Object.entries(items).map(([name, item]) => (
                <li key={name}>
                  {name} - Qty: {item.quantity}, Price: ₹{item.price}, Total: ₹{item.total}
                </li>
              ))}
              <li style={{ fontWeight: "bold" }}>Category Total: ₹{categoryTotal}</li>
            </ul>
          </div>
        );
      })}

      <hr />
      <h4>Total Spent Today: ₹{totalAmount}</h4>
      <hr />
      <Link to="/weeklyMonthy">Weekly Summary</Link>
    </div>
  );
}

export default DailySummary;
