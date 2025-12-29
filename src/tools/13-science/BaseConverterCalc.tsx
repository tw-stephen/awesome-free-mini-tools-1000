import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function BaseConverterCalc() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('255')
  const [inputBase, setInputBase] = useState(10)
  const [outputBase, setOutputBase] = useState(2)

  const isValidForBase = (value: string, base: number): boolean => {
    const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const validDigits = digits.slice(0, base).toLowerCase()
    return value.toLowerCase().split('').every(c => validDigits.includes(c))
  }

  const toDecimal = (value: string, base: number): number => {
    return parseInt(value, base)
  }

  const fromDecimal = (decimal: number, base: number): string => {
    if (decimal === 0) return '0'
    return decimal.toString(base).toUpperCase()
  }

  const convert = (): string => {
    if (!inputValue || !isValidForBase(inputValue, inputBase)) {
      return t('tools.baseConverterCalc.invalid')
    }
    const decimal = toDecimal(inputValue, inputBase)
    if (isNaN(decimal)) return t('tools.baseConverterCalc.invalid')
    return fromDecimal(decimal, outputBase)
  }

  const decimalValue = isValidForBase(inputValue, inputBase) ? toDecimal(inputValue, inputBase) : NaN
  const result = convert()

  const commonBases = [
    { name: t('tools.baseConverterCalc.binary'), base: 2 },
    { name: t('tools.baseConverterCalc.octal'), base: 8 },
    { name: t('tools.baseConverterCalc.decimal'), base: 10 },
    { name: t('tools.baseConverterCalc.hex'), base: 16 },
  ]

  // Convert to all common bases
  const allConversions = !isNaN(decimalValue) ? commonBases.map(b => ({
    ...b,
    value: fromDecimal(decimalValue, b.base)
  })) : []

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.baseConverterCalc.inputValue')}
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          className="w-full px-3 py-2 border border-slate-300 rounded text-xl font-mono"
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.baseConverterCalc.fromBase')}
            </label>
            <select
              value={inputBase}
              onChange={(e) => setInputBase(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {Array.from({ length: 35 }, (_, i) => i + 2).map(b => (
                <option key={b} value={b}>
                  {b} {commonBases.find(cb => cb.base === b)?.name ? `(${commonBases.find(cb => cb.base === b)?.name})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.baseConverterCalc.toBase')}
            </label>
            <select
              value={outputBase}
              onChange={(e) => setOutputBase(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {Array.from({ length: 35 }, (_, i) => i + 2).map(b => (
                <option key={b} value={b}>
                  {b} {commonBases.find(cb => cb.base === b)?.name ? `(${commonBases.find(cb => cb.base === b)?.name})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <div className="text-sm text-slate-500 mb-1">
          {t('tools.baseConverterCalc.result')} ({t('tools.baseConverterCalc.base')} {outputBase})
        </div>
        <div className="text-3xl font-mono font-bold text-blue-600 break-all">
          {result}
        </div>
      </div>

      {!isNaN(decimalValue) && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.baseConverterCalc.allConversions')}</h3>
            <div className="space-y-2">
              {allConversions.map(conv => (
                <div key={conv.base} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                  <span className="w-24 text-sm">{conv.name} ({conv.base})</span>
                  <span className="flex-1 font-mono text-sm break-all">{conv.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">{t('tools.baseConverterCalc.decimalValue')}</h3>
            <div className="text-2xl font-mono">{decimalValue.toLocaleString()}</div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.baseConverterCalc.quickConvert')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {commonBases.map(b => (
            <button
              key={b.base}
              onClick={() => {
                setInputBase(10)
                setOutputBase(b.base)
              }}
              className={`py-2 rounded text-sm ${
                outputBase === b.base ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h3 className="font-medium mb-2">{t('tools.baseConverterCalc.digits')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <strong>{t('tools.baseConverterCalc.binary')} (2):</strong> 0-1
          </div>
          <div>
            <strong>{t('tools.baseConverterCalc.octal')} (8):</strong> 0-7
          </div>
          <div>
            <strong>{t('tools.baseConverterCalc.decimal')} (10):</strong> 0-9
          </div>
          <div>
            <strong>{t('tools.baseConverterCalc.hex')} (16):</strong> 0-9, A-F
          </div>
        </div>
      </div>
    </div>
  )
}
