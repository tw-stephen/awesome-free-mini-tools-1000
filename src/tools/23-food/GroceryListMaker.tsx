import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface GroceryItem {
  id: number
  name: string
  quantity: string
  category: string
  checked: boolean
}

const categories = [
  { id: 'produce', name: 'Produce', icon: '🥬' },
  { id: 'dairy', name: 'Dairy', icon: '🥛' },
  { id: 'meat', name: 'Meat & Seafood', icon: '🥩' },
  { id: 'bakery', name: 'Bakery', icon: '🍞' },
  { id: 'frozen', name: 'Frozen', icon: '🧊' },
  { id: 'pantry', name: 'Pantry', icon: '🥫' },
  { id: 'snacks', name: 'Snacks', icon: '🍿' },
  { id: 'beverages', name: 'Beverages', icon: '🧃' },
  { id: 'household', name: 'Household', icon: '🧹' },
  { id: 'other', name: 'Other', icon: '📦' },
]

const quickAddItems = {
  produce: ['Apples', 'Bananas', 'Lettuce', 'Tomatoes', 'Onions', 'Carrots', 'Potatoes'],
  dairy: ['Milk', 'Eggs', 'Cheese', 'Butter', 'Yogurt', 'Cream'],
  meat: ['Chicken', 'Beef', 'Pork', 'Fish', 'Shrimp'],
  bakery: ['Bread', 'Bagels', 'Tortillas', 'Croissants'],
  pantry: ['Rice', 'Pasta', 'Olive Oil', 'Salt', 'Pepper', 'Sugar', 'Flour'],
  beverages: ['Water', 'Juice', 'Coffee', 'Tea', 'Soda'],
}

export default function GroceryListMaker() {
  const { t } = useTranslation()
  const [items, setItems] = useState<GroceryItem[]>([])
  const [newItem, setNewItem] = useState({ name: '', quantity: '', category: 'produce' })
  const [sortByCategory, setSortByCategory] = useState(true)
  const [showChecked, setShowChecked] = useState(true)

  const addItem = () => {
    if (!newItem.name.trim()) return
    const item: GroceryItem = {
      id: Date.now(),
      name: newItem.name.trim(),
      quantity: newItem.quantity,
      category: newItem.category,
      checked: false,
    }
    setItems([...items, item])
    setNewItem({ ...newItem, name: '', quantity: '' })
  }

  const quickAdd = (name: string, category: string) => {
    const item: GroceryItem = {
      id: Date.now(),
      name,
      quantity: '',
      category,
      checked: false,
    }
    setItems([...items, item])
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

  const getItemsByCategory = () => {
    const grouped: Record<string, GroceryItem[]> = {}
    categories.forEach(cat => {
      const catItems = items.filter(i => i.category === cat.id)
      if (catItems.length > 0) {
        grouped[cat.id] = catItems
      }
    })
    return grouped
  }

  const displayItems = showChecked ? items : items.filter(i => !i.checked)
  const checkedCount = items.filter(i => i.checked).length
  const totalCount = items.length

  const exportList = () => {
    let text = `Grocery List\n${'='.repeat(30)}\n\n`

    if (sortByCategory) {
      const grouped = getItemsByCategory()
      Object.entries(grouped).forEach(([catId, catItems]) => {
        const cat = categories.find(c => c.id === catId)
        text += `${cat?.icon} ${cat?.name}\n`
        catItems.forEach(item => {
          text += `[${item.checked ? 'x' : ' '}] ${item.name}${item.quantity ? ` (${item.quantity})` : ''}\n`
        })
        text += '\n'
      })
    } else {
      items.forEach(item => {
        text += `[${item.checked ? 'x' : ' '}] ${item.name}${item.quantity ? ` (${item.quantity})` : ''}\n`
      })
    }

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'grocery-list.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.groceryListMaker.addItem')}</h3>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={newItem.name}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder={t('tools.groceryListMaker.itemName')}
            className="flex-1 min-w-32 px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={newItem.quantity}
            onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
            placeholder={t('tools.groceryListMaker.quantity')}
            className="w-24 px-3 py-2 border border-slate-300 rounded"
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
          <button
            onClick={addItem}
            disabled={!newItem.name.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            Add
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.groceryListMaker.quickAdd')}</h3>
        <div className="space-y-2">
          {Object.entries(quickAddItems).slice(0, 3).map(([catId, catItems]) => {
            const cat = categories.find(c => c.id === catId)
            return (
              <div key={catId}>
                <div className="text-xs text-slate-500 mb-1">{cat?.icon} {cat?.name}</div>
                <div className="flex flex-wrap gap-1">
                  {catItems.map(item => (
                    <button
                      key={item}
                      onClick={() => quickAdd(item, catId)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {items.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-slate-500">
              {checkedCount}/{totalCount} {t('tools.groceryListMaker.completed')}
            </div>
            <div className="flex gap-2">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={sortByCategory}
                  onChange={e => setSortByCategory(e.target.checked)}
                />
                {t('tools.groceryListMaker.groupByCategory')}
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={showChecked}
                  onChange={e => setShowChecked(e.target.checked)}
                />
                {t('tools.groceryListMaker.showChecked')}
              </label>
            </div>
          </div>

          <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${(checkedCount / totalCount) * 100}%` }}
            />
          </div>

          {sortByCategory ? (
            Object.entries(getItemsByCategory()).map(([catId, catItems]) => {
              const cat = categories.find(c => c.id === catId)
              const visibleItems = showChecked ? catItems : catItems.filter(i => !i.checked)
              if (visibleItems.length === 0) return null

              return (
                <div key={catId} className="mb-4">
                  <div className="text-sm font-medium text-slate-600 mb-2">
                    {cat?.icon} {cat?.name}
                  </div>
                  <div className="space-y-1">
                    {visibleItems.map(item => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-2 rounded ${
                          item.checked ? 'bg-green-50' : 'bg-slate-50'
                        }`}
                      >
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(item.id)}
                            className="w-5 h-5"
                          />
                          <span className={item.checked ? 'line-through text-slate-400' : ''}>
                            {item.name}
                          </span>
                          {item.quantity && (
                            <span className="text-sm text-slate-400">({item.quantity})</span>
                          )}
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
            })
          ) : (
            <div className="space-y-1">
              {displayItems.map(item => {
                const cat = categories.find(c => c.id === item.category)
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded ${
                      item.checked ? 'bg-green-50' : 'bg-slate-50'
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id)}
                        className="w-5 h-5"
                      />
                      <span>{cat?.icon}</span>
                      <span className={item.checked ? 'line-through text-slate-400' : ''}>
                        {item.name}
                      </span>
                      {item.quantity && (
                        <span className="text-sm text-slate-400">({item.quantity})</span>
                      )}
                    </label>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 px-2"
                    >
                      x
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={clearChecked}
              disabled={checkedCount === 0}
              className="flex-1 py-2 bg-slate-200 rounded hover:bg-slate-300 disabled:opacity-50"
            >
              {t('tools.groceryListMaker.clearChecked')}
            </button>
            <button
              onClick={clearAll}
              className="flex-1 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              {t('tools.groceryListMaker.clearAll')}
            </button>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <button
          onClick={exportList}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t('tools.groceryListMaker.export')}
        </button>
      )}
    </div>
  )
}
