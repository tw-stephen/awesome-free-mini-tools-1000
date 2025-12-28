import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Frequency = 'daily' | 'weekly' | 'monthly'

interface Habit {
  id: string
  name: string
  icon: string
  frequency: Frequency
  target: number
  completedDates: string[]
  createdAt: string
}

export default function HabitTracker() {
  const { t } = useTranslation()
  const [habits, setHabits] = useState<Habit[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    icon: '✅',
    frequency: 'daily' as Frequency,
    target: 1
  })
  const [viewDate, setViewDate] = useState(new Date())

  const icons = ['✅', '💪', '📚', '🏃', '💧', '🧘', '💤', '🥗', '💊', '🎯', '💻', '✍️', '🎵', '🧹', '💰']

  useEffect(() => {
    const saved = localStorage.getItem('habit-tracker')
    if (saved) setHabits(JSON.parse(saved))
  }, [])

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated)
    localStorage.setItem('habit-tracker', JSON.stringify(updated))
  }

  const addHabit = () => {
    if (!form.name) return
    const habit: Habit = {
      id: Date.now().toString(),
      name: form.name,
      icon: form.icon,
      frequency: form.frequency,
      target: form.target,
      completedDates: [],
      createdAt: new Date().toISOString()
    }
    saveHabits([...habits, habit])
    setForm({ name: '', icon: '✅', frequency: 'daily', target: 1 })
    setShowForm(false)
  }

  const toggleHabit = (habitId: string, date: string) => {
    saveHabits(habits.map(h => {
      if (h.id !== habitId) return h
      const completed = h.completedDates.includes(date)
      return {
        ...h,
        completedDates: completed
          ? h.completedDates.filter(d => d !== date)
          : [...h.completedDates, date]
      }
    }))
  }

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter(h => h.id !== id))
  }

  const getDateString = (date: Date) => date.toISOString().split('T')[0]

  const getLast7Days = () => {
    const days: Date[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(viewDate)
      date.setDate(date.getDate() - i)
      days.push(date)
    }
    return days
  }

  const getStreak = (habit: Habit) => {
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = getDateString(date)

      if (habit.completedDates.includes(dateStr)) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    return streak
  }

  const getCompletionRate = (habit: Habit) => {
    const daysTracked = Math.min(
      Math.floor((Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1,
      30
    )
    const completed = habit.completedDates.filter(d => {
      const date = new Date(d)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return date >= thirtyDaysAgo
    }).length
    return daysTracked > 0 ? Math.round((completed / daysTracked) * 100) : 0
  }

  const stats = useMemo(() => {
    const today = getDateString(new Date())
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length
    const longestStreak = Math.max(...habits.map(h => getStreak(h)), 0)
    const avgRate = habits.length > 0
      ? Math.round(habits.reduce((sum, h) => sum + getCompletionRate(h), 0) / habits.length)
      : 0
    return { completedToday, total: habits.length, longestStreak, avgRate }
  }, [habits])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-green-600">
            {stats.completedToday}/{stats.total}
          </div>
          <div className="text-xs text-slate-500">{t('tools.habitTracker.today')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold">{stats.total}</div>
          <div className="text-xs text-slate-500">{t('tools.habitTracker.habits')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-orange-500">{stats.longestStreak}</div>
          <div className="text-xs text-slate-500">{t('tools.habitTracker.streak')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold">{stats.avgRate}%</div>
          <div className="text-xs text-slate-500">{t('tools.habitTracker.rate')}</div>
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        + {t('tools.habitTracker.addHabit')}
      </button>

      {showForm && (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('tools.habitTracker.habitName')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{t('tools.habitTracker.icon')}</label>
            <div className="flex flex-wrap gap-2">
              {icons.map(icon => (
                <button
                  key={icon}
                  onClick={() => setForm({ ...form, icon })}
                  className={`w-10 h-10 rounded text-xl ${
                    form.icon === icon ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-slate-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value as Frequency })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              <option value="daily">{t('tools.habitTracker.daily')}</option>
              <option value="weekly">{t('tools.habitTracker.weekly')}</option>
              <option value="monthly">{t('tools.habitTracker.monthly')}</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.target}
                onChange={(e) => setForm({ ...form, target: parseInt(e.target.value) || 1 })}
                min="1"
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <span className="text-sm text-slate-500">x/{form.frequency}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setShowForm(false)} className="py-2 bg-slate-100 rounded">
              {t('tools.habitTracker.cancel')}
            </button>
            <button
              onClick={addHabit}
              disabled={!form.name}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.habitTracker.add')}
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              const newDate = new Date(viewDate)
              newDate.setDate(newDate.getDate() - 7)
              setViewDate(newDate)
            }}
            className="px-3 py-1 bg-slate-100 rounded"
          >
            ←
          </button>
          <span className="font-medium text-sm">
            {t('tools.habitTracker.weekOf')} {getLast7Days()[0].toLocaleDateString()}
          </span>
          <button
            onClick={() => {
              const newDate = new Date(viewDate)
              newDate.setDate(newDate.getDate() + 7)
              setViewDate(newDate)
            }}
            className="px-3 py-1 bg-slate-100 rounded"
          >
            →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">{t('tools.habitTracker.habit')}</th>
                {getLast7Days().map(day => (
                  <th key={day.toISOString()} className="text-center p-2 min-w-[40px]">
                    <div className="text-xs text-slate-500">
                      {day.toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                    <div className={getDateString(day) === getDateString(new Date()) ? 'font-bold text-blue-500' : ''}>
                      {day.getDate()}
                    </div>
                  </th>
                ))}
                <th className="text-center p-2">{t('tools.habitTracker.streak')}</th>
              </tr>
            </thead>
            <tbody>
              {habits.map(habit => (
                <tr key={habit.id} className="border-t">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <span>{habit.icon}</span>
                      <span className="font-medium">{habit.name}</span>
                    </div>
                  </td>
                  {getLast7Days().map(day => {
                    const dateStr = getDateString(day)
                    const completed = habit.completedDates.includes(dateStr)
                    return (
                      <td key={dateStr} className="text-center p-2">
                        <button
                          onClick={() => toggleHabit(habit.id, dateStr)}
                          className={`w-8 h-8 rounded-full ${
                            completed
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          {completed ? '✓' : ''}
                        </button>
                      </td>
                    )
                  })}
                  <td className="text-center p-2">
                    <span className="font-bold text-orange-500">{getStreak(habit)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {habits.length === 0 && (
          <p className="text-center text-slate-500 py-8">
            {t('tools.habitTracker.noHabits')}
          </p>
        )}
      </div>

      {habits.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.habitTracker.overview')}</h3>
          <div className="space-y-2">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <span>{habit.icon}</span>
                  <span className="text-sm font-medium">{habit.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-500">
                    {getCompletionRate(habit)}% {t('tools.habitTracker.completion')}
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-500 text-xs"
                  >
                    {t('tools.habitTracker.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
