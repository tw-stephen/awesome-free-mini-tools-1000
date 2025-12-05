import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface DataPoint {
  x: number
  y: number
}

interface DataSeries {
  id: string
  name: string
  color: string
  data: DataPoint[]
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899']

export default function LineChartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [series, setSeries] = useState<DataSeries[]>([
    {
      id: '1',
      name: 'Series A',
      color: COLORS[0],
      data: [
        { x: 0, y: 30 }, { x: 1, y: 45 }, { x: 2, y: 35 }, { x: 3, y: 60 },
        { x: 4, y: 50 }, { x: 5, y: 75 }, { x: 6, y: 65 }
      ]
    },
    {
      id: '2',
      name: 'Series B',
      color: COLORS[1],
      data: [
        { x: 0, y: 20 }, { x: 1, y: 35 }, { x: 2, y: 55 }, { x: 3, y: 40 },
        { x: 4, y: 70 }, { x: 5, y: 55 }, { x: 6, y: 80 }
      ]
    }
  ])

  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null)
  const [showPoints, setShowPoints] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [smooth, setSmooth] = useState(false)
  const [showArea, setShowArea] = useState(false)

  const chartPadding = { top: 40, right: 40, bottom: 60, left: 60 }
  const chartWidth = 600 - chartPadding.left - chartPadding.right
  const chartHeight = 400 - chartPadding.top - chartPadding.bottom

  const allPoints = series.flatMap(s => s.data)
  const maxY = Math.max(...allPoints.map(p => p.y), 1)
  const maxX = Math.max(...allPoints.map(p => p.x), 1)

  const scaleX = (x: number) => chartPadding.left + (x / maxX) * chartWidth
  const scaleY = (y: number) => chartPadding.top + chartHeight - (y / maxY) * chartHeight

  const addSeries = () => {
    const newId = Date.now().toString()
    const colorIndex = series.length % COLORS.length
    setSeries([...series, {
      id: newId,
      name: `Series ${String.fromCharCode(65 + series.length)}`,
      color: COLORS[colorIndex],
      data: [{ x: 0, y: 50 }, { x: 1, y: 60 }, { x: 2, y: 45 }, { x: 3, y: 70 }]
    }])
  }

  const updateSeries = (id: string, updates: Partial<DataSeries>) => {
    setSeries(series.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteSeries = (id: string) => {
    if (series.length <= 1) return
    setSeries(series.filter(s => s.id !== id))
    setSelectedSeriesId(null)
  }

  const addPoint = (seriesId: string) => {
    const s = series.find(s => s.id === seriesId)
    if (!s) return
    const newX = s.data.length > 0 ? Math.max(...s.data.map(p => p.x)) + 1 : 0
    updateSeries(seriesId, { data: [...s.data, { x: newX, y: 50 }] })
  }

  const updatePoint = (seriesId: string, index: number, updates: Partial<DataPoint>) => {
    const s = series.find(s => s.id === seriesId)
    if (!s) return
    const newData = s.data.map((p, i) => i === index ? { ...p, ...updates } : p)
    updateSeries(seriesId, { data: newData })
  }

  const deletePoint = (seriesId: string, index: number) => {
    const s = series.find(s => s.id === seriesId)
    if (!s || s.data.length <= 2) return
    updateSeries(seriesId, { data: s.data.filter((_, i) => i !== index) })
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
        a.download = 'line-chart.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const getPath = (data: DataPoint[], isArea = false) => {
    if (data.length < 2) return ''
    const sortedData = [...data].sort((a, b) => a.x - b.x)

    if (smooth) {
      const points = sortedData.map(p => ({ x: scaleX(p.x), y: scaleY(p.y) }))
      let path = `M ${points[0].x} ${points[0].y}`

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? i : i - 1]
        const p1 = points[i]
        const p2 = points[i + 1]
        const p3 = points[i + 2 < points.length ? i + 2 : i + 1]

        const cp1x = p1.x + (p2.x - p0.x) / 6
        const cp1y = p1.y + (p2.y - p0.y) / 6
        const cp2x = p2.x - (p3.x - p1.x) / 6
        const cp2y = p2.y - (p3.y - p1.y) / 6

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
      }

      if (isArea) {
        path += ` L ${scaleX(sortedData[sortedData.length - 1].x)} ${chartPadding.top + chartHeight}`
        path += ` L ${scaleX(sortedData[0].x)} ${chartPadding.top + chartHeight} Z`
      }

      return path
    }

    let path = sortedData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ')

    if (isArea) {
      path += ` L ${scaleX(sortedData[sortedData.length - 1].x)} ${chartPadding.top + chartHeight}`
      path += ` L ${scaleX(sortedData[0].x)} ${chartPadding.top + chartHeight} Z`
    }

    return path
  }

  const renderGrid = () => {
    const lines: JSX.Element[] = []
    const numLines = 5

    for (let i = 0; i <= numLines; i++) {
      const y = chartPadding.top + (i / numLines) * chartHeight
      const value = Math.round(maxY - (i / numLines) * maxY)
      lines.push(
        <g key={`h-${i}`}>
          <line x1={chartPadding.left} y1={y} x2={chartPadding.left + chartWidth} y2={y} stroke="#e2e8f0" strokeDasharray="4,4" />
          <text x={chartPadding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{value}</text>
        </g>
      )
    }

    for (let i = 0; i <= numLines; i++) {
      const x = chartPadding.left + (i / numLines) * chartWidth
      const value = Math.round((i / numLines) * maxX)
      lines.push(
        <g key={`v-${i}`}>
          <line x1={x} y1={chartPadding.top} x2={x} y2={chartPadding.top + chartHeight} stroke="#e2e8f0" strokeDasharray="4,4" />
          <text x={x} y={chartPadding.top + chartHeight + 20} textAnchor="middle" fontSize="10" fill="#94a3b8">{value}</text>
        </g>
      )
    }

    return lines
  }

  const selectedSeries = selectedSeriesId ? series.find(s => s.id === selectedSeriesId) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={addSeries}>{t('tools.lineChart.addSeries')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showPoints} onChange={(e) => setShowPoints(e.target.checked)} className="rounded" />
            {t('tools.lineChart.showPoints')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="rounded" />
            {t('tools.lineChart.showGrid')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={smooth} onChange={(e) => setSmooth(e.target.checked)} className="rounded" />
            {t('tools.lineChart.smooth')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showArea} onChange={(e) => setShowArea(e.target.checked)} className="rounded" />
            {t('tools.lineChart.area')}
          </label>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner" onClick={() => setSelectedSeriesId(null)}>
          <svg ref={svgRef} viewBox="0 0 600 400" className="w-full select-none">
            <rect width="600" height="400" fill="white" />

            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + chartHeight} stroke="#cbd5e1" strokeWidth="2" />
            <line x1={chartPadding.left} y1={chartPadding.top + chartHeight} x2={chartPadding.left + chartWidth} y2={chartPadding.top + chartHeight} stroke="#cbd5e1" strokeWidth="2" />

            {showGrid && renderGrid()}

            {series.map(s => (
              <g key={s.id} onClick={(e) => { e.stopPropagation(); setSelectedSeriesId(s.id) }} className="cursor-pointer">
                {showArea && (
                  <path d={getPath(s.data, true)} fill={s.color} opacity="0.2" />
                )}
                <path d={getPath(s.data)} stroke={s.color} strokeWidth={selectedSeriesId === s.id ? 3 : 2} fill="none" />
                {showPoints && s.data.map((p, i) => (
                  <circle key={i} cx={scaleX(p.x)} cy={scaleY(p.y)} r={selectedSeriesId === s.id ? 5 : 4} fill={s.color} stroke="white" strokeWidth="2" />
                ))}
              </g>
            ))}

            <g transform={`translate(${chartPadding.left + 10}, ${chartPadding.top + 10})`}>
              {series.map((s, i) => (
                <g key={s.id} transform={`translate(0, ${i * 20})`}>
                  <line x1="0" y1="0" x2="20" y2="0" stroke={s.color} strokeWidth="2" />
                  <circle cx="10" cy="0" r="3" fill={s.color} />
                  <text x="28" y="4" fontSize="11" fill="#1e293b">{s.name}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        <div className="w-72 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.lineChart.properties')}</h3>

          {selectedSeries ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.lineChart.seriesName')}</label>
                <input type="text" value={selectedSeries.name} onChange={(e) => updateSeries(selectedSeriesId!, { name: e.target.value })} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.lineChart.color')}</label>
                <div className="flex gap-1 flex-wrap">
                  {COLORS.map(color => (
                    <button key={color} className={`w-6 h-6 rounded ${selectedSeries.color === color ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`} style={{ backgroundColor: color }} onClick={() => updateSeries(selectedSeriesId!, { color })} />
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-slate-500">{t('tools.lineChart.dataPoints')}</label>
                  <button onClick={() => addPoint(selectedSeriesId!)} className="text-xs text-primary-600 hover:text-primary-700">+ {t('tools.lineChart.addPoint')}</button>
                </div>
                <div className="space-y-2 max-h-40 overflow-auto">
                  {selectedSeries.data.map((p, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="number" value={p.x} onChange={(e) => updatePoint(selectedSeriesId!, i, { x: parseFloat(e.target.value) || 0 })} className="input w-16 text-xs py-1" placeholder="X" />
                      <input type="number" value={p.y} onChange={(e) => updatePoint(selectedSeriesId!, i, { y: parseFloat(e.target.value) || 0 })} className="input w-16 text-xs py-1" placeholder="Y" />
                      {selectedSeries.data.length > 2 && (
                        <button onClick={() => deletePoint(selectedSeriesId!, i)} className="text-red-500 hover:text-red-600 text-xs">×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {series.length > 1 && (
                <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteSeries(selectedSeriesId!)}>
                  {t('tools.lineChart.deleteSeries')}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400">{t('tools.lineChart.selectHint')}</div>
          )}
        </div>
      </div>
    </div>
  )
}
