import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

// Chinese number characters
const DIGITS_SIMPLE = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const DIGITS_FORMAL = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖']

const UNITS_SIMPLE = ['', '十', '百', '千']
const UNITS_FORMAL = ['', '拾', '佰', '仟']

const BIG_UNITS = ['', '萬', '億', '兆', '京']

// Convert a number (0-9999) to Chinese
const fourDigitsToChinese = (num: number, formal: boolean): string => {
  if (num === 0) return ''

  const digits = formal ? DIGITS_FORMAL : DIGITS_SIMPLE
  const units = formal ? UNITS_FORMAL : UNITS_SIMPLE

  let result = ''
  const str = num.toString().padStart(4, '0')

  for (let i = 0; i < 4; i++) {
    const d = parseInt(str[i])
    const unitIndex = 3 - i

    if (d === 0) {
      // Add zero only if there's a non-zero digit after and result doesn't end with zero
      if (result && !result.endsWith(digits[0]) && str.slice(i + 1).match(/[1-9]/)) {
        result += digits[0]
      }
    } else {
      // Special case: 一十 can be written as 十 in simple form
      if (!formal && d === 1 && unitIndex === 1 && result === '') {
        result += units[unitIndex]
      } else {
        result += digits[d] + units[unitIndex]
      }
    }
  }

  return result
}

// Convert integer to Chinese
const numberToChinese = (num: number, formal: boolean): string => {
  if (num === 0) return formal ? DIGITS_FORMAL[0] : DIGITS_SIMPLE[0]

  const isNegative = num < 0
  num = Math.abs(num)

  if (num > 9999999999999999) {
    return 'Number too large'
  }

  const parts: string[] = []
  let bigUnitIndex = 0

  while (num > 0) {
    const section = num % 10000
    const sectionStr = fourDigitsToChinese(section, formal)

    if (section > 0) {
      parts.unshift(sectionStr + BIG_UNITS[bigUnitIndex])
    } else if (parts.length > 0) {
      // Add zero placeholder between sections
      const digits = formal ? DIGITS_FORMAL : DIGITS_SIMPLE
      if (!parts[0].startsWith(digits[0])) {
        parts.unshift(digits[0])
      }
    }

    num = Math.floor(num / 10000)
    bigUnitIndex++
  }

  let result = parts.join('')

  // Clean up consecutive zeros
  const digits = formal ? DIGITS_FORMAL : DIGITS_SIMPLE
  while (result.includes(digits[0] + digits[0])) {
    result = result.replace(digits[0] + digits[0], digits[0])
  }

  // Remove trailing zero
  if (result.endsWith(digits[0])) {
    result = result.slice(0, -1)
  }

  return (isNegative ? '負' : '') + result
}

// Convert decimal to Chinese
const decimalToChinese = (decimalPart: string, formal: boolean): string => {
  const digits = formal ? DIGITS_FORMAL : DIGITS_SIMPLE
  let result = ''
  for (const char of decimalPart) {
    result += digits[parseInt(char)]
  }
  return result
}

// Full conversion including decimals
const fullNumberToChinese = (input: string, formal: boolean): string => {
  if (!input || input.trim() === '') return ''

  const num = input.trim()

  // Handle decimal numbers
  if (num.includes('.')) {
    const [intPart, decPart] = num.split('.')
    const intNum = parseInt(intPart) || 0
    const intChinese = numberToChinese(intNum, formal)
    const decChinese = decimalToChinese(decPart, formal)
    return intChinese + '點' + decChinese
  }

  const parsed = parseInt(num)
  if (isNaN(parsed)) return ''

  return numberToChinese(parsed, formal)
}

// Money format
const moneyToChinese = (input: string): string => {
  if (!input || input.trim() === '') return ''

  const num = parseFloat(input.trim())
  if (isNaN(num)) return ''

  const isNegative = num < 0
  const absNum = Math.abs(num)

  // Split into integer and decimal parts
  const intPart = Math.floor(absNum)
  const decPart = Math.round((absNum - intPart) * 100)

  const jiao = Math.floor(decPart / 10)
  const fen = decPart % 10

  let result = numberToChinese(intPart, true) + '圓'

  if (jiao > 0) {
    result += DIGITS_FORMAL[jiao] + '角'
  } else if (fen > 0) {
    result += '零'
  }

  if (fen > 0) {
    result += DIGITS_FORMAL[fen] + '分'
  }

  if (jiao === 0 && fen === 0) {
    result += '整'
  }

  return (isNegative ? '負' : '') + result
}

export default function NumberToChinese() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'simple' | 'formal' | 'money'>('simple')
  const { copied, copy } = useClipboard()

  const getOutput = (): string => {
    if (mode === 'money') {
      return moneyToChinese(input)
    }
    return fullNumberToChinese(input, mode === 'formal')
  }

  const output = getOutput()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.numberToChinese.mode')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('simple')}
              className={`px-3 py-1 text-sm rounded ${mode === 'simple' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {t('tools.numberToChinese.simple')}
            </button>
            <button
              onClick={() => setMode('formal')}
              className={`px-3 py-1 text-sm rounded ${mode === 'formal' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {t('tools.numberToChinese.formal')}
            </button>
            <button
              onClick={() => setMode('money')}
              className={`px-3 py-1 text-sm rounded ${mode === 'money' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {t('tools.numberToChinese.money')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.numberToChinese.number')}
            </label>
          </div>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('tools.numberToChinese.numberPlaceholder')}
            rows={6}
            className="font-mono"
          />
          <div className="mt-3 flex justify-end">
            <Button variant="secondary" onClick={() => setInput('')} disabled={!input}>
              {t('common.clear')}
            </Button>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.numberToChinese.chinese')}
            </label>
          </div>
          <TextArea
            value={output}
            readOnly
            placeholder={t('tools.numberToChinese.chinesePlaceholder')}
            rows={6}
            className="font-mono text-lg"
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={() => copy(output)} disabled={!output}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.numberToChinese.reference')}</h3>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 text-center text-sm">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div key={n} className="bg-slate-50 p-2 rounded">
              <div className="text-lg">{n}</div>
              <div className="text-slate-600">{DIGITS_SIMPLE[n]}</div>
              <div className="text-slate-400 text-xs">{DIGITS_FORMAL[n]}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-4 md:grid-cols-8 gap-2 text-center text-sm">
          {[
            ['十', '拾', '10'],
            ['百', '佰', '100'],
            ['千', '仟', '1000'],
            ['萬', '萬', '10⁴'],
            ['億', '億', '10⁸'],
            ['兆', '兆', '10¹²'],
            ['角', '角', '0.1'],
            ['分', '分', '0.01'],
          ].map(([simple, formal, val], i) => (
            <div key={i} className="bg-slate-50 p-2 rounded">
              <div className="text-lg">{simple}</div>
              <div className="text-slate-400 text-xs">{formal}</div>
              <div className="text-slate-500 text-xs">{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
