import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function HourlyRateCalculator() {
  const { t } = useTranslation()
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState('')
  const [businessExpenses, setBusinessExpenses] = useState('')
  const [taxRate, setTaxRate] = useState('25')
  const [vacationWeeks, setVacationWeeks] = useState('2')
  const [sickDays, setSickDays] = useState('5')
  const [billableHoursPerDay, setBillableHoursPerDay] = useState('6')
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState('5')

  const result = useMemo(() => {
    const income = parseFloat(desiredAnnualIncome) || 0
    const expenses = parseFloat(businessExpenses) || 0
    const tax = parseFloat(taxRate) / 100 || 0
    const vacation = parseFloat(vacationWeeks) || 0
    const sick = parseFloat(sickDays) || 0
    const billableHours = parseFloat(billableHoursPerDay) || 6
    const workDays = parseFloat(workDaysPerWeek) || 5

    if (income <= 0) return null

    // Calculate total needed (income + expenses, then account for taxes)
    const totalNeeded = (income + expenses) / (1 - tax)

    // Calculate work hours available
    const workWeeks = 52 - vacation
    const workDaysTotal = (workWeeks * workDays) - sick
    const billableHoursTotal = workDaysTotal * billableHours

    // Calculate rates
    const hourlyRate = totalNeeded / billableHoursTotal
    const dailyRate = hourlyRate * billableHours
    const weeklyRate = dailyRate * workDays
    const monthlyRate = totalNeeded / 12

    return {
      hourlyRate,
      dailyRate,
      weeklyRate,
      monthlyRate,
      totalNeeded,
      billableHoursTotal,
      workDaysTotal,
      taxAmount: totalNeeded * tax,
    }
  }, [desiredAnnualIncome, businessExpenses, taxRate, vacationWeeks, sickDays, billableHoursPerDay, workDaysPerWeek])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.hourlyRateCalculator.desiredIncome')}
          </label>
          <input
            type="number"
            value={desiredAnnualIncome}
            onChange={(e) => setDesiredAnnualIncome(e.target.value)}
            placeholder="100000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.hourlyRateCalculator.expenses')}
            </label>
            <input
              type="number"
              value={businessExpenses}
              onChange={(e) => setBusinessExpenses(e.target.value)}
              placeholder="10000"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.hourlyRateCalculator.taxRate')}
            </label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder="25"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.hourlyRateCalculator.vacationWeeks')}
            </label>
            <input
              type="number"
              value={vacationWeeks}
              onChange={(e) => setVacationWeeks(e.target.value)}
              placeholder="2"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.hourlyRateCalculator.sickDays')}
            </label>
            <input
              type="number"
              value={sickDays}
              onChange={(e) => setSickDays(e.target.value)}
              placeholder="5"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.hourlyRateCalculator.billableHours')}
            </label>
            <input
              type="number"
              value={billableHoursPerDay}
              onChange={(e) => setBillableHoursPerDay(e.target.value)}
              placeholder="6"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.hourlyRateCalculator.workDays')}
            </label>
            <input
              type="number"
              value={workDaysPerWeek}
              onChange={(e) => setWorkDaysPerWeek(e.target.value)}
              placeholder="5"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.hourlyRateCalculator.hourlyRate')}</div>
            <div className="text-3xl font-bold text-green-600">
              ${result.hourlyRate.toFixed(2)}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">${result.dailyRate.toFixed(0)}</div>
                <div className="text-xs text-slate-500">{t('tools.hourlyRateCalculator.daily')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">${result.weeklyRate.toFixed(0)}</div>
                <div className="text-xs text-slate-500">{t('tools.hourlyRateCalculator.weekly')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">${result.monthlyRate.toFixed(0)}</div>
                <div className="text-xs text-slate-500">{t('tools.hourlyRateCalculator.monthly')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.hourlyRateCalculator.breakdown')}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('tools.hourlyRateCalculator.totalNeeded')}</span>
                <span className="font-medium">${result.totalNeeded.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{t('tools.hourlyRateCalculator.taxEstimate')}</span>
                <span>${result.taxAmount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tools.hourlyRateCalculator.billableHoursYear')}</span>
                <span className="font-medium">{result.billableHoursTotal.toFixed(0)} hrs</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tools.hourlyRateCalculator.workDaysYear')}</span>
                <span className="font-medium">{result.workDaysTotal.toFixed(0)} days</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
