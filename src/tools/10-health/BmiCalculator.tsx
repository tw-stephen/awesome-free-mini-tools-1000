import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function BmiCalculator() {
  const { t } = useTranslation()
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null)

  const calculate = () => {
    let weightKg: number
    let heightM: number

    if (unit === 'metric') {
      weightKg = parseFloat(weight)
      heightM = parseFloat(height) / 100
    } else {
      weightKg = parseFloat(weight) * 0.453592
      const totalInches = parseFloat(feet) * 12 + parseFloat(inches)
      heightM = totalInches * 0.0254
    }

    if (isNaN(weightKg) || isNaN(heightM) || weightKg <= 0 || heightM <= 0) return

    const bmi = weightKg / (heightM * heightM)
    let category: string
    let color: string

    if (bmi < 18.5) {
      category = t('tools.bmiCalculator.underweight')
      color = 'text-blue-600'
    } else if (bmi < 25) {
      category = t('tools.bmiCalculator.normal')
      color = 'text-green-600'
    } else if (bmi < 30) {
      category = t('tools.bmiCalculator.overweight')
      color = 'text-yellow-600'
    } else {
      category = t('tools.bmiCalculator.obese')
      color = 'text-red-600'
    }

    setResult({ bmi, category, color })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setUnit('metric'); setResult(null) }}
          className={`flex-1 py-2 rounded font-medium ${unit === 'metric' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.bmiCalculator.metric')}
        </button>
        <button
          onClick={() => { setUnit('imperial'); setResult(null) }}
          className={`flex-1 py-2 rounded font-medium ${unit === 'imperial' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.bmiCalculator.imperial')}
        </button>
      </div>

      <div className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.bmiCalculator.weight')} ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? '70' : '154'}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        {unit === 'metric' ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.bmiCalculator.height')} (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.bmiCalculator.feet')}
              </label>
              <input
                type="number"
                value={feet}
                onChange={(e) => setFeet(e.target.value)}
                placeholder="5"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.bmiCalculator.inches')}
              </label>
              <input
                type="number"
                value={inches}
                onChange={(e) => setInches(e.target.value)}
                placeholder="9"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium"
        >
          {t('tools.bmiCalculator.calculate')}
        </button>
      </div>

      {result && (
        <div className="card p-6 text-center bg-blue-50">
          <div className="text-sm text-slate-600">{t('tools.bmiCalculator.yourBmi')}</div>
          <div className="text-5xl font-bold text-blue-600">{result.bmi.toFixed(1)}</div>
          <div className={`text-lg font-medium mt-2 ${result.color}`}>{result.category}</div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.bmiCalculator.ranges')}</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-600">{t('tools.bmiCalculator.underweight')}</span>
            <span>&lt; 18.5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">{t('tools.bmiCalculator.normal')}</span>
            <span>18.5 - 24.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-600">{t('tools.bmiCalculator.overweight')}</span>
            <span>25 - 29.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600">{t('tools.bmiCalculator.obese')}</span>
            <span>≥ 30</span>
          </div>
        </div>
      </div>
    </div>
  )
}
