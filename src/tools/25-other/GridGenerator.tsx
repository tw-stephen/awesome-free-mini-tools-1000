import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function GridGenerator() {
  const { t } = useTranslation()

  const [columns, setColumns] = useState(3)
  const [rows, setRows] = useState(2)
  const [columnGap, setColumnGap] = useState(16)
  const [rowGap, setRowGap] = useState(16)
  const [columnSizes, setColumnSizes] = useState<string[]>(['1fr', '1fr', '1fr'])
  const [rowSizes, setRowSizes] = useState<string[]>(['1fr', '1fr'])
  const [copied, setCopied] = useState(false)

  const updateColumns = (newCount: number) => {
    const count = Math.max(1, Math.min(6, newCount))
    setColumns(count)
    setColumnSizes(prev => {
      if (count > prev.length) {
        return [...prev, ...Array(count - prev.length).fill('1fr')]
      }
      return prev.slice(0, count)
    })
  }

  const updateRows = (newCount: number) => {
    const count = Math.max(1, Math.min(6, newCount))
    setRows(count)
    setRowSizes(prev => {
      if (count > prev.length) {
        return [...prev, ...Array(count - prev.length).fill('1fr')]
      }
      return prev.slice(0, count)
    })
  }

  const updateColumnSize = (index: number, value: string) => {
    setColumnSizes(prev => prev.map((s, i) => i === index ? value : s))
  }

  const updateRowSize = (index: number, value: string) => {
    setRowSizes(prev => prev.map((s, i) => i === index ? value : s))
  }

  const generateCSS = (): string => {
    const lines = [
      'display: grid;',
      `grid-template-columns: ${columnSizes.join(' ')};`,
      `grid-template-rows: ${rowSizes.join(' ')};`,
      `column-gap: ${columnGap}px;`,
      `row-gap: ${rowGap}px;`
    ]
    return lines.join('\n')
  }

  const gridCSS = generateCSS()

  const copyCSS = async () => {
    await navigator.clipboard.writeText(gridCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const sizeOptions = ['1fr', '2fr', 'auto', '100px', '150px', '200px', 'minmax(100px, 1fr)']

  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#14b8a6', '#a855f7', '#64748b']

  const presets = [
    { name: '2x2', cols: 2, rows: 2, colSizes: ['1fr', '1fr'], rowSizes: ['1fr', '1fr'] },
    { name: '3x3', cols: 3, rows: 3, colSizes: ['1fr', '1fr', '1fr'], rowSizes: ['1fr', '1fr', '1fr'] },
    { name: 'Holy Grail', cols: 3, rows: 3, colSizes: ['200px', '1fr', '200px'], rowSizes: ['auto', '1fr', 'auto'] },
    { name: 'Sidebar', cols: 2, rows: 1, colSizes: ['250px', '1fr'], rowSizes: ['1fr'] },
    { name: 'Cards', cols: 4, rows: 2, colSizes: ['1fr', '1fr', '1fr', '1fr'], rowSizes: ['1fr', '1fr'] }
  ]

  const applyPreset = (preset: typeof presets[0]) => {
    setColumns(preset.cols)
    setRows(preset.rows)
    setColumnSizes(preset.colSizes)
    setRowSizes(preset.rowSizes)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex gap-1">
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              {preset.name}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyCSS}>
          {copied ? t('common.copied') : t('tools.grid.copyCSS')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50">
            <div
              className="min-h-[300px] rounded bg-white border border-slate-200 p-4"
              style={{
                display: 'grid',
                gridTemplateColumns: columnSizes.join(' '),
                gridTemplateRows: rowSizes.join(' '),
                columnGap: `${columnGap}px`,
                rowGap: `${rowGap}px`
              }}
            >
              {Array.from({ length: columns * rows }).map((_, i) => (
                <div
                  key={i}
                  className="rounded flex items-center justify-center text-white font-semibold min-h-[60px]"
                  style={{ backgroundColor: colors[i % colors.length] }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-800 rounded-lg">
            <code className="text-sm text-green-400 whitespace-pre">
              {gridCSS}
            </code>
          </div>
        </div>

        <div className="w-72 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[550px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.grid.properties')}</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.grid.columns')}</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={columns}
                  onChange={(e) => updateColumns(parseInt(e.target.value) || 1)}
                  className="input w-full text-center"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.grid.rows')}</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={rows}
                  onChange={(e) => updateRows(parseInt(e.target.value) || 1)}
                  className="input w-full text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.grid.colGap')} ({columnGap}px)</label>
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
                <label className="block text-xs text-slate-500 mb-1">{t('tools.grid.rowGap')} ({rowGap}px)</label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={rowGap}
                  onChange={(e) => setRowGap(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.grid.columnSizes')}</h4>
            <div className="space-y-2">
              {columnSizes.map((size, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-8">C{i + 1}</span>
                  <select
                    value={size}
                    onChange={(e) => updateColumnSize(i, e.target.value)}
                    className="input flex-1 text-xs"
                  >
                    {sizeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.grid.rowSizes')}</h4>
            <div className="space-y-2">
              {rowSizes.map((size, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-8">R{i + 1}</span>
                  <select
                    value={size}
                    onChange={(e) => updateRowSize(i, e.target.value)}
                    className="input flex-1 text-xs"
                  >
                    {sizeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
