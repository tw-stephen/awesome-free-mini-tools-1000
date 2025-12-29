import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function FlooringCalculator() {
  const { t } = useTranslation()
  const [roomLength, setRoomLength] = useState('')
  const [roomWidth, setRoomWidth] = useState('')
  const [flooringType, setFlooringType] = useState('plank')
  const [plankLength, setPlankLength] = useState('1.2')
  const [plankWidth, setPlankWidth] = useState('0.19')
  const [wasteFactor, setWasteFactor] = useState('10')
  const [unit, setUnit] = useState<'m' | 'ft'>('m')

  const flooringTypes = [
    { id: 'plank', name: t('tools.flooringCalculator.plank') },
    { id: 'tile', name: t('tools.flooringCalculator.tile') },
    { id: 'carpet', name: t('tools.flooringCalculator.carpet') },
  ]

  const calculate = () => {
    const conversionFactor = unit === 'ft' ? 0.3048 : 1
    const length = parseFloat(roomLength) * conversionFactor || 0
    const width = parseFloat(roomWidth) * conversionFactor || 0
    const pLength = parseFloat(plankLength) || 1.2
    const pWidth = parseFloat(plankWidth) || 0.19
    const waste = parseFloat(wasteFactor) / 100 || 0.1

    const roomArea = length * width
    const areaWithWaste = roomArea * (1 + waste)
    const plankArea = pLength * pWidth
    const planksNeeded = Math.ceil(areaWithWaste / plankArea)
    const boxesNeeded = Math.ceil(planksNeeded / 8) // Assuming 8 planks per box

    return {
      roomArea,
      areaWithWaste,
      planksNeeded,
      boxesNeeded,
    }
  }

  const result = calculate()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.flooringCalculator.roomDimensions')}</h3>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'm' | 'ft')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="m">{t('tools.flooringCalculator.meters')}</option>
            <option value="ft">{t('tools.flooringCalculator.feet')}</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.flooringCalculator.length')}</label>
            <input
              type="number"
              value={roomLength}
              onChange={(e) => setRoomLength(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.flooringCalculator.width')}</label>
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

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.flooringCalculator.flooringType')}</h3>
        <div className="flex gap-2 mb-4">
          {flooringTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setFlooringType(type.id)}
              className={`flex-1 py-2 rounded text-sm ${
                flooringType === type.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        {(flooringType === 'plank' || flooringType === 'tile') && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {flooringType === 'plank' ? t('tools.flooringCalculator.plankLength') : t('tools.flooringCalculator.tileLength')} (m)
              </label>
              <input
                type="number"
                value={plankLength}
                onChange={(e) => setPlankLength(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="1.2"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {flooringType === 'plank' ? t('tools.flooringCalculator.plankWidth') : t('tools.flooringCalculator.tileWidth')} (m)
              </label>
              <input
                type="number"
                value={plankWidth}
                onChange={(e) => setPlankWidth(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0.19"
                step="0.01"
              />
            </div>
          </div>
        )}

        <div className="mt-3">
          <label className="block text-sm text-slate-600 mb-1">{t('tools.flooringCalculator.wasteFactor')} (%)</label>
          <input
            type="number"
            value={wasteFactor}
            onChange={(e) => setWasteFactor(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
            placeholder="10"
          />
          <p className="text-xs text-slate-400 mt-1">{t('tools.flooringCalculator.wasteHint')}</p>
        </div>
      </div>

      <div className="card p-4 bg-amber-50">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.flooringCalculator.result')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.flooringCalculator.roomArea')}:</span>
            <span className="font-medium">{result.roomArea.toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.flooringCalculator.areaWithWaste')}:</span>
            <span className="font-medium">{result.areaWithWaste.toFixed(2)} m²</span>
          </div>
          {(flooringType === 'plank' || flooringType === 'tile') && (
            <>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  {flooringType === 'plank' ? t('tools.flooringCalculator.planksNeeded') : t('tools.flooringCalculator.tilesNeeded')}:
                </span>
                <span className="font-bold text-xl text-amber-600">{result.planksNeeded}</span>
              </div>
              {flooringType === 'plank' && (
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('tools.flooringCalculator.boxesNeeded')}:</span>
                  <span className="font-medium">{result.boxesNeeded} ({t('tools.flooringCalculator.boxHint')})</span>
                </div>
              )}
            </>
          )}
          {flooringType === 'carpet' && (
            <div className="flex justify-between">
              <span className="text-slate-600">{t('tools.flooringCalculator.carpetArea')}:</span>
              <span className="font-bold text-xl text-amber-600">{result.areaWithWaste.toFixed(2)} m²</span>
            </div>
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.flooringCalculator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.flooringCalculator.tip1')}</li>
          <li>{t('tools.flooringCalculator.tip2')}</li>
          <li>{t('tools.flooringCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
