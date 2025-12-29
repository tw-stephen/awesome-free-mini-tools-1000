import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function GCDLCMCalc() {
  const { t } = useTranslation()
  const [numbers, setNumbers] = useState('12, 18, 24')

  const parseNumbers = (text: string): number[] => {
    return text
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n > 0)
  }

  const gcdTwo = (a: number, b: number): number => {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b) {
      const t = b
      b = a % b
      a = t
    }
    return a
  }

  const lcmTwo = (a: number, b: number): number => {
    return (a * b) / gcdTwo(a, b)
  }

  const gcd = (nums: number[]): number => {
    if (nums.length === 0) return 0
    return nums.reduce((acc, n) => gcdTwo(acc, n))
  }

  const lcm = (nums: number[]): number => {
    if (nums.length === 0) return 0
    return nums.reduce((acc, n) => lcmTwo(acc, n))
  }

  const getPrimeFactors = (n: number): Map<number, number> => {
    const factors = new Map<number, number>()
    let num = n
    for (let i = 2; i <= num; i++) {
      while (num % i === 0) {
        factors.set(i, (factors.get(i) || 0) + 1)
        num /= i
      }
    }
    return factors
  }

  const formatPrimeFactors = (n: number): string => {
    const factors = getPrimeFactors(n)
    const parts: string[] = []
    factors.forEach((power, prime) => {
      parts.push(power > 1 ? `${prime}^${power}` : `${prime}`)
    })
    return parts.join(' x ') || '1'
  }

  const nums = parseNumbers(numbers)
  const gcdResult = gcd(nums)
  const lcmResult = lcm(nums)

  // Euclidean algorithm steps (for 2 numbers)
  const getEuclideanSteps = (a: number, b: number): { a: number; b: number; q: number; r: number }[] => {
    const steps: { a: number; b: number; q: number; r: number }[] = []
    a = Math.abs(a)
    b = Math.abs(b)
    while (b !== 0) {
      const q = Math.floor(a / b)
      const r = a % b
      steps.push({ a, b, q, r })
      a = b
      b = r
    }
    return steps
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.gcdLcmCalc.enterNumbers')}
        </label>
        <input
          type="text"
          value={numbers}
          onChange={(e) => setNumbers(e.target.value)}
          placeholder="12, 18, 24"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <p className="text-xs text-slate-500 mt-1">
          {t('tools.gcdLcmCalc.hint')}
        </p>
      </div>

      {nums.length >= 2 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 bg-blue-50">
              <div className="text-sm text-slate-500 mb-1">
                {t('tools.gcdLcmCalc.gcd')} ({t('tools.gcdLcmCalc.gcdFull')})
              </div>
              <div className="text-4xl font-bold text-blue-600">{gcdResult}</div>
              <div className="text-xs text-slate-400 mt-1">{t('tools.gcdLcmCalc.gcdNote')}</div>
            </div>
            <div className="card p-4 bg-green-50">
              <div className="text-sm text-slate-500 mb-1">
                {t('tools.gcdLcmCalc.lcm')} ({t('tools.gcdLcmCalc.lcmFull')})
              </div>
              <div className="text-4xl font-bold text-green-600">{lcmResult.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">{t('tools.gcdLcmCalc.lcmNote')}</div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.gcdLcmCalc.primeFactorization')}</h3>
            <div className="space-y-2">
              {nums.map((n, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                  <span className="font-bold w-12">{n}</span>
                  <span>=</span>
                  <span className="font-mono">{formatPrimeFactors(n)}</span>
                </div>
              ))}
            </div>
          </div>

          {nums.length === 2 && (
            <div className="card p-4">
              <h3 className="font-medium mb-3">{t('tools.gcdLcmCalc.euclideanAlgorithm')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">{t('tools.gcdLcmCalc.step')}</th>
                      <th className="text-center py-2 px-2">a</th>
                      <th className="text-center py-2 px-2">b</th>
                      <th className="text-center py-2 px-2">q</th>
                      <th className="text-center py-2 px-2">r = a - b*q</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getEuclideanSteps(nums[0], nums[1]).map((step, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2 px-2">{i + 1}</td>
                        <td className="text-center py-2 px-2">{step.a}</td>
                        <td className="text-center py-2 px-2">{step.b}</td>
                        <td className="text-center py-2 px-2">{step.q}</td>
                        <td className="text-center py-2 px-2 font-bold">{step.r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-sm text-slate-500">
                {t('tools.gcdLcmCalc.euclideanNote')}
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="font-medium mb-2">{t('tools.gcdLcmCalc.relationship')}</h3>
            <div className="p-3 bg-purple-50 rounded text-center font-mono">
              <div>GCD({nums.join(', ')}) x LCM({nums.join(', ')}) = {gcdResult * lcmResult}</div>
              {nums.length === 2 && (
                <div className="mt-2 text-sm">
                  {nums[0]} x {nums[1]} = {nums[0] * nums[1]}
                </div>
              )}
            </div>
            {nums.length === 2 && (
              <div className="text-xs text-slate-500 mt-2">
                {t('tools.gcdLcmCalc.relationshipNote')}
              </div>
            )}
          </div>
        </>
      )}

      <div className="card p-4 bg-slate-50">
        <h3 className="font-medium mb-2">{t('tools.gcdLcmCalc.formulas')}</h3>
        <div className="text-sm text-slate-600 space-y-2 font-mono">
          <p>GCD: {t('tools.gcdLcmCalc.gcdFormula')}</p>
          <p>LCM(a,b) = |a x b| / GCD(a,b)</p>
        </div>
      </div>
    </div>
  )
}
