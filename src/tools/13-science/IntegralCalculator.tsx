import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type CalcMode = 'indefinite' | 'definite'

export default function IntegralCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<CalcMode>('indefinite')
  const [expression, setExpression] = useState('x^2')
  const [lowerBound, setLowerBound] = useState('0')
  const [upperBound, setUpperBound] = useState('1')
  const [result, setResult] = useState<{
    integral: string
    definiteValue?: number
    steps: string[]
  } | null>(null)

  // Simple polynomial integral calculator
  const parseAndIntegrate = (expr: string): { integral: string; steps: string[] } => {
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
        const newPower = power + 1
        const newCoef = coef / newPower

        steps.push(`∫${coef === 1 ? '' : coef}x^${power} dx = ${newCoef === 1 ? '' : newCoef.toFixed(4).replace(/\.?0+$/, '')}x^${newPower}`)

        const coefStr = newCoef === 1 ? '' : newCoef.toFixed(4).replace(/\.?0+$/, '')
        terms.push(`${coefStr}x^${newPower}`)
        return
      }

      // Handle x (just x, power of 1)
      const xMatch = part.match(/^([+-]?\d*\.?\d*)?\*?x$/)
      if (xMatch) {
        const coef = xMatch[1] ? parseFloat(xMatch[1]) || 1 : 1
        const newCoef = coef / 2
        steps.push(`∫${coef === 1 ? '' : coef}x dx = ${newCoef}x^2`)
        terms.push(`${newCoef}x^2`)
        return
      }

      // Handle constant
      const constMatch = part.match(/^([+-]?\d+\.?\d*)$/)
      if (constMatch) {
        const coef = parseFloat(constMatch[1])
        steps.push(`∫${coef} dx = ${coef}x`)
        terms.push(`${coef}x`)
        return
      }

      // Handle sin(x)
      if (part.includes('sin(x)')) {
        const coefMatch = part.match(/^([+-]?\d*\.?\d*)\*?sin\(x\)$/)
        const coef = coefMatch && coefMatch[1] ? parseFloat(coefMatch[1]) || 1 : 1
        steps.push(`∫${coef === 1 ? '' : coef}sin(x) dx = ${coef === 1 ? '-' : -coef}cos(x)`)
        terms.push(`${-coef}cos(x)`)
        return
      }

      // Handle cos(x)
      if (part.includes('cos(x)')) {
        const coefMatch = part.match(/^([+-]?\d*\.?\d*)\*?cos\(x\)$/)
        const coef = coefMatch && coefMatch[1] ? parseFloat(coefMatch[1]) || 1 : 1
        steps.push(`∫${coef === 1 ? '' : coef}cos(x) dx = ${coef === 1 ? '' : coef}sin(x)`)
        terms.push(coef === 1 ? 'sin(x)' : `${coef}sin(x)`)
        return
      }

      // Handle e^x
      if (part.includes('e^x')) {
        const coefMatch = part.match(/^([+-]?\d*\.?\d*)\*?e\^x$/)
        const coef = coefMatch && coefMatch[1] ? parseFloat(coefMatch[1]) || 1 : 1
        steps.push(`∫${coef === 1 ? '' : coef}e^x dx = ${coef === 1 ? '' : coef}e^x`)
        terms.push(coef === 1 ? 'e^x' : `${coef}e^x`)
        return
      }

      // Handle 1/x
      if (part === '1/x') {
        steps.push(`∫1/x dx = ln|x|`)
        terms.push('ln|x|')
        return
      }
    })

    let integral = terms.length > 0 ? terms.join(' + ').replace(/\+ -/g, '- ') : '0'
    if (mode === 'indefinite') {
      integral += ' + C'
    }

    return { integral, steps }
  }

  const evaluateIntegral = (integralExpr: string, x: number): number => {
    try {
      let expr = integralExpr
        .replace(/ \+ C$/, '')
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/ln\|x\|/g, 'Math.log(Math.abs(x))')
        .replace(/e\*\*x/g, 'Math.exp(x)')
        .replace(/x/g, `(${x})`)

      return new Function(`return ${expr}`)()
    } catch {
      return NaN
    }
  }

  const calculate = () => {
    const { integral, steps } = parseAndIntegrate(expression)

    if (mode === 'definite') {
      const a = parseFloat(lowerBound)
      const b = parseFloat(upperBound)

      if (!isNaN(a) && !isNaN(b)) {
        const integralWithoutC = integral.replace(' + C', '')
        const upperValue = evaluateIntegral(integralWithoutC, b)
        const lowerValue = evaluateIntegral(integralWithoutC, a)
        const definiteValue = upperValue - lowerValue

        steps.push(`F(${b}) - F(${a}) = ${upperValue.toFixed(6)} - ${lowerValue.toFixed(6)} = ${definiteValue.toFixed(6)}`)

        setResult({ integral: integralWithoutC, definiteValue, steps })
      } else {
        setResult({ integral, steps })
      }
    } else {
      setResult({ integral, steps })
    }
  }

  const rules = [
    { original: '∫x^n dx', result: 'x^(n+1)/(n+1) + C' },
    { original: '∫1 dx', result: 'x + C' },
    { original: '∫sin(x) dx', result: '-cos(x) + C' },
    { original: '∫cos(x) dx', result: 'sin(x) + C' },
    { original: '∫e^x dx', result: 'e^x + C' },
    { original: '∫1/x dx', result: 'ln|x| + C' },
  ]

  const examples = [
    'x^2',
    'x^3 + 2x',
    '3x^2 + x + 1',
    'sin(x)',
    'cos(x)',
    'e^x',
    '1/x',
    '2x + 3',
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('indefinite')}
          className={`px-4 py-2 rounded ${mode === 'indefinite' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.integralCalculator.indefinite')}
        </button>
        <button
          onClick={() => setMode('definite')}
          className={`px-4 py-2 rounded ${mode === 'definite' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.integralCalculator.definite')}
        </button>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.integralCalculator.enterFunction')}
        </label>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-slate-600">∫</span>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono"
            placeholder="x^2"
          />
          <span className="text-slate-600">dx</span>
        </div>

        {mode === 'definite' && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-slate-600">{t('tools.integralCalculator.bounds')}:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                value={lowerBound}
                onChange={(e) => setLowerBound(e.target.value)}
                className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
                placeholder="a"
              />
              <span>{t('tools.integralCalculator.to')}</span>
              <input
                type="number"
                step="any"
                value={upperBound}
                onChange={(e) => setUpperBound(e.target.value)}
                className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
                placeholder="b"
              />
            </div>
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('tools.integralCalculator.integrate')}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-slate-500">{t('tools.integralCalculator.tryExamples')}:</span>
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
            <div className="text-sm text-green-600 mb-1">
              {mode === 'indefinite' ? '∫f(x)dx =' : `∫[${lowerBound},${upperBound}] f(x)dx =`}
            </div>
            <div className="text-2xl font-bold text-green-700 font-mono">
              {result.integral}
            </div>
          </div>

          {result.definiteValue !== undefined && !isNaN(result.definiteValue) && (
            <div className="p-4 bg-purple-50 rounded">
              <div className="text-sm text-purple-600 mb-1">{t('tools.integralCalculator.definiteResult')}</div>
              <div className="text-2xl font-bold text-purple-700">
                {result.definiteValue.toFixed(6).replace(/\.?0+$/, '')}
              </div>
            </div>
          )}

          {result.steps.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">{t('tools.integralCalculator.steps')}</h4>
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
        <h4 className="font-medium mb-3">{t('tools.integralCalculator.basicIntegrals')}</h4>
        <div className="grid grid-cols-2 gap-2">
          {rules.map((rule, i) => (
            <div key={i} className="p-2 bg-white rounded font-mono text-sm">
              <span className="text-blue-600">{rule.original}</span>
              <span className="text-slate-400"> = </span>
              <span className="text-green-600">{rule.result}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
