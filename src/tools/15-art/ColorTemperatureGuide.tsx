import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const WARM_COLORS = [
  { hex: '#FF0000', name: 'Red', temp: 'hot' },
  { hex: '#FF4500', name: 'Orange Red', temp: 'hot' },
  { hex: '#FF8C00', name: 'Dark Orange', temp: 'warm' },
  { hex: '#FFA500', name: 'Orange', temp: 'warm' },
  { hex: '#FFD700', name: 'Gold', temp: 'warm' },
  { hex: '#FFFF00', name: 'Yellow', temp: 'warm' },
  { hex: '#DC143C', name: 'Crimson', temp: 'hot' },
  { hex: '#CD5C5C', name: 'Indian Red', temp: 'warm' },
  { hex: '#F08080', name: 'Light Coral', temp: 'warm' },
  { hex: '#FF69B4', name: 'Hot Pink', temp: 'warm' },
]

const COOL_COLORS = [
  { hex: '#0000FF', name: 'Blue', temp: 'cold' },
  { hex: '#000080', name: 'Navy', temp: 'cold' },
  { hex: '#4169E1', name: 'Royal Blue', temp: 'cool' },
  { hex: '#1E90FF', name: 'Dodger Blue', temp: 'cool' },
  { hex: '#00CED1', name: 'Dark Turquoise', temp: 'cool' },
  { hex: '#00FFFF', name: 'Cyan', temp: 'cool' },
  { hex: '#008080', name: 'Teal', temp: 'cool' },
  { hex: '#228B22', name: 'Forest Green', temp: 'cool' },
  { hex: '#32CD32', name: 'Lime Green', temp: 'cool' },
  { hex: '#9370DB', name: 'Medium Purple', temp: 'cool' },
]

const NEUTRAL_COLORS = [
  { hex: '#FFFFFF', name: 'White', temp: 'neutral' },
  { hex: '#F5F5F5', name: 'White Smoke', temp: 'neutral' },
  { hex: '#D3D3D3', name: 'Light Gray', temp: 'neutral' },
  { hex: '#808080', name: 'Gray', temp: 'neutral' },
  { hex: '#696969', name: 'Dim Gray', temp: 'neutral' },
  { hex: '#2F4F4F', name: 'Dark Slate Gray', temp: 'neutral' },
  { hex: '#000000', name: 'Black', temp: 'neutral' },
  { hex: '#8B4513', name: 'Saddle Brown', temp: 'warm-neutral' },
  { hex: '#D2B48C', name: 'Tan', temp: 'warm-neutral' },
  { hex: '#F5DEB3', name: 'Wheat', temp: 'warm-neutral' },
]

export default function ColorTemperatureGuide() {
  const { t } = useTranslation()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [customColor, setCustomColor] = useState('#3B82F6')

  const getColorTemperature = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    // Calculate perceived warmth
    const warmth = (r * 1.5 + g * 0.5) - (b * 2)

    if (warmth > 200) return t('tools.colorTemperatureGuide.veryWarm')
    if (warmth > 100) return t('tools.colorTemperatureGuide.warm')
    if (warmth > 0) return t('tools.colorTemperatureGuide.slightlyWarm')
    if (warmth > -100) return t('tools.colorTemperatureGuide.slightlyCool')
    if (warmth > -200) return t('tools.colorTemperatureGuide.cool')
    return t('tools.colorTemperatureGuide.veryCool')
  }

  const getTemperatureValue = (hex: string): number => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return Math.round(((r * 1.5 + g * 0.5) - (b * 2)) / 4)
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    setSelectedColor(color)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorTemperatureGuide.analyzeColor')}</h3>
        <div className="flex gap-4">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-20 h-20 cursor-pointer rounded"
          />
          <div className="flex-1">
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono mb-2"
            />
            <div className="text-lg font-medium">{getColorTemperature(customColor)}</div>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-500">{t('tools.colorTemperatureGuide.cool')}</span>
                <div className="flex-1 h-3 rounded-full bg-gradient-to-r from-blue-500 via-gray-300 to-red-500 relative">
                  <div
                    className="absolute w-3 h-3 bg-white border-2 border-slate-600 rounded-full top-0 transform -translate-x-1/2"
                    style={{ left: `${Math.min(100, Math.max(0, 50 + getTemperatureValue(customColor) / 3))}%` }}
                  />
                </div>
                <span className="text-sm text-red-500">{t('tools.colorTemperatureGuide.warm')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Temperature spectrum */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorTemperatureGuide.spectrum')}</h3>
        <div className="h-12 rounded-lg overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(to right, #0000FF, #00FFFF, #00FF00, #FFFF00, #FF8000, #FF0000)'
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-slate-500 mt-1">
          <span>{t('tools.colorTemperatureGuide.coolest')}</span>
          <span>{t('tools.colorTemperatureGuide.neutral')}</span>
          <span>{t('tools.colorTemperatureGuide.warmest')}</span>
        </div>
      </div>

      {/* Warm colors */}
      <div className="card p-4">
        <h3 className="font-medium mb-3 text-red-600">{t('tools.colorTemperatureGuide.warmColors')}</h3>
        <p className="text-sm text-slate-500 mb-3">{t('tools.colorTemperatureGuide.warmDesc')}</p>
        <div className="grid grid-cols-5 gap-2">
          {WARM_COLORS.map((color, i) => (
            <button
              key={i}
              onClick={() => copyColor(color.hex)}
              className={`p-2 rounded transition-all ${
                selectedColor === color.hex ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div
                className="w-full aspect-square rounded"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-xs text-center mt-1 truncate">{color.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cool colors */}
      <div className="card p-4">
        <h3 className="font-medium mb-3 text-blue-600">{t('tools.colorTemperatureGuide.coolColors')}</h3>
        <p className="text-sm text-slate-500 mb-3">{t('tools.colorTemperatureGuide.coolDesc')}</p>
        <div className="grid grid-cols-5 gap-2">
          {COOL_COLORS.map((color, i) => (
            <button
              key={i}
              onClick={() => copyColor(color.hex)}
              className={`p-2 rounded transition-all ${
                selectedColor === color.hex ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div
                className="w-full aspect-square rounded"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-xs text-center mt-1 truncate">{color.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Neutral colors */}
      <div className="card p-4">
        <h3 className="font-medium mb-3 text-slate-600">{t('tools.colorTemperatureGuide.neutralColors')}</h3>
        <p className="text-sm text-slate-500 mb-3">{t('tools.colorTemperatureGuide.neutralDesc')}</p>
        <div className="grid grid-cols-5 gap-2">
          {NEUTRAL_COLORS.map((color, i) => (
            <button
              key={i}
              onClick={() => copyColor(color.hex)}
              className={`p-2 rounded transition-all ${
                selectedColor === color.hex ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div
                className="w-full aspect-square rounded border border-slate-200"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-xs text-center mt-1 truncate">{color.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.colorTemperatureGuide.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.colorTemperatureGuide.tip1')}</li>
          <li>* {t('tools.colorTemperatureGuide.tip2')}</li>
          <li>* {t('tools.colorTemperatureGuide.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
