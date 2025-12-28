import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Meal {
  id: number
  name: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

interface DayPlan {
  date: string
  meals: Meal[]
}

export default function MealPlanner() {
  const { t } = useTranslation()
  const [plans, setPlans] = useState<DayPlan[]>([])
  const [currentWeek, setCurrentWeek] = useState<Date[]>([])
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [newMeal, setNewMeal] = useState({ name: '', type: 'breakfast' as Meal['type'] })

  useEffect(() => {
    const today = new Date()
    const week: Date[] = []
    const dayOfWeek = today.getDay()
    const start = new Date(today)
    start.setDate(today.getDate() - dayOfWeek)

    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      week.push(day)
    }
    setCurrentWeek(week)
    setSelectedDay(today.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('meal-planner')
    if (saved) {
      try {
        setPlans(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load meal plans')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('meal-planner', JSON.stringify(plans))
  }, [plans])

  const addMeal = () => {
    if (!newMeal.name.trim() || !selectedDay) return

    const meal: Meal = {
      id: Date.now(),
      name: newMeal.name,
      type: newMeal.type,
    }

    const existingPlan = plans.find(p => p.date === selectedDay)
    if (existingPlan) {
      setPlans(plans.map(p =>
        p.date === selectedDay ? { ...p, meals: [...p.meals, meal] } : p
      ))
    } else {
      setPlans([...plans, { date: selectedDay, meals: [meal] }])
    }
    setNewMeal({ name: '', type: 'breakfast' })
  }

  const removeMeal = (date: string, mealId: number) => {
    setPlans(plans.map(p =>
      p.date === date ? { ...p, meals: p.meals.filter(m => m.id !== mealId) } : p
    ).filter(p => p.meals.length > 0))
  }

  const getMealsForDay = (date: string) => {
    return plans.find(p => p.date === date)?.meals || []
  }

  const mealTypes: Meal['type'][] = ['breakfast', 'lunch', 'dinner', 'snack']

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {currentWeek.map(day => {
          const dateStr = day.toISOString().split('T')[0]
          const isSelected = selectedDay === dateStr
          const hasMeals = getMealsForDay(dateStr).length > 0
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDay(dateStr)}
              className={`flex-1 min-w-[60px] p-2 rounded text-center ${
                isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              <div className="text-xs">{day.toLocaleDateString([], { weekday: 'short' })}</div>
              <div className="font-medium">{day.getDate()}</div>
              {hasMeals && <div className="w-1.5 h-1.5 bg-green-500 rounded-full mx-auto mt-1" />}
            </button>
          )
        })}
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.mealPlanner.mealName')}
          </label>
          <input
            type="text"
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            placeholder={t('tools.mealPlanner.mealPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.mealPlanner.mealType')}
          </label>
          <div className="flex gap-2">
            {mealTypes.map(type => (
              <button
                key={type}
                onClick={() => setNewMeal({ ...newMeal, type })}
                className={`flex-1 py-2 rounded text-sm ${
                  newMeal.type === type ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t(`tools.mealPlanner.${type}`)}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={addMeal}
          disabled={!newMeal.name.trim()}
          className="w-full py-2 bg-green-500 text-white rounded font-medium disabled:opacity-50"
        >
          + {t('tools.mealPlanner.addMeal')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {selectedDay && new Date(selectedDay).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </h3>
        {mealTypes.map(type => {
          const meals = getMealsForDay(selectedDay).filter(m => m.type === type)
          return (
            <div key={type} className="mb-3">
              <div className="text-xs font-medium text-slate-500 uppercase mb-1">
                {t(`tools.mealPlanner.${type}`)}
              </div>
              {meals.length === 0 ? (
                <div className="text-sm text-slate-400 italic">-</div>
              ) : (
                <div className="space-y-1">
                  {meals.map(meal => (
                    <div key={meal.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                      <span className="text-sm">{meal.name}</span>
                      <button onClick={() => removeMeal(selectedDay, meal.id)} className="text-red-500 text-sm">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="card p-4 bg-green-50">
        <p className="text-xs text-slate-600">
          {t('tools.mealPlanner.tip')}
        </p>
      </div>
    </div>
  )
}
