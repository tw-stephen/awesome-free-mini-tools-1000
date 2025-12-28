import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Category = 'home' | 'kitchen' | 'electronics' | 'experiences' | 'charity' | 'other'
type Priority = 'high' | 'medium' | 'low'

interface GiftItem {
  id: string
  name: string
  description: string
  price: number
  url: string
  category: Category
  priority: Priority
  quantity: number
  claimed: number
  claimedBy: string[]
}

interface Registry {
  id: string
  title: string
  occasion: string
  date: string
  message: string
  items: GiftItem[]
}

export default function GiftRegistryCreator() {
  const { t } = useTranslation()
  const [registry, setRegistry] = useState<Registry>({
    id: '',
    title: '',
    occasion: '',
    date: '',
    message: '',
    items: []
  })
  const [showItemForm, setShowItemForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GiftItem | null>(null)
  const [claimName, setClaimName] = useState('')
  const [claimingItemId, setClaimingItemId] = useState<string | null>(null)

  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    url: '',
    category: 'home' as Category,
    priority: 'medium' as Priority,
    quantity: 1
  })

  useEffect(() => {
    const saved = localStorage.getItem('gift-registry')
    if (saved) {
      setRegistry(JSON.parse(saved))
    } else {
      setRegistry(prev => ({ ...prev, id: Date.now().toString() }))
    }
  }, [])

  const saveRegistry = (updated: Registry) => {
    setRegistry(updated)
    localStorage.setItem('gift-registry', JSON.stringify(updated))
  }

  const addItem = () => {
    if (!itemForm.name) return
    const newItem: GiftItem = {
      id: Date.now().toString(),
      name: itemForm.name,
      description: itemForm.description,
      price: parseFloat(itemForm.price) || 0,
      url: itemForm.url,
      category: itemForm.category,
      priority: itemForm.priority,
      quantity: itemForm.quantity,
      claimed: 0,
      claimedBy: []
    }
    saveRegistry({ ...registry, items: [...registry.items, newItem] })
    setItemForm({ name: '', description: '', price: '', url: '', category: 'home', priority: 'medium', quantity: 1 })
    setShowItemForm(false)
  }

  const updateItem = () => {
    if (!editingItem || !itemForm.name) return
    const updatedItems = registry.items.map(item =>
      item.id === editingItem.id
        ? {
            ...item,
            name: itemForm.name,
            description: itemForm.description,
            price: parseFloat(itemForm.price) || 0,
            url: itemForm.url,
            category: itemForm.category,
            priority: itemForm.priority,
            quantity: itemForm.quantity
          }
        : item
    )
    saveRegistry({ ...registry, items: updatedItems })
    setItemForm({ name: '', description: '', price: '', url: '', category: 'home', priority: 'medium', quantity: 1 })
    setEditingItem(null)
  }

  const deleteItem = (id: string) => {
    saveRegistry({ ...registry, items: registry.items.filter(i => i.id !== id) })
  }

  const claimItem = (itemId: string) => {
    if (!claimName) return
    const updatedItems = registry.items.map(item =>
      item.id === itemId && item.claimed < item.quantity
        ? { ...item, claimed: item.claimed + 1, claimedBy: [...item.claimedBy, claimName] }
        : item
    )
    saveRegistry({ ...registry, items: updatedItems })
    setClaimName('')
    setClaimingItemId(null)
  }

  const startEdit = (item: GiftItem) => {
    setEditingItem(item)
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      url: item.url,
      category: item.category,
      priority: item.priority,
      quantity: item.quantity
    })
  }

  const categoryIcons: Record<Category, string> = {
    home: '🏠',
    kitchen: '🍳',
    electronics: '📱',
    experiences: '🎫',
    charity: '💝',
    other: '🎁'
  }

  const priorityColors: Record<Priority, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700'
  }

  const totalValue = registry.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const claimedValue = registry.items.reduce((sum, i) => sum + i.price * i.claimed, 0)

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">
          {t('tools.giftRegistryCreator.registryDetails')}
        </h3>
        <input
          type="text"
          value={registry.title}
          onChange={(e) => saveRegistry({ ...registry, title: e.target.value })}
          placeholder={t('tools.giftRegistryCreator.registryTitle')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={registry.occasion}
            onChange={(e) => saveRegistry({ ...registry, occasion: e.target.value })}
            placeholder={t('tools.giftRegistryCreator.occasion')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={registry.date}
            onChange={(e) => saveRegistry({ ...registry, date: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <textarea
          value={registry.message}
          onChange={(e) => saveRegistry({ ...registry, message: e.target.value })}
          placeholder={t('tools.giftRegistryCreator.message')}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="card p-4 text-center">
          <div className="text-xl font-bold text-blue-600">${totalValue.toFixed(2)}</div>
          <div className="text-xs text-slate-500">{t('tools.giftRegistryCreator.totalValue')}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-xl font-bold text-green-600">${claimedValue.toFixed(2)}</div>
          <div className="text-xs text-slate-500">{t('tools.giftRegistryCreator.claimed')}</div>
        </div>
      </div>

      <button
        onClick={() => { setShowItemForm(true); setEditingItem(null); setItemForm({ name: '', description: '', price: '', url: '', category: 'home', priority: 'medium', quantity: 1 }) }}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        + {t('tools.giftRegistryCreator.addItem')}
      </button>

      {(showItemForm || editingItem) && (
        <div className="card p-4 space-y-3">
          <h3 className="text-sm font-medium text-slate-700">
            {editingItem ? t('tools.giftRegistryCreator.editItem') : t('tools.giftRegistryCreator.newItem')}
          </h3>
          <input
            type="text"
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            placeholder={t('tools.giftRegistryCreator.itemName')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={itemForm.description}
            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
            placeholder={t('tools.giftRegistryCreator.itemDescription')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={itemForm.price}
              onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
              placeholder={t('tools.giftRegistryCreator.price')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="number"
              value={itemForm.quantity}
              onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) || 1 })}
              min={1}
              placeholder={t('tools.giftRegistryCreator.quantity')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <input
            type="text"
            value={itemForm.url}
            onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
            placeholder={t('tools.giftRegistryCreator.productUrl')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="flex flex-wrap gap-2">
            {(['home', 'kitchen', 'electronics', 'experiences', 'charity', 'other'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setItemForm({ ...itemForm, category: cat })}
                className={`px-2 py-1 rounded text-xs ${
                  itemForm.category === cat ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {categoryIcons[cat]} {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(['high', 'medium', 'low'] as const).map(p => (
              <button
                key={p}
                onClick={() => setItemForm({ ...itemForm, priority: p })}
                className={`flex-1 py-1.5 rounded text-sm capitalize ${
                  itemForm.priority === p ? priorityColors[p] : 'bg-slate-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowItemForm(false); setEditingItem(null) }}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('tools.giftRegistryCreator.cancel')}
            </button>
            <button
              onClick={editingItem ? updateItem : addItem}
              disabled={!itemForm.name}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingItem ? t('tools.giftRegistryCreator.update') : t('tools.giftRegistryCreator.add')}
            </button>
          </div>
        </div>
      )}

      {registry.items.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.giftRegistryCreator.items')} ({registry.items.length})
          </h3>
          <div className="space-y-2">
            {registry.items.map(item => (
              <div key={item.id} className="p-3 bg-slate-50 rounded">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{categoryIcons[item.category]}</span>
                      <span className="font-medium">{item.name}</span>
                      <span className={`text-xs px-1.5 rounded ${priorityColors[item.priority]}`}>
                        {item.priority}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="font-medium">${item.price}</span>
                      <span className="text-slate-500">
                        {item.claimed}/{item.quantity} {t('tools.giftRegistryCreator.claimedOf')}
                      </span>
                    </div>
                    {item.claimedBy.length > 0 && (
                      <div className="text-xs text-slate-400 mt-1">
                        {t('tools.giftRegistryCreator.claimedBy')}: {item.claimedBy.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-xs text-blue-500"
                    >
                      {t('tools.giftRegistryCreator.edit')}
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-xs text-red-500"
                    >
                      {t('tools.giftRegistryCreator.delete')}
                    </button>
                    {item.claimed < item.quantity && (
                      <button
                        onClick={() => setClaimingItemId(item.id)}
                        className="text-xs text-green-500"
                      >
                        {t('tools.giftRegistryCreator.claim')}
                      </button>
                    )}
                  </div>
                </div>
                {claimingItemId === item.id && (
                  <div className="mt-2 pt-2 border-t flex gap-2">
                    <input
                      type="text"
                      value={claimName}
                      onChange={(e) => setClaimName(e.target.value)}
                      placeholder={t('tools.giftRegistryCreator.yourName')}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                    <button
                      onClick={() => claimItem(item.id)}
                      disabled={!claimName}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm disabled:opacity-50"
                    >
                      {t('tools.giftRegistryCreator.confirm')}
                    </button>
                    <button
                      onClick={() => setClaimingItemId(null)}
                      className="px-3 py-1 bg-slate-100 rounded text-sm"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {registry.items.length > 0 && (
        <button
          onClick={() => saveRegistry({ ...registry, items: [] })}
          className="w-full py-2 bg-red-100 text-red-600 rounded"
        >
          {t('tools.giftRegistryCreator.clearAll')}
        </button>
      )}
    </div>
  )
}
