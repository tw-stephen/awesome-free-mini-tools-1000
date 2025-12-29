import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface PlantCell {
  plant: string
  color: string
}

export default function GardenPlotPlanner() {
  const { t } = useTranslation()
  const [plotLength, setPlotLength] = useState(4)
  const [plotWidth, setPlotWidth] = useState(3)
  const [grid, setGrid] = useState<(PlantCell | null)[][]>([])
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null)
  const [unit, setUnit] = useState<'m' | 'ft'>('m')

  const plants = [
    { name: 'Tomato', color: '#ff6347', spacing: 0.6, companion: ['Basil', 'Carrot'], avoid: ['Cabbage'] },
    { name: 'Carrot', color: '#ffa500', spacing: 0.1, companion: ['Tomato', 'Lettuce'], avoid: ['Dill'] },
    { name: 'Lettuce', color: '#90ee90', spacing: 0.3, companion: ['Carrot', 'Radish'], avoid: [] },
    { name: 'Pepper', color: '#ff4500', spacing: 0.45, companion: ['Tomato', 'Basil'], avoid: ['Fennel'] },
    { name: 'Cucumber', color: '#228b22', spacing: 0.6, companion: ['Beans', 'Corn'], avoid: ['Potato'] },
    { name: 'Basil', color: '#32cd32', spacing: 0.25, companion: ['Tomato', 'Pepper'], avoid: [] },
    { name: 'Beans', color: '#8b4513', spacing: 0.15, companion: ['Corn', 'Cucumber'], avoid: ['Onion'] },
    { name: 'Corn', color: '#ffd700', spacing: 0.3, companion: ['Beans', 'Squash'], avoid: ['Tomato'] },
    { name: 'Squash', color: '#daa520', spacing: 0.9, companion: ['Corn', 'Beans'], avoid: ['Potato'] },
    { name: 'Onion', color: '#dda0dd', spacing: 0.1, companion: ['Carrot', 'Lettuce'], avoid: ['Beans'] },
    { name: 'Radish', color: '#dc143c', spacing: 0.05, companion: ['Lettuce', 'Carrot'], avoid: [] },
    { name: 'Spinach', color: '#006400', spacing: 0.15, companion: ['Strawberry'], avoid: [] },
  ]

  useEffect(() => {
    initializeGrid()
  }, [plotLength, plotWidth])

  const initializeGrid = () => {
    const rows = Math.ceil(plotWidth / 0.3)
    const cols = Math.ceil(plotLength / 0.3)
    const newGrid: (PlantCell | null)[][] = []
    for (let i = 0; i < rows; i++) {
      newGrid.push(new Array(cols).fill(null))
    }
    setGrid(newGrid)
  }

  const handleCellClick = (row: number, col: number) => {
    if (!selectedPlant) return

    const plant = plants.find(p => p.name === selectedPlant)
    if (!plant) return

    const newGrid = [...grid]
    if (newGrid[row][col]?.plant === selectedPlant) {
      newGrid[row][col] = null
    } else {
      newGrid[row][col] = { plant: selectedPlant, color: plant.color }
    }
    setGrid(newGrid)
  }

  const clearGrid = () => {
    initializeGrid()
  }

  const getPlantCounts = () => {
    const counts: Record<string, number> = {}
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell) {
          counts[cell.plant] = (counts[cell.plant] || 0) + 1
        }
      })
    })
    return counts
  }

  const getCompanionWarnings = () => {
    const warnings: string[] = []
    const plantNames = new Set<string>()
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell) plantNames.add(cell.plant)
      })
    })

    plantNames.forEach(name => {
      const plant = plants.find(p => p.name === name)
      if (plant) {
        plant.avoid.forEach(avoid => {
          if (plantNames.has(avoid)) {
            warnings.push(`${name} ${t('tools.gardenPlotPlanner.shouldAvoid')} ${avoid}`)
          }
        })
      }
    })
    return warnings
  }

  const plantCounts = getPlantCounts()
  const warnings = getCompanionWarnings()
  const cellSize = 30

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.gardenPlotPlanner.plotSize')}</h3>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'm' | 'ft')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="m">{t('tools.gardenPlotPlanner.meters')}</option>
            <option value="ft">{t('tools.gardenPlotPlanner.feet')}</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.gardenPlotPlanner.length')}</label>
            <input
              type="number"
              value={plotLength}
              onChange={(e) => setPlotLength(parseFloat(e.target.value) || 4)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              min="1"
              max="10"
              step="0.5"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.gardenPlotPlanner.width')}</label>
            <input
              type="number"
              value={plotWidth}
              onChange={(e) => setPlotWidth(parseFloat(e.target.value) || 3)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              min="1"
              max="10"
              step="0.5"
            />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {t('tools.gardenPlotPlanner.area')}: {(plotLength * plotWidth).toFixed(1)} {unit === 'm' ? 'm²' : 'ft²'}
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.gardenPlotPlanner.selectPlant')}</h3>
        <div className="flex flex-wrap gap-1">
          {plants.map(plant => (
            <button
              key={plant.name}
              onClick={() => setSelectedPlant(selectedPlant === plant.name ? null : plant.name)}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                selectedPlant === plant.name ? 'ring-2 ring-blue-400' : ''
              }`}
              style={{ backgroundColor: plant.color + '40', borderColor: plant.color }}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: plant.color }}
              />
              {plant.name}
            </button>
          ))}
        </div>
        {selectedPlant && (
          <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
            <p className="text-slate-600">
              {t('tools.gardenPlotPlanner.spacing')}: {plants.find(p => p.name === selectedPlant)?.spacing}m
            </p>
            <p className="text-green-600">
              {t('tools.gardenPlotPlanner.goodWith')}: {plants.find(p => p.name === selectedPlant)?.companion.join(', ') || 'None'}
            </p>
            <p className="text-red-600">
              {t('tools.gardenPlotPlanner.avoid')}: {plants.find(p => p.name === selectedPlant)?.avoid.join(', ') || 'None'}
            </p>
          </div>
        )}
      </div>

      <div className="card p-4 overflow-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.gardenPlotPlanner.yourGarden')}</h3>
          <button
            onClick={clearGrid}
            className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
          >
            {t('tools.gardenPlotPlanner.clear')}
          </button>
        </div>
        <div
          className="border-2 border-amber-600 bg-amber-50 inline-block"
          style={{ minWidth: grid[0]?.length * cellSize }}
        >
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className="border border-amber-200 cursor-pointer hover:bg-amber-100"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: cell ? cell.color : undefined,
                  }}
                  title={cell?.plant}
                />
              ))}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">{t('tools.gardenPlotPlanner.gridHint')}</p>
      </div>

      {Object.keys(plantCounts).length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.gardenPlotPlanner.plantSummary')}</h3>
          <div className="space-y-1">
            {Object.entries(plantCounts).map(([plant, count]) => (
              <div key={plant} className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: plants.find(p => p.name === plant)?.color }}
                  />
                  {plant}
                </span>
                <span className="font-medium">{count} {t('tools.gardenPlotPlanner.cells')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="card p-4 bg-red-50">
          <h3 className="text-sm font-medium text-red-700 mb-2">{t('tools.gardenPlotPlanner.warnings')}</h3>
          <ul className="text-sm text-red-600 space-y-1">
            {warnings.map((warning, i) => (
              <li key={i}>- {warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.gardenPlotPlanner.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.gardenPlotPlanner.tip1')}</li>
          <li>{t('tools.gardenPlotPlanner.tip2')}</li>
          <li>{t('tools.gardenPlotPlanner.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
