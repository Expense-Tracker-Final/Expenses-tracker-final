import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import { expenseService } from "../services/expenseServices";
import React from "react";

function ActualTracker() {
  const [frequentState, setFrequentState] = useState({});
  const [dailyState, setDailyState] = useState({});
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
  });

  const today = new Date().toLocaleDateString("en-GB");

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

  // Update frequent item input
  const handleChange = (itemName, field, value) => {
    setFrequentState((prev) => ({
      ...prev,
      [itemName]: { ...prev[itemName], [field]: value },
    }));
  };

  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  // Utility to generate unique item key
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
      alert("Error adding record");
    }
  };

  // Remove frequent item
  const handleRemoveFrequent = async (itemName) => {
    const { [itemName]: removed, ...rest } = frequentState;
    try {
      await expenseService.updateFrequentRecord("", rest);
      setFrequentState(rest);
    } catch (err) {
      alert("Error removing frequent item");
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
      alert("Error removing item");
    }
  };

  // Compute daily total
  const dailyItems = dailyState[today] || {};
  const totalAmount = Object.values(dailyItems).reduce(
    (sum, item) => sum + item.total,
    0
  );

  return (
    <>
      <h1>Actual Tracking Area</h1>
      <NavLink to="/frequent">Edit Frequent Items</NavLink>

      {/* Frequent items */}
      {Object.entries(frequentState).map(([itemName, itemData]) => (
        <div key={itemName} className="container mb-2">
          <div className="row align-items-center">
            <p className="fw-bold col-2">{itemName}</p>
            <div className="col-2">
              <Input
                label="Quantity"
                value={itemData.quantity}
                onChange={(e) =>
                  handleChange(itemName, "quantity", e.target.value)
                }
              />
            </div>
            <div className="col-2">
              <Input
                label="Price"
                value={itemData.price}
                onChange={(e) =>
                  handleChange(itemName, "price", e.target.value)
                }
              />
            </div>
            <div className="col-2">{itemData.category}</div>
            <div className="col-2">
              <Button label="Add" onClick={() => handleAddFrequent(itemName)} />
            </div>
            <div className="col-2">
              <Button
                label="Remove"
                onClick={() => handleRemoveFrequent(itemName)}
              />
            </div>
          </div>
        </div>
      ))}

      {/* New item */}
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
              <option value="others">Others</option>
            </select>
          </div>
          <div className="col-2">
            <Button label="Add" onClick={handleAddNewItem} />
          </div>
        </div>
      </div>

      {/* Daily summary */}
      <div className="container mt-4 border p-3">
        <h4>Today's Records</h4>
        {Object.entries(dailyItems).map(([name, data]) => (
          <div key={name} className="d-flex justify-content-between mb-2">
            <span>
              {name} ({data.category})
            </span>
            <span>
              Qty: {data.quantity}, Price: {data.price}, Total: {data.total}
            </span>
            <Button label="Remove" onClick={() => handleRemoveDailyItem(name)} />
          </div>
        ))}
        <hr />
        <h5>Total: {totalAmount}</h5>
      </div>
      <Link to="/daily">todaySummary</Link>
      <br />
      <Link to="/weeklyMonthy">Weekly/monthy</Link>
      <br />
      <Link to="/edit">editAnyDay</Link>
    </>
  );
}

export default ActualTracker;
