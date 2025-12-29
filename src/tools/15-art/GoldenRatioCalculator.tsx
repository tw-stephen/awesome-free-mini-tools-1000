import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const PHI = 1.618033988749895

export default function GoldenRatioCalculator() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(100)
  const [inputType, setInputType] = useState<'larger' | 'smaller' | 'total'>('larger')

  const calculate = () => {
    let larger: number, smaller: number, total: number

    switch (inputType) {
      case 'larger':
        larger = inputValue
        smaller = larger / PHI
        total = larger + smaller
        break
      case 'smaller':
        smaller = inputValue
        larger = smaller * PHI
        total = larger + smaller
        break
      case 'total':
        total = inputValue
        larger = total / (1 + 1 / PHI)
        smaller = total - larger
        break
      default:
        larger = 100
        smaller = 100 / PHI
        total = 100 + 100 / PHI
    }

    return {
      larger: Math.round(larger * 100) / 100,
      smaller: Math.round(smaller * 100) / 100,
      total: Math.round(total * 100) / 100,
      ratio: PHI
    }
  }

  const result = calculate()

  const copyValue = (value: number) => {
    navigator.clipboard.writeText(value.toString())
  }

  // Generate Fibonacci-like sequence using golden ratio
  const generateSequence = (start: number, count: number): number[] => {
    const sequence = [start]
    for (let i = 1; i < count; i++) {
      sequence.push(Math.round(sequence[i - 1] * PHI * 100) / 100)
    }
    return sequence
  }

  const sequence = generateSequence(result.smaller, 8)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-blue-600">
            {PHI.toFixed(6)}
          </div>
          <div className="text-sm text-slate-500">{t('tools.goldenRatioCalculator.phi')}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {(['larger', 'smaller', 'total'] as const).map(type => (
            <button
              key={type}
              onClick={() => setInputType(type)}
              className={`py-2 rounded capitalize ${
                inputType === type ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t(`tools.goldenRatioCalculator.${type}`)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-lg"
            placeholder={t(`tools.goldenRatioCalculator.enter${inputType.charAt(0).toUpperCase() + inputType.slice(1)}`)}
          />
        </div>
      </div>

      {/* Results */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.goldenRatioCalculator.results')}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
            <div>
              <div className="text-sm text-slate-500">{t('tools.goldenRatioCalculator.larger')}</div>
              <div className="text-2xl font-bold text-blue-600">{result.larger}</div>
            </div>
            <button
              onClick={() => copyValue(result.larger)}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              {t('tools.goldenRatioCalculator.copy')}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
            <div>
              <div className="text-sm text-slate-500">{t('tools.goldenRatioCalculator.smaller')}</div>
              <div className="text-2xl font-bold text-green-600">{result.smaller}</div>
            </div>
            <button
              onClick={() => copyValue(result.smaller)}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              {t('tools.goldenRatioCalculator.copy')}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
            <div>
              <div className="text-sm text-slate-500">{t('tools.goldenRatioCalculator.total')}</div>
              <div className="text-2xl font-bold text-purple-600">{result.total}</div>
            </div>
            <button
              onClick={() => copyValue(result.total)}
              className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
            >
              {t('tools.goldenRatioCalculator.copy')}
            </button>
          </div>
        </div>
      </div>

      {/* Visual representation */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.goldenRatioCalculator.visualization')}</h3>
        <div className="flex h-24 rounded overflow-hidden">
          <div
            className="bg-blue-500 flex items-center justify-center text-white font-medium"
            style={{ width: `${(result.larger / result.total) * 100}%` }}
          >
            {result.larger}
          </div>
          <div
            className="bg-green-500 flex items-center justify-center text-white font-medium"
            style={{ width: `${(result.smaller / result.total) * 100}%` }}
          >
            {result.smaller}
          </div>
        </div>
        <div className="text-center text-sm text-slate-500 mt-2">
          {t('tools.goldenRatioCalculator.totalLabel')}: {result.total}
        </div>
      </div>

      {/* Golden spiral approximation */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.goldenRatioCalculator.goldenSpiral')}</h3>
        <div className="relative w-64 h-40 mx-auto bg-slate-100 rounded overflow-hidden">
          <svg viewBox="0 0 160 100" className="w-full h-full">
            {/* Golden rectangles */}
            <rect x="0" y="0" width="100" height="100" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
            <rect x="0" y="0" width="61.8" height="61.8" fill="none" stroke="#22C55E" strokeWidth="0.5" />
            <rect x="0" y="0" width="38.2" height="38.2" fill="none" stroke="#A855F7" strokeWidth="0.5" />
            <rect x="0" y="0" width="23.6" height="23.6" fill="none" stroke="#EAB308" strokeWidth="0.5" />

            {/* Spiral approximation */}
            <path
              d="M 100 100 A 100 100 0 0 1 0 0
                 A 61.8 61.8 0 0 1 61.8 61.8
                 A 38.2 38.2 0 0 1 23.6 23.6
                 A 23.6 23.6 0 0 1 47.2 0"
              fill="none"
              stroke="#EF4444"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {/* Sequence */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.goldenRatioCalculator.sequence')}</h3>
        <div className="flex flex-wrap gap-2">
          {sequence.map((num, i) => (
            <button
              key={i}
              onClick={() => copyValue(num)}
              className="px-3 py-2 bg-slate-100 rounded font-mono text-sm hover:bg-slate-200"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.goldenRatioCalculator.about')}</h4>
        <p className="text-sm text-slate-600 mb-3">
          {t('tools.goldenRatioCalculator.aboutText')}
        </p>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.goldenRatioCalculator.use1')}</li>
          <li>* {t('tools.goldenRatioCalculator.use2')}</li>
          <li>* {t('tools.goldenRatioCalculator.use3')}</li>
        </ul>
      </div>
    </div>
  )
}
