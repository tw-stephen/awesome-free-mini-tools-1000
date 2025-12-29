import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SignificantFiguresCalc() {
  const { t } = useTranslation()
  const [input, setInput] = useState('0.00450')
  const [roundTo, setRoundTo] = useState(3)

  const countSigFigs = (numStr: string): number => {
    // Remove leading/trailing spaces
    numStr = numStr.trim()

    // Handle scientific notation
    if (numStr.toLowerCase().includes('e')) {
      const parts = numStr.toLowerCase().split('e')
      return countSigFigs(parts[0])
    }

    // Remove the decimal point and minus sign
    let cleaned = numStr.replace(/[.-]/g, '')

    // Remove leading zeros
    cleaned = cleaned.replace(/^0+/, '')

    // If all zeros or empty, check for trailing zeros after decimal
    if (cleaned === '') {
      // Check if original had decimal
      if (numStr.includes('.')) {
        return numStr.replace('.', '').replace(/^0+/, '').length || 1
      }
      return 1
    }

    // Count remaining digits
    return cleaned.length
  }

  const roundToSigFigs = (num: number, sigFigs: number): string => {
    if (num === 0) return '0'
    if (sigFigs < 1) return num.toString()

    const magnitude = Math.floor(Math.log10(Math.abs(num)))
    const multiplier = Math.pow(10, sigFigs - magnitude - 1)
    const rounded = Math.round(num * multiplier) / multiplier

    // Format with proper precision
    const precision = Math.max(0, sigFigs - magnitude - 1)
    return rounded.toFixed(precision)
  }

  const sigFigs = countSigFigs(input)
  const numValue = parseFloat(input) || 0
  const rounded = roundToSigFigs(numValue, roundTo)

  // Highlight significant digits
  const highlightSigFigs = (str: string): { char: string; isSig: boolean }[] => {
    const result: { char: string; isSig: boolean }[] = []
    let sigCount = 0
    const total = countSigFigs(str)
    let foundNonZero = false
    let inDecimal = false

    for (const char of str) {
      if (char === '.') {
        result.push({ char, isSig: false })
        inDecimal = true
        continue
      }
      if (char === '-' || char === '+') {
        result.push({ char, isSig: false })
        continue
      }

      if (char !== '0') foundNonZero = true

      const isSig = foundNonZero && sigCount < total
      if (isSig) sigCount++

      result.push({ char, isSig })
    }

    return result
  }

  const highlighted = highlightSigFigs(input)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.significantFiguresCalc.countSigFigs')}</h3>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="0.00450"
          className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-xl"
        />

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <div className="text-center mb-3">
            <span className="text-4xl font-bold text-blue-600">{sigFigs}</span>
            <span className="text-lg text-slate-500 ml-2">{t('tools.significantFiguresCalc.sigFigs')}</span>
          </div>

          <div className="flex justify-center gap-1 font-mono text-2xl">
            {highlighted.map((item, i) => (
              <span
                key={i}
                className={item.isSig ? 'bg-yellow-300 px-1 rounded' : 'text-slate-400'}
              >
                {item.char}
              </span>
            ))}
          </div>
          <div className="text-center text-xs text-slate-500 mt-2">
            {t('tools.significantFiguresCalc.highlighted')}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.significantFiguresCalc.roundTo')}</h3>

        <div className="flex items-center gap-3 justify-center">
          <span>{t('tools.significantFiguresCalc.roundNumber')}</span>
          <input
            type="number"
            value={roundTo}
            onChange={(e) => setRoundTo(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 px-3 py-2 border border-slate-300 rounded text-center"
            min="1"
            max="15"
          />
          <span>{t('tools.significantFiguresCalc.sigFigs')}</span>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded text-center">
          <div className="text-sm text-slate-500 mb-1">{t('tools.significantFiguresCalc.result')}</div>
          <div className="text-3xl font-mono font-bold text-green-600">{rounded}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.significantFiguresCalc.rules')}</h3>
        <ul className="text-sm text-slate-600 space-y-2">
          <li className="p-2 bg-slate-50 rounded">
            <strong>1.</strong> {t('tools.significantFiguresCalc.rule1')}
          </li>
          <li className="p-2 bg-slate-50 rounded">
            <strong>2.</strong> {t('tools.significantFiguresCalc.rule2')}
          </li>
          <li className="p-2 bg-slate-50 rounded">
            <strong>3.</strong> {t('tools.significantFiguresCalc.rule3')}
          </li>
          <li className="p-2 bg-slate-50 rounded">
            <strong>4.</strong> {t('tools.significantFiguresCalc.rule4')}
          </li>
          <li className="p-2 bg-slate-50 rounded">
            <strong>5.</strong> {t('tools.significantFiguresCalc.rule5')}
          </li>
        </ul>
      </div>

      <div className="card p-4 bg-purple-50">
        <h3 className="font-medium mb-3">{t('tools.significantFiguresCalc.examples')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { num: '123', sf: 3 },
            { num: '0.00450', sf: 3 },
            { num: '1000', sf: 1 },
            { num: '1000.', sf: 4 },
            { num: '1.00', sf: 3 },
            { num: '0.001', sf: 1 },
            { num: '1200.0', sf: 5 },
            { num: '3.14159', sf: 6 },
          ].map((ex, i) => (
            <div key={i} className="flex justify-between p-2 bg-white rounded">
              <span className="font-mono">{ex.num}</span>
              <span className="text-purple-600">{ex.sf} sig figs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
