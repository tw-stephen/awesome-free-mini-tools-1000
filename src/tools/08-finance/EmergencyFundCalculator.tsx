import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function EmergencyFundCalculator() {
  const { t } = useTranslation()
  const [monthlyExpenses, setMonthlyExpenses] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [targetMonths, setTargetMonths] = useState('6')
  const [monthlySavingAmount, setMonthlySavingAmount] = useState('')

  const result = useMemo(() => {
    const expenses = parseFloat(monthlyExpenses) || 0
    const current = parseFloat(currentSavings) || 0
    const months = parseInt(targetMonths) || 6
    const savingRate = parseFloat(monthlySavingAmount) || 0

    if (expenses <= 0) return null

    const targetFund = expenses * months
    const amountNeeded = Math.max(0, targetFund - current)
    const progress = Math.min(100, (current / targetFund) * 100)
    const monthsCovered = current / expenses
    const monthsToReachGoal = savingRate > 0 ? Math.ceil(amountNeeded / savingRate) : null

    return {
      targetFund,
      amountNeeded,
      progress,
      monthsCovered,
      monthsToReachGoal,
      isComplete: current >= targetFund,
    }
  }, [monthlyExpenses, currentSavings, targetMonths, monthlySavingAmount])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.emergencyFundCalculator.monthlyExpenses')}
          </label>
          <input
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.target.value)}
            placeholder="3000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.emergencyFundCalculator.targetMonths')}: {targetMonths} months
          </label>
          <div className="flex gap-2">
            {[3, 6, 9, 12].map(m => (
              <button
                key={m}
                onClick={() => setTargetMonths(m.toString())}
                className={`flex-1 py-2 rounded text-sm ${
                  targetMonths === m.toString() ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {m}mo
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.emergencyFundCalculator.currentSavings')}
          </label>
          <input
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
            placeholder="5000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.emergencyFundCalculator.monthlySaving')}
          </label>
          <input
            type="number"
            value={monthlySavingAmount}
            onChange={(e) => setMonthlySavingAmount(e.target.value)}
            placeholder="500"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className={`card p-4 text-center ${result.isComplete ? 'bg-green-50' : 'bg-blue-50'}`}>
            <div className="text-sm text-slate-600">{t('tools.emergencyFundCalculator.targetFund')}</div>
            <div className={`text-3xl font-bold ${result.isComplete ? 'text-green-600' : 'text-blue-600'}`}>
              ${result.targetFund.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500">
              {targetMonths} {t('tools.emergencyFundCalculator.monthsOfExpenses')}
            </div>
          </div>

          <div className="card p-4">
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{t('tools.emergencyFundCalculator.progress')}</span>
                <span className={result.isComplete ? 'text-green-600' : ''}>{result.progress.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-slate-200 rounded overflow-hidden">
                <div
                  className={`h-full ${result.isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${result.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center mt-4">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  {result.monthsCovered.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">{t('tools.emergencyFundCalculator.monthsCovered')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  ${result.amountNeeded.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.emergencyFundCalculator.stillNeeded')}</div>
              </div>
            </div>
          </div>

          {result.monthsToReachGoal && !result.isComplete && (
            <div className="card p-4 bg-yellow-50 text-center">
              <div className="text-sm text-slate-600">{t('tools.emergencyFundCalculator.timeToGoal')}</div>
              <div className="text-2xl font-bold text-yellow-600">
                {result.monthsToReachGoal} {t('tools.emergencyFundCalculator.months')}
              </div>
            </div>
          )}

          {result.isComplete && (
            <div className="card p-4 bg-green-100 text-center">
              <p className="text-green-700 font-medium">
                {t('tools.emergencyFundCalculator.goalReached')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
