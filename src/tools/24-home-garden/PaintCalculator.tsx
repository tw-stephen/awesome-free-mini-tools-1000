import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PaintCalculator() {
  const { t } = useTranslation()
  const [rooms, setRooms] = useState([{ id: 1, length: '', width: '', height: '2.5', doors: '1', windows: '1' }])
  const [coats, setCoats] = useState('2')
  const [coverage, setCoverage] = useState('10') // m² per liter
  const [unit, setUnit] = useState<'m' | 'ft'>('m')

  const addRoom = () => {
    setRooms([...rooms, { id: Date.now(), length: '', width: '', height: '2.5', doors: '1', windows: '1' }])
  }

  const removeRoom = (id: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(r => r.id !== id))
    }
  }

  const updateRoom = (id: number, field: string, value: string) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const calculatePaint = () => {
    const doorArea = 1.9 // m² per door
    const windowArea = 1.5 // m² per window
    const conversionFactor = unit === 'ft' ? 0.3048 : 1

    let totalWallArea = 0
    rooms.forEach(room => {
      const length = parseFloat(room.length) * conversionFactor || 0
      const width = parseFloat(room.width) * conversionFactor || 0
      const height = parseFloat(room.height) * conversionFactor || 0
      const doors = parseInt(room.doors) || 0
      const windows = parseInt(room.windows) || 0

      const perimeter = 2 * (length + width)
      const wallArea = perimeter * height
      const openingsArea = (doors * doorArea) + (windows * windowArea)
      totalWallArea += Math.max(0, wallArea - openingsArea)
    })

    const numCoats = parseInt(coats) || 1
    const coveragePerLiter = parseFloat(coverage) || 10
    const totalPaint = (totalWallArea * numCoats) / coveragePerLiter

    return { wallArea: totalWallArea, liters: totalPaint, gallons: totalPaint * 0.264172 }
  }

  const result = calculatePaint()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.paintCalculator.settings')}</h3>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'm' | 'ft')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="m">{t('tools.paintCalculator.meters')}</option>
            <option value="ft">{t('tools.paintCalculator.feet')}</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.paintCalculator.coats')}</label>
            <select
              value={coats}
              onChange={(e) => setCoats(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.paintCalculator.coverage')}</label>
            <input
              type="number"
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="10"
            />
          </div>
        </div>
      </div>

      {rooms.map((room, index) => (
        <div key={room.id} className="card p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.paintCalculator.room')} {index + 1}
            </h3>
            {rooms.length > 1 && (
              <button
                onClick={() => removeRoom(room.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                {t('tools.paintCalculator.remove')}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.paintCalculator.length')}</label>
              <input
                type="number"
                value={room.length}
                onChange={(e) => updateRoom(room.id, 'length', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.paintCalculator.width')}</label>
              <input
                type="number"
                value={room.width}
                onChange={(e) => updateRoom(room.id, 'width', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.paintCalculator.height')}</label>
              <input
                type="number"
                value={room.height}
                onChange={(e) => updateRoom(room.id, 'height', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="2.5"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.paintCalculator.doors')}</label>
              <input
                type="number"
                value={room.doors}
                onChange={(e) => updateRoom(room.id, 'doors', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.paintCalculator.windows')}</label>
              <input
                type="number"
                value={room.windows}
                onChange={(e) => updateRoom(room.id, 'windows', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="1"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addRoom}
        className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-500"
      >
        + {t('tools.paintCalculator.addRoom')}
      </button>

      <div className="card p-4 bg-blue-50">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.paintCalculator.result')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.paintCalculator.totalArea')}:</span>
            <span className="font-medium">{result.wallArea.toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.paintCalculator.paintNeeded')}:</span>
            <span className="font-bold text-xl text-blue-600">{result.liters.toFixed(1)} L</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span></span>
            <span>({result.gallons.toFixed(2)} gallons)</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.paintCalculator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.paintCalculator.tip1')}</li>
          <li>{t('tools.paintCalculator.tip2')}</li>
          <li>{t('tools.paintCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
