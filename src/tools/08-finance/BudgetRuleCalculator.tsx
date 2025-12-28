import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function BudgetRuleCalculator() {
  const { t } = useTranslation()
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [rule, setRule] = useState<'50-30-20' | '70-20-10' | '80-20'>('50-30-20')

  const rules = {
    '50-30-20': { needs: 50, wants: 30, savings: 20 },
    '70-20-10': { needs: 70, wants: 20, savings: 10 },
    '80-20': { needs: 80, wants: 0, savings: 20 },
  }

  const result = useMemo(() => {
    const income = parseFloat(monthlyIncome) || 0
    if (income <= 0) return null

    const currentRule = rules[rule]
    const needsAmount = income * (currentRule.needs / 100)
    const wantsAmount = income * (currentRule.wants / 100)
    const savingsAmount = income * (currentRule.savings / 100)

    const annualSavings = savingsAmount * 12

    return {
      needs: needsAmount,
      wants: wantsAmount,
      savings: savingsAmount,
      annualSavings,
      percentages: currentRule,
    }
  }, [monthlyIncome, rule])

  const categoryExamples = {
    needs: ['Rent/Mortgage', 'Utilities', 'Groceries', 'Insurance', 'Transportation', 'Minimum debt payments'],
    wants: ['Dining out', 'Entertainment', 'Shopping', 'Subscriptions', 'Hobbies', 'Vacations'],
    savings: ['Emergency fund', 'Retirement', 'Investments', 'Debt payoff', 'Goals'],
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.budgetRuleCalculator.monthlyIncome')}
          </label>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            placeholder="5000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.budgetRuleCalculator.selectRule')}
          </label>
          <div className="space-y-2">
            {Object.entries(rules).map(([key, { needs, wants, savings }]) => (
              <button
                key={key}
                onClick={() => setRule(key as typeof rule)}
                className={`w-full p-3 rounded text-left ${
                  rule === key ? 'bg-blue-50 border-2 border-blue-500' : 'bg-slate-50 border-2 border-transparent'
                }`}
              >
                <div className="font-medium">{key} Rule</div>
                <div className="text-xs text-slate-500">
                  Needs: {needs}% • Wants: {wants}% • Savings: {savings}%
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-xl font-bold text-blue-600">
                  ${result.needs.toFixed(0)}
                </div>
                <div className="text-xs text-slate-500">
                  {t('tools.budgetRuleCalculator.needs')} ({result.percentages.needs}%)
                </div>
              </div>
              {result.percentages.wants > 0 && (
                <div className="p-3 bg-purple-50 rounded">
                  <div className="text-xl font-bold text-purple-600">
                    ${result.wants.toFixed(0)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t('tools.budgetRuleCalculator.wants')} ({result.percentages.wants}%)
                  </div>
                </div>
              )}
              <div className={`p-3 bg-green-50 rounded ${result.percentages.wants === 0 ? 'col-span-2' : ''}`}>
                <div className="text-xl font-bold text-green-600">
                  ${result.savings.toFixed(0)}
                </div>
                <div className="text-xs text-slate-500">
                  {t('tools.budgetRuleCalculator.savings')} ({result.percentages.savings}%)
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.budgetRuleCalculator.annualSavings')}</div>
            <div className="text-2xl font-bold text-green-600">
              ${result.annualSavings.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="card p-4">
              <h4 className="text-sm font-medium text-blue-700 mb-2">
                {t('tools.budgetRuleCalculator.needsExamples')}
              </h4>
              <div className="flex flex-wrap gap-1">
                {categoryExamples.needs.map(ex => (
                  <span key={ex} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {ex}
                  </span>
                ))}
              </div>
            </div>

            {result.percentages.wants > 0 && (
              <div className="card p-4">
                <h4 className="text-sm font-medium text-purple-700 mb-2">
                  {t('tools.budgetRuleCalculator.wantsExamples')}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {categoryExamples.wants.map(ex => (
                    <span key={ex} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="card p-4">
              <h4 className="text-sm font-medium text-green-700 mb-2">
                {t('tools.budgetRuleCalculator.savingsExamples')}
              </h4>
              <div className="flex flex-wrap gap-1">
                {categoryExamples.savings.map(ex => (
                  <span key={ex} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
