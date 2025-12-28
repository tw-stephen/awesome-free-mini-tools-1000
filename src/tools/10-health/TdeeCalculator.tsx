import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function TdeeCalculator() {
  const { t } = useTranslation()
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activity, setActivity] = useState(1.55)
  const [result, setResult] = useState<{
    bmr: number
    tdee: number
    weightLoss: number
    weightGain: number
  } | null>(null)

  const activityLevels = [
    { value: 1.2, label: t('tools.tdeeCalculator.sedentary'), desc: t('tools.tdeeCalculator.sedentaryDesc') },
    { value: 1.375, label: t('tools.tdeeCalculator.light'), desc: t('tools.tdeeCalculator.lightDesc') },
    { value: 1.55, label: t('tools.tdeeCalculator.moderate'), desc: t('tools.tdeeCalculator.moderateDesc') },
    { value: 1.725, label: t('tools.tdeeCalculator.active'), desc: t('tools.tdeeCalculator.activeDesc') },
    { value: 1.9, label: t('tools.tdeeCalculator.veryActive'), desc: t('tools.tdeeCalculator.veryActiveDesc') },
  ]

  const calculate = () => {
    const weightKg = parseFloat(weight)
    const heightCm = parseFloat(height)
    const ageYears = parseInt(age)

    if (isNaN(weightKg) || isNaN(heightCm) || isNaN(ageYears) ||
        weightKg <= 0 || heightCm <= 0 || ageYears <= 0) return

    let bmr: number
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageYears)
    } else {
      bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageYears)
    }

    const tdee = bmr * activity

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLoss: Math.round(tdee - 500),
      weightGain: Math.round(tdee + 500),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setGender('male'); setResult(null) }}
          className={`flex-1 py-2 rounded ${gender === 'male' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.tdeeCalculator.male')}
        </button>
        <button
          onClick={() => { setGender('female'); setResult(null) }}
          className={`flex-1 py-2 rounded ${gender === 'female' ? 'bg-pink-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.tdeeCalculator.female')}
        </button>
      </div>

      <div className="card p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.tdeeCalculator.age')}
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
              {t('tools.tdeeCalculator.weight')} (kg)
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
              {t('tools.tdeeCalculator.height')} (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.tdeeCalculator.activityLevel')}
          </label>
          <div className="space-y-2">
            {activityLevels.map(level => (
              <button
                key={level.value}
                onClick={() => setActivity(level.value)}
                className={`w-full p-3 text-left rounded ${
                  activity === level.value ? 'bg-blue-100 border-2 border-blue-500' : 'bg-slate-50'
                }`}
              >
                <div className="font-medium text-sm">{level.label}</div>
                <div className="text-xs text-slate-500">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium"
        >
          {t('tools.tdeeCalculator.calculate')}
        </button>
      </div>

      {result && (
        <>
          <div className="card p-6 text-center bg-green-50">
            <div className="text-sm text-slate-600">{t('tools.tdeeCalculator.yourTdee')}</div>
            <div className="text-4xl font-bold text-green-600">{result.tdee}</div>
            <div className="text-sm text-slate-500">{t('tools.tdeeCalculator.caloriesPerDay')}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="card p-4 text-center bg-red-50">
              <div className="text-sm text-slate-600">{t('tools.tdeeCalculator.loseWeight')}</div>
              <div className="text-2xl font-bold text-red-600">{result.weightLoss}</div>
              <div className="text-xs text-slate-500">-500 cal/day</div>
            </div>
            <div className="card p-4 text-center bg-blue-50">
              <div className="text-sm text-slate-600">{t('tools.tdeeCalculator.gainWeight')}</div>
              <div className="text-2xl font-bold text-blue-600">{result.weightGain}</div>
              <div className="text-xs text-slate-500">+500 cal/day</div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">{t('tools.tdeeCalculator.bmr')}</span>
              <span className="font-bold">{result.bmr} cal</span>
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.tdeeCalculator.whatIsTdee')}</h3>
        <p className="text-xs text-slate-600">
          {t('tools.tdeeCalculator.tdeeExplanation')}
        </p>
      </div>
    </div>
  )
}
