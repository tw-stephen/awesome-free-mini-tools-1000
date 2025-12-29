import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface BakingRatio {
  name: string
  description: string
  baseIngredient: string
  ratios: { ingredient: string; ratio: number; unit: string }[]
  tips: string[]
}

const bakingRatios: BakingRatio[] = [
  {
    name: 'Basic Bread',
    description: 'Simple bread dough',
    baseIngredient: 'flour',
    ratios: [
      { ingredient: 'Flour', ratio: 5, unit: 'parts' },
      { ingredient: 'Water', ratio: 3, unit: 'parts' },
      { ingredient: 'Salt', ratio: 0.1, unit: 'parts' },
      { ingredient: 'Yeast', ratio: 0.05, unit: 'parts' },
    ],
    tips: ['Knead until smooth and elastic', 'Let rise until doubled'],
  },
  {
    name: 'Pie Dough',
    description: 'Flaky pie crust',
    baseIngredient: 'flour',
    ratios: [
      { ingredient: 'Flour', ratio: 3, unit: 'parts' },
      { ingredient: 'Fat (butter/lard)', ratio: 2, unit: 'parts' },
      { ingredient: 'Water', ratio: 1, unit: 'parts' },
    ],
    tips: ['Keep ingredients cold', 'Don\'t overwork the dough'],
  },
  {
    name: 'Cookie Dough',
    description: 'Classic cookie base',
    baseIngredient: 'flour',
    ratios: [
      { ingredient: 'Flour', ratio: 3, unit: 'parts' },
      { ingredient: 'Sugar', ratio: 2, unit: 'parts' },
      { ingredient: 'Fat (butter)', ratio: 1, unit: 'parts' },
    ],
    tips: ['Cream butter and sugar well', 'Chill dough before baking'],
  },
  {
    name: 'Pound Cake',
    description: 'Classic dense cake',
    baseIngredient: 'flour',
    ratios: [
      { ingredient: 'Flour', ratio: 1, unit: 'parts' },
      { ingredient: 'Butter', ratio: 1, unit: 'parts' },
      { ingredient: 'Sugar', ratio: 1, unit: 'parts' },
      { ingredient: 'Eggs', ratio: 1, unit: 'parts' },
    ],
    tips: ['Room temperature ingredients', 'Don\'t overmix'],
  },
  {
    name: 'Sponge Cake',
    description: 'Light airy cake',
    baseIngredient: 'eggs',
    ratios: [
      { ingredient: 'Eggs', ratio: 1, unit: 'parts' },
      { ingredient: 'Sugar', ratio: 1, unit: 'parts' },
      { ingredient: 'Flour', ratio: 1, unit: 'parts' },
    ],
    tips: ['Beat eggs until tripled', 'Fold flour gently'],
  },
  {
    name: 'Biscuits/Scones',
    description: 'Fluffy quick bread',
    baseIngredient: 'flour',
    ratios: [
      { ingredient: 'Flour', ratio: 3, unit: 'parts' },
      { ingredient: 'Fat (butter)', ratio: 1, unit: 'parts' },
      { ingredient: 'Liquid (milk)', ratio: 2, unit: 'parts' },
    ],
    tips: ['Cold butter for flaky texture', 'Handle minimally'],
  },
  {
    name: 'Pasta Dough',
    description: 'Fresh egg pasta',
    baseIngredient: 'flour',
    ratios: [
      { ingredient: 'Flour', ratio: 3, unit: 'parts' },
      { ingredient: 'Eggs', ratio: 2, unit: 'parts' },
    ],
    tips: ['Rest dough 30 minutes', 'Roll as thin as possible'],
  },
  {
    name: 'Crepe Batter',
    description: 'Thin French pancakes',
    baseIngredient: 'flour',
    ratios: [
      { ingredient: 'Flour', ratio: 1, unit: 'parts' },
      { ingredient: 'Milk', ratio: 2, unit: 'parts' },
      { ingredient: 'Eggs', ratio: 1, unit: 'parts' },
    ],
    tips: ['Rest batter 1 hour', 'Use very hot pan'],
  },
  {
    name: 'Pancakes',
    description: 'Fluffy American pancakes',
    baseIngredient: 'flour',
    ratios: [
      { ingredient: 'Flour', ratio: 2, unit: 'parts' },
      { ingredient: 'Milk', ratio: 2, unit: 'parts' },
      { ingredient: 'Egg', ratio: 1, unit: 'parts' },
      { ingredient: 'Butter (melted)', ratio: 0.5, unit: 'parts' },
    ],
    tips: ['Don\'t overmix - lumps are OK', 'Wait for bubbles before flipping'],
  },
  {
    name: 'Muffins',
    description: 'Quick bread muffins',
    baseIngredient: 'flour',
    ratios: [
      { ingredient: 'Flour', ratio: 2, unit: 'parts' },
      { ingredient: 'Liquid (milk)', ratio: 1, unit: 'parts' },
      { ingredient: 'Fat (oil/butter)', ratio: 1, unit: 'parts' },
      { ingredient: 'Sugar', ratio: 1, unit: 'parts' },
      { ingredient: 'Egg', ratio: 1, unit: 'parts' },
    ],
    tips: ['Mix wet and dry separately', 'Fill cups 2/3 full'],
  },
]

