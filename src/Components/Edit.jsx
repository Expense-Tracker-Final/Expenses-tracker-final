// ...existing code...
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

  const toDDMMYYYY = (iso) => (iso ? iso.split("-").reverse().join("/") : "");

  // Fetch daily records for the date
  const handleFetch = async () => {
    if (!date) return alert("Please enter a date");
    setLoading(true);
    setNoRecord(false);
    try {
      const allDailyRecords = await expenseService.getDailyRecords();
      const formattedDate = toDDMMYYYY(date);
      const records = { ...(allDailyRecords.data?.[formattedDate] || {}) };

      // Filter out income, keep only expenses and attach name key
      const expenseRecords = Object.fromEntries(
        Object.entries(records)
          .filter(([_, item]) => item.category !== "income")
          .map(([key, item]) => [key, { ...item, name: key }])
      );

      if (Object.keys(expenseRecords).length === 0) {
        setNoRecord(true);
        setDailyItems({});
      } else {
        setDailyItems(expenseRecords);
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
      const current = prev[key] || { name: "", quantity: "", price: "", total: 0, category: "food" };

      const updatedValue =
        field === "category" || field === "name"
          ? value
          : value === ""
          ? ""
          : Number(value);

      const updatedItem = { ...current, [field]: updatedValue };

      if (field === "quantity" || field === "price") {
        const qty = Number(updatedItem.quantity || 0);
        const pr = Number(updatedItem.price || 0);
        updatedItem.total = qty * pr;
      }

      // keep name in item in sync if missing
      if (!updatedItem.name) updatedItem.name = current.name || key;

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
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSave = async () => {
    if (!date) return alert("Enter a date first");
    try {
      const res = await expenseService.getDailyRecords();
      const formattedDate = toDDMMYYYY(date);
      const dayData = res.data?.[formattedDate] || {};

      // Preserve income entries
      const incomeRecords = Object.fromEntries(
        Object.entries(dayData).filter(([_, item]) => item.category === "income")
      );

      const updatedExpenses = {};

      Object.values(dailyItems).forEach((item) => {
        if (!item.name) return;
        const baseName = item.name;
        let finalName = baseName;
        let counter = 0;

        // ensure unique key
        while (
          updatedExpenses.hasOwnProperty(finalName) ||
          (dayData.hasOwnProperty(finalName) && dayData[finalName].price !== item.price)
        ) {
          counter++;
          finalName = `${baseName}_${counter}`;
        }

        const { name, ...rest } = item;
        const quantity = Number(rest.quantity || 0);
        const price = Number(rest.price || 0);
        updatedExpenses[finalName] = { ...rest, quantity, price, total: quantity * price };
      });

      const newData = {
        ...res.data,
        [formattedDate]: {
          ...incomeRecords,
          ...updatedExpenses,
        },
      };

      // sort dates ascending (keys are DD/MM/YYYY)
      const sortedData = Object.fromEntries(
        Object.entries(newData).sort(
          ([a], [b]) =>
            new Date(a.split("/").reverse().join("-")) - new Date(b.split("/").reverse().join("-"))
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
    <div className="container rounded shadow-lg py-4 px-3 mt-4 frequent-bg">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="frequent-title mb-0">Edit Daily Expenses</h2>
        <Link to="/budget">
          <button
            className="btn"
            style={{
              backgroundColor: "#456882",
              color: "#fff",
              border: "2px solid #ffffff",
              borderRadius: "8px",
            }}
          >
            Back
          </button>
        </Link>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <Input label="Enter Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button label="Fetch" onClick={handleFetch} />
      </div>

      <div className="card mb-4 frequent-card">
        <div className="card-header text-white frequent-card-header" style={{ backgroundColor: "#456882" }}>
          <h4 className="mb-0">Edit Items</h4>
        </div>
        <div className="card-body">
          {loading && <p>Loading...</p>}
          {noRecord && <p>No records found. Add new expenses below:</p>}

          {Object.keys(dailyItems).length === 0 ? (
            <p className="text-muted">No items for this date.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle frequent-table">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(dailyItems).map(([key, item]) => (
                    <tr key={key}>
                      <td>
                        <Input label="Name" value={item.name} onChange={(e) => handleChange(key, "name", e.target.value)} />
                      </td>
                      <td>
                        <Input label="Quantity" value={item.quantity} onChange={(e) => handleChange(key, "quantity", e.target.value)} />
                      </td>
                      <td>
                        <Input label="Price" value={item.price} onChange={(e) => handleChange(key, "price", e.target.value)} />
                      </td>
                      <td>
                        <select className="form-control" value={item.category} onChange={(e) => handleChange(key, "category", e.target.value)}>
                          <option value="food">Food & Beverage</option>
                          <option value="travel">Travel</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="others">Others</option>
                        </select>
                      </td>
                      <td className="fw-bold text-success">₹{item.total}</td>
                      <td>
                        <Button label="Remove" onClick={() => removeItem(key)} style={{ backgroundColor: "red", color: "#fff" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="d-flex gap-2 align-items-center mt-3">
            <Button label="Add Another Item" onClick={addEmptyField} />
            <h4 className="mb-0">Total: ₹{totalAmount}</h4>
            <Button label="Save Changes" onClick={handleSave} />
          </div>
        </div>
      </div>

      <div className="card frequent-card mb-4">
        <div className="card-header text-white frequent-card-header" style={{ backgroundColor: "#456882" }}>
          <h5 className="mb-0">Summary</h5>
        </div>
        <div className="card-body">
          <p className="fw-bold fs-4 mb-0">
            Grand Total: <span className="text-primary">₹{totalAmount}</span>
          </p>
          <Button
            label="Save Changes"
            onClick={handleSave}
            className="btn mt-3"
            style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }}
          />
          <div className="mt-3">
            <Link to="/">Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
