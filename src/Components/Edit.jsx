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
      const records = allDailyRecords.data[date] || {};
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
      const updatedValue = field === "category" ? value : Number(value);
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
        [date]: dailyItems,
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
    <div className="container rounded shadow-lg py-4 px-3 mt-4 frequent-bg">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="frequent-title mb-0">Edit Daily Expenses</h2>
  <Link to="/budget">
          <button className="btn" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }}>Back</button>
        </Link>
      </div>

      <div className="card mb-4 frequent-card">
        <div className="card-header text-white frequent-card-header" style={{ backgroundColor: "#456882" }}>
          <h4 className="mb-0">Select Date</h4>
        </div>
        <div className="card-body d-flex flex-wrap gap-2 align-items-end">
          <Input
            label="Enter Date (DD/MM/YYYY)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Button label="Fetch" onClick={handleFetch} className="btn ms-2" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }} />
        </div>
      </div>

      {loading && <p>Loading...</p>}

      <div className="card frequent-card mb-4">
        <div className="card-header text-white frequent-card-header" style={{ backgroundColor: "#456882" }}>
          <h4 className="mb-0">Edit Items</h4>
        </div>
        <div className="card-body">
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
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(dailyItems).map(([key, item]) => (
                    <tr key={key}>
                      <td className="fw-bold">{key}</td>
                      <td>
                        <Input
                          label="Quantity"
                          value={item.quantity}
                          onChange={(e) => handleChange(key, "quantity", e.target.value)}
                        />
                      </td>
                      <td>
                        <Input
                          label="Price"
                          value={item.price}
                          onChange={(e) => handleChange(key, "price", e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          value={item.category}
                          onChange={(e) => handleChange(key, "category", e.target.value)}
                        >
                          <option value="food">Food & Beverage</option>
                          <option value="travel">Travel</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="others">Others</option>
                        </select>
                      </td>
                      <td className="fw-bold text-success">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
          <Button label="Save Changes" onClick={handleSave} className="btn mt-3" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }} />
        </div>
      </div>
    </div>
  );
}

export default Edit;
