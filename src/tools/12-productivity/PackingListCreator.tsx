import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface PackingItem {
  id: string
  name: string
  quantity: number
  packed: boolean
  category: string
}

interface PackingList {
  id: string
  name: string
  tripType: string
  items: PackingItem[]
  createdAt: string
}

export default function PackingListCreator() {
  const { t } = useTranslation()
  const [lists, setLists] = useState<PackingList[]>([])
  const [currentList, setCurrentList] = useState<PackingList | null>(null)
  const [newItem, setNewItem] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('essentials')
  const [copied, setCopied] = useState(false)

  const tripTypes = ['business', 'vacation', 'weekend', 'camping', 'beach', 'winter']
  const categories = ['essentials', 'clothing', 'toiletries', 'electronics', 'documents', 'misc']

  const templates: Record<string, { category: string; items: string[] }[]> = {
    business: [
      { category: 'essentials', items: ['Wallet', 'Phone', 'Charger', 'Keys'] },
      { category: 'clothing', items: ['Suits', 'Dress shirts', 'Ties', 'Dress shoes'] },
      { category: 'electronics', items: ['Laptop', 'Laptop charger', 'Headphones'] },
      { category: 'documents', items: ['Business cards', 'ID', 'Passport'] }
    ],
    vacation: [
      { category: 'essentials', items: ['Wallet', 'Phone', 'Charger', 'Keys'] },
      { category: 'clothing', items: ['T-shirts', 'Shorts', 'Casual shoes', 'Hat'] },
      { category: 'toiletries', items: ['Sunscreen', 'Toothbrush', 'Shampoo'] },
      { category: 'electronics', items: ['Camera', 'Power bank'] }
    ],
    camping: [
      { category: 'essentials', items: ['Tent', 'Sleeping bag', 'Flashlight', 'First aid kit'] },
      { category: 'clothing', items: ['Hiking boots', 'Rain jacket', 'Warm layers'] },
      { category: 'misc', items: ['Matches', 'Water bottle', 'Camp stove', 'Cooler'] }
    ]
  }

  useEffect(() => {
    const saved = localStorage.getItem('packing-lists')
    if (saved) setLists(JSON.parse(saved))
  }, [])

  const saveLists = (updated: PackingList[]) => {
    setLists(updated)
    localStorage.setItem('packing-lists', JSON.stringify(updated))
  }

  const createList = (tripType: string) => {
    const template = templates[tripType] || []
    const items: PackingItem[] = []
    template.forEach(cat => {
      cat.items.forEach(item => {
        items.push({
          id: Date.now().toString() + Math.random(),
          name: item,
          quantity: 1,
          packed: false,
          category: cat.category
        })
      })
    })

    const list: PackingList = {
      id: Date.now().toString(),
      name: t(`tools.packingListCreator.${tripType}Trip`),
      tripType,
      items,
      createdAt: new Date().toISOString()
    }
    setCurrentList(list)
  }

  const saveList = () => {
    if (!currentList) return
    const exists = lists.find(l => l.id === currentList.id)
    if (exists) {
      saveLists(lists.map(l => l.id === currentList.id ? currentList : l))
    } else {
      saveLists([currentList, ...lists])
    }
  }

  const deleteList = (id: string) => {
    saveLists(lists.filter(l => l.id !== id))
    if (currentList?.id === id) setCurrentList(null)
  }

  const addItem = () => {
    if (!currentList || !newItem.trim()) return
    const item: PackingItem = {
      id: Date.now().toString(),
      name: newItem.trim(),
      quantity: 1,
      packed: false,
      category: selectedCategory
    }
    setCurrentList({ ...currentList, items: [...currentList.items, item] })
    setNewItem('')
  }

  const updateItem = (itemId: string, updates: Partial<PackingItem>) => {
    if (!currentList) return
    setCurrentList({
      ...currentList,
      items: currentList.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
    })
  }

  const deleteItem = (itemId: string) => {
    if (!currentList) return
    setCurrentList({
      ...currentList,
      items: currentList.items.filter(i => i.id !== itemId)
    })
  }

  const toggleAll = (packed: boolean) => {
    if (!currentList) return
    setCurrentList({
      ...currentList,
      items: currentList.items.map(i => ({ ...i, packed }))
    })
  }

  const getItemsByCategory = (category: string) => {
    return currentList?.items.filter(i => i.category === category) || []
  }

  const packedCount = currentList?.items.filter(i => i.packed).length || 0
  const totalCount = currentList?.items.length || 0
  const progress = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0

  const copyList = () => {
    if (!currentList) return
    let text = `${currentList.name}\n${'='.repeat(40)}\n\n`
    categories.forEach(cat => {
      const items = getItemsByCategory(cat)
      if (items.length > 0) {
        text += `${cat.toUpperCase()}\n`
        items.forEach(item => {
          text += `${item.packed ? '☑' : '☐'} ${item.name} (x${item.quantity})\n`
        })
        text += '\n'
      }
    })
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {!currentList ? (
        <>
          <div className="card p-4">
            <h3 className="font-medium text-slate-700 mb-3">{t('tools.packingListCreator.createNew')}</h3>
            <div className="grid grid-cols-3 gap-2">
              {tripTypes.map(type => (
                <button
                  key={type}
                  onClick={() => createList(type)}
                  className="p-3 bg-slate-50 rounded hover:bg-slate-100"
                >
                  <div className="text-2xl mb-1">
                    {type === 'business' && '💼'}
                    {type === 'vacation' && '🏖️'}
                    {type === 'weekend' && '🎒'}
                    {type === 'camping' && '⛺'}
                    {type === 'beach' && '🏄'}
                    {type === 'winter' && '⛷️'}
                  </div>
                  <div className="text-sm capitalize">{t(`tools.packingListCreator.${type}`)}</div>
                </button>
              ))}
            </div>
          </div>

          {lists.length > 0 && (
            <div className="card p-4">
              <h3 className="font-medium text-slate-700 mb-3">{t('tools.packingListCreator.savedLists')}</h3>
              <div className="space-y-2">
                {lists.map(list => {
                  const packed = list.items.filter(i => i.packed).length
                  return (
                    <div key={list.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <div onClick={() => setCurrentList(list)} className="flex-1 cursor-pointer">
                        <div className="font-medium">{list.name}</div>
                        <div className="text-xs text-slate-500">
                          {packed}/{list.items.length} packed
                        </div>
                      </div>
                      <button onClick={() => deleteList(list.id)} className="text-red-500">×</button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentList(null)} className="px-3 py-2 bg-slate-100 rounded">←</button>
            <input
              type="text"
              value={currentList.name}
              onChange={(e) => setCurrentList({ ...currentList, name: e.target.value })}
              className="flex-1 px-3 py-2 border border-slate-300 rounded font-medium"
            />
          </div>

          <div className="card p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{t('tools.packingListCreator.progress')}</span>
              <span>{packedCount}/{totalCount} ({progress}%)</span>
            </div>
            <div className="h-3 bg-slate-100 rounded overflow-hidden">
              <div
                className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={t('tools.packingListCreator.addItem')}
              className="flex-1 px-3 py-2 border border-slate-300 rounded"
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(c => (
                <option key={c} value={c}>{t(`tools.packingListCreator.${c}`)}</option>
              ))}
            </select>
            <button onClick={addItem} disabled={!newItem.trim()} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
              +
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={() => toggleAll(true)} className="flex-1 py-2 bg-green-100 text-green-700 rounded text-sm">
              {t('tools.packingListCreator.packAll')}
            </button>
            <button onClick={() => toggleAll(false)} className="flex-1 py-2 bg-slate-100 rounded text-sm">
              {t('tools.packingListCreator.unpackAll')}
            </button>
          </div>

          <div className="space-y-4">
            {categories.map(category => {
              const items = getItemsByCategory(category)
              if (items.length === 0) return null
              return (
                <div key={category} className="card p-4">
                  <h4 className="font-medium text-slate-700 mb-2 capitalize">
                    {t(`tools.packingListCreator.${category}`)} ({items.filter(i => i.packed).length}/{items.length})
                  </h4>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-2 p-2 rounded ${item.packed ? 'bg-green-50' : 'bg-slate-50'}`}
                      >
                        <input
                          type="checkbox"
                          checked={item.packed}
                          onChange={() => updateItem(item.id, { packed: !item.packed })}
                        />
                        <span className={`flex-1 ${item.packed ? 'line-through text-slate-400' : ''}`}>
                          {item.name}
                        </span>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                          min="1"
                          className="w-12 px-2 py-1 border border-slate-300 rounded text-center text-sm"
                        />
                        <button onClick={() => deleteItem(item.id)} className="text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyList}
              className={`py-2 rounded ${copied ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
            >
              {copied ? '✓' : t('tools.packingListCreator.copy')}
            </button>
            <button
              onClick={saveList}
              className="py-2 bg-blue-500 text-white rounded"
            >
              {t('tools.packingListCreator.save')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
