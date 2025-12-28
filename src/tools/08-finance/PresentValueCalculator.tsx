import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function PresentValueCalculator() {
  const { t } = useTranslation()
  const [futureValue, setFutureValue] = useState('')
  const [discountRate, setDiscountRate] = useState('')
  const [periods, setPeriods] = useState('')
  const [compoundingFrequency, setCompoundingFrequency] = useState('1')
  const [periodicPayment, setPeriodicPayment] = useState('')

  const result = useMemo(() => {
    const fv = parseFloat(futureValue) || 0
    const rate = parseFloat(discountRate) / 100
    const n = parseFloat(periods) || 0
    const freq = parseInt(compoundingFrequency)
    const pmt = parseFloat(periodicPayment) || 0

    if (rate <= 0 || n <= 0) return null

    const periodicRate = rate / freq
    const totalPeriods = n * freq

    // PV of lump sum: FV / (1 + r/n)^(n*t)
    const pvLumpSum = fv / Math.pow(1 + periodicRate, totalPeriods)

    // PV of annuity (ordinary annuity)
    let pvAnnuity = 0
    if (pmt > 0) {
      pvAnnuity = pmt * ((1 - Math.pow(1 + periodicRate, -totalPeriods)) / periodicRate)
    }

    const totalPresentValue = pvLumpSum + pvAnnuity
    const totalFuturePayments = fv + (pmt * totalPeriods)
    const discountAmount = totalFuturePayments - totalPresentValue

    return {
      presentValue: totalPresentValue,
      pvLumpSum,
      pvAnnuity,
      totalFuturePayments,
      discountAmount,
      discountFactor: 1 / Math.pow(1 + periodicRate, totalPeriods),
    }
  }, [futureValue, discountRate, periods, compoundingFrequency, periodicPayment])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.presentValueCalculator.futureValue')}
          </label>
          <input
            type="number"
            value={futureValue}
            onChange={(e) => setFutureValue(e.target.value)}
            placeholder="100000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.presentValueCalculator.discountRate')}
            </label>
            <input
              type="number"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              placeholder="5"
              step="0.5"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.presentValueCalculator.years')}
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
            {t('tools.presentValueCalculator.compoundingFrequency')}
          </label>
          <select
            value={compoundingFrequency}
            onChange={(e) => setCompoundingFrequency(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="1">{t('tools.presentValueCalculator.annually')}</option>
            <option value="2">{t('tools.presentValueCalculator.semiAnnually')}</option>
            <option value="4">{t('tools.presentValueCalculator.quarterly')}</option>
            <option value="12">{t('tools.presentValueCalculator.monthly')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.presentValueCalculator.periodicPayment')}
          </label>
          <input
            type="number"
            value={periodicPayment}
            onChange={(e) => setPeriodicPayment(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">
            {t('tools.presentValueCalculator.paymentNote')}
          </p>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-blue-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.presentValueCalculator.presentValue')}</div>
            <div className="text-3xl font-bold text-blue-600">
              ${result.presentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  ${result.totalFuturePayments.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.presentValueCalculator.totalFuture')}</div>
              </div>
              <div className="p-2 bg-red-50 rounded">
                <div className="text-lg font-bold text-red-600">
                  ${result.discountAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500">{t('tools.presentValueCalculator.discounted')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('tools.presentValueCalculator.pvOfLumpSum')}</span>
                <span className="font-medium">${result.pvLumpSum.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              {result.pvAnnuity > 0 && (
                <div className="flex justify-between">
                  <span>{t('tools.presentValueCalculator.pvOfPayments')}</span>
                  <span className="font-medium">${result.pvAnnuity.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>{t('tools.presentValueCalculator.discountFactor')}</span>
                <span>{result.discountFactor.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <p className="text-xs text-slate-600">
              {t('tools.presentValueCalculator.explanation')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
