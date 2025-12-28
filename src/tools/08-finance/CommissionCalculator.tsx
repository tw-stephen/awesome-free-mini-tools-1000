import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Tier {
  id: number
  threshold: string
  rate: string
}

export default function CommissionCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'flat' | 'tiered'>('flat')
  const [salesAmount, setSalesAmount] = useState('')
  const [commissionRate, setCommissionRate] = useState('')
  const [baseSalary, setBaseSalary] = useState('')
  const [tiers, setTiers] = useState<Tier[]>([
    { id: 1, threshold: '0', rate: '5' },
    { id: 2, threshold: '10000', rate: '7' },
    { id: 3, threshold: '25000', rate: '10' },
  ])

  const quickRates = [2, 3, 5, 7, 10, 15]

  const addTier = () => {
    setTiers([...tiers, { id: Date.now(), threshold: '', rate: '' }])
  }

  const removeTier = (id: number) => {
    if (tiers.length <= 2) return
    setTiers(tiers.filter(t => t.id !== id))
  }

  const updateTier = (id: number, field: 'threshold' | 'rate', value: string) => {
    setTiers(tiers.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const result = useMemo(() => {
    const sales = parseFloat(salesAmount) || 0
    const base = parseFloat(baseSalary) || 0

    if (sales <= 0) return null

    if (mode === 'flat') {
      const rate = parseFloat(commissionRate) || 0
      const commission = sales * (rate / 100)
      const totalEarnings = base + commission
      return { commission, totalEarnings, effectiveRate: rate }
    } else {
      // Tiered commission
      const sortedTiers = [...tiers]
        .map(t => ({ threshold: parseFloat(t.threshold) || 0, rate: parseFloat(t.rate) || 0 }))
        .sort((a, b) => a.threshold - b.threshold)

      let commission = 0
      let remainingSales = sales

      for (let i = 0; i < sortedTiers.length; i++) {
        const currentThreshold = sortedTiers[i].threshold
        const nextThreshold = sortedTiers[i + 1]?.threshold || Infinity
        const tierRate = sortedTiers[i].rate / 100

        const tierStart = currentThreshold
        const tierEnd = Math.min(remainingSales, nextThreshold)
        const tierAmount = Math.max(0, tierEnd - tierStart)

        if (sales > tierStart) {
          commission += Math.min(tierAmount, sales - tierStart) * tierRate
        }
      }

      const totalEarnings = base + commission
      const effectiveRate = (commission / sales) * 100

      return { commission, totalEarnings, effectiveRate }
    }
  }, [mode, salesAmount, commissionRate, baseSalary, tiers])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('flat')}
            className={`flex-1 py-2 rounded text-sm ${
              mode === 'flat' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.commissionCalculator.flatRate')}
          </button>
          <button
            onClick={() => setMode('tiered')}
            className={`flex-1 py-2 rounded text-sm ${
              mode === 'tiered' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.commissionCalculator.tiered')}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.commissionCalculator.salesAmount')}
            </label>
            <input
              type="number"
              value={salesAmount}
              onChange={(e) => setSalesAmount(e.target.value)}
              placeholder="50000"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.commissionCalculator.baseSalary')}
            </label>
            <input
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          {mode === 'flat' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.commissionCalculator.commissionRate')}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {quickRates.map(r => (
                  <button
                    key={r}
                    onClick={() => setCommissionRate(r.toString())}
                    className={`px-3 py-1 rounded text-sm ${
                      commissionRate === r.toString() ? 'bg-blue-500 text-white' : 'bg-slate-100'
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="5"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          )}

          {mode === 'tiered' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">
                  {t('tools.commissionCalculator.tiers')}
                </label>
                <button
                  onClick={addTier}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  + {t('tools.commissionCalculator.addTier')}
                </button>
              </div>
              <div className="space-y-2">
                {tiers.map((tier, index) => (
                  <div key={tier.id} className="flex gap-2 items-center">
                    <span className="text-xs text-slate-500 w-8">#{index + 1}</span>
                    <input
                      type="number"
                      value={tier.threshold}
                      onChange={(e) => updateTier(tier.id, 'threshold', e.target.value)}
                      placeholder="From $"
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      value={tier.rate}
                      onChange={(e) => updateTier(tier.id, 'rate', e.target.value)}
                      placeholder="%"
                      className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                    {tiers.length > 2 && (
                      <button
                        onClick={() => removeTier(tier.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.commissionCalculator.commission')}</div>
            <div className="text-3xl font-bold text-green-600">
              ${result.commission.toFixed(2)}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">
                  ${result.totalEarnings.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">{t('tools.commissionCalculator.totalEarnings')}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">
                  {result.effectiveRate.toFixed(2)}%
                </div>
                <div className="text-xs text-slate-500">{t('tools.commissionCalculator.effectiveRate')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
