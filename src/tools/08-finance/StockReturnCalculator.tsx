import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function StockReturnCalculator() {
  const { t } = useTranslation()
  const [buyPrice, setBuyPrice] = useState('')
  const [sellPrice, setSellPrice] = useState('')
  const [shares, setShares] = useState('')
  const [dividendsReceived, setDividendsReceived] = useState('')
  const [holdingPeriodYears, setHoldingPeriodYears] = useState('')
  const [buyCommission, setBuyCommission] = useState('')
  const [sellCommission, setSellCommission] = useState('')

  const result = useMemo(() => {
    const buy = parseFloat(buyPrice) || 0
    const sell = parseFloat(sellPrice) || 0
    const qty = parseFloat(shares) || 0
    const dividends = parseFloat(dividendsReceived) || 0
    const years = parseFloat(holdingPeriodYears) || 1
    const buyFee = parseFloat(buyCommission) || 0
    const sellFee = parseFloat(sellCommission) || 0

    if (buy <= 0 || qty <= 0) return null

    const totalBuyCost = (buy * qty) + buyFee
    const totalSellValue = (sell * qty) - sellFee
    const capitalGain = totalSellValue - totalBuyCost
    const totalReturn = capitalGain + dividends
    const totalReturnPercent = (totalReturn / totalBuyCost) * 100
    const annualizedReturn = (Math.pow(1 + totalReturn / totalBuyCost, 1 / years) - 1) * 100

    const priceChange = sell - buy
    const priceChangePercent = (priceChange / buy) * 100

    return {
      totalBuyCost,
      totalSellValue,
      capitalGain,
      totalReturn,
      totalReturnPercent,
      annualizedReturn,
      priceChange,
      priceChangePercent,
      isProfit: totalReturn >= 0,
    }
  }, [buyPrice, sellPrice, shares, dividendsReceived, holdingPeriodYears, buyCommission, sellCommission])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.stockReturnCalculator.buyPrice')}
            </label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="100"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.stockReturnCalculator.sellPrice')}
            </label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="150"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.stockReturnCalculator.shares')}
          </label>
          <input
            type="number"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            placeholder="100"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.stockReturnCalculator.dividends')}
            </label>
            <input
              type="number"
              value={dividendsReceived}
              onChange={(e) => setDividendsReceived(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.stockReturnCalculator.holdingYears')}
            </label>
            <input
              type="number"
              value={holdingPeriodYears}
              onChange={(e) => setHoldingPeriodYears(e.target.value)}
              placeholder="1"
              step="0.1"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.stockReturnCalculator.buyCommission')}
            </label>
            <input
              type="number"
              value={buyCommission}
              onChange={(e) => setBuyCommission(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.stockReturnCalculator.sellCommission')}
            </label>
            <input
              type="number"
              value={sellCommission}
              onChange={(e) => setSellCommission(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className={`card p-4 text-center ${result.isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-sm text-slate-600">{t('tools.stockReturnCalculator.totalReturn')}</div>
            <div className={`text-3xl font-bold ${result.isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {result.isProfit ? '+' : ''}${result.totalReturn.toFixed(2)}
            </div>
            <div className={`text-sm ${result.isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {result.isProfit ? '+' : ''}{result.totalReturnPercent.toFixed(2)}%
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className={`text-lg font-bold ${result.capitalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.capitalGain >= 0 ? '+' : ''}${result.capitalGain.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">{t('tools.stockReturnCalculator.capitalGain')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-blue-600">
                  {result.annualizedReturn.toFixed(2)}%
                </div>
                <div className="text-xs text-slate-500">{t('tools.stockReturnCalculator.annualized')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('tools.stockReturnCalculator.totalCost')}</span>
                <span className="font-medium">${result.totalBuyCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tools.stockReturnCalculator.saleProceeds')}</span>
                <span className="font-medium">${result.totalSellValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tools.stockReturnCalculator.priceChange')}</span>
                <span className={`font-medium ${result.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${result.priceChange.toFixed(2)} ({result.priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
