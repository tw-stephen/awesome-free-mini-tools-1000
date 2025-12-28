import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function StatisticsCalculator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    const numbers = input
      .split(/[,\s\n]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n))

    if (numbers.length === 0) return null

    const n = numbers.length
    const sorted = [...numbers].sort((a, b) => a - b)

    // Mean
    const sum = numbers.reduce((a, b) => a + b, 0)
    const mean = sum / n

    // Median
    const median = n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)]

    // Mode
    const frequency: Record<number, number> = {}
    numbers.forEach(num => frequency[num] = (frequency[num] || 0) + 1)
    const maxFreq = Math.max(...Object.values(frequency))
    const modes = Object.entries(frequency)
      .filter(([_, freq]) => freq === maxFreq)
      .map(([num, _]) => parseFloat(num))

    // Range
    const min = sorted[0]
    const max = sorted[n - 1]
    const range = max - min

    // Variance and Standard Deviation
    const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / n
    const stdDev = Math.sqrt(variance)

    // Sample variance and standard deviation
    const sampleVariance = n > 1 ? numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / (n - 1) : 0
    const sampleStdDev = Math.sqrt(sampleVariance)

    // Quartiles
    const q1 = sorted[Math.floor(n * 0.25)]
    const q3 = sorted[Math.floor(n * 0.75)]
    const iqr = q3 - q1

    return {
      n,
      sum,
      mean,
      median,
      modes,
      min,
      max,
      range,
      variance,
      stdDev,
      sampleVariance,
      sampleStdDev,
      q1,
      q3,
      iqr,
    }
  }, [input])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t('tools.statisticsCalculator.enterData')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.statisticsCalculator.placeholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono resize-none"
          rows={4}
        />
        <p className="text-xs text-slate-500 mt-1">
          {t('tools.statisticsCalculator.hint')}
        </p>
      </div>

      {result && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.statisticsCalculator.centralTendency')}
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{result.mean.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.statisticsCalculator.mean')}</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{result.median.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.statisticsCalculator.median')}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">
                  {result.modes.length <= 3 ? result.modes.join(', ') : 'Multiple'}
                </div>
                <div className="text-xs text-slate-500">{t('tools.statisticsCalculator.mode')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.statisticsCalculator.dispersion')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded text-center">
                <div className="text-xl font-bold text-slate-700">{result.range.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.statisticsCalculator.range')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded text-center">
                <div className="text-xl font-bold text-slate-700">{result.stdDev.toFixed(4)}</div>
                <div className="text-xs text-slate-500">{t('tools.statisticsCalculator.stdDev')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded text-center">
                <div className="text-xl font-bold text-slate-700">{result.variance.toFixed(4)}</div>
                <div className="text-xs text-slate-500">{t('tools.statisticsCalculator.variance')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded text-center">
                <div className="text-xl font-bold text-slate-700">{result.iqr.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.statisticsCalculator.iqr')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.statisticsCalculator.summary')}
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.statisticsCalculator.count')}</span>
                <span>{result.n}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.statisticsCalculator.sum')}</span>
                <span>{result.sum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.statisticsCalculator.minimum')}</span>
                <span>{result.min}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.statisticsCalculator.maximum')}</span>
                <span>{result.max}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.statisticsCalculator.q1')}</span>
                <span>{result.q1.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.statisticsCalculator.q3')}</span>
                <span>{result.q3.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.statisticsCalculator.sampleStats')}
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.statisticsCalculator.sampleVariance')}</span>
                <span>{result.sampleVariance.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.statisticsCalculator.sampleStdDev')}</span>
                <span>{result.sampleStdDev.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
