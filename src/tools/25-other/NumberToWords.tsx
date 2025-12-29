import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function NumberToWords() {
  const { t } = useTranslation()
  const [number, setNumber] = useState('')
  const [language, setLanguage] = useState('en')

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
                'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
                'seventeen', 'eighteen', 'nineteen']
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  const scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']

  const chineseDigits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const chineseUnits = ['', '十', '百', '千']
  const chineseScales = ['', '萬', '億', '兆']

  const convertToEnglish = (num: number): string => {
    if (num === 0) return 'zero'
    if (num < 0) return 'negative ' + convertToEnglish(Math.abs(num))

    let words = ''

    const convertGroup = (n: number): string => {
      if (n === 0) return ''
      if (n < 20) return ones[n]
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ones[n % 10] : '')
      return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' and ' + convertGroup(n % 100) : '')
    }

    let scaleIndex = 0
    let n = num

    while (n > 0) {
      const group = n % 1000
      if (group !== 0) {
        const groupWords = convertGroup(group)
        words = groupWords + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (words ? ' ' + words : '')
      }
      n = Math.floor(n / 1000)
      scaleIndex++
    }

    return words.trim()
  }

  const convertToChinese = (num: number): string => {
    if (num === 0) return '零'
    if (num < 0) return '負' + convertToChinese(Math.abs(num))

    const convertGroup = (n: number): string => {
      if (n === 0) return ''
      let result = ''
      let prevZero = false

      for (let i = 3; i >= 0; i--) {
        const unit = Math.pow(10, i)
        const digit = Math.floor(n / unit) % 10

        if (digit === 0) {
          if (!prevZero && result) prevZero = true
        } else {
          if (prevZero) result += '零'
          if (!(i === 1 && digit === 1 && result === '')) {
            result += chineseDigits[digit]
          }
          result += chineseUnits[i]
          prevZero = false
        }
      }
      return result
    }

    let words = ''
    let scaleIndex = 0
    let n = num
    let prevGroupZero = false

    while (n > 0) {
      const group = n % 10000
      if (group !== 0) {
        const groupWords = convertGroup(group)
        if (prevGroupZero && words) {
          words = groupWords + chineseScales[scaleIndex] + '零' + words
        } else {
          words = groupWords + chineseScales[scaleIndex] + words
        }
        prevGroupZero = false
      } else {
        prevGroupZero = true
      }
      n = Math.floor(n / 10000)
      scaleIndex++
    }

    return words
  }

  const formatWithCommas = (numStr: string): string => {
    const parts = numStr.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  const num = parseInt(number.replace(/,/g, ''))
  const isValidNumber = !isNaN(num) && Math.abs(num) <= 999999999999999

  const result = isValidNumber
    ? language === 'en'
      ? convertToEnglish(num)
      : convertToChinese(num)
    : ''

  const examples = [
    { num: 0, en: 'zero', zh: '零' },
    { num: 12, en: 'twelve', zh: '十二' },
    { num: 100, en: 'one hundred', zh: '一百' },
    { num: 1234, en: 'one thousand two hundred and thirty-four', zh: '一千二百三十四' },
    { num: 1000000, en: 'one million', zh: '一百萬' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.numberToWords.enterNumber')}</h3>
        <input
          type="text"
          value={number}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9-]/g, '')
            setNumber(val)
          }}
          className="w-full px-3 py-2 border border-slate-300 rounded text-lg"
          placeholder="123456"
        />
        {number && (
          <div className="text-sm text-slate-500 mt-2">
            {formatWithCommas(number.replace(/,/g, ''))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.numberToWords.language')}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage('en')}
            className={`flex-1 py-2 rounded transition-colors ${
              language === 'en'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={`flex-1 py-2 rounded transition-colors ${
              language === 'zh'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Chinese
          </button>
        </div>
      </div>

      {result && (
        <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="text-sm text-slate-500 mb-2">{t('tools.numberToWords.result')}</div>
            <div className={`font-medium text-slate-800 ${language === 'zh' ? 'text-2xl' : 'text-xl'}`}>
              {result}
            </div>
          </div>
        </div>
      )}

      {!isValidNumber && number && (
        <div className="card p-4 bg-red-50">
          <div className="text-red-600 text-sm">
            {t('tools.numberToWords.invalidNumber')}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.numberToWords.quickExamples')}</h3>
        <div className="space-y-2">
          {examples.map(ex => (
            <button
              key={ex.num}
              onClick={() => setNumber(ex.num.toString())}
              className="w-full p-2 bg-slate-50 hover:bg-slate-100 rounded text-left transition-colors"
            >
              <div className="font-medium text-slate-700">{formatWithCommas(ex.num.toString())}</div>
              <div className="text-sm text-slate-500">
                {language === 'en' ? ex.en : ex.zh}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.numberToWords.info')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.numberToWords.info1')}</li>
          <li>{t('tools.numberToWords.info2')}</li>
          <li>{t('tools.numberToWords.info3')}</li>
        </ul>
      </div>
    </div>
  )
}
