import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function PercentageCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'basic' | 'change' | 'difference'>('basic')

  // Basic mode
  const [percentage, setPercentage] = useState('')
  const [value, setValue] = useState('')

  // Change mode
  const [originalValue, setOriginalValue] = useState('')
  const [newValue, setNewValue] = useState('')

  // Difference mode
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')

  const basicResult = useMemo(() => {
    const pct = parseFloat(percentage)
    const val = parseFloat(value)

    if (isNaN(pct) && isNaN(val)) return null

    if (!isNaN(pct) && !isNaN(val)) {
      return {
        whatIs: (pct / 100) * val,
        isWhatPercent: (val / pct) * 100,
      }
    }
    return null
  }, [percentage, value])

  const changeResult = useMemo(() => {
    const original = parseFloat(originalValue)
    const newVal = parseFloat(newValue)

    if (isNaN(original) || isNaN(newVal) || original === 0) return null

    const change = newVal - original
    const percentChange = (change / original) * 100

    return {
      change,
      percentChange,
      isIncrease: change >= 0,
    }
  }, [originalValue, newValue])

  const differenceResult = useMemo(() => {
    const v1 = parseFloat(value1)
    const v2 = parseFloat(value2)

    if (isNaN(v1) || isNaN(v2)) return null

    const avg = (v1 + v2) / 2
    if (avg === 0) return null

    const diff = Math.abs(v1 - v2)
    const percentDiff = (diff / avg) * 100

    return {
      difference: diff,
      percentDifference: percentDiff,
      average: avg,
    }
  }, [value1, value2])

  const modes = [
    { key: 'basic', label: t('tools.percentageCalculator.basic') },
    { key: 'change', label: t('tools.percentageCalculator.change') },
    { key: 'difference', label: t('tools.percentageCalculator.difference') },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key as typeof mode)}
            className={`flex-1 py-2 rounded font-medium text-sm ${
              mode === m.key ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'basic' && (
        <>
          <div className="card p-4 space-y-3">
            <div className="text-center text-sm text-slate-600">
              {t('tools.percentageCalculator.whatIsXPercentOfY')}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="10"
                className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
              />
              <span className="text-slate-500">%</span>
              <span className="text-slate-500">{t('tools.percentageCalculator.of')}</span>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="100"
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-center"
              />
            </div>

            {basicResult && (
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-sm text-slate-600">{percentage}% of {value} =</div>
                <div className="text-2xl font-bold text-blue-600">
                  {basicResult.whatIs.toFixed(2).replace(/\.?0+$/, '')}
                </div>
              </div>
            )}
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.percentageCalculator.quickCalc')}</h3>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20, 25, 30, 50, 75].map(pct => (
                <button
                  key={pct}
                  onClick={() => setPercentage(pct.toString())}
                  className={`p-2 rounded text-sm ${
                    percentage === pct.toString() ? 'bg-blue-500 text-white' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {mode === 'change' && (
        <div className="card p-4 space-y-3">
          <div className="text-center text-sm text-slate-600">
            {t('tools.percentageCalculator.percentChange')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.percentageCalculator.original')}</label>
              <input
                type="number"
                value={originalValue}
                onChange={(e) => setOriginalValue(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.percentageCalculator.new')}</label>
              <input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="120"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          {changeResult && (
            <div className={`p-4 rounded text-center ${changeResult.isIncrease ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`text-3xl font-bold ${changeResult.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                {changeResult.isIncrease ? '+' : ''}{changeResult.percentChange.toFixed(2)}%
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {t('tools.percentageCalculator.changeOf')} {changeResult.isIncrease ? '+' : ''}{changeResult.change.toFixed(2).replace(/\.?0+$/, '')}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'difference' && (
        <div className="card p-4 space-y-3">
          <div className="text-center text-sm text-slate-600">
            {t('tools.percentageCalculator.percentDifference')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.percentageCalculator.value1')}</label>
              <input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="50"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.percentageCalculator.value2')}</label>
              <input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="75"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          {differenceResult && (
            <div className="p-4 bg-purple-50 rounded text-center">
              <div className="text-3xl font-bold text-purple-600">
                {differenceResult.percentDifference.toFixed(2)}%
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {t('tools.percentageCalculator.differenceOfValues')}: {differenceResult.difference.toFixed(2).replace(/\.?0+$/, '')}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.percentageCalculator.tips')}</h3>
        <div className="text-xs text-slate-500 space-y-1">
          <p>• {t('tools.percentageCalculator.tip1')}</p>
          <p>• {t('tools.percentageCalculator.tip2')}</p>
        </div>
      </div>
    </div>
  )
}