export default function BakingRatioCalculator() {
  const { t } = useTranslation()
  const [selectedRatio, setSelectedRatio] = useState(bakingRatios[0])
  const [baseAmount, setBaseAmount] = useState(100)
  const [baseUnit, setBaseUnit] = useState<'g' | 'oz' | 'cups'>('g')

  const unitConversions: Record<string, number> = {
    g: 1,
    oz: 28.35,
    cups: 125, // approximate for flour
  }

  const calculateAmount = (ratio: number) => {
    return baseAmount * ratio
  }

  const formatAmount = (amount: number) => {
    if (baseUnit === 'cups') {
      if (amount < 0.125) return `${(amount * 16).toFixed(1)} tbsp`
      if (amount < 1) {
        const fractions: Record<number, string> = {
          0.125: '1/8', 0.25: '1/4', 0.333: '1/3', 0.5: '1/2', 0.667: '2/3', 0.75: '3/4',
        }
        for (const [dec, frac] of Object.entries(fractions)) {
          if (Math.abs(amount - parseFloat(dec)) < 0.05) return `${frac} cup`
        }
      }
      return `${amount.toFixed(2)} cups`
    }
    return `${amount.toFixed(0)} ${baseUnit}`
  }

  const getTotalFlourEquivalent = () => {
    const flourRatio = selectedRatio.ratios.find(r =>
      r.ingredient.toLowerCase().includes('flour')
    )
    return flourRatio ? calculateAmount(flourRatio.ratio) : baseAmount
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bakingRatioCalculator.selectRecipe')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {bakingRatios.map((ratio, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedRatio(ratio)}
              className={`p-2 rounded text-left text-sm ${
                selectedRatio.name === ratio.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="font-medium">{ratio.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bakingRatioCalculator.baseAmount')}</h3>
        <p className="text-sm text-slate-500 mb-2">
          {t('tools.bakingRatioCalculator.enterFlourAmount')}
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            value={baseAmount}
            onChange={e => setBaseAmount(parseFloat(e.target.value) || 0)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-xl text-right"
          />
          <select
            value={baseUnit}
            onChange={e => setBaseUnit(e.target.value as typeof baseUnit)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            <option value="g">grams</option>
            <option value="oz">ounces</option>
            <option value="cups">cups</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[100, 200, 250, 300, 500].map(amount => (
            <button
              key={amount}
              onClick={() => setBaseAmount(amount)}
              className={`px-3 py-1 rounded ${
                baseAmount === amount ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold">{selectedRatio.name}</div>
          <div className="text-sm opacity-80">{selectedRatio.description}</div>
        </div>
        <div className="bg-white/20 rounded p-4">
          <div className="text-sm opacity-80 mb-2">{t('tools.bakingRatioCalculator.ratio')}</div>
          <div className="flex flex-wrap gap-2">
            {selectedRatio.ratios.map((r, idx) => (
              <span key={idx} className="font-bold">
                {r.ratio} {r.ingredient}
                {idx < selectedRatio.ratios.length - 1 && <span className="mx-2">:</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bakingRatioCalculator.calculatedAmounts')}</h3>
        <div className="space-y-2">
          {selectedRatio.ratios.map((r, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded">
              <div>
                <div className="font-medium">{r.ingredient}</div>
                <div className="text-xs text-slate-500">Ratio: {r.ratio}</div>
              </div>
              <div className="text-xl font-bold text-blue-600">
                {formatAmount(calculateAmount(r.ratio))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRatio.tips.length > 0 && (
        <div className="card p-4 bg-yellow-50">
          <h3 className="font-medium mb-2">{t('tools.bakingRatioCalculator.tips')}</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            {selectedRatio.tips.map((tip, idx) => (
              <li key={idx}>- {tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bakingRatioCalculator.bakersPercentage')}</h3>
        <p className="text-sm text-slate-500 mb-3">
          {t('tools.bakingRatioCalculator.bakersPercentageDesc')}
        </p>
        <div className="space-y-2">
          {selectedRatio.ratios.map((r, idx) => {
            const flourRatio = selectedRatio.ratios.find(ratio =>
              ratio.ingredient.toLowerCase().includes('flour')
            )?.ratio || 1
            const percentage = (r.ratio / flourRatio) * 100
            return (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>{r.ingredient}</span>
                <span className="font-bold">{percentage.toFixed(0)}%</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bakingRatioCalculator.memorize')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium">1-2-3 Cookie</div>
            <div className="text-slate-500">1 sugar : 2 fat : 3 flour</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium">3-2-1 Pie</div>
            <div className="text-slate-500">3 flour : 2 fat : 1 water</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium">1-1-1-1 Pound</div>
            <div className="text-slate-500">Equal parts all</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium">5-3 Bread</div>
            <div className="text-slate-500">5 flour : 3 water</div>
          </div>
        </div>
      </div>
    </div>
  )
}
