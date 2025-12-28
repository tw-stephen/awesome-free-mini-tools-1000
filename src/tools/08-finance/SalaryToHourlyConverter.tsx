import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function SalaryToHourlyConverter() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'salaryToHourly' | 'hourlyToSalary'>('salaryToHourly')
  const [salary, setSalary] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState('40')
  const [weeksPerYear, setWeeksPerYear] = useState('52')

  const result = useMemo(() => {
    const hours = parseFloat(hoursPerWeek) || 40
    const weeks = parseFloat(weeksPerYear) || 52
    const totalHours = hours * weeks

    if (mode === 'salaryToHourly') {
      const annualSalary = parseFloat(salary) || 0
      if (annualSalary <= 0) return null

      const hourly = annualSalary / totalHours
      const monthly = annualSalary / 12
      const biweekly = annualSalary / 26
      const weekly = annualSalary / weeks
      const daily = weekly / 5

      return { hourly, monthly, biweekly, weekly, daily, annual: annualSalary }
    } else {
      const hourly = parseFloat(hourlyRate) || 0
      if (hourly <= 0) return null

      const annual = hourly * totalHours
      const monthly = annual / 12
      const biweekly = annual / 26
      const weekly = annual / weeks
      const daily = weekly / 5

      return { hourly, monthly, biweekly, weekly, daily, annual }
    }
  }, [mode, salary, hourlyRate, hoursPerWeek, weeksPerYear])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('salaryToHourly')}
            className={`flex-1 py-2 rounded text-sm ${
              mode === 'salaryToHourly' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.salaryToHourlyConverter.salaryToHourly')}
          </button>
          <button
            onClick={() => setMode('hourlyToSalary')}
            className={`flex-1 py-2 rounded text-sm ${
              mode === 'hourlyToSalary' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.salaryToHourlyConverter.hourlyToSalary')}
          </button>
        </div>

        <div className="space-y-3">
          {mode === 'salaryToHourly' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.salaryToHourlyConverter.annualSalary')}
              </label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="75000"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.salaryToHourlyConverter.hourlyRate')}
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="35"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.salaryToHourlyConverter.hoursPerWeek')}
              </label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.salaryToHourlyConverter.weeksPerYear')}
              </label>
              <input
                type="number"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">
              {mode === 'salaryToHourly'
                ? t('tools.salaryToHourlyConverter.hourlyRate')
                : t('tools.salaryToHourlyConverter.annualSalary')}
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${mode === 'salaryToHourly'
                ? result.hourly.toFixed(2)
                : result.annual.toLocaleString()}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.salaryToHourlyConverter.breakdown')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-slate-50 rounded text-center">
                <div className="text-lg font-bold text-slate-700">${result.hourly.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.salaryToHourlyConverter.hourly')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded text-center">
                <div className="text-lg font-bold text-slate-700">${result.daily.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.salaryToHourlyConverter.daily')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded text-center">
                <div className="text-lg font-bold text-slate-700">${result.weekly.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.salaryToHourlyConverter.weekly')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded text-center">
                <div className="text-lg font-bold text-slate-700">${result.biweekly.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.salaryToHourlyConverter.biweekly')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded text-center">
                <div className="text-lg font-bold text-slate-700">${result.monthly.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.salaryToHourlyConverter.monthly')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded text-center">
                <div className="text-lg font-bold text-slate-700">${result.annual.toLocaleString()}</div>
                <div className="text-xs text-slate-500">{t('tools.salaryToHourlyConverter.annual')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
