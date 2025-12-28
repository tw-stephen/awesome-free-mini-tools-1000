import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Operation = 'add' | 'subtract' | 'multiply' | 'evaluate' | 'derivative'

export default function PolynomialCalculator() {
  const { t } = useTranslation()
  const [poly1, setPoly1] = useState('x^3 + 2x^2 - x + 3')
  const [poly2, setPoly2] = useState('x^2 - 1')
  const [evalPoint, setEvalPoint] = useState('2')
  const [operation, setOperation] = useState<Operation>('add')
  const [result, setResult] = useState<string | null>(null)
  const [evalResult, setEvalResult] = useState<number | null>(null)

  // Parse polynomial string to coefficient array (index = power)
  const parsePolynomial = (expr: string): number[] => {
    const coeffs: number[] = []

    // Clean and normalize
    let clean = expr.replace(/\s/g, '').replace(/-/g, '+-')
    const terms = clean.split('+').filter(t => t.length > 0)

    terms.forEach(term => {
      // Handle x^n
      const powerMatch = term.match(/^([+-]?\d*\.?\d*)?\*?x\^(\d+)$/)
      if (powerMatch) {
        const coef = powerMatch[1] === '' || powerMatch[1] === '+' ? 1 :
                     powerMatch[1] === '-' ? -1 : parseFloat(powerMatch[1])
        const power = parseInt(powerMatch[2])
        while (coeffs.length <= power) coeffs.push(0)
        coeffs[power] = (coeffs[power] || 0) + coef
        return
      }

      // Handle x (power 1)
      const xMatch = term.match(/^([+-]?\d*\.?\d*)?\*?x$/)
      if (xMatch) {
        const coef = xMatch[1] === '' || xMatch[1] === '+' ? 1 :
                     xMatch[1] === '-' ? -1 : parseFloat(xMatch[1])
        while (coeffs.length <= 1) coeffs.push(0)
        coeffs[1] = (coeffs[1] || 0) + coef
        return
      }

      // Handle constant
      const constMatch = term.match(/^([+-]?\d+\.?\d*)$/)
      if (constMatch) {
        if (coeffs.length === 0) coeffs.push(0)
        coeffs[0] = (coeffs[0] || 0) + parseFloat(constMatch[1])
      }
    })

    return coeffs
  }

  // Convert coefficient array back to string
  const formatPolynomial = (coeffs: number[]): string => {
    const terms: string[] = []

    for (let i = coeffs.length - 1; i >= 0; i--) {
      const coef = coeffs[i]
      if (Math.abs(coef) < 0.0001) continue

      let term = ''
      const absCoef = Math.abs(coef)

      if (i === 0) {
        term = absCoef.toString()
      } else if (i === 1) {
        term = absCoef === 1 ? 'x' : `${absCoef}x`
      } else {
        term = absCoef === 1 ? `x^${i}` : `${absCoef}x^${i}`
      }

      if (terms.length === 0) {
        terms.push(coef < 0 ? `-${term}` : term)
      } else {
        terms.push(coef < 0 ? `- ${term}` : `+ ${term}`)
      }
    }

    return terms.length > 0 ? terms.join(' ') : '0'
  }

  const addPolynomials = (p1: number[], p2: number[]): number[] => {
    const maxLen = Math.max(p1.length, p2.length)
    const result: number[] = []
    for (let i = 0; i < maxLen; i++) {
      result[i] = (p1[i] || 0) + (p2[i] || 0)
    }
    return result
  }

  const subtractPolynomials = (p1: number[], p2: number[]): number[] => {
    const maxLen = Math.max(p1.length, p2.length)
    const result: number[] = []
    for (let i = 0; i < maxLen; i++) {
      result[i] = (p1[i] || 0) - (p2[i] || 0)
    }
    return result
  }

  const multiplyPolynomials = (p1: number[], p2: number[]): number[] => {
    const result: number[] = new Array(p1.length + p2.length - 1).fill(0)
    for (let i = 0; i < p1.length; i++) {
      for (let j = 0; j < p2.length; j++) {
        result[i + j] += (p1[i] || 0) * (p2[j] || 0)
      }
    }
    return result
  }

  const derivative = (p: number[]): number[] => {
    if (p.length <= 1) return [0]
    const result: number[] = []
    for (let i = 1; i < p.length; i++) {
      result[i - 1] = p[i] * i
    }
    return result
  }

  const evaluate = (p: number[], x: number): number => {
    let result = 0
    for (let i = 0; i < p.length; i++) {
      result += (p[i] || 0) * Math.pow(x, i)
    }
    return result
  }

  const calculate = () => {
    const p1 = parsePolynomial(poly1)
    const p2 = parsePolynomial(poly2)
    const x = parseFloat(evalPoint)

    switch (operation) {
      case 'add':
        setResult(formatPolynomial(addPolynomials(p1, p2)))
        setEvalResult(null)
        break
      case 'subtract':
        setResult(formatPolynomial(subtractPolynomials(p1, p2)))
        setEvalResult(null)
        break
      case 'multiply':
        setResult(formatPolynomial(multiplyPolynomials(p1, p2)))
        setEvalResult(null)
        break
      case 'evaluate':
        if (!isNaN(x)) {
          setEvalResult(evaluate(p1, x))
          setResult(null)
        }
        break
      case 'derivative':
        setResult(formatPolynomial(derivative(p1)))
        setEvalResult(null)
        break
    }
  }

  const operations = [
    { id: 'add', label: 'P₁ + P₂' },
    { id: 'subtract', label: 'P₁ - P₂' },
    { id: 'multiply', label: 'P₁ × P₂' },
    { id: 'derivative', label: "P₁'" },
    { id: 'evaluate', label: 'P₁(x)' },
  ]

  const needsSecondPoly = ['add', 'subtract', 'multiply'].includes(operation)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">{t('tools.polynomialCalculator.poly1')}</label>
        <input
          type="text"
          value={poly1}
          onChange={(e) => setPoly1(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
          placeholder="x^3 + 2x^2 - x + 3"
        />
        <p className="text-xs text-slate-500 mt-1">{t('tools.polynomialCalculator.hint')}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {operations.map(op => (
          <button
            key={op.id}
            onClick={() => setOperation(op.id as Operation)}
            className={`px-3 py-1.5 rounded text-sm ${
              operation === op.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      {needsSecondPoly && (
        <div className="card p-4">
          <label className="block text-sm font-medium mb-2">{t('tools.polynomialCalculator.poly2')}</label>
          <input
            type="text"
            value={poly2}
            onChange={(e) => setPoly2(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
            placeholder="x^2 - 1"
          />
        </div>
      )}

      {operation === 'evaluate' && (
        <div className="card p-4">
          <label className="block text-sm font-medium mb-2">{t('tools.polynomialCalculator.evaluateAt')}</label>
          <div className="flex items-center gap-2">
            <span className="text-slate-600">x =</span>
            <input
              type="number"
              step="any"
              value={evalPoint}
              onChange={(e) => setEvalPoint(e.target.value)}
              className="w-32 px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      )}

      <button
        onClick={calculate}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t('tools.polynomialCalculator.calculate')}
      </button>

      {result && (
        <div className="card p-4">
          <div className="p-4 bg-green-50 rounded text-center">
            <div className="text-sm text-green-600 mb-1">{t('tools.polynomialCalculator.result')}</div>
            <div className="text-xl font-bold text-green-700 font-mono">
              {result}
            </div>
          </div>
        </div>
      )}

      {evalResult !== null && (
        <div className="card p-4">
          <div className="p-4 bg-purple-50 rounded text-center">
            <div className="text-sm text-purple-600 mb-1">P₁({evalPoint}) =</div>
            <div className="text-2xl font-bold text-purple-700">
              {evalResult.toFixed(6).replace(/\.?0+$/, '')}
            </div>
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.polynomialCalculator.examples')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <button
            onClick={() => setPoly1('x^2 + 2x + 1')}
            className="p-2 bg-white rounded text-left font-mono hover:bg-slate-100"
          >
            x² + 2x + 1
          </button>
          <button
            onClick={() => setPoly1('x^3 - 1')}
            className="p-2 bg-white rounded text-left font-mono hover:bg-slate-100"
          >
            x³ - 1
          </button>
          <button
            onClick={() => setPoly1('2x^4 - 3x^2 + x')}
            className="p-2 bg-white rounded text-left font-mono hover:bg-slate-100"
          >
            2x⁴ - 3x² + x
          </button>
          <button
            onClick={() => setPoly1('x^5 + x^3 + x + 1')}
            className="p-2 bg-white rounded text-left font-mono hover:bg-slate-100"
          >
            x⁵ + x³ + x + 1
          </button>
        </div>
      </div>
    </div>
  )
}
