import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Bubble {
  id: string
  x: number
  y: number
  size: number
  label: string
  color: string
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function BubbleChartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [bubbles, setBubbles] = useState<Bubble[]>([
    { id: '1', x: 20, y: 30, size: 40, label: 'A', color: COLORS[0] },
    { id: '2', x: 40, y: 60, size: 25, label: 'B', color: COLORS[1] },
    { id: '3', x: 60, y: 45, size: 55, label: 'C', color: COLORS[2] },
    { id: '4', x: 80, y: 75, size: 35, label: 'D', color: COLORS[3] },
    { id: '5', x: 30, y: 80, size: 45, label: 'E', color: COLORS[4] },
    { id: '6', x: 70, y: 25, size: 30, label: 'F', color: COLORS[5] }
  ])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showLabels, setShowLabels] = useState(true)

  const chartPadding = { top: 40, right: 40, bottom: 60, left: 60 }
  const chartWidth = 600 - chartPadding.left - chartPadding.right
  const chartHeight = 400 - chartPadding.top - chartPadding.bottom

  const maxSize = Math.max(...bubbles.map(b => b.size), 1)
  const scaleX = (x: number) => chartPadding.left + (x / 100) * chartWidth
  const scaleY = (y: number) => chartPadding.top + chartHeight - (y / 100) * chartHeight
  const scaleSize = (size: number) => 10 + (size / maxSize) * 40

  const addBubble = () => {
    const newId = Date.now().toString()
    const colorIndex = bubbles.length % COLORS.length
    setBubbles([...bubbles, {
      id: newId,
      x: 50,
      y: 50,
      size: 30,
      label: String.fromCharCode(65 + bubbles.length),
      color: COLORS[colorIndex]
    }])
  }

  const updateBubble = (id: string, updates: Partial<Bubble>) => {
    setBubbles(bubbles.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const deleteBubble = (id: string) => {
    if (bubbles.length <= 1) return
    setBubbles(bubbles.filter(b => b.id !== id))
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
        a.download = 'bubble-chart.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const renderGrid = () => {
    const lines: JSX.Element[] = []
    const numLines = 5

    for (let i = 0; i <= numLines; i++) {
      const y = chartPadding.top + (i / numLines) * chartHeight
      const value = Math.round(100 - (i / numLines) * 100)
      lines.push(
        <g key={`h-${i}`}>
          <line x1={chartPadding.left} y1={y} x2={chartPadding.left + chartWidth} y2={y} stroke="#e2e8f0" strokeDasharray="4,4" />
          <text x={chartPadding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{value}</text>
        </g>
      )
    }

    for (let i = 0; i <= numLines; i++) {
      const x = chartPadding.left + (i / numLines) * chartWidth
      const value = Math.round((i / numLines) * 100)
      lines.push(
        <g key={`v-${i}`}>
          <line x1={x} y1={chartPadding.top} x2={x} y2={chartPadding.top + chartHeight} stroke="#e2e8f0" strokeDasharray="4,4" />
          <text x={x} y={chartPadding.top + chartHeight + 20} textAnchor="middle" fontSize="10" fill="#94a3b8">{value}</text>
        </g>
      )
    }

    return lines
  }

  const selectedBubble = selectedId ? bubbles.find(b => b.id === selectedId) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={addBubble}>{t('tools.bubbleChart.addBubble')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="rounded" />
            {t('tools.bubbleChart.showGrid')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="rounded" />
            {t('tools.bubbleChart.showLabels')}
          </label>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner" onClick={() => setSelectedId(null)}>
          <svg ref={svgRef} viewBox="0 0 600 400" className="w-full select-none">
            <rect width="600" height="400" fill="white" />
            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + chartHeight} stroke="#cbd5e1" strokeWidth="2" />
            <line x1={chartPadding.left} y1={chartPadding.top + chartHeight} x2={chartPadding.left + chartWidth} y2={chartPadding.top + chartHeight} stroke="#cbd5e1" strokeWidth="2" />

            {showGrid && renderGrid()}

            {bubbles.map(bubble => {
              const cx = scaleX(bubble.x)
              const cy = scaleY(bubble.y)
              const r = scaleSize(bubble.size)
              const isSelected = selectedId === bubble.id

              return (
                <g key={bubble.id} onClick={(e) => { e.stopPropagation(); setSelectedId(bubble.id) }} className="cursor-pointer">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={bubble.color}
                    opacity="0.7"
                    stroke={isSelected ? '#1e293b' : 'white'}
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  {showLabels && (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      fontWeight="600"
                      fill="white"
                      className="pointer-events-none"
                    >
                      {bubble.label}
                    </text>
                  )}
                </g>
              )
            })}

            <text x={chartPadding.left + chartWidth / 2} y={chartPadding.top + chartHeight + 45} textAnchor="middle" fontSize="12" fill="#64748b">X {t('tools.bubbleChart.axis')}</text>
            <text x={15} y={chartPadding.top + chartHeight / 2} textAnchor="middle" fontSize="12" fill="#64748b" transform={`rotate(-90, 15, ${chartPadding.top + chartHeight / 2})`}>Y {t('tools.bubbleChart.axis')}</text>
          </svg>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.bubbleChart.properties')}</h3>

          {selectedBubble ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.bubbleChart.label')}</label>
                <input type="text" value={selectedBubble.label} onChange={(e) => updateBubble(selectedId!, { label: e.target.value })} className="input w-full" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">X (0-100)</label>
                  <input type="number" min="0" max="100" value={selectedBubble.x} onChange={(e) => updateBubble(selectedId!, { x: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) })} className="input w-full" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Y (0-100)</label>
                  <input type="number" min="0" max="100" value={selectedBubble.y} onChange={(e) => updateBubble(selectedId!, { y: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) })} className="input w-full" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.bubbleChart.size')} ({selectedBubble.size})</label>
                <input type="range" min="10" max="100" value={selectedBubble.size} onChange={(e) => updateBubble(selectedId!, { size: parseInt(e.target.value) })} className="w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.bubbleChart.color')}</label>
                <div className="flex gap-1 flex-wrap">
                  {COLORS.map(color => (
                    <button key={color} className={`w-6 h-6 rounded ${selectedBubble.color === color ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`} style={{ backgroundColor: color }} onClick={() => updateBubble(selectedId!, { color })} />
                  ))}
                </div>
              </div>
              {bubbles.length > 1 && (
                <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteBubble(selectedId!)}>
                  {t('tools.bubbleChart.delete')}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400">{t('tools.bubbleChart.selectHint')}</div>
          )}

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.bubbleChart.data')}</h4>
            <div className="space-y-1 text-xs max-h-32 overflow-auto">
              {bubbles.map(b => (
                <div key={b.id} className="flex items-center gap-2 py-1">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                  <span className="flex-1 truncate">{b.label}</span>
                  <span className="text-slate-400">({b.x}, {b.y})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
