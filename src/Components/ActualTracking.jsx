import React, { useEffect, useState } from "react";
import { expenseService } from "../services/expenseServices";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import '../App.css';

function ActualTracker() {
  const [frequentState, setFrequentState] = useState({});
  const [dailyState, setDailyState] = useState({});
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "", category: "" });

  // Fetch frequent and daily records
  useEffect(() => {
    const fetchAllRecords = async () => {
      try {
        const dailyResponse = await expenseService.getDailyRecords();
        setDailyState(dailyResponse.data);

        const frequentResponse = await expenseService.getFrequentRecords();
        setFrequentState(frequentResponse.data);
      } catch (err) {
        console.error("Error fetching records", err);
      }
    };
    fetchAllRecords();
  }, []);

  // Update existing frequent item
  const handleChange = (itemName, field, value) => {
    setFrequentState((prev) => ({
      ...prev,
      [itemName]: { ...prev[itemName], [field]: value },
    }));
  };

  // Update new item input
  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  // Add existing frequent item to daily records
  const handleAddFrequent = async (itemName) => {
    const today = new Date().toLocaleDateString("en-GB");
    const itemData = frequentState[itemName];
    const record = {
      [itemName]: {
        quantity: Number(itemData.quantity),
        price: Number(itemData.price),
        total: Number(itemData.quantity) * Number(itemData.price),
        category: itemData.category,
      },
    };

    try {
      const updatedToday = { ...(dailyState[today] || {}), ...record };
      const updatedData = { ...dailyState, [today]: updatedToday };
      await axios.put("http://localhost:8000/dailyRecords", updatedData);
      setDailyState(updatedData);
    } catch (err) {
      alert("Error adding record",err);
    }
  };

  // Add new item to daily records
  const handleAddNewItem = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) {
      alert("Please fill all fields");
      return;
    }

    const today = new Date().toLocaleDateString("en-GB");
    const record = {
      [newItem.name]: {
        quantity: Number(newItem.quantity),
        price: Number(newItem.price),
        total: Number(newItem.quantity) * Number(newItem.price),
        category: newItem.category || "misc",
      },
    };

    try {
      const updatedToday = { ...(dailyState[today] || {}), ...record };
      const updatedData = { ...dailyState, [today]: updatedToday };
      await axios.put("http://localhost:7600/dailyRecords", updatedData);
      setDailyState(updatedData);
      setNewItem({ name: "", quantity: "", price: "", category: "" });
    } catch (err) {
      alert("Error adding record",err);
    }
  };

  return (
    <div className="container rounded shadow-lg py-4 px-3 mt-4" style={{ backgroundColor: "#f8f8f821" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="frequent-title mb-0">Actual Expense Tracking</h2>
        <NavLink to="/frequent" className="btn" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }}>Frequent Items</NavLink>
      </div>

      <div className="card mb-4 frequent-card">
        <div className="card-header text-white frequent-card-header" style={{ backgroundColor: "#456882" }}>
          <h4 className="mb-0">Add New Item</h4>
        </div>
        <div className="card-body">
          <div className="row align-items-end g-2">
            <div className="col-md-3">
              <Input
                label="Item Name"
                value={newItem.name}
                onChange={(e) => handleNewItemChange("name", e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <Input
                label="Quantity"
                value={newItem.quantity}
                onChange={(e) => handleNewItemChange("quantity", e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <Input
                label="Price"
                value={newItem.price}
                onChange={(e) => handleNewItemChange("price", e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="categoryDropdown" className="form-label">Choose</label>
              <select
                id="categoryDropdown"
                className="form-control"
                value={newItem.category}
                onChange={(e) => handleNewItemChange("category", e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="food">Food & Beverage</option>
                <option value="travel">Travel</option>
                <option value="entertainment">Entertainment</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div className="col-md-2">
              <Button label="Add" onClick={handleAddNewItem} className="btn w-100" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card frequent-card mb-4">
        <div className="card-header bg-secondary text-white frequent-card-header">
          <h4 className="mb-0">Frequent Items</h4>
        </div>
        <div className="card-body">
          {Object.entries(frequentState).length === 0 ? (
            <p className="text-muted">No frequent items yet.</p>
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
                  {Object.entries(frequentState).map(([itemName, itemData]) => (
                    <tr key={itemName}>
                      <td className="fw-bold">{itemName}</td>
                      <td>
                        <Input
                          label="Quantity"
                          value={itemData.quantity}
                          onChange={(e) => handleChange(itemName, "quantity", e.target.value)}
                        />
                      </td>
                      <td>
                        <Input
                          label="Price"
                          value={itemData.price}
                          onChange={(e) => handleChange(itemName, "price", e.target.value)}
                        />
                      </td>
                      <td>{itemData.category}</td>
                      <td className="fw-bold text-success">₹{Number(itemData.quantity) * Number(itemData.price)}</td>
                      <td>
                        <Button label="Add" onClick={() => handleAddFrequent(itemName)} className="btn btn-sm" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }}   />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActualTracker;
