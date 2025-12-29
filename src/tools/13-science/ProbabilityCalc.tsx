import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProbabilityCalc() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'basic' | 'combinations' | 'permutations' | 'binomial'>('basic')

  // Basic probability
  const [favorable, setFavorable] = useState(1)
  const [total, setTotal] = useState(6)

  // Combinations/Permutations
  const [n, setN] = useState(10)
  const [r, setR] = useState(3)

  // Binomial
  const [trials, setTrials] = useState(10)
  const [successes, setSuccesses] = useState(5)
  const [probability, setProbability] = useState(0.5)

  const factorial = (num: number): number => {
    if (num <= 1) return 1
    let result = 1
    for (let i = 2; i <= num; i++) {
      result *= i
    }
    return result
  }

  const combination = (n: number, r: number): number => {
    if (r > n) return 0
    return factorial(n) / (factorial(r) * factorial(n - r))
  }

  const permutation = (n: number, r: number): number => {
    if (r > n) return 0
    return factorial(n) / factorial(n - r)
  }

  const binomialProbability = (n: number, k: number, p: number): number => {
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)
  }

  const basicProbability = favorable / total
  const odds = favorable / (total - favorable)

  const combResult = combination(n, r)
  const permResult = permutation(n, r)

  const binomialResult = binomialProbability(trials, successes, probability)
  const binomialAtLeast = Array.from({ length: trials - successes + 1 }, (_, i) =>
    binomialProbability(trials, successes + i, probability)
  ).reduce((a, b) => a + b, 0)
  const binomialAtMost = Array.from({ length: successes + 1 }, (_, i) =>
    binomialProbability(trials, i, probability)
  ).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['basic', 'combinations', 'permutations', 'binomial'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded text-sm ${
              mode === m ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.probabilityCalc.${m}`)}
          </button>
        ))}
      </div>

      {mode === 'basic' && (
        <div className="card p-4 space-y-4">
          <h3 className="font-medium">{t('tools.probabilityCalc.basicProbability')}</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600 block mb-1">
                {t('tools.probabilityCalc.favorable')}
              </label>
              <input
                type="number"
                value={favorable}
                onChange={(e) => setFavorable(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">
                {t('tools.probabilityCalc.totalOutcomes')}
              </label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-blue-50 rounded text-center">
              <div className="text-sm text-slate-500">{t('tools.probabilityCalc.probability')}</div>
              <div className="text-xl font-bold text-blue-600">
                {(basicProbability * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-slate-400">{basicProbability.toFixed(4)}</div>
            </div>
            <div className="p-3 bg-green-50 rounded text-center">
              <div className="text-sm text-slate-500">{t('tools.probabilityCalc.odds')}</div>
              <div className="text-xl font-bold text-green-600">
                {favorable}:{total - favorable}
              </div>
              <div className="text-xs text-slate-400">{odds.toFixed(4)}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded text-center">
              <div className="text-sm text-slate-500">{t('tools.probabilityCalc.fraction')}</div>
              <div className="text-xl font-bold text-purple-600">
                {favorable}/{total}
              </div>
            </div>
          </div>
        </div>
      )}

      {(mode === 'combinations' || mode === 'permutations') && (
        <div className="card p-4 space-y-4">
          <h3 className="font-medium">
            {mode === 'combinations'
              ? t('tools.probabilityCalc.combinationsCalc')
              : t('tools.probabilityCalc.permutationsCalc')}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600 block mb-1">
                n ({t('tools.probabilityCalc.totalItems')})
              </label>
              <input
                type="number"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
                max="170"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">
                r ({t('tools.probabilityCalc.itemsChosen')})
              </label>
              <input
                type="number"
                value={r}
                onChange={(e) => setR(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
                max={n}
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded">
            <div className="text-sm text-slate-500 mb-1">
              {mode === 'combinations' ? 'C(n,r) = n! / (r!(n-r)!)' : 'P(n,r) = n! / (n-r)!'}
            </div>
            <div className="text-3xl font-bold text-blue-600 font-mono">
              {mode === 'combinations' ? combResult.toLocaleString() : permResult.toLocaleString()}
            </div>
          </div>

          <div className="text-sm text-slate-600">
            {mode === 'combinations'
              ? t('tools.probabilityCalc.combinationsExplain')
              : t('tools.probabilityCalc.permutationsExplain')}
          </div>
        </div>
      )}

      {mode === 'binomial' && (
        <div className="card p-4 space-y-4">
          <h3 className="font-medium">{t('tools.probabilityCalc.binomialDistribution')}</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-600 block mb-1">
                n ({t('tools.probabilityCalc.trials')})
              </label>
              <input
                type="number"
                value={trials}
                onChange={(e) => setTrials(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">
                k ({t('tools.probabilityCalc.successes')})
              </label>
              <input
                type="number"
                value={successes}
                onChange={(e) => setSuccesses(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
                max={trials}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">
                p ({t('tools.probabilityCalc.successProb')})
              </label>
              <input
                type="number"
                value={probability}
                onChange={(e) => setProbability(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
                max="1"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-blue-50 rounded text-center">
              <div className="text-xs text-slate-500">P(X = {successes})</div>
              <div className="text-xl font-bold text-blue-600">
                {(binomialResult * 100).toFixed(4)}%
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded text-center">
              <div className="text-xs text-slate-500">P(X &gt;= {successes})</div>
              <div className="text-xl font-bold text-green-600">
                {(binomialAtLeast * 100).toFixed(4)}%
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded text-center">
              <div className="text-xs text-slate-500">P(X &lt;= {successes})</div>
              <div className="text-xl font-bold text-purple-600">
                {(binomialAtMost * 100).toFixed(4)}%
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            {t('tools.probabilityCalc.binomialExplain')}
          </div>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.probabilityCalc.formulas')}</h3>
        <div className="text-sm text-slate-600 space-y-1 font-mono">
          <p>P(A) = favorable outcomes / total outcomes</p>
          <p>C(n,r) = n! / (r!(n-r)!)</p>
          <p>P(n,r) = n! / (n-r)!</p>
          <p>P(X=k) = C(n,k) * p^k * (1-p)^(n-k)</p>
        </div>
      </div>
    </div>
  )
}
