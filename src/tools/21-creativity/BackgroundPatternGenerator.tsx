import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type PatternType = 'dots' | 'grid' | 'diagonal' | 'zigzag' | 'hexagons' | 'waves' | 'checkerboard' | 'crosses'

export default function BackgroundPatternGenerator() {
  const { t } = useTranslation()
  const [pattern, setPattern] = useState<PatternType>('dots')
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(20)
  const [opacity, setOpacity] = useState(100)

  const patterns: PatternType[] = ['dots', 'grid', 'diagonal', 'zigzag', 'hexagons', 'waves', 'checkerboard', 'crosses']

  const generatePatternCSS = (): string => {
    const colorWithOpacity = primaryColor + Math.round(opacity * 2.55).toString(16).padStart(2, '0')

    switch (pattern) {
      case 'dots':
        return `background-color: ${bgColor};
background-image: radial-gradient(${colorWithOpacity} 1px, transparent 1px);
background-size: ${size}px ${size}px;`

      case 'grid':
        return `background-color: ${bgColor};
background-image:
  linear-gradient(${colorWithOpacity} 1px, transparent 1px),
  linear-gradient(90deg, ${colorWithOpacity} 1px, transparent 1px);
background-size: ${size}px ${size}px;`

      case 'diagonal':
        return `background-color: ${bgColor};
background-image: repeating-linear-gradient(
  45deg,
  ${colorWithOpacity},
  ${colorWithOpacity} 1px,
  transparent 1px,
  transparent ${size}px
);`

      case 'zigzag':
        return `background-color: ${bgColor};
background-image:
  linear-gradient(135deg, ${colorWithOpacity} 25%, transparent 25%),
  linear-gradient(225deg, ${colorWithOpacity} 25%, transparent 25%),
  linear-gradient(45deg, ${colorWithOpacity} 25%, transparent 25%),
  linear-gradient(315deg, ${colorWithOpacity} 25%, transparent 25%);
background-size: ${size}px ${size}px;
background-position: 0 0, ${size / 2}px 0, ${size / 2}px -${size / 2}px, 0 ${size / 2}px;`

      case 'hexagons':
        return `background-color: ${bgColor};
background-image:
  radial-gradient(circle farthest-side at 0% 50%, ${bgColor} 23.5%, transparent 0) ${size * 1.05}px ${size * 3}px,
  radial-gradient(circle farthest-side at 0% 50%, ${colorWithOpacity} 24%, transparent 0) ${size * 1.08}px ${size * 3}px,
  linear-gradient(${bgColor} 14%, transparent 0, transparent 85%, ${bgColor} 0) 0 0,
  linear-gradient(150deg, ${bgColor} 24%, ${colorWithOpacity} 0, ${colorWithOpacity} 26%, transparent 0, transparent 74%, ${colorWithOpacity} 0, ${colorWithOpacity} 76%, ${bgColor} 0) 0 0,
  linear-gradient(30deg, ${bgColor} 24%, ${colorWithOpacity} 0, ${colorWithOpacity} 26%, transparent 0, transparent 74%, ${colorWithOpacity} 0, ${colorWithOpacity} 76%, ${bgColor} 0) 0 0,
  linear-gradient(90deg, ${colorWithOpacity} 2%, ${bgColor} 0, ${bgColor} 98%, ${colorWithOpacity} 0%) 0 0;
background-size: ${size * 2.1}px ${size * 3}px;`

      case 'waves':
        return `background-color: ${bgColor};
background-image:
  radial-gradient(circle at 100% 50%, transparent 20%, ${colorWithOpacity} 21%, ${colorWithOpacity} 34%, transparent 35%, transparent),
  radial-gradient(circle at 0% 50%, transparent 20%, ${colorWithOpacity} 21%, ${colorWithOpacity} 34%, transparent 35%, transparent);
background-size: ${size * 3}px ${size * 2}px;`

      case 'checkerboard':
        return `background-color: ${bgColor};
background-image:
  linear-gradient(45deg, ${colorWithOpacity} 25%, transparent 25%),
  linear-gradient(-45deg, ${colorWithOpacity} 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, ${colorWithOpacity} 75%),
  linear-gradient(-45deg, transparent 75%, ${colorWithOpacity} 75%);
background-size: ${size}px ${size}px;
background-position: 0 0, 0 ${size / 2}px, ${size / 2}px -${size / 2}px, -${size / 2}px 0;`

      case 'crosses':
        return `background-color: ${bgColor};
background-image:
  linear-gradient(${colorWithOpacity} 2px, transparent 2px),
  linear-gradient(90deg, ${colorWithOpacity} 2px, transparent 2px),
  linear-gradient(${colorWithOpacity} 1px, transparent 1px),
  linear-gradient(90deg, ${colorWithOpacity} 1px, transparent 1px);
background-size: ${size * 5}px ${size * 5}px, ${size * 5}px ${size * 5}px, ${size}px ${size}px, ${size}px ${size}px;
background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;`

      default:
        return `background-color: ${bgColor};`
    }
  }

  const getInlineStyles = (): React.CSSProperties => {
    const colorWithOpacity = primaryColor + Math.round(opacity * 2.55).toString(16).padStart(2, '0')

    switch (pattern) {
      case 'dots':
        return {
          backgroundColor: bgColor,
          backgroundImage: `radial-gradient(${colorWithOpacity} 1px, transparent 1px)`,
          backgroundSize: `${size}px ${size}px`,
        }
      case 'grid':
        return {
          backgroundColor: bgColor,
          backgroundImage: `linear-gradient(${colorWithOpacity} 1px, transparent 1px), linear-gradient(90deg, ${colorWithOpacity} 1px, transparent 1px)`,
          backgroundSize: `${size}px ${size}px`,
        }
      case 'diagonal':
        return {
          backgroundColor: bgColor,
          backgroundImage: `repeating-linear-gradient(45deg, ${colorWithOpacity}, ${colorWithOpacity} 1px, transparent 1px, transparent ${size}px)`,
        }
      case 'zigzag':
        return {
          backgroundColor: bgColor,
          backgroundImage: `linear-gradient(135deg, ${colorWithOpacity} 25%, transparent 25%), linear-gradient(225deg, ${colorWithOpacity} 25%, transparent 25%), linear-gradient(45deg, ${colorWithOpacity} 25%, transparent 25%), linear-gradient(315deg, ${colorWithOpacity} 25%, transparent 25%)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundPosition: `0 0, ${size / 2}px 0, ${size / 2}px -${size / 2}px, 0 ${size / 2}px`,
        }
      case 'checkerboard':
        return {
          backgroundColor: bgColor,
          backgroundImage: `linear-gradient(45deg, ${colorWithOpacity} 25%, transparent 25%), linear-gradient(-45deg, ${colorWithOpacity} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${colorWithOpacity} 75%), linear-gradient(-45deg, transparent 75%, ${colorWithOpacity} 75%)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundPosition: `0 0, 0 ${size / 2}px, ${size / 2}px -${size / 2}px, -${size / 2}px 0`,
        }
      case 'waves':
        return {
          backgroundColor: bgColor,
          backgroundImage: `radial-gradient(circle at 100% 50%, transparent 20%, ${colorWithOpacity} 21%, ${colorWithOpacity} 34%, transparent 35%, transparent), radial-gradient(circle at 0% 50%, transparent 20%, ${colorWithOpacity} 21%, ${colorWithOpacity} 34%, transparent 35%, transparent)`,
          backgroundSize: `${size * 3}px ${size * 2}px`,
        }
      case 'crosses':
        return {
          backgroundColor: bgColor,
          backgroundImage: `linear-gradient(${colorWithOpacity} 2px, transparent 2px), linear-gradient(90deg, ${colorWithOpacity} 2px, transparent 2px)`,
          backgroundSize: `${size}px ${size}px`,
        }
      case 'hexagons':
        return {
          backgroundColor: bgColor,
          backgroundImage: `radial-gradient(${colorWithOpacity} 1px, transparent 1px)`,
          backgroundSize: `${size}px ${size}px`,
        }
      default:
        return { backgroundColor: bgColor }
    }
  }

  const presets = [
    { name: 'Blueprint', pattern: 'grid' as PatternType, primary: '#1e40af', bg: '#1e3a5f', size: 20, opacity: 30 },
    { name: 'Paper', pattern: 'dots' as PatternType, primary: '#9ca3af', bg: '#ffffff', size: 16, opacity: 50 },
    { name: 'Retro', pattern: 'zigzag' as PatternType, primary: '#f59e0b', bg: '#fef3c7', size: 20, opacity: 60 },
    { name: 'Minimal', pattern: 'diagonal' as PatternType, primary: '#d1d5db', bg: '#f9fafb', size: 10, opacity: 40 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {patterns.map((p) => (
          <button
            key={p}
            onClick={() => setPattern(p)}
            className={`px-4 py-2 rounded capitalize ${
              pattern === p ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => {
              setPattern(preset.pattern)
              setPrimaryColor(preset.primary)
              setBgColor(preset.bg)
              setSize(preset.size)
              setOpacity(preset.opacity)
            }}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div
        className="h-64 rounded-lg border"
        style={getInlineStyles()}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.backgroundPatternGenerator.patternColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 px-2 py-1 border rounded font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.backgroundPatternGenerator.bgColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 px-2 py-1 border rounded font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('tools.backgroundPatternGenerator.size')}: {size}px
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('tools.backgroundPatternGenerator.opacity')}: {opacity}%
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.backgroundPatternGenerator.allPatterns')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {patterns.map((p) => {
            const tempStyles = (() => {
              const colorWithOpacity = primaryColor + Math.round(opacity * 2.55).toString(16).padStart(2, '0')
              switch (p) {
                case 'dots':
                  return { backgroundColor: bgColor, backgroundImage: `radial-gradient(${colorWithOpacity} 1px, transparent 1px)`, backgroundSize: `${size / 2}px ${size / 2}px` }
                case 'grid':
                  return { backgroundColor: bgColor, backgroundImage: `linear-gradient(${colorWithOpacity} 1px, transparent 1px), linear-gradient(90deg, ${colorWithOpacity} 1px, transparent 1px)`, backgroundSize: `${size / 2}px ${size / 2}px` }
                case 'diagonal':
                  return { backgroundColor: bgColor, backgroundImage: `repeating-linear-gradient(45deg, ${colorWithOpacity}, ${colorWithOpacity} 1px, transparent 1px, transparent ${size / 2}px)` }
                case 'checkerboard':
                  return { backgroundColor: bgColor, backgroundImage: `linear-gradient(45deg, ${colorWithOpacity} 25%, transparent 25%), linear-gradient(-45deg, ${colorWithOpacity} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${colorWithOpacity} 75%), linear-gradient(-45deg, transparent 75%, ${colorWithOpacity} 75%)`, backgroundSize: `${size / 2}px ${size / 2}px` }
                default:
                  return { backgroundColor: bgColor }
              }
            })()

            return (
              <button
                key={p}
                onClick={() => setPattern(p)}
                className={`aspect-square rounded overflow-hidden ${pattern === p ? 'ring-2 ring-blue-500' : ''}`}
                style={tempStyles}
              >
                <span className="sr-only">{p}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">CSS Code</h3>
          <button
            onClick={() => navigator.clipboard.writeText(generatePatternCSS())}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.copy')}
          </button>
        </div>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
          {generatePatternCSS()}
        </pre>
      </div>
    </div>
  )
}
