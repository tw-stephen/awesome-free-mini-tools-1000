import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface FunnelStage {
  id: string
  label: string
  value: number
  color: string
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899']

export default function FunnelChartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [stages, setStages] = useState<FunnelStage[]>([
    { id: '1', label: 'Visitors', value: 10000, color: COLORS[0] },
    { id: '2', label: 'Leads', value: 6000, color: COLORS[1] },
    { id: '3', label: 'Prospects', value: 3500, color: COLORS[2] },
    { id: '4', label: 'Opportunities', value: 1800, color: COLORS[3] },
    { id: '5', label: 'Customers', value: 800, color: COLORS[4] }
  ])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showValues, setShowValues] = useState(true)
  const [showPercentages, setShowPercentages] = useState(true)

  const maxValue = Math.max(...stages.map(s => s.value), 1)
  const chartWidth = 500
  const chartHeight = 400
  const stageHeight = chartHeight / stages.length
  const minWidth = 80

  const addStage = () => {
    const newId = Date.now().toString()
    const colorIndex = stages.length % COLORS.length
    const lastValue = stages.length > 0 ? stages[stages.length - 1].value : 1000
    setStages([...stages, {
      id: newId,
      label: `Stage ${stages.length + 1}`,
      value: Math.max(Math.floor(lastValue * 0.6), 100),
      color: COLORS[colorIndex]
    }])
  }

  const updateStage = (id: string, updates: Partial<FunnelStage>) => {
    setStages(stages.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteStage = (id: string) => {
    if (stages.length <= 2) return
    setStages(stages.filter(s => s.id !== id))
    setSelectedId(null)
  }

  const moveStage = (id: string, direction: 'up' | 'down') => {
    const index = stages.findIndex(s => s.id === id)
    if (direction === 'up' && index > 0) {
      const newStages = [...stages]
      ;[newStages[index - 1], newStages[index]] = [newStages[index], newStages[index - 1]]
      setStages(newStages)
    } else if (direction === 'down' && index < stages.length - 1) {
      const newStages = [...stages]
      ;[newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]]
      setStages(newStages)
    }
  }

  const downloadImage = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = 600
    canvas.height = 450
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const a = document.createElement('a')
        a.download = 'funnel-chart.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const getStageWidth = (value: number) => {
    return minWidth + ((chartWidth - minWidth) * (value / maxValue))
  }

  const selectedStage = selectedId ? stages.find(s => s.id === selectedId) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={addStage}>{t('tools.funnelChart.addStage')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showValues} onChange={(e) => setShowValues(e.target.checked)} className="rounded" />
            {t('tools.funnelChart.showValues')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={showPercentages} onChange={(e) => setShowPercentages(e.target.checked)} className="rounded" />
            {t('tools.funnelChart.showPercentages')}
          </label>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner p-4" onClick={() => setSelectedId(null)}>
          <svg ref={svgRef} viewBox="0 0 600 450" className="w-full select-none">
            <rect width="600" height="450" fill="white" />

            {stages.map((stage, index) => {
              const width = getStageWidth(stage.value)
              const nextWidth = index < stages.length - 1 ? getStageWidth(stages[index + 1].value) : width * 0.7
              const y = 30 + index * stageHeight
              const centerX = 300
              const isSelected = selectedId === stage.id
              const percentage = index === 0 ? 100 : Math.round((stage.value / stages[0].value) * 100)
              const conversionRate = index > 0 ? Math.round((stage.value / stages[index - 1].value) * 100) : null

              const path = `
                M ${centerX - width / 2} ${y}
                L ${centerX + width / 2} ${y}
                L ${centerX + nextWidth / 2} ${y + stageHeight}
                L ${centerX - nextWidth / 2} ${y + stageHeight}
                Z
              `

              return (
                <g key={stage.id} onClick={(e) => { e.stopPropagation(); setSelectedId(stage.id) }} className="cursor-pointer">
                  <path
                    d={path}
                    fill={stage.color}
                    stroke={isSelected ? '#1e293b' : 'white'}
                    strokeWidth={isSelected ? 3 : 2}
                    opacity="0.9"
                  />
                  <text
                    x={centerX}
                    y={y + stageHeight / 2 - 8}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="600"
                    fill="white"
                  >
                    {stage.label}
                  </text>
                  {showValues && (
                    <text
                      x={centerX}
                      y={y + stageHeight / 2 + 10}
                      textAnchor="middle"
                      fontSize="12"
                      fill="white"
                      opacity="0.9"
                    >
                      {stage.value.toLocaleString()}
                      {showPercentages && ` (${percentage}%)`}
                    </text>
                  )}
                  {conversionRate !== null && (
                    <text
                      x={centerX + width / 2 + 15}
                      y={y + 15}
                      fontSize="10"
                      fill="#64748b"
                    >
                      ↓ {conversionRate}%
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.funnelChart.properties')}</h3>

          {selectedStage ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.funnelChart.label')}</label>
                <input type="text" value={selectedStage.label} onChange={(e) => updateStage(selectedId!, { label: e.target.value })} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.funnelChart.value')}</label>
                <input type="number" min="1" value={selectedStage.value} onChange={(e) => updateStage(selectedId!, { value: Math.max(1, parseInt(e.target.value) || 1) })} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.funnelChart.color')}</label>
                <div className="flex gap-1 flex-wrap">
                  {COLORS.map(color => (
                    <button key={color} className={`w-6 h-6 rounded ${selectedStage.color === color ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`} style={{ backgroundColor: color }} onClick={() => updateStage(selectedId!, { color })} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1 text-xs" onClick={() => moveStage(selectedId!, 'up')}>↑ {t('tools.funnelChart.moveUp')}</Button>
                <Button variant="secondary" className="flex-1 text-xs" onClick={() => moveStage(selectedId!, 'down')}>↓ {t('tools.funnelChart.moveDown')}</Button>
              </div>
              {stages.length > 2 && (
                <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteStage(selectedId!)}>
                  {t('tools.funnelChart.delete')}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400">{t('tools.funnelChart.selectHint')}</div>
          )}

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.funnelChart.summary')}</h4>
            <div className="space-y-1 text-xs">
              {stages.map((stage) => (
                <div key={stage.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: stage.color }} />
                  <span className="flex-1 truncate">{stage.label}</span>
                  <span className="text-slate-500">{Math.round((stage.value / stages[0].value) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
