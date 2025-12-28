import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function BmiCalculator() {
  const { t } = useTranslation()
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [heightFeet, setHeightFeet] = useState('')
  const [heightInches, setHeightInches] = useState('')

  const result = useMemo(() => {
    let weightKg: number
    let heightM: number

    if (unit === 'metric') {
      weightKg = parseFloat(weight) || 0
      heightM = (parseFloat(height) || 0) / 100
    } else {
      weightKg = (parseFloat(weight) || 0) * 0.453592
      const totalInches = (parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0)
      heightM = totalInches * 0.0254
    }

    if (weightKg <= 0 || heightM <= 0) return null

    const bmi = weightKg / (heightM * heightM)

    let category: string
    let color: string
    let description: string

    if (bmi < 18.5) {
      category = t('tools.bmiCalculator.underweight')
      color = 'text-blue-500'
      description = t('tools.bmiCalculator.underweightDesc')
    } else if (bmi < 25) {
      category = t('tools.bmiCalculator.normal')
      color = 'text-green-500'
      description = t('tools.bmiCalculator.normalDesc')
    } else if (bmi < 30) {
      category = t('tools.bmiCalculator.overweight')
      color = 'text-yellow-500'
      description = t('tools.bmiCalculator.overweightDesc')
    } else if (bmi < 35) {
      category = t('tools.bmiCalculator.obese1')
      color = 'text-orange-500'
      description = t('tools.bmiCalculator.obese1Desc')
    } else if (bmi < 40) {
      category = t('tools.bmiCalculator.obese2')
      color = 'text-red-500'
      description = t('tools.bmiCalculator.obese2Desc')
    } else {
      category = t('tools.bmiCalculator.obese3')
      color = 'text-red-700'
      description = t('tools.bmiCalculator.obese3Desc')
    }

    const normalMin = 18.5 * heightM * heightM
    const normalMax = 24.9 * heightM * heightM

    return {
      bmi: bmi.toFixed(1),
      category,
      color,
      description,
      normalMin: normalMin.toFixed(1),
      normalMax: normalMax.toFixed(1),
      weightKg: weightKg.toFixed(1),
      heightM: heightM.toFixed(2),
    }
  }, [weight, height, heightFeet, heightInches, unit, t])

  const getBmiPosition = (bmi: number) => {
    if (bmi < 15) return 0
    if (bmi > 40) return 100
    return ((bmi - 15) / 25) * 100
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setUnit('metric')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              unit === 'metric' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.bmiCalculator.metric')}
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              unit === 'imperial' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.bmiCalculator.imperial')}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.bmiCalculator.weight')} ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === 'metric' ? '70' : '154'}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          {unit === 'metric' ? (
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.bmiCalculator.height')} (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.bmiCalculator.feet')}
                </label>
                <input
                  type="number"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                  placeholder="5"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.bmiCalculator.inches')}
                </label>
                <input
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                  placeholder="9"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {t('tools.bmiCalculator.result')}
          </h3>

          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${result.color}`}>
              {result.bmi}
            </div>
            <div className={`text-lg font-medium ${result.color}`}>
              {result.category}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {result.description}
            </div>
          </div>

          <div className="mb-6">
            <div className="relative h-6 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-blue-400"></div>
                <div className="flex-1 bg-green-400"></div>
                <div className="flex-1 bg-yellow-400"></div>
                <div className="flex-1 bg-orange-400"></div>
                <div className="flex-1 bg-red-400"></div>
              </div>
              <div
                className="absolute top-0 h-full w-1 bg-black"
                style={{ left: `${getBmiPosition(parseFloat(result.bmi))}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold">
                  {result.bmi}
                </div>
              </div>
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

          <div className="p-3 bg-slate-50 rounded">
            <div className="text-sm text-slate-600">
              {t('tools.bmiCalculator.healthyRange')}: <span className="font-medium">{result.normalMin} - {result.normalMax} kg</span>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.bmiCalculator.categories')}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-500">{t('tools.bmiCalculator.underweight')}</span>
            <span className="text-slate-500">&lt; 18.5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-500">{t('tools.bmiCalculator.normal')}</span>
            <span className="text-slate-500">18.5 - 24.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-500">{t('tools.bmiCalculator.overweight')}</span>
            <span className="text-slate-500">25 - 29.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-500">{t('tools.bmiCalculator.obese1')}</span>
            <span className="text-slate-500">30 - 34.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-500">{t('tools.bmiCalculator.obese2')}</span>
            <span className="text-slate-500">35 - 39.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-700">{t('tools.bmiCalculator.obese3')}</span>
            <span className="text-slate-500">&ge; 40</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.bmiCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.bmiCalculator.tip1')}</li>
          <li>{t('tools.bmiCalculator.tip2')}</li>
          <li>{t('tools.bmiCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
