import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

type ColorScheme = 'heat' | 'cool' | 'viridis' | 'grayscale'

const colorSchemes: Record<ColorScheme, string[]> = {
  heat: ['#fef3c7', '#fcd34d', '#f59e0b', '#ea580c', '#dc2626', '#991b1b'],
  cool: ['#ecfeff', '#a5f3fc', '#22d3ee', '#0891b2', '#0e7490', '#155e75'],
  viridis: ['#fde725', '#5ec962', '#21918c', '#3b528b', '#440154'],
  grayscale: ['#f8fafc', '#cbd5e1', '#94a3b8', '#64748b', '#334155', '#0f172a']
}

export default function HeatmapGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [rows, setRows] = useState(5)
  const [cols, setCols] = useState(7)
  const [data, setData] = useState<number[][]>(() => {
    const initial: number[][] = []
    for (let i = 0; i < 5; i++) {
      initial.push([])
      for (let j = 0; j < 7; j++) {
        initial[i].push(Math.floor(Math.random() * 100))
      }
    }
    return initial
  })

  const [rowLabels, setRowLabels] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
  const [colLabels, setColLabels] = useState(['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'])
  const [colorScheme, setColorScheme] = useState<ColorScheme>('heat')
  const [showValues, setShowValues] = useState(true)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)

  const cellWidth = 60
  const cellHeight = 40
  const labelWidth = 50
  const labelHeight = 30
  const chartWidth = labelWidth + cols * cellWidth + 80
  const chartHeight = labelHeight + rows * cellHeight + 60

  const minValue = Math.min(...data.flat())
  const maxValue = Math.max(...data.flat())

  const getColor = (value: number) => {
    const colors = colorSchemes[colorScheme]
    const normalized = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue)
    const index = Math.min(Math.floor(normalized * colors.length), colors.length - 1)
    return colors[index]
  }

  const updateCell = (row: number, col: number, value: number) => {
    const newData = data.map((r, i) => i === row ? r.map((c, j) => j === col ? value : c) : r)
    setData(newData)
  }

  const addRow = () => {
    const newRow = Array(cols).fill(0).map(() => Math.floor(Math.random() * 100))
    setData([...data, newRow])
    setRowLabels([...rowLabels, `Row ${rows + 1}`])
    setRows(rows + 1)
  }

  const addCol = () => {
    setData(data.map(row => [...row, Math.floor(Math.random() * 100)]))
    setColLabels([...colLabels, `Col ${cols + 1}`])
    setCols(cols + 1)
  }

  const removeRow = () => {
    if (rows <= 2) return
    setData(data.slice(0, -1))
    setRowLabels(rowLabels.slice(0, -1))
    setRows(rows - 1)
    setSelectedCell(null)
  }

  const removeCol = () => {
    if (cols <= 2) return
    setData(data.map(row => row.slice(0, -1)))
    setColLabels(colLabels.slice(0, -1))
    setCols(cols - 1)
    setSelectedCell(null)
  }

  const randomize = () => {
    setData(data.map(row => row.map(() => Math.floor(Math.random() * 100))))
  }

  const downloadImage = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = chartWidth
    canvas.height = chartHeight
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const a = document.createElement('a')
        a.download = 'heatmap.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={addRow}>{t('tools.heatmap.addRow')}</Button>
        <Button variant="secondary" onClick={addCol}>{t('tools.heatmap.addCol')}</Button>
        <Button variant="secondary" onClick={removeRow}>{t('tools.heatmap.removeRow')}</Button>
        <Button variant="secondary" onClick={removeCol}>{t('tools.heatmap.removeCol')}</Button>
        <Button variant="secondary" onClick={randomize}>{t('tools.heatmap.randomize')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showValues} onChange={(e) => setShowValues(e.target.checked)} className="rounded" />
            {t('tools.heatmap.showValues')}
          </label>
          <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value as ColorScheme)} className="input py-1 text-sm">
            <option value="heat">{t('tools.heatmap.schemes.heat')}</option>
            <option value="cool">{t('tools.heatmap.schemes.cool')}</option>
            <option value="viridis">{t('tools.heatmap.schemes.viridis')}</option>
            <option value="grayscale">{t('tools.heatmap.schemes.grayscale')}</option>
          </select>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 border border-slate-200 rounded-lg bg-white overflow-auto shadow-inner p-4" onClick={() => setSelectedCell(null)}>
          <svg ref={svgRef} width={chartWidth} height={chartHeight} className="select-none">
            <rect width={chartWidth} height={chartHeight} fill="white" />

            {/* Column labels */}
            {colLabels.map((label, j) => (
              <text
                key={`col-${j}`}
                x={labelWidth + j * cellWidth + cellWidth / 2}
                y={labelHeight / 2 + 5}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
              >
                {label.length > 8 ? label.slice(0, 8) + '..' : label}
              </text>
            ))}

            {/* Row labels */}
            {rowLabels.map((label, i) => (
              <text
                key={`row-${i}`}
                x={labelWidth - 8}
                y={labelHeight + i * cellHeight + cellHeight / 2 + 4}
                textAnchor="end"
                fontSize="10"
                fill="#64748b"
              >
                {label.length > 6 ? label.slice(0, 6) + '..' : label}
              </text>
            ))}

            {/* Cells */}
            {data.map((row, i) =>
              row.map((value, j) => {
                const isSelected = selectedCell?.row === i && selectedCell?.col === j
                return (
                  <g key={`cell-${i}-${j}`} onClick={(e) => { e.stopPropagation(); setSelectedCell({ row: i, col: j }) }} className="cursor-pointer">
                    <rect
                      x={labelWidth + j * cellWidth}
                      y={labelHeight + i * cellHeight}
                      width={cellWidth}
                      height={cellHeight}
                      fill={getColor(value)}
                      stroke={isSelected ? '#1e293b' : '#e2e8f0'}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    {showValues && (
                      <text
                        x={labelWidth + j * cellWidth + cellWidth / 2}
                        y={labelHeight + i * cellHeight + cellHeight / 2 + 4}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="500"
                        fill={value > (maxValue + minValue) / 2 ? '#fff' : '#1e293b'}
                      >
                        {value}
                      </text>
                    )}
                  </g>
                )
              })
            )}

            {/* Legend */}
            <g transform={`translate(${labelWidth + cols * cellWidth + 20}, ${labelHeight})`}>
              {colorSchemes[colorScheme].map((color, i) => (
                <rect key={i} x={0} y={i * 20} width={20} height={20} fill={color} stroke="#e2e8f0" />
              ))}
              <text x={25} y={12} fontSize="9" fill="#64748b">{maxValue}</text>
              <text x={25} y={colorSchemes[colorScheme].length * 20 - 4} fontSize="9" fill="#64748b">{minValue}</text>
            </g>
          </svg>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.heatmap.properties')}</h3>

          {selectedCell ? (
            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                {t('tools.heatmap.cell')}: ({selectedCell.row + 1}, {selectedCell.col + 1})
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.heatmap.value')}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={data[selectedCell.row][selectedCell.col]}
                  onChange={(e) => updateCell(selectedCell.row, selectedCell.col, Math.max(0, parseInt(e.target.value) || 0))}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.heatmap.rowLabel')}</label>
                <input
                  type="text"
                  value={rowLabels[selectedCell.row]}
                  onChange={(e) => {
                    const newLabels = [...rowLabels]
                    newLabels[selectedCell.row] = e.target.value
                    setRowLabels(newLabels)
                  }}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.heatmap.colLabel')}</label>
                <input
                  type="text"
                  value={colLabels[selectedCell.col]}
                  onChange={(e) => {
                    const newLabels = [...colLabels]
                    newLabels[selectedCell.col] = e.target.value
                    setColLabels(newLabels)
                  }}
                  className="input w-full"
                />
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400">{t('tools.heatmap.selectHint')}</div>
          )}

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.heatmap.stats')}</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-500">{t('tools.heatmap.min')}:</div>
              <div className="text-slate-700 font-medium">{minValue}</div>
              <div className="text-slate-500">{t('tools.heatmap.max')}:</div>
              <div className="text-slate-700 font-medium">{maxValue}</div>
              <div className="text-slate-500">{t('tools.heatmap.avg')}:</div>
              <div className="text-slate-700 font-medium">{Math.round(data.flat().reduce((a, b) => a + b, 0) / data.flat().length)}</div>
              <div className="text-slate-500">{t('tools.heatmap.cells')}:</div>
              <div className="text-slate-700 font-medium">{rows} × {cols}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
