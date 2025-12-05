import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Bar {
  id: string
  label: string
  value: number
  color: string
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1']

export default function BarChartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [bars, setBars] = useState<Bar[]>([
    { id: '1', label: 'Jan', value: 65, color: COLORS[0] },
    { id: '2', label: 'Feb', value: 85, color: COLORS[1] },
    { id: '3', label: 'Mar', value: 45, color: COLORS[2] },
    { id: '4', label: 'Apr', value: 95, color: COLORS[3] },
    { id: '5', label: 'May', value: 75, color: COLORS[4] },
    { id: '6', label: 'Jun', value: 55, color: COLORS[5] }
  ])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showValues, setShowValues] = useState(true)
  const [horizontal, setHorizontal] = useState(false)
  const [showGrid, setShowGrid] = useState(true)

  const maxValue = Math.max(...bars.map(b => b.value), 1)
  const chartPadding = { top: 40, right: 40, bottom: 60, left: 60 }
  const chartWidth = 600 - chartPadding.left - chartPadding.right
  const chartHeight = 400 - chartPadding.top - chartPadding.bottom

  const addBar = () => {
    const newId = Date.now().toString()
    const colorIndex = bars.length % COLORS.length
    setBars([...bars, {
      id: newId,
      label: `Item ${bars.length + 1}`,
      value: 50,
      color: COLORS[colorIndex]
    }])
  }

  const updateBar = (id: string, updates: Partial<Bar>) => {
    setBars(bars.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const deleteBar = (id: string) => {
    if (bars.length <= 1) return
    setBars(bars.filter(b => b.id !== id))
    setSelectedId(null)
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
        a.download = 'bar-chart.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const renderVerticalBars = () => {
    const barWidth = Math.min(60, (chartWidth / bars.length) * 0.7)
    const gap = (chartWidth - barWidth * bars.length) / (bars.length + 1)

    return bars.map((bar, index) => {
      const x = chartPadding.left + gap + index * (barWidth + gap)
      const barHeight = (bar.value / maxValue) * chartHeight
      const y = chartPadding.top + chartHeight - barHeight
      const isSelected = selectedId === bar.id

      return (
        <g key={bar.id}>
          <rect
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx="4"
            fill={bar.color}
            stroke={isSelected ? '#1e293b' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
            onClick={(e) => { e.stopPropagation(); setSelectedId(bar.id) }}
            className="cursor-pointer transition-opacity hover:opacity-80"
          />
          {showValues && (
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="#1e293b"
            >
              {bar.value}
            </text>
          )}
          <text
            x={x + barWidth / 2}
            y={chartPadding.top + chartHeight + 20}
            textAnchor="middle"
            fontSize="11"
            fill="#64748b"
          >
            {bar.label.length > 8 ? bar.label.slice(0, 8) + '..' : bar.label}
          </text>
        </g>
      )
    })
  }

  const renderHorizontalBars = () => {
    const barHeight = Math.min(40, (chartHeight / bars.length) * 0.7)
    const gap = (chartHeight - barHeight * bars.length) / (bars.length + 1)

    return bars.map((bar, index) => {
      const y = chartPadding.top + gap + index * (barHeight + gap)
      const barWidth = (bar.value / maxValue) * chartWidth
      const x = chartPadding.left
      const isSelected = selectedId === bar.id

      return (
        <g key={bar.id}>
          <rect
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx="4"
            fill={bar.color}
            stroke={isSelected ? '#1e293b' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
            onClick={(e) => { e.stopPropagation(); setSelectedId(bar.id) }}
            className="cursor-pointer transition-opacity hover:opacity-80"
          />
          {showValues && (
            <text
              x={x + barWidth + 8}
              y={y + barHeight / 2 + 4}
              fontSize="11"
              fontWeight="600"
              fill="#1e293b"
            >
              {bar.value}
            </text>
          )}
          <text
            x={chartPadding.left - 8}
            y={y + barHeight / 2 + 4}
            textAnchor="end"
            fontSize="11"
            fill="#64748b"
          >
            {bar.label.length > 8 ? bar.label.slice(0, 8) + '..' : bar.label}
          </text>
        </g>
      )
    })
  }

  const renderGrid = () => {
    const lines: JSX.Element[] = []
    const numLines = 5

    for (let i = 0; i <= numLines; i++) {
      const value = Math.round((maxValue / numLines) * i)
      if (horizontal) {
        const x = chartPadding.left + (i / numLines) * chartWidth
        lines.push(
          <g key={i}>
            <line
              x1={x}
              y1={chartPadding.top}
              x2={x}
              y2={chartPadding.top + chartHeight}
              stroke="#e2e8f0"
              strokeDasharray="4,4"
            />
            <text
              x={x}
              y={chartPadding.top + chartHeight + 20}
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
            >
              {value}
            </text>
          </g>
        )
      } else {
        const y = chartPadding.top + chartHeight - (i / numLines) * chartHeight
        lines.push(
          <g key={i}>
            <line
              x1={chartPadding.left}
              y1={y}
              x2={chartPadding.left + chartWidth}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="4,4"
            />
            <text
              x={chartPadding.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#94a3b8"
            >
              {value}
            </text>
          </g>
        )
      }
    }

    return lines
  }

  const selectedBar = selectedId ? bars.find(b => b.id === selectedId) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={addBar}>{t('tools.barChart.addBar')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
              className="rounded"
            />
            {t('tools.barChart.showValues')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="rounded"
            />
            {t('tools.barChart.showGrid')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={horizontal}
              onChange={(e) => setHorizontal(e.target.checked)}
              className="rounded"
            />
            {t('tools.barChart.horizontal')}
          </label>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div
          className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner"
          onClick={() => setSelectedId(null)}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 600 400"
            className="w-full select-none"
          >
            <rect width="600" height="400" fill="white" />

            {/* Axes */}
            <line
              x1={chartPadding.left}
              y1={chartPadding.top}
              x2={chartPadding.left}
              y2={chartPadding.top + chartHeight}
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <line
              x1={chartPadding.left}
              y1={chartPadding.top + chartHeight}
              x2={chartPadding.left + chartWidth}
              y2={chartPadding.top + chartHeight}
              stroke="#cbd5e1"
              strokeWidth="2"
            />

            {showGrid && renderGrid()}
            {horizontal ? renderHorizontalBars() : renderVerticalBars()}
          </svg>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.barChart.properties')}</h3>

          {selectedBar ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.barChart.label')}</label>
                <input
                  type="text"
                  value={selectedBar.label}
                  onChange={(e) => updateBar(selectedId!, { label: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.barChart.value')}</label>
                <input
                  type="number"
                  min="0"
                  value={selectedBar.value}
                  onChange={(e) => updateBar(selectedId!, { value: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.barChart.color')}</label>
                <div className="flex gap-1 flex-wrap">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded ${selectedBar.color === color ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateBar(selectedId!, { color })}
                    />
                  ))}
                </div>
              </div>
              {bars.length > 1 && (
                <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteBar(selectedId!)}>
                  {t('tools.barChart.delete')}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              {t('tools.barChart.selectHint')}
            </div>
          )}

          {/* Data Summary */}
          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.barChart.summary')}</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-500">{t('tools.barChart.total')}:</div>
              <div className="text-slate-700 font-medium">{bars.reduce((sum, b) => sum + b.value, 0)}</div>
              <div className="text-slate-500">{t('tools.barChart.average')}:</div>
              <div className="text-slate-700 font-medium">{Math.round(bars.reduce((sum, b) => sum + b.value, 0) / bars.length)}</div>
              <div className="text-slate-500">{t('tools.barChart.max')}:</div>
              <div className="text-slate-700 font-medium">{maxValue}</div>
              <div className="text-slate-500">{t('tools.barChart.count')}:</div>
              <div className="text-slate-700 font-medium">{bars.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
