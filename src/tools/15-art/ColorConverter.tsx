import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ColorConverter() {
  const { t } = useTranslation()
  const [hex, setHex] = useState('#3B82F6')
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [activeInput, setActiveInput] = useState<'hex' | 'rgb' | 'hsl'>('hex')

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

  useEffect(() => {
    if (activeInput === 'hex') {
      const rgbValue = hexToRgb(hex)
      if (rgbValue) {
        setRgb(rgbValue)
        setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b))
      }
    } else if (activeInput === 'rgb') {
      setHex(rgbToHex(rgb.r, rgb.g, rgb.b))
      setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b))
    } else if (activeInput === 'hsl') {
      const rgbValue = hslToRgb(hsl.h, hsl.s, hsl.l)
      setRgb(rgbValue)
      setHex(rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b))
    }
  }, [hex, rgb, hsl, activeInput])

  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div
          className="w-full h-32 rounded-lg mb-4"
          style={{ backgroundColor: hex }}
        />
        <input
          type="color"
          value={hex}
          onChange={(e) => {
            setActiveInput('hex')
            setHex(e.target.value)
          }}
          className="w-full h-12 cursor-pointer"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorConverter.hex')}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={hex}
            onChange={(e) => {
              setActiveInput('hex')
              setHex(e.target.value)
            }}
            className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono"
          />
          <button
            onClick={() => copyValue(hex)}
            className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorConverter.rgb')}</h3>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {(['r', 'g', 'b'] as const).map((channel) => (
            <div key={channel}>
              <label className="text-sm text-slate-500 uppercase block mb-1">{channel}</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgb[channel]}
                onChange={(e) => {
                  setActiveInput('rgb')
                  setRgb({ ...rgb, [channel]: parseInt(e.target.value) || 0 })
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 px-3 py-2 bg-slate-100 rounded font-mono">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </div>
          <button
            onClick={() => copyValue(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
            className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorConverter.hsl')}</h3>
        <div className="space-y-3 mb-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Hue: {hsl.h}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={hsl.h}
              onChange={(e) => {
                setActiveInput('hsl')
                setHsl({ ...hsl, h: parseInt(e.target.value) })
              }}
              className="w-full"
              style={{
                background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
              }}
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Saturation: {hsl.s}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={hsl.s}
              onChange={(e) => {
                setActiveInput('hsl')
                setHsl({ ...hsl, s: parseInt(e.target.value) })
              }}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Lightness: {hsl.l}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={hsl.l}
              onChange={(e) => {
                setActiveInput('hsl')
                setHsl({ ...hsl, l: parseInt(e.target.value) })
              }}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 px-3 py-2 bg-slate-100 rounded font-mono">
            hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
          </div>
          <button
            onClick={() => copyValue(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
            className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="card p-4 bg-slate-800 text-white font-mono text-sm">
        <div className="text-slate-400 mb-2">/* All Formats */</div>
        <div>HEX: {hex}</div>
        <div>RGB: rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
        <div>HSL: hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
        <div>RGBA: rgba({rgb.r}, {rgb.g}, {rgb.b}, 1)</div>
      </div>
    </div>
  )
}
