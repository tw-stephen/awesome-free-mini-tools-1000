import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function BMICalculator() {
  const { t } = useTranslation()
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')

  const calculateBMI = (): number | null => {
    if (unit === 'metric') {
      const h = parseFloat(height) / 100 // cm to m
      const w = parseFloat(weight)
      if (!h || !w || h <= 0 || w <= 0) return null
      return w / (h * h)
    } else {
      const ft = parseFloat(heightFt) || 0
      const inches = parseFloat(heightIn) || 0
      const totalInches = ft * 12 + inches
      const w = parseFloat(weight)
      if (!totalInches || !w || totalInches <= 0 || w <= 0) return null
      return (w / (totalInches * totalInches)) * 703
    }
  }

  const bmi = calculateBMI()

  const getBMICategory = (bmi: number): { category: string; color: string; emoji: string } => {
    if (bmi < 18.5) return { category: t('tools.bmiCalculator.underweight'), color: 'text-blue-600', emoji: '🔵' }
    if (bmi < 25) return { category: t('tools.bmiCalculator.normal'), color: 'text-green-600', emoji: '🟢' }
    if (bmi < 30) return { category: t('tools.bmiCalculator.overweight'), color: 'text-yellow-600', emoji: '🟡' }
    if (bmi < 35) return { category: t('tools.bmiCalculator.obese1'), color: 'text-orange-600', emoji: '🟠' }
    if (bmi < 40) return { category: t('tools.bmiCalculator.obese2'), color: 'text-red-500', emoji: '🔴' }
    return { category: t('tools.bmiCalculator.obese3'), color: 'text-red-700', emoji: '⭕' }
  }

  const getHealthyWeightRange = (): { min: number; max: number } | null => {
    let heightM: number
    if (unit === 'metric') {
      heightM = parseFloat(height) / 100
    } else {
      const ft = parseFloat(heightFt) || 0
      const inches = parseFloat(heightIn) || 0
      const totalInches = ft * 12 + inches
      heightM = totalInches * 0.0254
    }
    if (!heightM || heightM <= 0) return null

    const minWeight = 18.5 * heightM * heightM
    const maxWeight = 24.9 * heightM * heightM

    if (unit === 'imperial') {
      return { min: Math.round(minWeight * 2.205), max: Math.round(maxWeight * 2.205) }
    }
    return { min: Math.round(minWeight), max: Math.round(maxWeight) }
  }

  const healthyRange = getHealthyWeightRange()
  const bmiInfo = bmi ? getBMICategory(bmi) : null

  const getBMIPosition = (bmi: number): number => {
    // Scale from 15 to 40
    const min = 15
    const max = 40
    const position = ((bmi - min) / (max - min)) * 100
    return Math.max(0, Math.min(100, position))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('metric')}
          className={`flex-1 py-2 rounded ${
            unit === 'metric' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
          }`}
        >
          Metric (kg/cm)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`flex-1 py-2 rounded ${
            unit === 'imperial' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
          }`}
        >
          Imperial (lb/ft)
        </button>
      </div>

      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.bmiCalculator.height')}</label>
            {unit === 'metric' ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="170"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
                <span className="text-slate-500">cm</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  placeholder="5"
                  className="w-20 px-3 py-2 border border-slate-300 rounded"
                />
                <span className="text-slate-500">ft</span>
                <input
                  type="number"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  placeholder="7"
                  className="w-20 px-3 py-2 border border-slate-300 rounded"
                />
                <span className="text-slate-500">in</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.bmiCalculator.weight')}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unit === 'metric' ? '70' : '154'}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <span className="text-slate-500">{unit === 'metric' ? 'kg' : 'lb'}</span>
            </div>
          </div>
        </div>
      </div>

      {bmi && bmiInfo && (
        <div className="card p-6 text-center">
          <div className="text-sm text-slate-500 mb-2">{t('tools.bmiCalculator.result')}</div>
          <div className={`text-5xl font-bold ${bmiInfo.color}`}>{bmi.toFixed(1)}</div>
          <div className={`text-xl mt-2 ${bmiInfo.color} flex items-center justify-center gap-2`}>
            <span>{bmiInfo.emoji}</span>
            <span>{bmiInfo.category}</span>
          </div>

          <div className="mt-6">
            <div className="relative h-4 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="w-[14%] bg-blue-400" title="Underweight" />
                <div className="w-[26%] bg-green-400" title="Normal" />
                <div className="w-[20%] bg-yellow-400" title="Overweight" />
                <div className="w-[20%] bg-orange-400" title="Obese I" />
                <div className="w-[20%] bg-red-400" title="Obese II-III" />
              </div>
              <div
                className="absolute top-0 w-3 h-4 bg-slate-800 rounded-sm transform -translate-x-1/2 transition-all"
                style={{ left: `${getBMIPosition(bmi)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40</span>
            </div>
          </div>

          {healthyRange && (
            <div className="mt-4 p-3 bg-green-50 rounded text-sm text-green-700">
              {t('tools.bmiCalculator.healthyRange')}: {healthyRange.min} - {healthyRange.max}{' '}
              {unit === 'metric' ? 'kg' : 'lb'}
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bmiCalculator.categories')}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-600">🔵 {t('tools.bmiCalculator.underweight')}</span>
            <span className="text-slate-500">&lt; 18.5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">🟢 {t('tools.bmiCalculator.normal')}</span>
            <span className="text-slate-500">18.5 - 24.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-600">🟡 {t('tools.bmiCalculator.overweight')}</span>
            <span className="text-slate-500">25 - 29.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-600">🟠 {t('tools.bmiCalculator.obese1')}</span>
            <span className="text-slate-500">30 - 34.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600">🔴 {t('tools.bmiCalculator.obese2')}</span>
            <span className="text-slate-500">≥ 35</span>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-amber-50">
        <h3 className="font-medium text-amber-700 mb-2">{t('tools.bmiCalculator.disclaimer')}</h3>
        <p className="text-sm text-amber-600">
          {t('tools.bmiCalculator.disclaimerText')}
        </p>
      </div>
    </div>
  )
}
