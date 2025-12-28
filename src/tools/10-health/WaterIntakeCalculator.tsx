import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function WaterIntakeCalculator() {
  const { t } = useTranslation()
  const [weight, setWeight] = useState('')
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active' | 'veryActive'>('moderate')
  const [climate, setClimate] = useState<'normal' | 'hot'>('normal')
  const [glasses, setGlasses] = useState(0)
  const [target, setTarget] = useState(8)
  const [today] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const saved = localStorage.getItem('water-intake')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.date === today) {
          setGlasses(data.glasses || 0)
        }
        setTarget(data.target || 8)
      } catch (e) {
        console.error('Failed to load water data')
      }
    }
  }, [today])

  useEffect(() => {
    localStorage.setItem('water-intake', JSON.stringify({ date: today, glasses, target }))
  }, [glasses, target, today])

  const calculateRecommendation = () => {
    const w = parseFloat(weight)
    if (isNaN(w) || w <= 0) return

    let baseWater = w * 0.033
    const activityMultiplier = {
      sedentary: 1,
      moderate: 1.2,
      active: 1.4,
      veryActive: 1.6,
    }
    baseWater *= activityMultiplier[activityLevel]
    if (climate === 'hot') baseWater *= 1.2

    const glassesNeeded = Math.round(baseWater / 0.25)
    setTarget(glassesNeeded)
  }

  const percentage = Math.min((glasses / target) * 100, 100)

  return (
    <div className="space-y-4">
      <div className="card p-6 text-center">
        <div className="text-6xl mb-4">💧</div>
        <div className="text-4xl font-bold text-blue-600">{glasses} / {target}</div>
        <div className="text-sm text-slate-500">{t('tools.waterIntakeCalculator.glasses')}</div>

        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: target }, (_, i) => (
            <div
              key={i}
              className={`w-4 h-8 rounded ${i < glasses ? 'bg-blue-500' : 'bg-slate-200'}`}
            />
          )).slice(0, 10)}
          {target > 10 && <span className="text-slate-400">+{target - 10}</span>}
        </div>

        <div className="h-2 bg-slate-200 rounded-full mt-4">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setGlasses(Math.max(0, glasses - 1))}
            className="flex-1 py-3 bg-slate-100 rounded text-2xl"
          >
            −
          </button>
          <button
            onClick={() => setGlasses(glasses + 1)}
            className="flex-1 py-3 bg-blue-500 text-white rounded text-2xl"
          >
            +
          </button>
        </div>
      </div>

      <div className="card p-4 space-y-4">
        <h3 className="text-sm font-medium text-slate-700">{t('tools.waterIntakeCalculator.calculate')}</h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.waterIntakeCalculator.weight')} (kg)
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
            {t('tools.waterIntakeCalculator.activity')}
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as typeof activityLevel)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          >
            <option value="sedentary">{t('tools.waterIntakeCalculator.sedentary')}</option>
            <option value="moderate">{t('tools.waterIntakeCalculator.moderate')}</option>
            <option value="active">{t('tools.waterIntakeCalculator.active')}</option>
            <option value="veryActive">{t('tools.waterIntakeCalculator.veryActive')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.waterIntakeCalculator.climate')}
          </label>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value as 'normal' | 'hot')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          >
            <option value="normal">{t('tools.waterIntakeCalculator.normal')}</option>
            <option value="hot">{t('tools.waterIntakeCalculator.hot')}</option>
          </select>
        </div>

        <button
          onClick={calculateRecommendation}
          disabled={!weight}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
        >
          {t('tools.waterIntakeCalculator.calculateBtn')}
        </button>
      </div>

      <div className="card p-4 bg-blue-50">
        <p className="text-xs text-slate-600">
          {t('tools.waterIntakeCalculator.tip')}
        </p>
      </div>
    </div>
  )
}
