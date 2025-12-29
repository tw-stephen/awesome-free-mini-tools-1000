import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function FractionCalc() {
  const { t } = useTranslation()
  const [num1, setNum1] = useState(1)
  const [den1, setDen1] = useState(2)
  const [num2, setNum2] = useState(1)
  const [den2, setDen2] = useState(4)
  const [operation, setOperation] = useState<'+' | '-' | 'x' | '/'>( '+')

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b) {
      const t = b
      b = a % b
      a = t
    }
    return a
  }

  const simplify = (num: number, den: number): { num: number; den: number } => {
    const g = gcd(num, den)
    return { num: num / g, den: den / g }
  }

  const calculate = () => {
    let resultNum: number
    let resultDen: number

    switch (operation) {
      case '+':
        resultNum = num1 * den2 + num2 * den1
        resultDen = den1 * den2
        break
      case '-':
        resultNum = num1 * den2 - num2 * den1
        resultDen = den1 * den2
        break
      case 'x':
        resultNum = num1 * num2
        resultDen = den1 * den2
        break
      case '/':
        resultNum = num1 * den2
        resultDen = den1 * num2
        break
      default:
        return { num: 0, den: 1, decimal: 0 }
    }

    const simplified = simplify(resultNum, resultDen)
    return {
      num: simplified.num,
      den: simplified.den,
      decimal: resultNum / resultDen
    }
  }

  const result = calculate()

  // Single fraction simplification
  const [simplifyNum, setSimplifyNum] = useState(24)
  const [simplifyDen, setSimplifyDen] = useState(36)
  const simplified = simplify(simplifyNum, simplifyDen)

  // Decimal to fraction
  const [decimal, setDecimal] = useState(0.75)

  const decimalToFraction = (dec: number): { num: number; den: number } => {
    const precision = 10000
    const num = Math.round(dec * precision)
    const den = precision
    return simplify(num, den)
  }

  const decimalResult = decimalToFraction(decimal)

  // Fraction to decimal
  const [fracNum, setFracNum] = useState(3)
  const [fracDen, setFracDen] = useState(8)

  return (
    <div className="space-y-4">
      {/* Fraction Calculator */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fractionCalc.calculator')}</h3>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="text-center">
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
            />
            <div className="border-t-2 border-slate-400 my-1"></div>
            <input
              type="number"
              value={den1}
              onChange={(e) => setDen1(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
            />
          </div>

          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as '+' | '-' | 'x' | '/')}
            className="w-12 h-12 text-xl font-bold text-center border border-slate-300 rounded"
          >
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="x">x</option>
            <option value="/">/</option>
          </select>

          <div className="text-center">
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
            />
            <div className="border-t-2 border-slate-400 my-1"></div>
            <input
              type="number"
              value={den2}
              onChange={(e) => setDen2(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
            />
          </div>

          <span className="text-2xl">=</span>

          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-xl font-bold text-blue-600">{result.num}</div>
            <div className="border-t-2 border-blue-400 my-1"></div>
            <div className="text-xl font-bold text-blue-600">{result.den}</div>
          </div>
        </div>

        <div className="text-center mt-3 text-sm text-slate-500">
          = {result.decimal.toFixed(6)} ({t('tools.fractionCalc.decimal')})
        </div>
      </div>

      {/* Simplify Fraction */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fractionCalc.simplify')}</h3>

        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <input
              type="number"
              value={simplifyNum}
              onChange={(e) => setSimplifyNum(parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
            />
            <div className="border-t-2 border-slate-400 my-1"></div>
            <input
              type="number"
              value={simplifyDen}
              onChange={(e) => setSimplifyDen(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
            />
          </div>

          <span className="text-2xl">=</span>

          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-xl font-bold text-green-600">{simplified.num}</div>
            <div className="border-t-2 border-green-400 my-1"></div>
            <div className="text-xl font-bold text-green-600">{simplified.den}</div>
          </div>
        </div>

        <div className="text-center mt-2 text-xs text-slate-500">
          GCD = {gcd(simplifyNum, simplifyDen)}
        </div>
      </div>

      {/* Decimal to Fraction */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fractionCalc.decimalToFraction')}</h3>

        <div className="flex items-center justify-center gap-4">
          <input
            type="number"
            value={decimal}
            onChange={(e) => setDecimal(parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-center"
            step="0.01"
          />

          <span className="text-2xl">=</span>

          <div className="text-center p-3 bg-purple-50 rounded">
            <div className="text-xl font-bold text-purple-600">{decimalResult.num}</div>
            <div className="border-t-2 border-purple-400 my-1"></div>
            <div className="text-xl font-bold text-purple-600">{decimalResult.den}</div>
          </div>
        </div>
      </div>

      {/* Fraction to Decimal */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fractionCalc.fractionToDecimal')}</h3>

        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <input
              type="number"
              value={fracNum}
              onChange={(e) => setFracNum(parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
            />
            <div className="border-t-2 border-slate-400 my-1"></div>
            <input
              type="number"
              value={fracDen}
              onChange={(e) => setFracDen(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
            />
          </div>

          <span className="text-2xl">=</span>

          <div className="p-3 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">
              {(fracNum / fracDen).toFixed(6)}
            </div>
          </div>
        </div>
      </div>

      {/* Common Fractions */}
      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.fractionCalc.commonFractions')}</h3>
        <div className="grid grid-cols-4 gap-2 text-sm">
          {[
            { num: 1, den: 2, dec: '0.5' },
            { num: 1, den: 3, dec: '0.333' },
            { num: 1, den: 4, dec: '0.25' },
            { num: 1, den: 5, dec: '0.2' },
            { num: 2, den: 3, dec: '0.667' },
            { num: 3, den: 4, dec: '0.75' },
            { num: 1, den: 8, dec: '0.125' },
            { num: 3, den: 8, dec: '0.375' },
          ].map((f, i) => (
            <div key={i} className="text-center p-2 bg-white rounded">
              <div className="font-bold">{f.num}/{f.den}</div>
              <div className="text-xs text-slate-500">= {f.dec}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
