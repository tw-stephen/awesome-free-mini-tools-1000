import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function StandardDeviationCalc() {
  const { t } = useTranslation()
  const [input, setInput] = useState('10, 12, 23, 23, 16, 23, 21, 16')
  const [isSample, setIsSample] = useState(true)
  const [results, setResults] = useState<{
    mean: number
    variance: number
    stdDev: number
    deviations: { value: number; deviation: number; squared: number }[]
  } | null>(null)

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

    const n = numbers.length
    const mean = numbers.reduce((a, b) => a + b, 0) / n

    const deviations = numbers.map(value => {
      const deviation = value - mean
      return {
        value,
        deviation,
        squared: deviation * deviation
      }
    })

    const sumSquaredDeviations = deviations.reduce((sum, d) => sum + d.squared, 0)
    const divisor = isSample ? n - 1 : n
    const variance = sumSquaredDeviations / divisor
    const stdDev = Math.sqrt(variance)

    setResults({
      mean,
      variance,
      stdDev,
      deviations
    })
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.standardDeviationCalc.inputLabel')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.standardDeviationCalc.inputPlaceholder')}
          className="w-full h-24 px-3 py-2 border border-slate-300 rounded font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <label className="text-sm font-medium mb-2 block">
          {t('tools.standardDeviationCalc.type')}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setIsSample(true)}
            className={`flex-1 py-2 rounded ${
              isSample ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.standardDeviationCalc.sample')} (n-1)
          </button>
          <button
            onClick={() => setIsSample(false)}
            className={`flex-1 py-2 rounded ${
              !isSample ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.standardDeviationCalc.population')} (n)
          </button>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t('tools.standardDeviationCalc.calculate')}
      </button>

      {results && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="card p-3 text-center">
              <div className="text-sm text-slate-500">{t('tools.standardDeviationCalc.mean')}</div>
              <div className="text-xl font-bold text-blue-600">
                {results.mean.toFixed(4)}
              </div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-sm text-slate-500">{t('tools.standardDeviationCalc.variance')}</div>
              <div className="text-xl font-bold text-green-600">
                {results.variance.toFixed(4)}
              </div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-sm text-slate-500">{t('tools.standardDeviationCalc.stdDev')}</div>
              <div className="text-xl font-bold text-purple-600">
                {results.stdDev.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.standardDeviationCalc.stepByStep')}</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">{t('tools.standardDeviationCalc.value')}</th>
                    <th className="text-center py-2 px-2">x - x_bar</th>
                    <th className="text-center py-2 px-2">(x - x_bar)^2</th>
                  </tr>
                </thead>
                <tbody>
                  {results.deviations.map((d, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2 px-2">{d.value}</td>
                      <td className="text-center py-2 px-2">{d.deviation.toFixed(4)}</td>
                      <td className="text-center py-2 px-2">{d.squared.toFixed(4)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-slate-50">
                    <td className="py-2 px-2">{t('tools.standardDeviationCalc.sum')}</td>
                    <td className="text-center py-2 px-2">-</td>
                    <td className="text-center py-2 px-2">
                      {results.deviations.reduce((sum, d) => sum + d.squared, 0).toFixed(4)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-4 bg-blue-50">
            <h3 className="font-medium mb-2">{t('tools.standardDeviationCalc.formula')}</h3>
            <div className="text-sm font-mono">
              <p>{isSample ? 's' : 'sigma'} = sqrt( sum((x - x_bar)^2) / {isSample ? '(n-1)' : 'n'} )</p>
              <p className="mt-2">
                = sqrt( {results.deviations.reduce((sum, d) => sum + d.squared, 0).toFixed(4)} / {isSample ? results.deviations.length - 1 : results.deviations.length} )
              </p>
              <p className="mt-1">
                = sqrt( {results.variance.toFixed(4)} )
              </p>
              <p className="mt-1">
                = {results.stdDev.toFixed(4)}
              </p>
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-slate-50">
        <h3 className="font-medium mb-2">{t('tools.standardDeviationCalc.explanation')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.standardDeviationCalc.explanationText')}
        </p>
      </div>
    </div>
  )
}
