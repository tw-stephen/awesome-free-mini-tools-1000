import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PrimeNumberChecker() {
  const { t } = useTranslation()
  const [number, setNumber] = useState('')
  const [result, setResult] = useState<{
    isPrime: boolean
    factors: number[]
    primeFactorization: string
    nearbyPrimes: number[]
  } | null>(null)
  const [rangeStart, setRangeStart] = useState('1')
  const [rangeEnd, setRangeEnd] = useState('100')
  const [primesInRange, setPrimesInRange] = useState<number[]>([])

  const isPrime = (n: number): boolean => {
    if (n < 2) return false
    if (n === 2) return true
    if (n % 2 === 0) return false
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false
    }
    return true
  }

  const getFactors = (n: number): number[] => {
    const factors: number[] = []
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        factors.push(i)
        if (i !== n / i) factors.push(n / i)
      }
    }
    return factors.sort((a, b) => a - b)
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

  const getNearbyPrimes = (n: number): number[] => {
    const primes: number[] = []
    let lower = n - 1
    let upper = n + 1

    while (primes.length < 3 && lower >= 2) {
      if (isPrime(lower)) primes.unshift(lower)
      lower--
    }

    while (primes.length < 6 && upper < n + 100) {
      if (isPrime(upper)) primes.push(upper)
      upper++
    }

    return primes
  }

  const checkNumber = () => {
    const n = parseInt(number)
    if (isNaN(n) || n < 1) {
      setResult(null)
      return
    }

    setResult({
      isPrime: isPrime(n),
      factors: getFactors(n),
      primeFactorization: getPrimeFactorization(n),
      nearbyPrimes: getNearbyPrimes(n),
    })
  }

  const findPrimesInRange = () => {
    const start = parseInt(rangeStart)
    const end = parseInt(rangeEnd)
    if (isNaN(start) || isNaN(end) || start > end || end - start > 10000) {
      setPrimesInRange([])
      return
    }

    const primes: number[] = []
    for (let i = Math.max(2, start); i <= end; i++) {
      if (isPrime(i)) primes.push(i)
    }
    setPrimesInRange(primes)
  }

  const nthPrime = (n: number): number => {
    if (n < 1) return 2
    let count = 0
    let num = 1
    while (count < n) {
      num++
      if (isPrime(num)) count++
    }
    return num
  }

  const quickPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.primeNumberChecker.checkNumber')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder={t('tools.primeNumberChecker.enterNumber')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={checkNumber}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.primeNumberChecker.check')}
          </button>
        </div>
      </div>

      {result && (
        <div className="card p-4 space-y-4">
          <div className={`p-4 rounded-lg text-center ${
            result.isPrime ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
          }`}>
            <div className="text-2xl font-bold mb-1">
              {number}
            </div>
            <div className={`text-lg ${result.isPrime ? 'text-green-700' : 'text-orange-700'}`}>
              {result.isPrime
                ? t('tools.primeNumberChecker.isPrime')
                : t('tools.primeNumberChecker.notPrime')
              }
            </div>
          </div>

          {!result.isPrime && parseInt(number) > 1 && (
            <div>
              <h4 className="text-sm font-medium mb-2">{t('tools.primeNumberChecker.primeFactorization')}</h4>
              <div className="p-2 bg-slate-50 rounded font-mono">
                {number} = {result.primeFactorization}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium mb-2">{t('tools.primeNumberChecker.allFactors')}</h4>
            <div className="flex flex-wrap gap-1">
              {result.factors.map(f => (
                <span key={f} className="px-2 py-0.5 bg-slate-100 rounded text-sm">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">{t('tools.primeNumberChecker.nearbyPrimes')}</h4>
            <div className="flex flex-wrap gap-1">
              {result.nearbyPrimes.map(p => (
                <span key={p} className="px-2 py-0.5 bg-green-100 rounded text-sm">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.primeNumberChecker.findInRange')}</h3>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.primeNumberChecker.from')}</label>
            <input
              type="number"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.primeNumberChecker.to')}</label>
            <input
              type="number"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
            />
          </div>
          <button
            onClick={findPrimesInRange}
            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            {t('tools.primeNumberChecker.findPrimes')}
          </button>
        </div>

        {primesInRange.length > 0 && (
          <div className="mt-3">
            <div className="text-sm text-slate-500 mb-2">
              {t('tools.primeNumberChecker.found', { count: primesInRange.length })}
            </div>
            <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
              {primesInRange.map(p => (
                <span key={p} className="px-2 py-0.5 bg-green-100 rounded text-sm">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.primeNumberChecker.first15')}</h4>
        <div className="flex flex-wrap gap-2">
          {quickPrimes.map((p, i) => (
            <div key={p} className="px-2 py-1 bg-white rounded border text-sm">
              <span className="text-slate-400 text-xs">#{i + 1}</span> {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
