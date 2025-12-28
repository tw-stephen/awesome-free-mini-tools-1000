import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function FreelanceRateCalculator() {
  const { t } = useTranslation()
  const [comparableSalary, setComparableSalary] = useState('')
  const [healthInsurance, setHealthInsurance] = useState('')
  const [retirementContribution, setRetirementContribution] = useState('15')
  const [selfEmploymentTax, setSelfEmploymentTax] = useState('15.3')
  const [incomeTax, setIncomeTax] = useState('25')
  const [businessExpenses, setBusinessExpenses] = useState('')
  const [profitMargin, setProfitMargin] = useState('20')
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState('30')
  const [weeksWorked, setWeeksWorked] = useState('48')

  const result = useMemo(() => {
    const salary = parseFloat(comparableSalary) || 0
    const insurance = parseFloat(healthInsurance) || 0
    const retirement = parseFloat(retirementContribution) / 100 || 0
    const seTax = parseFloat(selfEmploymentTax) / 100 || 0
    const incTax = parseFloat(incomeTax) / 100 || 0
    const expenses = parseFloat(businessExpenses) || 0
    const margin = parseFloat(profitMargin) / 100 || 0
    const billable = parseFloat(billableHoursPerWeek) || 30
    const weeks = parseFloat(weeksWorked) || 48

    if (salary <= 0) return null

    // Employee equivalent benefits cost
    const employerBenefits = salary * 0.08 // ~8% for employer-paid benefits
    const paidTimeOff = salary * 0.1 // ~10% for PTO value

    // Total base compensation value
    const totalCompValue = salary + employerBenefits + paidTimeOff

    // Add freelance-specific costs
    const healthCost = insurance * 12
    const retirementCost = salary * retirement
    const totalGross = totalCompValue + healthCost + retirementCost + expenses

    // Account for taxes
    const beforeTaxes = totalGross / (1 - seTax - incTax)

    // Add profit margin
    const targetRevenue = beforeTaxes * (1 + margin)

    // Calculate hours
    const billableHoursYear = billable * weeks
    const hourlyRate = targetRevenue / billableHoursYear
    const dailyRate = hourlyRate * 8
    const weeklyRate = hourlyRate * billable
    const monthlyRate = targetRevenue / 12
    const projectRate = hourlyRate * 40 // Standard 40-hour project

    return {
      hourlyRate,
      dailyRate,
      weeklyRate,
      monthlyRate,
      projectRate,
      targetRevenue,
      billableHoursYear,
      totalCompValue,
      taxes: beforeTaxes - totalGross,
    }
  }, [comparableSalary, healthInsurance, retirementContribution, selfEmploymentTax, incomeTax, businessExpenses, profitMargin, billableHoursPerWeek, weeksWorked])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.freelanceRateCalculator.comparableSalary')}
          </label>
          <input
            type="number"
            value={comparableSalary}
            onChange={(e) => setComparableSalary(e.target.value)}
            placeholder="80000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">
            {t('tools.freelanceRateCalculator.salaryHint')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.freelanceRateCalculator.healthInsurance')}
            </label>
            <input
              type="number"
              value={healthInsurance}
              onChange={(e) => setHealthInsurance(e.target.value)}
              placeholder="500"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.freelanceRateCalculator.businessExpenses')}
            </label>
            <input
              type="number"
              value={businessExpenses}
              onChange={(e) => setBusinessExpenses(e.target.value)}
              placeholder="5000"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.freelanceRateCalculator.retirementPercent')}
            </label>
            <input
              type="number"
              value={retirementContribution}
              onChange={(e) => setRetirementContribution(e.target.value)}
              placeholder="15"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.freelanceRateCalculator.seTax')}
            </label>
            <input
              type="number"
              value={selfEmploymentTax}
              onChange={(e) => setSelfEmploymentTax(e.target.value)}
              placeholder="15.3"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.freelanceRateCalculator.incomeTax')}
            </label>
            <input
              type="number"
              value={incomeTax}
              onChange={(e) => setIncomeTax(e.target.value)}
              placeholder="25"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.freelanceRateCalculator.profitMargin')}
            </label>
            <input
              type="number"
              value={profitMargin}
              onChange={(e) => setProfitMargin(e.target.value)}
              placeholder="20"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.freelanceRateCalculator.billableHours')}
            </label>
            <input
              type="number"
              value={billableHoursPerWeek}
              onChange={(e) => setBillableHoursPerWeek(e.target.value)}
              placeholder="30"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.freelanceRateCalculator.weeksWorked')}
            </label>
            <input
              type="number"
              value={weeksWorked}
              onChange={(e) => setWeeksWorked(e.target.value)}
              placeholder="48"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.freelanceRateCalculator.hourlyRate')}</div>
            <div className="text-3xl font-bold text-green-600">
              ${result.hourlyRate.toFixed(2)}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">${result.dailyRate.toFixed(0)}</div>
                <div className="text-xs text-slate-500">{t('tools.freelanceRateCalculator.daily')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">${result.weeklyRate.toFixed(0)}</div>
                <div className="text-xs text-slate-500">{t('tools.freelanceRateCalculator.weekly')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">${result.monthlyRate.toFixed(0)}</div>
                <div className="text-xs text-slate-500">{t('tools.freelanceRateCalculator.monthly')}</div>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">${result.projectRate.toFixed(0)}</div>
                <div className="text-xs text-slate-500">{t('tools.freelanceRateCalculator.project40h')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-yellow-50">
            <div className="text-center">
              <div className="text-sm text-slate-600">{t('tools.freelanceRateCalculator.targetRevenue')}</div>
              <div className="text-xl font-bold text-yellow-600">${result.targetRevenue.toFixed(0)}/yr</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
