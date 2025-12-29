import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Furniture {
  id: number
  name: string
  length: number
  width: number
  height: number
}

export default function FurnitureFitChecker() {
  const { t } = useTranslation()
  const [roomLength, setRoomLength] = useState('')
  const [roomWidth, setRoomWidth] = useState('')
  const [roomHeight, setRoomHeight] = useState('2.5')
  const [doorWidth, setDoorWidth] = useState('0.8')
  const [doorHeight, setDoorHeight] = useState('2.0')
  const [furniture, setFurniture] = useState<Furniture[]>([])
  const [newFurniture, setNewFurniture] = useState({ name: '', length: '', width: '', height: '' })
  const [unit, setUnit] = useState<'m' | 'ft'>('m')

  const commonFurniture = [
    { name: 'Single Bed', length: 2.0, width: 0.9, height: 0.5 },
    { name: 'Double Bed', length: 2.0, width: 1.4, height: 0.5 },
    { name: 'Queen Bed', length: 2.0, width: 1.5, height: 0.5 },
    { name: 'King Bed', length: 2.0, width: 1.8, height: 0.5 },
    { name: '2-Seater Sofa', length: 1.5, width: 0.9, height: 0.8 },
    { name: '3-Seater Sofa', length: 2.0, width: 0.9, height: 0.8 },
    { name: 'Dining Table (4)', length: 1.2, width: 0.8, height: 0.75 },
    { name: 'Dining Table (6)', length: 1.6, width: 0.9, height: 0.75 },
    { name: 'Desk', length: 1.2, width: 0.6, height: 0.75 },
    { name: 'Wardrobe', length: 1.8, width: 0.6, height: 2.0 },
  ]

  const addFurniture = () => {
    if (!newFurniture.name || !newFurniture.length || !newFurniture.width) return
    setFurniture([
      ...furniture,
      {
        id: Date.now(),
        name: newFurniture.name,
        length: parseFloat(newFurniture.length),
        width: parseFloat(newFurniture.width),
        height: parseFloat(newFurniture.height) || 0,
      },
    ])
    setNewFurniture({ name: '', length: '', width: '', height: '' })
  }

  const addCommonFurniture = (item: typeof commonFurniture[0]) => {
    setFurniture([
      ...furniture,
      {
        id: Date.now(),
        ...item,
      },
    ])
  }

  const removeFurniture = (id: number) => {
    setFurniture(furniture.filter(f => f.id !== id))
  }

  const checkFit = (item: Furniture) => {
    const rL = parseFloat(roomLength) || 0
    const rW = parseFloat(roomWidth) || 0
    const rH = parseFloat(roomHeight) || 2.5
    const dW = parseFloat(doorWidth) || 0.8
    const dH = parseFloat(doorHeight) || 2.0

    const fitsInRoom = (item.length <= rL && item.width <= rW) || (item.length <= rW && item.width <= rL)
    const fitsHeight = item.height <= rH

    // Check if it fits through door (diagonal calculation for best fit)
    const diagonal = Math.sqrt(Math.pow(Math.min(item.length, item.width), 2) + Math.pow(item.height, 2))
    const fitsThroughDoor = (
      (Math.min(item.length, item.width) <= dW && item.height <= dH) ||
      (item.height <= dW && Math.min(item.length, item.width) <= dH) ||
      (diagonal <= Math.sqrt(dW * dW + dH * dH) && Math.max(item.length, item.width) <= 3)
    )

    return { fitsInRoom, fitsHeight, fitsThroughDoor }
  }

  const roomArea = (parseFloat(roomLength) || 0) * (parseFloat(roomWidth) || 0)
  const furnitureArea = furniture.reduce((sum, f) => sum + f.length * f.width, 0)
  const usedPercentage = roomArea > 0 ? (furnitureArea / roomArea) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.furnitureFitChecker.roomDimensions')}</h3>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'm' | 'ft')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="m">{t('tools.furnitureFitChecker.meters')}</option>
            <option value="ft">{t('tools.furnitureFitChecker.feet')}</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.furnitureFitChecker.length')}</label>
            <input
              type="number"
              value={roomLength}
              onChange={(e) => setRoomLength(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.furnitureFitChecker.width')}</label>
            <input
              type="number"
              value={roomWidth}
              onChange={(e) => setRoomWidth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.furnitureFitChecker.height')}</label>
            <input
              type="number"
              value={roomHeight}
              onChange={(e) => setRoomHeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="2.5"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.furnitureFitChecker.doorWidth')}</label>
            <input
              type="number"
              value={doorWidth}
              onChange={(e) => setDoorWidth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0.8"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.furnitureFitChecker.doorHeight')}</label>
            <input
              type="number"
              value={doorHeight}
              onChange={(e) => setDoorHeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="2.0"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.furnitureFitChecker.quickAdd')}</h3>
        <div className="flex flex-wrap gap-1">
          {commonFurniture.map(item => (
            <button
              key={item.name}
              onClick={() => addCommonFurniture(item)}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.furnitureFitChecker.addCustom')}</h3>
        <div className="grid grid-cols-4 gap-2">
          <input
            type="text"
            value={newFurniture.name}
            onChange={(e) => setNewFurniture({ ...newFurniture, name: e.target.value })}
            className="px-2 py-2 border border-slate-300 rounded text-sm"
            placeholder={t('tools.furnitureFitChecker.name')}
          />
          <input
            type="number"
            value={newFurniture.length}
            onChange={(e) => setNewFurniture({ ...newFurniture, length: e.target.value })}
            className="px-2 py-2 border border-slate-300 rounded text-sm"
            placeholder="L"
          />
          <input
            type="number"
            value={newFurniture.width}
            onChange={(e) => setNewFurniture({ ...newFurniture, width: e.target.value })}
            className="px-2 py-2 border border-slate-300 rounded text-sm"
            placeholder="W"
          />
          <button
            onClick={addFurniture}
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            {t('tools.furnitureFitChecker.add')}
          </button>
        </div>
      </div>

      {furniture.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.furnitureFitChecker.furnitureList')}</h3>
          <div className="space-y-2">
            {furniture.map(item => {
              const fit = checkFit(item)
              return (
                <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-slate-500">
                      {item.length}m x {item.width}m x {item.height}m
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${fit.fitsInRoom ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {fit.fitsInRoom ? t('tools.furnitureFitChecker.fitsRoom') : t('tools.furnitureFitChecker.tooLarge')}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${fit.fitsThroughDoor ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {fit.fitsThroughDoor ? t('tools.furnitureFitChecker.fitsDoor') : t('tools.furnitureFitChecker.mayNotFitDoor')}
                    </span>
                    <button
                      onClick={() => removeFurniture(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      x
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <div className="flex justify-between text-sm">
              <span>{t('tools.furnitureFitChecker.roomArea')}:</span>
              <span className="font-medium">{roomArea.toFixed(2)} m²</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>{t('tools.furnitureFitChecker.furnitureArea')}:</span>
              <span className="font-medium">{furnitureArea.toFixed(2)} m²</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>{t('tools.furnitureFitChecker.usedSpace')}:</span>
              <span className={`font-medium ${usedPercentage > 60 ? 'text-red-600' : usedPercentage > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                {usedPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.furnitureFitChecker.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.furnitureFitChecker.tip1')}</li>
          <li>{t('tools.furnitureFitChecker.tip2')}</li>
          <li>{t('tools.furnitureFitChecker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
