import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type CalcMode = 'basic' | 'change' | 'find' | 'increase'

export default function PercentageCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<CalcMode>('basic')

  // Basic: X% of Y
  const [percentage, setPercentage] = useState('25')
  const [baseValue, setBaseValue] = useState('200')
  const [basicResult, setBasicResult] = useState<number | null>(null)

  // Percentage change
  const [oldValue, setOldValue] = useState('100')
  const [newValue, setNewValue] = useState('125')
  const [changeResult, setChangeResult] = useState<{ change: number; type: string } | null>(null)

  // Find percentage: X is what % of Y
  const [partValue, setPartValue] = useState('50')
  const [wholeValue, setWholeValue] = useState('200')
  const [findResult, setFindResult] = useState<number | null>(null)

  // Increase/Decrease
  const [startValue, setStartValue] = useState('100')
  const [changePercent, setChangePercent] = useState('20')
  const [isIncrease, setIsIncrease] = useState(true)
  const [increaseResult, setIncreaseResult] = useState<number | null>(null)

  const calculateBasic = () => {
    const pct = parseFloat(percentage)
    const base = parseFloat(baseValue)
    if (!isNaN(pct) && !isNaN(base)) {
      setBasicResult((pct / 100) * base)
    }
  }

  const calculateChange = () => {
    const oldV = parseFloat(oldValue)
    const newV = parseFloat(newValue)
    if (!isNaN(oldV) && !isNaN(newV) && oldV !== 0) {
      const change = ((newV - oldV) / oldV) * 100
      setChangeResult({
        change: Math.abs(change),
        type: change >= 0 ? 'increase' : 'decrease',
      })
    }
  }

  const calculateFind = () => {
    const part = parseFloat(partValue)
    const whole = parseFloat(wholeValue)
    if (!isNaN(part) && !isNaN(whole) && whole !== 0) {
      setFindResult((part / whole) * 100)
    }
  }

  const calculateIncrease = () => {
    const start = parseFloat(startValue)
    const pct = parseFloat(changePercent)
    if (!isNaN(start) && !isNaN(pct)) {
      const multiplier = isIncrease ? (1 + pct / 100) : (1 - pct / 100)
      setIncreaseResult(start * multiplier)
    }
  }

  const modes = [
    { id: 'basic', label: t('tools.percentageCalculator.basicMode') },
    { id: 'change', label: t('tools.percentageCalculator.changeMode') },
    { id: 'find', label: t('tools.percentageCalculator.findMode') },
    { id: 'increase', label: t('tools.percentageCalculator.increaseMode') },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as CalcMode)}
            className={`px-3 py-1.5 rounded text-sm ${
              mode === m.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'basic' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.percentageCalculator.whatIsXofY')}</h3>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="w-24 px-3 py-2 border border-slate-300 rounded text-center"
            />
            <span className="text-lg">%</span>
            <span>{t('tools.percentageCalculator.of')}</span>
            <input
              type="number"
              value={baseValue}
              onChange={(e) => setBaseValue(e.target.value)}
              className="w-32 px-3 py-2 border border-slate-300 rounded text-center"
            />
            <span className="text-lg">=</span>
            <span className="text-lg font-bold text-blue-600">?</span>
          </div>
          <button
            onClick={calculateBasic}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.percentageCalculator.calculate')}
          </button>
          {basicResult !== null && (
            <div className="mt-4 p-4 bg-blue-50 rounded text-center">
              <div className="text-sm text-blue-600 mb-1">
                {percentage}% {t('tools.percentageCalculator.of')} {baseValue} =
              </div>
              <div className="text-3xl font-bold text-blue-700">
                {basicResult.toFixed(4).replace(/\.?0+$/, '')}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'change' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.percentageCalculator.percentageChange')}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.percentageCalculator.oldValue')}
              </label>
              <input
                type="number"
                value={oldValue}
                onChange={(e) => setOldValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.percentageCalculator.newValue')}
              </label>
              <input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          <button
            onClick={calculateChange}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.percentageCalculator.calculate')}
          </button>
          {changeResult !== null && (
            <div className={`mt-4 p-4 rounded text-center ${
              changeResult.type === 'increase' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="text-sm text-slate-600 mb-1">
                {t('tools.percentageCalculator.changeResult')}
              </div>
              <div className={`text-3xl font-bold ${
                changeResult.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {changeResult.type === 'increase' ? '+' : '-'}{changeResult.change.toFixed(2)}%
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {changeResult.type === 'increase'
                  ? t('tools.percentageCalculator.increased')
                  : t('tools.percentageCalculator.decreased')
                }
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'find' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.percentageCalculator.xIsWhatPercent')}</h3>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              type="number"
              value={partValue}
              onChange={(e) => setPartValue(e.target.value)}
              className="w-32 px-3 py-2 border border-slate-300 rounded text-center"
            />
            <span>{t('tools.percentageCalculator.isWhat')}</span>
            <span className="text-lg font-bold text-blue-600">?%</span>
            <span>{t('tools.percentageCalculator.of')}</span>
            <input
              type="number"
              value={wholeValue}
              onChange={(e) => setWholeValue(e.target.value)}
              className="w-32 px-3 py-2 border border-slate-300 rounded text-center"
            />
          </div>
          <button
            onClick={calculateFind}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.percentageCalculator.calculate')}
          </button>
          {findResult !== null && (
            <div className="mt-4 p-4 bg-purple-50 rounded text-center">
              <div className="text-sm text-purple-600 mb-1">
                {partValue} {t('tools.percentageCalculator.is')}
              </div>
              <div className="text-3xl font-bold text-purple-700">
                {findResult.toFixed(2)}%
              </div>
              <div className="text-sm text-purple-600">
                {t('tools.percentageCalculator.of')} {wholeValue}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'increase' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.percentageCalculator.increaseDecrease')}</h3>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsIncrease(true)}
              className={`flex-1 py-2 rounded ${
                isIncrease ? 'bg-green-600 text-white' : 'bg-slate-100'
              }`}
            >
              {t('tools.percentageCalculator.increase')}
            </button>
            <button
              onClick={() => setIsIncrease(false)}
              className={`flex-1 py-2 rounded ${
                !isIncrease ? 'bg-red-600 text-white' : 'bg-slate-100'
              }`}
            >
              {t('tools.percentageCalculator.decrease')}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.percentageCalculator.startValue')}
              </label>
              <input
                type="number"
                value={startValue}
                onChange={(e) => setStartValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.percentageCalculator.byPercent')}
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={changePercent}
                  onChange={(e) => setChangePercent(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-l"
                />
                <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r">%</span>
              </div>
            </div>
          </div>
          <button
            onClick={calculateIncrease}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.percentageCalculator.calculate')}
          </button>
          {increaseResult !== null && (
            <div className={`mt-4 p-4 rounded text-center ${
              isIncrease ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="text-sm text-slate-600 mb-1">
                {startValue} {isIncrease ? '+' : '-'} {changePercent}% =
              </div>
              <div className={`text-3xl font-bold ${
                isIncrease ? 'text-green-600' : 'text-red-600'
              }`}>
                {increaseResult.toFixed(4).replace(/\.?0+$/, '')}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.percentageCalculator.commonPercentages')}</h4>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-center text-sm">
          {[
            { pct: '10%', dec: '0.1', frac: '1/10' },
            { pct: '20%', dec: '0.2', frac: '1/5' },
            { pct: '25%', dec: '0.25', frac: '1/4' },
            { pct: '33%', dec: '0.33', frac: '1/3' },
            { pct: '50%', dec: '0.5', frac: '1/2' },
            { pct: '75%', dec: '0.75', frac: '3/4' },
            { pct: '80%', dec: '0.8', frac: '4/5' },
            { pct: '100%', dec: '1', frac: '1/1' },
          ].map(({ pct, dec, frac }) => (
            <div key={pct} className="p-2 bg-white rounded">
              <div className="font-bold">{pct}</div>
              <div className="text-xs text-slate-500">= {dec}</div>
              <div className="text-xs text-slate-400">= {frac}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
