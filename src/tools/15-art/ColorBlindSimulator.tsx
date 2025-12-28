import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ColorBlindSimulator() {
  const { t } = useTranslation()
  const [inputColor, setInputColor] = useState('#3B82F6')

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16)
          return hex.length === 1 ? '0' + hex : hex
        })
        .join('')
    )
  }

  const simulateColorBlindness = (
    color: { r: number; g: number; b: number },
    type: string
  ): { r: number; g: number; b: number } => {
    const { r, g, b } = color

    switch (type) {
      case 'protanopia': // Red-blind
        return {
          r: 0.567 * r + 0.433 * g,
          g: 0.558 * r + 0.442 * g,
          b: 0.242 * g + 0.758 * b,
        }
      case 'deuteranopia': // Green-blind
        return {
          r: 0.625 * r + 0.375 * g,
          g: 0.7 * r + 0.3 * g,
          b: 0.3 * g + 0.7 * b,
        }
      case 'tritanopia': // Blue-blind
        return {
          r: 0.95 * r + 0.05 * g,
          g: 0.433 * g + 0.567 * b,
          b: 0.475 * g + 0.525 * b,
        }
      case 'achromatopsia': // Complete color blindness
        const gray = 0.299 * r + 0.587 * g + 0.114 * b
        return { r: gray, g: gray, b: gray }
      default:
        return { r, g, b }
    }
  }

  const types = [
    { id: 'protanopia', name: 'Protanopia', description: 'Red-blind (1% of males)' },
    { id: 'deuteranopia', name: 'Deuteranopia', description: 'Green-blind (1% of males)' },
    { id: 'tritanopia', name: 'Tritanopia', description: 'Blue-blind (rare)' },
    { id: 'achromatopsia', name: 'Achromatopsia', description: 'Complete color blindness (rare)' },
  ]

  const rgb = hexToRgb(inputColor)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorBlindSimulator.inputColor')}</h3>
        <div className="flex gap-4 items-center">
          <input
            type="color"
            value={inputColor}
            onChange={(e) => setInputColor(e.target.value)}
            className="w-20 h-20 cursor-pointer rounded"
          />
          <div className="flex-1">
            <input
              type="text"
              value={inputColor}
              onChange={(e) => setInputColor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
            />
            <div className="text-sm text-slate-500 mt-1">
              RGB({rgb.r}, {rgb.g}, {rgb.b})
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorBlindSimulator.simulations')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-slate-200">
            <div
              className="w-full h-24 rounded mb-2"
              style={{ backgroundColor: inputColor }}
            />
            <div className="font-medium">Normal Vision</div>
            <div className="text-sm text-slate-500 font-mono">{inputColor}</div>
          </div>

          {types.map((type) => {
            const simulated = simulateColorBlindness(rgb, type.id)
            const simulatedHex = rgbToHex(simulated.r, simulated.g, simulated.b)

            return (
              <div key={type.id} className="p-4 rounded-lg border border-slate-200">
                <div
                  className="w-full h-24 rounded mb-2"
                  style={{ backgroundColor: simulatedHex }}
                />
                <div className="font-medium">{type.name}</div>
                <div className="text-sm text-slate-500">{type.description}</div>
                <div className="text-sm text-slate-500 font-mono">{simulatedHex}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorBlindSimulator.comparison')}</h3>
        <div className="flex gap-1 rounded-lg overflow-hidden h-16">
          <div className="flex-1" style={{ backgroundColor: inputColor }} title="Normal" />
          {types.map((type) => {
            const simulated = simulateColorBlindness(rgb, type.id)
            const simulatedHex = rgbToHex(simulated.r, simulated.g, simulated.b)
            return (
              <div
                key={type.id}
                className="flex-1"
                style={{ backgroundColor: simulatedHex }}
                title={type.name}
              />
            )
          })}
        </div>
        <div className="flex gap-1 mt-1 text-xs text-slate-500">
          <div className="flex-1 text-center">Normal</div>
          {types.map((type) => (
            <div key={type.id} className="flex-1 text-center">
              {type.name.slice(0, 3)}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.colorBlindSimulator.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.colorBlindSimulator.aboutText')}
        </p>
      </div>
    </div>
  )
}
