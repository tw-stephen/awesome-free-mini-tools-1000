import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface Currency {
  code: string
  name: string
  symbol: string
  rate: number // Rate to USD
}

export default function CurrencyConverter() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('100')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const { copy, copied } = useClipboard()

  // Static exchange rates (for offline use - real app would fetch from API)
  const currencies: Currency[] = [
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
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.2 },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 17.15 },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 4.97 },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 89.5 },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 35.2 },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 24500 },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rate: 55.8 },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 15700 },
  ]

  const getCurrency = (code: string): Currency | undefined => {
    return currencies.find((c) => c.code === code)
  }

  const convert = useCallback(
    (value: number, from: string, to: string): number => {
      const fromCurr = getCurrency(from)
      const toCurr = getCurrency(to)
      if (!fromCurr || !toCurr) return 0

      // Convert to USD first, then to target currency
      const usd = value / fromCurr.rate
      return usd * toCurr.rate
    },
    []
  )

  const formatCurrency = (value: number, currencyCode: string): string => {
    const curr = getCurrency(currencyCode)
    if (!curr) return value.toFixed(2)

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: currencyCode === 'JPY' || currencyCode === 'KRW' ? 0 : 2,
    }).format(value)
  }

  const numAmount = parseFloat(amount) || 0
  const convertedAmount = convert(numAmount, fromCurrency, toCurrency)

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  const fromCurr = getCurrency(fromCurrency)
  const toCurr = getCurrency(toCurrency)

  return (
    <div className="space-y-4">
      <div className="card p-4 bg-yellow-50 border border-yellow-200">
        <p className="text-sm text-yellow-700">
          {t('tools.currencyConverter.rateNote')}
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.currencyConverter.convert')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.currencyConverter.amount')}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-lg"
            />
          </div>

          <div className="grid grid-cols-5 gap-4 items-end">
            <div className="col-span-2">
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.currencyConverter.from')}
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <Button variant="secondary" onClick={swapCurrencies}>
                ⇄
              </Button>
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.currencyConverter.to')}
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 bg-blue-50 border border-blue-200">
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-2">
            {fromCurr?.symbol}
            {formatCurrency(numAmount, fromCurrency)} {fromCurrency} =
          </p>
          <p className="text-3xl font-bold text-blue-600">
            {toCurr?.symbol}
            {formatCurrency(convertedAmount, toCurrency)} {toCurrency}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            1 {fromCurrency} = {formatCurrency(convert(1, fromCurrency, toCurrency), toCurrency)}{' '}
            {toCurrency}
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            variant="secondary"
            onClick={() =>
              copy(`${toCurr?.symbol}${formatCurrency(convertedAmount, toCurrency)} ${toCurrency}`)
            }
          >
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.currencyConverter.quickConvert')}
        </h3>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {currencies
            .filter((c) => c.code !== fromCurrency)
            .slice(0, 8)
            .map((curr) => {
              const converted = convert(numAmount, fromCurrency, curr.code)
              return (
                <div
                  key={curr.code}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
                  onClick={() => setToCurrency(curr.code)}
                >
                  <span className="text-slate-600">{curr.code}</span>
                  <span className="font-mono text-slate-800">
                    {curr.symbol}
                    {formatCurrency(converted, curr.code)}
                  </span>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
