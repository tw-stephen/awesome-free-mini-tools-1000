import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProteinIntakeCalculator() {
  const { t } = useTranslation()
  const [weight, setWeight] = useState('')
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg')
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain' | 'athlete'>('maintain')
  const [result, setResult] = useState<{ min: number; max: number; recommended: number } | null>(null)

  const goals = [
    { id: 'maintain', multiplier: { min: 0.8, max: 1.0 } },
    { id: 'lose', multiplier: { min: 1.2, max: 1.6 } },
    { id: 'gain', multiplier: { min: 1.6, max: 2.2 } },
    { id: 'athlete', multiplier: { min: 1.8, max: 2.5 } },
  ]

  const proteinSources = [
    { name: 'Chicken Breast', protein: 31, serving: '100g' },
    { name: 'Eggs', protein: 6, serving: '1 large' },
    { name: 'Greek Yogurt', protein: 10, serving: '100g' },
    { name: 'Salmon', protein: 25, serving: '100g' },
    { name: 'Tofu', protein: 8, serving: '100g' },
    { name: 'Lentils', protein: 9, serving: '100g cooked' },
    { name: 'Whey Protein', protein: 25, serving: '1 scoop' },
    { name: 'Beef', protein: 26, serving: '100g' },
  ]

  const calculate = () => {
    let weightKg = parseFloat(weight)
    if (isNaN(weightKg) || weightKg <= 0) return

    if (unit === 'lbs') weightKg *= 0.453592

    const selectedGoal = goals.find(g => g.id === goal)
    if (!selectedGoal) return

    const min = Math.round(weightKg * selectedGoal.multiplier.min)
    const max = Math.round(weightKg * selectedGoal.multiplier.max)
    const recommended = Math.round((min + max) / 2)

    setResult({ min, max, recommended })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('kg')}
          className={`flex-1 py-2 rounded ${unit === 'kg' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          kg
        </button>
        <button
          onClick={() => setUnit('lbs')}
          className={`flex-1 py-2 rounded ${unit === 'lbs' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          lbs
        </button>
      </div>

      <div className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.proteinIntakeCalculator.bodyWeight')} ({unit})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'kg' ? '70' : '154'}
            className="w-full px-3 py-2 border border-slate-300 rounded text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.proteinIntakeCalculator.goal')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {goals.map(g => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id as typeof goal)}
                className={`p-3 rounded text-center ${
                  goal === g.id ? 'bg-green-500 text-white' : 'bg-slate-100'
                }`}
              >
                <div className="font-medium text-sm">{t(`tools.proteinIntakeCalculator.${g.id}`)}</div>
                <div className="text-xs opacity-80">{g.multiplier.min}-{g.multiplier.max}g/kg</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!weight}
          className="w-full py-2 bg-green-500 text-white rounded font-medium disabled:opacity-50"
        >
          {t('tools.proteinIntakeCalculator.calculate')}
        </button>
      </div>

      {result && (
        <>
          <div className="card p-6 text-center bg-green-50">
            <div className="text-sm text-slate-600">{t('tools.proteinIntakeCalculator.dailyProtein')}</div>
            <div className="text-4xl font-bold text-green-600">{result.recommended}g</div>
            <div className="text-sm text-slate-500 mt-1">
              {t('tools.proteinIntakeCalculator.range')}: {result.min}g - {result.max}g
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.proteinIntakeCalculator.mealDistribution')}</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="font-bold text-blue-600">{Math.round(result.recommended * 0.3)}g</div>
                <div className="text-xs text-slate-500">{t('tools.proteinIntakeCalculator.breakfast')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="font-bold text-blue-600">{Math.round(result.recommended * 0.35)}g</div>
                <div className="text-xs text-slate-500">{t('tools.proteinIntakeCalculator.lunch')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="font-bold text-blue-600">{Math.round(result.recommended * 0.35)}g</div>
                <div className="text-xs text-slate-500">{t('tools.proteinIntakeCalculator.dinner')}</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.proteinIntakeCalculator.sources')}</h3>
        <div className="space-y-2">
          {proteinSources.map(source => (
            <div key={source.name} className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <div>
                <div className="text-sm font-medium">{source.name}</div>
                <div className="text-xs text-slate-500">{source.serving}</div>
              </div>
              <div className="text-green-600 font-bold">{source.protein}g</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-green-50">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.proteinIntakeCalculator.tips')}</h3>
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.proteinIntakeCalculator.tip1')}</li>
          <li>{t('tools.proteinIntakeCalculator.tip2')}</li>
          <li>{t('tools.proteinIntakeCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
