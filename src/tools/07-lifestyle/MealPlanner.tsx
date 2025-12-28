import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Meal {
  id: number
  name: string
  notes?: string
}

interface DayPlan {
  breakfast: Meal | null
  lunch: Meal | null
  dinner: Meal | null
  snacks: Meal[]
}

interface WeekPlan {
  [key: string]: DayPlan
}

export default function MealPlanner() {
  const { t } = useTranslation()
  const [weekPlan, setWeekPlan] = useState<WeekPlan>({})
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [mealInput, setMealInput] = useState({ name: '', notes: '' })

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const today = new Date().getDay()

  useEffect(() => {
    const saved = localStorage.getItem('meal-planner')
    if (saved) {
      try {
        setWeekPlan(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load meal plan')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('meal-planner', JSON.stringify(weekPlan))
  }, [weekPlan])

  const getDayPlan = (dayIndex: number): DayPlan => {
    return weekPlan[dayIndex] || { breakfast: null, lunch: null, dinner: null, snacks: [] }
  }

  const addMeal = () => {
    if (!mealInput.name) return

    const meal: Meal = {
      id: Date.now(),
      name: mealInput.name,
      notes: mealInput.notes || undefined,
    }

    setWeekPlan(plan => {
      const dayPlan = getDayPlan(selectedDay)

      if (selectedMeal === 'snack') {
        return {
          ...plan,
          [selectedDay]: { ...dayPlan, snacks: [...dayPlan.snacks, meal] },
        }
      }

      return {
        ...plan,
        [selectedDay]: { ...dayPlan, [selectedMeal]: meal },
      }
    })

    setMealInput({ name: '', notes: '' })
  }

  const removeMeal = (dayIndex: number, mealType: string, mealId?: number) => {
    setWeekPlan(plan => {
      const dayPlan = getDayPlan(dayIndex)

      if (mealType === 'snacks' && mealId) {
        return {
          ...plan,
          [dayIndex]: { ...dayPlan, snacks: dayPlan.snacks.filter(s => s.id !== mealId) },
        }
      }

      return {
        ...plan,
        [dayIndex]: { ...dayPlan, [mealType]: null },
      }
    })
  }

  const clearWeek = () => {
    setWeekPlan({})
  }

  const suggestedMeals = [
    'Oatmeal with fruits',
    'Grilled chicken salad',
    'Pasta with vegetables',
    'Rice and beans',
    'Salmon with quinoa',
    'Stir-fry vegetables',
    'Avocado toast',
    'Greek yogurt parfait',
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((day, i) => (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              className={`px-4 py-2 rounded whitespace-nowrap ${
                selectedDay === i
                  ? 'bg-blue-500 text-white'
                  : i === today
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100'
              }`}
            >
              {day.slice(0, 3)}
              {i === today && ' •'}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {days[selectedDay]} - {t('tools.mealPlanner.addMeal')}
        </h3>

        <div className="flex gap-2 mb-3">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(meal => (
            <button
              key={meal}
              onClick={() => setSelectedMeal(meal)}
              className={`flex-1 py-2 rounded text-sm ${
                selectedMeal === meal ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.mealPlanner.${meal}`)}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={mealInput.name}
            onChange={(e) => setMealInput({ ...mealInput, name: e.target.value })}
            placeholder={t('tools.mealPlanner.mealName')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="text"
            value={mealInput.notes}
            onChange={(e) => setMealInput({ ...mealInput, notes: e.target.value })}
            placeholder={t('tools.mealPlanner.notes')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addMeal}
            className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            + {t('tools.mealPlanner.add')}
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2">{t('tools.mealPlanner.suggestions')}:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedMeals.map(meal => (
              <button
                key={meal}
                onClick={() => setMealInput({ ...mealInput, name: meal })}
                className="px-2 py-1 bg-slate-100 rounded text-xs hover:bg-slate-200"
              >
                {meal}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {days[selectedDay]} - {t('tools.mealPlanner.plan')}
        </h3>

        {['breakfast', 'lunch', 'dinner'].map(mealType => {
          const dayPlan = getDayPlan(selectedDay)
          const meal = dayPlan[mealType as keyof Omit<DayPlan, 'snacks'>] as Meal | null

          return (
            <div key={mealType} className="mb-3">
              <div className="text-xs text-slate-500 mb-1 capitalize">
                {t(`tools.mealPlanner.${mealType}`)}
              </div>
              {meal ? (
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div>
                    <div className="font-medium">{meal.name}</div>
                    {meal.notes && <div className="text-xs text-slate-500">{meal.notes}</div>}
                  </div>
                  <button
                    onClick={() => removeMeal(selectedDay, mealType)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="p-2 bg-slate-50 rounded text-slate-400 text-sm">
                  {t('tools.mealPlanner.notPlanned')}
                </div>
              )}
            </div>
          )
        })}

        <div>
          <div className="text-xs text-slate-500 mb-1">{t('tools.mealPlanner.snack')}</div>
          {getDayPlan(selectedDay).snacks.length > 0 ? (
            <div className="space-y-1">
              {getDayPlan(selectedDay).snacks.map(snack => (
                <div key={snack.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div>
                    <div className="font-medium">{snack.name}</div>
                    {snack.notes && <div className="text-xs text-slate-500">{snack.notes}</div>}
                  </div>
                  <button
                    onClick={() => removeMeal(selectedDay, 'snacks', snack.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 bg-slate-50 rounded text-slate-400 text-sm">
              {t('tools.mealPlanner.notPlanned')}
            </div>
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.mealPlanner.weekOverview')}
        </h3>
        <div className="space-y-2">
          {days.map((day, i) => {
            const plan = getDayPlan(i)
            const meals = [plan.breakfast, plan.lunch, plan.dinner].filter(Boolean).length + plan.snacks.length

            return (
              <div
                key={day}
                className={`flex items-center justify-between p-2 rounded ${
                  i === today ? 'bg-blue-50' : 'bg-slate-50'
                }`}
              >
                <span className={i === today ? 'font-medium text-blue-700' : ''}>
                  {day}
                </span>
                <span className="text-sm text-slate-500">
                  {meals} {t('tools.mealPlanner.mealsPlanned')}
                </span>
              </div>
            )
          })}
        </div>
        <button
          onClick={clearWeek}
          className="w-full mt-3 py-2 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
        >
          {t('tools.mealPlanner.clearWeek')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.mealPlanner.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.mealPlanner.tip1')}</li>
          <li>{t('tools.mealPlanner.tip2')}</li>
          <li>{t('tools.mealPlanner.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
