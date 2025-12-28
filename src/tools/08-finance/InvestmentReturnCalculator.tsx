import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function InvestmentReturnCalculator() {
  const { t } = useTranslation()
  const [initialValue, setInitialValue] = useState('')
  const [finalValue, setFinalValue] = useState('')
  const [years, setYears] = useState('')
  const [dividends, setDividends] = useState('')
  const [result, setResult] = useState<{
    totalReturn: number
    annualizedReturn: number
    absoluteGain: number
  } | null>(null)

  const calculate = () => {
    const initial = parseFloat(initialValue)
    const final = parseFloat(finalValue)
    const y = parseFloat(years)
    const div = parseFloat(dividends) || 0

    if (initial <= 0 || final <= 0 || y <= 0) return

    const totalValue = final + div
    const absoluteGain = totalValue - initial
    const totalReturn = ((totalValue - initial) / initial) * 100
    const annualizedReturn = (Math.pow(totalValue / initial, 1 / y) - 1) * 100

    setResult({ totalReturn, annualizedReturn, absoluteGain })
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.investmentReturnCalculator.initialInvestment')}
          </label>
          <input
            type="number"
            value={initialValue}
            onChange={(e) => setInitialValue(e.target.value)}
            placeholder="10000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.investmentReturnCalculator.finalValue')}
          </label>
          <input
            type="number"
            value={finalValue}
            onChange={(e) => setFinalValue(e.target.value)}
            placeholder="15000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.investmentReturnCalculator.years')}
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="5"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.investmentReturnCalculator.dividends')}
            </label>
            <input
              type="number"
              value={dividends}
              onChange={(e) => setDividends(e.target.value)}
              placeholder="500"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.investmentReturnCalculator.calculate')}
        </button>
      </div>

      {result && (
        <div className="card p-4 space-y-3">
          <div className="p-3 bg-green-50 rounded text-center">
            <div className="text-sm text-slate-600">{t('tools.investmentReturnCalculator.annualizedReturn')}</div>
            <div className="text-2xl font-bold text-green-600">
              {result.annualizedReturn.toFixed(2)}%
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded text-center">
              <div className="text-xs text-slate-500">{t('tools.investmentReturnCalculator.totalReturn')}</div>
              <div className="text-lg font-bold text-blue-600">
                {result.totalReturn.toFixed(2)}%
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded text-center">
              <div className="text-xs text-slate-500">{t('tools.investmentReturnCalculator.absoluteGain')}</div>
              <div className="text-lg font-bold text-slate-700">
                ${result.absoluteGain.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
