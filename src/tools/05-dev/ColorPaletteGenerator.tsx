import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface Color {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
}

export default function ColorPaletteGenerator() {
  const { t } = useTranslation()
  const [baseColor, setBaseColor] = useState('#3b82f6')
  const [palette, setPalette] = useState<Color[]>([])
  const [paletteType, setPaletteType] = useState<'complementary' | 'analogous' | 'triadic' | 'split' | 'tetradic' | 'monochromatic'>('analogous')
  const { copy, copied } = useClipboard()

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
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
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

  const createColor = (h: number, s: number, l: number): Color => {
    h = ((h % 360) + 360) % 360
    s = Math.max(0, Math.min(100, s))
    l = Math.max(0, Math.min(100, l))
    const rgb = hslToRgb(h, s, l)
    return {
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb,
      hsl: { h, s, l }
    }
  }

  const generatePalette = useCallback(() => {
    const rgb = hexToRgb(baseColor)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const colors: Color[] = []

    switch (paletteType) {
      case 'complementary':
        colors.push(createColor(hsl.h, hsl.s, hsl.l))
        colors.push(createColor(hsl.h + 180, hsl.s, hsl.l))
        break

      case 'analogous':
        colors.push(createColor(hsl.h - 30, hsl.s, hsl.l))
        colors.push(createColor(hsl.h, hsl.s, hsl.l))
        colors.push(createColor(hsl.h + 30, hsl.s, hsl.l))
        break

      case 'triadic':
        colors.push(createColor(hsl.h, hsl.s, hsl.l))
        colors.push(createColor(hsl.h + 120, hsl.s, hsl.l))
        colors.push(createColor(hsl.h + 240, hsl.s, hsl.l))
        break

      case 'split':
        colors.push(createColor(hsl.h, hsl.s, hsl.l))
        colors.push(createColor(hsl.h + 150, hsl.s, hsl.l))
        colors.push(createColor(hsl.h + 210, hsl.s, hsl.l))
        break

      case 'tetradic':
        colors.push(createColor(hsl.h, hsl.s, hsl.l))
        colors.push(createColor(hsl.h + 90, hsl.s, hsl.l))
        colors.push(createColor(hsl.h + 180, hsl.s, hsl.l))
        colors.push(createColor(hsl.h + 270, hsl.s, hsl.l))
        break

      case 'monochromatic':
        colors.push(createColor(hsl.h, hsl.s, Math.max(10, hsl.l - 30)))
        colors.push(createColor(hsl.h, hsl.s, Math.max(20, hsl.l - 15)))
        colors.push(createColor(hsl.h, hsl.s, hsl.l))
        colors.push(createColor(hsl.h, hsl.s, Math.min(80, hsl.l + 15)))
        colors.push(createColor(hsl.h, hsl.s, Math.min(90, hsl.l + 30)))
        break
    }

    setPalette(colors)
  }, [baseColor, paletteType])

  const generateRandom = useCallback(() => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setBaseColor(randomHex)
  }, [])

  const exportPalette = useCallback((format: 'css' | 'scss' | 'json' | 'array') => {
    let output = ''
    switch (format) {
      case 'css':
        output = palette.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n')
        break
      case 'scss':
        output = palette.map((c, i) => `$color-${i + 1}: ${c.hex};`).join('\n')
        break
      case 'json':
        output = JSON.stringify(palette.map(c => c.hex), null, 2)
        break
      case 'array':
        output = `[${palette.map(c => `'${c.hex}'`).join(', ')}]`
        break
    }
    copy(output)
  }, [palette, copy])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.colorPaletteGenerator.baseColor')}
        </h3>

        <div className="flex items-center gap-4">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-16 h-16 rounded cursor-pointer"
          />
          <input
            type="text"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded font-mono text-sm w-32"
          />
          <Button variant="secondary" onClick={generateRandom}>
            {t('tools.colorPaletteGenerator.random')}
          </Button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.colorPaletteGenerator.paletteType')}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { value: 'complementary', label: t('tools.colorPaletteGenerator.complementary') },
            { value: 'analogous', label: t('tools.colorPaletteGenerator.analogous') },
            { value: 'triadic', label: t('tools.colorPaletteGenerator.triadic') },
            { value: 'split', label: t('tools.colorPaletteGenerator.splitComplementary') },
            { value: 'tetradic', label: t('tools.colorPaletteGenerator.tetradic') },
            { value: 'monochromatic', label: t('tools.colorPaletteGenerator.monochromatic') },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPaletteType(value as typeof paletteType)}
              className={`px-3 py-2 text-sm rounded border ${
                paletteType === value
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <Button variant="primary" onClick={generatePalette} className="mt-4">
          {t('tools.colorPaletteGenerator.generate')}
        </Button>
      </div>

      {palette.length > 0 && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.colorPaletteGenerator.palette')}
            </h3>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {palette.map((color, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-24 rounded-lg overflow-hidden border border-slate-200"
                >
                  <div
                    className="h-24 cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copy(color.hex)}
                    title={t('tools.colorPaletteGenerator.clickToCopy')}
                  />
                  <div className="p-2 text-center bg-white">
                    <p className="text-xs font-mono text-slate-700">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.colorPaletteGenerator.colorDetails')}
            </h3>

            <div className="space-y-2">
              {palette.map((color, i) => (
                <div key={i} className="flex items-center gap-4 p-2 bg-slate-50 rounded">
                  <div
                    className="w-10 h-10 rounded"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1 grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500">HEX:</span>
                      <span className="ml-1 font-mono text-slate-700">{color.hex}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">RGB:</span>
                      <span className="ml-1 font-mono text-slate-700">
                        {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">HSL:</span>
                      <span className="ml-1 font-mono text-slate-700">
                        {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.colorPaletteGenerator.export')}
            </h3>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => exportPalette('css')}>
                {copied ? t('common.copied') : 'CSS'}
              </Button>
              <Button variant="secondary" onClick={() => exportPalette('scss')}>
                {copied ? t('common.copied') : 'SCSS'}
              </Button>
              <Button variant="secondary" onClick={() => exportPalette('json')}>
                {copied ? t('common.copied') : 'JSON'}
              </Button>
              <Button variant="secondary" onClick={() => exportPalette('array')}>
                {copied ? t('common.copied') : 'Array'}
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.colorPaletteGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.colorPaletteGenerator.tip1')}</li>
          <li>{t('tools.colorPaletteGenerator.tip2')}</li>
          <li>{t('tools.colorPaletteGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
