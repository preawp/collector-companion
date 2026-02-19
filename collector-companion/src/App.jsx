import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // Load stored items when app starts
  useEffect(() => {
    const savedItems = localStorage.getItem("trackedItems");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save items whenever they change
  useEffect(() => {
    localStorage.setItem("trackedItems", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (newItem.trim() === "") return;

    const newTrackedItem = {
      id: Date.now(),
      name: newItem,
      snapshots: [] // will store price history later
    };

    setItems([...items, newTrackedItem]);
    setNewItem("");
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="container">
      <header>
        <h1>Collectible Companion</h1>
        <p>Track collectible prices over time</p>
      </header>

      <section className="add-item">
        <input
          type="text"
          placeholder="Enter item name..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={addItem}>Add Item</button>
      </section>

      <section className="dashboard">
        <h2>Tracked Items</h2>

        {items.length === 0 ? (
          <p>No items tracked yet.</p>
        ) : (
          <ul>
            {items.map(item => (
              <li key={item.id}>
                <span>{item.name}</span>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="chart-placeholder">
        <h2>Price Trend</h2>
        <div className="chart-box">
          <div className="fake-graph">
            <div className="line"></div>
            <div className="dot" style={{ left: "10%", bottom: "30%" }}></div>
            <div className="dot" style={{ left: "30%", bottom: "45%" }}></div>
            <div className="dot" style={{ left: "50%", bottom: "35%" }}></div>
            <div className="dot" style={{ left: "70%", bottom: "60%" }}></div>
            <div className="dot" style={{ left: "90%", bottom: "50%" }}></div>
          </div>
        </div>
      </section>

    </div>
  );
}
export default App
