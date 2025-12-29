import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ShelfSpacingCalculator() {
  const { t } = useTranslation()
  const [totalHeight, setTotalHeight] = useState('')
  const [numberOfShelves, setNumberOfShelves] = useState('5')
  const [shelfThickness, setShelfThickness] = useState('2')
  const [bottomClearance, setBottomClearance] = useState('10')
  const [topClearance, setTopClearance] = useState('5')
  const [itemType, setItemType] = useState('books')
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')

  const itemTypes = [
    { id: 'books', label: t('tools.shelfSpacingCalculator.books'), minHeight: 25, maxHeight: 32 },
    { id: 'paperbacks', label: t('tools.shelfSpacingCalculator.paperbacks'), minHeight: 18, maxHeight: 23 },
    { id: 'records', label: t('tools.shelfSpacingCalculator.records'), minHeight: 32, maxHeight: 35 },
    { id: 'cds', label: t('tools.shelfSpacingCalculator.cds'), minHeight: 14, maxHeight: 16 },
    { id: 'dvds', label: t('tools.shelfSpacingCalculator.dvds'), minHeight: 19, maxHeight: 21 },
    { id: 'shoes', label: t('tools.shelfSpacingCalculator.shoes'), minHeight: 15, maxHeight: 25 },
    { id: 'kitchen', label: t('tools.shelfSpacingCalculator.kitchen'), minHeight: 20, maxHeight: 35 },
    { id: 'display', label: t('tools.shelfSpacingCalculator.display'), minHeight: 20, maxHeight: 40 },
    { id: 'custom', label: t('tools.shelfSpacingCalculator.custom'), minHeight: 15, maxHeight: 40 },
  ]

  const calculate = () => {
    const total = parseFloat(totalHeight) || 0
    const numShelves = parseInt(numberOfShelves) || 5
    const thickness = parseFloat(shelfThickness) || 2
    const bottom = parseFloat(bottomClearance) || 10
    const top = parseFloat(topClearance) || 5

    // Calculate usable height
    const usableHeight = total - bottom - top - (thickness * numShelves)
    const numSpaces = numShelves + 1 // Spaces between shelves plus top and bottom
    const spacingPerSection = usableHeight / numSpaces

    // Calculate shelf positions from bottom
    const shelfPositions: number[] = []
    let currentPos = bottom
    for (let i = 0; i < numShelves; i++) {
      currentPos += spacingPerSection
      shelfPositions.push(currentPos)
      currentPos += thickness
    }

    // Get recommended spacing for item type
    const item = itemTypes.find(i => i.id === itemType)
    const recommendedMin = item?.minHeight || 15
    const recommendedMax = item?.maxHeight || 40

    // Calculate optimal number of shelves for the item type
    const avgItemHeight = (recommendedMin + recommendedMax) / 2 + 3 // +3cm clearance
    const optimalShelves = Math.floor((total - bottom - top) / (avgItemHeight + thickness))

    return {
      usableHeight,
      spacingPerSection,
      shelfPositions,
      recommendedMin,
      recommendedMax,
      optimalShelves,
      isSpacingAdequate: spacingPerSection >= recommendedMin,
    }
  }

  const result = calculate()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.shelfSpacingCalculator.measurements')}</h3>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'cm' | 'in')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="cm">cm</option>
            <option value="in">inches</option>
          </select>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.shelfSpacingCalculator.totalHeight')}</label>
            <input
              type="number"
              value={totalHeight}
              onChange={(e) => setTotalHeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.shelfSpacingCalculator.numberOfShelves')}</label>
              <input
                type="number"
                value={numberOfShelves}
                onChange={(e) => setNumberOfShelves(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="5"
                min="1"
                max="20"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.shelfSpacingCalculator.shelfThickness')}</label>
              <input
                type="number"
                value={shelfThickness}
                onChange={(e) => setShelfThickness(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.shelfSpacingCalculator.bottomClearance')}</label>
              <input
                type="number"
                value={bottomClearance}
                onChange={(e) => setBottomClearance(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.shelfSpacingCalculator.topClearance')}</label>
              <input
                type="number"
                value={topClearance}
                onChange={(e) => setTopClearance(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.shelfSpacingCalculator.whatStoring')}</h3>
        <div className="flex flex-wrap gap-1">
          {itemTypes.map(item => (
            <button
              key={item.id}
              onClick={() => setItemType(item.id)}
              className={`px-2 py-1 rounded text-xs ${
                itemType === item.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {t('tools.shelfSpacingCalculator.recommendedHeight')}: {result.recommendedMin}-{result.recommendedMax} {unit}
        </p>
      </div>

      <div className={`card p-4 ${result.isSpacingAdequate ? 'bg-green-50' : 'bg-red-50'}`}>
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.shelfSpacingCalculator.result')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.shelfSpacingCalculator.usableHeight')}:</span>
            <span className="font-medium">{result.usableHeight.toFixed(1)} {unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.shelfSpacingCalculator.spacingBetween')}:</span>
            <span className={`font-bold text-xl ${result.isSpacingAdequate ? 'text-green-600' : 'text-red-600'}`}>
              {result.spacingPerSection.toFixed(1)} {unit}
            </span>
          </div>
          {!result.isSpacingAdequate && (
            <p className="text-sm text-red-600">
              {t('tools.shelfSpacingCalculator.spacingWarning')} {result.optimalShelves} {t('tools.shelfSpacingCalculator.shelves')}
            </p>
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.shelfSpacingCalculator.shelfPositions')}</h3>
        <div className="relative h-48 border-2 border-slate-300 rounded bg-slate-50">
          {result.shelfPositions.map((pos, i) => {
            const totalH = parseFloat(totalHeight) || 200
            const percentage = (pos / totalH) * 100
            return (
              <div
                key={i}
                className="absolute left-0 right-0 h-1 bg-amber-600"
                style={{ bottom: `${percentage}%` }}
              >
                <span className="absolute -right-16 -top-2 text-xs text-slate-500">
                  {pos.toFixed(1)}{unit}
                </span>
              </div>
            )
          })}
          <div className="absolute bottom-0 left-2 text-xs text-slate-500">0</div>
          <div className="absolute top-0 left-2 text-xs text-slate-500">{totalHeight}{unit}</div>
        </div>
        <div className="mt-3 space-y-1">
          {result.shelfPositions.map((pos, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-slate-600">{t('tools.shelfSpacingCalculator.shelf')} {i + 1}:</span>
              <span className="font-medium">{pos.toFixed(1)} {unit} {t('tools.shelfSpacingCalculator.fromBottom')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.shelfSpacingCalculator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.shelfSpacingCalculator.tip1')}</li>
          <li>{t('tools.shelfSpacingCalculator.tip2')}</li>
          <li>{t('tools.shelfSpacingCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
