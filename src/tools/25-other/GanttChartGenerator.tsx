import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Task {
  id: string
  name: string
  startDate: string
  endDate: string
  color: string
  progress: number
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function GanttChartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const today = new Date()
  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Project Planning', startDate: formatDate(today), endDate: formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)), color: COLORS[0], progress: 100 },
    { id: '2', name: 'Design Phase', startDate: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)), endDate: formatDate(new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)), color: COLORS[1], progress: 60 },
    { id: '3', name: 'Development', startDate: formatDate(new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000)), endDate: formatDate(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)), color: COLORS[2], progress: 20 },
    { id: '4', name: 'Testing', startDate: formatDate(new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000)), endDate: formatDate(new Date(today.getTime() + 35 * 24 * 60 * 60 * 1000)), color: COLORS[3], progress: 0 }
  ])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({ name: '', startDate: formatDate(today), endDate: formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) })

  // Calculate date range
  const allDates = tasks.flatMap(t => [new Date(t.startDate), new Date(t.endDate)])
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())) - 2 * 24 * 60 * 60 * 1000)
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())) + 2 * 24 * 60 * 60 * 1000)
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (24 * 60 * 60 * 1000))

  const chartWidth = 600
  const chartHeight = tasks.length * 50 + 60
  const labelWidth = 150
  const headerHeight = 40
  const rowHeight = 50
  const dayWidth = chartWidth / totalDays

  const getDayPosition = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = Math.floor((date.getTime() - minDate.getTime()) / (24 * 60 * 60 * 1000))
    return days * dayWidth
  }

  const getBarWidth = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1
    return days * dayWidth
  }

  const addTask = () => {
    if (!newTask.name.trim()) return
    const id = Date.now().toString()
    setTasks([...tasks, {
      id,
      name: newTask.name,
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      color: COLORS[tasks.length % COLORS.length],
      progress: 0
    }])
    setNewTask({ name: '', startDate: formatDate(today), endDate: formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) })
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
    setSelectedId(null)
  }

  const downloadImage = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = labelWidth + chartWidth + 40
    canvas.height = chartHeight + 20
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const a = document.createElement('a')
        a.download = 'gantt-chart.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  // Generate date labels
  const dateLabels: { date: Date; x: number }[] = []
  const labelInterval = Math.max(1, Math.floor(totalDays / 10))
  for (let i = 0; i <= totalDays; i += labelInterval) {
    const date = new Date(minDate.getTime() + i * 24 * 60 * 60 * 1000)
    dateLabels.push({ date, x: i * dayWidth })
  }

  const selectedTask = selectedId ? tasks.find(t => t.id === selectedId) : null

  return (
    <div className="flex flex-col gap-4">
      {/* Add Task Form */}
      <div className="flex gap-2 flex-wrap items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-slate-500 mb-1">{t('tools.gantt.taskName')}</label>
          <input
            type="text"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            placeholder={t('tools.gantt.taskNamePlaceholder')}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">{t('tools.gantt.startDate')}</label>
          <input
            type="date"
            value={newTask.startDate}
            onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">{t('tools.gantt.endDate')}</label>
          <input
            type="date"
            value={newTask.endDate}
            onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
            className="input"
          />
        </div>
        <Button onClick={addTask}>{t('tools.gantt.addTask')}</Button>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        {/* Chart */}
        <div className="flex-1 border border-slate-200 rounded-lg bg-white overflow-auto shadow-inner">
          <svg
            ref={svgRef}
            width={labelWidth + chartWidth + 40}
            height={chartHeight + 20}
            className="select-none"
          >
            {/* Background */}
            <rect x="0" y="0" width={labelWidth + chartWidth + 40} height={chartHeight + 20} fill="white" />

            {/* Header */}
            <rect x="0" y="0" width={labelWidth} height={headerHeight} fill="#f1f5f9" />
            <text x="10" y={headerHeight / 2 + 5} fontSize="12" fontWeight="600" fill="#475569">
              {t('tools.gantt.tasks')}
            </text>

            {/* Date header */}
            <rect x={labelWidth} y="0" width={chartWidth} height={headerHeight} fill="#f8fafc" />
            {dateLabels.map(({ date, x }, i) => (
              <text
                key={i}
                x={labelWidth + x + 5}
                y={headerHeight / 2 + 5}
                fontSize="10"
                fill="#64748b"
              >
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </text>
            ))}

            {/* Grid lines */}
            {dateLabels.map(({ x }, i) => (
              <line
                key={i}
                x1={labelWidth + x}
                y1={headerHeight}
                x2={labelWidth + x}
                y2={chartHeight}
                stroke="#e2e8f0"
                strokeDasharray="2,2"
              />
            ))}

            {/* Today line */}
            {(() => {
              const todayPos = getDayPosition(formatDate(today))
              if (todayPos >= 0 && todayPos <= chartWidth) {
                return (
                  <line
                    x1={labelWidth + todayPos}
                    y1={headerHeight}
                    x2={labelWidth + todayPos}
                    y2={chartHeight}
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />
                )
              }
              return null
            })()}

            {/* Tasks */}
            {tasks.map((task, index) => {
              const y = headerHeight + index * rowHeight
              const barX = getDayPosition(task.startDate)
              const barWidth = getBarWidth(task.startDate, task.endDate)
              const isSelected = selectedId === task.id

              return (
                <g key={task.id} onClick={() => setSelectedId(task.id)} className="cursor-pointer">
                  {/* Row background */}
                  <rect
                    x="0"
                    y={y}
                    width={labelWidth + chartWidth}
                    height={rowHeight}
                    fill={isSelected ? '#eff6ff' : index % 2 === 0 ? '#ffffff' : '#fafafa'}
                  />

                  {/* Task name */}
                  <text
                    x="10"
                    y={y + rowHeight / 2 + 4}
                    fontSize="12"
                    fill="#1e293b"
                    fontWeight={isSelected ? '600' : '400'}
                  >
                    {task.name.length > 18 ? task.name.slice(0, 18) + '...' : task.name}
                  </text>

                  {/* Task bar background */}
                  <rect
                    x={labelWidth + barX}
                    y={y + 12}
                    width={barWidth}
                    height={rowHeight - 24}
                    rx="4"
                    fill={task.color}
                    opacity="0.3"
                  />

                  {/* Task bar progress */}
                  <rect
                    x={labelWidth + barX}
                    y={y + 12}
                    width={barWidth * (task.progress / 100)}
                    height={rowHeight - 24}
                    rx="4"
                    fill={task.color}
                  />

                  {/* Progress text */}
                  <text
                    x={labelWidth + barX + barWidth / 2}
                    y={y + rowHeight / 2 + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="white"
                  >
                    {task.progress}%
                  </text>

                  {/* Selection indicator */}
                  {isSelected && (
                    <rect
                      x="0"
                      y={y}
                      width="4"
                      height={rowHeight}
                      fill="#3b82f6"
                    />
                  )}
                </g>
              )
            })}

            {/* Border lines */}
            <line x1={labelWidth} y1="0" x2={labelWidth} y2={chartHeight} stroke="#e2e8f0" />
            <line x1="0" y1={headerHeight} x2={labelWidth + chartWidth} y2={headerHeight} stroke="#e2e8f0" />
          </svg>
        </div>

        {/* Properties Panel */}
        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.gantt.properties')}</h3>

          {selectedTask ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gantt.taskName')}</label>
                <input
                  type="text"
                  value={selectedTask.name}
                  onChange={(e) => updateTask(selectedId!, { name: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gantt.startDate')}</label>
                <input
                  type="date"
                  value={selectedTask.startDate}
                  onChange={(e) => updateTask(selectedId!, { startDate: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gantt.endDate')}</label>
                <input
                  type="date"
                  value={selectedTask.endDate}
                  onChange={(e) => updateTask(selectedId!, { endDate: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gantt.progress')} ({selectedTask.progress}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedTask.progress}
                  onChange={(e) => updateTask(selectedId!, { progress: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.gantt.color')}</label>
                <div className="flex gap-1 flex-wrap">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded ${selectedTask.color === color ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateTask(selectedId!, { color })}
                    />
                  ))}
                </div>
              </div>
              <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteTask(selectedId!)}>
                {t('tools.gantt.delete')}
              </Button>
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              {t('tools.gantt.selectHint')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
