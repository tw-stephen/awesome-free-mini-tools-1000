import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function TipCalculator() {
  const { t } = useTranslation()
  const [billAmount, setBillAmount] = useState('')
  const [tipPercent, setTipPercent] = useState(15)
  const [splitWays, setSplitWays] = useState(1)

  const quickTips = [10, 15, 18, 20, 25]

  const result = useMemo(() => {
    const bill = parseFloat(billAmount)
    if (isNaN(bill) || bill <= 0) return null

    const tipAmount = bill * (tipPercent / 100)
    const total = bill + tipAmount
    const perPerson = total / splitWays
    const tipPerPerson = tipAmount / splitWays

    return { tipAmount, total, perPerson, tipPerPerson }
  }, [billAmount, tipPercent, splitWays])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.tipCalculator.billAmount')}
          </label>
          <input
            type="number"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            placeholder="50.00"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.tipCalculator.tipPercent')}: {tipPercent}%
          </label>
          <div className="flex gap-2 mb-2">
            {quickTips.map(tip => (
              <button
                key={tip}
                onClick={() => setTipPercent(tip)}
                className={`flex-1 py-2 rounded text-sm ${
                  tipPercent === tip ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {tip}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={tipPercent}
            onChange={(e) => setTipPercent(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.tipCalculator.splitBetween')}: {splitWays}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <button
                key={n}
                onClick={() => setSplitWays(n)}
                className={`flex-1 py-2 rounded text-sm ${
                  splitWays === n ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded text-center">
              <div className="text-xs text-slate-500">{t('tools.tipCalculator.tip')}</div>
              <div className="text-xl font-bold text-blue-600">
                ${result.tipAmount.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded text-center">
              <div className="text-xs text-slate-500">{t('tools.tipCalculator.total')}</div>
              <div className="text-xl font-bold text-green-600">
                ${result.total.toFixed(2)}
              </div>
            </div>
          </div>

          {splitWays > 1 && (
            <div className="p-4 bg-purple-50 rounded text-center">
              <div className="text-sm text-slate-600">{t('tools.tipCalculator.perPerson')}</div>
              <div className="text-2xl font-bold text-purple-600">
                ${result.perPerson.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500">
                ({t('tools.tipCalculator.tipOf')} ${result.tipPerPerson.toFixed(2)})
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
