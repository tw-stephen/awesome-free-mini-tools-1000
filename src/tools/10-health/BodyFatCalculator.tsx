import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function BodyFatCalculator() {
  const { t } = useTranslation()
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [_age, _setAge] = useState('')
  const [_weight, _setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [waist, setWaist] = useState('')
  const [neck, setNeck] = useState('')
  const [hip, setHip] = useState('')
  const [result, setResult] = useState<{ bodyFat: number; category: string; color: string } | null>(null)

  const calculate = () => {
    const h = parseFloat(height)
    const w = parseFloat(waist)
    const n = parseFloat(neck)
    const hipVal = parseFloat(hip)

    if (isNaN(h) || isNaN(w) || isNaN(n) || h <= 0 || w <= 0 || n <= 0) return
    if (gender === 'female' && (isNaN(hipVal) || hipVal <= 0)) return

    let bodyFat: number
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w + hipVal - n) + 0.22100 * Math.log10(h)) - 450
    }

    let category: string
    let color: string

    if (gender === 'male') {
      if (bodyFat < 6) { category = t('tools.bodyFatCalculator.essential'); color = 'text-blue-600' }
      else if (bodyFat < 14) { category = t('tools.bodyFatCalculator.athlete'); color = 'text-green-600' }
      else if (bodyFat < 18) { category = t('tools.bodyFatCalculator.fitness'); color = 'text-green-500' }
      else if (bodyFat < 25) { category = t('tools.bodyFatCalculator.average'); color = 'text-yellow-600' }
      else { category = t('tools.bodyFatCalculator.high'); color = 'text-red-600' }
    } else {
      if (bodyFat < 14) { category = t('tools.bodyFatCalculator.essential'); color = 'text-blue-600' }
      else if (bodyFat < 21) { category = t('tools.bodyFatCalculator.athlete'); color = 'text-green-600' }
      else if (bodyFat < 25) { category = t('tools.bodyFatCalculator.fitness'); color = 'text-green-500' }
      else if (bodyFat < 32) { category = t('tools.bodyFatCalculator.average'); color = 'text-yellow-600' }
      else { category = t('tools.bodyFatCalculator.high'); color = 'text-red-600' }
    }

    setResult({ bodyFat, category, color })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setGender('male'); setResult(null) }}
          className={`flex-1 py-2 rounded font-medium ${gender === 'male' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.bodyFatCalculator.male')}
        </button>
        <button
          onClick={() => { setGender('female'); setResult(null) }}
          className={`flex-1 py-2 rounded font-medium ${gender === 'female' ? 'bg-pink-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.bodyFatCalculator.female')}
        </button>
      </div>

      <div className="card p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.bodyFatCalculator.height')} (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.bodyFatCalculator.neck')} (cm)
            </label>
            <input
              type="number"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              placeholder="38"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div className={`grid ${gender === 'female' ? 'grid-cols-2' : ''} gap-2`}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.bodyFatCalculator.waist')} (cm)
            </label>
            <input
              type="number"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder="85"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          {gender === 'female' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.bodyFatCalculator.hip')} (cm)
              </label>
              <input
                type="number"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                placeholder="95"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          )}
        </div>

        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium"
        >
          {t('tools.bodyFatCalculator.calculate')}
        </button>
      </div>

      {result && (
        <div className="card p-6 text-center bg-blue-50">
          <div className="text-sm text-slate-600">{t('tools.bodyFatCalculator.bodyFat')}</div>
          <div className="text-5xl font-bold text-blue-600">{result.bodyFat.toFixed(1)}%</div>
          <div className={`text-lg font-medium mt-2 ${result.color}`}>{result.category}</div>
        </div>
      )}

      <div className="card p-4 bg-yellow-50">
        <p className="text-xs text-slate-600">
          {t('tools.bodyFatCalculator.note')}
        </p>
      </div>
    </div>
  )
}
