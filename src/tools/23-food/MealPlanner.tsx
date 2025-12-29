import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Meal {
  id: number
  name: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  notes: string
}

interface DayPlan {
  date: string
  meals: Meal[]
}

const mealTypes = [
  { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
  { id: 'lunch', name: 'Lunch', icon: '☀️' },
  { id: 'dinner', name: 'Dinner', icon: '🌙' },
  { id: 'snack', name: 'Snack', icon: '🍎' },
]

const mealSuggestions = {
  breakfast: ['Oatmeal', 'Eggs & Toast', 'Smoothie Bowl', 'Pancakes', 'Yogurt & Granola', 'Avocado Toast'],
  lunch: ['Salad', 'Sandwich', 'Soup', 'Rice Bowl', 'Pasta', 'Wrap'],
  dinner: ['Grilled Chicken', 'Stir Fry', 'Salmon', 'Pasta', 'Tacos', 'Curry', 'Steak'],
  snack: ['Fruit', 'Nuts', 'Cheese & Crackers', 'Vegetables & Hummus', 'Protein Bar'],
}

export default function MealPlanner() {
  const { t } = useTranslation()
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const start = new Date(today)
    start.setDate(start.getDate() - dayOfWeek)
    return start.toISOString().split('T')[0]
  })
  const [plans, setPlans] = useState<DayPlan[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [newMeal, setNewMeal] = useState({ name: '', type: 'breakfast' as Meal['type'], notes: '' })

  const getWeekDays = () => {
    const days = []
    const start = new Date(weekStart)
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        isToday: date.toDateString() === new Date().toDateString(),
      })
    }
    return days
  }

  const weekDays = getWeekDays()

  const getDayPlan = (date: string) => {
    return plans.find(p => p.date === date) || { date, meals: [] }
  }

  const addMeal = () => {
    if (!selectedDay || !newMeal.name.trim()) return

    const meal: Meal = {
      id: Date.now(),
      name: newMeal.name.trim(),
      type: newMeal.type,
      notes: newMeal.notes,
    }

    setPlans(prevPlans => {
      const existingPlan = prevPlans.find(p => p.date === selectedDay)
      if (existingPlan) {
        return prevPlans.map(p =>
          p.date === selectedDay
            ? { ...p, meals: [...p.meals, meal] }
            : p
        )
      }
      return [...prevPlans, { date: selectedDay, meals: [meal] }]
    })

    setNewMeal({ name: '', type: 'breakfast', notes: '' })
  }

  const removeMeal = (date: string, mealId: number) => {
    setPlans(prevPlans =>
      prevPlans.map(p =>
        p.date === date
          ? { ...p, meals: p.meals.filter(m => m.id !== mealId) }
          : p
      ).filter(p => p.meals.length > 0)
    )
  }

  const changeWeek = (direction: number) => {
    const start = new Date(weekStart)
    start.setDate(start.getDate() + direction * 7)
    setWeekStart(start.toISOString().split('T')[0])
  }

  const exportPlan = () => {
    let text = `Meal Plan: Week of ${new Date(weekStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}\n`
    text += '='.repeat(50) + '\n\n'

    weekDays.forEach(day => {
      const plan = getDayPlan(day.date)
      text += `${day.dayName}, ${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}\n`
      text += '-'.repeat(30) + '\n'

      if (plan.meals.length === 0) {
        text += '  No meals planned\n'
      } else {
        mealTypes.forEach(type => {
          const meals = plan.meals.filter(m => m.type === type.id)
          if (meals.length > 0) {
            text += `  ${type.icon} ${type.name}:\n`
            meals.forEach(meal => {
              text += `    - ${meal.name}${meal.notes ? ` (${meal.notes})` : ''}\n`
            })
          }
        })
      }
      text += '\n'
    })

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meal-plan-${weekStart}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeWeek(-1)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded"
          >
            ← Prev
          </button>
          <div className="text-center">
            <div className="font-bold">
              {t('tools.mealPlanner.weekOf')} {new Date(weekStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </div>
          </div>
          <button
            onClick={() => changeWeek(1)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => {
          const plan = getDayPlan(day.date)
          const isSelected = selectedDay === day.date

          return (
            <button
              key={day.date}
              onClick={() => setSelectedDay(day.date)}
              className={`p-2 rounded text-center ${
                isSelected
                  ? 'bg-blue-500 text-white'
                  : day.isToday
                  ? 'bg-blue-100 border-2 border-blue-300'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-xs">{day.dayName}</div>
              <div className="text-lg font-bold">{day.dayNum}</div>
              <div className="text-xs">{plan.meals.length} meals</div>
            </button>
          )
        })}
      </div>

      {selectedDay && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">
            {new Date(selectedDay).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h3>

          <div className="space-y-3 mb-4">
            <div className="flex gap-2">
              <select
                value={newMeal.type}
                onChange={e => setNewMeal({ ...newMeal, type: e.target.value as Meal['type'] })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {mealTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={newMeal.name}
                onChange={e => setNewMeal({ ...newMeal, name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && addMeal()}
                placeholder={t('tools.mealPlanner.mealName')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <button
                onClick={addMeal}
                disabled={!newMeal.name.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(mealSuggestions[newMeal.type] || []).map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setNewMeal({ ...newMeal, name: suggestion })}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {mealTypes.map(type => {
              const meals = getDayPlan(selectedDay).meals.filter(m => m.type === type.id)
              if (meals.length === 0) return null

              return (
                <div key={type.id}>
                  <div className="text-sm text-slate-500 flex items-center gap-1 mb-1">
                    <span>{type.icon}</span>
                    <span>{type.name}</span>
                  </div>
                  {meals.map(meal => (
                    <div key={meal.id} className="flex items-center justify-between p-2 bg-slate-50 rounded mb-1">
                      <div>
                        <div className="font-medium">{meal.name}</div>
                        {meal.notes && <div className="text-xs text-slate-500">{meal.notes}</div>}
                      </div>
                      <button
                        onClick={() => removeMeal(selectedDay, meal.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )
            })}
            {getDayPlan(selectedDay).meals.length === 0 && (
              <div className="text-center text-slate-500 py-4">
                {t('tools.mealPlanner.noMeals')}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={exportPlan}
        className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {t('tools.mealPlanner.export')}
      </button>
    </div>
  )
}
