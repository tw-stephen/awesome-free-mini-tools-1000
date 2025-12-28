import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Color {
  hex: string
  rgb: { r: number; g: number; b: number }
  name: string
}

export default function ColorPaletteGenerator() {
  const { t } = useTranslation()
  const [palette, setPalette] = useState<Color[]>([])
  const [savedPalettes, setSavedPalettes] = useState<Color[][]>([])
  const [paletteType, setPaletteType] = useState<'random' | 'monochrome' | 'complementary' | 'analogous'>('random')
  const [baseColor, setBaseColor] = useState('#3B82F6')

  const colorNames = ['Crimson', 'Azure', 'Emerald', 'Sunset', 'Ocean', 'Forest', 'Ruby', 'Sapphire', 'Gold', 'Coral']

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
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

  const generatePalette = () => {
    const colors: Color[] = []
    const base = hexToRgb(baseColor)
    const baseHsl = rgbToHsl(base.r, base.g, base.b)

    switch (paletteType) {
      case 'random':
        for (let i = 0; i < 5; i++) {
          const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
          colors.push({
            hex,
            rgb: hexToRgb(hex),
            name: colorNames[Math.floor(Math.random() * colorNames.length)] + ' ' + (i + 1)
          })
        }
        break
      case 'monochrome':
        for (let i = 0; i < 5; i++) {
          const l = 20 + i * 15
          const rgb = hslToRgb(baseHsl.h, baseHsl.s, l)
          colors.push({
            hex: rgbToHex(rgb.r, rgb.g, rgb.b),
            rgb,
            name: `Shade ${i + 1}`
          })
        }
        break
      case 'complementary':
        for (let i = 0; i < 5; i++) {
          const h = (baseHsl.h + (i * 180 / 4)) % 360
          const rgb = hslToRgb(h, baseHsl.s, baseHsl.l)
          colors.push({
            hex: rgbToHex(rgb.r, rgb.g, rgb.b),
            rgb,
            name: `Color ${i + 1}`
          })
        }
        break
      case 'analogous':
        for (let i = 0; i < 5; i++) {
          const h = (baseHsl.h + (i - 2) * 30 + 360) % 360
          const rgb = hslToRgb(h, baseHsl.s, baseHsl.l)
          colors.push({
            hex: rgbToHex(rgb.r, rgb.g, rgb.b),
            rgb,
            name: `Tone ${i + 1}`
          })
        }
        break
    }
    setPalette(colors)
  }

  const savePalette = () => {
    if (palette.length > 0) {
      setSavedPalettes(prev => [...prev, palette])
    }
  }

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex)
  }

  const exportPalette = () => {
    const css = palette.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n')
    navigator.clipboard.writeText(`:root {\n${css}\n}`)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorPaletteGenerator.options')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.colorPaletteGenerator.baseColor')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-12 h-10 cursor-pointer"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.colorPaletteGenerator.type')}</label>
            <select
              value={paletteType}
              onChange={(e) => setPaletteType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="random">{t('tools.colorPaletteGenerator.random')}</option>
              <option value="monochrome">{t('tools.colorPaletteGenerator.monochrome')}</option>
              <option value="complementary">{t('tools.colorPaletteGenerator.complementary')}</option>
              <option value="analogous">{t('tools.colorPaletteGenerator.analogous')}</option>
            </select>
          </div>
        </div>
        <button
          onClick={generatePalette}
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          🎨 {t('tools.colorPaletteGenerator.generate')}
        </button>
      </div>

      {palette.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.colorPaletteGenerator.palette')}</h3>
            <div className="flex gap-2">
              <button
                onClick={exportPalette}
                className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                📋 {t('tools.colorPaletteGenerator.exportCSS')}
              </button>
              <button
                onClick={savePalette}
                className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
              >
                💾 {t('tools.colorPaletteGenerator.save')}
              </button>
            </div>
          </div>
          <div className="flex gap-2 rounded-lg overflow-hidden">
            {palette.map((color, i) => (
              <div
                key={i}
                className="flex-1 h-32 cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: color.hex }}
                onClick={() => copyColor(color.hex)}
                title={`${color.hex} - Click to copy`}
              />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {palette.map((color, i) => (
              <div key={i} className="text-center text-sm">
                <div className="font-mono text-slate-700">{color.hex}</div>
                <div className="text-slate-500 text-xs">
                  RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedPalettes.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.colorPaletteGenerator.savedPalettes')}</h3>
          <div className="space-y-2">
            {savedPalettes.map((pal, i) => (
              <div key={i} className="flex gap-1 rounded overflow-hidden h-8">
                {pal.map((color, j) => (
                  <div
                    key={j}
                    className="flex-1"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.colorPaletteGenerator.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.colorPaletteGenerator.aboutText')}
        </p>
      </div>
    </div>
  )
}
