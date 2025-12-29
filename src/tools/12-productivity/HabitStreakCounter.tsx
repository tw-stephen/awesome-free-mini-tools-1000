import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Habit {
  id: string
  name: string
  color: string
  completedDates: string[]
  createdAt: string
}

export default function HabitStreakCounter() {
  const { t } = useTranslation()
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState('')
  const [selectedColor, setSelectedColor] = useState('#3b82f6')
  const [viewDate, setViewDate] = useState(new Date())

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ]

  useEffect(() => {
    const saved = localStorage.getItem('habit-streaks')
    if (saved) setHabits(JSON.parse(saved))
  }, [])

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated)
    localStorage.setItem('habit-streaks', JSON.stringify(updated))
  }

  const addHabit = () => {
    if (!newHabit.trim()) return
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      color: selectedColor,
      completedDates: [],
      createdAt: new Date().toISOString()
    }
    saveHabits([...habits, habit])
    setNewHabit('')
  }

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter(h => h.id !== id))
  }

  const toggleDate = (habitId: string, date: string) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const dates = h.completedDates.includes(date)
          ? h.completedDates.filter(d => d !== date)
          : [...h.completedDates, date]
        return { ...h, completedDates: dates }
      }
      return h
    })
    saveHabits(updated)
  }

  const getStreak = (habit: Habit): number => {
    const sorted = [...habit.completedDates].sort().reverse()
    if (sorted.length === 0) return 0

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (!sorted.includes(today) && !sorted.includes(yesterday)) return 0

    let streak = 0
    let checkDate = sorted.includes(today) ? today : yesterday

    while (sorted.includes(checkDate)) {
      streak++
      const d = new Date(checkDate)
      d.setDate(d.getDate() - 1)
      checkDate = d.toISOString().split('T')[0]
    }

    return streak
  }

  const getLongestStreak = (habit: Habit): number => {
    if (habit.completedDates.length === 0) return 0

    const sorted = [...habit.completedDates].sort()
    let longest = 1
    let current = 1

    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1])
      const curr = new Date(sorted[i])
      const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000)

      if (diff === 1) {
        current++
        longest = Math.max(longest, current)
      } else {
        current = 1
      }
    }

    return longest
  }

  const getWeekDates = () => {
    const dates = []
    const start = new Date(viewDate)
    start.setDate(start.getDate() - start.getDay())

    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      dates.push(d.toISOString().split('T')[0])
    }
    return dates
  }

  const weekDates = getWeekDates()
  const today = new Date().toISOString().split('T')[0]

  const prevWeek = () => {
    const d = new Date(viewDate)
    d.setDate(d.getDate() - 7)
    setViewDate(d)
  }

  const nextWeek = () => {
    const d = new Date(viewDate)
    d.setDate(d.getDate() + 7)
    setViewDate(d)
  }

  const getCompletionRate = (habit: Habit): number => {
    const startDate = new Date(habit.createdAt)
    const daysSinceCreated = Math.ceil((Date.now() - startDate.getTime()) / 86400000)
    if (daysSinceCreated === 0) return 0
    return Math.round((habit.completedDates.length / daysSinceCreated) * 100)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          placeholder={t('tools.habitStreakCounter.habitPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">{t('tools.habitStreakCounter.color')}:</span>
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className={`w-6 h-6 rounded-full ${selectedColor === c ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <button
          onClick={addHabit}
          disabled={!newHabit.trim()}
          className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {t('tools.habitStreakCounter.addHabit')}
        </button>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <button onClick={prevWeek} className="px-3 py-1 bg-slate-100 rounded">
            &lt;
          </button>
          <span className="text-sm font-medium">
            {new Date(weekDates[0]).toLocaleDateString()} - {new Date(weekDates[6]).toLocaleDateString()}
          </span>
          <button onClick={nextWeek} className="px-3 py-1 bg-slate-100 rounded">
            &gt;
          </button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-8 gap-1 text-xs text-center text-slate-500">
            <div></div>
            {weekDates.map(date => (
              <div key={date} className={date === today ? 'font-bold text-blue-500' : ''}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(date).getDay()]}
              </div>
            ))}
          </div>

          {habits.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              {t('tools.habitStreakCounter.noHabits')}
            </div>
          ) : (
            habits.map(habit => (
              <div key={habit.id} className="grid grid-cols-8 gap-1 items-center">
                <div className="text-sm truncate flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="truncate">{habit.name}</span>
                </div>
                {weekDates.map(date => {
                  const isCompleted = habit.completedDates.includes(date)
                  const isFuture = date > today
                  return (
                    <button
                      key={date}
                      onClick={() => !isFuture && toggleDate(habit.id, date)}
                      disabled={isFuture}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCompleted
                          ? 'text-white'
                          : isFuture
                            ? 'bg-slate-50 text-slate-200'
                            : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                      style={isCompleted ? { backgroundColor: habit.color } : {}}
                    >
                      {isCompleted && '✓'}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {habits.length > 0 && (
        <div className="space-y-2">
          {habits.map(habit => {
            const streak = getStreak(habit)
            const longest = getLongestStreak(habit)
            const rate = getCompletionRate(habit)

            return (
              <div key={habit.id} className="card p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-500 text-sm"
                  >
                    {t('tools.habitStreakCounter.delete')}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <div className="text-xl font-bold" style={{ color: habit.color }}>
                      {streak}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t('tools.habitStreakCounter.currentStreak')}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <div className="text-xl font-bold">{longest}</div>
                    <div className="text-xs text-slate-500">
                      {t('tools.habitStreakCounter.longestStreak')}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <div className="text-xl font-bold">{rate}%</div>
                    <div className="text-xs text-slate-500">
                      {t('tools.habitStreakCounter.completionRate')}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="card p-4 bg-green-50">
        <h3 className="font-medium mb-2">{t('tools.habitStreakCounter.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.habitStreakCounter.tip1')}</li>
          <li>- {t('tools.habitStreakCounter.tip2')}</li>
          <li>- {t('tools.habitStreakCounter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
