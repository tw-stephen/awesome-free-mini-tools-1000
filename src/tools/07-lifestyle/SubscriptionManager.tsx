import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Subscription {
  id: number
  name: string
  amount: number
  billingCycle: 'monthly' | 'yearly' | 'weekly'
  nextBilling: string
  category: string
  icon: string
}

export default function SubscriptionManager() {
  const { t } = useTranslation()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newSub, setNewSub] = useState({
    name: '',
    amount: '',
    billingCycle: 'monthly' as const,
    nextBilling: new Date().toISOString().split('T')[0],
    category: 'Entertainment',
    icon: '📺',
  })

  const categories = ['Entertainment', 'Software', 'Fitness', 'News', 'Music', 'Shopping', 'Cloud', 'Other']
  const icons = ['📺', '🎵', '🎮', '📰', '💪', '🛒', '☁️', '📱', '💻', '🎬', '📚', '🔧']

  const commonSubs = [
    { name: 'Netflix', amount: 15.99, icon: '🎬', category: 'Entertainment' },
    { name: 'Spotify', amount: 9.99, icon: '🎵', category: 'Music' },
    { name: 'Amazon Prime', amount: 14.99, icon: '🛒', category: 'Shopping' },
    { name: 'YouTube Premium', amount: 11.99, icon: '📺', category: 'Entertainment' },
    { name: 'Apple Music', amount: 10.99, icon: '🎵', category: 'Music' },
    { name: 'Disney+', amount: 7.99, icon: '🎬', category: 'Entertainment' },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('subscription-manager')
    if (saved) {
      try {
        setSubscriptions(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load subscriptions')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('subscription-manager', JSON.stringify(subscriptions))
  }, [subscriptions])

  const addSubscription = () => {
    if (!newSub.name || !newSub.amount) return
    const sub: Subscription = {
      id: Date.now(),
      name: newSub.name,
      amount: parseFloat(newSub.amount),
      billingCycle: newSub.billingCycle,
      nextBilling: newSub.nextBilling,
      category: newSub.category,
      icon: newSub.icon,
    }
    setSubscriptions([...subscriptions, sub])
    setNewSub({
      name: '',
      amount: '',
      billingCycle: 'monthly',
      nextBilling: new Date().toISOString().split('T')[0],
      category: 'Entertainment',
      icon: '📺',
    })
    setShowAdd(false)
  }

  const deleteSub = (id: number) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id))
  }

  const quickAdd = (sub: typeof commonSubs[0]) => {
    setNewSub({
      name: sub.name,
      amount: sub.amount.toString(),
      billingCycle: 'monthly',
      nextBilling: new Date().toISOString().split('T')[0],
      category: sub.category,
      icon: sub.icon,
    })
    setShowAdd(true)
  }

  const getMonthlyAmount = (sub: Subscription) => {
    if (sub.billingCycle === 'monthly') return sub.amount
    if (sub.billingCycle === 'yearly') return sub.amount / 12
    if (sub.billingCycle === 'weekly') return sub.amount * 4.33
    return sub.amount
  }

  const stats = useMemo(() => {
    const monthly = subscriptions.reduce((sum, s) => sum + getMonthlyAmount(s), 0)
    const yearly = monthly * 12

    const byCategory: Record<string, number> = {}
    subscriptions.forEach(s => {
      byCategory[s.category] = (byCategory[s.category] || 0) + getMonthlyAmount(s)
    })

    const upcomingBills = subscriptions
      .filter(s => {
        const next = new Date(s.nextBilling)
        const today = new Date()
        const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return diff >= 0 && diff <= 7
      })
      .sort((a, b) => a.nextBilling.localeCompare(b.nextBilling))

    return { monthly, yearly, byCategory, upcomingBills }
  }, [subscriptions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getDaysUntil = (date: string) => {
    const target = new Date(date)
    const today = new Date()
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.monthly)}</div>
            <div className="text-xs text-slate-500">{t('tools.subscriptions.monthly')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.yearly)}</div>
            <div className="text-xs text-slate-500">{t('tools.subscriptions.yearly')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{subscriptions.length}</div>
            <div className="text-xs text-slate-500">{t('tools.subscriptions.active')}</div>
          </div>
        </div>
      </div>

      {stats.upcomingBills.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.subscriptions.upcoming')}
          </h3>
          <div className="space-y-2">
            {stats.upcomingBills.map(sub => {
              const days = getDaysUntil(sub.nextBilling)
              return (
                <div key={sub.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sub.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{sub.name}</div>
                      <div className="text-xs text-slate-500">
                        {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}
                      </div>
                    </div>
                  </div>
                  <span className="font-medium">{formatCurrency(sub.amount)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!showAdd ? (
        <div className="space-y-3">
          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
          >
            + {t('tools.subscriptions.addSubscription')}
          </button>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {commonSubs.map(sub => (
              <button
                key={sub.name}
                onClick={() => quickAdd(sub)}
                className="px-3 py-2 bg-slate-100 rounded whitespace-nowrap text-sm hover:bg-slate-200 flex items-center gap-1"
              >
                <span>{sub.icon}</span>
                <span>{sub.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.subscriptions.addSubscription')}
          </h3>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {icons.map(icon => (
                <button
                  key={icon}
                  onClick={() => setNewSub({ ...newSub, icon })}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    newSub.icon === icon ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-slate-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={newSub.name}
              onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
              placeholder={t('tools.subscriptions.name')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={newSub.amount}
                onChange={(e) => setNewSub({ ...newSub, amount: e.target.value })}
                placeholder={t('tools.subscriptions.amount')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={newSub.billingCycle}
                onChange={(e) => setNewSub({ ...newSub, billingCycle: e.target.value as any })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="weekly">{t('tools.subscriptions.weekly')}</option>
                <option value="monthly">{t('tools.subscriptions.monthlyBilling')}</option>
                <option value="yearly">{t('tools.subscriptions.yearlyBilling')}</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={newSub.nextBilling}
                onChange={(e) => setNewSub({ ...newSub, nextBilling: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={newSub.category}
                onChange={(e) => setNewSub({ ...newSub, category: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addSubscription}
                className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.subscriptions.add')}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.subscriptions.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {subscriptions.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.subscriptions.all')}
          </h3>
          <div className="space-y-2">
            {subscriptions.map(sub => (
              <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sub.icon}</span>
                  <div>
                    <div className="font-medium">{sub.name}</div>
                    <div className="text-sm text-slate-500">
                      {sub.category} • {sub.billingCycle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(sub.amount)}</div>
                    <div className="text-xs text-slate-500">
                      {formatCurrency(getMonthlyAmount(sub))}/mo
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSub(sub.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.subscriptions.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.subscriptions.tip1')}</li>
          <li>{t('tools.subscriptions.tip2')}</li>
          <li>{t('tools.subscriptions.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
