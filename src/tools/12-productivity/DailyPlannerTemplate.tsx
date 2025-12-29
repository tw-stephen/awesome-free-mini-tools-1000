import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Task {
  id: string
  text: string
  time?: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

interface DailyPlan {
  date: string
  morningRoutine: string
  topPriorities: string
  tasks: Task[]
  notes: string
  eveningReflection: string
  gratitude: string
  tomorrowPrep: string
}

export default function DailyPlannerTemplate() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [plan, setPlan] = useState<DailyPlan>({
    date: selectedDate,
    morningRoutine: '',
    topPriorities: '',
    tasks: [],
    notes: '',
    eveningReflection: '',
    gratitude: '',
    tomorrowPrep: ''
  })
  const [newTask, setNewTask] = useState('')
  const [taskTime, setTaskTime] = useState('')
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium')

  useEffect(() => {
    const saved = localStorage.getItem(`daily-plan-${selectedDate}`)
    if (saved) {
      setPlan(JSON.parse(saved))
    } else {
      setPlan({
        date: selectedDate,
        morningRoutine: '',
        topPriorities: '',
        tasks: [],
        notes: '',
        eveningReflection: '',
        gratitude: '',
        tomorrowPrep: ''
      })
    }
  }, [selectedDate])

  const savePlan = (updated: DailyPlan) => {
    setPlan(updated)
    localStorage.setItem(`daily-plan-${selectedDate}`, JSON.stringify(updated))
  }

  const addTask = () => {
    if (!newTask.trim()) return
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      time: taskTime || undefined,
      completed: false,
      priority: taskPriority
    }
    savePlan({
      ...plan,
      tasks: [...plan.tasks, task].sort((a, b) => {
        if (a.time && b.time) return a.time.localeCompare(b.time)
        if (a.time) return -1
        if (b.time) return 1
        return 0
      })
    })
    setNewTask('')
    setTaskTime('')
    setTaskPriority('medium')
  }

  const toggleTask = (id: string) => {
    savePlan({
      ...plan,
      tasks: plan.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    })
  }

  const deleteTask = (id: string) => {
    savePlan({
      ...plan,
      tasks: plan.tasks.filter(t => t.id !== id)
    })
  }

  const updateField = (field: keyof DailyPlan, value: string) => {
    savePlan({ ...plan, [field]: value })
  }

  const getCompletionRate = () => {
    if (plan.tasks.length === 0) return 0
    return Math.round((plan.tasks.filter(t => t.completed).length / plan.tasks.length) * 100)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-slate-300'
    }
  }

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0])
  }

  const goToPrevDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const goToNextDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const exportPlan = () => {
    let text = `# Daily Plan: ${selectedDate}\n\n`
    text += `## Morning Routine\n${plan.morningRoutine}\n\n`
    text += `## Top Priorities\n${plan.topPriorities}\n\n`
    text += `## Tasks\n`
    plan.tasks.forEach(task => {
      text += `- [${task.completed ? 'x' : ' '}] ${task.time ? `(${task.time}) ` : ''}${task.text} [${task.priority}]\n`
    })
    text += `\n## Notes\n${plan.notes}\n\n`
    text += `## Evening Reflection\n${plan.eveningReflection}\n\n`
    text += `## Gratitude\n${plan.gratitude}\n\n`
    text += `## Tomorrow Prep\n${plan.tomorrowPrep}\n`

    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daily-plan-${selectedDate}.md`
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center">
          <button onClick={goToPrevDay} className="px-3 py-1 bg-slate-100 rounded">
            &lt;
          </button>
          <div className="text-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 border border-slate-300 rounded text-center"
            />
            <button onClick={goToToday} className="block mx-auto text-xs text-blue-500 mt-1">
              {t('tools.dailyPlannerTemplate.today')}
            </button>
          </div>
          <button onClick={goToNextDay} className="px-3 py-1 bg-slate-100 rounded">
            &gt;
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{t('tools.dailyPlannerTemplate.progress')}</span>
          <span className="text-sm font-bold">{getCompletionRate()}%</span>
        </div>
        <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all"
            style={{ width: `${getCompletionRate()}%` }}
          />
        </div>
      </div>

      <div className="card p-4">
        <label className="text-sm font-medium text-slate-600 block mb-1">
          {t('tools.dailyPlannerTemplate.morningRoutine')}
        </label>
        <textarea
          value={plan.morningRoutine}
          onChange={(e) => updateField('morningRoutine', e.target.value)}
          placeholder={t('tools.dailyPlannerTemplate.morningRoutinePlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded h-16"
        />
      </div>

      <div className="card p-4">
        <label className="text-sm font-medium text-slate-600 block mb-1">
          {t('tools.dailyPlannerTemplate.topPriorities')}
        </label>
        <textarea
          value={plan.topPriorities}
          onChange={(e) => updateField('topPriorities', e.target.value)}
          placeholder={t('tools.dailyPlannerTemplate.topPrioritiesPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded h-20"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-600 mb-3">{t('tools.dailyPlannerTemplate.tasks')}</h3>

        <div className="space-y-2 mb-3">
          {plan.tasks.length === 0 ? (
            <div className="text-center text-slate-400 py-4 text-sm">
              {t('tools.dailyPlannerTemplate.noTasks')}
            </div>
          ) : (
            plan.tasks.map(task => (
              <div
                key={task.id}
                className={`p-2 rounded border-l-4 ${getPriorityColor(task.priority)}`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4"
                  />
                  {task.time && (
                    <span className="text-xs text-slate-500">{task.time}</span>
                  )}
                  <span className={`flex-1 text-sm ${task.completed ? 'line-through text-slate-400' : ''}`}>
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 text-xs"
                  >
                    x
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
          />
          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="high">{t('tools.dailyPlannerTemplate.high')}</option>
            <option value="medium">{t('tools.dailyPlannerTemplate.medium')}</option>
            <option value="low">{t('tools.dailyPlannerTemplate.low')}</option>
          </select>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder={t('tools.dailyPlannerTemplate.addTask')}
            className="flex-1 min-w-[150px] px-3 py-1 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addTask}
            disabled={!newTask.trim()}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="card p-4">
        <label className="text-sm font-medium text-slate-600 block mb-1">
          {t('tools.dailyPlannerTemplate.notes')}
        </label>
        <textarea
          value={plan.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder={t('tools.dailyPlannerTemplate.notesPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded h-20"
        />
      </div>

      <div className="card p-4 bg-purple-50">
        <h3 className="font-medium mb-3">{t('tools.dailyPlannerTemplate.eveningSection')}</h3>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.dailyPlannerTemplate.reflection')}
            </label>
            <textarea
              value={plan.eveningReflection}
              onChange={(e) => updateField('eveningReflection', e.target.value)}
              placeholder={t('tools.dailyPlannerTemplate.reflectionPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded h-16"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.dailyPlannerTemplate.gratitude')}
            </label>
            <textarea
              value={plan.gratitude}
              onChange={(e) => updateField('gratitude', e.target.value)}
              placeholder={t('tools.dailyPlannerTemplate.gratitudePlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded h-16"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.dailyPlannerTemplate.tomorrowPrep')}
            </label>
            <textarea
              value={plan.tomorrowPrep}
              onChange={(e) => updateField('tomorrowPrep', e.target.value)}
              placeholder={t('tools.dailyPlannerTemplate.tomorrowPrepPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded h-16"
            />
          </div>
        </div>
      </div>

      <button
        onClick={exportPlan}
        className="w-full py-2 bg-blue-500 text-white rounded"
      >
        {t('tools.dailyPlannerTemplate.export')}
      </button>
    </div>
  )
}
