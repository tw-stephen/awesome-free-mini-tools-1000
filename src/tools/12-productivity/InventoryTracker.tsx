import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  minStock: number
  price: number
  location: string
  lastUpdated: string
}

export default function InventoryTracker() {
  const { t } = useTranslation()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [categories, setCategories] = useState<string[]>(['General'])
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all')
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all')
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'General',
    quantity: 0,
    minStock: 5,
    price: 0,
    location: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('inventory-tracker')
    const savedCategories = localStorage.getItem('inventory-categories')
    if (saved) setItems(JSON.parse(saved))
    if (savedCategories) setCategories(JSON.parse(savedCategories))
  }, [])

  const saveItems = (updated: InventoryItem[]) => {
    setItems(updated)
    localStorage.setItem('inventory-tracker', JSON.stringify(updated))
  }

  const saveCategories = (updated: string[]) => {
    setCategories(updated)
    localStorage.setItem('inventory-categories', JSON.stringify(updated))
  }

  const addItem = () => {
    if (!form.name) return
    const item: InventoryItem = {
      id: editingId || Date.now().toString(),
      name: form.name,
      sku: form.sku || `SKU-${Date.now().toString().slice(-6)}`,
      category: form.category,
      quantity: form.quantity,
      minStock: form.minStock,
      price: form.price,
      location: form.location,
      lastUpdated: new Date().toISOString()
    }

    if (editingId) {
      saveItems(items.map(i => i.id === editingId ? item : i))
    } else {
      saveItems([item, ...items])
    }

    resetForm()
  }

  const resetForm = () => {
    setForm({ name: '', sku: '', category: 'General', quantity: 0, minStock: 5, price: 0, location: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (item: InventoryItem) => {
    setForm({
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity: item.quantity,
      minStock: item.minStock,
      price: item.price,
      location: item.location
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const updateQuantity = (id: string, change: number) => {
    saveItems(items.map(item =>
      item.id === id ? {
        ...item,
        quantity: Math.max(0, item.quantity + change),
        lastUpdated: new Date().toISOString()
      } : item
    ))
  }

  const deleteItem = (id: string) => {
    saveItems(items.filter(i => i.id !== id))
  }

  const addCategory = () => {
    const name = prompt(t('tools.inventoryTracker.categoryName'))
    if (name && !categories.includes(name)) {
      saveCategories([...categories, name])
    }
  }

  const filteredItems = useMemo(() => {
    let filtered = items

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.sku.toLowerCase().includes(query)
      )
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(i => i.category === filterCategory)
    }

    if (filterStock === 'low') {
      filtered = filtered.filter(i => i.quantity <= i.minStock && i.quantity > 0)
    } else if (filterStock === 'out') {
      filtered = filtered.filter(i => i.quantity === 0)
    }

    return filtered
  }, [items, searchQuery, filterCategory, filterStock])

  const stats = useMemo(() => {
    const totalItems = items.length
    const totalValue = items.reduce((sum, i) => sum + i.quantity * i.price, 0)
    const lowStock = items.filter(i => i.quantity <= i.minStock && i.quantity > 0).length
    const outOfStock = items.filter(i => i.quantity === 0).length
    return { totalItems, totalValue, lowStock, outOfStock }
  }, [items])

  const exportCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'Quantity', 'Min Stock', 'Price', 'Location', 'Last Updated']
    const rows = items.map(i => [i.sku, i.name, i.category, i.quantity, i.minStock, i.price, i.location, i.lastUpdated])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inventory.csv'
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div className="card p-3 text-center">
          <div className="text-lg font-bold">{stats.totalItems}</div>
          <div className="text-xs text-slate-500">{t('tools.inventoryTracker.items')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-lg font-bold">${stats.totalValue.toFixed(0)}</div>
          <div className="text-xs text-slate-500">{t('tools.inventoryTracker.value')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-lg font-bold text-yellow-600">{stats.lowStock}</div>
          <div className="text-xs text-slate-500">{t('tools.inventoryTracker.lowStock')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-lg font-bold text-red-600">{stats.outOfStock}</div>
          <div className="text-xs text-slate-500">{t('tools.inventoryTracker.outOfStock')}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('tools.inventoryTracker.search')}
          className="flex-1 px-3 py-2 border border-slate-300 rounded"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          +
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
        >
          <option value="all">{t('tools.inventoryTracker.allCategories')}</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value as 'all' | 'low' | 'out')}
          className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
        >
          <option value="all">{t('tools.inventoryTracker.allStock')}</option>
          <option value="low">{t('tools.inventoryTracker.lowStock')}</option>
          <option value="out">{t('tools.inventoryTracker.outOfStock')}</option>
        </select>
        <button onClick={addCategory} className="px-3 py-2 bg-slate-100 rounded text-sm">
          + {t('tools.inventoryTracker.category')}
        </button>
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('tools.inventoryTracker.itemName')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder={t('tools.inventoryTracker.sku')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder={t('tools.inventoryTracker.location')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-slate-500">{t('tools.inventoryTracker.quantity')}</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">{t('tools.inventoryTracker.minStock')}</label>
              <input
                type="number"
                value={form.minStock}
                onChange={(e) => setForm({ ...form, minStock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">{t('tools.inventoryTracker.price')}</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                step="0.01"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={resetForm} className="py-2 bg-slate-100 rounded">
              {t('tools.inventoryTracker.cancel')}
            </button>
            <button
              onClick={addItem}
              disabled={!form.name}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingId ? t('tools.inventoryTracker.update') : t('tools.inventoryTracker.add')}
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        {filteredItems.length === 0 ? (
          <p className="text-center text-slate-500 py-4">{t('tools.inventoryTracker.noItems')}</p>
        ) : (
          <div className="space-y-2">
            {filteredItems.map(item => {
              const isLow = item.quantity <= item.minStock && item.quantity > 0
              const isOut = item.quantity === 0
              return (
                <div key={item.id} className={`p-3 rounded ${isOut ? 'bg-red-50' : isLow ? 'bg-yellow-50' : 'bg-slate-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-slate-500">
                        {item.sku} • {item.category} {item.location && `• ${item.location}`}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(item)} className="text-blue-500 text-sm">✎</button>
                      <button onClick={() => deleteItem(item.id)} className="text-red-500 text-sm">×</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-slate-200 rounded"
                      >
                        -
                      </button>
                      <span className={`font-bold text-lg ${isOut ? 'text-red-600' : isLow ? 'text-yellow-600' : ''}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-slate-200 rounded"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-slate-600">
                      ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <button onClick={exportCSV} className="w-full py-2 bg-slate-100 rounded text-sm">
        {t('tools.inventoryTracker.exportCSV')}
      </button>
    </div>
  )
}
