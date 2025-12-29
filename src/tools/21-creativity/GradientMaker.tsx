import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ColorStop {
  color: string
  position: number
}

export default function GradientMaker() {
  const { t } = useTranslation()
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear')
  const [angle, setAngle] = useState(90)
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ])
  const [radialShape, setRadialShape] = useState<'circle' | 'ellipse'>('circle')

  const addColorStop = () => {
    if (colorStops.length >= 8) return
    const newPosition = 50
    const newStops = [...colorStops, { color: '#888888', position: newPosition }]
    newStops.sort((a, b) => a.position - b.position)
    setColorStops(newStops)
  }

  const removeColorStop = (index: number) => {
    if (colorStops.length <= 2) return
    setColorStops(colorStops.filter((_, i) => i !== index))
  }

  const updateColorStop = (index: number, field: 'color' | 'position', value: string | number) => {
    const newStops = [...colorStops]
    if (field === 'color') {
      newStops[index].color = value as string
    } else {
      newStops[index].position = value as number
    }
    setColorStops(newStops)
  }

  const generateGradientCSS = (): string => {
    const stopsStr = colorStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ')

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stopsStr})`
      case 'radial':
        return `radial-gradient(${radialShape}, ${stopsStr})`
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${stopsStr})`
      default:
        return ''
    }
  }

  const gradientCSS = generateGradientCSS()

  const presetGradients = [
    { name: 'Sunset', stops: [{ color: '#f093fb', position: 0 }, { color: '#f5576c', position: 100 }] },
    { name: 'Ocean', stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }] },
    { name: 'Forest', stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
    { name: 'Fire', stops: [{ color: '#f12711', position: 0 }, { color: '#f5af19', position: 100 }] },
    { name: 'Night', stops: [{ color: '#0f0c29', position: 0 }, { color: '#302b63', position: 50 }, { color: '#24243e', position: 100 }] },
    { name: 'Aurora', stops: [{ color: '#00c9ff', position: 0 }, { color: '#92fe9d', position: 100 }] },
  ]

  const copyCSS = () => {
    navigator.clipboard.writeText(`background: ${gradientCSS};`)
  }

  return (
    <div className="space-y-6">
      <div
        className="h-48 rounded-lg shadow-lg"
        style={{ background: gradientCSS }}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium">{t('tools.gradientMaker.type')}</label>
        <div className="flex gap-2">
          {(['linear', 'radial', 'conic'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setGradientType(type)}
              className={`px-4 py-2 rounded capitalize ${
                gradientType === type ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {t(`tools.gradientMaker.${type}`)}
            </button>
          ))}
        </div>
      </div>

      {gradientType === 'linear' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {t('tools.gradientMaker.angle')}: {angle}deg
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex gap-2 flex-wrap">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <button
                key={a}
                onClick={() => setAngle(a)}
                className={`px-3 py-1 text-sm rounded ${
                  angle === a ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {a}deg
              </button>
            ))}
          </div>
        </div>
      )}

      {gradientType === 'radial' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">{t('tools.gradientMaker.shape')}</label>
          <div className="flex gap-2">
            <button
              onClick={() => setRadialShape('circle')}
              className={`px-4 py-2 rounded ${
                radialShape === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {t('tools.gradientMaker.circle')}
            </button>
            <button
              onClick={() => setRadialShape('ellipse')}
              className={`px-4 py-2 rounded ${
                radialShape === 'ellipse' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {t('tools.gradientMaker.ellipse')}
            </button>
          </div>
        </div>
      )}

      {gradientType === 'conic' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {t('tools.gradientMaker.startAngle')}: {angle}deg
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

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">{t('tools.gradientMaker.colorStops')}</label>
          <button
            onClick={addColorStop}
            disabled={colorStops.length >= 8}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            + {t('tools.gradientMaker.addStop')}
          </button>
        </div>

        {colorStops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="color"
              value={stop.color}
              onChange={(e) => updateColorStop(index, 'color', e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={stop.color}
              onChange={(e) => updateColorStop(index, 'color', e.target.value)}
              className="w-24 px-2 py-1 border rounded font-mono text-sm"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={stop.position}
              onChange={(e) => updateColorStop(index, 'position', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="w-12 text-sm text-gray-500">{stop.position}%</span>
            <button
              onClick={() => removeColorStop(index)}
              disabled={colorStops.length <= 2}
              className="px-2 py-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-30"
            >
              X
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">{t('tools.gradientMaker.presets')}</label>
        <div className="grid grid-cols-3 gap-2">
          {presetGradients.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setColorStops(preset.stops)}
              className="h-12 rounded text-white text-sm font-medium shadow hover:shadow-md transition"
              style={{
                background: `linear-gradient(90deg, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`,
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.gradientMaker.cssCode')}</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {`background: ${gradientCSS};`}
        </pre>
      </div>

      <button
        onClick={copyCSS}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {t('common.copy')} CSS
      </button>
    </div>
  )
}
