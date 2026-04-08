import { useEffect, useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

const starterItems = [
  {
    id: crypto.randomUUID(),
    name: 'Pokémon Base Set Charizard',
    currentPrice: 320,
    history: [
      { date: 'Apr 01', price: 280 },
      { date: 'Apr 03', price: 295 },
      { date: 'Apr 05', price: 310 },
      { date: 'Apr 08', price: 320 },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'Hot Wheels Redline',
    currentPrice: 95,
    history: [
      { date: 'Apr 01', price: 88 },
      { date: 'Apr 03', price: 90 },
      { date: 'Apr 06', price: 92 },
      { date: 'Apr 08', price: 95 },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'Funko Pop Spider-Man',
    currentPrice: 42,
    history: [
      { date: 'Apr 01', price: 36 },
      { date: 'Apr 03', price: 39 },
      { date: 'Apr 06', price: 41 },
      { date: 'Apr 08', price: 42 },
    ],
  },
]

function App() {
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [selectedItemId, setSelectedItemId] = useState(null)

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('collectible-companion-items')
    return saved ? JSON.parse(saved) : starterItems
  })

  useEffect(() => {
    localStorage.setItem('collectible-companion-items', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (items.length && !selectedItemId) {
      setSelectedItemId(items[0].id)
    }

    if (selectedItemId && !items.find((item) => item.id === selectedItemId)) {
      setSelectedItemId(items[0]?.id ?? null)
    }
  }, [items, selectedItemId])

  const selectedItem =
    items.find((item) => item.id === selectedItemId) ?? items[0] ?? null

  const chartData = useMemo(() => {
    return selectedItem ? selectedItem.history : []
  }, [selectedItem])

  const addItem = () => {
    const trimmedName = itemName.trim()
    const price = Number(itemPrice)

    if (!trimmedName || Number.isNaN(price) || price <= 0) {
      alert('Enter a valid item name and price.')
      return
    }

    const today = new Date().toLocaleDateString([], {
      month: 'short',
      day: '2-digit',
    })

    const newItem = {
      id: crypto.randomUUID(),
      name: trimmedName,
      currentPrice: price,
      history: [{ date: today, price }],
    }

    setItems((prev) => [newItem, ...prev])
    setSelectedItemId(newItem.id)
    setItemName('')
    setItemPrice('')
  }

  const updatePrice = (id) => {
    const value = window.prompt('Enter the latest price:')
    if (value === null) return

    const price = Number(value)
    if (Number.isNaN(price) || price <= 0) {
      alert('Please enter a valid price.')
      return
    }

    const today = new Date().toLocaleDateString([], {
      month: 'short',
      day: '2-digit',
    })

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              currentPrice: price,
              history: [...item.history, { date: today, price }],
            }
          : item
      )
    )
  }

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="container">
      <header>
        <h1>Collectible Companion</h1>
        <p>Track collectible prices and visualize real price changes over time</p>
      </header>

      <section className="add-item">
        <input
          type="text"
          placeholder="Enter collectible name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Enter starting price"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />
        <button onClick={addItem}>Add Item</button>
      </section>

      <section className="dashboard">
        <h2>Tracked Items</h2>

        {items.length === 0 ? (
          <div className="empty-box">No items yet.</div>
        ) : (
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className={selectedItemId === item.id ? 'active-item' : ''}
              >
                <div
                  className="item-main"
                  onClick={() => setSelectedItemId(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedItemId(item.id)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="item-text">
                    <strong>{item.name}</strong>
                    <span>${item.currentPrice.toFixed(2)}</span>
                  </div>
                  <small>{item.history.length} price points</small>
                </div>

                <div className="item-actions">
                  <button onClick={() => updatePrice(item.id)}>Update Price</button>
                  <button className="delete-btn" onClick={() => deleteItem(item.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="chart-placeholder">
        <h2>Price Trend</h2>
        <div className="chart-box">
          {selectedItem ? (
            <>
              <div className="chart-header">
                <strong>{selectedItem.name}</strong>
                <span>Current: ${selectedItem.currentPrice.toFixed(2)}</span>
              </div>

              <div className="chart-area">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#eeeafc" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: '#9a98b7', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#9a98b7', fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#b8aefc"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#dcd6ff' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="history-list">
                {selectedItem.history.map((entry, index) => (
                  <div key={`${entry.date}-${index}`} className="history-item">
                    <span>{entry.date}</span>
                    <strong>${entry.price.toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-box">Select an item to see its graph.</div>
          )}
        </div>
      </section>
    </div>
  )
}

export default App