import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function GridGenerator() {
  const { t } = useTranslation()
  const [columns, setColumns] = useState(3)
  const [rows, setRows] = useState(2)
  const [columnGap, setColumnGap] = useState(16)
  const [rowGap, setRowGap] = useState(16)
  const [columnSizing, setColumnSizing] = useState<'equal' | 'auto' | 'custom'>('equal')
  const [customColumns, setCustomColumns] = useState('1fr 2fr 1fr')
  const [itemCount, setItemCount] = useState(6)
  const { copy, copied } = useClipboard()

  const gridTemplateColumns = useMemo(() => {
    switch (columnSizing) {
      case 'equal':
        return `repeat(${columns}, 1fr)`
      case 'auto':
        return `repeat(${columns}, auto)`
      case 'custom':
        return customColumns
      default:
        return `repeat(${columns}, 1fr)`
    }
  }, [columns, columnSizing, customColumns])

  const cssCode = useMemo(() => {
    const lines = [
      'display: grid;',
      `grid-template-columns: ${gridTemplateColumns};`,
      `grid-template-rows: repeat(${rows}, 1fr);`,
      `column-gap: ${columnGap}px;`,
      `row-gap: ${rowGap}px;`
    ]
    return lines.join('\n')
  }, [gridTemplateColumns, rows, columnGap, rowGap])

  const items = Array.from({ length: itemCount }, (_, i) => i + 1)

  return (
    <div className="space-y-4">
      <div className="card p-4 bg-slate-100">
        <div
          className="min-h-[200px] p-4 bg-white rounded-lg border-2 border-dashed border-slate-300"
          style={{
            display: 'grid',
            gridTemplateColumns,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            columnGap: `${columnGap}px`,
            rowGap: `${rowGap}px`
          }}
        >
          {items.map((i) => (
            <div
              key={i}
              className="px-4 py-3 bg-green-500 text-white rounded font-medium text-center flex items-center justify-center min-h-[60px]"
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.gridGenerator.gridProperties')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.gridGenerator.columns')}: {columns}
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.gridGenerator.rows')}: {rows}
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              column-gap: {columnGap}px
            </label>
            <input
              type="range"
              min="0"
              max="32"
              value={columnGap}
              onChange={(e) => setColumnGap(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              row-gap: {rowGap}px
            </label>
            <input
              type="range"
              min="0"
              max="32"
              value={rowGap}
              onChange={(e) => setRowGap(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.gridGenerator.itemCount')}: {itemCount}
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-slate-500 mb-2">
            {t('tools.gridGenerator.columnSizing')}
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(['equal', 'auto', 'custom'] as const).map((value) => (
              <button
                key={value}
                onClick={() => setColumnSizing(value)}
                className={`px-3 py-1 text-xs rounded border ${
                  columnSizing === value
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-300 text-slate-600'
                }`}
              >
                {t(`tools.gridGenerator.sizing${value.charAt(0).toUpperCase() + value.slice(1)}`)}
              </button>
            ))}
          </div>

          {columnSizing === 'custom' && (
            <input
              type="text"
              value={customColumns}
              onChange={(e) => setCustomColumns(e.target.value)}
              placeholder="1fr 2fr 1fr"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
            />
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.gridGenerator.presets')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { name: '2 Columns', cols: 2, rows: 2 },
            { name: '3 Columns', cols: 3, rows: 2 },
            { name: '4 Columns', cols: 4, rows: 2 },
            { name: '12 Grid', cols: 12, rows: 1 },
            { name: 'Holy Grail', cols: 3, rows: 3, custom: '200px 1fr 200px' },
          ].map((preset) => (
            <Button
              key={preset.name}
              variant="secondary"
              onClick={() => {
                setColumns(preset.cols)
                setRows(preset.rows)
                if (preset.custom) {
                  setColumnSizing('custom')
                  setCustomColumns(preset.custom)
                } else {
                  setColumnSizing('equal')
                }
              }}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.gridGenerator.cssCode')}
          </h3>
          <Button variant="secondary" onClick={() => copy(cssCode)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto">
          <code className="font-mono text-sm text-slate-800">{cssCode}</code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.gridGenerator.cheatsheet')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded">
            <p className="font-medium text-slate-700 mb-2">grid-template-columns</p>
            <ul className="space-y-1 text-slate-600">
              <li><code>1fr</code> - {t('tools.gridGenerator.cheatFr')}</li>
              <li><code>repeat(3, 1fr)</code> - {t('tools.gridGenerator.cheatRepeat')}</li>
              <li><code>auto</code> - {t('tools.gridGenerator.cheatAuto')}</li>
            </ul>
          </div>
          <div className="p-3 bg-slate-50 rounded">
            <p className="font-medium text-slate-700 mb-2">gap</p>
            <ul className="space-y-1 text-slate-600">
              <li><code>gap: 16px</code> - {t('tools.gridGenerator.cheatGap')}</li>
              <li><code>column-gap</code> - {t('tools.gridGenerator.cheatColGap')}</li>
              <li><code>row-gap</code> - {t('tools.gridGenerator.cheatRowGap')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
