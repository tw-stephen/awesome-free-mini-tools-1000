import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function FutureValueCalculator() {
  const { t } = useTranslation()
  const [presentValue, setPresentValue] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [periods, setPeriods] = useState('')
  const [compoundingFrequency, setCompoundingFrequency] = useState('12')
  const [periodicPayment, setPeriodicPayment] = useState('')
  const [paymentTiming, setPaymentTiming] = useState<'end' | 'beginning'>('end')

  const result = useMemo(() => {
    const pv = parseFloat(presentValue) || 0
    const rate = parseFloat(interestRate) / 100
    const n = parseFloat(periods) || 0
    const freq = parseInt(compoundingFrequency)
    const pmt = parseFloat(periodicPayment) || 0

    if (rate <= 0 || n <= 0) return null

    const periodicRate = rate / freq
    const totalPeriods = n * freq

    // FV of lump sum: PV * (1 + r/n)^(n*t)
    const fvLumpSum = pv * Math.pow(1 + periodicRate, totalPeriods)

    // FV of annuity
    let fvAnnuity = 0
    if (pmt > 0) {
      if (paymentTiming === 'end') {
        // Ordinary annuity
        fvAnnuity = pmt * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate)
      } else {
        // Annuity due
        fvAnnuity = pmt * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate) * (1 + periodicRate)
      }
    }

    const totalFutureValue = fvLumpSum + fvAnnuity
    const totalContributions = pv + (pmt * totalPeriods)
    const totalInterest = totalFutureValue - totalContributions

    return {
      futureValue: totalFutureValue,
      fvLumpSum,
      fvAnnuity,
      totalContributions,
      totalInterest,
      effectiveRate: (Math.pow(1 + periodicRate, freq) - 1) * 100,
    }
  }, [presentValue, interestRate, periods, compoundingFrequency, periodicPayment, paymentTiming])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.futureValueCalculator.presentValue')}
          </label>
          <input
            type="number"
            value={presentValue}
            onChange={(e) => setPresentValue(e.target.value)}
            placeholder="10000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.futureValueCalculator.annualRate')}
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="7"
              step="0.5"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.futureValueCalculator.years')}
            </label>
            <input
              type="number"
              value={periods}
              onChange={(e) => setPeriods(e.target.value)}
              placeholder="10"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.futureValueCalculator.compoundingFrequency')}
          </label>
          <select
            value={compoundingFrequency}
            onChange={(e) => setCompoundingFrequency(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="1">{t('tools.futureValueCalculator.annually')}</option>
            <option value="2">{t('tools.futureValueCalculator.semiAnnually')}</option>
            <option value="4">{t('tools.futureValueCalculator.quarterly')}</option>
            <option value="12">{t('tools.futureValueCalculator.monthly')}</option>
            <option value="365">{t('tools.futureValueCalculator.daily')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.futureValueCalculator.periodicPayment')}
          </label>
          <input
            type="number"
            value={periodicPayment}
            onChange={(e) => setPeriodicPayment(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        {periodicPayment && parseFloat(periodicPayment) > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.futureValueCalculator.paymentTiming')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentTiming('end')}
                className={`flex-1 py-2 rounded text-sm ${
                  paymentTiming === 'end' ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t('tools.futureValueCalculator.endOfPeriod')}
              </button>
              <button
                onClick={() => setPaymentTiming('beginning')}
                className={`flex-1 py-2 rounded text-sm ${
                  paymentTiming === 'beginning' ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t('tools.futureValueCalculator.beginningOfPeriod')}
              </button>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.futureValueCalculator.futureValue')}</div>
            <div className="text-3xl font-bold text-green-600">
              ${result.futureValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  ${result.totalContributions.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.futureValueCalculator.totalContributions')}</div>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">
                  ${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500">{t('tools.futureValueCalculator.totalInterest')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('tools.futureValueCalculator.fvOfPrincipal')}</span>
                <span className="font-medium">${result.fvLumpSum.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              {result.fvAnnuity > 0 && (
                <div className="flex justify-between">
                  <span>{t('tools.futureValueCalculator.fvOfPayments')}</span>
                  <span className="font-medium">${result.fvAnnuity.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>{t('tools.futureValueCalculator.effectiveRate')}</span>
                <span>{result.effectiveRate.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
