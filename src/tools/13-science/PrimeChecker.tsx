import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PrimeChecker() {
  const { t } = useTranslation()
  const [number, setNumber] = useState(97)
  const [rangeStart, setRangeStart] = useState(1)
  const [rangeEnd, setRangeEnd] = useState(100)

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
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) factors.push(i)
    }
    return factors
  }

  const getPrimeFactors = (n: number): number[] => {
    const factors: number[] = []
    let num = n
    for (let i = 2; i <= num; i++) {
      while (num % i === 0) {
        factors.push(i)
        num /= i
      }
    }
    return factors
  }

  const getPrimesInRange = (start: number, end: number): number[] => {
    const primes: number[] = []
    for (let i = Math.max(2, start); i <= end && primes.length < 500; i++) {
      if (isPrime(i)) primes.push(i)
    }
    return primes
  }

  const isNumberPrime = isPrime(number)
  const factors = getFactors(number)
  const primeFactors = getPrimeFactors(number)
  const primesInRange = getPrimesInRange(rangeStart, rangeEnd)

  const getNextPrime = (n: number): number => {
    let candidate = n + 1
    while (!isPrime(candidate)) candidate++
    return candidate
  }

  const getPrevPrime = (n: number): number => {
    let candidate = n - 1
    while (candidate > 1 && !isPrime(candidate)) candidate--
    return candidate > 1 ? candidate : 2
  }

  return (
    <div className="space-y-4">
      {/* Single Number Check */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.primeChecker.checkNumber')}</h3>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-slate-300 rounded text-center text-2xl"
          min="0"
        />

        <div className={`mt-4 p-4 rounded text-center ${isNumberPrime ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className={`text-2xl font-bold ${isNumberPrime ? 'text-green-600' : 'text-red-600'}`}>
            {isNumberPrime ? t('tools.primeChecker.isPrime') : t('tools.primeChecker.notPrime')}
          </div>
        </div>

        {number > 1 && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded">
              <div className="text-sm text-slate-500">{t('tools.primeChecker.prevPrime')}</div>
              <div className="text-xl font-bold">{getPrevPrime(number)}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded">
              <div className="text-sm text-slate-500">{t('tools.primeChecker.nextPrime')}</div>
              <div className="text-xl font-bold">{getNextPrime(number)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Factors */}
      {number > 0 && !isNumberPrime && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.primeChecker.factors')}</h3>
          <div className="flex flex-wrap gap-2">
            {factors.map((f, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded ${isPrime(f) ? 'bg-green-100 text-green-700' : 'bg-slate-100'}`}
              >
                {f}
              </span>
            ))}
          </div>
          <div className="mt-3 text-sm text-slate-500">
            {factors.length} {t('tools.primeChecker.factorsCount')}
          </div>

          <h4 className="font-medium mt-4 mb-2">{t('tools.primeChecker.primeFactorization')}</h4>
          <div className="p-3 bg-blue-50 rounded text-center">
            <span className="text-lg font-mono">
              {number} = {primeFactors.join(' x ')}
            </span>
          </div>
        </div>
      )}

      {/* Prime Range */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.primeChecker.primesInRange')}</h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="text-sm text-slate-600 block mb-1">{t('tools.primeChecker.from')}</label>
            <input
              type="number"
              value={rangeStart}
              onChange={(e) => setRangeStart(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              min="1"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">{t('tools.primeChecker.to')}</label>
            <input
              type="number"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(parseInt(e.target.value) || 100)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              min="1"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded">
          <div className="text-sm text-slate-500 mb-2">
            {primesInRange.length} {t('tools.primeChecker.primesFound')}
          </div>
          <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
            {primesInRange.map((p, i) => (
              <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-sm">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* First Primes */}
      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.primeChecker.firstPrimes')}</h3>
        <div className="flex flex-wrap gap-1 text-sm">
          {getPrimesInRange(2, 100).map((p, i) => (
            <span key={i} className="px-2 py-0.5 bg-white rounded">{p}</span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="card p-4 bg-slate-50">
        <h3 className="font-medium mb-2">{t('tools.primeChecker.whatIsPrime')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.primeChecker.primeDefinition')}
        </p>
      </div>
    </div>
  )
}
