import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

export default function ColorConverter() {
  const { t } = useTranslation()
  const { copy } = useClipboard()
  const [hex, setHex] = useState('#3B82F6')
  const [copiedValue, setCopiedValue] = useState('')

  const colors = useMemo(() => {
    // Normalize hex
    let h = hex.replace('#', '')
    if (h.length === 3) {
      h = h.split('').map(c => c + c).join('')
    }

    const r = parseInt(h.substring(0, 2), 16) || 0
    const g = parseInt(h.substring(2, 4), 16) || 0
    const b = parseInt(h.substring(4, 6), 16) || 0

    // RGB
    const rgb = { r, g, b }

    // HSL
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255

    const max = Math.max(rNorm, gNorm, bNorm)
    const min = Math.min(rNorm, gNorm, bNorm)
    const delta = max - min

    let h2 = 0
    let s = 0
    const l = (max + min) / 2

    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

      switch (max) {
        case rNorm:
          h2 = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) / 6
          break
        case gNorm:
          h2 = ((bNorm - rNorm) / delta + 2) / 6
          break
        case bNorm:
          h2 = ((rNorm - gNorm) / delta + 4) / 6
          break
      }
    }

    const hsl = {
      h: Math.round(h2 * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }

    // HSV/HSB
    const v = max
    const sHsv = max === 0 ? 0 : delta / max

    const hsv = {
      h: hsl.h,
      s: Math.round(sHsv * 100),
      v: Math.round(v * 100),
    }

    // CMYK
    const k = 1 - max
    const c = max === 0 ? 0 : (1 - rNorm - k) / (1 - k)
    const m = max === 0 ? 0 : (1 - gNorm - k) / (1 - k)
    const y = max === 0 ? 0 : (1 - bNorm - k) / (1 - k)

    const cmyk = {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    }

    return { hex: `#${h.toUpperCase()}`, rgb, hsl, hsv, cmyk }
  }, [hex])

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...colors.rgb, [component]: Math.min(255, Math.max(0, value)) }
    const newHex = `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`
    setHex(newHex)
  }

  const copyValue = (label: string, value: string) => {
    copy(value)
    setCopiedValue(label)
    setTimeout(() => setCopiedValue(''), 2000)
  }

  const formats = [
    { label: 'HEX', value: colors.hex },
    { label: 'RGB', value: `rgb(${colors.rgb.r}, ${colors.rgb.g}, ${colors.rgb.b})` },
    { label: 'RGBA', value: `rgba(${colors.rgb.r}, ${colors.rgb.g}, ${colors.rgb.b}, 1)` },
    { label: 'HSL', value: `hsl(${colors.hsl.h}, ${colors.hsl.s}%, ${colors.hsl.l}%)` },
    { label: 'HSLA', value: `hsla(${colors.hsl.h}, ${colors.hsl.s}%, ${colors.hsl.l}%, 1)` },
    { label: 'HSV/HSB', value: `hsv(${colors.hsv.h}, ${colors.hsv.s}%, ${colors.hsv.v}%)` },
    { label: 'CMYK', value: `cmyk(${colors.cmyk.c}%, ${colors.cmyk.m}%, ${colors.cmyk.y}%, ${colors.cmyk.k}%)` },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-4 mb-4">
          <div
            className="w-24 h-24 rounded-lg border border-slate-300 shadow-inner"
            style={{ backgroundColor: colors.hex }}
          />
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.colorConverter.hexColor')}
            </label>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#3B82F6"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
            />
            <input
              type="color"
              value={colors.hex}
              onChange={(e) => setHex(e.target.value)}
              className="mt-2 w-full h-10 cursor-pointer rounded"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Red: {colors.rgb.r}
            </label>
            <input
              type="range"
              value={colors.rgb.r}
              onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
              min="0"
              max="255"
              className="w-full accent-red-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Green: {colors.rgb.g}
            </label>
            <input
              type="range"
              value={colors.rgb.g}
              onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
              min="0"
              max="255"
              className="w-full accent-green-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Blue: {colors.rgb.b}
            </label>
            <input
              type="range"
              value={colors.rgb.b}
              onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
              min="0"
              max="255"
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.colorConverter.formats')}
        </h3>

        <div className="space-y-2">
          {formats.map((format) => (
            <div
              key={format.label}
              className="flex items-center justify-between p-2 bg-slate-50 rounded"
            >
              <div>
                <span className="text-xs text-slate-500">{format.label}</span>
                <div className="font-mono text-sm">{format.value}</div>
              </div>
              <button
                onClick={() => copyValue(format.label, format.value)}
                className="px-3 py-1 text-sm text-blue-500 hover:text-blue-700"
              >
                {copiedValue === format.label ? t('common.copied') : t('common.copy')}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.colorConverter.colorValues')}
        </h3>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="p-2 bg-red-100 rounded text-center">
            <div className="font-bold text-red-700">R</div>
            <div>{colors.rgb.r}</div>
          </div>
          <div className="p-2 bg-green-100 rounded text-center">
            <div className="font-bold text-green-700">G</div>
            <div>{colors.rgb.g}</div>
          </div>
          <div className="p-2 bg-blue-100 rounded text-center">
            <div className="font-bold text-blue-700">B</div>
            <div>{colors.rgb.b}</div>
          </div>
          <div className="p-2 bg-slate-100 rounded text-center">
            <div className="font-bold text-slate-700">A</div>
            <div>255</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-sm mt-2">
          <div className="p-2 bg-cyan-100 rounded text-center">
            <div className="font-bold text-cyan-700">C</div>
            <div>{colors.cmyk.c}%</div>
          </div>
          <div className="p-2 bg-pink-100 rounded text-center">
            <div className="font-bold text-pink-700">M</div>
            <div>{colors.cmyk.m}%</div>
          </div>
          <div className="p-2 bg-yellow-100 rounded text-center">
            <div className="font-bold text-yellow-700">Y</div>
            <div>{colors.cmyk.y}%</div>
          </div>
          <div className="p-2 bg-slate-100 rounded text-center">
            <div className="font-bold text-slate-700">K</div>
            <div>{colors.cmyk.k}%</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.colorConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.colorConverter.tip1')}</li>
          <li>{t('tools.colorConverter.tip2')}</li>
          <li>{t('tools.colorConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
