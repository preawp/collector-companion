import { useEffect, useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'

function getLastChange(item) {
  if (item.history.length < 2) return 0
  const last = item.history[item.history.length - 1].price
  const prev = item.history[item.history.length - 2].price
  return last - prev
}

function getPercentChange(item) {
  if (item.history.length < 2) return 0
  const first = item.history[0].price
  const last = item.history[item.history.length - 1].price
  if (first === 0) return 0
  return ((last - first) / first) * 100
}

const starterItems = [
  {
    id: crypto.randomUUID(),
    name: 'Barbie Swan Lake 2003 Odette Doll',
    currentPrice: 240,
    history: [
      { date: 'Jan 2025', price: 145 },
      { date: 'Apr 2025', price: 130 },
      { date: 'Aug 2025', price: 180 },
      { date: 'Dec 2025', price: 225 },
      { date: 'Apr 2026', price: 240 },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'Funko Pop! Pride and Prejudice Mr. Darcy',
    currentPrice: 48,
    history: [
      { date: 'Feb 2026', price: 12 },
      { date: 'Mar 2026', price: 12 },
      { date: 'Apr 2026', price: 15 },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'Gentle Giant Harry Potter Nymphadora Tonks Mini Bust',
    currentPrice: 200,
    history: [
      { date: 'Jan 2025', price: 102 },
      { date: 'May 2025', price: 125 },
      { date: 'Sep 2025', price: 155 },
      { date: 'Jan 2026', price: 180 },
      { date: 'Apr 2026', price: 200 },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'Anastasia Music Box by The San Francisco Music Box Company',
    currentPrice: 850,
    history: [
      { date: 'Jan 2023', price: 420 },
      { date: 'Jul 2023', price: 500 },
      { date: 'Feb 2024', price: 610 },
      { date: 'Oct 2024', price: 720 },
      { date: 'Jun 2025', price: 790 },
      { date: 'Apr 2026', price: 850 },
    ],
  },
]

function App() {
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [compareIds, setCompareIds] = useState([])

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

  const compareItems = items.filter((item) => compareIds.includes(item.id))

  const compareChartData = useMemo(() => {
    if (compareItems.length < 2) return chartData

    const maxLength = Math.max(...compareItems.map((item) => item.history.length))

    return Array.from({ length: maxLength }, (_, index) => {
      const row = {
        date: compareItems[0].history[index]?.date || `Point ${index + 1}`,
      }

      compareItems.forEach((item) => {
        row[item.name] = item.history[index]?.price ?? null
      })

      return row
    })
  }, [compareItems, chartData])

  const averagePrice =
    items.length > 0
      ? items.reduce((sum, item) => sum + item.currentPrice, 0) / items.length
      : 0

  const highestItem =
    items.length > 0
      ? [...items].sort((a, b) => b.currentPrice - a.currentPrice)[0]
      : null

  const addItem = () => {
    const trimmedName = itemName.trim()
    const price = Number(itemPrice)

    if (!trimmedName || Number.isNaN(price) || price <= 0) {
      alert('Enter a valid item name and price.')
      return
    }

    const today = new Date().toLocaleString([], {
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
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

    const today = new Date().toLocaleString([], {
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
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
    setCompareIds((prev) => prev.filter((compareId) => compareId !== id))
  }

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((compareId) => compareId !== id)
      }

      if (prev.length >= 3) {
        alert('You can compare up to 3 items.')
        return prev
      }

      return [...prev, id]
    })
  }

  const isCompareMode = compareIds.length >= 2

  return (
    <div className="container">
      <header className="hero">
        <img src="/logo.png" alt="Collectible Companion" className="logo" />
        <p>Track collectible prices and visualize trends over time</p>
      </header>

      <section className="summary-grid">
        <div className="summary-card">
          <h3>Total Items</h3>
          <p>{items.length}</p>
        </div>

        <div className="summary-card">
          <h3>Average Price</h3>
          <p>${averagePrice.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Highest Item</h3>
          <p>{highestItem ? highestItem.name : 'N/A'}</p>
        </div>
      </section>

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

                    <small>
                      Last updated: {item.history[item.history.length - 1]?.date}
                    </small>

                    <small>
                      Change: {getLastChange(item) >= 0 ? '↑ +' : '↓ '}
                      {Math.abs(getLastChange(item)).toFixed(2)}
                    </small>

                    <small>
                      Total change: {getPercentChange(item) >= 0 ? '↑ +' : '↓ '}
                      {Math.abs(getPercentChange(item)).toFixed(1)}%
                    </small>
                  </div>

                  <small>{item.history.length} price snapshots</small>
                </div>

                <div className="item-actions">
                <label
                  className={`compare-check ${
                    compareIds.includes(item.id) ? 'compare-active' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={compareIds.includes(item.id)}
                    onChange={() => toggleCompare(item.id)}
                  />
                  <span>Compare</span>
                </label>

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
        <h2>{isCompareMode ? 'Comparison Chart' : 'Price Trend'}</h2>
        <div className="chart-box">
          {selectedItem ? (
            <>
              <div className="chart-header">
                <strong>
                  {isCompareMode ? `Comparing ${compareIds.length} items` : selectedItem.name}
                </strong>
                <span>
                  {isCompareMode
                    ? 'Selected items shown together'
                    : `Current: $${selectedItem.currentPrice.toFixed(2)}`}
                </span>
              </div>

              <div className="chart-area">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={isCompareMode ? compareChartData : chartData}>
                    <CartesianGrid stroke="#eeeafc" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: '#9a98b7', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#9a98b7', fontSize: 12 }} />
                    <Tooltip />
                    {isCompareMode && <Legend />}

                    {isCompareMode ? (
                      <>
                        {compareItems[0] && (
                          <Line
                            type="monotone"
                            dataKey={compareItems[0].name}
                            stroke="#b8aefc"
                            strokeWidth={3}
                            dot={{ r: 5, fill: '#dcd6ff' }}
                          />
                        )}

                        {compareItems[1] && (
                          <Line
                            type="monotone"
                            dataKey={compareItems[1].name}
                            stroke="#91d8b4"
                            strokeWidth={3}
                            dot={{ r: 5, fill: '#c8f7dc' }}
                          />
                        )}

                        {compareItems[2] && (
                          <Line
                            type="monotone"
                            dataKey={compareItems[2].name}
                            stroke="#ffb6c9"
                            strokeWidth={3}
                            dot={{ r: 5, fill: '#ffdce5' }}
                          />
                        )}
                      </>
                    ) : (
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#b8aefc"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#dcd6ff' }}
                        activeDot={{ r: 7 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {!isCompareMode && (
                <div className="history-list">
                  {selectedItem.history.map((entry, index) => (
                    <div key={`${entry.date}-${index}`} className="history-item">
                      <span>{entry.date}</span>
                      <strong>${entry.price.toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
              )}
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