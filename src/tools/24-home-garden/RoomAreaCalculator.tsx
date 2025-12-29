import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Shape = 'rectangle' | 'square' | 'circle' | 'triangle' | 'lshaped'

export default function RoomAreaCalculator() {
  const { t } = useTranslation()
  const [shape, setShape] = useState<Shape>('rectangle')
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    side: '',
    radius: '',
    base: '',
    height: '',
    l1: '',
    l2: '',
    w1: '',
    w2: '',
  })
  const [unit, setUnit] = useState<'ft' | 'm'>('m')

  const calculateArea = (): number => {
    switch (shape) {
      case 'rectangle':
        return parseFloat(dimensions.length) * parseFloat(dimensions.width) || 0
      case 'square':
        return Math.pow(parseFloat(dimensions.side), 2) || 0
      case 'circle':
        return Math.PI * Math.pow(parseFloat(dimensions.radius), 2) || 0
      case 'triangle':
        return 0.5 * parseFloat(dimensions.base) * parseFloat(dimensions.height) || 0
      case 'lshaped':
        const area1 = parseFloat(dimensions.l1) * parseFloat(dimensions.w1) || 0
        const area2 = parseFloat(dimensions.l2) * parseFloat(dimensions.w2) || 0
        return area1 + area2
      default:
        return 0
    }
  }

  const area = calculateArea()
  const unitLabel = unit === 'm' ? 'm²' : 'ft²'

  const shapes: { id: Shape; label: string }[] = [
    { id: 'rectangle', label: t('tools.roomAreaCalculator.rectangle') },
    { id: 'square', label: t('tools.roomAreaCalculator.square') },
    { id: 'circle', label: t('tools.roomAreaCalculator.circle') },
    { id: 'triangle', label: t('tools.roomAreaCalculator.triangle') },
    { id: 'lshaped', label: t('tools.roomAreaCalculator.lshaped') },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.roomAreaCalculator.selectShape')}</h3>
        <div className="flex flex-wrap gap-2">
          {shapes.map(s => (
            <button
              key={s.id}
              onClick={() => setShape(s.id)}
              className={`px-3 py-2 rounded text-sm ${
                shape === s.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.roomAreaCalculator.dimensions')}</h3>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'ft' | 'm')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="m">{t('tools.roomAreaCalculator.meters')}</option>
            <option value="ft">{t('tools.roomAreaCalculator.feet')}</option>
          </select>
        </div>

        <div className="space-y-3">
          {shape === 'rectangle' && (
            <>
              <div>
                <label className="block text-sm text-slate-600 mb-1">{t('tools.roomAreaCalculator.length')}</label>
                <input
                  type="number"
                  value={dimensions.length}
                  onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">{t('tools.roomAreaCalculator.width')}</label>
                <input
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                  placeholder="0"
                />
              </div>
            </>
          )}

          {shape === 'square' && (
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.roomAreaCalculator.sideLength')}</label>
              <input
                type="number"
                value={dimensions.side}
                onChange={(e) => setDimensions({ ...dimensions, side: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0"
              />
            </div>
          )}

          {shape === 'circle' && (
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.roomAreaCalculator.radius')}</label>
              <input
                type="number"
                value={dimensions.radius}
                onChange={(e) => setDimensions({ ...dimensions, radius: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0"
              />
            </div>
          )}

          {shape === 'triangle' && (
            <>
              <div>
                <label className="block text-sm text-slate-600 mb-1">{t('tools.roomAreaCalculator.base')}</label>
                <input
                  type="number"
                  value={dimensions.base}
                  onChange={(e) => setDimensions({ ...dimensions, base: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">{t('tools.roomAreaCalculator.height')}</label>
                <input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                  placeholder="0"
                />
              </div>
            </>
          )}

          {shape === 'lshaped' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">{t('tools.roomAreaCalculator.section1Length')}</label>
                  <input
                    type="number"
                    value={dimensions.l1}
                    onChange={(e) => setDimensions({ ...dimensions, l1: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">{t('tools.roomAreaCalculator.section1Width')}</label>
                  <input
                    type="number"
                    value={dimensions.w1}
                    onChange={(e) => setDimensions({ ...dimensions, w1: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">{t('tools.roomAreaCalculator.section2Length')}</label>
                  <input
                    type="number"
                    value={dimensions.l2}
                    onChange={(e) => setDimensions({ ...dimensions, l2: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">{t('tools.roomAreaCalculator.section2Width')}</label>
                  <input
                    type="number"
                    value={dimensions.w2}
                    onChange={(e) => setDimensions({ ...dimensions, w2: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                    placeholder="0"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.roomAreaCalculator.result')}</h3>
        <div className="text-3xl font-bold text-blue-600">
          {area.toFixed(2)} {unitLabel}
        </div>
        {unit === 'm' && (
          <div className="text-sm text-slate-500 mt-1">
            = {(area * 10.764).toFixed(2)} ft²
          </div>
        )}
        {unit === 'ft' && (
          <div className="text-sm text-slate-500 mt-1">
            = {(area * 0.0929).toFixed(2)} m²
          </div>
        )}
      </div>
    </div>
  )
}
