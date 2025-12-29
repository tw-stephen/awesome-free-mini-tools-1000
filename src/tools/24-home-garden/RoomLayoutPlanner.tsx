import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FurnitureItem {
  id: number
  type: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  color: string
}

export default function RoomLayoutPlanner() {
  const { t } = useTranslation()
  const [roomWidth, setRoomWidth] = useState(5)
  const [roomHeight, setRoomHeight] = useState(4)
  const [furniture, setFurniture] = useState<FurnitureItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [gridSize, setGridSize] = useState(0.5)

  const scale = 60 // pixels per meter

  const furnitureTypes = [
    { type: 'Sofa', width: 2, height: 0.9, color: '#8B4513' },
    { type: 'Armchair', width: 0.9, height: 0.9, color: '#A0522D' },
    { type: 'Coffee Table', width: 1.2, height: 0.6, color: '#D2691E' },
    { type: 'TV Stand', width: 1.5, height: 0.4, color: '#696969' },
    { type: 'Dining Table', width: 1.6, height: 0.9, color: '#8B4513' },
    { type: 'Chair', width: 0.5, height: 0.5, color: '#A0522D' },
    { type: 'Bed (Queen)', width: 2, height: 1.5, color: '#4682B4' },
    { type: 'Bed (Single)', width: 2, height: 0.9, color: '#4682B4' },
    { type: 'Wardrobe', width: 1.8, height: 0.6, color: '#8B4513' },
    { type: 'Desk', width: 1.2, height: 0.6, color: '#696969' },
    { type: 'Bookshelf', width: 0.8, height: 0.3, color: '#8B4513' },
    { type: 'Nightstand', width: 0.5, height: 0.4, color: '#A0522D' },
    { type: 'Door', width: 0.8, height: 0.1, color: '#228B22' },
    { type: 'Window', width: 1.2, height: 0.1, color: '#87CEEB' },
  ]

  const addFurniture = (type: typeof furnitureTypes[0]) => {
    const newItem: FurnitureItem = {
      id: Date.now(),
      type: type.type,
      x: 1,
      y: 1,
      width: type.width,
      height: type.height,
      rotation: 0,
      color: type.color,
    }
    setFurniture([...furniture, newItem])
    setSelectedId(newItem.id)
  }

  const updateFurniture = (id: number, updates: Partial<FurnitureItem>) => {
    setFurniture(furniture.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const deleteFurniture = (id: number) => {
    setFurniture(furniture.filter(item => item.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const rotateFurniture = (id: number) => {
    const item = furniture.find(f => f.id === id)
    if (item) {
      updateFurniture(id, {
        rotation: (item.rotation + 90) % 360,
        width: item.height,
        height: item.width,
      })
    }
  }

  const moveFurniture = (id: number, dx: number, dy: number) => {
    const item = furniture.find(f => f.id === id)
    if (item) {
      const newX = Math.max(0, Math.min(roomWidth - item.width, item.x + dx * gridSize))
      const newY = Math.max(0, Math.min(roomHeight - item.height, item.y + dy * gridSize))
      updateFurniture(id, { x: newX, y: newY })
    }
  }

  const selectedItem = furniture.find(f => f.id === selectedId)
  const totalArea = furniture.reduce((sum, f) => sum + f.width * f.height, 0)
  const roomArea = roomWidth * roomHeight
  const usedPercentage = (totalArea / roomArea) * 100

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.roomLayoutPlanner.roomSize')}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.roomLayoutPlanner.width')} (m)</label>
            <input
              type="number"
              value={roomWidth}
              onChange={(e) => setRoomWidth(parseFloat(e.target.value) || 5)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              step="0.5"
              min="2"
              max="15"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.roomLayoutPlanner.height')} (m)</label>
            <input
              type="number"
              value={roomHeight}
              onChange={(e) => setRoomHeight(parseFloat(e.target.value) || 4)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              step="0.5"
              min="2"
              max="15"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.roomLayoutPlanner.grid')}</label>
            <select
              value={gridSize}
              onChange={(e) => setGridSize(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="0.25">0.25m</option>
              <option value="0.5">0.5m</option>
              <option value="1">1m</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.roomLayoutPlanner.addFurniture')}</h3>
        <div className="flex flex-wrap gap-1">
          {furnitureTypes.map(type => (
            <button
              key={type.type}
              onClick={() => addFurniture(type)}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs"
            >
              {type.type}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 overflow-auto">
        <div
          className="relative border-2 border-slate-400 bg-slate-100"
          style={{
            width: roomWidth * scale,
            height: roomHeight * scale,
            backgroundImage: `
              linear-gradient(to right, #ddd 1px, transparent 1px),
              linear-gradient(to bottom, #ddd 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize * scale}px ${gridSize * scale}px`,
          }}
        >
          {furniture.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`absolute cursor-pointer border-2 flex items-center justify-center text-white text-xs font-medium ${
                selectedId === item.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-slate-600'
              }`}
              style={{
                left: item.x * scale,
                top: item.y * scale,
                width: item.width * scale,
                height: item.height * scale,
                backgroundColor: item.color,
              }}
            >
              {item.type}
            </div>
          ))}
        </div>
        <div className="text-sm text-slate-500 mt-2">
          {roomWidth}m x {roomHeight}m = {roomArea}m² | {t('tools.roomLayoutPlanner.used')}: {usedPercentage.toFixed(1)}%
        </div>
      </div>

      {selectedItem && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.roomLayoutPlanner.selected')}: {selectedItem.type}
          </h3>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => moveFurniture(selectedItem.id, -1, 0)}
              className="px-3 py-2 bg-slate-100 rounded hover:bg-slate-200"
            >
              {t('tools.roomLayoutPlanner.left')}
            </button>
            <button
              onClick={() => moveFurniture(selectedItem.id, 1, 0)}
              className="px-3 py-2 bg-slate-100 rounded hover:bg-slate-200"
            >
              {t('tools.roomLayoutPlanner.right')}
            </button>
            <button
              onClick={() => moveFurniture(selectedItem.id, 0, -1)}
              className="px-3 py-2 bg-slate-100 rounded hover:bg-slate-200"
            >
              {t('tools.roomLayoutPlanner.up')}
            </button>
            <button
              onClick={() => moveFurniture(selectedItem.id, 0, 1)}
              className="px-3 py-2 bg-slate-100 rounded hover:bg-slate-200"
            >
              {t('tools.roomLayoutPlanner.down')}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => rotateFurniture(selectedItem.id)}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('tools.roomLayoutPlanner.rotate')}
            </button>
            <button
              onClick={() => deleteFurniture(selectedItem.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {t('tools.roomLayoutPlanner.delete')}
            </button>
          </div>
          <div className="text-sm text-slate-500 mt-2">
            {t('tools.roomLayoutPlanner.size')}: {selectedItem.width}m x {selectedItem.height}m |
            {t('tools.roomLayoutPlanner.position')}: ({selectedItem.x.toFixed(1)}, {selectedItem.y.toFixed(1)})
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.roomLayoutPlanner.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.roomLayoutPlanner.tip1')}</li>
          <li>{t('tools.roomLayoutPlanner.tip2')}</li>
          <li>{t('tools.roomLayoutPlanner.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
