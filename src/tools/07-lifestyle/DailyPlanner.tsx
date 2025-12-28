import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface TimeBlock {
  id: number
  startHour: number
  endHour: number
  title: string
  color: string
}

interface DayPlan {
  date: string
  blocks: TimeBlock[]
  notes: string
}

export default function DailyPlanner() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [plans, setPlans] = useState<DayPlan[]>([])
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [newBlock, setNewBlock] = useState({
    startHour: 9,
    endHour: 10,
    title: '',
    color: '#3b82f6',
  })
  const [notes, setNotes] = useState('')

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

  useEffect(() => {
    const saved = localStorage.getItem('daily-planner')
    if (saved) {
      try {
        setPlans(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load plans')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('daily-planner', JSON.stringify(plans))
  }, [plans])

  const currentPlan = useMemo(() => {
    return plans.find(p => p.date === selectedDate) || { date: selectedDate, blocks: [], notes: '' }
  }, [plans, selectedDate])

  useEffect(() => {
    setNotes(currentPlan.notes)
  }, [currentPlan])

  const addBlock = () => {
    if (!newBlock.title) return
    const block: TimeBlock = {
      id: Date.now(),
      startHour: newBlock.startHour,
      endHour: newBlock.endHour,
      title: newBlock.title,
      color: newBlock.color,
    }

    updatePlan([...currentPlan.blocks, block])
    setNewBlock({ startHour: 9, endHour: 10, title: '', color: '#3b82f6' })
    setShowAddBlock(false)
  }

  const removeBlock = (id: number) => {
    updatePlan(currentPlan.blocks.filter(b => b.id !== id))
  }

  const updatePlan = (blocks: TimeBlock[]) => {
    setPlans(plans => {
      const existing = plans.findIndex(p => p.date === selectedDate)
      if (existing >= 0) {
        const updated = [...plans]
        updated[existing] = { ...updated[existing], blocks }
        return updated
      }
      return [...plans, { date: selectedDate, blocks, notes }]
    })
  }

  const saveNotes = () => {
    setPlans(plans => {
      const existing = plans.findIndex(p => p.date === selectedDate)
      if (existing >= 0) {
        const updated = [...plans]
        updated[existing] = { ...updated[existing], notes }
        return updated
      }
      return [...plans, { date: selectedDate, blocks: [], notes }]
    })
  }

  const formatHour = (hour: number) => {
    const h = hour % 12 || 12
    const ampm = hour < 12 ? 'AM' : 'PM'
    return `${h}:00 ${ampm}`
  }

  const getBlocksForHour = (hour: number) => {
    return currentPlan.blocks.filter(b => b.startHour <= hour && b.endHour > hour)
  }

  const changeDate = (days: number) => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() + days)
    setSelectedDate(current.toISOString().split('T')[0])
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0]
  const currentHour = new Date().getHours()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            ←
          </button>
          <div className="text-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-lg font-medium text-center border-none bg-transparent"
            />
            {isToday && (
              <div className="text-sm text-blue-500">{t('tools.dailyPlanner.today')}</div>
            )}
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            →
          </button>
        </div>

        <button
          onClick={() => setShowAddBlock(true)}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          + {t('tools.dailyPlanner.addBlock')}
        </button>
      </div>

      {showAddBlock && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.dailyPlanner.newBlock')}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newBlock.title}
              onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
              placeholder={t('tools.dailyPlanner.blockTitle')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.dailyPlanner.start')}
                </label>
                <select
                  value={newBlock.startHour}
                  onChange={(e) => setNewBlock({ ...newBlock, startHour: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                >
                  {hours.map(h => (
                    <option key={h} value={h}>{formatHour(h)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.dailyPlanner.end')}
                </label>
                <select
                  value={newBlock.endHour}
                  onChange={(e) => setNewBlock({ ...newBlock, endHour: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                >
                  {hours.filter(h => h > newBlock.startHour).map(h => (
                    <option key={h} value={h}>{formatHour(h)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setNewBlock({ ...newBlock, color: c })}
                  className={`w-8 h-8 rounded-full ${
                    newBlock.color === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={addBlock}
                className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.dailyPlanner.add')}
              </button>
              <button
                onClick={() => setShowAddBlock(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.dailyPlanner.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.dailyPlanner.schedule')}
        </h3>
        <div className="space-y-1">
          {hours.filter(h => h >= 6 && h <= 22).map(hour => {
            const blocks = getBlocksForHour(hour)
            const isCurrentHour = isToday && hour === currentHour

            return (
              <div
                key={hour}
                className={`flex items-stretch min-h-[40px] ${
                  isCurrentHour ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-16 py-1 text-xs text-slate-500 flex-shrink-0">
                  {formatHour(hour)}
                </div>
                <div className="flex-1 border-l border-slate-200 pl-2 py-1">
                  {blocks.map(block => (
                    block.startHour === hour && (
                      <div
                        key={block.id}
                        className="px-2 py-1 rounded text-white text-sm flex justify-between items-center"
                        style={{
                          backgroundColor: block.color,
                          minHeight: `${(block.endHour - block.startHour) * 40 - 8}px`,
                        }}
                      >
                        <span>{block.title}</span>
                        <button
                          onClick={() => removeBlock(block.id)}
                          className="text-white/70 hover:text-white"
                        >
                          ×
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.dailyPlanner.notes')}
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
          placeholder={t('tools.dailyPlanner.notesPlaceholder')}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.dailyPlanner.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.dailyPlanner.tip1')}</li>
          <li>{t('tools.dailyPlanner.tip2')}</li>
          <li>{t('tools.dailyPlanner.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
