import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.24,
  TWD: 31.50,
  KRW: 1320,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  HKD: 7.82,
  SGD: 1.34,
  INR: 83.12,
  MXN: 17.15,
  BRL: 4.97,
}

export default function CurrencyConverter() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')

  const currencies = Object.keys(exchangeRates)

  const converted = useMemo(() => {
    const value = parseFloat(amount)
    if (isNaN(value) || value <= 0) return null

    const inUSD = value / exchangeRates[fromCurrency]
    const result = inUSD * exchangeRates[toCurrency]
    return result
  }, [amount, fromCurrency, toCurrency])

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.currencyConverter.amount')}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.currencyConverter.from')}
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swapCurrencies}
            className="mt-6 p-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            ⇄
          </button>

          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.currencyConverter.to')}
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {converted !== null && (
          <div className="p-4 bg-blue-50 rounded text-center">
            <div className="text-sm text-slate-600">
              {amount} {fromCurrency} =
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {converted.toFixed(2)} {toCurrency}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}
            </div>
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.currencyConverter.rates')}
        </h3>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {currencies.slice(0, 9).map(c => (
            <div key={c} className="p-2 bg-slate-50 rounded text-center">
              <div className="font-medium">{c}</div>
              <div className="text-xs text-slate-500">{exchangeRates[c]}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          {t('tools.currencyConverter.offlineNote')}
        </p>
      </div>
    </div>
  )
}
