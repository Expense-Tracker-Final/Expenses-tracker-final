import React, { useEffect, useState } from "react";
import Input from "../common/ui/Input";
import Button from "../common/ui/Button";
import { expenseService } from "../services/expenseServices";
import { Link } from "react-router-dom";

function Frequent() {
  // states declaration

  const [frequentState, setFrequentState] = useState({});
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
  });

  //use effect to handle side effects- goes out to fetch
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

  // on change handling
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

  // update data
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

      await fetch("http://localhost:7600/frequentRecords", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      setFrequentState(updatedData);
      alert("Updated successfully!");
    } catch (err) {
      alert("Error updating record");
    }
  };

  //remove data
  const handleRemove = async (itemName) => {
    const { [itemName]: removed, ...rest } = frequentState;
    try {
      await fetch("http://localhost:7600/frequentRecords", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      setFrequentState(rest);
      alert(`${itemName} removed!`);
    } catch (err) {
      alert("Error removing item");
    }
  };
  //handle new data
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
      await fetch("http://localhost:7600/frequentRecords", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      setFrequentState(updatedData);
      setNewItem({ name: "", quantity: "", price: "", category: "" });
      alert("New item added!");
    } catch (err) {
      alert("Error adding new item");
    }
  };

  return (
    //overall container begins here
    <div className="container mt-4">
      {/* routing link to the actual tracking component */}
      <Link to="/">go back</Link>
      {/* dont touch the link */}
      <h2>Frequent Records</h2>

      {/* mapping begins here */}
      {Object.entries(frequentState).map(([itemName, itemData]) => (
        <div key={itemName} className="row align-items-center mb-2">
          {/* item name is here */}

          <div className="col-2 fw-bold">{itemName}</div>

          {/* form container begins */}
          <div className="col-2">


            {/* input fields begins here */}
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

            {/* add and remove buttons begin here */}
            <Button label="Update" onClick={() => handleUpdate(itemName)} />
          </div>
          <div className="col-2">
            <Button label="Remove" onClick={() => handleRemove(itemName)} />
          </div>
        </div>
      ))}
{/* prefilled form ends here */}
      <hr />
{/* empty field begins here */}
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
    </div>
  );
}

export default Frequent;
