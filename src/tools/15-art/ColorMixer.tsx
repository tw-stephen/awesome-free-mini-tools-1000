import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ColorMixer() {
  const { t } = useTranslation()
  const [color1, setColor1] = useState('#FF0000')
  const [color2, setColor2] = useState('#0000FF')
  const [ratio, setRatio] = useState(50)
  const [mixMode, setMixMode] = useState<'rgb' | 'hsl' | 'multiply'>('rgb')

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
    return '#' + [r, g, b].map((x) => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360; s /= 100; l /= 100
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
  }

  const mixColors = (): string => {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)
    const t = ratio / 100

    if (mixMode === 'rgb') {
      const r = rgb1.r * (1 - t) + rgb2.r * t
      const g = rgb1.g * (1 - t) + rgb2.g * t
      const b = rgb1.b * (1 - t) + rgb2.b * t
      return rgbToHex(r, g, b)
    } else if (mixMode === 'hsl') {
      const hsl1 = rgbToHsl(rgb1.r, rgb1.g, rgb1.b)
      const hsl2 = rgbToHsl(rgb2.r, rgb2.g, rgb2.b)
      const h = hsl1.h * (1 - t) + hsl2.h * t
      const s = hsl1.s * (1 - t) + hsl2.s * t
      const l = hsl1.l * (1 - t) + hsl2.l * t
      const rgb = hslToRgb(h, s, l)
      return rgbToHex(rgb.r, rgb.g, rgb.b)
    } else {
      // Multiply blend
      const r = (rgb1.r * rgb2.r) / 255
      const g = (rgb1.g * rgb2.g) / 255
      const b = (rgb1.b * rgb2.b) / 255
      return rgbToHex(r, g, b)
    }
  }

  const mixedColor = mixColors()
  const mixedRgb = hexToRgb(mixedColor)

  const generateGradient = (): string[] => {
    const steps = 7
    const colors: string[] = []
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const rgb1 = hexToRgb(color1)
      const rgb2 = hexToRgb(color2)
      const r = rgb1.r * (1 - t) + rgb2.r * t
      const g = rgb1.g * (1 - t) + rgb2.g * t
      const b = rgb1.b * (1 - t) + rgb2.b * t
      colors.push(rgbToHex(r, g, b))
    }
    return colors
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorMixer.inputColors')}</h3>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-sm text-slate-500 block mb-1">{t('tools.colorMixer.color1')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-16 h-16 cursor-pointer rounded"
              />
              <input
                type="text"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded font-mono text-sm"
              />
            </div>
          </div>
          <div className="text-2xl text-slate-400">+</div>
          <div className="flex-1">
            <label className="text-sm text-slate-500 block mb-1">{t('tools.colorMixer.color2')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-16 h-16 cursor-pointer rounded"
              />
              <input
                type="text"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorMixer.mixMode')}</h3>
        <div className="flex gap-2 mb-4">
          {(['rgb', 'hsl', 'multiply'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setMixMode(mode)}
              className={`flex-1 py-2 rounded uppercase text-sm ${
                mixMode === mode ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {mixMode !== 'multiply' && (
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.colorMixer.ratio')}: {ratio}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={ratio}
              onChange={(e) => setRatio(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorMixer.result')}</h3>
        <div
          className="w-full h-32 rounded-lg mb-4 cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundColor: mixedColor }}
          onClick={() => copyColor(mixedColor)}
          title="Click to copy"
        />
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-50 p-3 rounded">
            <div className="text-sm text-slate-500">HEX</div>
            <div className="font-mono font-bold">{mixedColor.toUpperCase()}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <div className="text-sm text-slate-500">RGB</div>
            <div className="font-mono font-bold">
              {mixedRgb.r}, {mixedRgb.g}, {mixedRgb.b}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorMixer.gradient')}</h3>
        <div className="flex rounded-lg overflow-hidden h-12">
          {generateGradient().map((color, i) => (
            <div
              key={i}
              className="flex-1 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => copyColor(color)}
              title={color}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-500 font-mono">
          <span>{color1}</span>
          <span>{color2}</span>
        </div>
      </div>
    </div>
  )
}
