import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface ColorValues {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  cmyk: { c: number; m: number; y: number; k: number }
}

export default function ColorConverter() {
  const { t } = useTranslation()
  const [color, setColor] = useState<ColorValues>({
    hex: '#3B82F6',
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    cmyk: { c: 76, m: 47, y: 0, k: 4 },
  })
  const { copy, copied } = useClipboard()

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = Math.round(x).toString(16)
          return hex.length === 1 ? '0' + hex : hex
        })
        .join('')
        .toUpperCase()
    )
  }

  const rgbToHsl = (
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; l: number } => {
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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const hslToRgb = (
    h: number,
    s: number,
    l: number
  ): { r: number; g: number; b: number } => {
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

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  const rgbToCmyk = (
    r: number,
    g: number,
    b: number
  ): { c: number; m: number; y: number; k: number } => {
    r /= 255
    g /= 255
    b /= 255

    const k = 1 - Math.max(r, g, b)
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 }
    }

    const c = (1 - r - k) / (1 - k)
    const m = (1 - g - k) / (1 - k)
    const y = (1 - b - k) / (1 - k)

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    }
  }

  const cmykToRgb = (
    c: number,
    m: number,
    y: number,
    k: number
  ): { r: number; g: number; b: number } => {
    c /= 100
    m /= 100
    y /= 100
    k /= 100

    return {
      r: Math.round(255 * (1 - c) * (1 - k)),
      g: Math.round(255 * (1 - m) * (1 - k)),
      b: Math.round(255 * (1 - y) * (1 - k)),
    }
  }

  const updateFromHex = useCallback((hex: string) => {
    const rgb = hexToRgb(hex)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)
      setColor({
        hex: hex.toUpperCase(),
        rgb,
        hsl,
        cmyk,
      })
    }
  }, [])

  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    const hex = rgbToHex(r, g, b)
    const hsl = rgbToHsl(r, g, b)
    const cmyk = rgbToCmyk(r, g, b)
    setColor({
      hex,
      rgb: { r, g, b },
      hsl,
      cmyk,
    })
  }, [])

  const updateFromHsl = useCallback((h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)
    setColor({
      hex,
      rgb,
      hsl: { h, s, l },
      cmyk,
    })
  }, [])

  const updateFromCmyk = useCallback((c: number, m: number, y: number, k: number) => {
    const rgb = cmykToRgb(c, m, y, k)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    setColor({
      hex,
      rgb,
      hsl,
      cmyk: { c, m, y, k },
    })
  }, [])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.colorConverter.preview')}
        </h3>
        <div className="flex items-center gap-4">
          <div
            className="w-32 h-32 rounded-lg border border-slate-300 shadow-inner"
            style={{ backgroundColor: color.hex }}
          />
          <input
            type="color"
            value={color.hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-16 h-16 cursor-pointer"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">HEX</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={color.hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono"
          />
          <Button variant="secondary" onClick={() => copy(color.hex)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">RGB</h3>
        <div className="grid grid-cols-3 gap-4 mb-2">
          <div>
            <label className="block text-xs text-slate-500 mb-1">R</label>
            <input
              type="number"
              min="0"
              max="255"
              value={color.rgb.r}
              onChange={(e) =>
                updateFromRgb(parseInt(e.target.value) || 0, color.rgb.g, color.rgb.b)
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">G</label>
            <input
              type="number"
              min="0"
              max="255"
              value={color.rgb.g}
              onChange={(e) =>
                updateFromRgb(color.rgb.r, parseInt(e.target.value) || 0, color.rgb.b)
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">B</label>
            <input
              type="number"
              min="0"
              max="255"
              value={color.rgb.b}
              onChange={(e) =>
                updateFromRgb(color.rgb.r, color.rgb.g, parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => copy(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)}
        >
          {t('common.copy')} rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
        </Button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">HSL</h3>
        <div className="grid grid-cols-3 gap-4 mb-2">
          <div>
            <label className="block text-xs text-slate-500 mb-1">H (0-360)</label>
            <input
              type="number"
              min="0"
              max="360"
              value={color.hsl.h}
              onChange={(e) =>
                updateFromHsl(parseInt(e.target.value) || 0, color.hsl.s, color.hsl.l)
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">S (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={color.hsl.s}
              onChange={(e) =>
                updateFromHsl(color.hsl.h, parseInt(e.target.value) || 0, color.hsl.l)
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">L (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={color.hsl.l}
              onChange={(e) =>
                updateFromHsl(color.hsl.h, color.hsl.s, parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => copy(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`)}
        >
          {t('common.copy')} hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
        </Button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">CMYK</h3>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div>
            <label className="block text-xs text-slate-500 mb-1">C (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={color.cmyk.c}
              onChange={(e) =>
                updateFromCmyk(
                  parseInt(e.target.value) || 0,
                  color.cmyk.m,
                  color.cmyk.y,
                  color.cmyk.k
                )
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">M (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={color.cmyk.m}
              onChange={(e) =>
                updateFromCmyk(
                  color.cmyk.c,
                  parseInt(e.target.value) || 0,
                  color.cmyk.y,
                  color.cmyk.k
                )
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Y (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={color.cmyk.y}
              onChange={(e) =>
                updateFromCmyk(
                  color.cmyk.c,
                  color.cmyk.m,
                  parseInt(e.target.value) || 0,
                  color.cmyk.k
                )
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">K (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={color.cmyk.k}
              onChange={(e) =>
                updateFromCmyk(
                  color.cmyk.c,
                  color.cmyk.m,
                  color.cmyk.y,
                  parseInt(e.target.value) || 0
                )
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() =>
            copy(
              `cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`
            )
          }
        >
          {t('common.copy')} cmyk({color.cmyk.c}%, {color.cmyk.m}%, {color.cmyk.y}%,{' '}
          {color.cmyk.k}%)
        </Button>
      </div>
    </div>
  )
}
