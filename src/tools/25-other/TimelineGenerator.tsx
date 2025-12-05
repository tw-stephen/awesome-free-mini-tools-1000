import { useState, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
}

export default function TimelineGenerator() {
  const { t } = useTranslation()
  const [events, setEvents] = useState<TimelineEvent[]>([
    { id: '1', date: '2024-01-01', title: 'Start', description: 'Project started' },
    { id: '2', date: '2024-06-01', title: 'Milestone 1', description: 'First release' }
  ])
  const [newEvent, setNewEvent] = useState<Omit<TimelineEvent, 'id'>>({ date: '', title: '', description: '' })
  const svgRef = useRef<SVGSVGElement>(null)

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.date.localeCompare(b.date))
  }, [events])

  const addEvent = () => {
    if (!newEvent.date || !newEvent.title) return
    setEvents([...events, { ...newEvent, id: Date.now().toString() }])
    setNewEvent({ date: '', title: '', description: '' })
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const downloadImage = () => {
    if (!svgRef.current) return
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    // Calculate height based on events
    const height = Math.max(600, sortedEvents.length * 120 + 100)
    const width = 800
    
    canvas.width = width
    canvas.height = height
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = 'timeline.png'
        a.click()
      }
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  // SVG Layout Calculations
  const itemHeight = 120
  const startY = 50
  const svgHeight = Math.max(600, sortedEvents.length * itemHeight + 100)
  const centerX = 400

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Editor Panel */}
      <div className="w-full md:w-1/3 space-y-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">{t('tools.timelineGenerator.addEvent')}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.timelineGenerator.date')}</label>
              <input 
                type="date" 
                value={newEvent.date} 
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.timelineGenerator.title')}</label>
              <input 
                type="text" 
                value={newEvent.title} 
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.timelineGenerator.description')}</label>
              <TextArea 
                value={newEvent.description} 
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={2}
              />
            </div>
            <Button onClick={addEvent} className="w-full">
              {t('tools.timelineGenerator.add')}
            </Button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm max-h-[400px] overflow-y-auto">
          <h3 className="font-semibold text-slate-700 mb-4">{t('tools.timelineGenerator.eventList')}</h3>
          <div className="space-y-2">
            {sortedEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-800">{event.title}</div>
                  <div className="text-xs text-slate-500">{event.date}</div>
                </div>
                <button 
                  onClick={() => deleteEvent(event.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-end mb-4">
          <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
        </div>
        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner overflow-x-auto">
          <svg 
            ref={svgRef}
            width="800" 
            height={svgHeight}
            className="mx-auto bg-white"
          >
            {/* Central Line */}
            <line 
              x1={centerX} 
              y1={startY} 
              x2={centerX} 
              y2={svgHeight - 50} 
              stroke="#cbd5e1" 
              strokeWidth="2" 
            />

            {/* Events */}
            {sortedEvents.map((event, index) => {
              const y = startY + index * itemHeight
              const isLeft = index % 2 === 0
              
              return (
                <g key={event.id}>
                  {/* Dot */}
                  <circle cx={centerX} cy={y} r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
                  
                  {/* Content */}
                  <g transform={`translate(${isLeft ? centerX - 20 : centerX + 20}, ${y})`}>
                    {/* Date Box */}
                    <rect 
                      x={isLeft ? -130 : 0} 
                      y="-15" 
                      width="130" 
                      height="30" 
                      rx="15"
                      fill={isLeft ? "#3b82f6" : "#3b82f6"} 
                    />
                    <text 
                      x={isLeft ? -65 : 65} 
                      y="5" 
                      textAnchor="middle" 
                      fill="white" 
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {event.date}
                    </text>

                    {/* Title & Desc */}
                    <text 
                      x={isLeft ? -150 : 150} 
                      y="5" 
                      textAnchor={isLeft ? "end" : "start"} 
                      fill="#1e293b" 
                      fontSize="16"
                      fontWeight="bold"
                    >
                      {event.title}
                    </text>
                    <text 
                      x={isLeft ? -150 : 150} 
                      y="25" 
                      textAnchor={isLeft ? "end" : "start"} 
                      fill="#64748b" 
                      fontSize="14"
                    >
                      {event.description}
                    </text>
                  </g>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
