import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface GradientStop {
  color: string
  position: number
}

export default function GradientGenerator() {
  const { t } = useTranslation()
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear')
  const [angle, setAngle] = useState(90)
  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#3B82F6', position: 0 },
    { color: '#8B5CF6', position: 100 }
  ])
  const [copied, setCopied] = useState(false)

  const getGradientCSS = (): string => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position)
    const stopsString = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')

    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${stopsString})`
    } else {
      return `radial-gradient(circle, ${stopsString})`
    }
  }

  const addStop = () => {
    if (stops.length < 5) {
      const newPosition = stops.length > 0 ? 50 : 0
      setStops([...stops, { color: '#10B981', position: newPosition }])
    }
  }

  const removeStop = (index: number) => {
    if (stops.length > 2) {
      setStops(stops.filter((_, i) => i !== index))
    }
  }

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    setStops(stops.map((stop, i) =>
      i === index ? { ...stop, ...updates } : stop
    ))
  }

  const copyCSS = () => {
    const css = `background: ${getGradientCSS()};`
    navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const randomGradient = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    setStops([
      { color: randomColor(), position: 0 },
      { color: randomColor(), position: 100 }
    ])
    setAngle(Math.floor(Math.random() * 360))
  }

  const presets = [
    { name: 'Sunset', stops: [{ color: '#f97316', position: 0 }, { color: '#ec4899', position: 100 }] },
    { name: 'Ocean', stops: [{ color: '#06b6d4', position: 0 }, { color: '#3b82f6', position: 100 }] },
    { name: 'Forest', stops: [{ color: '#22c55e', position: 0 }, { color: '#14532d', position: 100 }] },
    { name: 'Purple', stops: [{ color: '#8b5cf6', position: 0 }, { color: '#6366f1', position: 100 }] },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div
          className="w-full h-48 rounded-lg mb-4"
          style={{ background: getGradientCSS() }}
        />

        <div className="flex gap-2 justify-center">
          <button
            onClick={randomGradient}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            🎲 {t('tools.gradientGenerator.random')}
          </button>
          <button
            onClick={copyCSS}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {copied ? '✓ Copied!' : `📋 ${t('tools.gradientGenerator.copyCSS')}`}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.gradientGenerator.settings')}</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.gradientGenerator.type')}</label>
            <select
              value={gradientType}
              onChange={(e) => setGradientType(e.target.value as 'linear' | 'radial')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="linear">{t('tools.gradientGenerator.linear')}</option>
              <option value="radial">{t('tools.gradientGenerator.radial')}</option>
            </select>
          </div>
          {gradientType === 'linear' && (
            <div>
              <label className="text-sm text-slate-500 block mb-1">
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
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-500">{t('tools.gradientGenerator.colorStops')}</label>
            {stops.length < 5 && (
              <button
                onClick={addStop}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                + {t('tools.gradientGenerator.addStop')}
              </button>
            )}
          </div>

          {stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(i, { color: e.target.value })}
                className="w-10 h-10 cursor-pointer"
              />
              <input
                type="text"
                value={stop.color}
                onChange={(e) => updateStop(i, { color: e.target.value })}
                className="w-24 px-2 py-1 border border-slate-300 rounded text-sm font-mono"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={stop.position}
                onChange={(e) => updateStop(i, { position: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="w-12 text-sm text-slate-500">{stop.position}%</span>
              {stops.length > 2 && (
                <button
                  onClick={() => removeStop(i)}
                  className="text-red-500 hover:text-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.gradientGenerator.presets')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setStops(preset.stops)}
              className="h-16 rounded-lg transition-transform hover:scale-105"
              style={{
                background: `linear-gradient(90deg, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`
              }}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-800 text-white font-mono text-sm">
        <div className="text-slate-400 mb-1">/* CSS */</div>
        <div>background: {getGradientCSS()};</div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.gradientGenerator.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.gradientGenerator.aboutText')}
        </p>
      </div>
    </div>
  )
}
