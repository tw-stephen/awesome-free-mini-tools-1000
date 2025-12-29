import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ScientificNotationCalc() {
  const { t } = useTranslation()
  const [standardInput, setStandardInput] = useState('123456789')
  const [coefficient, setCoefficient] = useState(1.5)
  const [exponent, setExponent] = useState(6)

  // Convert standard to scientific
  const toScientific = (num: number): { coefficient: number; exponent: number } => {
    if (num === 0) return { coefficient: 0, exponent: 0 }

    const sign = num < 0 ? -1 : 1
    num = Math.abs(num)

    let exp = Math.floor(Math.log10(num))
    let coef = num / Math.pow(10, exp)

    // Handle rounding issues
    coef = Math.round(coef * 1e10) / 1e10

    return { coefficient: sign * coef, exponent: exp }
  }

  // Convert scientific to standard
  const toStandard = (coef: number, exp: number): number => {
    return coef * Math.pow(10, exp)
  }

  const standardNum = parseFloat(standardInput) || 0
  const scientific = toScientific(standardNum)
  const standardResult = toStandard(coefficient, exponent)

  // Format scientific notation string
  const formatScientific = (coef: number, exp: number): string => {
    return `${coef.toFixed(6).replace(/\.?0+$/, '')} x 10^${exp}`
  }

  // E notation
  const formatENotation = (coef: number, exp: number): string => {
    return `${coef.toFixed(6).replace(/\.?0+$/, '')}e${exp >= 0 ? '+' : ''}${exp}`
  }

  return (
    <div className="space-y-4">
      {/* Standard to Scientific */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.scientificNotationCalc.toScientific')}</h3>
        <input
          type="text"
          value={standardInput}
          onChange={(e) => setStandardInput(e.target.value)}
          placeholder="123456789"
          className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-lg"
        />

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <div className="text-sm text-slate-500 mb-2">{t('tools.scientificNotationCalc.result')}</div>
          <div className="text-2xl font-mono text-blue-600">
            {formatScientific(scientific.coefficient, scientific.exponent)}
          </div>
          <div className="mt-2 text-sm text-slate-500">
            {t('tools.scientificNotationCalc.eNotation')}: {formatENotation(scientific.coefficient, scientific.exponent)}
          </div>
        </div>
      </div>

      {/* Scientific to Standard */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.scientificNotationCalc.toStandard')}</h3>

        <div className="flex items-center gap-2 justify-center">
          <input
            type="number"
            value={coefficient}
            onChange={(e) => setCoefficient(parseFloat(e.target.value) || 0)}
            className="w-24 px-3 py-2 border border-slate-300 rounded font-mono text-center"
            step="0.1"
          />
          <span className="text-xl">x 10</span>
          <span className="text-xl">^</span>
          <input
            type="number"
            value={exponent}
            onChange={(e) => setExponent(parseInt(e.target.value) || 0)}
            className="w-16 px-3 py-2 border border-slate-300 rounded font-mono text-center"
          />
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded">
          <div className="text-sm text-slate-500 mb-2">{t('tools.scientificNotationCalc.standardForm')}</div>
          <div className="text-2xl font-mono text-green-600 break-all">
            {standardResult.toLocaleString('fullwide', { useGrouping: false })}
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.scientificNotationCalc.quickReference')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { exp: 12, name: 'Trillion' },
            { exp: 9, name: 'Billion' },
            { exp: 6, name: 'Million' },
            { exp: 3, name: 'Thousand' },
            { exp: 0, name: 'One' },
            { exp: -3, name: 'Thousandth' },
            { exp: -6, name: 'Millionth' },
            { exp: -9, name: 'Billionth' },
          ].map(item => (
            <div key={item.exp} className="flex justify-between p-2 bg-slate-50 rounded">
              <span>{item.name}</span>
              <span className="font-mono text-blue-600">10^{item.exp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Common Scientific Constants */}
      <div className="card p-4 bg-purple-50">
        <h3 className="font-medium mb-3">{t('tools.scientificNotationCalc.constants')}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-2 bg-white rounded">
            <span>{t('tools.scientificNotationCalc.speedOfLight')}</span>
            <span className="font-mono">2.998 x 10^8 m/s</span>
          </div>
          <div className="flex justify-between p-2 bg-white rounded">
            <span>{t('tools.scientificNotationCalc.avogadro')}</span>
            <span className="font-mono">6.022 x 10^23</span>
          </div>
          <div className="flex justify-between p-2 bg-white rounded">
            <span>{t('tools.scientificNotationCalc.planck')}</span>
            <span className="font-mono">6.626 x 10^-34 Js</span>
          </div>
          <div className="flex justify-between p-2 bg-white rounded">
            <span>{t('tools.scientificNotationCalc.electronMass')}</span>
            <span className="font-mono">9.109 x 10^-31 kg</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="card p-4 bg-slate-50">
        <h3 className="font-medium mb-2">{t('tools.scientificNotationCalc.about')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.scientificNotationCalc.aboutText')}
        </p>
      </div>
    </div>
  )
}
