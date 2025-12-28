import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Subscription {
  id: string
  name: string
  category: string
  cost: number
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly'
  startDate: string
  nextBilling: string
  autoRenew: boolean
  reminder: boolean
  notes: string
  status: 'active' | 'cancelled' | 'paused'
}

export default function SubscriptionTracker() {
  const { t } = useTranslation()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [form, setForm] = useState<{
    name: string
    category: string
    cost: number
    billingCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly'
    startDate: string
    autoRenew: boolean
    reminder: boolean
    notes: string
  }>({
    name: '',
    category: 'entertainment',
    cost: 0,
    billingCycle: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    autoRenew: true,
    reminder: true,
    notes: ''
  })

  const categories = ['entertainment', 'productivity', 'utilities', 'health', 'education', 'shopping', 'other']

  useEffect(() => {
    const saved = localStorage.getItem('subscription-tracker')
    if (saved) setSubscriptions(JSON.parse(saved))
  }, [])

  const saveSubscriptions = (updated: Subscription[]) => {
    setSubscriptions(updated)
    localStorage.setItem('subscription-tracker', JSON.stringify(updated))
  }

  const calculateNextBilling = (startDate: string, cycle: string): string => {
    const start = new Date(startDate)
    const now = new Date()
    let next = new Date(start)

    while (next <= now) {
      switch (cycle) {
        case 'weekly':
          next.setDate(next.getDate() + 7)
          break
        case 'monthly':
          next.setMonth(next.getMonth() + 1)
          break
        case 'quarterly':
          next.setMonth(next.getMonth() + 3)
          break
        case 'yearly':
          next.setFullYear(next.getFullYear() + 1)
          break
      }
    }
    return next.toISOString().split('T')[0]
  }

  const getMonthlyEquivalent = (cost: number, cycle: string): number => {
    switch (cycle) {
      case 'weekly': return cost * 4.33
      case 'monthly': return cost
      case 'quarterly': return cost / 3
      case 'yearly': return cost / 12
      default: return cost
    }
  }

  const addSubscription = () => {
    if (!form.name) return
    const nextBilling = calculateNextBilling(form.startDate, form.billingCycle)
    const subscription: Subscription = {
      id: editingId || Date.now().toString(),
      ...form,
      nextBilling,
      status: 'active'
    }
    if (editingId) {
      saveSubscriptions(subscriptions.map(s => s.id === editingId ? subscription : s))
    } else {
      saveSubscriptions([...subscriptions, subscription])
    }
    resetForm()
  }

  const resetForm = () => {
    setForm({
      name: '',
      category: 'entertainment',
      cost: 0,
      billingCycle: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      autoRenew: true,
      reminder: true,
      notes: ''
    })
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (sub: Subscription) => {
    setForm({
      name: sub.name,
      category: sub.category,
      cost: sub.cost,
      billingCycle: sub.billingCycle,
      startDate: sub.startDate,
      autoRenew: sub.autoRenew,
      reminder: sub.reminder,
      notes: sub.notes
    })
    setEditingId(sub.id)
    setShowForm(true)
  }

  const updateStatus = (id: string, status: Subscription['status']) => {
    saveSubscriptions(subscriptions.map(s => s.id === id ? { ...s, status } : s))
  }

  const deleteSubscription = (id: string) => {
    saveSubscriptions(subscriptions.filter(s => s.id !== id))
  }

  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions
    if (filterCategory !== 'all') {
      filtered = filtered.filter(s => s.category === filterCategory)
    }
    return filtered.sort((a, b) => a.nextBilling.localeCompare(b.nextBilling))
  }, [subscriptions, filterCategory])

  const stats = useMemo(() => {
    const active = subscriptions.filter(s => s.status === 'active')
    const monthly = active.reduce((sum, s) => sum + getMonthlyEquivalent(s.cost, s.billingCycle), 0)
    const yearly = monthly * 12
    const upcoming = active.filter(s => {
      const days = Math.ceil((new Date(s.nextBilling).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return days <= 7 && days >= 0
    })
    return { count: active.length, monthly, yearly, upcoming: upcoming.length }
  }, [subscriptions])

  const getDaysUntilBilling = (date: string): number => {
    return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  const categoryColors: Record<string, string> = {
    entertainment: 'bg-purple-100 text-purple-700',
    productivity: 'bg-blue-100 text-blue-700',
    utilities: 'bg-yellow-100 text-yellow-700',
    health: 'bg-green-100 text-green-700',
    education: 'bg-indigo-100 text-indigo-700',
    shopping: 'bg-pink-100 text-pink-700',
    other: 'bg-slate-100 text-slate-700'
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    paused: 'bg-yellow-100 text-yellow-700'
  }

  const exportData = () => {
    const headers = ['Name', 'Category', 'Cost', 'Cycle', 'Next Billing', 'Status', 'Monthly Cost']
    const rows = subscriptions.map(s => [
      s.name, s.category, s.cost.toString(), s.billingCycle, s.nextBilling, s.status,
      getMonthlyEquivalent(s.cost, s.billingCycle).toFixed(2)
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subscriptions.csv'
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{stats.count}</div>
          <div className="text-xs text-slate-500">{t('tools.subscriptionTracker.active')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-green-600">${stats.monthly.toFixed(0)}</div>
          <div className="text-xs text-slate-500">{t('tools.subscriptionTracker.monthly')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-purple-600">${stats.yearly.toFixed(0)}</div>
          <div className="text-xs text-slate-500">{t('tools.subscriptionTracker.yearly')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-orange-600">{stats.upcoming}</div>
          <div className="text-xs text-slate-500">{t('tools.subscriptionTracker.dueSoon')}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-300 rounded"
        >
          <option value="all">{t('tools.subscriptionTracker.allCategories')}</option>
          {categories.map(c => (
            <option key={c} value={c}>{t(`tools.subscriptionTracker.${c}`)}</option>
          ))}
        </select>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          +
        </button>
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('tools.subscriptionTracker.serviceName')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(c => (
                <option key={c} value={c}>{t(`tools.subscriptionTracker.${c}`)}</option>
              ))}
            </select>
            <input
              type="number"
              value={form.cost || ''}
              onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
              placeholder={t('tools.subscriptionTracker.cost')}
              step="0.01"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <select
              value={form.billingCycle}
              onChange={(e) => setForm({ ...form, billingCycle: e.target.value as Subscription['billingCycle'] })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              <option value="weekly">{t('tools.subscriptionTracker.weekly')}</option>
              <option value="monthly">{t('tools.subscriptionTracker.monthlyOption')}</option>
              <option value="quarterly">{t('tools.subscriptionTracker.quarterly')}</option>
              <option value="yearly">{t('tools.subscriptionTracker.yearlyOption')}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.autoRenew}
                  onChange={(e) => setForm({ ...form, autoRenew: e.target.checked })}
                />
                {t('tools.subscriptionTracker.autoRenew')}
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.reminder}
                  onChange={(e) => setForm({ ...form, reminder: e.target.checked })}
                />
                {t('tools.subscriptionTracker.reminder')}
              </label>
            </div>
          </div>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('tools.subscriptionTracker.notes')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={resetForm} className="py-2 bg-slate-100 rounded">
              {t('tools.subscriptionTracker.cancel')}
            </button>
            <button
              onClick={addSubscription}
              disabled={!form.name}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingId ? t('tools.subscriptionTracker.update') : t('tools.subscriptionTracker.add')}
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        {filteredSubscriptions.length === 0 ? (
          <p className="text-center text-slate-500 py-8">{t('tools.subscriptionTracker.noSubscriptions')}</p>
        ) : (
          <div className="space-y-2">
            {filteredSubscriptions.map(sub => {
              const daysUntil = getDaysUntilBilling(sub.nextBilling)
              const monthlyEquiv = getMonthlyEquivalent(sub.cost, sub.billingCycle)
              return (
                <div key={sub.id} className={`p-3 rounded ${sub.status !== 'active' ? 'opacity-60' : 'bg-slate-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{sub.name}</div>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[sub.category]}`}>
                          {sub.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${statusColors[sub.status]}`}>
                          {sub.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${sub.cost.toFixed(2)}/{sub.billingCycle.slice(0, 2)}</div>
                      <div className="text-xs text-slate-500">${monthlyEquiv.toFixed(2)}/mo</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                    <span>
                      {t('tools.subscriptionTracker.nextBilling')}: {sub.nextBilling}
                      {daysUntil <= 7 && daysUntil >= 0 && (
                        <span className="ml-1 text-orange-600">({daysUntil}d)</span>
                      )}
                    </span>
                    <div className="flex gap-2">
                      {sub.autoRenew && <span className="text-green-600">Auto</span>}
                      {sub.reminder && <span className="text-blue-600">Remind</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(sub)} className="text-blue-500 text-xs">
                      {t('tools.subscriptionTracker.edit')}
                    </button>
                    {sub.status === 'active' && (
                      <>
                        <button onClick={() => updateStatus(sub.id, 'paused')} className="text-yellow-500 text-xs">
                          {t('tools.subscriptionTracker.pause')}
                        </button>
                        <button onClick={() => updateStatus(sub.id, 'cancelled')} className="text-red-500 text-xs">
                          {t('tools.subscriptionTracker.cancelSub')}
                        </button>
                      </>
                    )}
                    {sub.status !== 'active' && (
                      <button onClick={() => updateStatus(sub.id, 'active')} className="text-green-500 text-xs">
                        {t('tools.subscriptionTracker.reactivate')}
                      </button>
                    )}
                    <button onClick={() => deleteSubscription(sub.id)} className="text-red-500 text-xs">
                      {t('tools.subscriptionTracker.delete')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <button onClick={exportData} className="w-full py-2 bg-slate-100 rounded text-sm">
        {t('tools.subscriptionTracker.export')}
      </button>
    </div>
  )
}
