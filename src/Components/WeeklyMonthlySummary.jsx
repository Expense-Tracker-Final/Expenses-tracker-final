import React, { useEffect, useState } from "react";
import { expenseService } from "../services/expenseServices";
import Button from "../common/Button";
import { Link } from "react-router-dom";

function WeeklyMonthlySummary() {
  const [dailyRecords, setDailyRecords] = useState({});
  const [summary, setSummary] = useState({});
  const [title, setTitle] = useState("");
  const [grandTotal, setGrandTotal] = useState(0);

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

  const calculateSummary = (type) => {
    const today = new Date();
    let filteredRecords = {};

    Object.entries(dailyRecords).forEach(([dateStr, items]) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      const recordDate = new Date(year, month - 1, day);

      if (type === "week") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday
        if (recordDate >= startOfWeek && recordDate <= endOfWeek) {
          filteredRecords = { ...filteredRecords, ...items };
        }
      }

      if (type === "month") {
        if (
          recordDate.getMonth() === today.getMonth() &&
          recordDate.getFullYear() === today.getFullYear()
        ) {
          filteredRecords = { ...filteredRecords, ...items };
        }
      }
    });

    // Merge items with similar names (tea, tea_1, tea_2 => tea)
    const mergedItems = {};
    Object.entries(filteredRecords).forEach(([key, item]) => {
      const baseName = key.split("_")[0]; // remove _1, _2 suffix
      if (!mergedItems[baseName]) {
        mergedItems[baseName] = { ...item };
      } else {
        mergedItems[baseName].quantity += item.quantity;
        mergedItems[baseName].total += item.total;
      }
    });

    // Group items by category
    const categorySummary = {};
    let total = 0;
    Object.entries(mergedItems).forEach(([name, item]) => {
      if (!categorySummary[item.category]) categorySummary[item.category] = {};
      categorySummary[item.category][name] = {
        quantity: item.quantity,
        total: item.total,
      };
      total += item.total;
    });

    setSummary(categorySummary);
    setGrandTotal(total);
    setTitle(type === "week" ? "This Week's Summary" : "This Month's Summary");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">Weekly/Monthly Summary</h2>
      <div className="mb-3">
        <Button label="This Week" onClick={() => calculateSummary("week")} />
        <Button
          label="This Month"
          onClick={() => calculateSummary("month")}
          className="ms-2"
        />
      </div>

      {title && (
        <div className="mb-3">
          <h4 className="text-success">{title}</h4>
          {Object.entries(summary).map(([category, items]) => (
            <div key={category} className="mb-2">
              <h5 className="text-info">{category}</h5>
              <ul className="list-group">
                {Object.entries(items).map(([name, data]) => (
                  <li
                    key={name}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>
                      {name} (Qty: {data.quantity})
                    </span>
                    <span>₹{data.total}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <h5 className="text-danger mt-3">Grand Total: ₹{grandTotal}</h5>
         
        </div>
      )}
       <Link to="/">back</Link>
    </div>
  );
}

export default WeeklyMonthlySummary;
