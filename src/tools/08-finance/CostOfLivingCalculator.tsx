import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// Simplified cost of living indices (NYC = 100)
const cityIndices: Record<string, { name: string; index: number }> = {
  nyc: { name: 'New York City', index: 100 },
  sf: { name: 'San Francisco', index: 95 },
  la: { name: 'Los Angeles', index: 75 },
  chicago: { name: 'Chicago', index: 65 },
  houston: { name: 'Houston', index: 55 },
  phoenix: { name: 'Phoenix', index: 55 },
  seattle: { name: 'Seattle', index: 75 },
  boston: { name: 'Boston', index: 80 },
  denver: { name: 'Denver', index: 65 },
  austin: { name: 'Austin', index: 60 },
  miami: { name: 'Miami', index: 70 },
  atlanta: { name: 'Atlanta', index: 55 },
}

export default function CostOfLivingCalculator() {
  const { t } = useTranslation()
  const [currentCity, setCurrentCity] = useState('nyc')
  const [targetCity, setTargetCity] = useState('austin')
  const [currentSalary, setCurrentSalary] = useState('')

  const result = useMemo(() => {
    const salary = parseFloat(currentSalary) || 0
    if (salary <= 0) return null

    const currentIndex = cityIndices[currentCity].index
    const targetIndex = cityIndices[targetCity].index

    const adjustmentRatio = targetIndex / currentIndex
    const equivalentSalary = salary * adjustmentRatio
    const difference = equivalentSalary - salary
    const percentChange = ((equivalentSalary - salary) / salary) * 100

    // Breakdown estimates
    const housingRatio = (targetIndex / currentIndex) * 1.2 // Housing varies more
    const foodRatio = (targetIndex / currentIndex) * 0.9 // Food varies less
    const transportRatio = (targetIndex / currentIndex) * 0.95

    return {
      equivalentSalary,
      difference,
      percentChange,
      adjustmentRatio,
      housingChange: (housingRatio - 1) * 100,
      foodChange: (foodRatio - 1) * 100,
      transportChange: (transportRatio - 1) * 100,
      isLower: targetIndex < currentIndex,
    }
  }, [currentCity, targetCity, currentSalary])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.costOfLivingCalculator.currentCity')}
          </label>
          <select
            value={currentCity}
            onChange={(e) => setCurrentCity(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {Object.entries(cityIndices).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.costOfLivingCalculator.currentSalary')}
          </label>
          <input
            type="number"
            value={currentSalary}
            onChange={(e) => setCurrentSalary(e.target.value)}
            placeholder="100000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.costOfLivingCalculator.targetCity')}
          </label>
          <select
            value={targetCity}
            onChange={(e) => setTargetCity(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {Object.entries(cityIndices).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className={`card p-4 text-center ${result.isLower ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-sm text-slate-600">{t('tools.costOfLivingCalculator.equivalentSalary')}</div>
            <div className={`text-3xl font-bold ${result.isLower ? 'text-green-600' : 'text-red-600'}`}>
              ${result.equivalentSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm text-slate-500">
              {result.isLower ? '-' : '+'}${Math.abs(result.difference).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              ({result.isLower ? '' : '+'}{result.percentChange.toFixed(1)}%)
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.costOfLivingCalculator.comparison')}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  {cityIndices[currentCity].index}
                </div>
                <div className="text-xs text-slate-500">{cityIndices[currentCity].name}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  {cityIndices[targetCity].index}
                </div>
                <div className="text-xs text-slate-500">{cityIndices[targetCity].name}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.costOfLivingCalculator.categoryChanges')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('tools.costOfLivingCalculator.housing')}</span>
                <span className={`font-medium ${result.housingChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.housingChange >= 0 ? '+' : ''}{result.housingChange.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('tools.costOfLivingCalculator.food')}</span>
                <span className={`font-medium ${result.foodChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.foodChange >= 0 ? '+' : ''}{result.foodChange.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('tools.costOfLivingCalculator.transportation')}</span>
                <span className={`font-medium ${result.transportChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.transportChange >= 0 ? '+' : ''}{result.transportChange.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center">
            {t('tools.costOfLivingCalculator.disclaimer')}
          </p>
        </div>
      )}
    </div>
  )
}
