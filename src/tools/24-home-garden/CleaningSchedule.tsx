import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface CleaningTask {
  id: number
  name: string
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly'
  room: string
  lastDone?: string
  nextDue: string
}

export default function CleaningSchedule() {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState<CleaningTask[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    name: '',
    frequency: 'weekly' as const,
    room: 'Living Room',
  })
  const [filterRoom, setFilterRoom] = useState('all')

  const rooms = ['Living Room', 'Kitchen', 'Bathroom', 'Bedroom', 'Office', 'Garage', 'Laundry', 'Other']
  const frequencies = [
    { id: 'daily', label: t('tools.cleaningSchedule.daily'), days: 1 },
    { id: 'weekly', label: t('tools.cleaningSchedule.weekly'), days: 7 },
    { id: 'biweekly', label: t('tools.cleaningSchedule.biweekly'), days: 14 },
    { id: 'monthly', label: t('tools.cleaningSchedule.monthly'), days: 30 },
    { id: 'quarterly', label: t('tools.cleaningSchedule.quarterly'), days: 90 },
  ]

  const suggestedTasks = [
    { name: 'Vacuum floors', frequency: 'weekly', room: 'Living Room' },
    { name: 'Mop floors', frequency: 'weekly', room: 'Kitchen' },
    { name: 'Clean counters', frequency: 'daily', room: 'Kitchen' },
    { name: 'Wash dishes', frequency: 'daily', room: 'Kitchen' },
    { name: 'Clean toilet', frequency: 'weekly', room: 'Bathroom' },
    { name: 'Scrub shower', frequency: 'weekly', room: 'Bathroom' },
    { name: 'Change bed sheets', frequency: 'weekly', room: 'Bedroom' },
    { name: 'Dust surfaces', frequency: 'weekly', room: 'Living Room' },
    { name: 'Clean windows', frequency: 'monthly', room: 'Living Room' },
    { name: 'Deep clean oven', frequency: 'monthly', room: 'Kitchen' },
    { name: 'Clean refrigerator', frequency: 'monthly', room: 'Kitchen' },
    { name: 'Wash curtains', frequency: 'quarterly', room: 'Living Room' },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('cleaning-schedule')
    if (saved) {
      try {
        setTasks(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load tasks')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cleaning-schedule', JSON.stringify(tasks))
  }, [tasks])

  const calculateNextDue = (frequency: string, fromDate?: string) => {
    const freq = frequencies.find(f => f.id === frequency)
    const base = fromDate ? new Date(fromDate) : new Date()
    const next = new Date(base.getTime() + (freq?.days || 7) * 24 * 60 * 60 * 1000)
    return next.toISOString().split('T')[0]
  }

  const addTask = () => {
    if (!newTask.name) return
    const task: CleaningTask = {
      id: Date.now(),
      name: newTask.name,
      frequency: newTask.frequency,
      room: newTask.room,
      nextDue: calculateNextDue(newTask.frequency),
    }
    setTasks([...tasks, task])
    setNewTask({ name: '', frequency: 'weekly', room: 'Living Room' })
    setShowAddTask(false)
  }

  const addSuggestedTask = (suggestion: typeof suggestedTasks[0]) => {
    const task: CleaningTask = {
      id: Date.now(),
      name: suggestion.name,
      frequency: suggestion.frequency as CleaningTask['frequency'],
      room: suggestion.room,
      nextDue: calculateNextDue(suggestion.frequency),
    }
    setTasks([...tasks, task])
  }

  const markDone = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const today = new Date().toISOString().split('T')[0]
        return {
          ...task,
          lastDone: today,
          nextDue: calculateNextDue(task.frequency, today),
        }
      }
      return task
    }))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const getDaysUntilDue = (nextDue: string) => {
    const today = new Date()
    const due = new Date(nextDue)
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const filteredTasks = tasks.filter(task => filterRoom === 'all' || task.room === filterRoom)
  const sortedTasks = [...filteredTasks].sort((a, b) => getDaysUntilDue(a.nextDue) - getDaysUntilDue(b.nextDue))

  const overdueTasks = tasks.filter(t => getDaysUntilDue(t.nextDue) < 0).length
  const dueTodayTasks = tasks.filter(t => getDaysUntilDue(t.nextDue) === 0).length
  const upcomingTasks = tasks.filter(t => {
    const days = getDaysUntilDue(t.nextDue)
    return days > 0 && days <= 3
  }).length

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <div className="text-xs text-slate-500">{t('tools.cleaningSchedule.overdue')}</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{dueTodayTasks}</div>
            <div className="text-xs text-slate-500">{t('tools.cleaningSchedule.dueToday')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{upcomingTasks}</div>
            <div className="text-xs text-slate-500">{t('tools.cleaningSchedule.upcoming')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.cleaningSchedule.quickAdd')}</h3>
        <div className="flex flex-wrap gap-1">
          {suggestedTasks.map((task, i) => (
            <button
              key={i}
              onClick={() => addSuggestedTask(task)}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs"
            >
              {task.name}
            </button>
          ))}
        </div>
      </div>

      {!showAddTask ? (
        <button
          onClick={() => setShowAddTask(true)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          + {t('tools.cleaningSchedule.addTask')}
        </button>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.cleaningSchedule.addTask')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              placeholder={t('tools.cleaningSchedule.taskName')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newTask.room}
                onChange={(e) => setNewTask({ ...newTask, room: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {rooms.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
              <select
                value={newTask.frequency}
                onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value as CleaningTask['frequency'] })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {frequencies.map(freq => (
                  <option key={freq.id} value={freq.id}>{freq.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addTask}
                className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.cleaningSchedule.add')}
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.cleaningSchedule.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.cleaningSchedule.yourTasks')}</h3>
          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="all">{t('tools.cleaningSchedule.allRooms')}</option>
            {rooms.map(room => (
              <option key={room} value={room}>{room}</option>
            ))}
          </select>
        </div>

        {sortedTasks.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            {t('tools.cleaningSchedule.noTasks')}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTasks.map(task => {
              const daysUntil = getDaysUntilDue(task.nextDue)
              const isOverdue = daysUntil < 0
              const isDueToday = daysUntil === 0
              const isDueSoon = daysUntil > 0 && daysUntil <= 3

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded ${
                    isOverdue ? 'bg-red-50 border border-red-200' :
                    isDueToday ? 'bg-yellow-50 border border-yellow-200' :
                    isDueSoon ? 'bg-blue-50 border border-blue-200' :
                    'bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{task.name}</div>
                      <div className="text-sm text-slate-500">
                        {task.room} - {frequencies.find(f => f.id === task.frequency)?.label}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      x
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-sm font-medium ${
                      isOverdue ? 'text-red-600' :
                      isDueToday ? 'text-yellow-600' :
                      isDueSoon ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {isOverdue ? `${Math.abs(daysUntil)} ${t('tools.cleaningSchedule.daysOverdue')}` :
                       isDueToday ? t('tools.cleaningSchedule.dueToday') :
                       `${daysUntil} ${t('tools.cleaningSchedule.daysUntilDue')}`}
                    </span>
                    <button
                      onClick={() => markDone(task.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      {t('tools.cleaningSchedule.markDone')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
