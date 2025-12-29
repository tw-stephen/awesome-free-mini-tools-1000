import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ColorWheelTool() {
  const { t } = useTranslation()
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [lightness, setLightness] = useState(50)

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

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)))
    }
    return { r: f(0), g: f(8), b: f(4) }
  }

  const currentColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  const hex = hslToHex(hue, saturation, lightness)
  const rgb = hslToRgb(hue, saturation, lightness)

  // Generate color wheel colors
  const wheelColors = Array.from({ length: 12 }, (_, i) => {
    const h = i * 30
    return {
      hue: h,
      color: `hsl(${h}, ${saturation}%, ${lightness}%)`
    }
  })

  // Generate complementary color
  const complementaryHue = (hue + 180) % 360
  const complementary = `hsl(${complementaryHue}, ${saturation}%, ${lightness}%)`
  const complementaryHex = hslToHex(complementaryHue, saturation, lightness)

  // Generate triadic colors
  const triadicHue1 = (hue + 120) % 360
  const triadicHue2 = (hue + 240) % 360
  const triadic = [
    { hue: hue, color: currentColor, hex },
    { hue: triadicHue1, color: `hsl(${triadicHue1}, ${saturation}%, ${lightness}%)`, hex: hslToHex(triadicHue1, saturation, lightness) },
    { hue: triadicHue2, color: `hsl(${triadicHue2}, ${saturation}%, ${lightness}%)`, hex: hslToHex(triadicHue2, saturation, lightness) }
  ]

  // Generate analogous colors
  const analogous = [
    { hue: (hue - 30 + 360) % 360, color: `hsl(${(hue - 30 + 360) % 360}, ${saturation}%, ${lightness}%)` },
    { hue: hue, color: currentColor },
    { hue: (hue + 30) % 360, color: `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness}%)` }
  ]

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        {/* Color wheel */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                hsl(0, ${saturation}%, ${lightness}%),
                hsl(30, ${saturation}%, ${lightness}%),
                hsl(60, ${saturation}%, ${lightness}%),
                hsl(90, ${saturation}%, ${lightness}%),
                hsl(120, ${saturation}%, ${lightness}%),
                hsl(150, ${saturation}%, ${lightness}%),
                hsl(180, ${saturation}%, ${lightness}%),
                hsl(210, ${saturation}%, ${lightness}%),
                hsl(240, ${saturation}%, ${lightness}%),
                hsl(270, ${saturation}%, ${lightness}%),
                hsl(300, ${saturation}%, ${lightness}%),
                hsl(330, ${saturation}%, ${lightness}%),
                hsl(360, ${saturation}%, ${lightness}%)
              )`
            }}
          />
          <div
            className="absolute inset-8 rounded-full shadow-inner"
            style={{ backgroundColor: currentColor }}
          />
          {/* Selector */}
          <div
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${50 + 42 * Math.cos((hue - 90) * Math.PI / 180)}%`,
              top: `${50 + 42 * Math.sin((hue - 90) * Math.PI / 180)}%`,
              backgroundColor: currentColor
            }}
          />
        </div>

        {/* Hue slider */}
        <div className="mb-4">
          <label className="text-sm text-slate-500 block mb-1">
            {t('tools.colorWheelTool.hue')}: {hue}
          </label>
          <input
            type="range"
            min="0"
            max="359"
            value={hue}
            onChange={(e) => setHue(parseInt(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right,
                hsl(0, ${saturation}%, ${lightness}%),
                hsl(60, ${saturation}%, ${lightness}%),
                hsl(120, ${saturation}%, ${lightness}%),
                hsl(180, ${saturation}%, ${lightness}%),
                hsl(240, ${saturation}%, ${lightness}%),
                hsl(300, ${saturation}%, ${lightness}%),
                hsl(360, ${saturation}%, ${lightness}%)
              )`
            }}
          />
        </div>

        {/* Saturation slider */}
        <div className="mb-4">
          <label className="text-sm text-slate-500 block mb-1">
            {t('tools.colorWheelTool.saturation')}: {saturation}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={saturation}
            onChange={(e) => setSaturation(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Lightness slider */}
        <div className="mb-4">
          <label className="text-sm text-slate-500 block mb-1">
            {t('tools.colorWheelTool.lightness')}: {lightness}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={lightness}
            onChange={(e) => setLightness(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Selected color */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorWheelTool.selectedColor')}</h3>
        <div className="flex gap-4">
          <div
            className="w-24 h-24 rounded-lg shadow-inner"
            style={{ backgroundColor: currentColor }}
          />
          <div className="flex-1 space-y-2">
            <button
              onClick={() => copyColor(hex)}
              className="w-full text-left px-3 py-2 bg-slate-100 rounded font-mono text-sm hover:bg-slate-200"
            >
              {hex}
            </button>
            <button
              onClick={() => copyColor(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
              className="w-full text-left px-3 py-2 bg-slate-100 rounded font-mono text-sm hover:bg-slate-200"
            >
              rgb({rgb.r}, {rgb.g}, {rgb.b})
            </button>
            <button
              onClick={() => copyColor(`hsl(${hue}, ${saturation}%, ${lightness}%)`)}
              className="w-full text-left px-3 py-2 bg-slate-100 rounded font-mono text-sm hover:bg-slate-200"
            >
              hsl({hue}, {saturation}%, {lightness}%)
            </button>
          </div>
        </div>
      </div>

      {/* Color harmonies */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorWheelTool.complementary')}</h3>
        <div className="flex gap-2">
          <div
            className="flex-1 h-16 rounded cursor-pointer"
            style={{ backgroundColor: currentColor }}
            onClick={() => copyColor(hex)}
          />
          <div
            className="flex-1 h-16 rounded cursor-pointer"
            style={{ backgroundColor: complementary }}
            onClick={() => copyColor(complementaryHex)}
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorWheelTool.triadic')}</h3>
        <div className="flex gap-2">
          {triadic.map((c, i) => (
            <div
              key={i}
              className="flex-1 h-16 rounded cursor-pointer"
              style={{ backgroundColor: c.color }}
              onClick={() => copyColor(c.hex)}
            />
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorWheelTool.analogous')}</h3>
        <div className="flex gap-2">
          {analogous.map((c, i) => (
            <div
              key={i}
              className="flex-1 h-16 rounded cursor-pointer"
              style={{ backgroundColor: c.color }}
              onClick={() => copyColor(hslToHex(c.hue, saturation, lightness))}
            />
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.colorWheelTool.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.colorWheelTool.aboutText')}
        </p>
      </div>
    </div>
  )
}
