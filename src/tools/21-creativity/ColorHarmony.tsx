import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic'

export default function ColorHarmony() {
  const { t } = useTranslation()
  const [baseColor, setBaseColor] = useState('#3b82f6')
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('complementary')

  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return { h: 0, s: 0, l: 0 }

    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255

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

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360
    s = Math.max(0, Math.min(100, s)) / 100
    l = Math.max(0, Math.min(100, l)) / 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

    let r = 0, g = 0, b = 0
    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }

    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const generateHarmony = (): string[] => {
    const hsl = hexToHsl(baseColor)
    const colors: string[] = [baseColor]

    switch (harmonyType) {
      case 'complementary':
        colors.push(hslToHex(hsl.h + 180, hsl.s, hsl.l))
        break

      case 'analogous':
        colors.push(hslToHex(hsl.h - 30, hsl.s, hsl.l))
        colors.push(hslToHex(hsl.h + 30, hsl.s, hsl.l))
        break

      case 'triadic':
        colors.push(hslToHex(hsl.h + 120, hsl.s, hsl.l))
        colors.push(hslToHex(hsl.h + 240, hsl.s, hsl.l))
        break

      case 'split-complementary':
        colors.push(hslToHex(hsl.h + 150, hsl.s, hsl.l))
        colors.push(hslToHex(hsl.h + 210, hsl.s, hsl.l))
        break

      case 'tetradic':
        colors.push(hslToHex(hsl.h + 90, hsl.s, hsl.l))
        colors.push(hslToHex(hsl.h + 180, hsl.s, hsl.l))
        colors.push(hslToHex(hsl.h + 270, hsl.s, hsl.l))
        break

      case 'monochromatic':
        colors.push(hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 10)))
        colors.push(hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 90)))
        colors.push(hslToHex(hsl.h, Math.max(hsl.s - 30, 10), hsl.l))
        colors.push(hslToHex(hsl.h, Math.min(hsl.s + 20, 100), hsl.l))
        break
    }

    return colors
  }

  const harmonyColors = generateHarmony()

  const harmonyTypes: HarmonyType[] = [
    'complementary',
    'analogous',
    'triadic',
    'split-complementary',
    'tetradic',
    'monochromatic',
  ]

  const getHarmonyDescription = (type: HarmonyType): string => {
    const descriptions: Record<HarmonyType, string> = {
      complementary: 'Two colors opposite on the color wheel. High contrast and vibrant.',
      analogous: 'Three colors adjacent on the color wheel. Harmonious and pleasing.',
      triadic: 'Three colors equally spaced on the color wheel. Balanced and vibrant.',
      'split-complementary': 'Base color plus two adjacent to its complement. Less tension than complementary.',
      tetradic: 'Four colors forming a rectangle on the wheel. Rich and varied.',
      monochromatic: 'Variations of a single hue. Elegant and cohesive.',
    }
    return descriptions[type]
  }

  const copyPalette = () => {
    navigator.clipboard.writeText(harmonyColors.join(', '))
  }

  const generateCSS = (): string => {
    return harmonyColors.map((color, i) => `--color-${i + 1}: ${color};`).join('\n')
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-start">
        <div className="space-y-2">
          <label className="block text-sm font-medium">{t('tools.colorHarmony.baseColor')}</label>
          <div className="flex gap-2">
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
              className="w-24 px-3 py-2 border rounded font-mono"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="relative w-48 h-48 mx-auto">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
              }}
            />
            <div className="absolute inset-4 rounded-full bg-white" />
            {harmonyColors.map((color, i) => {
              const hsl = hexToHsl(color)
              const angle = (hsl.h - 90) * (Math.PI / 180)
              const radius = 70
              const x = 96 + Math.cos(angle) * radius
              const y = 96 + Math.sin(angle) * radius
              return (
                <div
                  key={i}
                  className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: x,
                    top: y,
                    backgroundColor: color,
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">{t('tools.colorHarmony.harmonyType')}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {harmonyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setHarmonyType(type)}
              className={`px-3 py-2 rounded text-sm capitalize ${
                harmonyType === type ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {t(`tools.colorHarmony.${type}`)}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500">{getHarmonyDescription(harmonyType)}</p>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.colorHarmony.palette')}</h3>
        <div className="flex gap-2">
          {harmonyColors.map((color, i) => (
            <button
              key={i}
              onClick={() => navigator.clipboard.writeText(color)}
              className="flex-1 group"
            >
              <div
                className="h-24 rounded-t-lg group-hover:ring-2 ring-blue-500 transition"
                style={{ backgroundColor: color }}
              />
              <div className="bg-gray-100 rounded-b-lg py-2 text-center text-sm font-mono">
                {color.toUpperCase()}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.colorHarmony.cssVariables')}</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          :root {'{\n'}
          {generateCSS()}
          {'\n}'}
        </pre>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyPalette}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('common.copy')} {t('tools.colorHarmony.palette')}
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(`:root {\n${generateCSS()}\n}`)}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t('common.copy')} CSS
        </button>
      </div>
    </div>
  )
}
