import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface ColorStop {
  color: string
  position: number
}

export default function GradientGenerator() {
  const { t } = useTranslation()
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear')
  const [angle, setAngle] = useState(90)
  const [radialShape, setRadialShape] = useState<'circle' | 'ellipse'>('circle')
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 }
  ])
  const { copy, copied } = useClipboard()

  const gradientCss = useMemo(() => {
    const stops = colorStops
      .sort((a, b) => a.position - b.position)
      .map(s => `${s.color} ${s.position}%`)
      .join(', ')

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stops})`
      case 'radial':
        return `radial-gradient(${radialShape}, ${stops})`
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${stops})`
      default:
        return ''
    }
  }, [gradientType, angle, radialShape, colorStops])

  const addColorStop = useCallback(() => {
    if (colorStops.length >= 6) return
    const newPosition = Math.round(
      colorStops.reduce((sum, s) => sum + s.position, 0) / colorStops.length
    )
    setColorStops([...colorStops, { color: '#ffffff', position: newPosition }])
  }, [colorStops])

  const removeColorStop = useCallback((index: number) => {
    if (colorStops.length <= 2) return
    setColorStops(colorStops.filter((_, i) => i !== index))
  }, [colorStops])

  const updateColorStop = useCallback((index: number, field: 'color' | 'position', value: string | number) => {
    setColorStops(colorStops.map((stop, i) =>
      i === index ? { ...stop, [field]: value } : stop
    ))
  }, [colorStops])

  const randomGradient = useCallback(() => {
    const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setColorStops([
      { color: randomColor(), position: 0 },
      { color: randomColor(), position: 100 }
    ])
    setAngle(Math.floor(Math.random() * 360))
  }, [])

  const presets = [
    { name: 'Sunset', stops: [{ color: '#f093fb', position: 0 }, { color: '#f5576c', position: 100 }] },
    { name: 'Ocean', stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }] },
    { name: 'Forest', stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
    { name: 'Fire', stops: [{ color: '#f12711', position: 0 }, { color: '#f5af19', position: 100 }] },
    { name: 'Night', stops: [{ color: '#0f0c29', position: 0 }, { color: '#302b63', position: 50 }, { color: '#24243e', position: 100 }] },
    { name: 'Rainbow', stops: [{ color: '#ff0000', position: 0 }, { color: '#ffff00', position: 25 }, { color: '#00ff00', position: 50 }, { color: '#00ffff', position: 75 }, { color: '#0000ff', position: 100 }] },
  ]

  return (
    <div className="space-y-4">
      <div
        className="card p-0 h-48 rounded-lg"
        style={{ background: gradientCss }}
      />

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.gradientGenerator.gradientType')}
        </h3>

        <div className="flex gap-2 mb-4">
          {['linear', 'radial', 'conic'].map((type) => (
            <button
              key={type}
              onClick={() => setGradientType(type as typeof gradientType)}
              className={`px-4 py-2 text-sm rounded border ${
                gradientType === type
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-slate-50 border-slate-300 text-slate-600'
              }`}
            >
              {t(`tools.gradientGenerator.${type}`)}
            </button>
          ))}
        </div>

        {(gradientType === 'linear' || gradientType === 'conic') && (
          <div className="mb-4">
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.gradientGenerator.angle')}: {angle}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {gradientType === 'radial' && (
          <div className="mb-4">
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.gradientGenerator.shape')}
            </label>
            <div className="flex gap-2">
              {['circle', 'ellipse'].map((shape) => (
                <button
                  key={shape}
                  onClick={() => setRadialShape(shape as typeof radialShape)}
                  className={`px-4 py-2 text-sm rounded border ${
                    radialShape === shape
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  {t(`tools.gradientGenerator.${shape}`)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.gradientGenerator.colorStops')}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={randomGradient}>
              {t('tools.gradientGenerator.random')}
            </Button>
            <Button
              variant="secondary"
              onClick={addColorStop}
              disabled={colorStops.length >= 6}
            >
              {t('tools.gradientGenerator.addStop')}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {colorStops.map((stop, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateColorStop(i, 'color', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={stop.color}
                onChange={(e) => updateColorStop(i, 'color', e.target.value)}
                className="w-24 px-2 py-1 border border-slate-300 rounded font-mono text-sm"
              />
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) => updateColorStop(i, 'position', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-slate-600 w-12">{stop.position}%</span>
              </div>
              <button
                onClick={() => removeColorStop(i)}
                disabled={colorStops.length <= 2}
                className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.gradientGenerator.presets')}
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setColorStops(preset.stops)}
              className="h-12 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
              style={{
                background: `linear-gradient(90deg, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`
              }}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.gradientGenerator.cssCode')}
          </h3>
          <Button variant="secondary" onClick={() => copy(`background: ${gradientCss};`)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto">
          <code className="font-mono text-sm text-slate-800">
            background: {gradientCss};
          </code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.gradientGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.gradientGenerator.tip1')}</li>
          <li>{t('tools.gradientGenerator.tip2')}</li>
          <li>{t('tools.gradientGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
