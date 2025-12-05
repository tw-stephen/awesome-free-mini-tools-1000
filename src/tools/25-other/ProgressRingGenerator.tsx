import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Ring {
  id: string
  label: string
  value: number
  maxValue: number
  color: string
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function ProgressRingGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [rings, setRings] = useState<Ring[]>([
    { id: '1', label: 'Progress A', value: 75, maxValue: 100, color: COLORS[0] },
    { id: '2', label: 'Progress B', value: 60, maxValue: 100, color: COLORS[1] },
    { id: '3', label: 'Progress C', value: 45, maxValue: 100, color: COLORS[2] }
  ])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showLabels, setShowLabels] = useState(true)
  const [showPercentages, setShowPercentages] = useState(true)
  const [ringWidth, setRingWidth] = useState(20)

  const centerX = 200
  const centerY = 200
  const baseRadius = 150
  const ringGap = 8

  const describeArc = (radius: number, startAngle: number, endAngle: number) => {
    const start = {
      x: centerX + Math.cos(startAngle) * radius,
      y: centerY + Math.sin(startAngle) * radius
    }
    const end = {
      x: centerX + Math.cos(endAngle) * radius,
      y: centerY + Math.sin(endAngle) * radius
    }
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const addRing = () => {
    if (rings.length >= 6) return
    const newId = Date.now().toString()
    const colorIndex = rings.length % COLORS.length
    setRings([...rings, {
      id: newId,
      label: `Progress ${String.fromCharCode(65 + rings.length)}`,
      value: 50,
      maxValue: 100,
      color: COLORS[colorIndex]
    }])
  }

  const updateRing = (id: string, updates: Partial<Ring>) => {
    setRings(rings.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  const deleteRing = (id: string) => {
    if (rings.length <= 1) return
    setRings(rings.filter(r => r.id !== id))
    setSelectedId(null)
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
        a.download = 'progress-rings.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const selectedRing = selectedId ? rings.find(r => r.id === selectedId) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={addRing} disabled={rings.length >= 6}>{t('tools.progressRing.addRing')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="rounded" />
            {t('tools.progressRing.showLabels')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showPercentages} onChange={(e) => setShowPercentages(e.target.checked)} className="rounded" />
            {t('tools.progressRing.showPercentages')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            {t('tools.progressRing.width')}:
            <input type="range" min="10" max="40" value={ringWidth} onChange={(e) => setRingWidth(parseInt(e.target.value))} className="w-20" />
          </label>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner p-4" onClick={() => setSelectedId(null)}>
          <svg ref={svgRef} viewBox="0 0 500 450" className="w-full select-none">
            <rect width="500" height="450" fill="white" />

            {rings.map((ring, index) => {
              const radius = baseRadius - index * (ringWidth + ringGap)
              const percentage = ring.maxValue > 0 ? ring.value / ring.maxValue : 0
              const startAngle = -Math.PI / 2
              const endAngle = startAngle + percentage * Math.PI * 2
              const isSelected = selectedId === ring.id

              return (
                <g key={ring.id} onClick={(e) => { e.stopPropagation(); setSelectedId(ring.id) }} className="cursor-pointer">
                  {/* Background circle */}
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={ringWidth}
                  />
                  {/* Progress arc */}
                  <path
                    d={describeArc(radius, startAngle, endAngle)}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={ringWidth}
                    strokeLinecap="round"
                    style={{
                      filter: isSelected ? 'brightness(1.1)' : 'none'
                    }}
                  />
                  {isSelected && (
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r={radius}
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth={2}
                      strokeDasharray="4,4"
                    />
                  )}
                </g>
              )
            })}

            {/* Center text */}
            {showPercentages && rings.length > 0 && (
              <g>
                <text
                  x={centerX}
                  y={centerY - 10}
                  textAnchor="middle"
                  fontSize="32"
                  fontWeight="bold"
                  fill="#1e293b"
                >
                  {Math.round((rings[0].value / rings[0].maxValue) * 100)}%
                </text>
                <text
                  x={centerX}
                  y={centerY + 20}
                  textAnchor="middle"
                  fontSize="14"
                  fill="#64748b"
                >
                  {rings[0].label}
                </text>
              </g>
            )}

            {/* Legend */}
            {showLabels && (
              <g transform="translate(20, 380)">
                {rings.map((ring, i) => (
                  <g key={ring.id} transform={`translate(${i * 150}, 0)`}>
                    <rect width="12" height="12" rx="2" fill={ring.color} />
                    <text x="18" y="10" fontSize="11" fill="#1e293b">
                      {ring.label.length > 12 ? ring.label.slice(0, 12) + '..' : ring.label}
                    </text>
                    <text x="18" y="24" fontSize="10" fill="#64748b">
                      {ring.value}/{ring.maxValue}
                    </text>
                  </g>
                ))}
              </g>
            )}
          </svg>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.progressRing.properties')}</h3>

          {selectedRing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.progressRing.label')}</label>
                <input type="text" value={selectedRing.label} onChange={(e) => updateRing(selectedId!, { label: e.target.value })} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.progressRing.value')} ({selectedRing.value})</label>
                <input type="range" min="0" max={selectedRing.maxValue} value={selectedRing.value} onChange={(e) => updateRing(selectedId!, { value: parseInt(e.target.value) })} className="w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.progressRing.maxValue')}</label>
                <input type="number" min="1" value={selectedRing.maxValue} onChange={(e) => updateRing(selectedId!, { maxValue: Math.max(1, parseInt(e.target.value) || 100) })} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.progressRing.color')}</label>
                <div className="flex gap-1 flex-wrap">
                  {COLORS.map(color => (
                    <button key={color} className={`w-6 h-6 rounded ${selectedRing.color === color ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`} style={{ backgroundColor: color }} onClick={() => updateRing(selectedId!, { color })} />
                  ))}
                </div>
              </div>
              {rings.length > 1 && (
                <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteRing(selectedId!)}>
                  {t('tools.progressRing.delete')}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400">{t('tools.progressRing.selectHint')}</div>
          )}

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.progressRing.summary')}</h4>
            <div className="space-y-2">
              {rings.map(ring => (
                <div key={ring.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ring.color }} />
                  <span className="flex-1 text-xs truncate">{ring.label}</span>
                  <span className="text-xs text-slate-500">{Math.round((ring.value / ring.maxValue) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
