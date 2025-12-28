import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FactorResult {
  number: number
  factors: number[]
  factorPairs: [number, number][]
  primeFactors: number[]
  primeFactorization: string
  sumOfFactors: number
  productOfFactors: number
  numFactors: number
  isPerfect: boolean
  isAbundant: boolean
  isDeficient: boolean
}

export default function FactorCalculator() {
  const { t } = useTranslation()
  const [number, setNumber] = useState('24')
  const [result, setResult] = useState<FactorResult | null>(null)

  const getFactors = (n: number): number[] => {
    if (n < 1) return []
    const factors: number[] = []
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        factors.push(i)
        if (i !== n / i) factors.push(n / i)
      }
    }
    return factors.sort((a, b) => a - b)
  }

  const getFactorPairs = (n: number): [number, number][] => {
    const pairs: [number, number][] = []
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        pairs.push([i, n / i])
      }
    }
    return pairs
  }

  const getPrimeFactors = (n: number): number[] => {
    if (n < 2) return []
    const primes: number[] = []
    let num = n

    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        primes.push(i)
        while (num % i === 0) {
          num = num / i
        }
      }
    }
    if (num > 1) primes.push(num)

    return primes
  }

  const getPrimeFactorization = (n: number): string => {
    if (n < 2) return n.toString()
    const factors: Record<number, number> = {}
    let num = n

    for (let i = 2; i <= Math.sqrt(num); i++) {
      while (num % i === 0) {
        factors[i] = (factors[i] || 0) + 1
        num = num / i
      }
    }
    if (num > 1) factors[num] = (factors[num] || 0) + 1

    return Object.entries(factors)
      .map(([prime, exp]) => exp > 1 ? `${prime}^${exp}` : prime)
      .join(' × ')
  }

  const calculate = () => {
    const n = parseInt(number)
    if (isNaN(n) || n < 1) {
      setResult(null)
      return
    }

    const factors = getFactors(n)
    const primeFactors = getPrimeFactors(n)
    const sumOfFactors = factors.reduce((a, b) => a + b, 0)
    const properSum = sumOfFactors - n

    setResult({
      number: n,
      factors,
      factorPairs: getFactorPairs(n),
      primeFactors,
      primeFactorization: getPrimeFactorization(n),
      sumOfFactors,
      productOfFactors: factors.reduce((a, b) => a * b, 1),
      numFactors: factors.length,
      isPerfect: properSum === n && n > 1,
      isAbundant: properSum > n,
      isDeficient: properSum < n,
    })
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.factorCalculator.enterNumber')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            min="1"
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={calculate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.factorCalculator.calculate')}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.factorCalculator.allFactors')}</h3>
            <div className="flex flex-wrap gap-2">
              {result.factors.map(f => (
                <span
                  key={f}
                  className={`px-3 py-1 rounded ${
                    result.primeFactors.includes(f)
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-slate-100'
                  }`}
                >
                  {f}
                  {result.primeFactors.includes(f) && (
                    <span className="ml-1 text-xs text-green-600">(prime)</span>
                  )}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {t('tools.factorCalculator.totalFactors', { count: result.numFactors })}
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.factorCalculator.factorPairs')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {result.factorPairs.map(([a, b], i) => (
                <div key={i} className="p-2 bg-slate-50 rounded text-center">
                  <span className="font-mono">{a} × {b}</span>
                  <span className="text-slate-400 ml-1">= {result.number}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.factorCalculator.primeFactorization')}</h3>
            <div className="p-3 bg-slate-50 rounded font-mono text-lg text-center">
              {result.number} = {result.primeFactorization}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="font-medium mb-3">{t('tools.factorCalculator.statistics')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('tools.factorCalculator.sumOfFactors')}</span>
                  <span className="font-mono">{result.sumOfFactors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('tools.factorCalculator.sumOfProperDivisors')}</span>
                  <span className="font-mono">{result.sumOfFactors - result.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('tools.factorCalculator.numberOfFactors')}</span>
                  <span className="font-mono">{result.numFactors}</span>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h3 className="font-medium mb-3">{t('tools.factorCalculator.classification')}</h3>
              <div className="space-y-2">
                {result.isPerfect && (
                  <div className="p-2 bg-purple-50 text-purple-700 rounded">
                    ✨ {t('tools.factorCalculator.perfectNumber')}
                  </div>
                )}
                {result.isAbundant && (
                  <div className="p-2 bg-blue-50 text-blue-700 rounded">
                    📈 {t('tools.factorCalculator.abundantNumber')}
                  </div>
                )}
                {result.isDeficient && (
                  <div className="p-2 bg-orange-50 text-orange-700 rounded">
                    📉 {t('tools.factorCalculator.deficientNumber')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card p-4 bg-slate-50">
            <h4 className="font-medium mb-2">{t('tools.factorCalculator.info')}</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• {t('tools.factorCalculator.infoFactor')}</li>
              <li>• {t('tools.factorCalculator.infoPrime')}</li>
              <li>• {t('tools.factorCalculator.infoPerfect')}</li>
              <li>• {t('tools.factorCalculator.infoAbundant')}</li>
              <li>• {t('tools.factorCalculator.infoDeficient')}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
