import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface WeightResult {
  formula: string
  weight: number
  range?: { min: number; max: number }
}

export default function IdealWeightCalculator() {
  const { t } = useTranslation()
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [height, setHeight] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [frame, setFrame] = useState<'small' | 'medium' | 'large'>('medium')

  const getHeightInCm = (): number => {
    if (unit === 'metric') {
      return parseFloat(height) || 0
    }
    const ft = parseFloat(heightFt) || 0
    const inches = parseFloat(heightIn) || 0
    return (ft * 12 + inches) * 2.54
  }

  const getHeightInInches = (): number => {
    if (unit === 'imperial') {
      const ft = parseFloat(heightFt) || 0
      const inches = parseFloat(heightIn) || 0
      return ft * 12 + inches
    }
    return (parseFloat(height) || 0) / 2.54
  }

  const calculateIdealWeight = (): WeightResult[] => {
    const heightCm = getHeightInCm()
    const heightInches = getHeightInInches()

    if (heightCm < 100 || heightCm > 250) return []

    const results: WeightResult[] = []
    const inchesOver5Feet = Math.max(0, heightInches - 60)

    // Robinson Formula (1983)
    let robinson: number
    if (gender === 'male') {
      robinson = 52 + 1.9 * inchesOver5Feet
    } else {
      robinson = 49 + 1.7 * inchesOver5Feet
    }
    results.push({ formula: 'Robinson', weight: robinson })

    // Miller Formula (1983)
    let miller: number
    if (gender === 'male') {
      miller = 56.2 + 1.41 * inchesOver5Feet
    } else {
      miller = 53.1 + 1.36 * inchesOver5Feet
    }
    results.push({ formula: 'Miller', weight: miller })

    // Devine Formula (1974)
    let devine: number
    if (gender === 'male') {
      devine = 50 + 2.3 * inchesOver5Feet
    } else {
      devine = 45.5 + 2.3 * inchesOver5Feet
    }
    results.push({ formula: 'Devine', weight: devine })

    // Hamwi Formula (1964)
    let hamwi: number
    if (gender === 'male') {
      hamwi = 48 + 2.7 * inchesOver5Feet
    } else {
      hamwi = 45.5 + 2.2 * inchesOver5Feet
    }
    results.push({ formula: 'Hamwi', weight: hamwi })

    // BMI-based healthy range
    const heightM = heightCm / 100
    const bmiMin = 18.5 * heightM * heightM
    const bmiMax = 24.9 * heightM * heightM
    results.push({
      formula: 'BMI Range',
      weight: (bmiMin + bmiMax) / 2,
      range: { min: bmiMin, max: bmiMax }
    })

    // Apply frame adjustment
    const frameAdjustment = frame === 'small' ? 0.9 : frame === 'large' ? 1.1 : 1
    return results.map(r => ({
      ...r,
      weight: r.weight * frameAdjustment,
      range: r.range ? {
        min: r.range.min * frameAdjustment,
        max: r.range.max * frameAdjustment
      } : undefined
    }))
  }

  const results = calculateIdealWeight()
  const avgWeight = results.length > 0
    ? results.reduce((sum, r) => sum + r.weight, 0) / results.length
    : 0

  const formatWeight = (kg: number): string => {
    if (unit === 'imperial') {
      return `${Math.round(kg * 2.205)} lb`
    }
    return `${Math.round(kg)} kg`
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
          Metric (cm/kg)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`flex-1 py-2 rounded ${
            unit === 'imperial' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
          }`}
        >
          Imperial (ft/lb)
        </button>
      </div>

      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-2">{t('tools.idealWeight.gender')}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-2 rounded ${
                  gender === 'male' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-2 rounded ${
                  gender === 'female' ? 'bg-pink-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.idealWeight.height')}</label>
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
            <label className="block text-sm text-slate-600 mb-2">{t('tools.idealWeight.bodyFrame')}</label>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFrame(f)}
                  className={`flex-1 py-2 rounded capitalize ${
                    frame === f ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <>
          <div className="card p-6 text-center bg-gradient-to-br from-green-50 to-blue-50">
            <div className="text-sm text-slate-500 mb-2">{t('tools.idealWeight.average')}</div>
            <div className="text-5xl font-bold text-green-600">{formatWeight(avgWeight)}</div>
            <div className="text-slate-500 mt-2">
              Average across all formulas
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.idealWeight.byFormula')}</h3>
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.formula} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <div>
                    <div className="font-medium">{result.formula}</div>
                    {result.range && (
                      <div className="text-xs text-slate-500">
                        {formatWeight(result.range.min)} - {formatWeight(result.range.max)}
                      </div>
                    )}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatWeight(result.weight)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-amber-50">
        <h3 className="font-medium text-amber-700 mb-2">{t('tools.idealWeight.disclaimer')}</h3>
        <p className="text-sm text-amber-600">
          {t('tools.idealWeight.disclaimerText')}
        </p>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.idealWeight.aboutFormulas')}</h3>
        <div className="text-sm text-slate-600 space-y-2">
          <p><strong>Robinson (1983):</strong> Most commonly used in clinical practice.</p>
          <p><strong>Miller (1983):</strong> Tends to give lower estimates.</p>
          <p><strong>Devine (1974):</strong> Originally for drug dosing calculations.</p>
          <p><strong>Hamwi (1964):</strong> Quick estimation method.</p>
          <p><strong>BMI Range:</strong> Based on healthy BMI (18.5-24.9).</p>
        </div>
      </div>
    </div>
  )
}
