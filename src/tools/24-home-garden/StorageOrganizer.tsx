import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface StorageItem {
  id: number
  name: string
  location: string
  container: string
  category: string
  quantity: number
  notes?: string
}

export default function StorageOrganizer() {
  const { t } = useTranslation()
  const [items, setItems] = useState<StorageItem[]>([])
  const [showAddItem, setShowAddItem] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [newItem, setNewItem] = useState({
    name: '',
    location: 'Closet',
    container: '',
    category: 'Seasonal',
    quantity: '1',
    notes: '',
  })

  const locations = ['Closet', 'Garage', 'Attic', 'Basement', 'Shed', 'Storage Room', 'Under Bed', 'Cabinet']
  const categories = ['Seasonal', 'Holiday', 'Sports', 'Tools', 'Electronics', 'Clothing', 'Documents', 'Kitchen', 'Other']

  useEffect(() => {
    const saved = localStorage.getItem('storage-organizer')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load items')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('storage-organizer', JSON.stringify(items))
  }, [items])

  const addItem = () => {
    if (!newItem.name) return
    const item: StorageItem = {
      id: Date.now(),
      name: newItem.name,
      location: newItem.location,
      container: newItem.container,
      category: newItem.category,
      quantity: parseInt(newItem.quantity) || 1,
      notes: newItem.notes || undefined,
    }
    setItems([...items, item])
    setNewItem({ name: '', location: 'Closet', container: '', category: 'Seasonal', quantity: '1', notes: '' })
    setShowAddItem(false)
  }

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.container.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    const matchesLocation = filterLocation === 'all' || item.location === filterLocation
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesLocation && matchesCategory
  })

  const groupedByLocation = filteredItems.reduce((acc, item) => {
    if (!acc[item.location]) acc[item.location] = []
    acc[item.location].push(item)
    return acc
  }, {} as Record<string, StorageItem[]>)

  const stats = {
    total: items.length,
    locations: new Set(items.map(i => i.location)).size,
    categories: new Set(items.map(i => i.category)).size,
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-slate-500">{t('tools.storageOrganizer.totalItems')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.locations}</div>
            <div className="text-xs text-slate-500">{t('tools.storageOrganizer.locations')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{stats.categories}</div>
            <div className="text-xs text-slate-500">{t('tools.storageOrganizer.categories')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
          placeholder={t('tools.storageOrganizer.searchPlaceholder')}
        />
        <div className="grid grid-cols-2 gap-2 mt-3">
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="all">{t('tools.storageOrganizer.allLocations')}</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="all">{t('tools.storageOrganizer.allCategories')}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {!showAddItem ? (
        <button
          onClick={() => setShowAddItem(true)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          + {t('tools.storageOrganizer.addItem')}
        </button>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.storageOrganizer.addItem')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder={t('tools.storageOrganizer.itemName')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newItem.container}
                onChange={(e) => setNewItem({ ...newItem, container: e.target.value })}
                placeholder={t('tools.storageOrganizer.container')}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder={t('tools.storageOrganizer.quantity')}
                className="px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <input
              type="text"
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              placeholder={t('tools.storageOrganizer.notes')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={addItem}
                className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.storageOrganizer.add')}
              </button>
              <button
                onClick={() => setShowAddItem(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.storageOrganizer.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {Object.keys(groupedByLocation).length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          {t('tools.storageOrganizer.noItems')}
        </div>
      ) : (
        Object.entries(groupedByLocation).map(([location, locationItems]) => (
          <div key={location} className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{location}</h3>
            <div className="space-y-2">
              {locationItems.map(item => (
                <div key={item.id} className="flex justify-between items-start p-3 bg-slate-50 rounded">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-slate-500">
                      {item.container && `${item.container} - `}
                      {item.category}
                      {item.quantity > 1 && ` (x${item.quantity})`}
                    </div>
                    {item.notes && (
                      <div className="text-xs text-slate-400 mt-1">{item.notes}</div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.storageOrganizer.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.storageOrganizer.tip1')}</li>
          <li>{t('tools.storageOrganizer.tip2')}</li>
          <li>{t('tools.storageOrganizer.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
