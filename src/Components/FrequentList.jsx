import React, { useEffect, useState } from "react";
import Input from "../common/ui/Input";
import Button from "../common/ui/Button";
import { expenseService } from "../services/expenseServices";
import { Link } from "react-router-dom";

function Frequent() {
  const [frequentState, setFrequentState] = useState({});
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
  });

  // fetch records on mount
  useEffect(() => {
    const fetchFrequentRecords = async () => {
      try {
        const response = await expenseService.getFrequentRecords();
        setFrequentState(response.data);
      } catch (err) {
        console.error("Error fetching frequent records", err);
      }
    };
    fetchFrequentRecords();
  }, []);

  const handleChange = (itemName, field, value) => {
    setFrequentState((prev) => {
      const updatedItem = {
        ...prev[itemName],
        [field]: value,
      };
      if (field === "quantity" || field === "price") {
        updatedItem.total =
          Number(updatedItem.quantity) * Number(updatedItem.price);
      }
      return {
        ...prev,
        [itemName]: updatedItem,
      };
    });
  };

  const handleUpdate = async (itemName) => {
    try {
      const updatedItem = {
        ...frequentState[itemName],
        total:
          Number(frequentState[itemName].quantity) *
          Number(frequentState[itemName].price),
      };

      const updatedData = {
        ...frequentState,
        [itemName]: updatedItem,
      };

      // here we are updating the whole object since your DB holds it that way
      await expenseService.updateFrequentRecord("", updatedData);
      setFrequentState(updatedData);
    } catch (err) {
      alert("Error updating record");
    }
  };

  const handleRemove = async (itemName) => {
    const { [itemName]: removed, ...rest } = frequentState;
    try {
      await expenseService.updateFrequentRecord("", rest);
      setFrequentState(rest);
    } catch (err) {
      alert("Error removing item");
    }
  };

  const handleAddNew = async () => {
    if (!newItem.name) return alert("Enter item name");

    const record = {
      [newItem.name]: {
        quantity: Number(newItem.quantity),
        price: Number(newItem.price),
        total: Number(newItem.quantity) * Number(newItem.price),
        category: newItem.category,
      },
    };

    try {
      const updatedData = { ...frequentState, ...record };
      await expenseService.updateFrequentRecord("", updatedData);
      setFrequentState(updatedData);
      setNewItem({ name: "", quantity: "", price: "", category: "" });
    } catch (err) {
      alert("Error adding new item");
    }
  };

  return (
    <div className="container mt-4">
      <Link to="/">go back</Link>
      <h2>Frequent Records</h2>

      {Object.entries(frequentState).map(([itemName, itemData]) => (
        <div key={itemName} className="row align-items-center mb-2">
          <div className="col-2 fw-bold">{itemName}</div>
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
              onChange={(e) => handleChange(itemName, "price", e.target.value)}
            />
          </div>
          <div className="col-2">{itemData.category}</div>
          <div className="col-2">
            <Button label="Update" onClick={() => handleUpdate(itemName)} />
          </div>
          <div className="col-2">
            <Button label="Remove" onClick={() => handleRemove(itemName)} />
          </div>
        </div>
      ))}

      <hr />

      <h4>Add New Item</h4>
      <div className="row align-items-center mb-2">
        <div className="col-2">
          <Input
            label="Name"
            value={newItem.name}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="col-2">
          <Input
            label="Quantity"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, quantity: e.target.value }))
            }
          />
        </div>
        <div className="col-2">
          <Input
            label="Price"
            value={newItem.price}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, price: e.target.value }))
            }
          />
        </div>
        <div className="col-2">
          <select
            className="form-control"
            value={newItem.category}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="">Category</option>
            <option value="food">Food & Beverage</option>
            <option value="travel">Travel</option>
            <option value="entertainment">Entertainment</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div className="col-2">
          <Button label="Add Item" onClick={handleAddNew} />
        </div>
      </div>
 <hr />
      {/* Summary box */}
     
      <div className="border p-3 mt-4 row">
        <h5>All Frequent Items</h5>
        {Object.entries(frequentState).length === 0 ? (
          <p>No items yet.</p>
        ) : (
          <>
            <ul className="list-unstyled">
              {Object.entries(frequentState).map(([itemName, itemData]) => (
                <li key={itemName} className="mb-2">
                  <strong>{itemName}</strong> — Price: ₹{itemData.price} |
                  Total: ₹{itemData.total}
                </li>
              ))}
            </ul>
            <hr />
            <p className="fw-bold">
              Grand Total: ₹
              {Object.values(frequentState).reduce(
                (sum, item) => sum + Number(item.total || 0),
                0
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Frequent;
