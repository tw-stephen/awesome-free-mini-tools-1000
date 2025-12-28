import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface DerivativeRule {
  name: string
  original: string
  derivative: string
  example?: string
}

export default function DerivativeCalculator() {
  const { t } = useTranslation()
  const [expression, setExpression] = useState('x^2 + 3x + 5')
  const [point, setPoint] = useState('2')
  const [result, setResult] = useState<{
    derivative: string
    valueAtPoint?: number
    steps: string[]
  } | null>(null)

  // Simple polynomial derivative calculator
  const parseAndDerive = (expr: string): { derivative: string; steps: string[] } => {
    const steps: string[] = []
    const terms: string[] = []

    // Clean up expression
    let cleanExpr = expr.replace(/\s/g, '')
    cleanExpr = cleanExpr.replace(/-/g, '+-')

    const parts = cleanExpr.split('+').filter(p => p.length > 0)

    parts.forEach(part => {
      // Handle x^n
      const powerMatch = part.match(/^([+-]?\d*\.?\d*)?\*?x\^(\d+)$/)
      if (powerMatch) {
        const coef = powerMatch[1] ? parseFloat(powerMatch[1]) || 1 : 1
        const power = parseInt(powerMatch[2])
        const newCoef = coef * power
        const newPower = power - 1

        steps.push(`d/dx(${coef === 1 ? '' : coef}x^${power}) = ${newCoef}x^${newPower}`)

        if (newPower === 0) {
          terms.push(newCoef.toString())
        } else if (newPower === 1) {
          terms.push(newCoef === 1 ? 'x' : `${newCoef}x`)
        } else {
          terms.push(newCoef === 1 ? `x^${newPower}` : `${newCoef}x^${newPower}`)
        }
        return
      }

      // Handle x (just x, coefficient of 1)
      const xMatch = part.match(/^([+-]?\d*\.?\d*)?\*?x$/)
      if (xMatch) {
        const coef = xMatch[1] ? parseFloat(xMatch[1]) || 1 : 1
        steps.push(`d/dx(${coef === 1 ? '' : coef}x) = ${coef}`)
        terms.push(coef.toString())
        return
      }

      // Handle constant
      const constMatch = part.match(/^([+-]?\d+\.?\d*)$/)
      if (constMatch) {
        steps.push(`d/dx(${constMatch[1]}) = 0`)
        // Don't add constant terms (derivative is 0)
        return
      }

      // Handle sin(x)
      if (part.includes('sin(x)')) {
        const coefMatch = part.match(/^([+-]?\d*\.?\d*)\*?sin\(x\)$/)
        const coef = coefMatch && coefMatch[1] ? parseFloat(coefMatch[1]) || 1 : 1
        steps.push(`d/dx(${coef === 1 ? '' : coef}sin(x)) = ${coef === 1 ? '' : coef}cos(x)`)
        terms.push(coef === 1 ? 'cos(x)' : `${coef}cos(x)`)
        return
      }

      // Handle cos(x)
      if (part.includes('cos(x)')) {
        const coefMatch = part.match(/^([+-]?\d*\.?\d*)\*?cos\(x\)$/)
        const coef = coefMatch && coefMatch[1] ? parseFloat(coefMatch[1]) || 1 : 1
        steps.push(`d/dx(${coef === 1 ? '' : coef}cos(x)) = ${coef === 1 ? '-' : -coef}sin(x)`)
        terms.push(`${-coef}sin(x)`)
        return
      }

      // Handle e^x
      if (part.includes('e^x')) {
        const coefMatch = part.match(/^([+-]?\d*\.?\d*)\*?e\^x$/)
        const coef = coefMatch && coefMatch[1] ? parseFloat(coefMatch[1]) || 1 : 1
        steps.push(`d/dx(${coef === 1 ? '' : coef}e^x) = ${coef === 1 ? '' : coef}e^x`)
        terms.push(coef === 1 ? 'e^x' : `${coef}e^x`)
        return
      }

      // Handle ln(x)
      if (part.includes('ln(x)')) {
        const coefMatch = part.match(/^([+-]?\d*\.?\d*)\*?ln\(x\)$/)
        const coef = coefMatch && coefMatch[1] ? parseFloat(coefMatch[1]) || 1 : 1
        steps.push(`d/dx(${coef === 1 ? '' : coef}ln(x)) = ${coef === 1 ? '' : coef}/x`)
        terms.push(coef === 1 ? '1/x' : `${coef}/x`)
        return
      }
    })

    const derivative = terms.length > 0 ? terms.join(' + ').replace(/\+ -/g, '- ') : '0'
    return { derivative, steps }
  }

  const evaluateDerivative = (derivative: string, x: number): number => {
    try {
      let expr = derivative
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/ln/g, 'Math.log')
        .replace(/e\*\*x/g, 'Math.exp(x)')
        .replace(/x/g, `(${x})`)

      return new Function(`return ${expr}`)()
    } catch {
      return NaN
    }
  }

  const calculate = () => {
    const { derivative, steps } = parseAndDerive(expression)
    const x = parseFloat(point)
    let valueAtPoint: number | undefined

    if (!isNaN(x)) {
      valueAtPoint = evaluateDerivative(derivative, x)
    }

    setResult({ derivative, valueAtPoint, steps })
  }

  const rules: DerivativeRule[] = [
    { name: 'Constant', original: 'c', derivative: '0' },
    { name: 'Power Rule', original: 'xⁿ', derivative: 'n × xⁿ⁻¹' },
    { name: 'Sum Rule', original: 'f(x) + g(x)', derivative: "f'(x) + g'(x)" },
    { name: 'Product Rule', original: 'f(x) × g(x)', derivative: "f'(x)g(x) + f(x)g'(x)" },
    { name: 'Quotient Rule', original: 'f(x) / g(x)', derivative: "(f'g - fg') / g²" },
    { name: 'Chain Rule', original: 'f(g(x))', derivative: "f'(g(x)) × g'(x)" },
    { name: 'Sine', original: 'sin(x)', derivative: 'cos(x)' },
    { name: 'Cosine', original: 'cos(x)', derivative: '-sin(x)' },
    { name: 'Exponential', original: 'eˣ', derivative: 'eˣ' },
    { name: 'Natural Log', original: 'ln(x)', derivative: '1/x' },
  ]

  const examples = [
    'x^2',
    '3x^3 + 2x^2 + x',
    'x^4 - 2x^2 + 1',
    'sin(x)',
    'cos(x)',
    'e^x',
    'ln(x)',
    '2sin(x) + 3cos(x)',
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.derivativeCalculator.enterFunction')}
        </label>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-slate-600">f(x) =</span>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono"
            placeholder="x^2 + 3x + 5"
          />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-slate-600 text-sm">{t('tools.derivativeCalculator.evaluateAt')}</span>
          <span className="text-slate-600">x =</span>
          <input
            type="number"
            step="any"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            className="w-24 px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('tools.derivativeCalculator.findDerivative')}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-slate-500">{t('tools.derivativeCalculator.tryExamples')}:</span>
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setExpression(ex)}
            className="px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200 font-mono"
          >
            {ex}
          </button>
        ))}
      </div>

      {result && (
        <div className="card p-4 space-y-4">
          <div className="p-4 bg-green-50 rounded">
            <div className="text-sm text-green-600 mb-1">f'(x) =</div>
            <div className="text-2xl font-bold text-green-700 font-mono">
              {result.derivative}
            </div>
          </div>

          {result.valueAtPoint !== undefined && !isNaN(result.valueAtPoint) && (
            <div className="p-4 bg-blue-50 rounded">
              <div className="text-sm text-blue-600 mb-1">f'({point}) =</div>
              <div className="text-xl font-bold text-blue-700">
                {result.valueAtPoint.toFixed(6).replace(/\.?0+$/, '')}
              </div>
            </div>
          )}

          {result.steps.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">{t('tools.derivativeCalculator.steps')}</h4>
              <div className="space-y-1">
                {result.steps.map((step, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded font-mono text-sm">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-3">{t('tools.derivativeCalculator.rules')}</h4>
        <div className="grid grid-cols-2 gap-2">
          {rules.map((rule, i) => (
            <div key={i} className="p-2 bg-white rounded">
              <div className="text-xs text-slate-500">{rule.name}</div>
              <div className="font-mono text-sm">
                <span className="text-blue-600">{rule.original}</span>
                <span className="text-slate-400"> → </span>
                <span className="text-green-600">{rule.derivative}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
