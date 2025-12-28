import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface FoodEntry {
  id: number
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

interface DayLog {
  date: string
  entries: FoodEntry[]
  goal: number
}

const commonFoods = [
  { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Rice (1 cup)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4 },
  { name: 'Egg', calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: 'Bread (1 slice)', calories: 79, protein: 2.7, carbs: 15, fat: 1 },
  { name: 'Milk (1 cup)', calories: 149, protein: 8, carbs: 12, fat: 8 },
  { name: 'Salad', calories: 20, protein: 1, carbs: 4, fat: 0.2 },
]

export default function CalorieCounter() {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]
  const [goal, setGoal] = useState(2000)
  const [logs, setLogs] = useState<DayLog[]>([])
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [newFood, setNewFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('calorie-counter')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setGoal(data.goal || 2000)
        setLogs(data.logs || [])
      } catch (e) {
        console.error('Failed to load data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('calorie-counter', JSON.stringify({ goal, logs }))
  }, [goal, logs])

  const todayLog = useMemo(() => {
    return logs.find(l => l.date === today) || { date: today, entries: [], goal }
  }, [logs, today, goal])

  const totals = useMemo(() => {
    return todayLog.entries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  }, [todayLog])

  const addEntry = (food: typeof commonFoods[0]) => {
    const entry: FoodEntry = {
      id: Date.now(),
      ...food,
      meal: selectedMeal,
    }
    updateTodayLog([...todayLog.entries, entry])
    setShowQuickAdd(false)
  }

  const addCustomEntry = () => {
    if (!newFood.name || !newFood.calories) return
    const entry: FoodEntry = {
      id: Date.now(),
      name: newFood.name,
      calories: parseInt(newFood.calories) || 0,
      protein: parseInt(newFood.protein) || 0,
      carbs: parseInt(newFood.carbs) || 0,
      fat: parseInt(newFood.fat) || 0,
      meal: selectedMeal,
    }
    updateTodayLog([...todayLog.entries, entry])
    setNewFood({ name: '', calories: '', protein: '', carbs: '', fat: '' })
  }

  const removeEntry = (id: number) => {
    updateTodayLog(todayLog.entries.filter(e => e.id !== id))
  }

  const updateTodayLog = (entries: FoodEntry[]) => {
    setLogs(logs => {
      const existing = logs.findIndex(l => l.date === today)
      if (existing >= 0) {
        const updated = [...logs]
        updated[existing] = { ...updated[existing], entries }
        return updated
      }
      return [...logs, { date: today, entries, goal }]
    })
  }

  const progress = Math.min((totals.calories / goal) * 100, 100)
  const remaining = goal - totals.calories

  const mealEntries = (meal: string) => todayLog.entries.filter(e => e.meal === meal)
  const meals = ['breakfast', 'lunch', 'dinner', 'snack'] as const

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold text-slate-800">{totals.calories}</div>
            <div className="text-sm text-slate-500">/ {goal} kcal</div>
          </div>
          <div className={`text-lg font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {remaining >= 0 ? `${remaining} ${t('tools.calorieCounter.remaining')}` : `${-remaining} ${t('tools.calorieCounter.over')}`}
          </div>
        </div>

        <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all ${
              progress >= 100 ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-xl font-bold text-blue-600">{totals.protein}g</div>
            <div className="text-xs text-slate-500">{t('tools.calorieCounter.protein')}</div>
          </div>
          <div className="p-2 bg-yellow-50 rounded">
            <div className="text-xl font-bold text-yellow-600">{totals.carbs}g</div>
            <div className="text-xs text-slate-500">{t('tools.calorieCounter.carbs')}</div>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <div className="text-xl font-bold text-red-500">{totals.fat}g</div>
            <div className="text-xs text-slate-500">{t('tools.calorieCounter.fat')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {meals.map(meal => (
            <button
              key={meal}
              onClick={() => setSelectedMeal(meal)}
              className={`px-4 py-2 rounded whitespace-nowrap ${
                selectedMeal === meal ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.calorieCounter.${meal}`)}
            </button>
          ))}
        </div>

        <div className="space-y-2 mb-4">
          <input
            type="text"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            placeholder={t('tools.calorieCounter.foodName')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <div className="grid grid-cols-4 gap-2">
            <input
              type="number"
              value={newFood.calories}
              onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
              placeholder="kcal"
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="number"
              value={newFood.protein}
              onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
              placeholder="P(g)"
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="number"
              value={newFood.carbs}
              onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
              placeholder="C(g)"
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="number"
              value={newFood.fat}
              onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
              placeholder="F(g)"
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addCustomEntry}
              className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              + {t('tools.calorieCounter.addFood')}
            </button>
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
            >
              {t('tools.calorieCounter.quickAdd')}
            </button>
          </div>
        </div>

        {showQuickAdd && (
          <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-slate-50 rounded">
            {commonFoods.map(food => (
              <button
                key={food.name}
                onClick={() => addEntry(food)}
                className="p-2 bg-white rounded border border-slate-200 text-left hover:border-blue-500"
              >
                <div className="font-medium text-sm">{food.name}</div>
                <div className="text-xs text-slate-500">{food.calories} kcal</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {meals.map(meal => {
        const entries = mealEntries(meal)
        if (entries.length === 0) return null
        return (
          <div key={meal} className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2 capitalize">
              {t(`tools.calorieCounter.${meal}`)}
            </h3>
            <div className="space-y-2">
              {entries.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded"
                >
                  <div>
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-xs text-slate-400">
                      P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.calories} kcal</span>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.calorieCounter.settings')}
        </h3>
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.calorieCounter.dailyGoal')} (kcal)
          </label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(Math.max(500, parseInt(e.target.value) || 2000))}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.calorieCounter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.calorieCounter.tip1')}</li>
          <li>{t('tools.calorieCounter.tip2')}</li>
          <li>{t('tools.calorieCounter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
