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

export default function AreaChartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [series, setSeries] = useState<DataSeries[]>([
    {
      id: '1',
      name: 'Series A',
      color: COLORS[0],
      data: [
        { x: 0, y: 20 }, { x: 1, y: 45 }, { x: 2, y: 35 }, { x: 3, y: 60 },
        { x: 4, y: 50 }, { x: 5, y: 75 }, { x: 6, y: 65 }
      ]
    },
    {
      id: '2',
      name: 'Series B',
      color: COLORS[1],
      data: [
        { x: 0, y: 10 }, { x: 1, y: 25 }, { x: 2, y: 40 }, { x: 3, y: 30 },
        { x: 4, y: 55 }, { x: 5, y: 45 }, { x: 6, y: 60 }
      ]
    }
  ])

  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null)
  const [stacked, setStacked] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [opacity, setOpacity] = useState(0.6)

  const chartPadding = { top: 40, right: 40, bottom: 60, left: 60 }
  const chartWidth = 600 - chartPadding.left - chartPadding.right
  const chartHeight = 400 - chartPadding.top - chartPadding.bottom

  const allPoints = series.flatMap(s => s.data)
  const maxX = Math.max(...allPoints.map(p => p.x), 1)

  const getStackedMaxY = () => {
    if (!stacked) return Math.max(...allPoints.map(p => p.y), 1)
    const xValues = [...new Set(allPoints.map(p => p.x))].sort((a, b) => a - b)
    let max = 0
    xValues.forEach(x => {
      const sum = series.reduce((acc, s) => {
        const point = s.data.find(p => p.x === x)
        return acc + (point?.y || 0)
      }, 0)
      if (sum > max) max = sum
    })
    return max
  }

  const maxY = getStackedMaxY()

  const scaleX = (x: number) => chartPadding.left + (x / maxX) * chartWidth
  const scaleY = (y: number) => chartPadding.top + chartHeight - (y / maxY) * chartHeight

  const addSeries = () => {
    const newId = Date.now().toString()
    const colorIndex = series.length % COLORS.length
    setSeries([...series, {
      id: newId,
      name: `Series ${String.fromCharCode(65 + series.length)}`,
      color: COLORS[colorIndex],
      data: [{ x: 0, y: 30 }, { x: 1, y: 50 }, { x: 2, y: 40 }, { x: 3, y: 60 }]
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
        a.download = 'area-chart.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const getAreaPath = (seriesIndex: number) => {
    const s = series[seriesIndex]
    const sortedData = [...s.data].sort((a, b) => a.x - b.x)

    if (stacked && seriesIndex > 0) {
      const points: string[] = []
      const bottomPoints: string[] = []

      sortedData.forEach(point => {
        let baseY = 0
        for (let i = 0; i < seriesIndex; i++) {
          const prevPoint = series[i].data.find(p => p.x === point.x)
          baseY += prevPoint?.y || 0
        }
        points.push(`${scaleX(point.x)},${scaleY(baseY + point.y)}`)
        bottomPoints.unshift(`${scaleX(point.x)},${scaleY(baseY)}`)
      })

      return `M ${points.join(' L ')} L ${bottomPoints.join(' L ')} Z`
    }

    const points = sortedData.map(p => `${scaleX(p.x)},${scaleY(p.y)}`).join(' L ')
    return `M ${points} L ${scaleX(sortedData[sortedData.length - 1].x)},${chartPadding.top + chartHeight} L ${scaleX(sortedData[0].x)},${chartPadding.top + chartHeight} Z`
  }

  const getLinePath = (seriesIndex: number) => {
    const s = series[seriesIndex]
    const sortedData = [...s.data].sort((a, b) => a.x - b.x)

    if (stacked && seriesIndex > 0) {
      return sortedData.map((point, i) => {
        let baseY = 0
        for (let j = 0; j < seriesIndex; j++) {
          const prevPoint = series[j].data.find(p => p.x === point.x)
          baseY += prevPoint?.y || 0
        }
        return `${i === 0 ? 'M' : 'L'} ${scaleX(point.x)},${scaleY(baseY + point.y)}`
      }).join(' ')
    }

    return sortedData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)},${scaleY(p.y)}`).join(' ')
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
        <Button variant="secondary" onClick={addSeries}>{t('tools.areaChart.addSeries')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={stacked} onChange={(e) => setStacked(e.target.checked)} className="rounded" />
            {t('tools.areaChart.stacked')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="rounded" />
            {t('tools.areaChart.showGrid')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            {t('tools.areaChart.opacity')}:
            <input type="range" min="10" max="100" value={opacity * 100} onChange={(e) => setOpacity(parseInt(e.target.value) / 100)} className="w-20" />
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

            {series.map((s, idx) => (
              <g key={s.id} onClick={(e) => { e.stopPropagation(); setSelectedSeriesId(s.id) }} className="cursor-pointer">
                <path d={getAreaPath(idx)} fill={s.color} opacity={opacity} />
                <path d={getLinePath(idx)} stroke={s.color} strokeWidth={selectedSeriesId === s.id ? 3 : 2} fill="none" />
              </g>
            ))}

            <g transform={`translate(${chartPadding.left + 10}, ${chartPadding.top + 10})`}>
              {series.map((s, i) => (
                <g key={s.id} transform={`translate(0, ${i * 20})`}>
                  <rect width="16" height="12" rx="2" fill={s.color} opacity={opacity} />
                  <text x="22" y="10" fontSize="11" fill="#1e293b">{s.name}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        <div className="w-72 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.areaChart.properties')}</h3>

          {selectedSeries ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.areaChart.seriesName')}</label>
                <input type="text" value={selectedSeries.name} onChange={(e) => updateSeries(selectedSeriesId!, { name: e.target.value })} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.areaChart.color')}</label>
                <div className="flex gap-1 flex-wrap">
                  {COLORS.map(color => (
                    <button key={color} className={`w-6 h-6 rounded ${selectedSeries.color === color ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`} style={{ backgroundColor: color }} onClick={() => updateSeries(selectedSeriesId!, { color })} />
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-slate-500">{t('tools.areaChart.dataPoints')}</label>
                  <button onClick={() => addPoint(selectedSeriesId!)} className="text-xs text-primary-600 hover:text-primary-700">+ {t('tools.areaChart.addPoint')}</button>
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
                  {t('tools.areaChart.deleteSeries')}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400">{t('tools.areaChart.selectHint')}</div>
          )}
        </div>
      </div>
    </div>
  )
}
