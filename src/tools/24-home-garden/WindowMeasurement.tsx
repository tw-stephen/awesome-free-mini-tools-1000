import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface WindowData {
  id: number
  name: string
  width: number
  height: number
  sillDepth: number
  mountType: 'inside' | 'outside'
  treatmentType: string
}

export default function WindowMeasurement() {
  const { t } = useTranslation()
  const [windows, setWindows] = useState<WindowData[]>([])
  const [currentWindow, setCurrentWindow] = useState({
    name: '',
    width: '',
    height: '',
    sillDepth: '',
    mountType: 'inside' as const,
    treatmentType: 'curtain',
  })
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')

  const treatmentTypes = [
    { id: 'curtain', label: t('tools.windowMeasurement.curtain') },
    { id: 'blinds', label: t('tools.windowMeasurement.blinds') },
    { id: 'shades', label: t('tools.windowMeasurement.shades') },
    { id: 'shutters', label: t('tools.windowMeasurement.shutters') },
  ]

  const addWindow = () => {
    if (!currentWindow.name || !currentWindow.width || !currentWindow.height) return
    setWindows([...windows, {
      id: Date.now(),
      name: currentWindow.name,
      width: parseFloat(currentWindow.width),
      height: parseFloat(currentWindow.height),
      sillDepth: parseFloat(currentWindow.sillDepth) || 0,
      mountType: currentWindow.mountType,
      treatmentType: currentWindow.treatmentType,
    }])
    setCurrentWindow({ name: '', width: '', height: '', sillDepth: '', mountType: 'inside', treatmentType: 'curtain' })
  }

  const deleteWindow = (id: number) => {
    setWindows(windows.filter(w => w.id !== id))
  }

  const getRecommendations = (window: WindowData) => {
    const recommendations: string[] = []
    const w = window.width
    const h = window.height

    if (window.mountType === 'inside') {
      recommendations.push(t('tools.windowMeasurement.insideTip1'))
      recommendations.push(t('tools.windowMeasurement.insideTip2'))
      if (window.sillDepth < 5) {
        recommendations.push(t('tools.windowMeasurement.shallowSillWarning'))
      }
    } else {
      recommendations.push(t('tools.windowMeasurement.outsideTip1'))
      recommendations.push(t('tools.windowMeasurement.outsideTip2'))
    }

    if (window.treatmentType === 'curtain') {
      const rodWidth = window.mountType === 'inside' ? w : w + 20
      const curtainHeight = window.mountType === 'inside' ? h : h + 15
      recommendations.push(`${t('tools.windowMeasurement.suggestedRod')}: ${rodWidth}${unit}`)
      recommendations.push(`${t('tools.windowMeasurement.suggestedCurtainHeight')}: ${curtainHeight}${unit}`)
    }

    return recommendations
  }

  const getMeasurementGuide = () => {
    const guides = {
      inside: [
        t('tools.windowMeasurement.guideInside1'),
        t('tools.windowMeasurement.guideInside2'),
        t('tools.windowMeasurement.guideInside3'),
      ],
      outside: [
        t('tools.windowMeasurement.guideOutside1'),
        t('tools.windowMeasurement.guideOutside2'),
        t('tools.windowMeasurement.guideOutside3'),
      ],
    }
    return guides[currentWindow.mountType]
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.windowMeasurement.addWindow')}</h3>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'cm' | 'in')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="cm">cm</option>
            <option value="in">inches</option>
          </select>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={currentWindow.name}
            onChange={(e) => setCurrentWindow({ ...currentWindow, name: e.target.value })}
            placeholder={t('tools.windowMeasurement.windowName')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentWindow({ ...currentWindow, mountType: 'inside' })}
              className={`flex-1 py-2 rounded text-sm ${
                currentWindow.mountType === 'inside' ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t('tools.windowMeasurement.insideMount')}
            </button>
            <button
              onClick={() => setCurrentWindow({ ...currentWindow, mountType: 'outside' })}
              className={`flex-1 py-2 rounded text-sm ${
                currentWindow.mountType === 'outside' ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t('tools.windowMeasurement.outsideMount')}
            </button>
          </div>

          <div className="flex flex-wrap gap-1">
            {treatmentTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setCurrentWindow({ ...currentWindow, treatmentType: type.id })}
                className={`px-2 py-1 rounded text-xs ${
                  currentWindow.treatmentType === type.id ? 'bg-green-500 text-white' : 'bg-slate-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.windowMeasurement.width')}</label>
              <input
                type="number"
                value={currentWindow.width}
                onChange={(e) => setCurrentWindow({ ...currentWindow, width: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.windowMeasurement.height')}</label>
              <input
                type="number"
                value={currentWindow.height}
                onChange={(e) => setCurrentWindow({ ...currentWindow, height: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.windowMeasurement.sillDepth')}</label>
              <input
                type="number"
                value={currentWindow.sillDepth}
                onChange={(e) => setCurrentWindow({ ...currentWindow, sillDepth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0"
              />
            </div>
          </div>

          <button
            onClick={addWindow}
            className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.windowMeasurement.add')}
          </button>
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.windowMeasurement.measurementGuide')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
          {getMeasurementGuide().map((guide, i) => (
            <li key={i}>{guide}</li>
          ))}
        </ul>
      </div>

      {windows.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.windowMeasurement.savedWindows')}</h3>
          <div className="space-y-3">
            {windows.map(window => (
              <div key={window.id} className="p-3 bg-slate-50 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{window.name}</div>
                    <div className="text-sm text-slate-500">
                      {window.width} x {window.height} {unit} |
                      {window.mountType === 'inside' ? t('tools.windowMeasurement.insideMount') : t('tools.windowMeasurement.outsideMount')} |
                      {treatmentTypes.find(t => t.id === window.treatmentType)?.label}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteWindow(window.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    x
                  </button>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <div className="text-sm font-medium text-slate-600 mb-1">{t('tools.windowMeasurement.recommendations')}:</div>
                  <ul className="text-xs text-slate-500 space-y-1">
                    {getRecommendations(window).map((rec, i) => (
                      <li key={i}>- {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.windowMeasurement.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.windowMeasurement.tip1')}</li>
          <li>{t('tools.windowMeasurement.tip2')}</li>
          <li>{t('tools.windowMeasurement.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
