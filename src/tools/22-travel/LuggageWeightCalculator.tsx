import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LuggageItem {
  id: number
  name: string
  weight: number
  quantity: number
  category: string
}

const categories = [
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'toiletries', name: 'Toiletries', icon: '🧴' },
  { id: 'documents', name: 'Documents', icon: '📄' },
  { id: 'accessories', name: 'Accessories', icon: '👜' },
  { id: 'other', name: 'Other', icon: '📦' },
]

const commonItems = [
  { name: 'T-shirt', weight: 0.2, category: 'clothing' },
  { name: 'Jeans', weight: 0.5, category: 'clothing' },
  { name: 'Sweater', weight: 0.4, category: 'clothing' },
  { name: 'Jacket', weight: 0.8, category: 'clothing' },
  { name: 'Shoes (pair)', weight: 0.7, category: 'clothing' },
  { name: 'Underwear', weight: 0.05, category: 'clothing' },
  { name: 'Socks (pair)', weight: 0.05, category: 'clothing' },
  { name: 'Laptop', weight: 2.0, category: 'electronics' },
  { name: 'Phone charger', weight: 0.1, category: 'electronics' },
  { name: 'Camera', weight: 0.5, category: 'electronics' },
  { name: 'Tablet', weight: 0.5, category: 'electronics' },
  { name: 'Power bank', weight: 0.3, category: 'electronics' },
  { name: 'Toiletry bag (full)', weight: 0.5, category: 'toiletries' },
  { name: 'Shampoo (100ml)', weight: 0.12, category: 'toiletries' },
  { name: 'Passport', weight: 0.05, category: 'documents' },
  { name: 'Book', weight: 0.3, category: 'accessories' },
  { name: 'Umbrella', weight: 0.3, category: 'accessories' },
  { name: 'Sunglasses', weight: 0.05, category: 'accessories' },
]

const airlineLimits = [
  { name: 'Economy (Standard)', carryOn: 7, checked: 23 },
  { name: 'Premium Economy', carryOn: 10, checked: 23 },
  { name: 'Business Class', carryOn: 12, checked: 32 },
  { name: 'First Class', carryOn: 15, checked: 32 },
  { name: 'Budget Airlines', carryOn: 7, checked: 20 },
]

export default function LuggageWeightCalculator() {
  const { t } = useTranslation()
  const [items, setItems] = useState<LuggageItem[]>([])
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [weightLimit, setWeightLimit] = useState(23)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', weight: 0, quantity: 1, category: 'clothing' })
  const [bagWeight, setBagWeight] = useState(3) // Empty bag weight

  const addItem = () => {
    if (!newItem.name.trim() || newItem.weight <= 0) return
    setItems([...items, { ...newItem, id: Date.now() }])
    setNewItem({ name: '', weight: 0, quantity: 1, category: 'clothing' })
    setShowAddForm(false)
  }

  const addQuickItem = (item: typeof commonItems[0]) => {
    setItems([...items, { ...item, id: Date.now(), quantity: 1 }])
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      setItems(items.filter(i => i.id !== id))
    } else {
      setItems(items.map(i => i.id === id ? { ...i, quantity } : i))
    }
  }

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id))
  }

  const convertWeight = (kg: number) => {
    return unit === 'kg' ? kg : kg * 2.20462
  }

  const totalItemWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0)
  const totalWeight = totalItemWeight + bagWeight
  const limitInKg = unit === 'kg' ? weightLimit : weightLimit / 2.20462
  const remaining = limitInKg - totalWeight
  const progress = (totalWeight / limitInKg) * 100

  const getCategoryWeight = (categoryId: string) => {
    return items
      .filter(i => i.category === categoryId)
      .reduce((sum, item) => sum + (item.weight * item.quantity), 0)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.luggageWeightCalculator.settings')}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setUnit('kg')}
              className={`px-3 py-1 rounded ${unit === 'kg' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
            >
              kg
            </button>
            <button
              onClick={() => setUnit('lb')}
              className={`px-3 py-1 rounded ${unit === 'lb' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
            >
              lb
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500">{t('tools.luggageWeightCalculator.weightLimit')}</label>
            <input
              type="number"
              value={weightLimit}
              onChange={e => setWeightLimit(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">{t('tools.luggageWeightCalculator.bagWeight')}</label>
            <input
              type="number"
              value={bagWeight}
              onChange={e => setBagWeight(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.luggageWeightCalculator.presets')}</h3>
        <div className="flex flex-wrap gap-2">
          {airlineLimits.map(limit => (
            <button
              key={limit.name}
              onClick={() => setWeightLimit(unit === 'kg' ? limit.checked : limit.checked * 2.20462)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
            >
              {limit.name} ({limit.checked}kg)
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">{t('tools.luggageWeightCalculator.totalWeight')}</span>
          <span className="font-bold text-lg">
            {convertWeight(totalWeight).toFixed(1)} {unit}
          </span>
        </div>
        <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
            {remaining >= 0
              ? `${convertWeight(remaining).toFixed(1)} ${unit} ${t('tools.luggageWeightCalculator.remaining')}`
              : `${convertWeight(Math.abs(remaining)).toFixed(1)} ${unit} ${t('tools.luggageWeightCalculator.over')}`
            }
          </span>
          <span className="text-slate-500">
            {t('tools.luggageWeightCalculator.limit')}: {weightLimit} {unit}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {categories.map(cat => (
          <div key={cat.id} className="card p-2 text-center">
            <div className="text-xl">{cat.icon}</div>
            <div className="text-xs text-slate-500">{cat.name}</div>
            <div className="font-bold text-sm">{convertWeight(getCategoryWeight(cat.id)).toFixed(1)}</div>
          </div>
        ))}
      </div>

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + {t('tools.luggageWeightCalculator.addItem')}
        </button>
      )}

      {showAddForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.luggageWeightCalculator.addItem')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              placeholder={t('tools.luggageWeightCalculator.itemName')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={newItem.weight || ''}
                onChange={e => setNewItem({ ...newItem, weight: parseFloat(e.target.value) || 0 })}
                placeholder={`Weight (${unit})`}
                step={0.1}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="number"
                value={newItem.quantity}
                onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                min={1}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={newItem.category}
                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addItem}
                disabled={!newItem.name.trim() || newItem.weight <= 0}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.luggageWeightCalculator.quickAdd')}</h3>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {commonItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => addQuickItem(item)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm"
            >
              {item.name} ({item.weight}kg)
            </button>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.luggageWeightCalculator.items')}</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map(item => {
              const cat = categories.find(c => c.id === item.category)
              return (
                <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <span>{cat?.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-slate-200 rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-slate-200 rounded"
                    >
                      +
                    </button>
                    <span className="w-20 text-right text-sm text-slate-500">
                      {convertWeight(item.weight * item.quantity).toFixed(1)} {unit}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 ml-2"
                    >
                      x
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
