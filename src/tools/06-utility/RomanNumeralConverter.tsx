import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

export default function RomanNumeralConverter() {
  const { t } = useTranslation()
  const { copy, copied } = useClipboard()
  const [mode, setMode] = useState<'toRoman' | 'toArabic'>('toRoman')
  const [arabicInput, setArabicInput] = useState('')
  const [romanInput, setRomanInput] = useState('')

  const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' },
  ]

  const toRoman = (num: number): string => {
    if (num < 1 || num > 3999) return ''
    let result = ''
    let remaining = num

    for (const { value, numeral } of romanNumerals) {
      while (remaining >= value) {
        result += numeral
        remaining -= value
      }
    }

    return result
  }

  const toArabic = (roman: string): number | null => {
    const upper = roman.toUpperCase()
    const romanValues: Record<string, number> = {
      I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
    }

    let result = 0
    let prev = 0

    for (let i = upper.length - 1; i >= 0; i--) {
      const current = romanValues[upper[i]]
      if (current === undefined) return null

      if (current < prev) {
        result -= current
      } else {
        result += current
      }
      prev = current
    }

    // Validate by converting back
    if (toRoman(result) !== upper) return null

    return result
  }

  const romanResult = useMemo(() => {
    const num = parseInt(arabicInput)
    if (isNaN(num) || num < 1 || num > 3999) return null
    return toRoman(num)
  }, [arabicInput])

  const arabicResult = useMemo(() => {
    if (!romanInput.trim()) return null
    return toArabic(romanInput)
  }, [romanInput])

  const examples = [
    { arabic: 1, roman: 'I' },
    { arabic: 4, roman: 'IV' },
    { arabic: 5, roman: 'V' },
    { arabic: 9, roman: 'IX' },
    { arabic: 10, roman: 'X' },
    { arabic: 40, roman: 'XL' },
    { arabic: 50, roman: 'L' },
    { arabic: 90, roman: 'XC' },
    { arabic: 100, roman: 'C' },
    { arabic: 400, roman: 'CD' },
    { arabic: 500, roman: 'D' },
    { arabic: 900, roman: 'CM' },
    { arabic: 1000, roman: 'M' },
    { arabic: 2024, roman: 'MMXXIV' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('toRoman')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              mode === 'toRoman' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.romanNumeralConverter.toRoman')}
          </button>
          <button
            onClick={() => setMode('toArabic')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              mode === 'toArabic' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.romanNumeralConverter.toArabic')}
          </button>
        </div>

        {mode === 'toRoman' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.romanNumeralConverter.enterArabic')} (1-3999)
              </label>
              <input
                type="number"
                value={arabicInput}
                onChange={(e) => setArabicInput(e.target.value)}
                placeholder="2024"
                min="1"
                max="3999"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>

            {romanResult && (
              <div className="p-4 bg-blue-50 rounded text-center">
                <div className="text-sm text-slate-500 mb-1">
                  {t('tools.romanNumeralConverter.result')}
                </div>
                <div className="text-4xl font-bold text-blue-600 tracking-widest">
                  {romanResult}
                </div>
                <button
                  onClick={() => copy(romanResult)}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                >
                  {copied ? t('common.copied') : t('common.copy')}
                </button>
              </div>
            )}

            {arabicInput && !romanResult && (
              <div className="p-4 bg-red-50 rounded text-center text-red-600">
                {t('tools.romanNumeralConverter.invalidRange')}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.romanNumeralConverter.enterRoman')}
              </label>
              <input
                type="text"
                value={romanInput}
                onChange={(e) => setRomanInput(e.target.value.toUpperCase())}
                placeholder="MMXXIV"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono uppercase"
              />
            </div>

            {arabicResult !== null && (
              <div className="p-4 bg-green-50 rounded text-center">
                <div className="text-sm text-slate-500 mb-1">
                  {t('tools.romanNumeralConverter.result')}
                </div>
                <div className="text-4xl font-bold text-green-600">
                  {arabicResult.toLocaleString()}
                </div>
                <button
                  onClick={() => copy(String(arabicResult))}
                  className="mt-2 text-sm text-green-500 hover:text-green-700"
                >
                  {copied ? t('common.copied') : t('common.copy')}
                </button>
              </div>
            )}

            {romanInput && arabicResult === null && (
              <div className="p-4 bg-red-50 rounded text-center text-red-600">
                {t('tools.romanNumeralConverter.invalidRoman')}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.romanNumeralConverter.reference')}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {examples.map((ex) => (
            <button
              key={ex.arabic}
              onClick={() => {
                if (mode === 'toRoman') {
                  setArabicInput(String(ex.arabic))
                } else {
                  setRomanInput(ex.roman)
                }
              }}
              className="p-2 bg-slate-50 rounded text-center hover:bg-slate-100"
            >
              <div className="font-mono font-bold">{ex.roman}</div>
              <div className="text-xs text-slate-500">{ex.arabic}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.romanNumeralConverter.rules')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-2">
          <li className="flex gap-2">
            <span className="font-mono font-bold w-12">I</span>
            <span>= 1 ({t('tools.romanNumeralConverter.before')} V, X)</span>
          </li>
          <li className="flex gap-2">
            <span className="font-mono font-bold w-12">V</span>
            <span>= 5</span>
          </li>
          <li className="flex gap-2">
            <span className="font-mono font-bold w-12">X</span>
            <span>= 10 ({t('tools.romanNumeralConverter.before')} L, C)</span>
          </li>
          <li className="flex gap-2">
            <span className="font-mono font-bold w-12">L</span>
            <span>= 50</span>
          </li>
          <li className="flex gap-2">
            <span className="font-mono font-bold w-12">C</span>
            <span>= 100 ({t('tools.romanNumeralConverter.before')} D, M)</span>
          </li>
          <li className="flex gap-2">
            <span className="font-mono font-bold w-12">D</span>
            <span>= 500</span>
          </li>
          <li className="flex gap-2">
            <span className="font-mono font-bold w-12">M</span>
            <span>= 1000</span>
          </li>
        </ul>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.romanNumeralConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.romanNumeralConverter.tip1')}</li>
          <li>{t('tools.romanNumeralConverter.tip2')}</li>
          <li>{t('tools.romanNumeralConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
