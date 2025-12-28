import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function DownPaymentCalculator() {
  const { t } = useTranslation()
  const [homePrice, setHomePrice] = useState('')
  const [downPaymentPercent, setDownPaymentPercent] = useState('20')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlySaving, setMonthlySaving] = useState('')

  const quickPercents = [5, 10, 15, 20, 25]

  const result = useMemo(() => {
    const price = parseFloat(homePrice) || 0
    const percent = parseFloat(downPaymentPercent) || 20
    const current = parseFloat(currentSavings) || 0
    const monthly = parseFloat(monthlySaving) || 0

    if (price <= 0) return null

    const downPaymentAmount = price * (percent / 100)
    const loanAmount = price - downPaymentAmount
    const amountNeeded = Math.max(0, downPaymentAmount - current)
    const progress = Math.min(100, (current / downPaymentAmount) * 100)
    const monthsToSave = monthly > 0 && amountNeeded > 0 ? Math.ceil(amountNeeded / monthly) : null

    // PMI typically required if down payment < 20%
    const needsPMI = percent < 20
    const estimatedPMI = needsPMI ? (loanAmount * 0.005) / 12 : 0

    return {
      downPaymentAmount,
      loanAmount,
      amountNeeded,
      progress,
      monthsToSave,
      needsPMI,
      estimatedPMI,
      isComplete: current >= downPaymentAmount,
    }
  }, [homePrice, downPaymentPercent, currentSavings, monthlySaving])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.downPaymentCalculator.homePrice')}
          </label>
          <input
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)}
            placeholder="400000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.downPaymentCalculator.downPaymentPercent')}: {downPaymentPercent}%
          </label>
          <div className="flex gap-2 mb-2">
            {quickPercents.map(p => (
              <button
                key={p}
                onClick={() => setDownPaymentPercent(p.toString())}
                className={`flex-1 py-2 rounded text-sm ${
                  downPaymentPercent === p.toString() ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min="3"
            max="50"
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.downPaymentCalculator.currentSavings')}
          </label>
          <input
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
            placeholder="20000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.downPaymentCalculator.monthlySaving')}
          </label>
          <input
            type="number"
            value={monthlySaving}
            onChange={(e) => setMonthlySaving(e.target.value)}
            placeholder="1000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-blue-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.downPaymentCalculator.requiredDownPayment')}</div>
            <div className="text-3xl font-bold text-blue-600">
              ${result.downPaymentAmount.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500">
              {downPaymentPercent}% of ${parseFloat(homePrice).toLocaleString()}
            </div>
          </div>

          <div className="card p-4">
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{t('tools.downPaymentCalculator.progress')}</span>
                <span>{result.progress.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-slate-200 rounded overflow-hidden">
                <div
                  className={`h-full ${result.isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${result.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  ${result.amountNeeded.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.downPaymentCalculator.stillNeeded')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  ${result.loanAmount.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.downPaymentCalculator.loanAmount')}</div>
              </div>
            </div>
          </div>

          {result.monthsToSave && (
            <div className="card p-4 bg-yellow-50 text-center">
              <div className="text-sm text-slate-600">{t('tools.downPaymentCalculator.timeToSave')}</div>
              <div className="text-2xl font-bold text-yellow-600">
                {Math.floor(result.monthsToSave / 12) > 0 &&
                  `${Math.floor(result.monthsToSave / 12)}y `}
                {result.monthsToSave % 12}mo
              </div>
            </div>
          )}

          {result.needsPMI && (
            <div className="card p-4 bg-orange-50">
              <p className="text-sm text-orange-700">
                {t('tools.downPaymentCalculator.pmiWarning')}
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {t('tools.downPaymentCalculator.estimatedPMI')}: ${result.estimatedPMI.toFixed(0)}/mo
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
