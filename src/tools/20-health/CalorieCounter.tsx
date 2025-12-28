import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FoodEntry {
  id: number
  name: string
  calories: number
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  time: string
}

export default function CalorieCounter() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [dailyGoal, setDailyGoal] = useState(2000)
  const [showForm, setShowForm] = useState(false)
  const [newEntry, setNewEntry] = useState({
    name: '',
    calories: 0,
    meal: 'breakfast' as FoodEntry['meal'],
    time: new Date().toTimeString().slice(0, 5),
  })

  const meals = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍪' },
  ]

  const commonFoods = [
    { name: 'Apple', calories: 95 },
    { name: 'Banana', calories: 105 },
    { name: 'Chicken Breast (100g)', calories: 165 },
    { name: 'Rice (1 cup)', calories: 206 },
    { name: 'Bread (1 slice)', calories: 79 },
    { name: 'Egg', calories: 78 },
    { name: 'Milk (1 cup)', calories: 149 },
    { name: 'Salad', calories: 50 },
    { name: 'Pasta (1 cup)', calories: 221 },
    { name: 'Coffee (black)', calories: 2 },
  ]

  const addEntry = () => {
    if (!newEntry.name.trim() || newEntry.calories <= 0) return
    setEntries([...entries, { ...newEntry, id: Date.now() }])
    setNewEntry({
      name: '',
      calories: 0,
      meal: 'breakfast',
      time: new Date().toTimeString().slice(0, 5),
    })
    setShowForm(false)
  }

  const addQuickFood = (food: { name: string; calories: number }) => {
    setEntries([
      ...entries,
      {
        id: Date.now(),
        name: food.name,
        calories: food.calories,
        meal: getCurrentMeal(),
        time: new Date().toTimeString().slice(0, 5),
      },
    ])
  }

  const getCurrentMeal = (): FoodEntry['meal'] => {
    const hour = new Date().getHours()
    if (hour < 11) return 'breakfast'
    if (hour < 15) return 'lunch'
    if (hour < 20) return 'dinner'
    return 'snack'
  }

  const removeEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id))
  }

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)
  const remaining = dailyGoal - totalCalories
  const percentage = Math.min((totalCalories / dailyGoal) * 100, 100)

  const getEntriesByMeal = (meal: FoodEntry['meal']) => {
    return entries.filter((e) => e.meal === meal)
  }

  const getMealTotal = (meal: FoodEntry['meal']) => {
    return getEntriesByMeal(meal).reduce((sum, e) => sum + e.calories, 0)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">{t('tools.calorieCounter.dailyGoal')}</span>
          <input
            type="number"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(parseInt(e.target.value) || 2000)}
            className="w-24 px-2 py-1 text-right border border-slate-300 rounded text-sm"
          />
        </div>
        <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`absolute h-full transition-all ${
              percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="font-bold text-2xl">{totalCalories}</span>
          <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
            {remaining >= 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {meals.map((meal) => (
          <div key={meal.value} className="card p-2 text-center">
            <div className="text-xl">{meal.icon}</div>
            <div className="text-xs text-slate-500">{meal.label}</div>
            <div className="font-bold text-sm">{getMealTotal(meal.value as FoodEntry['meal'])}</div>
          </div>
        ))}
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.calorieCounter.addFood')}
        </button>
      )}

      {showForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.calorieCounter.addFood')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newEntry.name}
              onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
              placeholder="Food name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={newEntry.calories || ''}
                onChange={(e) => setNewEntry({ ...newEntry, calories: parseInt(e.target.value) || 0 })}
                placeholder="Calories"
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={newEntry.meal}
                onChange={(e) => setNewEntry({ ...newEntry, meal: e.target.value as FoodEntry['meal'] })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {meals.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <input
                type="time"
                value={newEntry.time}
                onChange={(e) => setNewEntry({ ...newEntry, time: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addEntry}
                disabled={!newEntry.name.trim() || newEntry.calories <= 0}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.calorieCounter.quickAdd')}</h3>
        <div className="flex flex-wrap gap-2">
          {commonFoods.map((food) => (
            <button
              key={food.name}
              onClick={() => addQuickFood(food)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm"
            >
              {food.name} ({food.calories})
            </button>
          ))}
        </div>
      </div>

      {entries.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.calorieCounter.todaysFood')}</h3>
          <div className="space-y-2">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <span>{meals.find((m) => m.value === entry.meal)?.icon}</span>
                  <div>
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-xs text-slate-500">{entry.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{entry.calories} cal</span>
                  <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600">
                    ×
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
