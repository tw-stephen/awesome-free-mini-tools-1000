import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type CalcMode = 'basic' | 'combination' | 'permutation' | 'binomial' | 'normal'

export default function ProbabilityCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<CalcMode>('basic')

  // Basic probability
  const [favorable, setFavorable] = useState('3')
  const [total, setTotal] = useState('10')

  // Combination/Permutation
  const [n, setN] = useState('10')
  const [r, setR] = useState('3')

  // Binomial distribution
  const [trials, setTrials] = useState('10')
  const [successProb, setSuccessProb] = useState('0.5')
  const [successes, setSuccesses] = useState('5')

  // Normal distribution
  const [mean, setMean] = useState('0')
  const [stdDev, setStdDev] = useState('1')
  const [zValue, setZValue] = useState('1')

  const [result, setResult] = useState<{
    value: number | string
    details?: { label: string; value: string }[]
  } | null>(null)

  const factorial = (num: number): number => {
    if (num <= 1) return 1
    let result = 1
    for (let i = 2; i <= num; i++) result *= i
    return result
  }

  const combination = (n: number, r: number): number => {
    if (r > n || r < 0) return 0
    return factorial(n) / (factorial(r) * factorial(n - r))
  }

  const permutation = (n: number, r: number): number => {
    if (r > n || r < 0) return 0
    return factorial(n) / factorial(n - r)
  }

  const binomialProbability = (n: number, k: number, p: number): number => {
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)
  }

  // Approximation of standard normal CDF using Abramowitz and Stegun
  const normalCDF = (x: number): number => {
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911

    const sign = x < 0 ? -1 : 1
    x = Math.abs(x) / Math.sqrt(2)

    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return 0.5 * (1.0 + sign * y)
  }

  const calculate = () => {
    switch (mode) {
      case 'basic': {
        const fav = parseInt(favorable)
        const tot = parseInt(total)
        if (isNaN(fav) || isNaN(tot) || tot === 0) return
        const prob = fav / tot
        setResult({
          value: prob,
          details: [
            { label: t('tools.probabilityCalculator.probability'), value: prob.toFixed(6) },
            { label: t('tools.probabilityCalculator.percentage'), value: `${(prob * 100).toFixed(2)}%` },
            { label: t('tools.probabilityCalculator.odds'), value: `${fav}:${tot - fav}` },
            { label: t('tools.probabilityCalculator.complement'), value: (1 - prob).toFixed(6) },
          ],
        })
        break
      }
      case 'combination': {
        const nVal = parseInt(n)
        const rVal = parseInt(r)
        if (isNaN(nVal) || isNaN(rVal)) return
        const result = combination(nVal, rVal)
        setResult({
          value: result,
          details: [
            { label: 'C(n,r)', value: result.toLocaleString() },
            { label: t('tools.probabilityCalculator.formula'), value: `${nVal}! / (${rVal}! × ${nVal - rVal}!)` },
          ],
        })
        break
      }
      case 'permutation': {
        const nVal = parseInt(n)
        const rVal = parseInt(r)
        if (isNaN(nVal) || isNaN(rVal)) return
        const result = permutation(nVal, rVal)
        setResult({
          value: result,
          details: [
            { label: 'P(n,r)', value: result.toLocaleString() },
            { label: t('tools.probabilityCalculator.formula'), value: `${nVal}! / ${nVal - rVal}!` },
          ],
        })
        break
      }
      case 'binomial': {
        const nVal = parseInt(trials)
        const pVal = parseFloat(successProb)
        const kVal = parseInt(successes)
        if (isNaN(nVal) || isNaN(pVal) || isNaN(kVal)) return

        const exactProb = binomialProbability(nVal, kVal, pVal)
        let cumulativeProb = 0
        for (let i = 0; i <= kVal; i++) {
          cumulativeProb += binomialProbability(nVal, i, pVal)
        }

        setResult({
          value: exactProb,
          details: [
            { label: `P(X = ${kVal})`, value: exactProb.toFixed(6) },
            { label: `P(X ≤ ${kVal})`, value: cumulativeProb.toFixed(6) },
            { label: `P(X > ${kVal})`, value: (1 - cumulativeProb).toFixed(6) },
            { label: t('tools.probabilityCalculator.expectedValue'), value: (nVal * pVal).toFixed(2) },
            { label: t('tools.probabilityCalculator.variance'), value: (nVal * pVal * (1 - pVal)).toFixed(4) },
          ],
        })
        break
      }
      case 'normal': {
        const mu = parseFloat(mean)
        const sigma = parseFloat(stdDev)
        const z = parseFloat(zValue)
        if (isNaN(mu) || isNaN(sigma) || isNaN(z) || sigma <= 0) return

        const standardZ = (z - mu) / sigma
        const cdf = normalCDF(standardZ)

        setResult({
          value: cdf,
          details: [
            { label: t('tools.probabilityCalculator.zScore'), value: standardZ.toFixed(4) },
            { label: `P(X ≤ ${z})`, value: cdf.toFixed(6) },
            { label: `P(X > ${z})`, value: (1 - cdf).toFixed(6) },
            { label: t('tools.probabilityCalculator.percentile'), value: `${(cdf * 100).toFixed(2)}%` },
          ],
        })
        break
      }
    }
  }

  const modes = [
    { id: 'basic', label: t('tools.probabilityCalculator.basic') },
    { id: 'combination', label: t('tools.probabilityCalculator.combination') },
    { id: 'permutation', label: t('tools.probabilityCalculator.permutation') },
    { id: 'binomial', label: t('tools.probabilityCalculator.binomial') },
    { id: 'normal', label: t('tools.probabilityCalculator.normal') },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id as CalcMode); setResult(null) }}
            className={`px-3 py-1.5 rounded text-sm ${
              mode === m.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="card p-4">
        {mode === 'basic' && (
          <div className="space-y-3">
            <h3 className="font-medium">{t('tools.probabilityCalculator.basicTitle')}</h3>
            <p className="text-sm text-slate-600 font-mono">P(A) = favorable / total</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.probabilityCalculator.favorable')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={favorable}
                  onChange={(e) => setFavorable(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.probabilityCalculator.total')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {(mode === 'combination' || mode === 'permutation') && (
          <div className="space-y-3">
            <h3 className="font-medium">
              {mode === 'combination'
                ? t('tools.probabilityCalculator.combinationTitle')
                : t('tools.probabilityCalculator.permutationTitle')
              }
            </h3>
            <p className="text-sm text-slate-600 font-mono">
              {mode === 'combination' ? 'C(n,r) = n! / (r!(n-r)!)' : 'P(n,r) = n! / (n-r)!'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">n ({t('tools.probabilityCalculator.totalItems')})</label>
                <input
                  type="number"
                  min="0"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">r ({t('tools.probabilityCalculator.chosen')})</label>
                <input
                  type="number"
                  min="0"
                  value={r}
                  onChange={(e) => setR(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {mode === 'binomial' && (
          <div className="space-y-3">
            <h3 className="font-medium">{t('tools.probabilityCalculator.binomialTitle')}</h3>
            <p className="text-sm text-slate-600 font-mono">P(X=k) = C(n,k) × p^k × (1-p)^(n-k)</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">n ({t('tools.probabilityCalculator.trials')})</label>
                <input
                  type="number"
                  min="1"
                  value={trials}
                  onChange={(e) => setTrials(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">p ({t('tools.probabilityCalculator.successProb')})</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={successProb}
                  onChange={(e) => setSuccessProb(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">k ({t('tools.probabilityCalculator.successes')})</label>
                <input
                  type="number"
                  min="0"
                  value={successes}
                  onChange={(e) => setSuccesses(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {mode === 'normal' && (
          <div className="space-y-3">
            <h3 className="font-medium">{t('tools.probabilityCalculator.normalTitle')}</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">μ ({t('tools.probabilityCalculator.mean')})</label>
                <input
                  type="number"
                  step="any"
                  value={mean}
                  onChange={(e) => setMean(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">σ ({t('tools.probabilityCalculator.stdDev')})</label>
                <input
                  type="number"
                  min="0.001"
                  step="any"
                  value={stdDev}
                  onChange={(e) => setStdDev(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">x ({t('tools.probabilityCalculator.value')})</label>
                <input
                  type="number"
                  step="any"
                  value={zValue}
                  onChange={(e) => setZValue(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('tools.probabilityCalculator.calculate')}
        </button>
      </div>

      {result && (
        <div className="card p-4">
          <div className="p-4 bg-green-50 rounded text-center mb-4">
            <div className="text-sm text-green-600 mb-1">{t('tools.probabilityCalculator.result')}</div>
            <div className="text-3xl font-bold text-green-700">
              {typeof result.value === 'number'
                ? result.value.toFixed(6).replace(/\.?0+$/, '')
                : result.value
              }
            </div>
          </div>

          {result.details && (
            <div className="grid grid-cols-2 gap-2">
              {result.details.map((detail, i) => (
                <div key={i} className="p-2 bg-slate-50 rounded">
                  <div className="text-xs text-slate-500">{detail.label}</div>
                  <div className="font-mono">{detail.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
