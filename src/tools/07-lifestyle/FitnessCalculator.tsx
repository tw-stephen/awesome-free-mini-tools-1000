import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function FitnessCalculator() {
  const { t } = useTranslation()
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activityLevel, setActivityLevel] = useState('1.55')
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain')

  const results = useMemo(() => {
    const ageNum = parseInt(age) || 0
    const heightNum = parseInt(height) || 0
    const weightNum = parseFloat(weight) || 0

    if (ageNum <= 0 || heightNum <= 0 || weightNum <= 0) return null

    // Mifflin-St Jeor Equation for BMR
    let bmr: number
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161
    }

    const activity = parseFloat(activityLevel)
    const tdee = bmr * activity

    // Macros calculation
    let targetCalories = tdee
    if (goal === 'lose') targetCalories = tdee - 500
    if (goal === 'gain') targetCalories = tdee + 300

    // Macro ratios (protein:carbs:fat)
    const proteinRatio = goal === 'gain' ? 0.30 : 0.25
    const fatRatio = 0.25
    const carbRatio = 1 - proteinRatio - fatRatio

    const protein = (targetCalories * proteinRatio) / 4
    const fat = (targetCalories * fatRatio) / 9
    const carbs = (targetCalories * carbRatio) / 4

    // Max heart rate and zones
    const maxHR = 220 - ageNum
    const zones = {
      warmUp: { min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6) },
      fatBurn: { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
      cardio: { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8) },
      peak: { min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9) },
    }

    // BMI
    const heightM = heightNum / 100
    const bmi = weightNum / (heightM * heightM)

    // Ideal weight range (BMI 18.5-24.9)
    const idealWeightMin = 18.5 * heightM * heightM
    const idealWeightMax = 24.9 * heightM * heightM

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      maxHR,
      zones,
      bmi: bmi.toFixed(1),
      idealWeightMin: Math.round(idealWeightMin),
      idealWeightMax: Math.round(idealWeightMax),
    }
  }, [age, gender, height, weight, activityLevel, goal])

  const activityLevels = [
    { value: '1.2', label: t('tools.fitnessCalculator.sedentary') },
    { value: '1.375', label: t('tools.fitnessCalculator.light') },
    { value: '1.55', label: t('tools.fitnessCalculator.moderate') },
    { value: '1.725', label: t('tools.fitnessCalculator.active') },
    { value: '1.9', label: t('tools.fitnessCalculator.veryActive') },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.fitnessCalculator.age')}
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.fitnessCalculator.gender')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-2 rounded ${
                  gender === 'male' ? 'bg-blue-500 text-white' : 'bg-slate-200'
                }`}
              >
                {t('tools.fitnessCalculator.male')}
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-2 rounded ${
                  gender === 'female' ? 'bg-pink-500 text-white' : 'bg-slate-200'
                }`}
              >
                {t('tools.fitnessCalculator.female')}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.fitnessCalculator.height')} (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.fitnessCalculator.weight')} (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.fitnessCalculator.activityLevel')}
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {activityLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.fitnessCalculator.goal')}
          </label>
          <div className="flex gap-2">
            {(['lose', 'maintain', 'gain'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`flex-1 py-2 rounded ${
                  goal === g ? 'bg-green-500 text-white' : 'bg-slate-200'
                }`}
              >
                {t(`tools.fitnessCalculator.${g}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {results && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.fitnessCalculator.calorieNeeds')}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-xl font-bold text-purple-600">{results.bmr}</div>
                <div className="text-xs text-slate-500">BMR</div>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-xl font-bold text-blue-600">{results.tdee}</div>
                <div className="text-xs text-slate-500">TDEE</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-xl font-bold text-green-600">{results.targetCalories}</div>
                <div className="text-xs text-slate-500">{t('tools.fitnessCalculator.target')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.fitnessCalculator.macros')}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-xl font-bold text-blue-600">{results.protein}g</div>
                <div className="text-xs text-slate-500">{t('tools.fitnessCalculator.protein')}</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <div className="text-xl font-bold text-yellow-600">{results.carbs}g</div>
                <div className="text-xs text-slate-500">{t('tools.fitnessCalculator.carbs')}</div>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <div className="text-xl font-bold text-red-500">{results.fat}g</div>
                <div className="text-xs text-slate-500">{t('tools.fitnessCalculator.fat')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.fitnessCalculator.heartRateZones')}
            </h3>
            <div className="text-center mb-3">
              <span className="text-sm text-slate-500">{t('tools.fitnessCalculator.maxHR')}: </span>
              <span className="font-bold text-red-500">{results.maxHR} bpm</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-green-50 rounded">
                <span className="text-sm">{t('tools.fitnessCalculator.warmUp')}</span>
                <span className="font-mono text-sm">{results.zones.warmUp.min}-{results.zones.warmUp.max} bpm</span>
              </div>
              <div className="flex justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm">{t('tools.fitnessCalculator.fatBurn')}</span>
                <span className="font-mono text-sm">{results.zones.fatBurn.min}-{results.zones.fatBurn.max} bpm</span>
              </div>
              <div className="flex justify-between p-2 bg-orange-50 rounded">
                <span className="text-sm">{t('tools.fitnessCalculator.cardio')}</span>
                <span className="font-mono text-sm">{results.zones.cardio.min}-{results.zones.cardio.max} bpm</span>
              </div>
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span className="text-sm">{t('tools.fitnessCalculator.peak')}</span>
                <span className="font-mono text-sm">{results.zones.peak.min}-{results.zones.peak.max} bpm</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.fitnessCalculator.bodyStats')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm">BMI</span>
                <span className="font-mono text-sm">{results.bmi}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm">{t('tools.fitnessCalculator.idealWeight')}</span>
                <span className="font-mono text-sm">{results.idealWeightMin}-{results.idealWeightMax} kg</span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.fitnessCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.fitnessCalculator.tip1')}</li>
          <li>{t('tools.fitnessCalculator.tip2')}</li>
          <li>{t('tools.fitnessCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
