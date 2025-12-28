import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function RomanNumeralConverter() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'toRoman' | 'fromRoman'>('toRoman')
  const [input, setInput] = useState('')

  const romanNumerals: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]

  const toRoman = (num: number): string => {
    if (num <= 0 || num > 3999) return ''
    let result = ''
    for (const [value, numeral] of romanNumerals) {
      while (num >= value) {
        result += numeral
        num -= value
      }
    }
    return result
  }

  const fromRoman = (roman: string): number => {
    const values: Record<string, number> = {
      I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
    }
    let result = 0
    const chars = roman.toUpperCase().split('')

    for (let i = 0; i < chars.length; i++) {
      const current = values[chars[i]] || 0
      const next = values[chars[i + 1]] || 0
      if (current < next) {
        result -= current
      } else {
        result += current
      }
    }
    return result
  }

  const result = useMemo(() => {
    if (!input.trim()) return null

    if (mode === 'toRoman') {
      const num = parseInt(input)
      if (isNaN(num) || num <= 0 || num > 3999) return null
      return {
        decimal: num,
        roman: toRoman(num),
      }
    } else {
      const roman = input.toUpperCase()
      if (!/^[MDCLXVI]+$/.test(roman)) return null
      const num = fromRoman(roman)
      return {
        roman: roman,
        decimal: num,
      }
    }
  }, [input, mode])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('toRoman'); setInput('') }}
          className={`flex-1 py-2 rounded font-medium ${mode === 'toRoman' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.romanNumeralConverter.toRoman')}
        </button>
        <button
          onClick={() => { setMode('fromRoman'); setInput('') }}
          className={`flex-1 py-2 rounded font-medium ${mode === 'fromRoman' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.romanNumeralConverter.fromRoman')}
        </button>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {mode === 'toRoman'
            ? t('tools.romanNumeralConverter.enterDecimal')
            : t('tools.romanNumeralConverter.enterRoman')}
        </label>
        <input
          type={mode === 'toRoman' ? 'number' : 'text'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'toRoman' ? '1-3999' : 'MCMXCIX'}
          className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-xl text-center"
          min={mode === 'toRoman' ? 1 : undefined}
          max={mode === 'toRoman' ? 3999 : undefined}
        />
        {mode === 'toRoman' && (
          <p className="text-xs text-slate-500 mt-1 text-center">
            {t('tools.romanNumeralConverter.range')}
          </p>
        )}
      </div>

      {result && (
        <div className="card p-6 bg-blue-50 text-center">
          <div className="text-sm text-slate-500 mb-2">
            {mode === 'toRoman' ? t('tools.romanNumeralConverter.romanNumeral') : t('tools.romanNumeralConverter.decimalNumber')}
          </div>
          <div className="text-4xl font-bold text-blue-600">
            {mode === 'toRoman' ? result.roman : result.decimal}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(mode === 'toRoman' ? result.roman : String(result.decimal))}
            className="mt-3 px-4 py-1 text-sm bg-white rounded border"
          >
            {t('common.copy')}
          </button>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.romanNumeralConverter.reference')}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { n: 1, r: 'I' }, { n: 5, r: 'V' }, { n: 10, r: 'X' }, { n: 50, r: 'L' },
            { n: 100, r: 'C' }, { n: 500, r: 'D' }, { n: 1000, r: 'M' },
          ].map(({ n, r }) => (
            <div key={n} className="p-2 bg-slate-50 rounded text-center">
              <div className="text-xl font-bold text-blue-600">{r}</div>
              <div className="text-sm text-slate-500">{n}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.romanNumeralConverter.examples')}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { n: 4, r: 'IV' }, { n: 9, r: 'IX' }, { n: 40, r: 'XL' }, { n: 90, r: 'XC' },
            { n: 400, r: 'CD' }, { n: 900, r: 'CM' }, { n: 2024, r: 'MMXXIV' }, { n: 1999, r: 'MCMXCIX' },
          ].map(({ n, r }) => (
            <div
              key={n}
              className="flex justify-between p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
              onClick={() => { setInput(mode === 'toRoman' ? String(n) : r) }}
            >
              <span>{n}</span>
              <span className="font-mono">{r}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.romanNumeralConverter.rules')}
        </h3>
        <div className="text-xs text-slate-500 space-y-1">
          <p>• {t('tools.romanNumeralConverter.rule1')}</p>
          <p>• {t('tools.romanNumeralConverter.rule2')}</p>
          <p>• {t('tools.romanNumeralConverter.rule3')}</p>
        </div>
      </div>
    </div>
  )
}
