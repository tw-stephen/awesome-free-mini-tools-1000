import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProbabilityCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'basic' | 'combinations' | 'dice' | 'cards'>('basic')

  // Basic probability
  const [favorable, setFavorable] = useState('')
  const [total, setTotal] = useState('')

  // Combinations/Permutations
  const [n, setN] = useState('')
  const [r, setR] = useState('')

  // Dice
  const [numDice, setNumDice] = useState('2')
  const [targetSum, setTargetSum] = useState('7')

  // Cards
  const [cardType, setCardType] = useState<'suit' | 'face' | 'specific'>('suit')

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

  const basicResult = useMemo(() => {
    const fav = parseFloat(favorable)
    const tot = parseFloat(total)

    if (isNaN(fav) || isNaN(tot) || tot === 0) return null

    const probability = fav / tot
    const percentage = probability * 100
    const odds = fav / (tot - fav)

    return {
      probability,
      percentage,
      odds: tot - fav > 0 ? odds : Infinity,
      oddsAgainst: tot - fav > 0 ? 1 / odds : 0,
    }
  }, [favorable, total])

  const combResult = useMemo(() => {
    const nVal = parseInt(n)
    const rVal = parseInt(r)

    if (isNaN(nVal) || isNaN(rVal) || nVal < 0 || rVal < 0) return null

    return {
      combination: combination(nVal, rVal),
      permutation: permutation(nVal, rVal),
    }
  }, [n, r])

  const diceResult = useMemo(() => {
    const dice = parseInt(numDice)
    const target = parseInt(targetSum)

    if (isNaN(dice) || isNaN(target) || dice < 1 || dice > 6) return null

    // Calculate probability using dynamic programming
    const dp: number[][] = Array(dice + 1).fill(null).map(() => Array(target + 1).fill(0))
    dp[0][0] = 1

    for (let d = 1; d <= dice; d++) {
      for (let s = d; s <= Math.min(d * 6, target); s++) {
        for (let face = 1; face <= 6 && face <= s; face++) {
          dp[d][s] += dp[d - 1][s - face]
        }
      }
    }

    const favorable = dp[dice][target] || 0
    const totalOutcomes = Math.pow(6, dice)
    const probability = favorable / totalOutcomes

    return {
      favorable,
      total: totalOutcomes,
      probability,
      percentage: probability * 100,
    }
  }, [numDice, targetSum])

  const cardsResult = useMemo(() => {
    const totalCards = 52

    let favorable = 0
    let description = ''

    switch (cardType) {
      case 'suit':
        favorable = 13
        description = t('tools.probabilityCalculator.suitDesc')
        break
      case 'face':
        favorable = 12
        description = t('tools.probabilityCalculator.faceDesc')
        break
      case 'specific':
        favorable = 4
        description = t('tools.probabilityCalculator.specificDesc')
        break
    }

    return {
      favorable,
      total: totalCards,
      probability: favorable / totalCards,
      percentage: (favorable / totalCards) * 100,
      description,
    }
  }, [cardType, t])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'basic', label: t('tools.probabilityCalculator.basic') },
          { key: 'combinations', label: t('tools.probabilityCalculator.combinations') },
          { key: 'dice', label: t('tools.probabilityCalculator.dice') },
          { key: 'cards', label: t('tools.probabilityCalculator.cards') },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key as typeof mode)}
            className={`px-3 py-1 rounded text-sm ${
              mode === m.key ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'basic' && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.probabilityCalculator.favorable')}</label>
              <input
                type="number"
                value={favorable}
                onChange={(e) => setFavorable(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.probabilityCalculator.total')}</label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          {basicResult && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-2xl font-bold text-blue-600">{basicResult.percentage.toFixed(2)}%</div>
                <div className="text-xs text-slate-500">{t('tools.probabilityCalculator.probability')}</div>
              </div>
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-2xl font-bold text-green-600">{basicResult.probability.toFixed(4)}</div>
                <div className="text-xs text-slate-500">{t('tools.probabilityCalculator.decimal')}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'combinations' && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">n ({t('tools.probabilityCalculator.totalItems')})</label>
              <input
                type="number"
                value={n}
                onChange={(e) => setN(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">r ({t('tools.probabilityCalculator.selecting')})</label>
              <input
                type="number"
                value={r}
                onChange={(e) => setR(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          {combResult && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-purple-50 rounded text-center">
                <div className="text-2xl font-bold text-purple-600">{combResult.combination.toLocaleString()}</div>
                <div className="text-xs text-slate-500">C({n},{r})</div>
              </div>
              <div className="p-3 bg-orange-50 rounded text-center">
                <div className="text-2xl font-bold text-orange-600">{combResult.permutation.toLocaleString()}</div>
                <div className="text-xs text-slate-500">P({n},{r})</div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'dice' && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.probabilityCalculator.numDice')}</label>
              <select
                value={numDice}
                onChange={(e) => setNumDice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.probabilityCalculator.targetSum')}</label>
              <input
                type="number"
                value={targetSum}
                onChange={(e) => setTargetSum(e.target.value)}
                min={parseInt(numDice)}
                max={parseInt(numDice) * 6}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          {diceResult && (
            <div className="p-4 bg-blue-50 rounded text-center mt-4">
              <div className="text-3xl font-bold text-blue-600">{diceResult.percentage.toFixed(2)}%</div>
              <div className="text-sm text-slate-600 mt-1">
                {diceResult.favorable} / {diceResult.total} {t('tools.probabilityCalculator.outcomes')}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'cards' && (
        <div className="card p-4 space-y-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.probabilityCalculator.drawingA')}</label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value as typeof cardType)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="suit">{t('tools.probabilityCalculator.anySuit')}</option>
              <option value="face">{t('tools.probabilityCalculator.faceCard')}</option>
              <option value="specific">{t('tools.probabilityCalculator.specificRank')}</option>
            </select>
          </div>

          {cardsResult && (
            <div className="p-4 bg-green-50 rounded text-center mt-4">
              <div className="text-3xl font-bold text-green-600">{cardsResult.percentage.toFixed(2)}%</div>
              <div className="text-sm text-slate-600 mt-1">
                {cardsResult.favorable} / {cardsResult.total}
              </div>
              <div className="text-xs text-slate-500 mt-1">{cardsResult.description}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
