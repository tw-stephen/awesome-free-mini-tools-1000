import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function DiscountCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'percent' | 'amount'>('percent')
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [discountAmount, setDiscountAmount] = useState('')
  const [quantity, setQuantity] = useState('1')

  const quickDiscounts = [10, 15, 20, 25, 30, 50]

  const result = useMemo(() => {
    const price = parseFloat(originalPrice) || 0
    const qty = parseInt(quantity) || 1

    if (price <= 0) return null

    let discount = 0
    let percent = 0

    if (mode === 'percent') {
      percent = parseFloat(discountPercent) || 0
      discount = price * (percent / 100)
    } else {
      discount = parseFloat(discountAmount) || 0
      percent = (discount / price) * 100
    }

    const salePrice = Math.max(0, price - discount)
    const totalSavings = discount * qty
    const totalPrice = salePrice * qty

    return { salePrice, discount, percent, totalSavings, totalPrice }
  }, [mode, originalPrice, discountPercent, discountAmount, quantity])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('percent')}
            className={`flex-1 py-2 rounded text-sm ${
              mode === 'percent' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.discountCalculator.byPercent')}
          </button>
          <button
            onClick={() => setMode('amount')}
            className={`flex-1 py-2 rounded text-sm ${
              mode === 'amount' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.discountCalculator.byAmount')}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.discountCalculator.originalPrice')}
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="100"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          {mode === 'percent' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.discountCalculator.discountPercent')}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {quickDiscounts.map(d => (
                  <button
                    key={d}
                    onClick={() => setDiscountPercent(d.toString())}
                    className={`px-3 py-1 rounded text-sm ${
                      discountPercent === d.toString() ? 'bg-blue-500 text-white' : 'bg-slate-100'
                    }`}
                  >
                    {d}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="20"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.discountCalculator.discountAmount')}
              </label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                placeholder="20"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.discountCalculator.quantity')}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.discountCalculator.salePrice')}</div>
            <div className="text-3xl font-bold text-green-600">
              ${result.salePrice.toFixed(2)}
            </div>
            <div className="text-sm text-red-500 line-through">
              ${parseFloat(originalPrice).toFixed(2)}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-red-50 rounded">
                <div className="text-lg font-bold text-red-600">
                  ${result.discount.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">{t('tools.discountCalculator.youSave')}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">
                  {result.percent.toFixed(0)}%
                </div>
                <div className="text-xs text-slate-500">{t('tools.discountCalculator.off')}</div>
              </div>
            </div>
          </div>

          {parseInt(quantity) > 1 && (
            <div className="card p-4 bg-blue-50">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    ${result.totalPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">{t('tools.discountCalculator.total')}</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    ${result.totalSavings.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">{t('tools.discountCalculator.totalSavings')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
