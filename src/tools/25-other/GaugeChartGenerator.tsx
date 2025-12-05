import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface GaugeRange {
  id: string
  min: number
  max: number
  color: string
  label: string
}

export default function GaugeChartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [value, setValue] = useState(72)
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(100)
  const [title, setTitle] = useState('Performance')
  const [unit, setUnit] = useState('%')

  const [ranges, setRanges] = useState<GaugeRange[]>([
    { id: '1', min: 0, max: 30, color: '#ef4444', label: 'Low' },
    { id: '2', min: 30, max: 70, color: '#f59e0b', label: 'Medium' },
    { id: '3', min: 70, max: 100, color: '#22c55e', label: 'High' }
  ])

  const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null)
  const [showLabels, setShowLabels] = useState(true)

  const centerX = 200
  const centerY = 180
  const radius = 140
  const innerRadius = 100
  const startAngle = Math.PI * 0.75
  const endAngle = Math.PI * 2.25

  const valueToAngle = (val: number) => {
    const normalizedValue = (val - minValue) / (maxValue - minValue)
    return startAngle + normalizedValue * (endAngle - startAngle)
  }

  const polarToCartesian = (angle: number, r: number) => ({
    x: centerX + Math.cos(angle) * r,
    y: centerY + Math.sin(angle) * r
  })

  const describeArc = (startVal: number, endVal: number, outerR: number, innerR: number) => {
    const start = valueToAngle(startVal)
    const end = valueToAngle(endVal)
    const largeArc = end - start > Math.PI ? 1 : 0

    const outerStart = polarToCartesian(start, outerR)
    const outerEnd = polarToCartesian(end, outerR)
    const innerStart = polarToCartesian(start, innerR)
    const innerEnd = polarToCartesian(end, innerR)

    return `
      M ${outerStart.x} ${outerStart.y}
      A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}
      L ${innerEnd.x} ${innerEnd.y}
      A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}
      Z
    `
  }

  const addRange = () => {
    const newId = Date.now().toString()
    const lastRange = ranges[ranges.length - 1]
    if (lastRange && lastRange.max < maxValue) {
      setRanges([...ranges, {
        id: newId,
        min: lastRange.max,
        max: maxValue,
        color: '#3b82f6',
        label: 'New Range'
      }])
    }
  }

  const updateRange = (id: string, updates: Partial<GaugeRange>) => {
    setRanges(ranges.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  const deleteRange = (id: string) => {
    if (ranges.length <= 1) return
    setRanges(ranges.filter(r => r.id !== id))
    setSelectedRangeId(null)
  }

  const downloadImage = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = 400
    canvas.height = 300
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const a = document.createElement('a')
        a.download = 'gauge-chart.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const getCurrentRangeColor = () => {
    for (const range of ranges) {
      if (value >= range.min && value <= range.max) {
        return range.color
      }
    }
    return '#64748b'
  }

  const needleAngle = valueToAngle(Math.max(minValue, Math.min(maxValue, value)))
  const needleTip = polarToCartesian(needleAngle, radius - 15)
  const needleBase1 = polarToCartesian(needleAngle - Math.PI / 2, 8)
  const needleBase2 = polarToCartesian(needleAngle + Math.PI / 2, 8)

  const selectedRange = selectedRangeId ? ranges.find(r => r.id === selectedRangeId) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={addRange}>{t('tools.gaugeChart.addRange')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="rounded" />
            {t('tools.gaugeChart.showLabels')}
          </label>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner p-4" onClick={() => setSelectedRangeId(null)}>
          <svg ref={svgRef} viewBox="0 0 400 300" className="w-full select-none">
            <rect width="400" height="300" fill="white" />

            {/* Background arc */}
            <path d={describeArc(minValue, maxValue, radius, innerRadius)} fill="#e2e8f0" />

            {/* Range arcs */}
            {ranges.map(range => (
              <path
                key={range.id}
                d={describeArc(range.min, range.max, radius, innerRadius)}
                fill={range.color}
                stroke={selectedRangeId === range.id ? '#1e293b' : 'none'}
                strokeWidth={selectedRangeId === range.id ? 2 : 0}
                onClick={(e) => { e.stopPropagation(); setSelectedRangeId(range.id) }}
                className="cursor-pointer"
                opacity="0.9"
              />
            ))}

            {/* Tick marks */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const val = minValue + ratio * (maxValue - minValue)
              const angle = valueToAngle(val)
              const outer = polarToCartesian(angle, radius + 5)
              const inner = polarToCartesian(angle, radius - 5)
              const label = polarToCartesian(angle, radius + 20)
              return (
                <g key={i}>
                  <line x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} stroke="#64748b" strokeWidth="2" />
                  <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#64748b">
                    {Math.round(val)}
                  </text>
                </g>
              )
            })}

            {/* Range labels */}
            {showLabels && ranges.map(range => {
              const midVal = (range.min + range.max) / 2
              const angle = valueToAngle(midVal)
              const pos = polarToCartesian(angle, (radius + innerRadius) / 2)
              return (
                <text
                  key={range.id}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fontWeight="500"
                  fill="white"
                >
                  {range.label}
                </text>
              )
            })}

            {/* Needle */}
            <polygon
              points={`${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
              fill={getCurrentRangeColor()}
              stroke="#1e293b"
              strokeWidth="1"
            />
            <circle cx={centerX} cy={centerY} r="12" fill="#1e293b" />
            <circle cx={centerX} cy={centerY} r="6" fill="white" />

            {/* Value display */}
            <text x={centerX} y={centerY + 50} textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1e293b">
              {value}{unit}
            </text>
            <text x={centerX} y={centerY + 75} textAnchor="middle" fontSize="14" fill="#64748b">
              {title}
            </text>
          </svg>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.gaugeChart.properties')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.gaugeChart.value')} ({value})</label>
              <input type="range" min={minValue} max={maxValue} value={value} onChange={(e) => setValue(parseInt(e.target.value))} className="w-full" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gaugeChart.min')}</label>
                <input type="number" value={minValue} onChange={(e) => setMinValue(parseInt(e.target.value) || 0)} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gaugeChart.max')}</label>
                <input type="number" value={maxValue} onChange={(e) => setMaxValue(parseInt(e.target.value) || 100)} className="input w-full" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.gaugeChart.title')}</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input w-full" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.gaugeChart.unit')}</label>
              <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} className="input w-full" />
            </div>
          </div>

          {selectedRange && (
            <div className="border-t border-slate-200 pt-4 space-y-4">
              <h4 className="text-xs font-medium text-slate-500">{t('tools.gaugeChart.rangeSettings')}</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.gaugeChart.rangeMin')}</label>
                  <input type="number" value={selectedRange.min} onChange={(e) => updateRange(selectedRangeId!, { min: parseInt(e.target.value) || 0 })} className="input w-full" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.gaugeChart.rangeMax')}</label>
                  <input type="number" value={selectedRange.max} onChange={(e) => updateRange(selectedRangeId!, { max: parseInt(e.target.value) || 0 })} className="input w-full" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gaugeChart.label')}</label>
                <input type="text" value={selectedRange.label} onChange={(e) => updateRange(selectedRangeId!, { label: e.target.value })} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gaugeChart.color')}</label>
                <input type="color" value={selectedRange.color} onChange={(e) => updateRange(selectedRangeId!, { color: e.target.value })} className="w-full h-8 rounded cursor-pointer" />
              </div>
              {ranges.length > 1 && (
                <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteRange(selectedRangeId!)}>
                  {t('tools.gaugeChart.deleteRange')}
                </Button>
              )}
            </div>
          )}

          {!selectedRange && (
            <div className="text-sm text-slate-400">{t('tools.gaugeChart.selectHint')}</div>
          )}
        </div>
      </div>
    </div>
  )
}
