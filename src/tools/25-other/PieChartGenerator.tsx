import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Slice {
  id: string
  label: string
  value: number
  color: string
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1']

export default function PieChartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [slices, setSlices] = useState<Slice[]>([
    { id: '1', label: 'Category A', value: 30, color: COLORS[0] },
    { id: '2', label: 'Category B', value: 25, color: COLORS[1] },
    { id: '3', label: 'Category C', value: 20, color: COLORS[2] },
    { id: '4', label: 'Category D', value: 15, color: COLORS[3] },
    { id: '5', label: 'Category E', value: 10, color: COLORS[4] }
  ])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showLabels, setShowLabels] = useState(true)
  const [showPercentages, setShowPercentages] = useState(true)
  const [donut, setDonut] = useState(false)

  const total = slices.reduce((sum, s) => sum + s.value, 0)

  const addSlice = () => {
    const newId = Date.now().toString()
    const colorIndex = slices.length % COLORS.length
    setSlices([...slices, {
      id: newId,
      label: `Category ${String.fromCharCode(65 + slices.length)}`,
      value: 10,
      color: COLORS[colorIndex]
    }])
  }

  const updateSlice = (id: string, updates: Partial<Slice>) => {
    setSlices(slices.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteSlice = (id: string) => {
    if (slices.length <= 1) return
    setSlices(slices.filter(s => s.id !== id))
    setSelectedId(null)
  }

  const downloadImage = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = 600
    canvas.height = 500
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const a = document.createElement('a')
        a.download = 'pie-chart.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const renderPieChart = () => {
    const centerX = 200
    const centerY = 200
    const radius = 150
    const innerRadius = donut ? 80 : 0

    let currentAngle = -Math.PI / 2
    const paths: JSX.Element[] = []

    slices.forEach((slice) => {
      const percentage = total > 0 ? slice.value / total : 0
      const angle = percentage * Math.PI * 2
      const endAngle = currentAngle + angle

      const x1 = centerX + Math.cos(currentAngle) * radius
      const y1 = centerY + Math.sin(currentAngle) * radius
      const x2 = centerX + Math.cos(endAngle) * radius
      const y2 = centerY + Math.sin(endAngle) * radius

      const x1Inner = centerX + Math.cos(currentAngle) * innerRadius
      const y1Inner = centerY + Math.sin(currentAngle) * innerRadius
      const x2Inner = centerX + Math.cos(endAngle) * innerRadius
      const y2Inner = centerY + Math.sin(endAngle) * innerRadius

      const largeArc = angle > Math.PI ? 1 : 0

      const d = donut
        ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x2Inner} ${y2Inner} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1Inner} ${y1Inner} Z`
        : `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

      const isSelected = selectedId === slice.id
      const midAngle = currentAngle + angle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(midAngle) * labelRadius
      const labelY = centerY + Math.sin(midAngle) * labelRadius

      paths.push(
        <g key={slice.id}>
          <path
            d={d}
            fill={slice.color}
            stroke={isSelected ? '#1e293b' : 'white'}
            strokeWidth={isSelected ? 3 : 2}
            onClick={(e) => { e.stopPropagation(); setSelectedId(slice.id) }}
            className="cursor-pointer transition-transform hover:scale-105"
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          />
          {showPercentages && percentage > 0.05 && (
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dy="4"
              fontSize="12"
              fontWeight="600"
              fill="white"
              className="select-none pointer-events-none"
            >
              {Math.round(percentage * 100)}%
            </text>
          )}
        </g>
      )

      currentAngle = endAngle
    })

    return paths
  }

  const selectedSlice = selectedId ? slices.find(s => s.id === selectedId) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={addSlice}>{t('tools.pieChart.addSlice')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="rounded"
            />
            {t('tools.pieChart.showLabels')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={showPercentages}
              onChange={(e) => setShowPercentages(e.target.checked)}
              className="rounded"
            />
            {t('tools.pieChart.showPercentages')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={donut}
              onChange={(e) => setDonut(e.target.checked)}
              className="rounded"
            />
            {t('tools.pieChart.donut')}
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
            viewBox="0 0 600 500"
            className="w-full select-none"
          >
            <rect width="600" height="500" fill="white" />

            {renderPieChart()}

            {/* Legend */}
            {showLabels && (
              <g transform="translate(420, 100)">
                {slices.map((slice, index) => {
                  const percentage = total > 0 ? Math.round((slice.value / total) * 100) : 0
                  return (
                    <g key={slice.id} transform={`translate(0, ${index * 28})`}>
                      <rect width="16" height="16" rx="2" fill={slice.color} />
                      <text x="24" y="12" fontSize="12" fill="#1e293b">
                        {slice.label.length > 12 ? slice.label.slice(0, 12) + '...' : slice.label}
                      </text>
                      <text x="140" y="12" fontSize="11" fill="#64748b" textAnchor="end">
                        {slice.value} ({percentage}%)
                      </text>
                    </g>
                  )
                })}
              </g>
            )}

            {/* Total */}
            {donut && (
              <g transform="translate(200, 200)">
                <text textAnchor="middle" dy="-5" fontSize="14" fill="#64748b">{t('tools.pieChart.total')}</text>
                <text textAnchor="middle" dy="18" fontSize="24" fontWeight="bold" fill="#1e293b">{total}</text>
              </g>
            )}
          </svg>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.pieChart.properties')}</h3>

          {selectedSlice ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.pieChart.label')}</label>
                <input
                  type="text"
                  value={selectedSlice.label}
                  onChange={(e) => updateSlice(selectedId!, { label: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.pieChart.value')}</label>
                <input
                  type="number"
                  min="0"
                  value={selectedSlice.value}
                  onChange={(e) => updateSlice(selectedId!, { value: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.pieChart.color')}</label>
                <div className="flex gap-1 flex-wrap">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded ${selectedSlice.color === color ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateSlice(selectedId!, { color })}
                    />
                  ))}
                </div>
              </div>
              {slices.length > 1 && (
                <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteSlice(selectedId!)}>
                  {t('tools.pieChart.delete')}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              {t('tools.pieChart.selectHint')}
            </div>
          )}

          {/* Data Table */}
          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.pieChart.data')}</h4>
            <div className="space-y-1 text-xs max-h-40 overflow-auto">
              {slices.map(slice => (
                <div key={slice.id} className="flex items-center gap-2 py-1">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="flex-1 truncate text-slate-600">{slice.label}</span>
                  <span className="text-slate-500">{slice.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
