import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function RugSizeCalculator() {
  const { t } = useTranslation()
  const [roomType, setRoomType] = useState('living')
  const [roomLength, setRoomLength] = useState('')
  const [roomWidth, setRoomWidth] = useState('')
  const [furnitureLayout, setFurnitureLayout] = useState('allOn')
  const [unit, setUnit] = useState<'m' | 'ft'>('m')

  const roomTypes = [
    { id: 'living', label: t('tools.rugSizeCalculator.livingRoom') },
    { id: 'dining', label: t('tools.rugSizeCalculator.diningRoom') },
    { id: 'bedroom', label: t('tools.rugSizeCalculator.bedroom') },
    { id: 'entryway', label: t('tools.rugSizeCalculator.entryway') },
    { id: 'office', label: t('tools.rugSizeCalculator.office') },
  ]

  const layouts = [
    { id: 'allOn', label: t('tools.rugSizeCalculator.allFurnitureOn') },
    { id: 'frontOn', label: t('tools.rugSizeCalculator.frontLegsOn') },
    { id: 'float', label: t('tools.rugSizeCalculator.floating') },
  ]

  const standardSizes = [
    { label: "3' x 5'", m: { l: 1.5, w: 0.9 }, ft: { l: 5, w: 3 } },
    { label: "4' x 6'", m: { l: 1.8, w: 1.2 }, ft: { l: 6, w: 4 } },
    { label: "5' x 8'", m: { l: 2.4, w: 1.5 }, ft: { l: 8, w: 5 } },
    { label: "6' x 9'", m: { l: 2.7, w: 1.8 }, ft: { l: 9, w: 6 } },
    { label: "8' x 10'", m: { l: 3.0, w: 2.4 }, ft: { l: 10, w: 8 } },
    { label: "9' x 12'", m: { l: 3.7, w: 2.7 }, ft: { l: 12, w: 9 } },
    { label: "10' x 14'", m: { l: 4.3, w: 3.0 }, ft: { l: 14, w: 10 } },
    { label: "12' x 15'", m: { l: 4.6, w: 3.7 }, ft: { l: 15, w: 12 } },
  ]

  const roundRugSizes = [
    { label: "4' round", m: 1.2, ft: 4 },
    { label: "6' round", m: 1.8, ft: 6 },
    { label: "8' round", m: 2.4, ft: 8 },
    { label: "10' round", m: 3.0, ft: 10 },
  ]

  const calculate = () => {
    const rLength = parseFloat(roomLength) || 0
    const rWidth = parseFloat(roomWidth) || 0
    const convFactor = unit === 'ft' ? 0.3048 : 1
    const lengthM = rLength * convFactor
    const widthM = rWidth * convFactor

    let minLength = 0, maxLength = 0, minWidth = 0, maxWidth = 0
    let recommendation = ''

    switch (roomType) {
      case 'living':
        if (furnitureLayout === 'allOn') {
          // All furniture on rug - leave 30-45cm from walls
          minLength = lengthM - 0.9
          maxLength = lengthM - 0.6
          minWidth = widthM - 0.9
          maxWidth = widthM - 0.6
          recommendation = t('tools.rugSizeCalculator.livingAllOnTip')
        } else if (furnitureLayout === 'frontOn') {
          // Front legs on rug
          minLength = lengthM * 0.6
          maxLength = lengthM * 0.75
          minWidth = widthM * 0.6
          maxWidth = widthM * 0.75
          recommendation = t('tools.rugSizeCalculator.livingFrontOnTip')
        } else {
          // Floating rug
          minLength = lengthM * 0.4
          maxLength = lengthM * 0.6
          minWidth = widthM * 0.4
          maxWidth = widthM * 0.6
          recommendation = t('tools.rugSizeCalculator.livingFloatTip')
        }
        break
      case 'dining':
        // Rug should extend 60-75cm beyond table on all sides
        minLength = lengthM * 0.7
        maxLength = lengthM * 0.85
        minWidth = widthM * 0.7
        maxWidth = widthM * 0.85
        recommendation = t('tools.rugSizeCalculator.diningTip')
        break
      case 'bedroom':
        // Rug should extend 45-60cm on sides and foot of bed
        minLength = lengthM * 0.6
        maxLength = lengthM * 0.8
        minWidth = widthM * 0.7
        maxWidth = widthM * 0.9
        recommendation = t('tools.rugSizeCalculator.bedroomTip')
        break
      case 'entryway':
        minLength = lengthM * 0.7
        maxLength = lengthM * 0.9
        minWidth = widthM * 0.6
        maxWidth = widthM * 0.8
        recommendation = t('tools.rugSizeCalculator.entrywayTip')
        break
      case 'office':
        // Chair should roll on rug completely
        minLength = 1.8
        maxLength = 2.4
        minWidth = 1.5
        maxWidth = 2.0
        recommendation = t('tools.rugSizeCalculator.officeTip')
        break
    }

    // Find matching standard sizes
    const matches = standardSizes.filter(size => {
      const sizeData = unit === 'm' ? size.m : size.ft
      const factor = unit === 'm' ? 1 : 0.3048
      return (sizeData.l * factor >= minLength * 0.9 && sizeData.l * factor <= maxLength * 1.1 &&
              sizeData.w * factor >= minWidth * 0.9 && sizeData.w * factor <= maxWidth * 1.1)
    })

    return {
      minLength: unit === 'm' ? minLength : minLength / 0.3048,
      maxLength: unit === 'm' ? maxLength : maxLength / 0.3048,
      minWidth: unit === 'm' ? minWidth : minWidth / 0.3048,
      maxWidth: unit === 'm' ? maxWidth : maxWidth / 0.3048,
      matches,
      recommendation,
    }
  }

  const result = calculate()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.rugSizeCalculator.roomInfo')}</h3>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'm' | 'ft')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="m">{t('tools.rugSizeCalculator.meters')}</option>
            <option value="ft">{t('tools.rugSizeCalculator.feet')}</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {roomTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setRoomType(type.id)}
              className={`px-2 py-1 rounded text-xs ${
                roomType === type.id ? 'bg-amber-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.rugSizeCalculator.roomLength')}</label>
            <input
              type="number"
              value={roomLength}
              onChange={(e) => setRoomLength(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.rugSizeCalculator.roomWidth')}</label>
            <input
              type="number"
              value={roomWidth}
              onChange={(e) => setRoomWidth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {roomType === 'living' && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.rugSizeCalculator.furnitureLayout')}</h3>
          <div className="flex flex-wrap gap-2">
            {layouts.map(layout => (
              <button
                key={layout.id}
                onClick={() => setFurnitureLayout(layout.id)}
                className={`px-3 py-2 rounded text-sm ${
                  furnitureLayout === layout.id ? 'bg-amber-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {layout.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-amber-50">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.rugSizeCalculator.recommendedSize')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.rugSizeCalculator.lengthRange')}:</span>
            <span className="font-medium">{result.minLength.toFixed(1)} - {result.maxLength.toFixed(1)} {unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.rugSizeCalculator.widthRange')}:</span>
            <span className="font-medium">{result.minWidth.toFixed(1)} - {result.maxWidth.toFixed(1)} {unit}</span>
          </div>
          {result.recommendation && (
            <p className="text-sm text-amber-700 mt-2 p-2 bg-amber-100 rounded">{result.recommendation}</p>
          )}
        </div>
      </div>

      {result.matches.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.rugSizeCalculator.matchingStandardSizes')}</h3>
          <div className="flex flex-wrap gap-2">
            {result.matches.map(size => (
              <span key={size.label} className="px-3 py-2 bg-green-100 text-green-700 rounded font-medium">
                {size.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.rugSizeCalculator.standardSizes')}</h3>
        <div className="grid grid-cols-2 gap-2">
          {standardSizes.map(size => (
            <div key={size.label} className="p-2 bg-slate-50 rounded text-sm">
              <span className="font-medium">{size.label}</span>
              <span className="text-slate-500 ml-2">
                ({size.m.l}m x {size.m.w}m)
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.rugSizeCalculator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.rugSizeCalculator.tip1')}</li>
          <li>{t('tools.rugSizeCalculator.tip2')}</li>
          <li>{t('tools.rugSizeCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
