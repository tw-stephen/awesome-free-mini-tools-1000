import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function StatisticsCalc() {
  const { t } = useTranslation()
  const [input, setInput] = useState('1, 2, 3, 4, 5, 6, 7, 8, 9, 10')
  const [results, setResults] = useState<Record<string, number | string> | null>(null)

  const parseNumbers = (text: string): number[] => {
    return text
      .split(/[,\s\n]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n))
  }

  const calculate = () => {
    const numbers = parseNumbers(input)
    if (numbers.length === 0) {
      setResults(null)
      return
    }

    const sorted = [...numbers].sort((a, b) => a - b)
    const n = numbers.length
    const sum = numbers.reduce((a, b) => a + b, 0)
    const mean = sum / n

    // Median
    const median = n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)]

    // Mode
    const frequency: Record<number, number> = {}
    numbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1
    })
    const maxFreq = Math.max(...Object.values(frequency))
    const modes = Object.entries(frequency)
      .filter(([_, freq]) => freq === maxFreq)
      .map(([num]) => parseFloat(num))

    // Variance and Standard Deviation
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / n
    const sampleVariance = n > 1 ? numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / (n - 1) : 0
    const stdDev = Math.sqrt(variance)
    const sampleStdDev = Math.sqrt(sampleVariance)

    // Range
    const min = sorted[0]
    const max = sorted[n - 1]
    const range = max - min

    // Quartiles
    const q1Index = (n - 1) * 0.25
    const q3Index = (n - 1) * 0.75
    const q1 = sorted[Math.floor(q1Index)] + (q1Index % 1) * (sorted[Math.ceil(q1Index)] - sorted[Math.floor(q1Index)])
    const q3 = sorted[Math.floor(q3Index)] + (q3Index % 1) * (sorted[Math.ceil(q3Index)] - sorted[Math.floor(q3Index)])
    const iqr = q3 - q1

    // Standard Error
    const standardError = sampleStdDev / Math.sqrt(n)

    // Coefficient of Variation
    const cv = (stdDev / mean) * 100

    setResults({
      count: n,
      sum: parseFloat(sum.toFixed(6)),
      mean: parseFloat(mean.toFixed(6)),
      median: parseFloat(median.toFixed(6)),
      mode: modes.length === n ? t('tools.statisticsCalc.noMode') : modes.join(', '),
      min: parseFloat(min.toFixed(6)),
      max: parseFloat(max.toFixed(6)),
      range: parseFloat(range.toFixed(6)),
      variance: parseFloat(variance.toFixed(6)),
      sampleVariance: parseFloat(sampleVariance.toFixed(6)),
      stdDev: parseFloat(stdDev.toFixed(6)),
      sampleStdDev: parseFloat(sampleStdDev.toFixed(6)),
      standardError: parseFloat(standardError.toFixed(6)),
      q1: parseFloat(q1.toFixed(6)),
      q3: parseFloat(q3.toFixed(6)),
      iqr: parseFloat(iqr.toFixed(6)),
      cv: parseFloat(cv.toFixed(2)) + '%',
    })
  }

  const labels: Record<string, string> = {
    count: t('tools.statisticsCalc.count'),
    sum: t('tools.statisticsCalc.sum'),
    mean: t('tools.statisticsCalc.mean'),
    median: t('tools.statisticsCalc.median'),
    mode: t('tools.statisticsCalc.mode'),
    min: t('tools.statisticsCalc.min'),
    max: t('tools.statisticsCalc.max'),
    range: t('tools.statisticsCalc.range'),
    variance: t('tools.statisticsCalc.variance'),
    sampleVariance: t('tools.statisticsCalc.sampleVariance'),
    stdDev: t('tools.statisticsCalc.stdDev'),
    sampleStdDev: t('tools.statisticsCalc.sampleStdDev'),
    standardError: t('tools.statisticsCalc.standardError'),
    q1: t('tools.statisticsCalc.q1'),
    q3: t('tools.statisticsCalc.q3'),
    iqr: t('tools.statisticsCalc.iqr'),
    cv: t('tools.statisticsCalc.cv'),
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.statisticsCalc.inputLabel')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.statisticsCalc.inputPlaceholder')}
          className="w-full h-32 px-3 py-2 border border-slate-300 rounded font-mono text-sm"
        />
        <p className="text-xs text-slate-500 mt-1">
          {t('tools.statisticsCalc.inputHint')}
        </p>
      </div>

      <button
        onClick={calculate}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t('tools.statisticsCalc.calculate')}
      </button>

      {results && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.statisticsCalc.results')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="p-2 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">{labels[key]}</div>
                <div className="font-mono text-sm font-medium">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.statisticsCalc.definitions')}</h3>
        <div className="text-sm text-slate-600 space-y-1">
          <p><strong>{t('tools.statisticsCalc.mean')}:</strong> {t('tools.statisticsCalc.meanDef')}</p>
          <p><strong>{t('tools.statisticsCalc.median')}:</strong> {t('tools.statisticsCalc.medianDef')}</p>
          <p><strong>{t('tools.statisticsCalc.mode')}:</strong> {t('tools.statisticsCalc.modeDef')}</p>
          <p><strong>{t('tools.statisticsCalc.stdDev')}:</strong> {t('tools.statisticsCalc.stdDevDef')}</p>
        </div>
      </div>
    </div>
  )
}
