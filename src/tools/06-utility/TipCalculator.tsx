import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function TipCalculator() {
  const { t } = useTranslation()
  const [billAmount, setBillAmount] = useState('')
  const [tipPercent, setTipPercent] = useState(15)
  const [customTip, setCustomTip] = useState('')
  const [splitCount, setSplitCount] = useState(1)
  const [roundUp, setRoundUp] = useState(false)

  const tipPresets = [10, 15, 18, 20, 25]

  const result = useMemo(() => {
    const bill = parseFloat(billAmount) || 0
    if (bill <= 0) return null

    const tipRate = customTip ? parseFloat(customTip) : tipPercent
    const tipAmount = bill * (tipRate / 100)
    let total = bill + tipAmount

    if (roundUp) {
      total = Math.ceil(total)
    }

    const actualTip = total - bill
    const perPerson = total / splitCount
    const tipPerPerson = actualTip / splitCount

    return {
      bill: bill.toFixed(2),
      tipAmount: actualTip.toFixed(2),
      tipPercent: ((actualTip / bill) * 100).toFixed(1),
      total: total.toFixed(2),
      perPerson: perPerson.toFixed(2),
      tipPerPerson: tipPerPerson.toFixed(2),
    }
  }, [billAmount, tipPercent, customTip, splitCount, roundUp])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.tipCalculator.billAmount')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.tipCalculator.tipPercent')}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tipPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setTipPercent(preset)
                    setCustomTip('')
                  }}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    tipPercent === preset && !customTip
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
            <input
              type="number"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              placeholder={t('tools.tipCalculator.customTip')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.tipCalculator.splitBetween')}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                className="w-10 h-10 bg-slate-200 rounded text-lg font-medium hover:bg-slate-300"
              >
                -
              </button>
              <input
                type="number"
                value={splitCount}
                onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="w-20 text-center px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={() => setSplitCount(splitCount + 1)}
                className="w-10 h-10 bg-slate-200 rounded text-lg font-medium hover:bg-slate-300"
              >
                +
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={roundUp}
              onChange={(e) => setRoundUp(e.target.checked)}
            />
            {t('tools.tipCalculator.roundUp')}
          </label>
        </div>
      </div>

      {result && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {t('tools.tipCalculator.summary')}
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600">{t('tools.tipCalculator.bill')}</span>
              <span className="font-medium">${result.bill}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600">{t('tools.tipCalculator.tip')} ({result.tipPercent}%)</span>
              <span className="font-medium text-green-600">${result.tipAmount}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-700 font-medium">{t('tools.tipCalculator.total')}</span>
              <span className="text-xl font-bold text-blue-600">${result.total}</span>
            </div>
          </div>

          {splitCount > 1 && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">
                  {t('tools.tipCalculator.perPerson')} ({splitCount} {t('tools.tipCalculator.people')})
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${result.perPerson}
                </div>
                <div className="text-xs text-slate-500">
                  {t('tools.tipCalculator.tipPerPerson')}: ${result.tipPerPerson}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.tipCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.tipCalculator.tip1')}</li>
          <li>{t('tools.tipCalculator.tip2')}</li>
          <li>{t('tools.tipCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
