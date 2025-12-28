import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function PercentageCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'percent' | 'change' | 'find'>('percent')

  // Mode 1: What is X% of Y?
  const [percentValue, setPercentValue] = useState('')
  const [ofValue, setOfValue] = useState('')

  // Mode 2: Percentage change
  const [originalValue, setOriginalValue] = useState('')
  const [newValue, setNewValue] = useState('')

  // Mode 3: Find percentage
  const [partValue, setPartValue] = useState('')
  const [wholeValue, setWholeValue] = useState('')

  const percentResult = useMemo(() => {
    const percent = parseFloat(percentValue)
    const of = parseFloat(ofValue)
    if (isNaN(percent) || isNaN(of)) return null
    return (percent / 100) * of
  }, [percentValue, ofValue])

  const changeResult = useMemo(() => {
    const original = parseFloat(originalValue)
    const newVal = parseFloat(newValue)
    if (isNaN(original) || isNaN(newVal) || original === 0) return null
    const change = ((newVal - original) / original) * 100
    return {
      change: change.toFixed(2),
      isIncrease: change >= 0,
      difference: (newVal - original).toFixed(2),
    }
  }, [originalValue, newValue])

  const findResult = useMemo(() => {
    const part = parseFloat(partValue)
    const whole = parseFloat(wholeValue)
    if (isNaN(part) || isNaN(whole) || whole === 0) return null
    return (part / whole) * 100
  }, [partValue, wholeValue])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('percent')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium ${
              mode === 'percent' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.percentageCalculator.whatIs')}
          </button>
          <button
            onClick={() => setMode('change')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium ${
              mode === 'change' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.percentageCalculator.change')}
          </button>
          <button
            onClick={() => setMode('find')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium ${
              mode === 'find' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.percentageCalculator.find')}
          </button>
        </div>

        {mode === 'percent' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">{t('tools.percentageCalculator.whatIsLabel')}</span>
              <input
                type="number"
                value={percentValue}
                onChange={(e) => setPercentValue(e.target.value)}
                placeholder="0"
                className="w-24 px-3 py-2 border border-slate-300 rounded text-sm text-center"
              />
              <span className="text-slate-600">% {t('tools.percentageCalculator.of')}</span>
              <input
                type="number"
                value={ofValue}
                onChange={(e) => setOfValue(e.target.value)}
                placeholder="0"
                className="w-24 px-3 py-2 border border-slate-300 rounded text-sm text-center"
              />
              <span className="text-slate-600">?</span>
            </div>

            {percentResult !== null && (
              <div className="p-4 bg-blue-50 rounded text-center">
                <div className="text-sm text-slate-600 mb-1">
                  {percentValue}% {t('tools.percentageCalculator.of')} {ofValue} =
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {percentResult.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'change' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.percentageCalculator.originalValue')}
              </label>
              <input
                type="number"
                value={originalValue}
                onChange={(e) => setOriginalValue(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.percentageCalculator.newValue')}
              </label>
              <input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="150"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>

            {changeResult && (
              <div className={`p-4 rounded text-center ${
                changeResult.isIncrease ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="text-sm text-slate-600 mb-1">
                  {t('tools.percentageCalculator.percentChange')}
                </div>
                <div className={`text-3xl font-bold ${
                  changeResult.isIncrease ? 'text-green-600' : 'text-red-600'
                }`}>
                  {changeResult.isIncrease ? '+' : ''}{changeResult.change}%
                </div>
                <div className="text-sm text-slate-500 mt-2">
                  {t('tools.percentageCalculator.difference')}: {changeResult.isIncrease ? '+' : ''}{changeResult.difference}
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'find' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="number"
                value={partValue}
                onChange={(e) => setPartValue(e.target.value)}
                placeholder="25"
                className="w-24 px-3 py-2 border border-slate-300 rounded text-sm text-center"
              />
              <span className="text-slate-600">{t('tools.percentageCalculator.isWhatPercent')}</span>
              <input
                type="number"
                value={wholeValue}
                onChange={(e) => setWholeValue(e.target.value)}
                placeholder="100"
                className="w-24 px-3 py-2 border border-slate-300 rounded text-sm text-center"
              />
              <span className="text-slate-600">?</span>
            </div>

            {findResult !== null && (
              <div className="p-4 bg-purple-50 rounded text-center">
                <div className="text-sm text-slate-600 mb-1">
                  {partValue} {t('tools.percentageCalculator.isXPercentOf')} {wholeValue}
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {findResult.toFixed(2)}%
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.percentageCalculator.quickReference')}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-slate-50 rounded">10% = ÷ 10</div>
          <div className="p-2 bg-slate-50 rounded">20% = ÷ 5</div>
          <div className="p-2 bg-slate-50 rounded">25% = ÷ 4</div>
          <div className="p-2 bg-slate-50 rounded">33% ≈ ÷ 3</div>
          <div className="p-2 bg-slate-50 rounded">50% = ÷ 2</div>
          <div className="p-2 bg-slate-50 rounded">75% = × 0.75</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.percentageCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.percentageCalculator.tip1')}</li>
          <li>{t('tools.percentageCalculator.tip2')}</li>
          <li>{t('tools.percentageCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
