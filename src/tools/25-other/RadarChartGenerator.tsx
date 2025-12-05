import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface DataSeries {
  id: string
  name: string
  color: string
  values: number[]
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899']

export default function RadarChartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [axes, setAxes] = useState(['Speed', 'Power', 'Defense', 'Stamina', 'Skill', 'Luck'])
  const [series, setSeries] = useState<DataSeries[]>([
    { id: '1', name: 'Player A', color: COLORS[0], values: [80, 65, 70, 85, 75, 60] },
    { id: '2', name: 'Player B', color: COLORS[1], values: [60, 85, 80, 55, 90, 70] }
  ])

  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [fillOpacity, setFillOpacity] = useState(0.3)

  const centerX = 250
  const centerY = 220
  const radius = 150
  const maxValue = 100

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2
    const r = (value / maxValue) * radius
    return {
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r
    }
  }

  const getPolygonPoints = (values: number[]) => {
    return values.map((v, i) => {
      const point = getPoint(i, v)
      return `${point.x},${point.y}`
    }).join(' ')
  }

  const addSeries = () => {
    const newId = Date.now().toString()
    const colorIndex = series.length % COLORS.length
    setSeries([...series, {
      id: newId,
      name: `Series ${String.fromCharCode(65 + series.length)}`,
      color: COLORS[colorIndex],
      values: axes.map(() => 50)
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

  const updateValue = (seriesId: string, index: number, value: number) => {
    const s = series.find(s => s.id === seriesId)
    if (!s) return
    const newValues = [...s.values]
    newValues[index] = Math.max(0, Math.min(100, value))
    updateSeries(seriesId, { values: newValues })
  }

  const addAxis = () => {
    const newAxisName = `Axis ${axes.length + 1}`
    setAxes([...axes, newAxisName])
    setSeries(series.map(s => ({ ...s, values: [...s.values, 50] })))
  }

  const updateAxis = (index: number, name: string) => {
    const newAxes = [...axes]
    newAxes[index] = name
    setAxes(newAxes)
  }

  const deleteAxis = (index: number) => {
    if (axes.length <= 3) return
    setAxes(axes.filter((_, i) => i !== index))
    setSeries(series.map(s => ({ ...s, values: s.values.filter((_, i) => i !== index) })))
  }

  const downloadImage = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = 500
    canvas.height = 450
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const a = document.createElement('a')
        a.download = 'radar-chart.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const renderGrid = () => {
    const elements: JSX.Element[] = []
    const levels = 5

    // Concentric polygons
    for (let level = 1; level <= levels; level++) {
      const points = axes.map((_, i) => {
        const point = getPoint(i, (level / levels) * maxValue)
        return `${point.x},${point.y}`
      }).join(' ')
      elements.push(
        <polygon key={`level-${level}`} points={points} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      )
    }

    // Axis lines
    axes.forEach((_, i) => {
      const point = getPoint(i, maxValue)
      elements.push(
        <line key={`axis-${i}`} x1={centerX} y1={centerY} x2={point.x} y2={point.y} stroke="#cbd5e1" strokeWidth="1" />
      )
    })

    return elements
  }

  const renderLabels = () => {
    return axes.map((axis, i) => {
      const point = getPoint(i, maxValue + 15)
      return (
        <text
          key={i}
          x={point.x}
          y={point.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fill="#475569"
          fontWeight="500"
        >
          {axis.length > 10 ? axis.slice(0, 10) + '..' : axis}
        </text>
      )
    })
  }

  const selectedSeries = selectedSeriesId ? series.find(s => s.id === selectedSeriesId) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={addSeries}>{t('tools.radarChart.addSeries')}</Button>
        <Button variant="secondary" onClick={addAxis}>{t('tools.radarChart.addAxis')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="rounded" />
            {t('tools.radarChart.showGrid')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="rounded" />
            {t('tools.radarChart.showLabels')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            {t('tools.radarChart.opacity')}:
            <input type="range" min="0" max="100" value={fillOpacity * 100} onChange={(e) => setFillOpacity(parseInt(e.target.value) / 100)} className="w-20" />
          </label>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner" onClick={() => setSelectedSeriesId(null)}>
          <svg ref={svgRef} viewBox="0 0 500 450" className="w-full select-none">
            <rect width="500" height="450" fill="white" />

            {showGrid && renderGrid()}
            {showLabels && renderLabels()}

            {series.map(s => (
              <g key={s.id} onClick={(e) => { e.stopPropagation(); setSelectedSeriesId(s.id) }} className="cursor-pointer">
                <polygon
                  points={getPolygonPoints(s.values)}
                  fill={s.color}
                  fillOpacity={fillOpacity}
                  stroke={s.color}
                  strokeWidth={selectedSeriesId === s.id ? 3 : 2}
                />
                {s.values.map((v, i) => {
                  const point = getPoint(i, v)
                  return (
                    <circle
                      key={i}
                      cx={point.x}
                      cy={point.y}
                      r={selectedSeriesId === s.id ? 5 : 4}
                      fill={s.color}
                      stroke="white"
                      strokeWidth="2"
                    />
                  )
                })}
              </g>
            ))}

            <g transform="translate(20, 400)">
              {series.map((s, i) => (
                <g key={s.id} transform={`translate(${i * 100}, 0)`}>
                  <rect width="12" height="12" rx="2" fill={s.color} />
                  <text x="18" y="10" fontSize="11" fill="#1e293b">{s.name}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        <div className="w-72 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.radarChart.properties')}</h3>

          {selectedSeries ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.radarChart.seriesName')}</label>
                <input type="text" value={selectedSeries.name} onChange={(e) => updateSeries(selectedSeriesId!, { name: e.target.value })} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.radarChart.color')}</label>
                <div className="flex gap-1 flex-wrap">
                  {COLORS.map(color => (
                    <button key={color} className={`w-6 h-6 rounded ${selectedSeries.color === color ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`} style={{ backgroundColor: color }} onClick={() => updateSeries(selectedSeriesId!, { color })} />
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <label className="text-xs text-slate-500 mb-2 block">{t('tools.radarChart.values')}</label>
                <div className="space-y-2">
                  {axes.map((axis, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-xs text-slate-600 w-20 truncate">{axis}</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedSeries.values[i]}
                        onChange={(e) => updateValue(selectedSeriesId!, i, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs text-slate-500 w-8">{selectedSeries.values[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {series.length > 1 && (
                <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteSeries(selectedSeriesId!)}>
                  {t('tools.radarChart.deleteSeries')}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-slate-400">{t('tools.radarChart.selectHint')}</div>

              <div className="border-t border-slate-200 pt-4">
                <label className="text-xs text-slate-500 mb-2 block">{t('tools.radarChart.axes')}</label>
                <div className="space-y-2">
                  {axes.map((axis, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={axis}
                        onChange={(e) => updateAxis(i, e.target.value)}
                        className="input flex-1 text-xs py-1"
                      />
                      {axes.length > 3 && (
                        <button onClick={() => deleteAxis(i)} className="text-red-500 hover:text-red-600 text-xs">×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
