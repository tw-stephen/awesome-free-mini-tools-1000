import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface ColorStop {
  id: string
  color: string
  position: number
}

type GradientType = 'linear' | 'radial' | 'conic'

export default function GradientGenerator() {
  const { t } = useTranslation()

  const [gradientType, setGradientType] = useState<GradientType>('linear')
  const [angle, setAngle] = useState(90)
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: '1', color: '#3b82f6', position: 0 },
    { id: '2', color: '#8b5cf6', position: 100 }
  ])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateGradientCSS = (): string => {
    const stops = [...colorStops].sort((a, b) => a.position - b.position)
    const stopsStr = stops.map(s => `${s.color} ${s.position}%`).join(', ')

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stopsStr})`
      case 'radial':
        return `radial-gradient(circle, ${stopsStr})`
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${stopsStr})`
      default:
        return `linear-gradient(${angle}deg, ${stopsStr})`
    }
  }

  const gradientCSS = generateGradientCSS()

  const addColorStop = () => {
    const newId = Date.now().toString()
    const positions = colorStops.map(s => s.position).sort((a, b) => a - b)
    let newPosition = 50

    if (positions.length >= 2) {
      let maxGap = 0
      let gapStart = 0
      for (let i = 0; i < positions.length - 1; i++) {
        const gap = positions[i + 1] - positions[i]
        if (gap > maxGap) {
          maxGap = gap
          gapStart = positions[i]
        }
      }
      newPosition = gapStart + maxGap / 2
    }

    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setColorStops([...colorStops, { id: newId, color: randomColor, position: newPosition }])
    setSelectedId(newId)
  }

  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setColorStops(colorStops.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteColorStop = (id: string) => {
    if (colorStops.length <= 2) return
    setColorStops(colorStops.filter(s => s.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const copyCSS = async () => {
    await navigator.clipboard.writeText(`background: ${gradientCSS};`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const randomGradient = () => {
    const newStops: ColorStop[] = []
    const numStops = 2 + Math.floor(Math.random() * 2)
    for (let i = 0; i < numStops; i++) {
      newStops.push({
        id: Date.now().toString() + i,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
        position: i === 0 ? 0 : i === numStops - 1 ? 100 : Math.round((i / (numStops - 1)) * 100)
      })
    }
    setColorStops(newStops)
    setAngle(Math.floor(Math.random() * 360))
  }

  const presets = [
    { name: 'Sunset', stops: [{ color: '#f97316', position: 0 }, { color: '#ec4899', position: 100 }] },
    { name: 'Ocean', stops: [{ color: '#06b6d4', position: 0 }, { color: '#3b82f6', position: 100 }] },
    { name: 'Forest', stops: [{ color: '#22c55e', position: 0 }, { color: '#15803d', position: 100 }] },
    { name: 'Purple', stops: [{ color: '#8b5cf6', position: 0 }, { color: '#ec4899', position: 100 }] },
    { name: 'Fire', stops: [{ color: '#fbbf24', position: 0 }, { color: '#ef4444', position: 100 }] },
    { name: 'Night', stops: [{ color: '#1e293b', position: 0 }, { color: '#6366f1', position: 100 }] }
  ]

  const applyPreset = (stops: { color: string; position: number }[]) => {
    setColorStops(stops.map((s, i) => ({ ...s, id: Date.now().toString() + i })))
  }

  const selectedStop = selectedId ? colorStops.find(s => s.id === selectedId) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={randomGradient}>{t('tools.gradient.random')}</Button>
        <div className="flex gap-1">
          {(['linear', 'radial', 'conic'] as GradientType[]).map(type => (
            <button
              key={type}
              onClick={() => setGradientType(type)}
              className={`px-2 py-1 text-xs rounded ${gradientType === type ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            >
              {t(`tools.gradient.types.${type}`)}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyCSS}>
          {copied ? t('common.copied') : t('tools.gradient.copyCSS')}
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset.stops)}
            className="px-3 py-1.5 text-xs rounded-full border border-slate-200 hover:border-slate-300 flex items-center gap-2"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: `linear-gradient(90deg, ${preset.stops.map(s => s.color).join(', ')})` }}
            />
            {preset.name}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div
            className="h-64 rounded-lg shadow-lg"
            style={{ background: gradientCSS }}
            onClick={() => setSelectedId(null)}
          />

          <div className="relative h-8 rounded bg-slate-200">
            <div className="absolute inset-0 rounded" style={{ background: gradientCSS }} />
            {colorStops.map(stop => (
              <button
                key={stop.id}
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-6 rounded border-2 ${selectedId === stop.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-white'} shadow cursor-pointer`}
                style={{
                  left: `calc(${stop.position}% - 8px)`,
                  backgroundColor: stop.color
                }}
                onClick={() => setSelectedId(stop.id)}
              />
            ))}
          </div>

          <div className="p-3 bg-slate-800 rounded-lg">
            <code className="text-sm text-green-400 break-all">
              background: {gradientCSS};
            </code>
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.gradient.settings')}</h3>

          <div className="space-y-4">
            {(gradientType === 'linear' || gradientType === 'conic') && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gradient.angle')} ({angle}°)</label>
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-slate-500">{t('tools.gradient.colorStops')}</label>
                <button
                  onClick={addColorStop}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  + {t('tools.gradient.addStop')}
                </button>
              </div>
              <div className="space-y-1 max-h-32 overflow-auto">
                {[...colorStops].sort((a, b) => a.position - b.position).map(stop => (
                  <div
                    key={stop.id}
                    className={`flex items-center gap-2 p-1 rounded cursor-pointer ${selectedId === stop.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                    onClick={() => setSelectedId(stop.id)}
                  >
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: stop.color }} />
                    <span className="text-xs font-mono flex-1">{stop.color}</span>
                    <span className="text-xs text-slate-400">{stop.position}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedStop && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h4 className="text-xs font-medium text-slate-500">{t('tools.gradient.editStop')}</h4>

              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gradient.color')}</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={selectedStop.color}
                    onChange={(e) => updateColorStop(selectedId!, { color: e.target.value })}
                    className="w-10 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedStop.color}
                    onChange={(e) => updateColorStop(selectedId!, { color: e.target.value })}
                    className="input flex-1 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gradient.position')} ({selectedStop.position}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedStop.position}
                  onChange={(e) => updateColorStop(selectedId!, { position: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {colorStops.length > 2 && (
                <Button
                  variant="secondary"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => deleteColorStop(selectedId!)}
                >
                  {t('tools.gradient.deleteStop')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
