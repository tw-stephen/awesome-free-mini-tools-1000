import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ComplementaryColorFinder() {
  const { t } = useTranslation()
  const [baseColor, setBaseColor] = useState('#3B82F6')

  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return { h: 0, s: 0, l: 0 }

    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
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

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
  }

  const hsl = hexToHsl(baseColor)

  // Complementary (180 degrees)
  const complementaryHue = (hsl.h + 180) % 360
  const complementary = hslToHex(complementaryHue, hsl.s, hsl.l)

  // Split complementary (150 and 210 degrees)
  const splitComp1 = hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l)
  const splitComp2 = hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)

  // Double complementary (tetradic)
  const tetradic = [
    baseColor,
    hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
    complementary,
    hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
  ]

  // Square colors
  const square = [
    baseColor,
    hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
  ]

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.complementaryColorFinder.baseColor')}</h3>
        <div className="flex gap-4">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-20 h-20 cursor-pointer rounded"
          />
          <div className="flex-1">
            <input
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono mb-2"
            />
            <div className="text-sm text-slate-500">
              HSL: {hsl.h}, {hsl.s}%, {hsl.l}%
            </div>
          </div>
        </div>
      </div>

      {/* Direct Complementary */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.complementaryColorFinder.directComplementary')}</h3>
        <p className="text-sm text-slate-500 mb-3">{t('tools.complementaryColorFinder.directDesc')}</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <div
              className="h-20 rounded-t cursor-pointer"
              style={{ backgroundColor: baseColor }}
              onClick={() => copyColor(baseColor)}
            />
            <div className="text-center py-2 bg-slate-100 rounded-b text-sm font-mono">
              {baseColor}
            </div>
          </div>
          <div className="flex-1">
            <div
              className="h-20 rounded-t cursor-pointer"
              style={{ backgroundColor: complementary }}
              onClick={() => copyColor(complementary)}
            />
            <div className="text-center py-2 bg-slate-100 rounded-b text-sm font-mono">
              {complementary}
            </div>
          </div>
        </div>
      </div>

      {/* Split Complementary */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.complementaryColorFinder.splitComplementary')}</h3>
        <p className="text-sm text-slate-500 mb-3">{t('tools.complementaryColorFinder.splitDesc')}</p>
        <div className="flex gap-2">
          {[baseColor, splitComp1, splitComp2].map((color, i) => (
            <div key={i} className="flex-1">
              <div
                className="h-20 rounded-t cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color)}
              />
              <div className="text-center py-2 bg-slate-100 rounded-b text-sm font-mono">
                {color}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tetradic */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.complementaryColorFinder.tetradic')}</h3>
        <p className="text-sm text-slate-500 mb-3">{t('tools.complementaryColorFinder.tetradicDesc')}</p>
        <div className="flex gap-2">
          {tetradic.map((color, i) => (
            <div key={i} className="flex-1">
              <div
                className="h-16 rounded-t cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color)}
              />
              <div className="text-center py-1 bg-slate-100 rounded-b text-xs font-mono">
                {color}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Square */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.complementaryColorFinder.square')}</h3>
        <p className="text-sm text-slate-500 mb-3">{t('tools.complementaryColorFinder.squareDesc')}</p>
        <div className="flex gap-2">
          {square.map((color, i) => (
            <div key={i} className="flex-1">
              <div
                className="h-16 rounded-t cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color)}
              />
              <div className="text-center py-1 bg-slate-100 rounded-b text-xs font-mono">
                {color}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color wheel visualization */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.complementaryColorFinder.colorWheel')}</h3>
        <div className="relative w-48 h-48 mx-auto">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                hsl(0, 70%, 50%),
                hsl(60, 70%, 50%),
                hsl(120, 70%, 50%),
                hsl(180, 70%, 50%),
                hsl(240, 70%, 50%),
                hsl(300, 70%, 50%),
                hsl(360, 70%, 50%)
              )`
            }}
          />
          {/* Base color marker */}
          <div
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg"
            style={{
              backgroundColor: baseColor,
              left: `${50 + 42 * Math.cos((hsl.h - 90) * Math.PI / 180)}%`,
              top: `${50 + 42 * Math.sin((hsl.h - 90) * Math.PI / 180)}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
          {/* Complementary marker */}
          <div
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg"
            style={{
              backgroundColor: complementary,
              left: `${50 + 42 * Math.cos((complementaryHue - 90) * Math.PI / 180)}%`,
              top: `${50 + 42 * Math.sin((complementaryHue - 90) * Math.PI / 180)}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
          {/* Line connecting them */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={`${50 + 42 * Math.cos((hsl.h - 90) * Math.PI / 180)}%`}
              y1={`${50 + 42 * Math.sin((hsl.h - 90) * Math.PI / 180)}%`}
              x2={`${50 + 42 * Math.cos((complementaryHue - 90) * Math.PI / 180)}%`}
              y2={`${50 + 42 * Math.sin((complementaryHue - 90) * Math.PI / 180)}%`}
              stroke="white"
              strokeWidth="2"
              strokeDasharray="4"
            />
          </svg>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.complementaryColorFinder.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.complementaryColorFinder.aboutText')}
        </p>
      </div>
    </div>
  )
}
