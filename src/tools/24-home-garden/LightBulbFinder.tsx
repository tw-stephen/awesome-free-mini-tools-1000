import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LightBulbFinder() {
  const { t } = useTranslation()
  const [roomType, setRoomType] = useState('living')
  const [roomArea, setRoomArea] = useState('')
  const [currentWattage, setCurrentWattage] = useState('')
  const [bulbType, setBulbType] = useState('led')

  const roomTypes = [
    { id: 'living', name: t('tools.lightBulbFinder.livingRoom'), lux: 300 },
    { id: 'bedroom', name: t('tools.lightBulbFinder.bedroom'), lux: 200 },
    { id: 'kitchen', name: t('tools.lightBulbFinder.kitchen'), lux: 500 },
    { id: 'bathroom', name: t('tools.lightBulbFinder.bathroom'), lux: 400 },
    { id: 'office', name: t('tools.lightBulbFinder.office'), lux: 500 },
    { id: 'dining', name: t('tools.lightBulbFinder.diningRoom'), lux: 300 },
    { id: 'hallway', name: t('tools.lightBulbFinder.hallway'), lux: 150 },
    { id: 'garage', name: t('tools.lightBulbFinder.garage'), lux: 300 },
  ]

  const bulbTypes = [
    { id: 'incandescent', name: t('tools.lightBulbFinder.incandescent'), lumensPerWatt: 15, lifespan: 1000 },
    { id: 'halogen', name: t('tools.lightBulbFinder.halogen'), lumensPerWatt: 20, lifespan: 2000 },
    { id: 'cfl', name: t('tools.lightBulbFinder.cfl'), lumensPerWatt: 60, lifespan: 10000 },
    { id: 'led', name: t('tools.lightBulbFinder.led'), lumensPerWatt: 100, lifespan: 25000 },
  ]

  const colorTemperatures = [
    { kelvin: 2700, name: t('tools.lightBulbFinder.warmWhite'), use: t('tools.lightBulbFinder.warmWhiteUse') },
    { kelvin: 3000, name: t('tools.lightBulbFinder.softWhite'), use: t('tools.lightBulbFinder.softWhiteUse') },
    { kelvin: 4000, name: t('tools.lightBulbFinder.coolWhite'), use: t('tools.lightBulbFinder.coolWhiteUse') },
    { kelvin: 5000, name: t('tools.lightBulbFinder.daylight'), use: t('tools.lightBulbFinder.daylightUse') },
    { kelvin: 6500, name: t('tools.lightBulbFinder.brightDaylight'), use: t('tools.lightBulbFinder.brightDaylightUse') },
  ]

  const calculate = () => {
    const area = parseFloat(roomArea) || 0
    const room = roomTypes.find(r => r.id === roomType)
    const bulb = bulbTypes.find(b => b.id === bulbType)

    if (!room || !bulb || area === 0) return null

    const totalLumens = room.lux * area
    const wattageNeeded = totalLumens / bulb.lumensPerWatt

    // Convert old incandescent wattage to LED equivalent
    const oldWattage = parseFloat(currentWattage) || 0
    const oldLumens = oldWattage * 15 // Incandescent lumens
    const ledEquivalent = oldLumens / 100 // LED wattage

    // Suggest number of bulbs
    const standardBulbLumens = [450, 800, 1100, 1600, 2600]
    const standardBulbWatts = { led: [5, 9, 12, 15, 20], incandescent: [40, 60, 75, 100, 150] }

    let suggestedBulbs = []
    for (let i = 0; i < standardBulbLumens.length; i++) {
      const count = Math.ceil(totalLumens / standardBulbLumens[i])
      if (count <= 10) {
        suggestedBulbs.push({
          lumens: standardBulbLumens[i],
          watts: standardBulbWatts.led[i],
          count,
          totalWatts: standardBulbWatts.led[i] * count,
        })
      }
    }

    return {
      totalLumens,
      wattageNeeded,
      ledEquivalent,
      suggestedBulbs,
      lifespan: bulb.lifespan,
    }
  }

  const result = calculate()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.lightBulbFinder.roomInfo')}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.lightBulbFinder.roomType')}</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {roomTypes.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.lightBulbFinder.roomArea')} (m²)</label>
            <input
              type="number"
              value={roomArea}
              onChange={(e) => setRoomArea(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.lightBulbFinder.bulbType')}</h3>
        <div className="grid grid-cols-2 gap-2">
          {bulbTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setBulbType(type.id)}
              className={`p-3 rounded text-left ${
                bulbType === type.id ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-slate-50 border border-slate-200'
              }`}
            >
              <div className="font-medium text-sm">{type.name}</div>
              <div className="text-xs text-slate-500">{type.lumensPerWatt} lm/W</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.lightBulbFinder.convertOldBulb')}</h3>
        <div>
          <label className="block text-sm text-slate-600 mb-1">{t('tools.lightBulbFinder.oldWattage')}</label>
          <input
            type="number"
            value={currentWattage}
            onChange={(e) => setCurrentWattage(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
            placeholder={t('tools.lightBulbFinder.enterOldWattage')}
          />
        </div>
        {result && currentWattage && (
          <div className="mt-3 p-3 bg-green-50 rounded">
            <div className="text-sm">
              {currentWattage}W {t('tools.lightBulbFinder.incandescent')} = <span className="font-bold text-green-600">{result.ledEquivalent.toFixed(0)}W LED</span>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="card p-4 bg-yellow-50">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.lightBulbFinder.recommendation')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">{t('tools.lightBulbFinder.totalLumens')}:</span>
              <span className="font-medium">{result.totalLumens.toFixed(0)} lm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t('tools.lightBulbFinder.wattageNeeded')}:</span>
              <span className="font-medium">{result.wattageNeeded.toFixed(1)} W</span>
            </div>
          </div>

          {result.suggestedBulbs.length > 0 && (
            <div className="mt-3 pt-3 border-t border-yellow-200">
              <h4 className="text-sm font-medium text-slate-700 mb-2">{t('tools.lightBulbFinder.suggestedOptions')}</h4>
              <div className="space-y-2">
                {result.suggestedBulbs.slice(0, 3).map((option, i) => (
                  <div key={i} className="flex justify-between items-center text-sm p-2 bg-white rounded">
                    <span>{option.count}x {option.watts}W LED ({option.lumens}lm each)</span>
                    <span className="text-slate-500">{option.totalWatts}W total</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.lightBulbFinder.colorTemperature')}</h3>
        <div className="space-y-2">
          {colorTemperatures.map(temp => (
            <div key={temp.kelvin} className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <div>
                <div className="font-medium text-sm">{temp.name}</div>
                <div className="text-xs text-slate-500">{temp.kelvin}K - {temp.use}</div>
              </div>
              <div
                className="w-8 h-8 rounded-full border border-slate-200"
                style={{
                  backgroundColor: temp.kelvin < 3000 ? '#ffb347' : temp.kelvin < 4000 ? '#fff5e6' : temp.kelvin < 5000 ? '#fff' : '#f0f8ff'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.lightBulbFinder.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.lightBulbFinder.tip1')}</li>
          <li>{t('tools.lightBulbFinder.tip2')}</li>
          <li>{t('tools.lightBulbFinder.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
