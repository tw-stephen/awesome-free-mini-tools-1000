import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function ExpenseRatioCalculator() {
  const { t } = useTranslation()
  const [investment, setInvestment] = useState('')
  const [expenseRatio, setExpenseRatio] = useState('')
  const [expectedReturn, setExpectedReturn] = useState('7')
  const [years, setYears] = useState('30')

  const result = useMemo(() => {
    const principal = parseFloat(investment) || 0
    const expense = parseFloat(expenseRatio) / 100 || 0
    const returns = parseFloat(expectedReturn) / 100 || 0
    const n = parseInt(years) || 0

    if (principal <= 0 || n <= 0) return null

    // Calculate with and without expense ratio
    const netReturn = returns - expense
    const finalWithExpense = principal * Math.pow(1 + netReturn, n)
    const finalWithoutExpense = principal * Math.pow(1 + returns, n)
    const costOfExpense = finalWithoutExpense - finalWithExpense

    // Compare different expense ratios
    const comparisons = [0.03, 0.10, 0.25, 0.50, 1.00, 1.50].map(er => {
      const net = returns - (er / 100)
      const final = principal * Math.pow(1 + net, n)
      return {
        expenseRatio: er,
        finalValue: final,
        lost: finalWithoutExpense - final,
      }
    })

    // Annual fee in dollars
    const annualFee = principal * expense

    return {
      finalWithExpense,
      finalWithoutExpense,
      costOfExpense,
      annualFee,
      comparisons,
      effectiveReturn: netReturn * 100,
    }
  }, [investment, expenseRatio, expectedReturn, years])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.expenseRatioCalculator.investment')}
          </label>
          <input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            placeholder="100000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.expenseRatioCalculator.expenseRatio')}
            </label>
            <input
              type="number"
              value={expenseRatio}
              onChange={(e) => setExpenseRatio(e.target.value)}
              placeholder="0.50"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.expenseRatioCalculator.expectedReturn')}
            </label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              placeholder="7"
              step="0.5"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.expenseRatioCalculator.years')}: {years} years
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-red-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.expenseRatioCalculator.costOfFees')}</div>
            <div className="text-3xl font-bold text-red-600">
              ${result.costOfExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm text-slate-500">
              {t('tools.expenseRatioCalculator.over')} {years} {t('tools.expenseRatioCalculator.years')}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">
                  ${result.finalWithExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500">{t('tools.expenseRatioCalculator.withFees')}</div>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">
                  ${result.finalWithoutExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500">{t('tools.expenseRatioCalculator.withoutFees')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">${result.annualFee.toFixed(0)}</div>
                <div className="text-xs text-slate-500">{t('tools.expenseRatioCalculator.annualFee')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">{result.effectiveReturn.toFixed(2)}%</div>
                <div className="text-xs text-slate-500">{t('tools.expenseRatioCalculator.effectiveReturn')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.expenseRatioCalculator.comparison')}
            </h3>
            <div className="space-y-2">
              {result.comparisons.map(comp => (
                <div key={comp.expenseRatio} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">{comp.expenseRatio.toFixed(2)}%</span>
                  <div className="text-right">
                    <span className="font-medium">
                      ${comp.finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-red-500 text-xs ml-2">
                      -${comp.lost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <p className="text-xs text-slate-600">
              {t('tools.expenseRatioCalculator.tip')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
