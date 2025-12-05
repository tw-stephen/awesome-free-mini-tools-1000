import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface WaterfallItem {
  id: string
  label: string
  value: number
  type: 'increase' | 'decrease' | 'total'
}

export default function WaterfallChartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [items, setItems] = useState<WaterfallItem[]>([
    { id: '1', label: 'Start', value: 100, type: 'total' },
    { id: '2', label: 'Revenue', value: 50, type: 'increase' },
    { id: '3', label: 'Costs', value: -30, type: 'decrease' },
    { id: '4', label: 'Marketing', value: -15, type: 'decrease' },
    { id: '5', label: 'Other Income', value: 20, type: 'increase' },
    { id: '6', label: 'End', value: 125, type: 'total' }
  ])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showValues, setShowValues] = useState(true)
  const [showConnectors, setShowConnectors] = useState(true)

  const chartPadding = { top: 40, right: 40, bottom: 80, left: 60 }
  const chartWidth = 600 - chartPadding.left - chartPadding.right
  const chartHeight = 350 - chartPadding.top - chartPadding.bottom

  // Calculate running totals
  const calculatePositions = () => {
    let runningTotal = 0
    return items.map((item, index) => {
      let start: number, end: number

      if (item.type === 'total') {
        start = 0
        end = item.value
        runningTotal = item.value
      } else {
        start = runningTotal
        end = runningTotal + item.value
        runningTotal = end
      }

      return { ...item, start, end, index }
    })
  }

  const positions = calculatePositions()
  const allValues = positions.flatMap(p => [p.start, p.end])
  const minValue = Math.min(...allValues, 0)
  const maxValue = Math.max(...allValues)
  const valueRange = maxValue - minValue || 1

  const barWidth = Math.min(60, (chartWidth / items.length) * 0.7)
  const gap = (chartWidth - barWidth * items.length) / (items.length + 1)

  const scaleY = (value: number) => chartPadding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight

  const addItem = () => {
    const newId = Date.now().toString()
    const insertIndex = items.length - 1
    const newItems = [...items]
    newItems.splice(insertIndex, 0, {
      id: newId,
      label: `Item ${items.length}`,
      value: 10,
      type: 'increase'
    })
    setItems(newItems)
  }

  const updateItem = (id: string, updates: Partial<WaterfallItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  const deleteItem = (id: string) => {
    if (items.length <= 2) return
    setItems(items.filter(item => item.id !== id))
    setSelectedId(null)
  }

  const recalculateTotal = () => {
    const total = items.slice(0, -1).reduce((sum, item) => {
      if (item.type === 'total') return item.value
      return sum + item.value
    }, 0)
    const lastItem = items[items.length - 1]
    if (lastItem.type === 'total') {
      updateItem(lastItem.id, { value: total })
    }
  }

  const downloadImage = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = 600
    canvas.height = 400
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const a = document.createElement('a')
        a.download = 'waterfall-chart.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const getColor = (type: WaterfallItem['type'], value: number) => {
    if (type === 'total') return '#64748b'
    return value >= 0 ? '#22c55e' : '#ef4444'
  }

  const selectedItem = selectedId ? items.find(item => item.id === selectedId) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={addItem}>{t('tools.waterfallChart.addItem')}</Button>
        <Button variant="secondary" onClick={recalculateTotal}>{t('tools.waterfallChart.recalculate')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showValues} onChange={(e) => setShowValues(e.target.checked)} className="rounded" />
            {t('tools.waterfallChart.showValues')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showConnectors} onChange={(e) => setShowConnectors(e.target.checked)} className="rounded" />
            {t('tools.waterfallChart.showConnectors')}
          </label>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner" onClick={() => setSelectedId(null)}>
          <svg ref={svgRef} viewBox="0 0 600 400" className="w-full select-none">
            <rect width="600" height="400" fill="white" />

            {/* Y Axis */}
            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + chartHeight} stroke="#cbd5e1" strokeWidth="2" />

            {/* Zero line */}
            {minValue < 0 && (
              <line x1={chartPadding.left} y1={scaleY(0)} x2={chartPadding.left + chartWidth} y2={scaleY(0)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
            )}

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const value = minValue + ratio * valueRange
              const y = scaleY(value)
              return (
                <g key={i}>
                  <line x1={chartPadding.left} y1={y} x2={chartPadding.left + chartWidth} y2={y} stroke="#e2e8f0" strokeDasharray="4,4" />
                  <text x={chartPadding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{Math.round(value)}</text>
                </g>
              )
            })}

            {/* Connectors */}
            {showConnectors && positions.slice(0, -1).map((pos, i) => {
              const nextPos = positions[i + 1]
              const x1 = chartPadding.left + gap + i * (barWidth + gap) + barWidth
              const x2 = chartPadding.left + gap + (i + 1) * (barWidth + gap)
              const y = scaleY(pos.end)
              return (
                <line key={`conn-${i}`} x1={x1} y1={y} x2={x2} y2={y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
              )
            })}

            {/* Bars */}
            {positions.map((pos) => {
              const x = chartPadding.left + gap + pos.index * (barWidth + gap)
              const y1 = scaleY(pos.start)
              const y2 = scaleY(pos.end)
              const barY = Math.min(y1, y2)
              const barHeight = Math.abs(y2 - y1)
              const isSelected = selectedId === pos.id
              const color = getColor(pos.type, pos.value)

              return (
                <g key={pos.id} onClick={(e) => { e.stopPropagation(); setSelectedId(pos.id) }} className="cursor-pointer">
                  <rect
                    x={x}
                    y={barY}
                    width={barWidth}
                    height={Math.max(barHeight, 2)}
                    fill={color}
                    stroke={isSelected ? '#1e293b' : 'none'}
                    strokeWidth={isSelected ? 2 : 0}
                    rx="2"
                  />
                  {showValues && (
                    <text
                      x={x + barWidth / 2}
                      y={barY - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill={color}
                    >
                      {pos.type === 'total' ? pos.value : (pos.value >= 0 ? '+' : '') + pos.value}
                    </text>
                  )}
                  <text
                    x={x + barWidth / 2}
                    y={chartPadding.top + chartHeight + 20}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                    transform={`rotate(-30, ${x + barWidth / 2}, ${chartPadding.top + chartHeight + 20})`}
                  >
                    {pos.label.length > 10 ? pos.label.slice(0, 10) + '..' : pos.label}
                  </text>
                </g>
              )
            })}

            {/* Legend */}
            <g transform="translate(480, 20)">
              <rect x="0" y="0" width="12" height="12" fill="#22c55e" rx="2" />
              <text x="18" y="10" fontSize="10" fill="#64748b">{t('tools.waterfallChart.increase')}</text>
              <rect x="0" y="18" width="12" height="12" fill="#ef4444" rx="2" />
              <text x="18" y="28" fontSize="10" fill="#64748b">{t('tools.waterfallChart.decrease')}</text>
              <rect x="0" y="36" width="12" height="12" fill="#64748b" rx="2" />
              <text x="18" y="46" fontSize="10" fill="#64748b">{t('tools.waterfallChart.total')}</text>
            </g>
          </svg>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.waterfallChart.properties')}</h3>

          {selectedItem ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.waterfallChart.label')}</label>
                <input type="text" value={selectedItem.label} onChange={(e) => updateItem(selectedId!, { label: e.target.value })} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.waterfallChart.value')}</label>
                <input type="number" value={selectedItem.value} onChange={(e) => updateItem(selectedId!, { value: parseInt(e.target.value) || 0 })} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.waterfallChart.type')}</label>
                <select value={selectedItem.type} onChange={(e) => updateItem(selectedId!, { type: e.target.value as WaterfallItem['type'] })} className="input w-full">
                  <option value="increase">{t('tools.waterfallChart.increase')}</option>
                  <option value="decrease">{t('tools.waterfallChart.decrease')}</option>
                  <option value="total">{t('tools.waterfallChart.total')}</option>
                </select>
              </div>
              {items.length > 2 && (
                <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteItem(selectedId!)}>
                  {t('tools.waterfallChart.delete')}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400">{t('tools.waterfallChart.selectHint')}</div>
          )}

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.waterfallChart.data')}</h4>
            <div className="space-y-1 text-xs max-h-32 overflow-auto">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2 py-1">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: getColor(item.type, item.value) }} />
                  <span className="flex-1 truncate">{item.label}</span>
                  <span className={item.value >= 0 ? 'text-green-600' : 'text-red-600'}>{item.value >= 0 ? '+' : ''}{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
