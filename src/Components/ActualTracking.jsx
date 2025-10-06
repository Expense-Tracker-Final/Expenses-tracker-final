import React, { useEffect, useState } from "react";
import { expenseService } from "../services/expenseServices";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import '../App.css';

function ActualTracker() {
  const [frequentState, setFrequentState] = useState({});
  const [dailyState, setDailyState] = useState({});
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "", category: "" });
  const [income, setIncome] = useState("");

  const today = new Date().toLocaleDateString("en-GB");
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString("en-GB");

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

  // Generate unique key for items in daily records
  const getUniqueKey = (name, price, dailyItems) => {
    let key = name;
    let counter = 1;
    while (dailyItems[key] && dailyItems[key].price !== price) {
      key = `${name}_${counter}`;
      counter++;
    }
    return key;
  };

  // Add frequent item to daily records
  const handleAddFrequent = async (itemName) => {
    const itemData = frequentState[itemName];
    const price = Number(itemData.price);
    const dailyItems = dailyState[today] || {};

    const uniqueKey = getUniqueKey(itemName, price, dailyItems);
    const existing = dailyItems[uniqueKey];
    const newQuantity = (existing?.quantity || 0) + Number(itemData.quantity);

    const record = {
      [uniqueKey]: {
        quantity: newQuantity,
        price,
        total: newQuantity * price,
        category: itemData.category,
      },
    };

    try {
      const updatedToday = { ...dailyItems, ...record };
      const updatedData = { ...dailyState, [today]: updatedToday };
      await expenseService.updateDailyRecord("", updatedData);
      setDailyState(updatedData);
    } catch (err) {
      alert("Error adding record");
    }
  };

  // Add new item to daily records
  const handleAddNewItem = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) {
      alert("Please fill all fields");
      return;
    }

    const name = newItem.name;
    const price = Number(newItem.price);
    const dailyItems = dailyState[today] || {};

    const uniqueKey = getUniqueKey(name, price, dailyItems);
    const existing = dailyItems[uniqueKey];
    const newQuantity = (existing?.quantity || 0) + Number(newItem.quantity);

    const record = {
      [uniqueKey]: {
        quantity: newQuantity,
        price,
        total: newQuantity * price,
        category: newItem.category || "misc",
      },
    };

    try {
      const updatedToday = { ...dailyItems, ...record };
      const updatedData = { ...dailyState, [today]: updatedToday };
      await expenseService.updateDailyRecord("", updatedData);
      setDailyState(updatedData);
      setNewItem({ name: "", quantity: "", price: "", category: "" });
    } catch (err) {
      alert("Error adding record",err);
    }
  };

  // Remove frequent item
  const handleRemoveFrequent = async (itemName) => {
    const { [itemName]: removed, ...rest } = frequentState;
    try {
      await expenseService.updateFrequentRecord("", rest);
      setFrequentState(rest);
    } catch (err) {
      alert("Error removing frequent item",err);
    }
  };

  // Remove item from daily records
  const handleRemoveDailyItem = async (itemName) => {
    const { [itemName]: removed, ...rest } = dailyState[today] || {};
    const updatedData = { ...dailyState, [today]: rest };
    try {
      await expenseService.updateDailyRecord("", updatedData);
      setDailyState(updatedData);
    } catch (err) {
      alert("Error removing item",err);
    }
  };

  // Add income for the first of the month
  const handleAddIncome = async () => {
    if (!income) {
      alert("Enter income amount");
      return;
    }

    const firstDayItems = dailyState[firstOfMonth] || {};

    const incomeRecord = {
      income: {
        quantity: 1,
        price: Number(income),
        total: Number(income),
        category: "income",
      },
    };

    const updatedFirstDay = { ...firstDayItems, ...incomeRecord };
    const updatedData = { ...dailyState, [firstOfMonth]: updatedFirstDay };

    try {
      await expenseService.updateDailyRecord("", updatedData);
      setDailyState(updatedData);
      setIncome("");
      alert("Income added successfully!");
    } catch (err) {
      alert("Error adding income",err);
    }
  };

  // Compute daily total
  const dailyItems = dailyState[today] || {};
  const totalAmount = Object.values(dailyItems).reduce(
    (sum, item) => sum + item.total,
    0
  );

  return (
    <div className="container rounded shadow-lg py-4 px-3 mt-4" style={{ backgroundColor: "#f8f8f821" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="frequent-title mb-0">Actual Expense Tracking</h2>
        <NavLink to="/frequent" className="btn" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }}>Frequent Items</NavLink>
      </div>

      {/* Income Input */}
      <div className="card mb-4 frequent-card">
        <div className="card-header text-white frequent-card-header" style={{ backgroundColor: "#456882" }}>
          <h4 className="mb-0">Add Income for 1st of Month ({firstOfMonth})</h4>
        </div>
        <div className="card-body d-flex gap-2 align-items-end">
          <Input
            label="Income Amount"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
          <Button
            label="Add Income"
            onClick={handleAddIncome}
            className="btn"
            style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }}
          />
        </div>
      </div>

      {/* Add New Item */}
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

      {/* Frequent Items */}
      <div className="card frequent-card mb-4">
        <div className="card-header text-white frequent-card-header" style={{ backgroundColor: "#456882" }}>
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
                        <Button label="Add" onClick={() => handleAddFrequent(itemName)} className="btn btn-sm" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }} />
                        <Button label="Remove" onClick={() => handleRemoveFrequent(itemName)} className="btn btn-sm ms-1" style={{ backgroundColor: "#ff4d4d", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Daily Summary */}
      <div className="container mt-4 border p-3">
        <h4>Today's Records</h4>
        {Object.entries(dailyItems).map(([name, data]) => (
          <div key={name} className="d-flex justify-content-between mb-2">
            <span>{name} ({data.category})</span>
            <span>Qty: {data.quantity}, Price: {data.price}, Total: {data.total}</span>
            <Button label="Remove" onClick={() => handleRemoveDailyItem(name)} className="btn btn-sm" style={{ backgroundColor: "#ff4d4d", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }} />
          </div>
        ))}
        <hr />
        <h5>Total: ₹{totalAmount}</h5>
      </div>

      {/* Navigation block */}
      <div className="mt-4">
        <h5 className="text-secondary">Navigate:</h5>
        <div className="d-flex gap-2 flex-wrap" >
          <Link to="/frequent">
            <Button label="Frequent List" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }} />
          </Link>
          <Link to="/daily">
            <Button label="Daily Summary" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }} />
          </Link>
          <Link to="/edit">
            <Button label="Edit" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }} />
          </Link>
          <Link to="/weeklyMonthy">
            <Button label="Weekly/Monthly Summary" style={{ backgroundColor: "#456882", color: "#fff", border: "2px solid #ffffff", borderRadius: "8px" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ActualTracker;
