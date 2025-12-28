import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function NetIncomeCalculator() {
  const { t } = useTranslation()
  const [grossSalary, setGrossSalary] = useState('')
  const [payFrequency, setPayFrequency] = useState<'annual' | 'monthly' | 'biweekly'>('annual')
  const [federalTax, setFederalTax] = useState('')
  const [stateTax, setStateTax] = useState('')
  const [socialSecurity, setSocialSecurity] = useState('6.2')
  const [medicare, setMedicare] = useState('1.45')
  const [retirement401k, setRetirement401k] = useState('')
  const [healthInsurance, setHealthInsurance] = useState('')
  const [otherDeductions, setOtherDeductions] = useState('')

  const result = useMemo(() => {
    let annual = parseFloat(grossSalary) || 0

    if (payFrequency === 'monthly') annual *= 12
    else if (payFrequency === 'biweekly') annual *= 26

    if (annual <= 0) return null

    const fedTax = (parseFloat(federalTax) || 0) / 100
    const stTax = (parseFloat(stateTax) || 0) / 100
    const ss = (parseFloat(socialSecurity) || 0) / 100
    const med = (parseFloat(medicare) || 0) / 100
    const ret = (parseFloat(retirement401k) || 0) / 100
    const health = parseFloat(healthInsurance) || 0
    const other = parseFloat(otherDeductions) || 0

    const federalTaxAmount = annual * fedTax
    const stateTaxAmount = annual * stTax
    const ssAmount = Math.min(annual, 168600) * ss // 2024 SS cap
    const medicareAmount = annual * med
    const retirementAmount = annual * ret
    const healthAnnual = health * 12
    const otherAnnual = other * 12

    const totalDeductions = federalTaxAmount + stateTaxAmount + ssAmount + medicareAmount + retirementAmount + healthAnnual + otherAnnual
    const netAnnual = annual - totalDeductions

    return {
      grossAnnual: annual,
      netAnnual,
      netMonthly: netAnnual / 12,
      netBiweekly: netAnnual / 26,
      netWeekly: netAnnual / 52,
      deductions: {
        federal: federalTaxAmount,
        state: stateTaxAmount,
        socialSecurity: ssAmount,
        medicare: medicareAmount,
        retirement: retirementAmount,
        health: healthAnnual,
        other: otherAnnual,
        total: totalDeductions,
      },
      effectiveTaxRate: ((federalTaxAmount + stateTaxAmount) / annual) * 100,
      totalDeductionRate: (totalDeductions / annual) * 100,
    }
  }, [grossSalary, payFrequency, federalTax, stateTax, socialSecurity, medicare, retirement401k, healthInsurance, otherDeductions])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.netIncomeCalculator.grossSalary')}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={grossSalary}
              onChange={(e) => setGrossSalary(e.target.value)}
              placeholder="75000"
              className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <select
              value={payFrequency}
              onChange={(e) => setPayFrequency(e.target.value as typeof payFrequency)}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="annual">/year</option>
              <option value="monthly">/month</option>
              <option value="biweekly">/2 weeks</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.netIncomeCalculator.federalTax')} %
            </label>
            <input
              type="number"
              value={federalTax}
              onChange={(e) => setFederalTax(e.target.value)}
              placeholder="22"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.netIncomeCalculator.stateTax')} %
            </label>
            <input
              type="number"
              value={stateTax}
              onChange={(e) => setStateTax(e.target.value)}
              placeholder="5"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.netIncomeCalculator.socialSecurity')} %
            </label>
            <input
              type="number"
              value={socialSecurity}
              onChange={(e) => setSocialSecurity(e.target.value)}
              placeholder="6.2"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.netIncomeCalculator.medicare')} %
            </label>
            <input
              type="number"
              value={medicare}
              onChange={(e) => setMedicare(e.target.value)}
              placeholder="1.45"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              401(k) %
            </label>
            <input
              type="number"
              value={retirement401k}
              onChange={(e) => setRetirement401k(e.target.value)}
              placeholder="6"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.netIncomeCalculator.health')}/mo
            </label>
            <input
              type="number"
              value={healthInsurance}
              onChange={(e) => setHealthInsurance(e.target.value)}
              placeholder="200"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.netIncomeCalculator.other')}/mo
            </label>
            <input
              type="number"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.netIncomeCalculator.netIncome')}</div>
            <div className="text-3xl font-bold text-green-600">
              ${result.netAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm text-slate-500">/year</div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">${result.netMonthly.toFixed(0)}</div>
                <div className="text-xs text-slate-500">/month</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">${result.netBiweekly.toFixed(0)}</div>
                <div className="text-xs text-slate-500">/2 weeks</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">${result.netWeekly.toFixed(0)}</div>
                <div className="text-xs text-slate-500">/week</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.netIncomeCalculator.deductionBreakdown')}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('tools.netIncomeCalculator.federalTax')}</span>
                <span className="text-red-600">-${result.deductions.federal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tools.netIncomeCalculator.stateTax')}</span>
                <span className="text-red-600">-${result.deductions.state.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tools.netIncomeCalculator.socialSecurity')}</span>
                <span className="text-red-600">-${result.deductions.socialSecurity.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tools.netIncomeCalculator.medicare')}</span>
                <span className="text-red-600">-${result.deductions.medicare.toFixed(0)}</span>
              </div>
              {result.deductions.retirement > 0 && (
                <div className="flex justify-between">
                  <span>401(k)</span>
                  <span className="text-blue-600">-${result.deductions.retirement.toFixed(0)}</span>
                </div>
              )}
              {result.deductions.health > 0 && (
                <div className="flex justify-between">
                  <span>{t('tools.netIncomeCalculator.health')}</span>
                  <span className="text-red-600">-${result.deductions.health.toFixed(0)}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between font-medium">
                <span>{t('tools.netIncomeCalculator.totalDeductions')}</span>
                <span className="text-red-600">-${result.deductions.total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{t('tools.netIncomeCalculator.effectiveTaxRate')}</span>
                <span>{result.effectiveTaxRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
