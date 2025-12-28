import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const taxBrackets2024 = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
]

export default function TaxEstimator() {
  const { t } = useTranslation()
  const [grossIncome, setGrossIncome] = useState('')
  const [filingStatus, setFilingStatus] = useState('single')
  const [deductions, setDeductions] = useState('')
  const [preTaxContributions, setPreTaxContributions] = useState('')

  const result = useMemo(() => {
    const income = parseFloat(grossIncome) || 0
    const deduction = parseFloat(deductions) || (filingStatus === 'married' ? 29200 : 14600)
    const pretax = parseFloat(preTaxContributions) || 0

    if (income <= 0) return null

    const taxableIncome = Math.max(0, income - deduction - pretax)
    let tax = 0
    let remainingIncome = taxableIncome
    const brackets = filingStatus === 'married'
      ? taxBrackets2024.map(b => ({ ...b, min: b.min * 2, max: b.max * 2 }))
      : taxBrackets2024

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break
      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min)
      tax += taxableInBracket * bracket.rate
      remainingIncome -= taxableInBracket
    }

    const effectiveRate = (tax / income) * 100
    const marginalRate = brackets.find(b => taxableIncome <= b.max)?.rate || 0.37
    const afterTax = income - tax

    return {
      taxableIncome,
      estimatedTax: tax,
      effectiveRate,
      marginalRate: marginalRate * 100,
      afterTax,
    }
  }, [grossIncome, filingStatus, deductions, preTaxContributions])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.taxEstimator.grossIncome')}
          </label>
          <input
            type="number"
            value={grossIncome}
            onChange={(e) => setGrossIncome(e.target.value)}
            placeholder="75000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.taxEstimator.filingStatus')}
          </label>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="single">{t('tools.taxEstimator.single')}</option>
            <option value="married">{t('tools.taxEstimator.marriedJoint')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.taxEstimator.deductions')}
          </label>
          <input
            type="number"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            placeholder={filingStatus === 'married' ? '29200' : '14600'}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">
            {t('tools.taxEstimator.standardDeduction')}: ${filingStatus === 'married' ? '29,200' : '14,600'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.taxEstimator.preTaxContributions')}
          </label>
          <input
            type="number"
            value={preTaxContributions}
            onChange={(e) => setPreTaxContributions(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-red-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.taxEstimator.estimatedTax')}</div>
            <div className="text-2xl font-bold text-red-600">
              ${result.estimatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">{result.effectiveRate.toFixed(1)}%</div>
                <div className="text-xs text-slate-500">{t('tools.taxEstimator.effectiveRate')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">{result.marginalRate.toFixed(0)}%</div>
                <div className="text-xs text-slate-500">{t('tools.taxEstimator.marginalRate')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('tools.taxEstimator.taxableIncome')}</span>
                <span className="font-medium">${result.taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>{t('tools.taxEstimator.afterTaxIncome')}</span>
                <span className="font-medium">${result.afterTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center">
            {t('tools.taxEstimator.disclaimer')}
          </p>
        </div>
      )}
    </div>
  )
}
