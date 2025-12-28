import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

// Roman numeral values
const ROMAN_VALUES: [string, number][] = [
  ['M', 1000],
  ['CM', 900],
  ['D', 500],
  ['CD', 400],
  ['C', 100],
  ['XC', 90],
  ['L', 50],
  ['XL', 40],
  ['X', 10],
  ['IX', 9],
  ['V', 5],
  ['IV', 4],
  ['I', 1],
]

// Convert Arabic number to Roman numeral
const toRoman = (num: number): string => {
  if (num <= 0 || num > 3999) {
    return ''
  }

  let result = ''
  let remaining = num

  for (const [roman, value] of ROMAN_VALUES) {
    while (remaining >= value) {
      result += roman
      remaining -= value
    }
  }

  return result
}

// Convert Roman numeral to Arabic number
const fromRoman = (roman: string): number => {
  if (!roman) return 0

  const input = roman.toUpperCase().trim()
  let result = 0
  let i = 0

  while (i < input.length) {
    // Check for two-character combinations first
    if (i + 1 < input.length) {
      const twoChar = input.substring(i, i + 2)
      const found = ROMAN_VALUES.find(([r]) => r === twoChar)
      if (found) {
        result += found[1]
        i += 2
        continue
      }
    }

    // Check for single character
    const oneChar = input[i]
    const found = ROMAN_VALUES.find(([r]) => r === oneChar)
    if (found) {
      result += found[1]
      i += 1
    } else {
      // Invalid character
      return NaN
    }
  }

  return result
}

// Validate Roman numeral
const isValidRoman = (roman: string): boolean => {
  if (!roman) return false

  const input = roman.toUpperCase().trim()

  // Check for valid characters only
  if (!/^[MDCLXVI]+$/i.test(input)) {
    return false
  }

  // Convert and convert back to verify
  const num = fromRoman(input)
  if (isNaN(num) || num <= 0 || num > 3999) {
    return false
  }

  return toRoman(num) === input
}

export default function RomanNumeralConverter() {
  const { t } = useTranslation()
  const [arabicInput, setArabicInput] = useState('')
  const [romanInput, setRomanInput] = useState('')
  const { copied: arabicCopied, copy: copyArabic } = useClipboard()
  const { copied: romanCopied, copy: copyRoman } = useClipboard()

  const handleArabicChange = (val: string) => {
    setArabicInput(val)
    const num = parseInt(val)
    if (!isNaN(num) && num > 0 && num <= 3999) {
      setRomanInput(toRoman(num))
    } else if (val === '') {
      setRomanInput('')
    }
  }

  const handleRomanChange = (val: string) => {
    setRomanInput(val.toUpperCase())
    const num = fromRoman(val)
    if (!isNaN(num) && num > 0) {
      setArabicInput(num.toString())
    } else if (val === '') {
      setArabicInput('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.romanNumeralConverter.arabic')}
            </label>
          </div>
          <TextArea
            value={arabicInput}
            onChange={(e) => handleArabicChange(e.target.value)}
            placeholder={t('tools.romanNumeralConverter.arabicPlaceholder')}
            rows={6}
            className="font-mono text-lg"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleArabicChange('')} disabled={!arabicInput}>
              {t('common.clear')}
            </Button>
            <Button onClick={() => copyArabic(arabicInput)} disabled={!arabicInput}>
              {arabicCopied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.romanNumeralConverter.roman')}
            </label>
          </div>
          <TextArea
            value={romanInput}
            onChange={(e) => handleRomanChange(e.target.value)}
            placeholder={t('tools.romanNumeralConverter.romanPlaceholder')}
            rows={6}
            className="font-mono text-lg"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleRomanChange('')} disabled={!romanInput}>
              {t('common.clear')}
            </Button>
            <Button onClick={() => copyRoman(romanInput)} disabled={!romanInput}>
              {romanCopied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.romanNumeralConverter.reference')}</h3>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {[
            ['I', '1'],
            ['V', '5'],
            ['X', '10'],
            ['L', '50'],
            ['C', '100'],
            ['D', '500'],
            ['M', '1000'],
          ].map(([roman, arabic]) => (
            <div key={roman} className="bg-slate-50 p-3 rounded">
              <div className="text-2xl font-bold text-slate-700">{roman}</div>
              <div className="text-slate-500">{arabic}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-4 md:grid-cols-8 gap-2 text-center text-sm">
          {[
            ['IV', '4'],
            ['IX', '9'],
            ['XL', '40'],
            ['XC', '90'],
            ['CD', '400'],
            ['CM', '900'],
            ['MMXXV', '2025'],
            ['MMMCMXCIX', '3999'],
          ].map(([roman, arabic]) => (
            <div key={roman} className="bg-slate-50 p-2 rounded">
              <div className="text-lg font-medium text-slate-700">{roman}</div>
              <div className="text-slate-500 text-xs">{arabic}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          {t('tools.romanNumeralConverter.hint')}
        </p>
      </div>
    </div>
  )
}
