import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function RomanNumeralConverter() {
  const { t } = useTranslation()
  const [decimal, setDecimal] = useState('2024')
  const [roman, setRoman] = useState('MMXXIV')
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  const romanNumerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]

  const toRoman = useCallback((num: number): string => {
    if (num <= 0 || num > 3999) {
      return ''
    }

    let result = ''
    let remaining = num

    for (const [value, symbol] of romanNumerals) {
      while (remaining >= value) {
        result += symbol
        remaining -= value
      }
    }

    return result
  }, [])

  const toDecimal = useCallback((romanStr: string): number => {
    const romanValues: Record<string, number> = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    }

    let result = 0
    let prev = 0

    for (let i = romanStr.length - 1; i >= 0; i--) {
      const char = romanStr[i].toUpperCase()
      const value = romanValues[char]

      if (value === undefined) {
        return -1 // Invalid character
      }

      if (value < prev) {
        result -= value
      } else {
        result += value
      }
      prev = value
    }

    return result
  }, [])

  const handleDecimalChange = (value: string) => {
    setDecimal(value)
    const num = parseInt(value, 10)

    if (isNaN(num)) {
      setRoman('')
      setError('')
      return
    }

    if (num <= 0 || num > 3999) {
      setRoman('')
      setError(t('tools.romanNumeralConverter.rangeError'))
      return
    }

    setRoman(toRoman(num))
    setError('')
  }

  const handleRomanChange = (value: string) => {
    setRoman(value.toUpperCase())

    if (!value) {
      setDecimal('')
      setError('')
      return
    }

    // Validate Roman numeral format
    const validPattern = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i
    if (!validPattern.test(value)) {
      setDecimal('')
      setError(t('tools.romanNumeralConverter.invalidRoman'))
      return
    }

    const num = toDecimal(value)
    if (num < 0) {
      setDecimal('')
      setError(t('tools.romanNumeralConverter.invalidRoman'))
      return
    }

    setDecimal(num.toString())
    setError('')
  }

  const examples = [
    { decimal: 1, roman: 'I' },
    { decimal: 4, roman: 'IV' },
    { decimal: 5, roman: 'V' },
    { decimal: 9, roman: 'IX' },
    { decimal: 10, roman: 'X' },
    { decimal: 40, roman: 'XL' },
    { decimal: 50, roman: 'L' },
    { decimal: 90, roman: 'XC' },
    { decimal: 100, roman: 'C' },
    { decimal: 400, roman: 'CD' },
    { decimal: 500, roman: 'D' },
    { decimal: 900, roman: 'CM' },
    { decimal: 1000, roman: 'M' },
    { decimal: 2024, roman: 'MMXXIV' },
    { decimal: 1999, roman: 'MCMXCIX' },
    { decimal: 3999, roman: 'MMMCMXCIX' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.romanNumeralConverter.convert')}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.romanNumeralConverter.decimal')} (1-3999)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="3999"
                value={decimal}
                onChange={(e) => handleDecimalChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-lg"
              />
              <Button variant="secondary" onClick={() => copy(decimal)}>
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.romanNumeralConverter.roman')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={roman}
                onChange={(e) => handleRomanChange(e.target.value)}
                placeholder="MMXXIV"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-lg uppercase"
              />
              <Button variant="secondary" onClick={() => copy(roman)}>
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
          </div>
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.romanNumeralConverter.reference')}
        </h3>

        <div className="grid grid-cols-4 gap-2 text-sm">
          {romanNumerals.map(([value, symbol]) => (
            <div
              key={symbol}
              className="flex items-center justify-between p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
              onClick={() => handleDecimalChange(value.toString())}
            >
              <span className="font-mono text-lg text-slate-800">{symbol}</span>
              <span className="text-slate-600">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.romanNumeralConverter.examples')}
        </h3>

        <div className="grid grid-cols-4 gap-2 text-sm">
          {examples.map((example) => (
            <button
              key={example.decimal}
              onClick={() => handleDecimalChange(example.decimal.toString())}
              className="flex items-center justify-between p-2 bg-slate-50 rounded hover:bg-slate-100"
            >
              <span className="text-slate-600">{example.decimal}</span>
              <span className="font-mono text-slate-800">{example.roman}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.romanNumeralConverter.rules')}
        </h3>

        <div className="text-sm text-slate-600 space-y-2">
          <p>• I, X, C, M {t('tools.romanNumeralConverter.rule1')}</p>
          <p>• V, L, D {t('tools.romanNumeralConverter.rule2')}</p>
          <p>• {t('tools.romanNumeralConverter.rule3')}</p>
          <p>• {t('tools.romanNumeralConverter.rule4')}</p>
        </div>
      </div>
    </div>
  )
}
