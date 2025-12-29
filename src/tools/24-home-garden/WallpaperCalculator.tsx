import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function WallpaperCalculator() {
  const { t } = useTranslation()
  const [wallLength, setWallLength] = useState('')
  const [wallHeight, setWallHeight] = useState('2.5')
  const [rollWidth, setRollWidth] = useState('0.53')
  const [rollLength, setRollLength] = useState('10')
  const [patternRepeat, setPatternRepeat] = useState('0')
  const [doors, setDoors] = useState('1')
  const [windows, setWindows] = useState('1')
  const [unit, setUnit] = useState<'m' | 'ft'>('m')

  const calculate = () => {
    const conversionFactor = unit === 'ft' ? 0.3048 : 1
    const length = parseFloat(wallLength) * conversionFactor || 0
    const height = parseFloat(wallHeight) * conversionFactor || 0
    const rWidth = parseFloat(rollWidth) || 0.53
    const rLength = parseFloat(rollLength) || 10
    const pattern = parseFloat(patternRepeat) || 0
    const numDoors = parseInt(doors) || 0
    const numWindows = parseInt(windows) || 0

    const doorArea = numDoors * 1.9 // m² per door
    const windowArea = numWindows * 1.5 // m² per window

    // Calculate wall area
    const grossWallArea = length * height
    const netWallArea = Math.max(0, grossWallArea - doorArea - windowArea)

    // Calculate drops needed
    const dropHeight = pattern > 0 ? height + pattern : height
    const dropsPerRoll = Math.floor(rLength / dropHeight)
    const stripsNeeded = Math.ceil(length / rWidth)
    const rollsNeeded = Math.ceil(stripsNeeded / dropsPerRoll)

    // Add 10% for waste
    const rollsWithWaste = Math.ceil(rollsNeeded * 1.1)

    return {
      wallArea: netWallArea,
      stripsNeeded,
      rollsNeeded,
      rollsWithWaste,
      dropsPerRoll,
    }
  }

  const result = calculate()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.wallpaperCalculator.wallDimensions')}</h3>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'm' | 'ft')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="m">{t('tools.wallpaperCalculator.meters')}</option>
            <option value="ft">{t('tools.wallpaperCalculator.feet')}</option>
          </select>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.wallpaperCalculator.wallLength')}</label>
            <input
              type="number"
              value={wallLength}
              onChange={(e) => setWallLength(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder={t('tools.wallpaperCalculator.totalPerimeter')}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.wallpaperCalculator.wallHeight')}</label>
            <input
              type="number"
              value={wallHeight}
              onChange={(e) => setWallHeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="2.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.wallpaperCalculator.doors')}</label>
              <input
                type="number"
                value={doors}
                onChange={(e) => setDoors(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.wallpaperCalculator.windows')}</label>
              <input
                type="number"
                value={windows}
                onChange={(e) => setWindows(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.wallpaperCalculator.rollSpecifications')}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.wallpaperCalculator.rollWidth')} (m)</label>
              <input
                type="number"
                value={rollWidth}
                onChange={(e) => setRollWidth(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0.53"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.wallpaperCalculator.rollLength')} (m)</label>
              <input
                type="number"
                value={rollLength}
                onChange={(e) => setRollLength(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.wallpaperCalculator.patternRepeat')} (m)</label>
            <input
              type="number"
              value={patternRepeat}
              onChange={(e) => setPatternRepeat(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
              step="0.01"
            />
            <p className="text-xs text-slate-400 mt-1">{t('tools.wallpaperCalculator.patternHint')}</p>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-green-50">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.wallpaperCalculator.result')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.wallpaperCalculator.wallArea')}:</span>
            <span className="font-medium">{result.wallArea.toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.wallpaperCalculator.stripsNeeded')}:</span>
            <span className="font-medium">{result.stripsNeeded}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.wallpaperCalculator.dropsPerRoll')}:</span>
            <span className="font-medium">{result.dropsPerRoll}</span>
          </div>
          <div className="border-t border-green-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-slate-700 font-medium">{t('tools.wallpaperCalculator.rollsNeeded')}:</span>
              <span className="font-bold text-xl text-green-600">{result.rollsWithWaste}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{t('tools.wallpaperCalculator.includesWaste')}</p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.wallpaperCalculator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.wallpaperCalculator.tip1')}</li>
          <li>{t('tools.wallpaperCalculator.tip2')}</li>
          <li>{t('tools.wallpaperCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
