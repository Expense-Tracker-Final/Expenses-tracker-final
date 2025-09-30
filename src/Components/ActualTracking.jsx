import React, { useEffect, useState } from "react";
import { expenseService } from "../services/expenseServices";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";

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
    <>
      <h1>Actual Tracking Area</h1>
      <NavLink to="/frequent">Edit Frequent Items</NavLink>

      {/* Existing frequent items */}
      {Object.entries(frequentState).map(([itemName, itemData]) => (
        <div key={itemName} className="container mb-2">
          <div className="row align-items-center">
            <p className="fw-bold col-2">{itemName}</p>
            <div className="col-2">
              <Input
                label="Quantity"
                value={itemData.quantity}
                onChange={(e) => handleChange(itemName, "quantity", e.target.value)}
              />
            </div>
            <div className="col-2">
              <Input
                label="Price"
                value={itemData.price}
                onChange={(e) => handleChange(itemName, "price", e.target.value)}
              />
            </div>
            <div className="col-2">{itemData.category}</div>
            <div className="col-2">
              <Button label="Add" onClick={() => handleAddFrequent(itemName)} />
            </div>
          </div>
        </div>
      ))}

      {/* New item row */}
      <div className="container mb-2 border-top pt-2 mt-3">
        <div className="row align-items-center">
          <div className="col-2">
            <Input
              label="Item Name"
              value={newItem.name}
              onChange={(e) => handleNewItemChange("name", e.target.value)}
            />
          </div>
          <div className="col-2">
            <Input
              label="Quantity"
              value={newItem.quantity}
              onChange={(e) => handleNewItemChange("quantity", e.target.value)}
            />
          </div>
          <div className="col-2">
            <Input
              label="Price"
              value={newItem.price}
              onChange={(e) => handleNewItemChange("price", e.target.value)}
            />
          </div>
          <div className="col-2">
            <select
              className="form-select"
              value={newItem.category}
              onChange={(e) => handleNewItemChange("category", e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="food">Food & Beverage</option>
              <option value="travel">Travel</option>
              <option value="entertainment">Entertainment</option>
              <option value="others">others</option>
            </select>
          </div>
          <div className="col-2">
            <Button label="Add" onClick={handleAddNewItem} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ActualTracker;
