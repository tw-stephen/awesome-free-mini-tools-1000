import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Subscription {
  id: number
  name: string
  cost: number
  frequency: 'weekly' | 'monthly' | 'yearly'
}

export default function SubscriptionCostCalculator() {
  const { t } = useTranslation()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [newSub, setNewSub] = useState<{ name: string; cost: string; frequency: Subscription['frequency'] }>({ name: '', cost: '', frequency: 'monthly' })

  useEffect(() => {
    const saved = localStorage.getItem('subscription-tracker')
    if (saved) {
      try {
        setSubscriptions(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load subscriptions')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('subscription-tracker', JSON.stringify(subscriptions))
  }, [subscriptions])

  const addSubscription = () => {
    const cost = parseFloat(newSub.cost)
    if (!newSub.name || isNaN(cost) || cost <= 0) return

    setSubscriptions([...subscriptions, {
      id: Date.now(),
      name: newSub.name,
      cost,
      frequency: newSub.frequency,
    }])
    setNewSub({ name: '', cost: '', frequency: 'monthly' })
  }

  const deleteSubscription = (id: number) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id))
  }

  const getMonthlyEquivalent = (sub: Subscription) => {
    switch (sub.frequency) {
      case 'weekly': return sub.cost * 4.33
      case 'monthly': return sub.cost
      case 'yearly': return sub.cost / 12
    }
  }

  const totals = useMemo(() => {
    const monthly = subscriptions.reduce((sum, sub) => sum + getMonthlyEquivalent(sub), 0)
    const yearly = monthly * 12
    const daily = monthly / 30
    return { daily, monthly, yearly }
  }, [subscriptions])

  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) =>
      getMonthlyEquivalent(b) - getMonthlyEquivalent(a)
    )
  }, [subscriptions])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">${totals.daily.toFixed(2)}</div>
            <div className="text-xs text-slate-500">{t('tools.subscriptionCostCalculator.daily')}</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">${totals.monthly.toFixed(2)}</div>
            <div className="text-xs text-slate-500">{t('tools.subscriptionCostCalculator.monthly')}</div>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <div className="text-lg font-bold text-red-600">${totals.yearly.toFixed(0)}</div>
            <div className="text-xs text-slate-500">{t('tools.subscriptionCostCalculator.yearly')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <input
          type="text"
          value={newSub.name}
          onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
          placeholder={t('tools.subscriptionCostCalculator.subscriptionName')}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={newSub.cost}
            onChange={(e) => setNewSub({ ...newSub, cost: e.target.value })}
            placeholder={t('tools.subscriptionCostCalculator.cost')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={newSub.frequency}
            onChange={(e) => setNewSub({ ...newSub, frequency: e.target.value as Subscription['frequency'] })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="weekly">{t('tools.subscriptionCostCalculator.weekly')}</option>
            <option value="monthly">{t('tools.subscriptionCostCalculator.monthly')}</option>
            <option value="yearly">{t('tools.subscriptionCostCalculator.yearly')}</option>
          </select>
        </div>
        <button
          onClick={addSubscription}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          + {t('tools.subscriptionCostCalculator.add')}
        </button>
      </div>

      {subscriptions.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.subscriptionCostCalculator.subscriptions')}
          </h3>
          <div className="space-y-2">
            {sortedSubscriptions.map(sub => {
              const monthlyEquiv = getMonthlyEquivalent(sub)
              const percentOfTotal = (monthlyEquiv / totals.monthly) * 100
              return (
                <div key={sub.id} className="p-2 bg-slate-50 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{sub.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        ${sub.cost}/{sub.frequency.charAt(0)}
                      </span>
                      <button
                        onClick={() => deleteSubscription(sub.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${percentOfTotal}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-16 text-right">
                      ${monthlyEquiv.toFixed(2)}/mo
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {subscriptions.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          {t('tools.subscriptionCostCalculator.noSubscriptions')}
        </div>
      )}
    </div>
  )
}
