import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function GridSystemGenerator() {
  const { t } = useTranslation()
  const [columns, setColumns] = useState(12)
  const [gutter, setGutter] = useState(24)
  const [margin, setMargin] = useState(16)
  const [containerWidth, setContainerWidth] = useState(1200)
  const [unit, setUnit] = useState<'px' | '%'>('px')

  const columnWidth = (containerWidth - margin * 2 - gutter * (columns - 1)) / columns

  const generateCSS = (): string => {
    return `.container {
  max-width: ${containerWidth}px;
  margin: 0 auto;
  padding: 0 ${margin}px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -${gutter / 2}px;
}

.col {
  padding: 0 ${gutter / 2}px;
}

${Array.from({ length: columns }, (_, i) => {
  const span = i + 1
  const width = (span / columns * 100).toFixed(4)
  return `.col-${span} {
  width: ${width}%;
}`
}).join('\n\n')}`
  }

  const generateTailwind = (): string => {
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        'gutter': '${gutter}px',
        'margin': '${margin}px',
      },
      maxWidth: {
        'container': '${containerWidth}px',
      }
    }
  }
}`
  }

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS())
  }

  const copyTailwind = () => {
    navigator.clipboard.writeText(generateTailwind())
  }

  const presets = [
    { name: 'Bootstrap', columns: 12, gutter: 30, margin: 15, width: 1140 },
    { name: 'Foundation', columns: 12, gutter: 30, margin: 15, width: 1200 },
    { name: 'Material', columns: 12, gutter: 24, margin: 16, width: 1280 },
    { name: '8-Column', columns: 8, gutter: 20, margin: 20, width: 1024 },
    { name: '16-Column', columns: 16, gutter: 16, margin: 16, width: 1440 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.gridSystemGenerator.columns')}
            </label>
            <input
              type="number"
              min={1}
              max={24}
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value) || 12)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.gridSystemGenerator.gutter')} (px)
            </label>
            <input
              type="number"
              min={0}
              value={gutter}
              onChange={(e) => setGutter(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.gridSystemGenerator.margin')} (px)
            </label>
            <input
              type="number"
              min={0}
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.gridSystemGenerator.containerWidth')} (px)
            </label>
            <input
              type="number"
              min={320}
              value={containerWidth}
              onChange={(e) => setContainerWidth(parseInt(e.target.value) || 1200)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div className="text-sm text-slate-500">
          {t('tools.gridSystemGenerator.columnWidth')}: {columnWidth.toFixed(2)}px
        </div>
      </div>

      {/* Presets */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.gridSystemGenerator.presets')}</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => {
                setColumns(preset.columns)
                setGutter(preset.gutter)
                setMargin(preset.margin)
                setContainerWidth(preset.width)
              }}
              className="px-3 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Preview */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.gridSystemGenerator.preview')}</h3>
        <div
          className="bg-slate-100 rounded overflow-hidden"
          style={{ padding: `${margin}px` }}
        >
          <div
            className="flex"
            style={{ gap: `${gutter}px` }}
          >
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={i}
                className="bg-blue-500 bg-opacity-30 flex items-center justify-center text-xs text-blue-700 font-medium"
                style={{
                  width: `${columnWidth}px`,
                  height: '60px'
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Column Spans */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.gridSystemGenerator.columnSpans')}</h3>
        <div className="space-y-2">
          {[1, 2, 3, 4, 6, columns].filter((n, i, arr) => n <= columns && arr.indexOf(n) === i).map(span => (
            <div key={span} className="flex items-center gap-2">
              <div className="w-20 text-sm text-slate-500">
                col-{span}
              </div>
              <div
                className="h-8 bg-blue-500 bg-opacity-30 rounded"
                style={{ width: `${(span / columns) * 100}%` }}
              />
              <div className="text-sm text-slate-400">
                {(span / columns * 100).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.gridSystemGenerator.cssCode')}</h3>
          <button
            onClick={copyCSS}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            {t('tools.gridSystemGenerator.copy')}
          </button>
        </div>
        <pre className="bg-slate-800 text-slate-100 p-4 rounded text-sm overflow-x-auto max-h-64">
          <code>{generateCSS()}</code>
        </pre>
      </div>

      {/* Tailwind Config */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.gridSystemGenerator.tailwindConfig')}</h3>
          <button
            onClick={copyTailwind}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            {t('tools.gridSystemGenerator.copy')}
          </button>
        </div>
        <pre className="bg-slate-800 text-slate-100 p-4 rounded text-sm overflow-x-auto">
          <code>{generateTailwind()}</code>
        </pre>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.gridSystemGenerator.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.gridSystemGenerator.tip1')}</li>
          <li>* {t('tools.gridSystemGenerator.tip2')}</li>
          <li>* {t('tools.gridSystemGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
