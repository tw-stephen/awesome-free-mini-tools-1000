import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface GroceryItem {
  id: number
  name: string
  quantity: string
  category: string
  checked: boolean
}

export default function GroceryList() {
  const { t } = useTranslation()
  const [items, setItems] = useState<GroceryItem[]>([])
  const [newItem, setNewItem] = useState({ name: '', quantity: '1', category: 'produce' })
  const [filterCategory, setFilterCategory] = useState('all')
  const [showChecked, setShowChecked] = useState(true)

  const categories = [
    { id: 'produce', name: 'Produce', icon: '🥬' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'meat', name: 'Meat', icon: '🥩' },
    { id: 'bakery', name: 'Bakery', icon: '🍞' },
    { id: 'frozen', name: 'Frozen', icon: '🧊' },
    { id: 'canned', name: 'Canned', icon: '🥫' },
    { id: 'snacks', name: 'Snacks', icon: '🍿' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' },
    { id: 'household', name: 'Household', icon: '🧹' },
    { id: 'other', name: 'Other', icon: '📦' },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('grocery-list')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load grocery list')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('grocery-list', JSON.stringify(items))
  }, [items])

  const addItem = () => {
    if (!newItem.name) return
    setItems([
      ...items,
      {
        id: Date.now(),
        name: newItem.name,
        quantity: newItem.quantity || '1',
        category: newItem.category,
        checked: false,
      },
    ])
    setNewItem({ name: '', quantity: '1', category: newItem.category })
  }

  const toggleItem = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const clearChecked = () => {
    setItems(items.filter(item => !item.checked))
  }

  const clearAll = () => {
    setItems([])
  }

  const groupedItems = useMemo(() => {
    let filtered = items

    if (!showChecked) {
      filtered = filtered.filter(item => !item.checked)
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory)
    }

    const grouped: Record<string, GroceryItem[]> = {}
    categories.forEach(cat => {
      const catItems = filtered.filter(item => item.category === cat.id)
      if (catItems.length > 0) {
        grouped[cat.id] = catItems
      }
    })

    return grouped
  }, [items, filterCategory, showChecked])

  const stats = useMemo(() => {
    const total = items.length
    const checked = items.filter(i => i.checked).length
    return { total, checked, remaining: total - checked }
  }, [items])

  const getCategoryInfo = (catId: string) => {
    return categories.find(c => c.id === catId) || categories[categories.length - 1]
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 text-sm">
            <span className="text-slate-500">
              {t('tools.groceryList.total')}: <strong>{stats.total}</strong>
            </span>
            <span className="text-green-600">
              {t('tools.groceryList.done')}: <strong>{stats.checked}</strong>
            </span>
            <span className="text-blue-600">
              {t('tools.groceryList.remaining')}: <strong>{stats.remaining}</strong>
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder={t('tools.groceryList.itemName')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="text"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            placeholder="Qty"
            className="w-16 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            +
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
              filterCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.groceryList.all')}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                filterCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(groupedItems).length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          {t('tools.groceryList.empty')}
        </div>
      ) : (
        Object.entries(groupedItems).map(([catId, catItems]) => {
          const cat = getCategoryInfo(catId)
          return (
            <div key={catId} className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-slate-400">({catItems.length})</span>
              </h3>
              <div className="space-y-2">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-2 rounded ${
                      item.checked ? 'bg-green-50' : 'bg-slate-50'
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        item.checked
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {item.checked && '✓'}
                    </button>
                    <span className={`flex-1 ${item.checked ? 'line-through text-slate-400' : ''}`}>
                      {item.name}
                    </span>
                    <span className="text-sm text-slate-500">×{item.quantity}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}

      <div className="card p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowChecked(!showChecked)}
            className="flex-1 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
          >
            {showChecked ? t('tools.groceryList.hideChecked') : t('tools.groceryList.showChecked')}
          </button>
          <button
            onClick={clearChecked}
            className="flex-1 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
          >
            {t('tools.groceryList.clearChecked')}
          </button>
          <button
            onClick={clearAll}
            className="flex-1 py-2 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
          >
            {t('tools.groceryList.clearAll')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.groceryList.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.groceryList.tip1')}</li>
          <li>{t('tools.groceryList.tip2')}</li>
          <li>{t('tools.groceryList.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
