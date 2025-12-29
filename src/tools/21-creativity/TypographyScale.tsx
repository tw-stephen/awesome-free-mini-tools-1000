import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function TypographyScale() {
  const { t } = useTranslation()
  const [baseSize, setBaseSize] = useState(16)
  const [scale, setScale] = useState(1.25)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [fontFamily, setFontFamily] = useState('Inter')

  const scales: { name: string; value: number }[] = [
    { name: 'Minor Second', value: 1.067 },
    { name: 'Major Second', value: 1.125 },
    { name: 'Minor Third', value: 1.2 },
    { name: 'Major Third', value: 1.25 },
    { name: 'Perfect Fourth', value: 1.333 },
    { name: 'Augmented Fourth', value: 1.414 },
    { name: 'Perfect Fifth', value: 1.5 },
    { name: 'Golden Ratio', value: 1.618 },
  ]

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
    'Georgia', 'Times New Roman', 'Merriweather', 'Playfair Display',
  ]

  const generateSizes = (): { name: string; size: number; lineHeight: number }[] => {
    const sizes = []
    const names = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']

    for (let i = -2; i <= 6; i++) {
      const size = baseSize * Math.pow(scale, i)
      sizes.push({
        name: names[i + 2] || `${i + 3}xl`,
        size: Math.round(size * 100) / 100,
        lineHeight: Math.round(size * lineHeight * 100) / 100,
      })
    }

    return sizes
  }

  const typeSizes = generateSizes()

  const generateCSS = (): string => {
    let css = `:root {\n  --font-family: '${fontFamily}', sans-serif;\n  --line-height: ${lineHeight};\n\n`

    typeSizes.forEach((size) => {
      css += `  --text-${size.name}: ${size.size}px;\n`
    })

    css += `}\n\n`

    typeSizes.forEach((size) => {
      css += `.text-${size.name} {\n  font-size: var(--text-${size.name});\n  line-height: ${lineHeight};\n}\n\n`
    })

    return css
  }

  const generateTailwindConfig = (): string => {
    const config: Record<string, string> = {}
    typeSizes.forEach((size) => {
      config[size.name] = `${size.size}px`
    })

    return `// tailwind.config.js
module.exports = {
  theme: {
    fontSize: ${JSON.stringify(config, null, 6).replace(/"/g, "'")}
  }
}`
  }

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS())
  }

  const copyTailwind = () => {
    navigator.clipboard.writeText(generateTailwindConfig())
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('tools.typographyScale.baseSize')}: {baseSize}px
          </label>
          <input
            type="range"
            min="12"
            max="24"
            value={baseSize}
            onChange={(e) => setBaseSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.typographyScale.scale')}</label>
          <select
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          >
            {scales.map((s) => (
              <option key={s.name} value={s.value}>
                {s.name} ({s.value})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('tools.typographyScale.lineHeight')}: {lineHeight}
          </label>
          <input
            type="range"
            min="1"
            max="2"
            step="0.1"
            value={lineHeight}
            onChange={(e) => setLineHeight(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.typographyScale.font')}</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card p-6">
        <link
          href={`https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;600;700&display=swap`}
          rel="stylesheet"
        />

        <div className="space-y-4">
          {typeSizes.slice().reverse().map((size) => (
            <div
              key={size.name}
              className="flex items-baseline gap-4 pb-2 border-b border-gray-100"
            >
              <span className="w-12 text-sm text-gray-500 shrink-0">{size.name}</span>
              <span className="w-16 text-sm text-gray-400 shrink-0">{size.size}px</span>
              <span
                className="truncate"
                style={{
                  fontFamily: `'${fontFamily}', sans-serif`,
                  fontSize: size.size,
                  lineHeight: lineHeight,
                }}
              >
                The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.typographyScale.scaleVisualization')}</h3>
        <div className="flex items-end gap-1 h-32">
          {typeSizes.map((size) => (
            <div
              key={size.name}
              className="bg-blue-500 rounded-t transition-all hover:bg-blue-600"
              style={{
                width: 32,
                height: `${(size.size / typeSizes[typeSizes.length - 1].size) * 100}%`,
              }}
              title={`${size.name}: ${size.size}px`}
            />
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          {typeSizes.map((size) => (
            <div key={size.name} className="w-8 text-xs text-center text-gray-500">
              {size.name}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">CSS Variables</h3>
            <button
              onClick={copyCSS}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('common.copy')}
            </button>
          </div>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-48">
            {generateCSS()}
          </pre>
        </div>

        <div className="card p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Tailwind Config</h3>
            <button
              onClick={copyTailwind}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('common.copy')}
            </button>
          </div>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-48">
            {generateTailwindConfig()}
          </pre>
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium text-blue-800 mb-2">{t('tools.typographyScale.tips')}</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>Major Third (1.25) is great for most web projects</li>
          <li>Perfect Fourth (1.333) works well for text-heavy sites</li>
          <li>Golden Ratio (1.618) creates dramatic contrast</li>
          <li>Base size of 16px is standard for body text</li>
        </ul>
      </div>
    </div>
  )
}
