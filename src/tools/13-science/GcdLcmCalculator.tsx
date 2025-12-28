import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface GcdLcmResult {
  numbers: number[]
  gcd: number
  lcm: number
  gcdSteps: string[]
  primeFactors: Record<number, Record<number, number>>
  coprime: boolean
}

export default function GcdLcmCalculator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('12, 18, 24')
  const [result, setResult] = useState<GcdLcmResult | null>(null)

  const gcdTwo = (a: number, b: number): number => {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }

  const gcdWithSteps = (a: number, b: number): { gcd: number; steps: string[] } => {
    const steps: string[] = []
    a = Math.abs(a)
    b = Math.abs(b)
    const original = [a, b]

    while (b !== 0) {
      const q = Math.floor(a / b)
      const r = a % b
      steps.push(`${a} = ${b} × ${q} + ${r}`)
      a = b
      b = r
    }
    steps.push(`GCD(${original[0]}, ${original[1]}) = ${a}`)
    return { gcd: a, steps }
  }

  const lcmTwo = (a: number, b: number): number => {
    return Math.abs(a * b) / gcdTwo(a, b)
  }

  const gcdMultiple = (numbers: number[]): number => {
    return numbers.reduce((acc, num) => gcdTwo(acc, num), numbers[0])
  }

  const lcmMultiple = (numbers: number[]): number => {
    return numbers.reduce((acc, num) => lcmTwo(acc, num), numbers[0])
  }

  const getPrimeFactors = (n: number): Record<number, number> => {
    const factors: Record<number, number> = {}
    let num = Math.abs(n)

    for (let i = 2; i <= Math.sqrt(num); i++) {
      while (num % i === 0) {
        factors[i] = (factors[i] || 0) + 1
        num = num / i
      }
    }
    if (num > 1) factors[num] = (factors[num] || 0) + 1

    return factors
  }

  const calculate = () => {
    const numbers = input
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n > 0)

    if (numbers.length < 2) {
      setResult(null)
      return
    }

    const primeFactors: Record<number, Record<number, number>> = {}
    numbers.forEach(n => {
      primeFactors[n] = getPrimeFactors(n)
    })

    const { steps } = numbers.length === 2
      ? gcdWithSteps(numbers[0], numbers[1])
      : { steps: [] }

    const gcd = gcdMultiple(numbers)
    const lcm = lcmMultiple(numbers)

    setResult({
      numbers,
      gcd,
      lcm,
      gcdSteps: steps,
      primeFactors,
      coprime: gcd === 1,
    })
  }

  const formatPrimeFactorization = (factors: Record<number, number>): string => {
    return Object.entries(factors)
      .map(([prime, exp]) => exp > 1 ? `${prime}^${exp}` : prime)
      .join(' × ') || '1'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.gcdLcmCalculator.enterNumbers')}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.gcdLcmCalculator.placeholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <p className="text-xs text-slate-500 mt-1">
          {t('tools.gcdLcmCalculator.hint')}
        </p>
      </div>

      <button
        onClick={calculate}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t('tools.gcdLcmCalculator.calculate')}
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4 border-2 border-green-200 bg-green-50">
              <h3 className="text-sm text-green-700 mb-1">
                {t('tools.gcdLcmCalculator.gcdTitle')}
              </h3>
              <div className="text-3xl font-bold text-green-800">{result.gcd}</div>
              <p className="text-sm text-green-600 mt-1">
                GCD({result.numbers.join(', ')})
              </p>
            </div>

            <div className="card p-4 border-2 border-blue-200 bg-blue-50">
              <h3 className="text-sm text-blue-700 mb-1">
                {t('tools.gcdLcmCalculator.lcmTitle')}
              </h3>
              <div className="text-3xl font-bold text-blue-800">{result.lcm}</div>
              <p className="text-sm text-blue-600 mt-1">
                LCM({result.numbers.join(', ')})
              </p>
            </div>
          </div>

          {result.coprime && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded text-purple-700 text-center">
              ✨ {t('tools.gcdLcmCalculator.coprime')}
            </div>
          )}

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.gcdLcmCalculator.primeFactorizations')}</h3>
            <div className="space-y-2">
              {Object.entries(result.primeFactors).map(([num, factors]) => (
                <div key={num} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-mono font-bold w-16">{num}</span>
                  <span className="text-slate-400">=</span>
                  <span className="font-mono">{formatPrimeFactorization(factors)}</span>
                </div>
              ))}
            </div>
          </div>

          {result.gcdSteps.length > 0 && (
            <div className="card p-4">
              <h3 className="font-medium mb-3">{t('tools.gcdLcmCalculator.euclideanSteps')}</h3>
              <div className="space-y-1">
                {result.gcdSteps.map((step, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded font-mono text-sm ${
                      i === result.gcdSteps.length - 1
                        ? 'bg-green-50 text-green-700 font-bold'
                        : 'bg-slate-50'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.gcdLcmCalculator.formulas')}</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-slate-50 rounded font-mono">
                GCD × LCM = {result.numbers.length === 2 ? `${result.numbers[0]} × ${result.numbers[1]} = ${result.numbers[0] * result.numbers[1]}` : 'Product of numbers (for 2 numbers)'}
              </div>
              <div className="p-2 bg-slate-50 rounded font-mono">
                {result.gcd} × {result.lcm} = {result.gcd * result.lcm}
              </div>
            </div>
          </div>

          <div className="card p-4 bg-slate-50">
            <h4 className="font-medium mb-2">{t('tools.gcdLcmCalculator.info')}</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• {t('tools.gcdLcmCalculator.infoGcd')}</li>
              <li>• {t('tools.gcdLcmCalculator.infoLcm')}</li>
              <li>• {t('tools.gcdLcmCalculator.infoCoprime')}</li>
              <li>• {t('tools.gcdLcmCalculator.infoEuclid')}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
