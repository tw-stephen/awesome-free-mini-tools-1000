import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SpacingCalculator() {
  const { t } = useTranslation()
  const [baseUnit, setBaseUnit] = useState(8)
  const [scaleFactor, setScaleFactor] = useState<'linear' | 'exponential'>('linear')

  const generateSpacingScale = (): { name: string; value: number; px: string; rem: string }[] => {
    const scale = []

    if (scaleFactor === 'linear') {
      const multipliers = [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24]
      const names = ['0.5', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48']

      multipliers.forEach((mult, i) => {
        const value = baseUnit * mult
        scale.push({
          name: names[i],
          value,
          px: `${value}px`,
          rem: `${value / 16}rem`,
        })
      })
    } else {
      const names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      for (let i = 0; i < 10; i++) {
        const value = Math.round(baseUnit * Math.pow(1.5, i))
        scale.push({
          name: names[i],
          value,
          px: `${value}px`,
          rem: `${(value / 16).toFixed(3)}rem`,
        })
      }
    }

    return scale
  }

  const spacingScale = generateSpacingScale()

  const generateCSS = (): string => {
    let css = `:root {\n  --spacing-unit: ${baseUnit}px;\n\n`
    spacingScale.forEach((space) => {
      css += `  --space-${space.name}: ${space.px};\n`
    })
    css += `}\n`
    return css
  }

  const generateTailwindConfig = (): string => {
    const config: Record<string, string> = {}
    spacingScale.forEach((space) => {
      config[space.name] = space.rem
    })

    return `// tailwind.config.js
module.exports = {
  theme: {
    spacing: ${JSON.stringify(config, null, 6).replace(/"/g, "'")}
  }
}`
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('tools.spacingCalculator.baseUnit')}: {baseUnit}px
          </label>
          <input
            type="range"
            min="4"
            max="16"
            value={baseUnit}
            onChange={(e) => setBaseUnit(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4px</span>
            <span>8px</span>
            <span>16px</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.spacingCalculator.scaleType')}</label>
          <div className="flex gap-2">
            <button
              onClick={() => setScaleFactor('linear')}
              className={`flex-1 py-2 rounded ${
                scaleFactor === 'linear' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {t('tools.spacingCalculator.linear')}
            </button>
            <button
              onClick={() => setScaleFactor('exponential')}
              className={`flex-1 py-2 rounded ${
                scaleFactor === 'exponential' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {t('tools.spacingCalculator.exponential')}
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-4">{t('tools.spacingCalculator.preview')}</h3>
        <div className="space-y-2">
          {spacingScale.map((space) => (
            <div key={space.name} className="flex items-center gap-4">
              <span className="w-12 text-sm text-gray-500 font-mono">{space.name}</span>
              <div
                className="bg-blue-500 h-6 rounded transition-all"
                style={{ width: Math.min(space.value, 400) }}
              />
              <span className="text-sm text-gray-600">{space.px}</span>
              <span className="text-sm text-gray-400">{space.rem}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-4">{t('tools.spacingCalculator.boxDemo')}</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {spacingScale.slice(0, 8).map((space) => (
            <div key={space.name} className="text-center">
              <div
                className="bg-blue-100 border-2 border-blue-500 border-dashed"
                style={{ width: space.value * 2 + 40, height: space.value * 2 + 40 }}
              >
                <div
                  className="bg-blue-500 w-full h-full"
                  style={{ margin: space.value }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                p-{space.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-4">{t('tools.spacingCalculator.gapDemo')}</h3>
        <div className="space-y-4">
          {[spacingScale[2], spacingScale[4], spacingScale[6]].map((space) => (
            <div key={space.name}>
              <span className="text-sm text-gray-500 mb-2 block">gap-{space.name} ({space.px})</span>
              <div className="flex" style={{ gap: space.value }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-12 h-12 bg-blue-500 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">CSS Variables</h3>
            <button
              onClick={() => navigator.clipboard.writeText(generateCSS())}
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
              onClick={() => navigator.clipboard.writeText(generateTailwindConfig())}
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
        <h4 className="font-medium text-blue-800 mb-2">{t('tools.spacingCalculator.tips')}</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>8px base unit is the most common choice (8-point grid)</li>
          <li>Linear scale gives predictable, easy-to-remember values</li>
          <li>Exponential scale provides more dramatic spacing differences</li>
          <li>Consistent spacing creates visual rhythm in your designs</li>
        </ul>
      </div>
    </div>
  )
}
