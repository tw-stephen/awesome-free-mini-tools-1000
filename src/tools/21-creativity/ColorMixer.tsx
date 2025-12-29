import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ColorMixer() {
  const { t } = useTranslation()
  const [color1, setColor1] = useState('#ff0000')
  const [color2, setColor2] = useState('#0000ff')
  const [ratio, setRatio] = useState(50)
  const [mixMode, setMixMode] = useState<'rgb' | 'hsl'>('rgb')

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
    return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')
  }

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360
    s /= 100
    l /= 100
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
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
    } else {
      const hsl1 = rgbToHsl(rgb1.r, rgb1.g, rgb1.b)
      const hsl2 = rgbToHsl(rgb2.r, rgb2.g, rgb2.b)
      const h = hsl1.h * (1 - t) + hsl2.h * t
      const s = hsl1.s * (1 - t) + hsl2.s * t
      const l = hsl1.l * (1 - t) + hsl2.l * t
      const rgb = hslToRgb(h, s, l)
      return rgbToHex(rgb.r, rgb.g, rgb.b)
    }
  }

  const mixedColor = mixColors()
  const mixedRgb = hexToRgb(mixedColor)

  const generateGradientSteps = (steps: number): string[] => {
    const colors: string[] = []
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const rgb1 = hexToRgb(color1)
      const rgb2 = hexToRgb(color2)
      if (mixMode === 'rgb') {
        const r = rgb1.r * (1 - t) + rgb2.r * t
        const g = rgb1.g * (1 - t) + rgb2.g * t
        const b = rgb1.b * (1 - t) + rgb2.b * t
        colors.push(rgbToHex(r, g, b))
      } else {
        const hsl1 = rgbToHsl(rgb1.r, rgb1.g, rgb1.b)
        const hsl2 = rgbToHsl(rgb2.r, rgb2.g, rgb2.b)
        const h = hsl1.h * (1 - t) + hsl2.h * t
        const s = hsl1.s * (1 - t) + hsl2.s * t
        const l = hsl1.l * (1 - t) + hsl2.l * t
        const rgb = hslToRgb(h, s, l)
        colors.push(rgbToHex(rgb.r, rgb.g, rgb.b))
      }
    }
    return colors
  }

  const gradientSteps = generateGradientSteps(10)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">{t('tools.colorMixer.color1')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-16 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="flex-1 px-3 py-2 border rounded font-mono"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">{t('tools.colorMixer.color2')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-16 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="flex-1 px-3 py-2 border rounded font-mono"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">{t('tools.colorMixer.mixMode')}</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMixMode('rgb')}
            className={`px-4 py-2 rounded ${
              mixMode === 'rgb' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            RGB
          </button>
          <button
            onClick={() => setMixMode('hsl')}
            className={`px-4 py-2 rounded ${
              mixMode === 'hsl' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            HSL
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
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
        <div className="flex justify-between text-xs text-gray-500">
          <span>{t('tools.colorMixer.color1')}</span>
          <span>{t('tools.colorMixer.color2')}</span>
        </div>
      </div>

      <div className="flex h-20 rounded overflow-hidden">
        {gradientSteps.map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>

      <div className="card p-6 text-center">
        <div
          className="w-32 h-32 mx-auto rounded-lg shadow-lg mb-4"
          style={{ backgroundColor: mixedColor }}
        />
        <div className="text-2xl font-mono font-bold">{mixedColor.toUpperCase()}</div>
        <div className="text-sm text-gray-500 mt-1">
          RGB({mixedRgb.r}, {mixedRgb.g}, {mixedRgb.b})
        </div>
        <button
          onClick={() => copyToClipboard(mixedColor)}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('common.copy')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorMixer.palette')}</h3>
        <div className="flex gap-2">
          {gradientSteps.filter((_, i) => i % 2 === 0).map((color, i) => (
            <button
              key={i}
              onClick={() => copyToClipboard(color)}
              className="flex-1 h-12 rounded hover:ring-2 ring-blue-500 transition"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
