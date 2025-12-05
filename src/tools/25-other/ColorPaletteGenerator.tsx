import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Color {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
}

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
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16)
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

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
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

const generateColor = (hex: string): Color => {
  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return { hex, rgb, hsl }
}

type PaletteType = 'complementary' | 'analogous' | 'triadic' | 'split' | 'tetradic' | 'monochromatic'

export default function ColorPaletteGenerator() {
  const { t } = useTranslation()
  const [baseColor, setBaseColor] = useState('#3b82f6')
  const [paletteType, setPaletteType] = useState<PaletteType>('complementary')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const base = generateColor(baseColor)

  const generatePalette = (): Color[] => {
    const { h, s, l } = base.hsl
    const colors: Color[] = [base]

    switch (paletteType) {
      case 'complementary': {
        const compRgb = hslToRgb((h + 180) % 360, s, l)
        colors.push(generateColor(rgbToHex(compRgb.r, compRgb.g, compRgb.b)))
        break
      }
      case 'analogous': {
        const rgb1 = hslToRgb((h + 30) % 360, s, l)
        const rgb2 = hslToRgb((h - 30 + 360) % 360, s, l)
        colors.push(generateColor(rgbToHex(rgb1.r, rgb1.g, rgb1.b)))
        colors.push(generateColor(rgbToHex(rgb2.r, rgb2.g, rgb2.b)))
        break
      }
      case 'triadic': {
        const rgb1 = hslToRgb((h + 120) % 360, s, l)
        const rgb2 = hslToRgb((h + 240) % 360, s, l)
        colors.push(generateColor(rgbToHex(rgb1.r, rgb1.g, rgb1.b)))
        colors.push(generateColor(rgbToHex(rgb2.r, rgb2.g, rgb2.b)))
        break
      }
      case 'split': {
        const rgb1 = hslToRgb((h + 150) % 360, s, l)
        const rgb2 = hslToRgb((h + 210) % 360, s, l)
        colors.push(generateColor(rgbToHex(rgb1.r, rgb1.g, rgb1.b)))
        colors.push(generateColor(rgbToHex(rgb2.r, rgb2.g, rgb2.b)))
        break
      }
      case 'tetradic': {
        const rgb1 = hslToRgb((h + 90) % 360, s, l)
        const rgb2 = hslToRgb((h + 180) % 360, s, l)
        const rgb3 = hslToRgb((h + 270) % 360, s, l)
        colors.push(generateColor(rgbToHex(rgb1.r, rgb1.g, rgb1.b)))
        colors.push(generateColor(rgbToHex(rgb2.r, rgb2.g, rgb2.b)))
        colors.push(generateColor(rgbToHex(rgb3.r, rgb3.g, rgb3.b)))
        break
      }
      case 'monochromatic': {
        for (let i = 1; i <= 4; i++) {
          const newL = Math.max(10, Math.min(90, l + (i - 2) * 15))
          const rgb = hslToRgb(h, s, newL)
          colors.push(generateColor(rgbToHex(rgb.r, rgb.g, rgb.b)))
        }
        break
      }
    }

    return colors
  }

  const palette = generatePalette()

  const copyColor = async (color: Color, index: number) => {
    await navigator.clipboard.writeText(color.hex)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const randomColor = () => {
    const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setBaseColor(hex)
  }

  const exportPalette = () => {
    const css = palette.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n')
    const blob = new Blob([`:root {\n${css}\n}`], { type: 'text/css' })
    const a = document.createElement('a')
    a.download = 'palette.css'
    a.href = URL.createObjectURL(blob)
    a.click()
  }

  const paletteTypes: { value: PaletteType; labelKey: string }[] = [
    { value: 'complementary', labelKey: 'complementary' },
    { value: 'analogous', labelKey: 'analogous' },
    { value: 'triadic', labelKey: 'triadic' },
    { value: 'split', labelKey: 'split' },
    { value: 'tetradic', labelKey: 'tetradic' },
    { value: 'monochromatic', labelKey: 'monochromatic' }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={randomColor}>{t('tools.colorPalette.random')}</Button>
        <div className="flex gap-1">
          {paletteTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setPaletteType(type.value)}
              className={`px-2 py-1 text-xs rounded ${paletteType === type.value ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            >
              {t(`tools.colorPalette.types.${type.labelKey}`)}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={exportPalette}>{t('tools.colorPalette.export')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex gap-2 h-48 rounded-lg overflow-hidden shadow-lg">
            {palette.map((color, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center justify-end p-4 cursor-pointer transition-transform hover:scale-105 relative group"
                style={{ backgroundColor: color.hex }}
                onClick={() => copyColor(color, index)}
              >
                <div className={`text-xs font-mono px-2 py-1 rounded ${color.hsl.l > 50 ? 'bg-black/20 text-black' : 'bg-white/20 text-white'}`}>
                  {copiedIndex === index ? t('common.copied') : color.hex}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {palette.map((color, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-3 bg-white">
                <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: color.hex }} />
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">HEX</span>
                    <span className="font-mono">{color.hex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">RGB</span>
                    <span className="font-mono">{color.rgb.r}, {color.rgb.g}, {color.rgb.b}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">HSL</span>
                    <span className="font-mono">{color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.colorPalette.baseColor')}</h3>

          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-16 rounded cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="input w-full text-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">RGB</span>
                <span className="font-mono text-xs">{base.rgb.r}, {base.rgb.g}, {base.rgb.b}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">HSL</span>
                <span className="font-mono text-xs">{base.hsl.h}, {base.hsl.s}%, {base.hsl.l}%</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.colorPalette.info')}</h4>
            <div className="text-xs text-slate-400">
              {t('tools.colorPalette.hint')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
