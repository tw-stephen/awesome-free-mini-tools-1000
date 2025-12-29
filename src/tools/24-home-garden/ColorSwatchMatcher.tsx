import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SavedColor {
  id: number
  hex: string
  name: string
  room?: string
}

export default function ColorSwatchMatcher() {
  const { t } = useTranslation()
  const [baseColor, setBaseColor] = useState('#4a90d9')
  const [savedColors, setSavedColors] = useState<SavedColor[]>([])
  const [colorName, setColorName] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [harmonyType, setHarmonyType] = useState('complementary')

  const rooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Dining Room']

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
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
    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  const hslToHex = (h: number, s: number, l: number) => {
    h = ((h % 360) + 360) % 360
    s = Math.max(0, Math.min(100, s)) / 100
    l = Math.max(0, Math.min(100, l)) / 100

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

    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const getHarmonyColors = () => {
    const { h, s, l } = hexToHsl(baseColor)
    switch (harmonyType) {
      case 'complementary':
        return [baseColor, hslToHex(h + 180, s, l)]
      case 'triadic':
        return [baseColor, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)]
      case 'analogous':
        return [hslToHex(h - 30, s, l), baseColor, hslToHex(h + 30, s, l)]
      case 'splitComplementary':
        return [baseColor, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)]
      case 'tetradic':
        return [baseColor, hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l)]
      case 'monochromatic':
        return [hslToHex(h, s, l - 20), baseColor, hslToHex(h, s, l + 20), hslToHex(h, s - 20, l)]
      default:
        return [baseColor]
    }
  }

  const getTints = () => {
    const { h, s, l } = hexToHsl(baseColor)
    return [90, 80, 70, 60, 50].map(lightness => hslToHex(h, s, lightness))
  }

  const getShades = () => {
    const { h, s, l } = hexToHsl(baseColor)
    return [40, 30, 20, 15, 10].map(lightness => hslToHex(h, s, lightness))
  }

  const saveColor = () => {
    if (!colorName) return
    setSavedColors([...savedColors, {
      id: Date.now(),
      hex: baseColor,
      name: colorName,
      room: selectedRoom || undefined,
    }])
    setColorName('')
  }

  const deleteColor = (id: number) => {
    setSavedColors(savedColors.filter(c => c.id !== id))
  }

  const harmonyColors = getHarmonyColors()
  const tints = getTints()
  const shades = getShades()

  const harmonyTypes = [
    { id: 'complementary', label: t('tools.colorSwatchMatcher.complementary') },
    { id: 'triadic', label: t('tools.colorSwatchMatcher.triadic') },
    { id: 'analogous', label: t('tools.colorSwatchMatcher.analogous') },
    { id: 'splitComplementary', label: t('tools.colorSwatchMatcher.splitComplementary') },
    { id: 'tetradic', label: t('tools.colorSwatchMatcher.tetradic') },
    { id: 'monochromatic', label: t('tools.colorSwatchMatcher.monochromatic') },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.colorSwatchMatcher.selectColor')}</h3>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-16 h-16 rounded cursor-pointer"
          />
          <div>
            <input
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded font-mono"
              placeholder="#000000"
            />
            <div className="text-sm text-slate-500 mt-1">
              HSL: {Math.round(hexToHsl(baseColor).h)}, {Math.round(hexToHsl(baseColor).s)}%, {Math.round(hexToHsl(baseColor).l)}%
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.colorSwatchMatcher.colorHarmony')}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {harmonyTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setHarmonyType(type.id)}
              className={`px-2 py-1 rounded text-xs ${
                harmonyType === type.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {harmonyColors.map((color, i) => (
            <div key={i} className="flex-1">
              <div
                className="h-16 rounded border border-slate-200"
                style={{ backgroundColor: color }}
              />
              <div className="text-xs text-center mt-1 font-mono">{color}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.colorSwatchMatcher.tints')}</h3>
        <div className="flex gap-1">
          {tints.map((color, i) => (
            <div key={i} className="flex-1">
              <div
                className="h-12 rounded border border-slate-200 cursor-pointer hover:ring-2 ring-blue-400"
                style={{ backgroundColor: color }}
                onClick={() => setBaseColor(color)}
              />
              <div className="text-xs text-center mt-1 font-mono text-slate-500">{color}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.colorSwatchMatcher.shades')}</h3>
        <div className="flex gap-1">
          {shades.map((color, i) => (
            <div key={i} className="flex-1">
              <div
                className="h-12 rounded border border-slate-200 cursor-pointer hover:ring-2 ring-blue-400"
                style={{ backgroundColor: color }}
                onClick={() => setBaseColor(color)}
              />
              <div className="text-xs text-center mt-1 font-mono text-slate-500">{color}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.colorSwatchMatcher.saveColor')}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
            placeholder={t('tools.colorSwatchMatcher.colorName')}
          />
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            <option value="">{t('tools.colorSwatchMatcher.selectRoom')}</option>
            {rooms.map(room => (
              <option key={room} value={room}>{room}</option>
            ))}
          </select>
          <button
            onClick={saveColor}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.colorSwatchMatcher.save')}
          </button>
        </div>
      </div>

      {savedColors.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.colorSwatchMatcher.savedColors')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {savedColors.map(color => (
              <div key={color.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                <div
                  className="w-10 h-10 rounded border border-slate-200"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{color.name}</div>
                  <div className="text-xs text-slate-500">{color.hex} {color.room && `- ${color.room}`}</div>
                </div>
                <button
                  onClick={() => deleteColor(color.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.colorSwatchMatcher.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.colorSwatchMatcher.tip1')}</li>
          <li>{t('tools.colorSwatchMatcher.tip2')}</li>
          <li>{t('tools.colorSwatchMatcher.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
