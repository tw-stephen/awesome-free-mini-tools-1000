import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function BmrCalculator() {
  const { t } = useTranslation()
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [result, setResult] = useState<{ bmr: number; formula: string } | null>(null)

  const calculate = () => {
    let weightKg: number
    let heightCm: number
    const ageYears = parseInt(age)

    if (unit === 'metric') {
      weightKg = parseFloat(weight)
      heightCm = parseFloat(height)
    } else {
      weightKg = parseFloat(weight) * 0.453592
      heightCm = parseFloat(height) * 2.54
    }

    if (isNaN(weightKg) || isNaN(heightCm) || isNaN(ageYears) ||
        weightKg <= 0 || heightCm <= 0 || ageYears <= 0) return

    let bmr: number
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageYears)
    } else {
      bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageYears)
    }

    setResult({
      bmr: Math.round(bmr),
      formula: 'Mifflin-St Jeor',
    })
  }

  const activityMultipliers = [
    { level: 'sedentary', multiplier: 1.2, description: t('tools.bmrCalculator.sedentaryDesc') },
    { level: 'light', multiplier: 1.375, description: t('tools.bmrCalculator.lightDesc') },
    { level: 'moderate', multiplier: 1.55, description: t('tools.bmrCalculator.moderateDesc') },
    { level: 'active', multiplier: 1.725, description: t('tools.bmrCalculator.activeDesc') },
    { level: 'veryActive', multiplier: 1.9, description: t('tools.bmrCalculator.veryActiveDesc') },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setUnit('metric'); setResult(null) }}
          className={`flex-1 py-2 rounded ${unit === 'metric' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.bmrCalculator.metric')}
        </button>
        <button
          onClick={() => { setUnit('imperial'); setResult(null) }}
          className={`flex-1 py-2 rounded ${unit === 'imperial' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.bmrCalculator.imperial')}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { setGender('male'); setResult(null) }}
          className={`flex-1 py-2 rounded ${gender === 'male' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.bmrCalculator.male')}
        </button>
        <button
          onClick={() => { setGender('female'); setResult(null) }}
          className={`flex-1 py-2 rounded ${gender === 'female' ? 'bg-pink-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.bmrCalculator.female')}
        </button>
      </div>

      <div className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.bmrCalculator.age')}
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="25"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.bmrCalculator.weight')} ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? '70' : '154'}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.bmrCalculator.height')} ({unit === 'metric' ? 'cm' : 'in'})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === 'metric' ? '175' : '69'}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium"
        >
          {t('tools.bmrCalculator.calculate')}
        </button>
      </div>

      {result && (
        <>
          <div className="card p-6 text-center bg-blue-50">
            <div className="text-sm text-slate-600">{t('tools.bmrCalculator.yourBmr')}</div>
            <div className="text-4xl font-bold text-blue-600">{result.bmr}</div>
            <div className="text-sm text-slate-500">{t('tools.bmrCalculator.caloriesPerDay')}</div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.bmrCalculator.dailyNeeds')}</h3>
            <div className="space-y-2">
              {activityMultipliers.map(item => (
                <div key={item.level} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <div>
                    <div className="text-sm font-medium">{t(`tools.bmrCalculator.${item.level}`)}</div>
                    <div className="text-xs text-slate-500">{item.description}</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round(result.bmr * item.multiplier)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.bmrCalculator.whatIsBmr')}</h3>
        <p className="text-xs text-slate-600">
          {t('tools.bmrCalculator.bmrExplanation')}
        </p>
      </div>
    </div>
  )
}
