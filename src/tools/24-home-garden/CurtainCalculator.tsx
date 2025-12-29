import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function CurtainCalculator() {
  const { t } = useTranslation()
  const [windowWidth, setWindowWidth] = useState('')
  const [windowHeight, setWindowHeight] = useState('')
  const [fullnessRatio, setFullnessRatio] = useState('2')
  const [panels, setPanels] = useState('2')
  const [headerStyle, setHeaderStyle] = useState('standard')
  const [hemAllowance, setHemAllowance] = useState('15')
  const [topAllowance, setTopAllowance] = useState('10')
  const [rodExtension, setRodExtension] = useState('15')
  const [floorClearance, setFloorClearance] = useState('1')
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')

  const headerStyles = [
    { id: 'standard', label: t('tools.curtainCalculator.standard'), extra: 8 },
    { id: 'pinch', label: t('tools.curtainCalculator.pinchPleat'), extra: 10 },
    { id: 'grommet', label: t('tools.curtainCalculator.grommet'), extra: 5 },
    { id: 'tab', label: t('tools.curtainCalculator.tabTop'), extra: 15 },
    { id: 'rod', label: t('tools.curtainCalculator.rodPocket'), extra: 8 },
  ]

  const calculate = () => {
    const wWidth = parseFloat(windowWidth) || 0
    const wHeight = parseFloat(windowHeight) || 0
    const fullness = parseFloat(fullnessRatio) || 2
    const numPanels = parseInt(panels) || 2
    const header = headerStyles.find(h => h.id === headerStyle)
    const hem = parseFloat(hemAllowance) || 15
    const top = parseFloat(topAllowance) || 10
    const rodExt = parseFloat(rodExtension) || 15
    const floor = parseFloat(floorClearance) || 1

    // Rod width calculation
    const rodWidth = wWidth + (rodExt * 2)

    // Total curtain width needed with fullness
    const totalWidth = rodWidth * fullness

    // Width per panel
    const panelWidth = totalWidth / numPanels

    // Add side hems (usually 2.5cm each side)
    const cutWidth = panelWidth + 5

    // Height calculation
    const headerExtra = header?.extra || 8
    const cutHeight = wHeight + hem + top + headerExtra - floor

    // Fabric needed (assuming 140cm wide fabric)
    const fabricWidth = 140
    const widthsNeeded = Math.ceil(cutWidth / fabricWidth)
    const fabricPerPanel = cutHeight * widthsNeeded / 100 // in meters
    const totalFabric = fabricPerPanel * numPanels

    return {
      rodWidth,
      totalWidth,
      panelWidth,
      cutWidth,
      cutHeight,
      fabricPerPanel,
      totalFabric,
      numPanels,
    }
  }

  const result = calculate()
  const conversionFactor = unit === 'in' ? 2.54 : 1

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.curtainCalculator.windowMeasurements')}</h3>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'cm' | 'in')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="cm">cm</option>
            <option value="in">inches</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.curtainCalculator.windowWidth')}</label>
            <input
              type="number"
              value={windowWidth}
              onChange={(e) => setWindowWidth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.curtainCalculator.windowHeight')}</label>
            <input
              type="number"
              value={windowHeight}
              onChange={(e) => setWindowHeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.curtainCalculator.curtainStyle')}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.curtainCalculator.headerStyle')}</label>
            <div className="flex flex-wrap gap-1">
              {headerStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setHeaderStyle(style.id)}
                  className={`px-2 py-1 rounded text-xs ${
                    headerStyle === style.id ? 'bg-purple-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.curtainCalculator.fullnessRatio')}</label>
              <select
                value={fullnessRatio}
                onChange={(e) => setFullnessRatio(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="1.5">1.5x ({t('tools.curtainCalculator.light')})</option>
                <option value="2">2x ({t('tools.curtainCalculator.standard')})</option>
                <option value="2.5">2.5x ({t('tools.curtainCalculator.full')})</option>
                <option value="3">3x ({t('tools.curtainCalculator.luxurious')})</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.curtainCalculator.panels')}</label>
              <select
                value={panels}
                onChange={(e) => setPanels(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="1">1 ({t('tools.curtainCalculator.single')})</option>
                <option value="2">2 ({t('tools.curtainCalculator.pair')})</option>
                <option value="4">4 ({t('tools.curtainCalculator.double')})</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.curtainCalculator.allowances')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.curtainCalculator.rodExtension')}</label>
            <input
              type="number"
              value={rodExtension}
              onChange={(e) => setRodExtension(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="15"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.curtainCalculator.floorClearance')}</label>
            <input
              type="number"
              value={floorClearance}
              onChange={(e) => setFloorClearance(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.curtainCalculator.hemAllowance')}</label>
            <input
              type="number"
              value={hemAllowance}
              onChange={(e) => setHemAllowance(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="15"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.curtainCalculator.topAllowance')}</label>
            <input
              type="number"
              value={topAllowance}
              onChange={(e) => setTopAllowance(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="10"
            />
          </div>
        </div>
      </div>

      <div className="card p-4 bg-purple-50">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.curtainCalculator.result')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.curtainCalculator.recommendedRodWidth')}:</span>
            <span className="font-medium">{result.rodWidth.toFixed(0)} {unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.curtainCalculator.totalCurtainWidth')}:</span>
            <span className="font-medium">{result.totalWidth.toFixed(0)} {unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.curtainCalculator.numberOfPanels')}:</span>
            <span className="font-medium">{result.numPanels}</span>
          </div>
          <div className="border-t border-purple-200 pt-2 mt-2">
            <div className="text-sm font-medium text-slate-700 mb-1">{t('tools.curtainCalculator.cutSizePerPanel')}:</div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t('tools.curtainCalculator.width')}:</span>
              <span className="font-medium">{result.cutWidth.toFixed(0)} {unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t('tools.curtainCalculator.height')}:</span>
              <span className="font-medium">{result.cutHeight.toFixed(0)} {unit}</span>
            </div>
          </div>
          <div className="border-t border-purple-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-slate-700 font-medium">{t('tools.curtainCalculator.totalFabric')}:</span>
              <span className="font-bold text-xl text-purple-600">{result.totalFabric.toFixed(2)} m</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{t('tools.curtainCalculator.fabricNote')}</p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.curtainCalculator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.curtainCalculator.tip1')}</li>
          <li>{t('tools.curtainCalculator.tip2')}</li>
          <li>{t('tools.curtainCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
