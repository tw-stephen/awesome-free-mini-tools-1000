import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ChecklistItem {
  id: number
  name: string
  category: string
  packed: boolean
}

const defaultCategories = [
  { id: 'essentials', items: ['Passport', 'ID Card', 'Wallet', 'Phone', 'Charger', 'Keys'] },
  { id: 'clothing', items: ['Shirts', 'Pants', 'Underwear', 'Socks', 'Jacket', 'Shoes'] },
  { id: 'toiletries', items: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Deodorant', 'Sunscreen'] },
  { id: 'electronics', items: ['Laptop', 'Camera', 'Headphones', 'Power Bank', 'Adapters'] },
  { id: 'health', items: ['Medications', 'First Aid Kit', 'Hand Sanitizer', 'Vitamins'] },
]

export default function TravelChecklist() {
  const { t } = useTranslation()
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [newItem, setNewItem] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('essentials')
  const [tripName, setTripName] = useState('')
  const [tripDates, setTripDates] = useState({ start: '', end: '' })

  const addItem = () => {
    if (!newItem.trim()) return
    setItems([...items, { id: Date.now(), name: newItem.trim(), category: selectedCategory, packed: false }])
    setNewItem('')
  }

  const togglePacked = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item))
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const addDefaultItems = (categoryId: string) => {
    const category = defaultCategories.find(c => c.id === categoryId)
    if (!category) return
    const newItems = category.items.map((name, idx) => ({
      id: Date.now() + idx,
      name,
      category: categoryId,
      packed: false,
    }))
    setItems([...items, ...newItems])
  }

  const packedCount = items.filter(i => i.packed).length
  const totalCount = items.length
  const progress = totalCount > 0 ? (packedCount / totalCount) * 100 : 0

  const itemsByCategory = defaultCategories.map(cat => ({
    ...cat,
    items: items.filter(i => i.category === cat.id),
  }))

  const exportChecklist = () => {
    let text = `${tripName || 'Travel'} Packing List\n`
    if (tripDates.start) text += `Dates: ${tripDates.start} - ${tripDates.end}\n`
    text += `\nProgress: ${packedCount}/${totalCount} items packed\n\n`

    itemsByCategory.forEach(cat => {
      if (cat.items.length > 0) {
        text += `${cat.id.toUpperCase()}\n`
        cat.items.forEach(item => {
          text += `[${item.packed ? 'x' : ' '}] ${item.name}\n`
        })
        text += '\n'
      }
    })

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `packing-list-${tripName || 'trip'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.travelChecklist.tripDetails')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={tripName}
            onChange={e => setTripName(e.target.value)}
            placeholder={t('tools.travelChecklist.tripName')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={tripDates.start}
            onChange={e => setTripDates({ ...tripDates, start: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={tripDates.end}
            onChange={e => setTripDates({ ...tripDates, end: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">{t('tools.travelChecklist.progress')}</span>
          <span className="font-bold">{packedCount}/{totalCount}</span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.travelChecklist.addItem')}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder={t('tools.travelChecklist.itemName')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {defaultCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.id}</option>
            ))}
          </select>
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.travelChecklist.add')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.travelChecklist.quickAdd')}</h3>
        <div className="flex flex-wrap gap-2">
          {defaultCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => addDefaultItems(cat.id)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm"
            >
              + {cat.id}
            </button>
          ))}
        </div>
      </div>

      {itemsByCategory.map(cat => (
        cat.items.length > 0 && (
          <div key={cat.id} className="card p-4">
            <h3 className="font-medium mb-3 capitalize">{cat.id}</h3>
            <div className="space-y-2">
              {cat.items.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    item.packed ? 'bg-green-50' : 'bg-slate-50'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={item.packed}
                      onChange={() => togglePacked(item.id)}
                      className="w-5 h-5"
                    />
                    <span className={item.packed ? 'line-through text-slate-400' : ''}>
                      {item.name}
                    </span>
                  </label>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 px-2"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      {items.length > 0 && (
        <button
          onClick={exportChecklist}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t('tools.travelChecklist.export')}
        </button>
      )}
    </div>
  )
}
