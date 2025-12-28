import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Warranty {
  id: string
  productName: string
  brand: string
  purchaseDate: string
  warrantyPeriod: number
  expirationDate: string
  receiptNumber: string
  serialNumber: string
  purchaseLocation: string
  price: number
  category: string
  notes: string
  status: 'active' | 'expired' | 'claimed'
}

export default function WarrantyTracker() {
  const { t } = useTranslation()
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'expiring'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState({
    productName: '',
    brand: '',
    purchaseDate: '',
    warrantyPeriod: 12,
    receiptNumber: '',
    serialNumber: '',
    purchaseLocation: '',
    price: 0,
    category: 'electronics',
    notes: ''
  })

  const categories = ['electronics', 'appliances', 'furniture', 'vehicles', 'tools', 'clothing', 'other']

  useEffect(() => {
    const saved = localStorage.getItem('warranty-tracker')
    if (saved) setWarranties(JSON.parse(saved))
  }, [])

  const saveWarranties = (updated: Warranty[]) => {
    setWarranties(updated)
    localStorage.setItem('warranty-tracker', JSON.stringify(updated))
  }

  const calculateExpiration = (purchaseDate: string, months: number): string => {
    const date = new Date(purchaseDate)
    date.setMonth(date.getMonth() + months)
    return date.toISOString().split('T')[0]
  }

  const getStatus = (expirationDate: string): 'active' | 'expired' => {
    return new Date(expirationDate) >= new Date() ? 'active' : 'expired'
  }

  const getDaysRemaining = (expirationDate: string): number => {
    const diff = new Date(expirationDate).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const addWarranty = () => {
    if (!form.productName || !form.purchaseDate) return

    const expirationDate = calculateExpiration(form.purchaseDate, form.warrantyPeriod)
    const warranty: Warranty = {
      id: editingId || Date.now().toString(),
      ...form,
      expirationDate,
      status: getStatus(expirationDate)
    }

    if (editingId) {
      saveWarranties(warranties.map(w => w.id === editingId ? warranty : w))
    } else {
      saveWarranties([warranty, ...warranties])
    }
    resetForm()
  }

  const resetForm = () => {
    setForm({
      productName: '',
      brand: '',
      purchaseDate: '',
      warrantyPeriod: 12,
      receiptNumber: '',
      serialNumber: '',
      purchaseLocation: '',
      price: 0,
      category: 'electronics',
      notes: ''
    })
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (warranty: Warranty) => {
    setForm({
      productName: warranty.productName,
      brand: warranty.brand,
      purchaseDate: warranty.purchaseDate,
      warrantyPeriod: warranty.warrantyPeriod,
      receiptNumber: warranty.receiptNumber,
      serialNumber: warranty.serialNumber,
      purchaseLocation: warranty.purchaseLocation,
      price: warranty.price,
      category: warranty.category,
      notes: warranty.notes
    })
    setEditingId(warranty.id)
    setShowForm(true)
  }

  const deleteWarranty = (id: string) => {
    saveWarranties(warranties.filter(w => w.id !== id))
  }

  const markAsClaimed = (id: string) => {
    saveWarranties(warranties.map(w => w.id === id ? { ...w, status: 'claimed' as const } : w))
  }

  const filteredWarranties = useMemo(() => {
    let filtered = warranties.map(w => ({
      ...w,
      status: (w.status === 'claimed' ? 'claimed' : getStatus(w.expirationDate)) as 'active' | 'expired' | 'claimed'
    }))

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(w =>
        w.productName.toLowerCase().includes(query) ||
        w.brand.toLowerCase().includes(query)
      )
    }

    if (filterStatus === 'active') {
      filtered = filtered.filter(w => w.status === 'active')
    } else if (filterStatus === 'expired') {
      filtered = filtered.filter(w => w.status === 'expired')
    } else if (filterStatus === 'expiring') {
      filtered = filtered.filter(w => {
        const days = getDaysRemaining(w.expirationDate)
        return days > 0 && days <= 30
      })
    }

    return filtered.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime())
  }, [warranties, filterStatus, searchQuery])

  const stats = useMemo(() => {
    const active = warranties.filter(w => getStatus(w.expirationDate) === 'active' && w.status !== 'claimed').length
    const expiring = warranties.filter(w => {
      const days = getDaysRemaining(w.expirationDate)
      return days > 0 && days <= 30 && w.status !== 'claimed'
    }).length
    const expired = warranties.filter(w => getStatus(w.expirationDate) === 'expired' || w.status === 'claimed').length
    return { active, expiring, expired }
  }, [warranties])

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    expired: 'bg-red-100 text-red-700',
    claimed: 'bg-blue-100 text-blue-700'
  }

  const exportData = () => {
    const headers = ['Product', 'Brand', 'Purchase Date', 'Expiration', 'Serial', 'Price', 'Status']
    const rows = warranties.map(w => [
      w.productName, w.brand, w.purchaseDate, w.expirationDate, w.serialNumber, w.price.toString(), w.status
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'warranties.csv'
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center bg-green-50">
          <div className="text-xl font-bold text-green-700">{stats.active}</div>
          <div className="text-xs text-green-600">{t('tools.warrantyTracker.active')}</div>
        </div>
        <div className="card p-3 text-center bg-yellow-50">
          <div className="text-xl font-bold text-yellow-700">{stats.expiring}</div>
          <div className="text-xs text-yellow-600">{t('tools.warrantyTracker.expiringSoon')}</div>
        </div>
        <div className="card p-3 text-center bg-red-50">
          <div className="text-xl font-bold text-red-700">{stats.expired}</div>
          <div className="text-xs text-red-600">{t('tools.warrantyTracker.expired')}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('tools.warrantyTracker.search')}
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
        {(['all', 'active', 'expiring', 'expired'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`flex-1 py-2 rounded text-sm ${
              filterStatus === status ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.warrantyTracker.${status}`)}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              placeholder={t('tools.warrantyTracker.productName')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder={t('tools.warrantyTracker.brand')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={form.warrantyPeriod}
                onChange={(e) => setForm({ ...form, warrantyPeriod: parseInt(e.target.value) || 12 })}
                min="1"
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <span className="text-xs text-slate-500">{t('tools.warrantyTracker.months')}</span>
            </div>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(c => (
                <option key={c} value={c}>{t(`tools.warrantyTracker.${c}`)}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={form.serialNumber}
              onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
              placeholder={t('tools.warrantyTracker.serialNumber')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={form.receiptNumber}
              onChange={(e) => setForm({ ...form, receiptNumber: e.target.value })}
              placeholder={t('tools.warrantyTracker.receiptNumber')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={form.purchaseLocation}
              onChange={(e) => setForm({ ...form, purchaseLocation: e.target.value })}
              placeholder={t('tools.warrantyTracker.purchaseLocation')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="number"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
              placeholder={t('tools.warrantyTracker.price')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('tools.warrantyTracker.notes')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={resetForm} className="py-2 bg-slate-100 rounded">
              {t('tools.warrantyTracker.cancel')}
            </button>
            <button
              onClick={addWarranty}
              disabled={!form.productName || !form.purchaseDate}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingId ? t('tools.warrantyTracker.update') : t('tools.warrantyTracker.add')}
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        {filteredWarranties.length === 0 ? (
          <p className="text-center text-slate-500 py-8">{t('tools.warrantyTracker.noWarranties')}</p>
        ) : (
          <div className="space-y-3">
            {filteredWarranties.map(warranty => {
              const daysRemaining = getDaysRemaining(warranty.expirationDate)
              return (
                <div key={warranty.id} className="p-3 bg-slate-50 rounded">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{warranty.productName}</div>
                      <div className="text-xs text-slate-500">{warranty.brand}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${statusColors[warranty.status]}`}>
                      {warranty.status === 'active' ? (
                        daysRemaining <= 30 ? `${daysRemaining}d left` : warranty.status
                      ) : warranty.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 mb-2">
                    <div>
                      <span className="text-slate-400">{t('tools.warrantyTracker.purchased')}:</span>{' '}
                      {warranty.purchaseDate}
                    </div>
                    <div>
                      <span className="text-slate-400">{t('tools.warrantyTracker.expires')}:</span>{' '}
                      {warranty.expirationDate}
                    </div>
                    {warranty.serialNumber && (
                      <div>
                        <span className="text-slate-400">S/N:</span> {warranty.serialNumber}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(warranty)} className="text-blue-500 text-xs">
                      {t('tools.warrantyTracker.edit')}
                    </button>
                    {warranty.status === 'active' && (
                      <button onClick={() => markAsClaimed(warranty.id)} className="text-purple-500 text-xs">
                        {t('tools.warrantyTracker.markClaimed')}
                      </button>
                    )}
                    <button onClick={() => deleteWarranty(warranty.id)} className="text-red-500 text-xs">
                      {t('tools.warrantyTracker.delete')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <button onClick={exportData} className="w-full py-2 bg-slate-100 rounded text-sm">
        {t('tools.warrantyTracker.export')}
      </button>
    </div>
  )
}
