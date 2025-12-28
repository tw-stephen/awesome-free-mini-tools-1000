import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface MonthData {
  month: string
  actual: number
  forecast: number
}

export default function SalesForecaster() {
  const { t } = useTranslation()
  const [method, setMethod] = useState<'linear' | 'moving' | 'growth'>('linear')
  const [historicalData, setHistoricalData] = useState<MonthData[]>([
    { month: '2024-01', actual: 0, forecast: 0 },
    { month: '2024-02', actual: 0, forecast: 0 },
    { month: '2024-03', actual: 0, forecast: 0 },
  ])
  const [forecastMonths, setForecastMonths] = useState(3)
  const [growthRate, setGrowthRate] = useState(5)

  const addMonth = () => {
    const lastMonth = historicalData[historicalData.length - 1]?.month || '2024-01'
    const [year, month] = lastMonth.split('-').map(Number)
    const nextMonth = month === 12 ? `${year + 1}-01` : `${year}-${(month + 1).toString().padStart(2, '0')}`
    setHistoricalData([...historicalData, { month: nextMonth, actual: 0, forecast: 0 }])
  }

  const updateMonth = (index: number, actual: number) => {
    setHistoricalData(historicalData.map((m, i) => i === index ? { ...m, actual } : m))
  }

  const removeMonth = (index: number) => {
    if (historicalData.length > 1) {
      setHistoricalData(historicalData.filter((_, i) => i !== index))
    }
  }

  const calculateForecast = (): MonthData[] => {
    const actuals = historicalData.map(m => m.actual).filter(a => a > 0)
    if (actuals.length === 0) return []

    const lastMonth = historicalData[historicalData.length - 1]?.month || '2024-01'
    const forecasts: MonthData[] = []

    for (let i = 1; i <= forecastMonths; i++) {
      const [year, month] = lastMonth.split('-').map(Number)
      const totalMonths = year * 12 + month + i
      const newYear = Math.floor((totalMonths - 1) / 12)
      const newMonth = ((totalMonths - 1) % 12) + 1
      const monthStr = `${newYear}-${newMonth.toString().padStart(2, '0')}`

      let forecastValue = 0

      if (method === 'linear') {
        // Simple linear regression
        const n = actuals.length
        const sumX = (n * (n + 1)) / 2
        const sumY = actuals.reduce((a, b) => a + b, 0)
        const sumXY = actuals.reduce((sum, y, i) => sum + (i + 1) * y, 0)
        const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
        const intercept = (sumY - slope * sumX) / n

        forecastValue = intercept + slope * (n + i)
      } else if (method === 'moving') {
        // Moving average (last 3 months)
        const window = actuals.slice(-3)
        forecastValue = window.reduce((a, b) => a + b, 0) / window.length
      } else if (method === 'growth') {
        // Growth rate based
        const lastActual = actuals[actuals.length - 1]
        forecastValue = lastActual * Math.pow(1 + growthRate / 100, i)
      }

      forecasts.push({ month: monthStr, actual: 0, forecast: Math.max(0, Math.round(forecastValue)) })
    }

    return forecasts
  }

  const forecasts = calculateForecast()
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
  }

  const totalActual = historicalData.reduce((sum, m) => sum + m.actual, 0)
  const totalForecast = forecasts.reduce((sum, m) => sum + m.forecast, 0)
  const avgActual = historicalData.filter(m => m.actual > 0).length > 0
    ? totalActual / historicalData.filter(m => m.actual > 0).length
    : 0

  const maxValue = Math.max(
    ...historicalData.map(m => m.actual),
    ...forecasts.map(m => m.forecast),
    1
  )

  const generateReport = (): string => {
    let doc = `SALES FORECAST REPORT\n${'═'.repeat(50)}\n\n`
    doc += `Method: ${method === 'linear' ? 'Linear Regression' : method === 'moving' ? 'Moving Average' : 'Growth Rate'}\n`
    if (method === 'growth') doc += `Growth Rate: ${growthRate}%\n`
    doc += '\n'

    doc += `HISTORICAL DATA\n${'─'.repeat(40)}\n`
    historicalData.forEach(m => {
      doc += `${m.month}: ${formatCurrency(m.actual)}\n`
    })
    doc += `Total: ${formatCurrency(totalActual)}\n`
    doc += `Average: ${formatCurrency(avgActual)}\n\n`

    doc += `FORECAST\n${'─'.repeat(40)}\n`
    forecasts.forEach(m => {
      doc += `${m.month}: ${formatCurrency(m.forecast)}\n`
    })
    doc += `Total Forecasted: ${formatCurrency(totalForecast)}\n`

    return doc
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.salesForecaster.method')}</h3>
        <div className="flex gap-2">
          <button onClick={() => setMethod('linear')} className={`flex-1 py-2 rounded text-sm ${method === 'linear' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Linear Regression</button>
          <button onClick={() => setMethod('moving')} className={`flex-1 py-2 rounded text-sm ${method === 'moving' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Moving Average</button>
          <button onClick={() => setMethod('growth')} className={`flex-1 py-2 rounded text-sm ${method === 'growth' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Growth Rate</button>
        </div>
        {method === 'growth' && (
          <div className="mt-3">
            <label className="text-sm text-slate-500">Monthly Growth Rate (%)</label>
            <input type="number" value={growthRate} onChange={(e) => setGrowthRate(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded" />
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.salesForecaster.historical')}</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500">Forecast:</label>
            <select value={forecastMonths} onChange={(e) => setForecastMonths(Number(e.target.value))} className="px-2 py-1 border border-slate-300 rounded text-sm">
              {[1, 3, 6, 12].map(n => (
                <option key={n} value={n}>{n} month{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          {historicalData.map((month, index) => (
            <div key={month.month} className="flex items-center gap-2">
              <span className="text-sm text-slate-500 w-20">{month.month}</span>
              <input
                type="number"
                value={month.actual}
                onChange={(e) => updateMonth(index, Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
                min="0"
                placeholder="Sales amount"
              />
              <button onClick={() => removeMonth(index)} disabled={historicalData.length === 1} className="text-red-400 hover:text-red-600 disabled:opacity-30">×</button>
            </div>
          ))}
        </div>
        <button onClick={addMonth} className="mt-3 text-blue-500 hover:text-blue-600 text-sm">+ Add Month</button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.salesForecaster.chart')}</h3>
        <div className="h-48 flex items-end gap-1">
          {historicalData.map((month, index) => (
            <div key={`h-${index}`} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-400 rounded-t" style={{ height: `${(month.actual / maxValue) * 100}%`, minHeight: month.actual > 0 ? '4px' : '0' }} title={formatCurrency(month.actual)} />
              <span className="text-xs text-slate-500 mt-1 transform -rotate-45 origin-left">{month.month.slice(5)}</span>
            </div>
          ))}
          {forecasts.map((month, index) => (
            <div key={`f-${index}`} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-400 rounded-t border-2 border-dashed border-green-600" style={{ height: `${(month.forecast / maxValue) * 100}%`, minHeight: month.forecast > 0 ? '4px' : '0' }} title={formatCurrency(month.forecast)} />
              <span className="text-xs text-slate-500 mt-1 transform -rotate-45 origin-left">{month.month.slice(5)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded" /> Historical</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 border-2 border-dashed border-green-600 rounded" /> Forecast</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-sm text-slate-500">Avg Monthly Sales</div>
          <div className="text-xl font-bold text-blue-600">{formatCurrency(avgActual)}</div>
        </div>
        <div className="card p-4 text-center bg-green-50">
          <div className="text-sm text-slate-500">Forecasted Total</div>
          <div className="text-xl font-bold text-green-600">{formatCurrency(totalForecast)}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-sm text-slate-500">Forecast Months</div>
          <div className="text-xl font-bold">{forecastMonths}</div>
        </div>
      </div>

      {forecasts.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.salesForecaster.forecast')}</h3>
          <div className="space-y-2">
            {forecasts.map(month => (
              <div key={month.month} className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm">{month.month}</span>
                <span className="font-medium text-green-600">{formatCurrency(month.forecast)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={copyReport} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
        {t('tools.salesForecaster.export')}
      </button>
    </div>
  )
}
