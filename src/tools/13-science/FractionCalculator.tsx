import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Operation = 'add' | 'subtract' | 'multiply' | 'divide'

interface Fraction {
  numerator: number
  denominator: number
}

export default function FractionCalculator() {
  const { t } = useTranslation()
  const [num1, setNum1] = useState('1')
  const [den1, setDen1] = useState('2')
  const [num2, setNum2] = useState('1')
  const [den2, setDen2] = useState('3')
  const [operation, setOperation] = useState<Operation>('add')
  const [result, setResult] = useState<{
    fraction: Fraction
    simplified: Fraction
    mixed: string
    decimal: number
  } | null>(null)

  // Convert single value for simplification
  const [simplifyNum, setSimplifyNum] = useState('')
  const [simplifyDen, setSimplifyDen] = useState('')
  const [simplifiedResult, setSimplifiedResult] = useState<Fraction | null>(null)

  // Convert decimal to fraction
  const [decimalInput, setDecimalInput] = useState('')
  const [decimalResult, setDecimalResult] = useState<Fraction | null>(null)

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }

  const simplify = (num: number, den: number): Fraction => {
    if (den === 0) return { numerator: num, denominator: den }
    const divisor = gcd(num, den)
    const sign = den < 0 ? -1 : 1
    return {
      numerator: sign * num / divisor,
      denominator: sign * den / divisor,
    }
  }

  const toMixed = (num: number, den: number): string => {
    if (den === 0) return 'undefined'
    const simplified = simplify(num, den)
    const n = simplified.numerator
    const d = simplified.denominator

    if (Math.abs(n) < Math.abs(d)) {
      return `${n}/${d}`
    }

    const whole = Math.trunc(n / d)
    const remainder = Math.abs(n % d)

    if (remainder === 0) {
      return whole.toString()
    }

    return `${whole} ${remainder}/${Math.abs(d)}`
  }

  const calculate = () => {
    const n1 = parseInt(num1)
    const d1 = parseInt(den1)
    const n2 = parseInt(num2)
    const d2 = parseInt(den2)

    if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
      setResult(null)
      return
    }

    if (d1 === 0 || d2 === 0) {
      setResult(null)
      return
    }

    let resNum: number, resDen: number

    switch (operation) {
      case 'add':
        resNum = n1 * d2 + n2 * d1
        resDen = d1 * d2
        break
      case 'subtract':
        resNum = n1 * d2 - n2 * d1
        resDen = d1 * d2
        break
      case 'multiply':
        resNum = n1 * n2
        resDen = d1 * d2
        break
      case 'divide':
        if (n2 === 0) {
          setResult(null)
          return
        }
        resNum = n1 * d2
        resDen = d1 * n2
        break
    }

    const simplified = simplify(resNum, resDen)

    setResult({
      fraction: { numerator: resNum, denominator: resDen },
      simplified,
      mixed: toMixed(resNum, resDen),
      decimal: resNum / resDen,
    })
  }

  const handleSimplify = () => {
    const num = parseInt(simplifyNum)
    const den = parseInt(simplifyDen)
    if (isNaN(num) || isNaN(den) || den === 0) {
      setSimplifiedResult(null)
      return
    }
    setSimplifiedResult(simplify(num, den))
  }

  const decimalToFraction = (decimal: number, tolerance = 1e-10): Fraction => {
    const sign = decimal < 0 ? -1 : 1
    decimal = Math.abs(decimal)

    let h1 = 1, h2 = 0
    let k1 = 0, k2 = 1
    let b = decimal

    while (Math.abs(decimal - h1 / k1) > decimal * tolerance) {
      const a = Math.floor(b)
      const aux = h1
      h1 = a * h1 + h2
      h2 = aux
      const aux2 = k1
      k1 = a * k1 + k2
      k2 = aux2
      b = 1 / (b - a)
      if (k1 > 1000000) break
    }

    return { numerator: sign * h1, denominator: k1 }
  }

  const handleDecimalConvert = () => {
    const dec = parseFloat(decimalInput)
    if (isNaN(dec)) {
      setDecimalResult(null)
      return
    }
    setDecimalResult(decimalToFraction(dec))
  }

  const operations = [
    { id: 'add', symbol: '+' },
    { id: 'subtract', symbol: '−' },
    { id: 'multiply', symbol: '×' },
    { id: 'divide', symbol: '÷' },
  ]

  const FractionInput = ({ num, den, setNum, setDen, label }: {
    num: string
    den: string
    setNum: (v: string) => void
    setDen: (v: string) => void
    label: string
  }) => (
    <div className="flex flex-col items-center">
      <span className="text-xs text-slate-500 mb-1">{label}</span>
      <div className="flex flex-col items-center">
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
        />
        <div className="w-14 h-px bg-slate-400 my-1" />
        <input
          type="number"
          value={den}
          onChange={(e) => setDen(e.target.value)}
          className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fractionCalculator.calculate')}</h3>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
          <FractionInput num={num1} den={den1} setNum={setNum1} setDen={setDen1} label="A" />

          <div className="flex gap-1">
            {operations.map(op => (
              <button
                key={op.id}
                onClick={() => setOperation(op.id as Operation)}
                className={`w-10 h-10 rounded text-lg font-bold ${
                  operation === op.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {op.symbol}
              </button>
            ))}
          </div>

          <FractionInput num={num2} den={den2} setNum={setNum2} setDen={setDen2} label="B" />
        </div>

        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('tools.fractionCalculator.calculateBtn')}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-slate-50 rounded">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs text-slate-500">{t('tools.fractionCalculator.result')}</div>
                <div className="font-mono text-lg">
                  {result.fraction.numerator}/{result.fraction.denominator}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">{t('tools.fractionCalculator.simplified')}</div>
                <div className="font-mono text-lg font-bold text-green-600">
                  {result.simplified.numerator}/{result.simplified.denominator}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">{t('tools.fractionCalculator.mixed')}</div>
                <div className="font-mono text-lg">{result.mixed}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">{t('tools.fractionCalculator.decimal')}</div>
                <div className="font-mono text-lg">{result.decimal.toFixed(6)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.fractionCalculator.simplifyTitle')}</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex flex-col items-center">
              <input
                type="number"
                value={simplifyNum}
                onChange={(e) => setSimplifyNum(e.target.value)}
                placeholder="num"
                className="w-20 px-2 py-1 border border-slate-300 rounded text-center text-sm"
              />
              <div className="w-16 h-px bg-slate-400 my-1" />
              <input
                type="number"
                value={simplifyDen}
                onChange={(e) => setSimplifyDen(e.target.value)}
                placeholder="den"
                className="w-20 px-2 py-1 border border-slate-300 rounded text-center text-sm"
              />
            </div>
            <button
              onClick={handleSimplify}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              →
            </button>
            {simplifiedResult && (
              <div className="font-mono text-lg font-bold text-green-600">
                {simplifiedResult.numerator}/{simplifiedResult.denominator}
              </div>
            )}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.fractionCalculator.decimalToFraction')}</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              placeholder="0.333"
              className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
            />
            <button
              onClick={handleDecimalConvert}
              className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
            >
              →
            </button>
            {decimalResult && (
              <div className="font-mono text-lg font-bold text-purple-600">
                {decimalResult.numerator}/{decimalResult.denominator}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.fractionCalculator.commonFractions')}</h4>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-center text-sm">
          {[
            { frac: '1/2', dec: '0.5' },
            { frac: '1/3', dec: '0.333' },
            { frac: '1/4', dec: '0.25' },
            { frac: '1/5', dec: '0.2' },
            { frac: '2/3', dec: '0.667' },
            { frac: '3/4', dec: '0.75' },
            { frac: '1/8', dec: '0.125' },
            { frac: '3/8', dec: '0.375' },
          ].map(({ frac, dec }) => (
            <div key={frac} className="p-2 bg-white rounded">
              <div className="font-mono font-bold">{frac}</div>
              <div className="text-xs text-slate-500">= {dec}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
