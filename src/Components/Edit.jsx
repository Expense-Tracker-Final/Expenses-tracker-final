import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { expenseService } from "../services/expenseServices";
import { Link } from "react-router-dom";

function Edit() {
  const [date, setDate] = useState("");
  const [dailyItems, setDailyItems] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch records for selected date
 const handleFetch = async () => {
  if (!date) return alert("Please enter a date (DD/MM/YYYY)");

  setLoading(true);
  try {
    const allDailyRecords = await expenseService.getDailyRecords();
    setDailyItems(records);

    if (Object.keys(records).length === 0) {
      alert("No records found for this date");
    }
  } catch (err) {
    console.error("Error fetching daily records:", err);
    alert("Error fetching records");
  } finally {
    setLoading(false);
  }
};


  // Handle field change
  const handleChange = (key, field, value) => {
    setDailyItems((prev) => {
      const updatedValue =
        field === "category" ? value : Number(value);

      const updatedItem = { ...prev[key], [field]: updatedValue };

      // Update total if quantity or price changes
      if (field === "quantity" || field === "price") {
        updatedItem.total = updatedItem.quantity * updatedItem.price;
      }

      return { ...prev, [key]: updatedItem };
    });
  };

  // Save updated records
  const handleSave = async () => {
    try {
      const allDailyRecords = await expenseService.getDailyRecords();
      const updatedData = {
        ...allDailyRecords.data,
        dailyRecords: {
          ...allDailyRecords.data.dailyRecords,
          [date]: dailyItems,
        },
      };
      await expenseService.updateDailyRecord("", updatedData);
      alert("Records updated successfully");
    } catch (err) {
      console.error("Error updating records:", err);
      alert("Error saving records");
    }
  };

  const totalAmount = Object.values(dailyItems).reduce(
    (sum, item) => sum + item.total,
    0
  );

  return (
    <div>
      <h2>Edit Daily Expenses</h2>

      <div style={{ marginBottom: "16px" }}>
        <Input
          label="Enter Date (DD/MM/YYYY)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button label="Fetch" onClick={handleFetch} />
      </div>

      {loading && <p>Loading...</p>}

      {Object.keys(dailyItems).length > 0 && (
        <div>
          <h3>Expenses on {date}</h3>
          {Object.entries(dailyItems).map(([key, item]) => (
            <div
              key={key}
              style={{
                marginBottom: "12px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "8px",
              }}
            >
              <Input label="Name" value={key} disabled />
              <Input
                label="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleChange(key, "quantity", e.target.value)
                }
              />
              <Input
                label="Price"
                value={item.price}
                onChange={(e) => handleChange(key, "price", e.target.value)}
              />
              <Input label="Total" value={item.total} disabled />
              <select
                value={item.category}
                onChange={(e) => handleChange(key, "category", e.target.value)}
              >
                <option value="food">Food & Beverage</option>
                <option value="travel">Travel</option>
                <option value="entertainment">Entertainment</option>
                <option value="others">Others</option>
              </select>
            </div>
          ))}

          <h4>Total: ₹{totalAmount}</h4>
          <Button label="Save Changes" onClick={handleSave} />
        </div>
      )}
      <Link to="/">Back</Link>
    </div>
  );
}

export default Edit;
