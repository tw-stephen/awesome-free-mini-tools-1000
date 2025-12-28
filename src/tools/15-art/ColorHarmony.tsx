import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ColorHarmony() {
  const { t } = useTranslation()
  const [baseColor, setBaseColor] = useState('#3B82F6')
  const [harmonyType, setHarmonyType] = useState<'complementary' | 'triadic' | 'tetradic' | 'analogous' | 'split'>('complementary')

  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return { h: 0, s: 0, l: 0 }

    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255

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

  const hslToHex = (h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l - c / 2

    let r = 0, g = 0, b = 0

    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }

    return '#' + [r + m, g + m, b + m].map(v => {
      const hex = Math.round(v * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const generateHarmony = (): string[] => {
    const hsl = hexToHsl(baseColor)
    const colors: string[] = [baseColor]

    switch (harmonyType) {
      case 'complementary':
        colors.push(hslToHex(hsl.h + 180, hsl.s, hsl.l))
        break
      case 'triadic':
        colors.push(hslToHex(hsl.h + 120, hsl.s, hsl.l))
        colors.push(hslToHex(hsl.h + 240, hsl.s, hsl.l))
        break
      case 'tetradic':
        colors.push(hslToHex(hsl.h + 90, hsl.s, hsl.l))
        colors.push(hslToHex(hsl.h + 180, hsl.s, hsl.l))
        colors.push(hslToHex(hsl.h + 270, hsl.s, hsl.l))
        break
      case 'analogous':
        colors.push(hslToHex(hsl.h + 30, hsl.s, hsl.l))
        colors.push(hslToHex(hsl.h - 30, hsl.s, hsl.l))
        break
      case 'split':
        colors.push(hslToHex(hsl.h + 150, hsl.s, hsl.l))
        colors.push(hslToHex(hsl.h + 210, hsl.s, hsl.l))
        break
    }

    return colors
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
  }

  const harmonies = generateHarmony()

  const harmonyTypes = [
    { id: 'complementary', name: 'Complementary', description: 'Opposite colors on the wheel' },
    { id: 'triadic', name: 'Triadic', description: 'Three colors evenly spaced' },
    { id: 'tetradic', name: 'Tetradic', description: 'Four colors in a rectangle' },
    { id: 'analogous', name: 'Analogous', description: 'Adjacent colors' },
    { id: 'split', name: 'Split Complementary', description: 'Base + two adjacent to complement' },
  ]

  // Draw color wheel
  const renderColorWheel = () => {
    const size = 200
    const center = size / 2
    const radius = 80
    const segments: JSX.Element[] = []

    for (let i = 0; i < 360; i += 10) {
      const color = hslToHex(i, 70, 50)
      const startAngle = (i - 5) * Math.PI / 180
      const endAngle = (i + 5) * Math.PI / 180

      const x1 = center + Math.cos(startAngle) * (radius - 20)
      const y1 = center + Math.sin(startAngle) * (radius - 20)
      const x2 = center + Math.cos(startAngle) * radius
      const y2 = center + Math.sin(startAngle) * radius
      const x3 = center + Math.cos(endAngle) * radius
      const y3 = center + Math.sin(endAngle) * radius
      const x4 = center + Math.cos(endAngle) * (radius - 20)
      const y4 = center + Math.sin(endAngle) * (radius - 20)

      segments.push(
        <path
          key={i}
          d={`M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} Z`}
          fill={color}
        />
      )
    }

    // Add markers for harmony colors
    harmonies.forEach((color, i) => {
      const colorHsl = hexToHsl(color)
      const angle = colorHsl.h * Math.PI / 180 - Math.PI / 2
      const markerX = center + Math.cos(angle) * (radius - 10)
      const markerY = center + Math.sin(angle) * (radius - 10)

      segments.push(
        <circle
          key={`marker-${i}`}
          cx={markerX}
          cy={markerY}
          r={8}
          fill={color}
          stroke="white"
          strokeWidth={2}
        />
      )
    })

    return (
      <svg width={size} height={size} className="mx-auto">
        {segments}
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorHarmony.baseColor')}</h3>
        <div className="flex gap-4 items-center">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-20 h-20 cursor-pointer rounded"
          />
          <input
            type="text"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorHarmony.harmonyType')}</h3>
        <div className="space-y-2">
          {harmonyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setHarmonyType(type.id as any)}
              className={`w-full p-3 rounded-lg text-left ${
                harmonyType === type.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
              }`}
            >
              <div className="font-medium">{type.name}</div>
              <div className="text-sm text-slate-500">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorHarmony.colorWheel')}</h3>
        {renderColorWheel()}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorHarmony.palette')}</h3>
        <div className="flex rounded-lg overflow-hidden h-24 mb-4">
          {harmonies.map((color, i) => (
            <div
              key={i}
              className="flex-1 cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => copyColor(color)}
              title="Click to copy"
            />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {harmonies.map((color, i) => (
            <div key={i} className="text-center">
              <div
                className="w-12 h-12 rounded-lg mx-auto mb-1 cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color)}
              />
              <div className="text-xs font-mono text-slate-600">{color.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
