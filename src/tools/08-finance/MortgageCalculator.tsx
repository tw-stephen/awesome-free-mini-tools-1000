import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function MortgageCalculator() {
  const { t } = useTranslation()
  const [homePrice, setHomePrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('30')
  const [propertyTax, setPropertyTax] = useState('')
  const [insurance, setInsurance] = useState('')

  const result = useMemo(() => {
    const price = parseFloat(homePrice) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) / 100 / 12
    const months = parseInt(loanTerm) * 12
    const tax = (parseFloat(propertyTax) || 0) / 12
    const ins = (parseFloat(insurance) || 0) / 12

    if (price <= 0 || rate <= 0 || months <= 0) return null

    const principal = price - down
    const monthlyPrincipalInterest = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
    const monthlyTotal = monthlyPrincipalInterest + tax + ins
    const totalPayment = monthlyPrincipalInterest * months
    const totalInterest = totalPayment - principal

    return {
      principal,
      monthlyPrincipalInterest,
      monthlyTotal,
      totalPayment,
      totalInterest,
      tax,
      insurance: ins,
    }
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, insurance])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.mortgageCalculator.homePrice')}
          </label>
          <input
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)}
            placeholder="400000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.mortgageCalculator.downPayment')}
            </label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="80000"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.mortgageCalculator.interestRate')}
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="6.5"
              step="0.125"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.mortgageCalculator.loanTerm')}
          </label>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="30">30 years</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.mortgageCalculator.propertyTax')}
            </label>
            <input
              type="number"
              value={propertyTax}
              onChange={(e) => setPropertyTax(e.target.value)}
              placeholder="4000"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.mortgageCalculator.insurance')}
            </label>
            <input
              type="number"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              placeholder="1200"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-blue-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.mortgageCalculator.monthlyPayment')}</div>
            <div className="text-3xl font-bold text-blue-600">
              ${result.monthlyTotal.toFixed(2)}
            </div>
          </div>

          <div className="card p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('tools.mortgageCalculator.principalInterest')}</span>
                <span className="font-medium">${result.monthlyPrincipalInterest.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tools.mortgageCalculator.propertyTax')}</span>
                <span className="font-medium">${result.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tools.mortgageCalculator.insurance')}</span>
                <span className="font-medium">${result.insurance.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <span>{t('tools.mortgageCalculator.loanAmount')}</span>
                <span className="font-medium">${result.principal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>{t('tools.mortgageCalculator.totalInterest')}</span>
                <span className="font-medium">${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
