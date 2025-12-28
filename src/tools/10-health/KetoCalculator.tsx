import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface KetoResult {
  calories: number
  fat: number
  protein: number
  carbs: number
  fatGrams: number
  proteinGrams: number
  carbGrams: number
}

export default function KetoCalculator() {
  const { t } = useTranslation()
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activity, setActivity] = useState('sedentary')
  const [goal, setGoal] = useState('maintain')
  const [carbLimit, setCarbLimit] = useState('20')
  const [result, setResult] = useState<KetoResult | null>(null)

  const activityLevels = [
    { id: 'sedentary', multiplier: 1.2 },
    { id: 'light', multiplier: 1.375 },
    { id: 'moderate', multiplier: 1.55 },
    { id: 'active', multiplier: 1.725 },
    { id: 'veryActive', multiplier: 1.9 },
  ]

  const goalMultipliers: Record<string, number> = {
    lose: 0.8,
    maintain: 1,
    gain: 1.1,
  }

  const calculate = () => {
    const w = parseFloat(weight)
    const h = parseFloat(height)
    const a = parseFloat(age)
    const carbs = parseFloat(carbLimit)

    if (isNaN(w) || isNaN(h) || isNaN(a) || isNaN(carbs)) return

    // Calculate BMR using Mifflin-St Jeor
    let bmr
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161
    }

    const activityMultiplier = activityLevels.find(l => l.id === activity)?.multiplier || 1.2
    const tdee = bmr * activityMultiplier
    const calories = Math.round(tdee * goalMultipliers[goal])

    // Standard keto ratios: 70% fat, 25% protein, 5% carbs
    const carbCalories = carbs * 4
    const remainingCalories = calories - carbCalories

    // Protein: 0.8-1g per lb of lean body mass, approximated as 25% of remaining
    const proteinCalories = remainingCalories * 0.30
    const fatCalories = remainingCalories * 0.70

    const fatGrams = Math.round(fatCalories / 9)
    const proteinGrams = Math.round(proteinCalories / 4)

    setResult({
      calories,
      fat: Math.round((fatCalories / calories) * 100),
      protein: Math.round((proteinCalories / calories) * 100),
      carbs: Math.round((carbCalories / calories) * 100),
      fatGrams,
      proteinGrams,
      carbGrams: carbs,
    })
  }

  const ketoFoods = [
    { name: 'Avocado', fat: 15, protein: 2, carbs: 2 },
    { name: 'Eggs', fat: 5, protein: 6, carbs: 0.6 },
    { name: 'Butter', fat: 12, protein: 0, carbs: 0 },
    { name: 'Bacon', fat: 14, protein: 12, carbs: 0 },
    { name: 'Salmon', fat: 13, protein: 20, carbs: 0 },
    { name: 'Cheese', fat: 9, protein: 7, carbs: 0.4 },
    { name: 'Olive Oil', fat: 14, protein: 0, carbs: 0 },
    { name: 'Almonds', fat: 14, protein: 6, carbs: 2 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setGender('male')}
          className={`flex-1 py-2 rounded ${gender === 'male' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.ketoCalculator.male')}
        </button>
        <button
          onClick={() => setGender('female')}
          className={`flex-1 py-2 rounded ${gender === 'female' ? 'bg-pink-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.ketoCalculator.female')}
        </button>
      </div>

      <div className="card p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.ketoCalculator.age')}
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="30"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.ketoCalculator.weight')} (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.ketoCalculator.height')} (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.ketoCalculator.activity')}
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          >
            {activityLevels.map(level => (
              <option key={level.id} value={level.id}>
                {t(`tools.ketoCalculator.${level.id}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.ketoCalculator.goal')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['lose', 'maintain', 'gain'].map(g => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`py-2 rounded text-sm ${
                  goal === g ? 'bg-green-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t(`tools.ketoCalculator.goal${g.charAt(0).toUpperCase() + g.slice(1)}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.ketoCalculator.dailyCarbs')} (g)
          </label>
          <input
            type="number"
            value={carbLimit}
            onChange={(e) => setCarbLimit(e.target.value)}
            placeholder="20"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{t('tools.ketoCalculator.strict')} (20g)</span>
            <span>{t('tools.ketoCalculator.moderate')} (50g)</span>
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!age || !weight || !height}
          className="w-full py-2 bg-green-500 text-white rounded font-medium disabled:opacity-50"
        >
          {t('tools.ketoCalculator.calculate')}
        </button>
      </div>

      {result && (
        <>
          <div className="card p-6 text-center bg-green-50">
            <div className="text-sm text-slate-600">{t('tools.ketoCalculator.dailyCalories')}</div>
            <div className="text-4xl font-bold text-green-600">{result.calories}</div>
            <div className="text-sm text-slate-500">{t('tools.ketoCalculator.kcalDay')}</div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="card p-4 text-center bg-yellow-50">
              <div className="text-2xl font-bold text-yellow-600">{result.fatGrams}g</div>
              <div className="text-xs text-slate-500">{t('tools.ketoCalculator.fat')}</div>
              <div className="text-xs text-yellow-600">{result.fat}%</div>
            </div>
            <div className="card p-4 text-center bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{result.proteinGrams}g</div>
              <div className="text-xs text-slate-500">{t('tools.ketoCalculator.protein')}</div>
              <div className="text-xs text-blue-600">{result.protein}%</div>
            </div>
            <div className="card p-4 text-center bg-red-50">
              <div className="text-2xl font-bold text-red-600">{result.carbGrams}g</div>
              <div className="text-xs text-slate-500">{t('tools.ketoCalculator.carbs')}</div>
              <div className="text-xs text-red-600">{result.carbs}%</div>
            </div>
          </div>

          <div className="card p-4">
            <div className="h-4 flex rounded-full overflow-hidden">
              <div
                className="bg-yellow-400"
                style={{ width: `${result.fat}%` }}
              />
              <div
                className="bg-blue-400"
                style={{ width: `${result.protein}%` }}
              />
              <div
                className="bg-red-400"
                style={{ width: `${result.carbs}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-yellow-600">{t('tools.ketoCalculator.fat')}</span>
              <span className="text-blue-600">{t('tools.ketoCalculator.protein')}</span>
              <span className="text-red-600">{t('tools.ketoCalculator.carbs')}</span>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.ketoCalculator.ketoFoods')}</h3>
        <div className="space-y-2">
          {ketoFoods.map(food => (
            <div key={food.name} className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="text-sm font-medium">{food.name}</span>
              <div className="flex gap-2 text-xs">
                <span className="text-yellow-600">{food.fat}g F</span>
                <span className="text-blue-600">{food.protein}g P</span>
                <span className="text-red-600">{food.carbs}g C</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
