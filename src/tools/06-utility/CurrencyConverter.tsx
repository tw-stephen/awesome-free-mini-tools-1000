import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function CurrencyConverter() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')

  // Static exchange rates (in production, use an API)
  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CNY: 7.24,
    TWD: 31.50,
    KRW: 1320.00,
    HKD: 7.82,
    SGD: 1.34,
    AUD: 1.53,
    CAD: 1.36,
    CHF: 0.88,
    INR: 83.12,
    MXN: 17.15,
    BRL: 4.97,
    RUB: 89.50,
    ZAR: 18.75,
    THB: 35.50,
    PHP: 56.20,
    VND: 24500,
  }

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  ]

  const result = useMemo(() => {
    const val = parseFloat(amount)
    if (isNaN(val) || val <= 0) return null

    const usdAmount = val / rates[fromCurrency]
    const converted = usdAmount * rates[toCurrency]
    const rate = rates[toCurrency] / rates[fromCurrency]

    return {
      converted: converted.toFixed(2),
      rate: rate.toFixed(6),
    }
  }, [amount, fromCurrency, toCurrency])

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || ''
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.currencyConverter.amount')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {getCurrencySymbol(fromCurrency)}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.currencyConverter.from')}
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapCurrencies}
              className="mt-5 p-2 bg-slate-200 rounded-full hover:bg-slate-300"
            >
              ⇄
            </button>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.currencyConverter.to')}
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="card p-4">
          <div className="text-center">
            <div className="text-sm text-slate-500 mb-1">
              {getCurrencySymbol(fromCurrency)}{parseFloat(amount).toLocaleString()} {fromCurrency} =
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {getCurrencySymbol(toCurrency)}{parseFloat(result.converted).toLocaleString()} {toCurrency}
            </div>
            <div className="text-sm text-slate-500 mt-2">
              1 {fromCurrency} = {result.rate} {toCurrency}
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.currencyConverter.popularRates')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {['EUR', 'GBP', 'JPY', 'CNY', 'TWD', 'KRW'].map((code) => {
            const rate = rates[code]
            return (
              <div key={code} className="p-2 bg-slate-50 rounded text-sm">
                <span className="text-slate-600">1 USD</span>
                <span className="text-slate-400"> = </span>
                <span className="font-medium">{rate.toLocaleString()} {code}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.currencyConverter.quickConvert')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[100, 500, 1000, 5000, 10000].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(String(val))}
              className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {val.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-yellow-50">
        <p className="text-sm text-yellow-700">
          {t('tools.currencyConverter.disclaimer')}
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.currencyConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.currencyConverter.tip1')}</li>
          <li>{t('tools.currencyConverter.tip2')}</li>
          <li>{t('tools.currencyConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
