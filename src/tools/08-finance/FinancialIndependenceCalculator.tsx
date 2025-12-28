import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function FinancialIndependenceCalculator() {
  const { t } = useTranslation()
  const [annualExpenses, setAnnualExpenses] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [annualSavings, setAnnualSavings] = useState('')
  const [expectedReturn, setExpectedReturn] = useState('7')
  const [withdrawalRate, setWithdrawalRate] = useState('4')

  const result = useMemo(() => {
    const expenses = parseFloat(annualExpenses) || 0
    const current = parseFloat(currentSavings) || 0
    const savings = parseFloat(annualSavings) || 0
    const returns = parseFloat(expectedReturn) / 100
    const withdrawal = parseFloat(withdrawalRate) / 100

    if (expenses <= 0 || withdrawal <= 0) return null

    // FI Number = Annual Expenses / Withdrawal Rate
    const fiNumber = expenses / withdrawal
    const amountNeeded = Math.max(0, fiNumber - current)
    const progress = (current / fiNumber) * 100

    // Calculate years to FI
    let yearsToFI = 0
    if (savings > 0 && amountNeeded > 0) {
      // Using logarithmic formula for compound growth with contributions
      let balance = current
      while (balance < fiNumber && yearsToFI < 100) {
        balance = balance * (1 + returns) + savings
        yearsToFI++
      }
    } else if (current >= fiNumber) {
      yearsToFI = 0
    } else {
      yearsToFI = -1 // Unreachable
    }

    // Calculate safe withdrawal amount
    const safeWithdrawal = current * withdrawal
    const coverageRatio = safeWithdrawal / expenses

    // Lean FI (50% expenses) and Fat FI (150% expenses)
    const leanFI = (expenses * 0.5) / withdrawal
    const fatFI = (expenses * 1.5) / withdrawal

    return {
      fiNumber,
      amountNeeded,
      progress: Math.min(100, progress),
      yearsToFI,
      safeWithdrawal,
      coverageRatio: coverageRatio * 100,
      leanFI,
      fatFI,
      isReached: current >= fiNumber,
    }
  }, [annualExpenses, currentSavings, annualSavings, expectedReturn, withdrawalRate])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.financialIndependenceCalculator.annualExpenses')}
          </label>
          <input
            type="number"
            value={annualExpenses}
            onChange={(e) => setAnnualExpenses(e.target.value)}
            placeholder="50000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.financialIndependenceCalculator.currentSavings')}
            </label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              placeholder="100000"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.financialIndependenceCalculator.annualSavings')}
            </label>
            <input
              type="number"
              value={annualSavings}
              onChange={(e) => setAnnualSavings(e.target.value)}
              placeholder="30000"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.financialIndependenceCalculator.expectedReturn')} %
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.financialIndependenceCalculator.withdrawalRate')} %
            </label>
            <input
              type="number"
              value={withdrawalRate}
              onChange={(e) => setWithdrawalRate(e.target.value)}
              placeholder="4"
              step="0.5"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className={`card p-4 text-center ${result.isReached ? 'bg-green-50' : 'bg-blue-50'}`}>
            <div className="text-sm text-slate-600">{t('tools.financialIndependenceCalculator.fiNumber')}</div>
            <div className={`text-3xl font-bold ${result.isReached ? 'text-green-600' : 'text-blue-600'}`}>
              ${result.fiNumber.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            {result.isReached ? (
              <div className="text-sm text-green-600 font-medium mt-1">
                {t('tools.financialIndependenceCalculator.fiReached')}
              </div>
            ) : result.yearsToFI > 0 ? (
              <div className="text-sm text-slate-500">
                {result.yearsToFI} {t('tools.financialIndependenceCalculator.yearsAway')}
              </div>
            ) : null}
          </div>

          <div className="card p-4">
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{t('tools.financialIndependenceCalculator.progress')}</span>
                <span className={result.isReached ? 'text-green-600 font-medium' : ''}>
                  {result.progress.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-slate-200 rounded overflow-hidden">
                <div
                  className={`h-full ${result.isReached ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${result.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  ${result.amountNeeded.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500">{t('tools.financialIndependenceCalculator.stillNeeded')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  ${result.safeWithdrawal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500">{t('tools.financialIndependenceCalculator.safeWithdrawal')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.financialIndependenceCalculator.fiLevels')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Lean FI (50%)</span>
                <span className="font-medium">
                  ${result.leanFI.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600 font-medium">Regular FI (100%)</span>
                <span className="font-medium text-blue-600">
                  ${result.fiNumber.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Fat FI (150%)</span>
                <span className="font-medium">
                  ${result.fatFI.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <p className="text-xs text-slate-600">
              {t('tools.financialIndependenceCalculator.explanation')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
