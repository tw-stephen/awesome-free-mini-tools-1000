import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Habit {
  id: number
  name: string
  color: string
  streak: number
  completedDates: string[]
  createdAt: string
}

const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

export default function HabitTracker() {
  const { t } = useTranslation()
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabitName, setNewHabitName] = useState('')
  const [selectedColor, setSelectedColor] = useState(colors[0])

  useEffect(() => {
    const saved = localStorage.getItem('habit-tracker')
    if (saved) {
      try {
        setHabits(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load habits')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('habit-tracker', JSON.stringify(habits))
  }, [habits])

  const today = new Date().toISOString().split('T')[0]

  const addHabit = () => {
    if (!newHabitName.trim()) return
    const newHabit: Habit = {
      id: Date.now(),
      name: newHabitName.trim(),
      color: selectedColor,
      streak: 0,
      completedDates: [],
      createdAt: today,
    }
    setHabits([...habits, newHabit])
    setNewHabitName('')
  }

  const toggleHabit = (id: number, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit

      const completed = habit.completedDates.includes(date)
      const newDates = completed
        ? habit.completedDates.filter(d => d !== date)
        : [...habit.completedDates, date]

      // Calculate streak
      let streak = 0
      const sortedDates = [...newDates].sort().reverse()
      const checkDate = new Date(today)

      for (const d of sortedDates) {
        const dateStr = checkDate.toISOString().split('T')[0]
        if (d === dateStr) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }

      return { ...habit, completedDates: newDates, streak }
    }))
  }

  const deleteHabit = (id: number) => {
    setHabits(habits.filter(h => h.id !== id))
  }

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push({
        date: d.toISOString().split('T')[0],
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        num: d.getDate(),
      })
    }
    return days
  }

  const days = getLast7Days()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
            placeholder={t('tools.habitTracker.newHabit')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <div className="flex gap-1">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color ? 'border-slate-800' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={addHabit}
            className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('common.add') || 'Add'}
          </button>
        </div>

        <div className="text-sm text-slate-500">
          {habits.length} {t('tools.habitTracker.habits')}
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          <div className="text-4xl mb-2">📋</div>
          {t('tools.habitTracker.noHabits')}
        </div>
      ) : (
        <div className="card p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-slate-600 pb-3">
                  {t('tools.habitTracker.habit')}
                </th>
                {days.map(day => (
                  <th key={day.date} className="text-center text-xs pb-3 w-12">
                    <div className="text-slate-400">{day.day}</div>
                    <div className="text-slate-600 font-medium">{day.num}</div>
                  </th>
                ))}
                <th className="text-center text-sm font-medium text-slate-600 pb-3 w-16">
                  🔥
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {habits.map(habit => (
                <tr key={habit.id} className="border-t border-slate-100">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <span className="font-medium">{habit.name}</span>
                    </div>
                  </td>
                  {days.map(day => (
                    <td key={day.date} className="text-center py-3">
                      <button
                        onClick={() => toggleHabit(habit.id, day.date)}
                        className={`w-8 h-8 rounded-lg transition-all ${
                          habit.completedDates.includes(day.date)
                            ? 'text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-400'
                        }`}
                        style={
                          habit.completedDates.includes(day.date)
                            ? { backgroundColor: habit.color }
                            : {}
                        }
                      >
                        {habit.completedDates.includes(day.date) ? '✓' : ''}
                      </button>
                    </td>
                  ))}
                  <td className="text-center py-3">
                    <span className="text-lg font-bold text-orange-500">
                      {habit.streak}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.habitTracker.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.habitTracker.tip1')}</li>
          <li>{t('tools.habitTracker.tip2')}</li>
          <li>{t('tools.habitTracker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
