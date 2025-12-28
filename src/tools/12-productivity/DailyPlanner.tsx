import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface TimeBlock {
  id: string
  startTime: string
  endTime: string
  title: string
  category: string
  completed: boolean
}

interface DayPlan {
  date: string
  blocks: TimeBlock[]
  notes: string
  priorities: string[]
}

export default function DailyPlanner() {
  const { t } = useTranslation()
  const [plans, setPlans] = useState<Record<string, DayPlan>>({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    startTime: '09:00',
    endTime: '10:00',
    title: '',
    category: 'work'
  })

  const categories = ['work', 'personal', 'meeting', 'exercise', 'break', 'other']
  const categoryColors: Record<string, string> = {
    work: 'bg-blue-100 border-blue-400',
    personal: 'bg-purple-100 border-purple-400',
    meeting: 'bg-yellow-100 border-yellow-400',
    exercise: 'bg-green-100 border-green-400',
    break: 'bg-orange-100 border-orange-400',
    other: 'bg-slate-100 border-slate-400'
  }

  useEffect(() => {
    const saved = localStorage.getItem('daily-planner')
    if (saved) setPlans(JSON.parse(saved))
  }, [])

  const savePlans = (updated: Record<string, DayPlan>) => {
    setPlans(updated)
    localStorage.setItem('daily-planner', JSON.stringify(updated))
  }

  const getCurrentPlan = (): DayPlan => {
    return plans[selectedDate] || { date: selectedDate, blocks: [], notes: '', priorities: [] }
  }

  const addBlock = () => {
    if (!form.title) return
    const block: TimeBlock = {
      id: Date.now().toString(),
      startTime: form.startTime,
      endTime: form.endTime,
      title: form.title,
      category: form.category,
      completed: false
    }
    const plan = getCurrentPlan()
    savePlans({
      ...plans,
      [selectedDate]: {
        ...plan,
        blocks: [...plan.blocks, block].sort((a, b) => a.startTime.localeCompare(b.startTime))
      }
    })
    setForm({ startTime: form.endTime, endTime: '', title: '', category: 'work' })
    setShowForm(false)
  }

  const toggleBlock = (blockId: string) => {
    const plan = getCurrentPlan()
    savePlans({
      ...plans,
      [selectedDate]: {
        ...plan,
        blocks: plan.blocks.map(b =>
          b.id === blockId ? { ...b, completed: !b.completed } : b
        )
      }
    })
  }

  const deleteBlock = (blockId: string) => {
    const plan = getCurrentPlan()
    savePlans({
      ...plans,
      [selectedDate]: {
        ...plan,
        blocks: plan.blocks.filter(b => b.id !== blockId)
      }
    })
  }

  const updateNotes = (notes: string) => {
    const plan = getCurrentPlan()
    savePlans({
      ...plans,
      [selectedDate]: { ...plan, notes }
    })
  }

  const addPriority = (priority: string) => {
    if (!priority) return
    const plan = getCurrentPlan()
    savePlans({
      ...plans,
      [selectedDate]: {
        ...plan,
        priorities: [...plan.priorities, priority]
      }
    })
  }

  const removePriority = (index: number) => {
    const plan = getCurrentPlan()
    savePlans({
      ...plans,
      [selectedDate]: {
        ...plan,
        priorities: plan.priorities.filter((_, i) => i !== index)
      }
    })
  }

  const plan = getCurrentPlan()
  const completedBlocks = plan.blocks.filter(b => b.completed).length
  const totalBlocks = plan.blocks.length

  const navigateDate = (days: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + days)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return `${hour}:00`
  })

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigateDate(-1)}
            className="px-3 py-1 bg-slate-100 rounded"
          >
            ←
          </button>
          <div className="text-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-lg font-medium border-none bg-transparent text-center cursor-pointer"
            />
            <div className="text-xs text-slate-500">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
          </div>
          <button
            onClick={() => navigateDate(1)}
            className="px-3 py-1 bg-slate-100 rounded"
          >
            →
          </button>
        </div>
        <div className="flex justify-between text-sm">
          <span>{completedBlocks}/{totalBlocks} {t('tools.dailyPlanner.completed')}</span>
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="text-blue-500"
          >
            {t('tools.dailyPlanner.today')}
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-2 bg-blue-500 text-white rounded font-medium"
      >
        + {t('tools.dailyPlanner.addBlock')}
      </button>

      {showForm && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('tools.dailyPlanner.start')}</label>
              <select
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('tools.dailyPlanner.end')}</label>
              <select
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={t('tools.dailyPlanner.activity')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setForm({ ...form, category: cat })}
                className={`px-3 py-1 rounded text-sm ${
                  form.category === cat
                    ? categoryColors[cat].replace('bg-', 'bg-').replace('100', '200')
                    : 'bg-slate-100'
                }`}
              >
                {t(`tools.dailyPlanner.${cat}`)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setShowForm(false)} className="py-2 bg-slate-100 rounded">
              {t('tools.dailyPlanner.cancel')}
            </button>
            <button
              onClick={addBlock}
              disabled={!form.title}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.dailyPlanner.add')}
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.dailyPlanner.topPriorities')}</h3>
        <div className="space-y-2 mb-2">
          {plan.priorities.map((priority, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
              <span className="font-bold text-yellow-600">{index + 1}</span>
              <span className="flex-1">{priority}</span>
              <button
                onClick={() => removePriority(index)}
                className="text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {plan.priorities.length < 3 && (
          <input
            type="text"
            placeholder={t('tools.dailyPlanner.addPriority')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                addPriority(e.currentTarget.value)
                e.currentTarget.value = ''
              }
            }}
          />
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.dailyPlanner.schedule')}</h3>
        {plan.blocks.length === 0 ? (
          <p className="text-center text-slate-500 py-4">{t('tools.dailyPlanner.noBlocks')}</p>
        ) : (
          <div className="space-y-2">
            {plan.blocks.map(block => (
              <div
                key={block.id}
                className={`flex items-center gap-3 p-3 rounded border-l-4 ${categoryColors[block.category]} ${
                  block.completed ? 'opacity-50' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={block.completed}
                  onChange={() => toggleBlock(block.id)}
                  className="shrink-0"
                />
                <div className="flex-1">
                  <div className={`font-medium ${block.completed ? 'line-through' : ''}`}>
                    {block.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    {block.startTime} - {block.endTime} • {t(`tools.dailyPlanner.${block.category}`)}
                  </div>
                </div>
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.dailyPlanner.notes')}</h3>
        <textarea
          value={plan.notes}
          onChange={(e) => updateNotes(e.target.value)}
          placeholder={t('tools.dailyPlanner.notesPlaceholder')}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {categories.slice(0, 3).map(cat => {
          const count = plan.blocks.filter(b => b.category === cat).length
          return (
            <div key={cat} className={`card p-2 ${categoryColors[cat]}`}>
              <div className="font-bold">{count}</div>
              <div className="text-xs">{t(`tools.dailyPlanner.${cat}`)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
