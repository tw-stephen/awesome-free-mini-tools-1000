import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.5 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', rate: 31.5 },
  { code: 'KRW', name: 'Korean Won', symbol: '₩', rate: 1320 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.88 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 35.5 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.72 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rate: 55.8 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.2 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 24500 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 15800 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', rate: 17.2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.65 },
]

interface QuickAmount {
  amount: number
  label: string
}

export default function CurrencyConverterTravel() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState<number>(100)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrencies, setToCurrencies] = useState(['EUR', 'JPY', 'TWD', 'CNY'])
  const [favorites, setFavorites] = useState<string[]>(['USD', 'EUR', 'JPY', 'TWD'])

  const quickAmounts: QuickAmount[] = [
    { amount: 1, label: '1' },
    { amount: 10, label: '10' },
    { amount: 50, label: '50' },
    { amount: 100, label: '100' },
    { amount: 500, label: '500' },
    { amount: 1000, label: '1K' },
  ]

  const convert = (toCode: string) => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1
    const toRate = currencies.find(c => c.code === toCode)?.rate || 1
    const usdAmount = amount / fromRate
    return (usdAmount * toRate).toFixed(2)
  }

  const formatCurrency = (amount: string, code: string) => {
    const currency = currencies.find(c => c.code === code)
    return `${currency?.symbol || ''}${parseFloat(amount).toLocaleString()}`
  }

  const addToCurrency = (code: string) => {
    if (!toCurrencies.includes(code)) {
      setToCurrencies([...toCurrencies, code])
    }
  }

  const removeToCurrency = (code: string) => {
    setToCurrencies(toCurrencies.filter(c => c !== code))
  }

  const toggleFavorite = (code: string) => {
    if (favorites.includes(code)) {
      setFavorites(favorites.filter(f => f !== code))
    } else {
      setFavorites([...favorites, code])
    }
  }

  const swapCurrencies = (toCode: string) => {
    const newFrom = toCode
    setFromCurrency(newFrom)
    setToCurrencies(toCurrencies.filter(c => c !== toCode).concat(fromCurrency))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.currencyConverterTravel.amount')}</h3>
        <div className="flex gap-3">
          <select
            value={fromCurrency}
            onChange={e => setFromCurrency(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value) || 0)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-xl font-bold text-right"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {quickAmounts.map(q => (
            <button
              key={q.amount}
              onClick={() => setAmount(q.amount)}
              className={`px-3 py-1 rounded-full text-sm ${
                amount === q.amount ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.currencyConverterTravel.addCurrency')}</h3>
        <select
          onChange={e => {
            addToCurrency(e.target.value)
            e.target.value = ''
          }}
          className="w-full px-3 py-2 border border-slate-300 rounded"
          defaultValue=""
        >
          <option value="" disabled>{t('tools.currencyConverterTravel.selectCurrency')}</option>
          {currencies.filter(c => !toCurrencies.includes(c.code) && c.code !== fromCurrency).map(c => (
            <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
          ))}
        </select>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.currencyConverterTravel.conversions')}</h3>
        <div className="space-y-3">
          {toCurrencies.map(code => {
            const currency = currencies.find(c => c.code === code)
            if (!currency) return null
            const converted = convert(code)
            return (
              <div key={code} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleFavorite(code)}
                    className={favorites.includes(code) ? 'text-yellow-500' : 'text-slate-300'}
                  >
                    ★
                  </button>
                  <div>
                    <div className="font-medium">{currency.name}</div>
                    <div className="text-xs text-slate-500">{code}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(converted, code)}
                  </span>
                  <button
                    onClick={() => swapCurrencies(code)}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                    title="Swap"
                  >
                    ⇄
                  </button>
                  <button
                    onClick={() => removeToCurrency(code)}
                    className="text-red-400 hover:text-red-600"
                  >
                    x
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.currencyConverterTravel.favorites')}</h3>
        <div className="flex flex-wrap gap-2">
          {favorites.map(code => {
            const currency = currencies.find(c => c.code === code)
            if (!currency) return null
            return (
              <button
                key={code}
                onClick={() => {
                  if (code !== fromCurrency) addToCurrency(code)
                }}
                className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-full text-sm"
              >
                {currency.symbol} {code}
              </button>
            )
          })}
        </div>
      </div>

      <div className="text-xs text-slate-500 text-center">
        {t('tools.currencyConverterTravel.disclaimer')}
      </div>
    </div>
  )
}
