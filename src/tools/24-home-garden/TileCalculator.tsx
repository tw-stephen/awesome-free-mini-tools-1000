import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function TileCalculator() {
  const { t } = useTranslation()
  const [areaLength, setAreaLength] = useState('')
  const [areaWidth, setAreaWidth] = useState('')
  const [tileLength, setTileLength] = useState('30')
  const [tileWidth, setTileWidth] = useState('30')
  const [groutWidth, setGroutWidth] = useState('3')
  const [wasteFactor, setWasteFactor] = useState('10')
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')

  const calculate = () => {
    const cmToM = unit === 'cm' ? 0.01 : 0.0254
    const length = parseFloat(areaLength) || 0
    const width = parseFloat(areaWidth) || 0
    const tL = parseFloat(tileLength) * cmToM || 0.3
    const tW = parseFloat(tileWidth) * cmToM || 0.3
    const grout = parseFloat(groutWidth) * cmToM * 0.1 || 0.003
    const waste = parseFloat(wasteFactor) / 100 || 0.1

    const areaSize = length * width
    const tileWithGrout = (tL + grout) * (tW + grout)
    const tilesNeeded = Math.ceil((areaSize / tileWithGrout) * (1 + waste))
    const tilesPerBox = 10 // Assuming 10 tiles per box
    const boxesNeeded = Math.ceil(tilesNeeded / tilesPerBox)
    const tileArea = tL * tW
    const coveragePerTile = tileArea

    return {
      areaSize,
      tilesNeeded,
      boxesNeeded,
      coveragePerTile,
    }
  }

  const result = calculate()

  const commonTileSizes = [
    { l: '10', w: '10', label: '10x10' },
    { l: '15', w: '15', label: '15x15' },
    { l: '20', w: '20', label: '20x20' },
    { l: '30', w: '30', label: '30x30' },
    { l: '45', w: '45', label: '45x45' },
    { l: '60', w: '60', label: '60x60' },
    { l: '30', w: '60', label: '30x60' },
    { l: '60', w: '120', label: '60x120' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.tileCalculator.areaDimensions')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.tileCalculator.length')} (m)</label>
            <input
              type="number"
              value={areaLength}
              onChange={(e) => setAreaLength(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.tileCalculator.width')} (m)</label>
            <input
              type="number"
              value={areaWidth}
              onChange={(e) => setAreaWidth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.tileCalculator.tileSize')}</h3>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'cm' | 'in')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="cm">cm</option>
            <option value="in">inches</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {commonTileSizes.map(size => (
            <button
              key={size.label}
              onClick={() => {
                setTileLength(size.l)
                setTileWidth(size.w)
              }}
              className={`px-2 py-1 rounded text-xs ${
                tileLength === size.l && tileWidth === size.w
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.tileCalculator.tileLength')}</label>
            <input
              type="number"
              value={tileLength}
              onChange={(e) => setTileLength(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.tileCalculator.tileWidth')}</label>
            <input
              type="number"
              value={tileWidth}
              onChange={(e) => setTileWidth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="30"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.tileCalculator.groutWidth')} (mm)</label>
            <input
              type="number"
              value={groutWidth}
              onChange={(e) => setGroutWidth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="3"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.tileCalculator.wasteFactor')} (%)</label>
            <input
              type="number"
              value={wasteFactor}
              onChange={(e) => setWasteFactor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="10"
            />
          </div>
        </div>
      </div>

      <div className="card p-4 bg-cyan-50">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.tileCalculator.result')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.tileCalculator.totalArea')}:</span>
            <span className="font-medium">{result.areaSize.toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.tileCalculator.coveragePerTile')}:</span>
            <span className="font-medium">{(result.coveragePerTile * 10000).toFixed(0)} cm²</span>
          </div>
          <div className="border-t border-cyan-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-slate-700 font-medium">{t('tools.tileCalculator.tilesNeeded')}:</span>
              <span className="font-bold text-xl text-cyan-600">{result.tilesNeeded}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-slate-600">{t('tools.tileCalculator.boxesNeeded')}:</span>
              <span className="font-medium">{result.boxesNeeded}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{t('tools.tileCalculator.boxHint')}</p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.tileCalculator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.tileCalculator.tip1')}</li>
          <li>{t('tools.tileCalculator.tip2')}</li>
          <li>{t('tools.tileCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
