import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Fraction {
  numerator: number
  denominator: number
}

export default function FractionCalculator() {
  const { t } = useTranslation()
  const [fraction1, setFraction1] = useState<Fraction>({ numerator: 1, denominator: 2 })
  const [fraction2, setFraction2] = useState<Fraction>({ numerator: 1, denominator: 4 })
  const [operation, setOperation] = useState<'+' | '-' | '×' | '÷'>('+')

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

  const simplify = (f: Fraction): Fraction => {
    if (f.denominator === 0) return { numerator: 0, denominator: 1 }
    const divisor = gcd(f.numerator, f.denominator)
    let num = f.numerator / divisor
    let den = f.denominator / divisor
    if (den < 0) {
      num = -num
      den = -den
    }
    return { numerator: num, denominator: den }
  }

  const calculate = (): Fraction => {
    const { numerator: n1, denominator: d1 } = fraction1
    const { numerator: n2, denominator: d2 } = fraction2

    switch (operation) {
      case '+':
        return simplify({
          numerator: n1 * d2 + n2 * d1,
          denominator: d1 * d2,
        })
      case '-':
        return simplify({
          numerator: n1 * d2 - n2 * d1,
          denominator: d1 * d2,
        })
      case '×':
        return simplify({
          numerator: n1 * n2,
          denominator: d1 * d2,
        })
      case '÷':
        return simplify({
          numerator: n1 * d2,
          denominator: d1 * n2,
        })
    }
  }

  const result = calculate()

  const toMixed = (f: Fraction): string => {
    if (f.denominator === 0) return 'undefined'
    const whole = Math.floor(Math.abs(f.numerator) / f.denominator)
    const remainder = Math.abs(f.numerator) % f.denominator
    const sign = f.numerator < 0 ? '-' : ''

    if (whole === 0) return `${sign}${remainder}/${f.denominator}`
    if (remainder === 0) return `${sign}${whole}`
    return `${sign}${whole} ${remainder}/${f.denominator}`
  }

  const toDecimal = (f: Fraction): string => {
    if (f.denominator === 0) return 'undefined'
    return (f.numerator / f.denominator).toFixed(4).replace(/\.?0+$/, '')
  }

  const toPercent = (f: Fraction): string => {
    if (f.denominator === 0) return 'undefined'
    return ((f.numerator / f.denominator) * 100).toFixed(2) + '%'
  }

  const FractionInput = ({
    value,
    onChange,
    label,
  }: {
    value: Fraction
    onChange: (f: Fraction) => void
    label: string
  }) => (
    <div className="card p-4">
      <label className="text-sm text-slate-500 block mb-2">{label}</label>
      <div className="flex items-center justify-center gap-2">
        <input
          type="number"
          value={value.numerator}
          onChange={(e) => onChange({ ...value, numerator: parseInt(e.target.value) || 0 })}
          className="w-16 px-2 py-2 text-center text-xl border border-slate-300 rounded"
        />
        <div className="text-2xl text-slate-400">/</div>
        <input
          type="number"
          value={value.denominator}
          onChange={(e) => onChange({ ...value, denominator: parseInt(e.target.value) || 1 })}
          className="w-16 px-2 py-2 text-center text-xl border border-slate-300 rounded"
        />
      </div>
      <div className="text-center text-sm text-slate-500 mt-2">
        = {toDecimal(value)}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <FractionInput
        value={fraction1}
        onChange={setFraction1}
        label="First Fraction"
      />

      <div className="flex justify-center gap-2">
        {(['+', '-', '×', '÷'] as const).map(op => (
          <button
            key={op}
            onClick={() => setOperation(op)}
            className={`w-12 h-12 rounded-full text-xl font-bold
              ${operation === op ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            {op}
          </button>
        ))}
      </div>

      <FractionInput
        value={fraction2}
        onChange={setFraction2}
        label="Second Fraction"
      />

      <div className="card p-6 bg-green-50 text-center">
        <div className="text-sm text-green-600 mb-2">Result</div>
        <div className="text-4xl font-bold text-green-700">
          {result.numerator}/{result.denominator}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div className="p-2 bg-white rounded">
            <div className="text-slate-500">Mixed</div>
            <div className="font-medium">{toMixed(result)}</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-slate-500">Decimal</div>
            <div className="font-medium">{toDecimal(result)}</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-slate-500">Percent</div>
            <div className="font-medium">{toPercent(result)}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fractionCalculator.steps')}</h3>
        <div className="space-y-2 text-sm">
          {operation === '+' && (
            <>
              <div className="p-2 bg-slate-50 rounded">
                1. Find common denominator: {fraction1.denominator} × {fraction2.denominator} = {fraction1.denominator * fraction2.denominator}
              </div>
              <div className="p-2 bg-slate-50 rounded">
                2. Convert fractions: {fraction1.numerator * fraction2.denominator}/{fraction1.denominator * fraction2.denominator} + {fraction2.numerator * fraction1.denominator}/{fraction1.denominator * fraction2.denominator}
              </div>
              <div className="p-2 bg-slate-50 rounded">
                3. Add numerators: {fraction1.numerator * fraction2.denominator + fraction2.numerator * fraction1.denominator}/{fraction1.denominator * fraction2.denominator}
              </div>
              <div className="p-2 bg-slate-50 rounded">
                4. Simplify: {result.numerator}/{result.denominator}
              </div>
            </>
          )}
          {operation === '-' && (
            <>
              <div className="p-2 bg-slate-50 rounded">
                1. Find common denominator: {fraction1.denominator * fraction2.denominator}
              </div>
              <div className="p-2 bg-slate-50 rounded">
                2. Subtract numerators: {fraction1.numerator * fraction2.denominator} - {fraction2.numerator * fraction1.denominator}
              </div>
              <div className="p-2 bg-slate-50 rounded">
                3. Simplify: {result.numerator}/{result.denominator}
              </div>
            </>
          )}
          {operation === '×' && (
            <>
              <div className="p-2 bg-slate-50 rounded">
                1. Multiply numerators: {fraction1.numerator} × {fraction2.numerator} = {fraction1.numerator * fraction2.numerator}
              </div>
              <div className="p-2 bg-slate-50 rounded">
                2. Multiply denominators: {fraction1.denominator} × {fraction2.denominator} = {fraction1.denominator * fraction2.denominator}
              </div>
              <div className="p-2 bg-slate-50 rounded">
                3. Simplify: {result.numerator}/{result.denominator}
              </div>
            </>
          )}
          {operation === '÷' && (
            <>
              <div className="p-2 bg-slate-50 rounded">
                1. Flip the second fraction: {fraction2.denominator}/{fraction2.numerator}
              </div>
              <div className="p-2 bg-slate-50 rounded">
                2. Multiply: {fraction1.numerator}/{fraction1.denominator} × {fraction2.denominator}/{fraction2.numerator}
              </div>
              <div className="p-2 bg-slate-50 rounded">
                3. Simplify: {result.numerator}/{result.denominator}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
