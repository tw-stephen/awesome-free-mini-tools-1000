import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface PackingItem {
  id: number
  name: string
  category: string
  packed: boolean
  quantity: number
}

interface PackingList {
  id: number
  name: string
  destination: string
  tripType: string
  items: PackingItem[]
  createdAt: string
}

export default function TravelPackingList() {
  const { t } = useTranslation()
  const [lists, setLists] = useState<PackingList[]>([])
  const [activeListId, setActiveListId] = useState<number | null>(null)
  const [showNewList, setShowNewList] = useState(false)
  const [newList, setNewList] = useState({ name: '', destination: '', tripType: 'vacation' })
  const [newItem, setNewItem] = useState({ name: '', category: 'Clothing', quantity: '1' })

  const tripTypes = ['vacation', 'business', 'camping', 'beach', 'ski', 'backpacking']
  const categories = ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Accessories', 'Health', 'Other']

  const essentialsByType: Record<string, string[]> = {
    vacation: ['Passport', 'Phone charger', 'Sunglasses', 'Camera', 'Comfortable shoes'],
    business: ['Laptop', 'Business cards', 'Formal wear', 'Notebook', 'Presentation materials'],
    camping: ['Tent', 'Sleeping bag', 'Flashlight', 'First aid kit', 'Water bottle'],
    beach: ['Swimsuit', 'Sunscreen', 'Beach towel', 'Flip flops', 'Hat'],
    ski: ['Ski jacket', 'Thermal underwear', 'Gloves', 'Goggles', 'Warm socks'],
    backpacking: ['Backpack', 'Quick-dry clothes', 'Travel towel', 'Power bank', 'Travel adapter'],
  }

  useEffect(() => {
    const saved = localStorage.getItem('travel-packing-list')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setLists(data)
        if (data.length > 0) setActiveListId(data[0].id)
      } catch (e) {
        console.error('Failed to load lists')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('travel-packing-list', JSON.stringify(lists))
  }, [lists])

  const activeList = useMemo(() => {
    return lists.find(l => l.id === activeListId)
  }, [lists, activeListId])

  const createList = () => {
    if (!newList.name) return
    const list: PackingList = {
      id: Date.now(),
      name: newList.name,
      destination: newList.destination,
      tripType: newList.tripType,
      items: [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    setLists([...lists, list])
    setActiveListId(list.id)
    setNewList({ name: '', destination: '', tripType: 'vacation' })
    setShowNewList(false)
  }

  const deleteList = (id: number) => {
    setLists(lists.filter(l => l.id !== id))
    if (activeListId === id) {
      setActiveListId(lists.length > 1 ? lists.find(l => l.id !== id)?.id || null : null)
    }
  }

  const addItem = () => {
    if (!activeListId || !newItem.name) return
    const item: PackingItem = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      packed: false,
      quantity: parseInt(newItem.quantity) || 1,
    }
    setLists(lists.map(list =>
      list.id === activeListId ? { ...list, items: [...list.items, item] } : list
    ))
    setNewItem({ name: '', category: 'Clothing', quantity: '1' })
  }

  const toggleItem = (itemId: number) => {
    if (!activeListId) return
    setLists(lists.map(list => {
      if (list.id !== activeListId) return list
      return {
        ...list,
        items: list.items.map(item =>
          item.id === itemId ? { ...item, packed: !item.packed } : item
        ),
      }
    }))
  }

  const deleteItem = (itemId: number) => {
    if (!activeListId) return
    setLists(lists.map(list => {
      if (list.id !== activeListId) return list
      return { ...list, items: list.items.filter(item => item.id !== itemId) }
    }))
  }

  const addEssentials = () => {
    if (!activeList) return
    const essentials = essentialsByType[activeList.tripType] || essentialsByType.vacation
    const newItems = essentials
      .filter(e => !activeList.items.some(i => i.name.toLowerCase() === e.toLowerCase()))
      .map((name, i) => ({
        id: Date.now() + i,
        name,
        category: 'Other',
        packed: false,
        quantity: 1,
      }))

    setLists(lists.map(list =>
      list.id === activeListId ? { ...list, items: [...list.items, ...newItems] } : list
    ))
  }

  const stats = useMemo(() => {
    if (!activeList) return { total: 0, packed: 0, progress: 0 }
    const total = activeList.items.length
    const packed = activeList.items.filter(i => i.packed).length
    return { total, packed, progress: total > 0 ? Math.round((packed / total) * 100) : 0 }
  }, [activeList])

  const groupedItems = useMemo(() => {
    if (!activeList) return {}
    const grouped: Record<string, PackingItem[]> = {}
    activeList.items.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = []
      grouped[item.category].push(item)
    })
    return grouped
  }, [activeList])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`px-4 py-2 rounded whitespace-nowrap ${
                activeListId === list.id ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {list.name}
            </button>
          ))}
          <button
            onClick={() => setShowNewList(true)}
            className="px-4 py-2 bg-green-100 text-green-700 rounded whitespace-nowrap hover:bg-green-200"
          >
            + {t('tools.packingList.newList')}
          </button>
        </div>
      </div>

      {showNewList && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.packingList.createList')}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newList.name}
              onChange={(e) => setNewList({ ...newList, name: e.target.value })}
              placeholder={t('tools.packingList.listName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="text"
              value={newList.destination}
              onChange={(e) => setNewList({ ...newList, destination: e.target.value })}
              placeholder={t('tools.packingList.destination')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <select
              value={newList.tripType}
              onChange={(e) => setNewList({ ...newList, tripType: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {tripTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={createList}
                className="flex-1 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
              >
                {t('tools.packingList.create')}
              </button>
              <button
                onClick={() => setShowNewList(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.packingList.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeList && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">{activeList.name}</h3>
                <p className="text-sm text-slate-500">
                  {activeList.destination && `${activeList.destination} • `}
                  {activeList.tripType}
                </p>
              </div>
              <button
                onClick={() => deleteList(activeList.id)}
                className="text-slate-400 hover:text-red-500"
              >
                ×
              </button>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{stats.packed} / {stats.total} {t('tools.packingList.itemsPacked')}</span>
                <span>{stats.progress}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>

            <button
              onClick={addEssentials}
              className="w-full py-2 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
            >
              + {t('tools.packingList.addEssentials')}
            </button>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.packingList.addItem')}
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                placeholder={t('tools.packingList.itemName')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                onClick={addItem}
                className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                +
              </button>
            </div>
          </div>

          {Object.keys(groupedItems).length > 0 && (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="card p-4">
                <h3 className="text-sm font-medium text-slate-700 mb-2">{category}</h3>
                <div className="space-y-1">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-2 rounded ${
                        item.packed ? 'bg-green-50' : 'bg-slate-50'
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          item.packed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'
                        }`}
                      >
                        {item.packed && '✓'}
                      </button>
                      <span className={`flex-1 ${item.packed ? 'line-through text-slate-400' : ''}`}>
                        {item.name}
                        {item.quantity > 1 && <span className="text-slate-500 ml-1">×{item.quantity}</span>}
                      </span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.packingList.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.packingList.tip1')}</li>
          <li>{t('tools.packingList.tip2')}</li>
          <li>{t('tools.packingList.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
