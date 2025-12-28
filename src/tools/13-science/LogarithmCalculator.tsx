import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type CalcMode = 'log' | 'antilog' | 'properties' | 'changeBase'

export default function LogarithmCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<CalcMode>('log')

  // Logarithm calculation
  const [logValue, setLogValue] = useState('100')
  const [logBase, setLogBase] = useState('10')
  const [logResult, setLogResult] = useState<number | null>(null)

  // Antilog calculation
  const [antilogValue, setAntilogValue] = useState('2')
  const [antilogBase, setAntilogBase] = useState('10')
  const [antilogResult, setAntilogResult] = useState<number | null>(null)

  // Change of base
  const [changeValue, setChangeValue] = useState('8')
  const [fromBase, setFromBase] = useState('2')
  const [toBase, setToBase] = useState('10')
  const [changeResult, setChangeResult] = useState<{ original: number; converted: number } | null>(null)

  const calculateLog = () => {
    const value = parseFloat(logValue)
    const base = parseFloat(logBase)
    if (!isNaN(value) && !isNaN(base) && value > 0 && base > 0 && base !== 1) {
      setLogResult(Math.log(value) / Math.log(base))
    }
  }

  const calculateAntilog = () => {
    const value = parseFloat(antilogValue)
    const base = parseFloat(antilogBase)
    if (!isNaN(value) && !isNaN(base) && base > 0 && base !== 1) {
      setAntilogResult(Math.pow(base, value))
    }
  }

  const calculateChangeBase = () => {
    const value = parseFloat(changeValue)
    const from = parseFloat(fromBase)
    const to = parseFloat(toBase)
    if (!isNaN(value) && !isNaN(from) && !isNaN(to) && value > 0 && from > 0 && from !== 1 && to > 0 && to !== 1) {
      const original = Math.log(value) / Math.log(from)
      const converted = Math.log(value) / Math.log(to)
      setChangeResult({ original, converted })
    }
  }

  const modes = [
    { id: 'log', label: t('tools.logarithmCalculator.logarithm') },
    { id: 'antilog', label: t('tools.logarithmCalculator.antilog') },
    { id: 'changeBase', label: t('tools.logarithmCalculator.changeBase') },
    { id: 'properties', label: t('tools.logarithmCalculator.properties') },
  ]

  const commonLogs = [
    { expr: 'log₁₀(1)', value: 0 },
    { expr: 'log₁₀(10)', value: 1 },
    { expr: 'log₁₀(100)', value: 2 },
    { expr: 'log₂(2)', value: 1 },
    { expr: 'log₂(8)', value: 3 },
    { expr: 'ln(e)', value: 1 },
    { expr: 'ln(e²)', value: 2 },
    { expr: 'log₂(16)', value: 4 },
  ]

  const properties = [
    { name: 'Product Rule', formula: 'log(xy) = log(x) + log(y)' },
    { name: 'Quotient Rule', formula: 'log(x/y) = log(x) - log(y)' },
    { name: 'Power Rule', formula: 'log(xⁿ) = n × log(x)' },
    { name: 'Change of Base', formula: 'logₐ(x) = logₓ(x) / logₓ(a)' },
    { name: 'Log of 1', formula: 'logₐ(1) = 0' },
    { name: 'Log of Base', formula: 'logₐ(a) = 1' },
    { name: 'Inverse', formula: 'aˡᵒᵍₐ⁽ˣ⁾ = x' },
    { name: 'Natural Log', formula: 'ln(x) = logₑ(x)' },
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

      {mode === 'log' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.logarithmCalculator.calcLog')}</h3>
          <p className="text-sm text-slate-600 mb-4 font-mono">logₐ(x) = y → aʸ = x</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.logarithmCalculator.value')} (x)
              </label>
              <input
                type="number"
                step="any"
                value={logValue}
                onChange={(e) => setLogValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.logarithmCalculator.base')} (a)
              </label>
              <input
                type="number"
                step="any"
                value={logBase}
                onChange={(e) => setLogBase(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => setLogBase('10')}
                  className="px-2 py-0.5 bg-slate-100 text-xs rounded"
                >
                  10
                </button>
                <button
                  onClick={() => setLogBase(Math.E.toString())}
                  className="px-2 py-0.5 bg-slate-100 text-xs rounded"
                >
                  e
                </button>
                <button
                  onClick={() => setLogBase('2')}
                  className="px-2 py-0.5 bg-slate-100 text-xs rounded"
                >
                  2
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={calculateLog}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.logarithmCalculator.calculate')}
          </button>

          {logResult !== null && (
            <div className="mt-4 p-4 bg-green-50 rounded text-center">
              <div className="text-sm text-green-600 mb-1">
                log<sub>{logBase}</sub>({logValue}) =
              </div>
              <div className="text-3xl font-bold text-green-700">
                {logResult.toFixed(8).replace(/\.?0+$/, '')}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'antilog' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.logarithmCalculator.calcAntilog')}</h3>
          <p className="text-sm text-slate-600 mb-4 font-mono">antilog(y) = aʸ = x</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.logarithmCalculator.exponent')} (y)
              </label>
              <input
                type="number"
                step="any"
                value={antilogValue}
                onChange={(e) => setAntilogValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.logarithmCalculator.base')} (a)
              </label>
              <input
                type="number"
                step="any"
                value={antilogBase}
                onChange={(e) => setAntilogBase(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => setAntilogBase('10')}
                  className="px-2 py-0.5 bg-slate-100 text-xs rounded"
                >
                  10
                </button>
                <button
                  onClick={() => setAntilogBase(Math.E.toString())}
                  className="px-2 py-0.5 bg-slate-100 text-xs rounded"
                >
                  e
                </button>
                <button
                  onClick={() => setAntilogBase('2')}
                  className="px-2 py-0.5 bg-slate-100 text-xs rounded"
                >
                  2
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={calculateAntilog}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.logarithmCalculator.calculate')}
          </button>

          {antilogResult !== null && (
            <div className="mt-4 p-4 bg-purple-50 rounded text-center">
              <div className="text-sm text-purple-600 mb-1">
                {antilogBase}^{antilogValue} =
              </div>
              <div className="text-3xl font-bold text-purple-700">
                {antilogResult.toFixed(8).replace(/\.?0+$/, '')}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'changeBase' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.logarithmCalculator.changeBaseTitle')}</h3>
          <p className="text-sm text-slate-600 mb-4 font-mono">logₐ(x) = logₓ(x) / logₓ(a)</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.logarithmCalculator.value')} (x)
              </label>
              <input
                type="number"
                step="any"
                value={changeValue}
                onChange={(e) => setChangeValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.logarithmCalculator.fromBase')}
              </label>
              <input
                type="number"
                step="any"
                value={fromBase}
                onChange={(e) => setFromBase(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.logarithmCalculator.toBase')}
              </label>
              <input
                type="number"
                step="any"
                value={toBase}
                onChange={(e) => setToBase(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <button
            onClick={calculateChangeBase}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.logarithmCalculator.convert')}
          </button>

          {changeResult && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-sm text-blue-600">log<sub>{fromBase}</sub>({changeValue})</div>
                <div className="text-xl font-bold text-blue-700">
                  {changeResult.original.toFixed(6)}
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-sm text-green-600">log<sub>{toBase}</sub>({changeValue})</div>
                <div className="text-xl font-bold text-green-700">
                  {changeResult.converted.toFixed(6)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'properties' && (
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.logarithmCalculator.logProperties')}</h3>
            <div className="space-y-2">
              {properties.map((prop, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded">
                  <div className="text-sm font-medium text-slate-700">{prop.name}</div>
                  <div className="font-mono text-blue-600">{prop.formula}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.logarithmCalculator.commonValues')}</h4>
        <div className="grid grid-cols-4 gap-2 text-sm">
          {commonLogs.map((log, i) => (
            <div key={i} className="p-2 bg-white rounded text-center">
              <div className="font-mono text-blue-600">{log.expr}</div>
              <div className="text-slate-700 font-bold">{log.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
