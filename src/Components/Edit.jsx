import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { expenseService } from "../services/expenseServices";
import { Link } from "react-router-dom";

function Edit() {
  const [date, setDate] = useState("");
  const [dailyItems, setDailyItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [noRecord, setNoRecord] = useState(false);

  // Fetch daily records for the date
  const handleFetch = async () => {
    if (!date) return alert("Please enter a date");

    setLoading(true);
    setNoRecord(false);
    try {
      const allDailyRecords = await expenseService.getDailyRecords();
      const formattedDate = date.split("-").reverse().join("/");

      const records = { ...allDailyRecords.data?.[formattedDate] } || {};

      // Filter out income, keep only expenses
      const expenseRecords = Object.fromEntries(
        Object.entries(records).filter(([_, item]) => item.category !== "income")
      );

      if (Object.keys(expenseRecords).length === 0) {
        setNoRecord(true);
        setDailyItems({
          "": { name: "", quantity: "", price: "", total: 0, category: "food" },
        });
      } else {
        setDailyItems(
          Object.fromEntries(
            Object.entries(expenseRecords).map(([key, item]) => [
              key,
              { ...item, name: key },
            ])
          )
        );
      }
    } catch (err) {
      console.error("Error fetching daily records:", err);
      alert("Error fetching records");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, field, value) => {
    setDailyItems((prev) => {
      const updatedItem = { ...prev[key], [field]: value };
      if (field === "quantity" || field === "price") {
        updatedItem.total =
          Number(updatedItem.quantity || 0) * Number(updatedItem.price || 0);
      }
      return { ...prev, [key]: updatedItem };
    });
  };

  const addEmptyField = () => {
    const newKey = `new_${Object.keys(dailyItems).length + 1}`;
    setDailyItems((prev) => ({
      ...prev,
      [newKey]: { name: "", quantity: "", price: "", total: 0, category: "food" },
    }));
  };

  const removeItem = (key) => {
    setDailyItems((prev) => {
      const newItems = { ...prev };
      delete newItems[key];
      return newItems;
    });
  };

  const handleSave = async () => {
    if (!date) return alert("Enter a date first");

    try {
      const res = await expenseService.getDailyRecords();
      const formattedDate = date.split("-").reverse().join("/");

      const dayData = res.data?.[formattedDate] || {};

      // Preserve income
      const incomeRecords = Object.fromEntries(
        Object.entries(dayData).filter(([_, item]) => item.category === "income")
      );

      const updatedExpenses = {};

      Object.values(dailyItems).forEach((item) => {
        if (!item.name) return;

        const baseName = item.name;
        let finalName = baseName;
        let counter = 0;

        // Find next available unique key
        while (
          updatedExpenses.hasOwnProperty(finalName) ||
          (dayData.hasOwnProperty(finalName) &&
            dayData[finalName].price !== item.price)
        ) {
          counter++;
          finalName = `${baseName}_${counter}`;
        }

        const { name, ...rest } = item;
        updatedExpenses[finalName] = rest;
      });

      const newData = {
        ...res.data,
        [formattedDate]: {
          ...incomeRecords,
          ...updatedExpenses,
        },
      };

      // Sort dates ascending
      const sortedData = Object.fromEntries(
        Object.entries(newData).sort(
          ([dateA], [dateB]) =>
            new Date(dateA.split("/").reverse().join("-")) -
            new Date(dateB.split("/").reverse().join("-"))
        )
      );

      await expenseService.updateDailyRecord("", sortedData);
      alert("Records saved successfully");
      setNoRecord(false);
    } catch (err) {
      console.error("Error saving records:", err);
      alert("Error saving records");
    }
  };

  const totalAmount = Object.values(dailyItems).reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  return (
    <div>
      <h2>Edit Daily Expenses</h2>

      <div style={{ marginBottom: "16px" }}>
        <Input
          label="Enter Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button label="Fetch" onClick={handleFetch} />
      </div>

      {loading && <p>Loading...</p>}

      {noRecord && <p>No records found. Add new expenses below:</p>}

      {Object.keys(dailyItems).length > 0 && (
        <div>
          {Object.entries(dailyItems).map(([key, item]) => (
            <div
              key={key}
              style={{
                marginBottom: "12px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "8px",
              }}
            >
              <Input
                label="Name"
                value={item.name}
                onChange={(e) => handleChange(key, "name", e.target.value)}
              />
              <Input
                label="Quantity"
                value={item.quantity}
                onChange={(e) => handleChange(key, "quantity", e.target.value)}
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
              <Button
                label="Remove"
                onClick={() => removeItem(key)}
                style={{ marginTop: "8px", backgroundColor: "red", color: "#fff" }}
              />
            </div>
          ))}

          <Button label="Add Another Item" onClick={addEmptyField} />

          <h4>Total: ₹{totalAmount}</h4>
          <Button label="Save Changes" onClick={handleSave} />
        </div>
      )}

      <Link to="/">Back</Link>
    </div>
  );
}

export default Edit;
