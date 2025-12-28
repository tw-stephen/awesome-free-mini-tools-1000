import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface FoodEntry {
  id: number
  name: string
  calories: number
  time: string
}

export default function CalorieCounter() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [dailyGoal, setDailyGoal] = useState(2000)
  const [newFood, setNewFood] = useState('')
  const [newCalories, setNewCalories] = useState('')
  const [today] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const saved = localStorage.getItem('calorie-counter')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setEntries(data.entries || [])
        setDailyGoal(data.goal || 2000)
      } catch (e) {
        console.error('Failed to load calorie data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('calorie-counter', JSON.stringify({ entries, goal: dailyGoal }))
  }, [entries, dailyGoal])

  const todayEntries = entries.filter(e => e.time.startsWith(today))
  const totalCalories = todayEntries.reduce((sum, e) => sum + e.calories, 0)
  const remaining = dailyGoal - totalCalories
  const percentage = Math.min((totalCalories / dailyGoal) * 100, 100)

  const addEntry = () => {
    if (!newFood.trim() || !newCalories) return

    const entry: FoodEntry = {
      id: Date.now(),
      name: newFood,
      calories: parseInt(newCalories),
      time: new Date().toISOString(),
    }
    setEntries([entry, ...entries])
    setNewFood('')
    setNewCalories('')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const commonFoods = [
    { name: 'Apple', calories: 95 },
    { name: 'Banana', calories: 105 },
    { name: 'Rice Bowl', calories: 240 },
    { name: 'Bread Slice', calories: 80 },
    { name: 'Egg', calories: 70 },
    { name: 'Chicken Breast', calories: 165 },
    { name: 'Salad', calories: 150 },
    { name: 'Milk (1 cup)', calories: 120 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">{t('tools.calorieCounter.today')}</span>
          <span className="text-sm text-slate-500">{totalCalories} / {dailyGoal} kcal</span>
        </div>
        <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-center mt-2">
          <span className={`text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {remaining >= 0 ? remaining : Math.abs(remaining)} kcal {remaining >= 0 ? t('tools.calorieCounter.remaining') : t('tools.calorieCounter.over')}
          </span>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.calorieCounter.foodName')}
          </label>
          <input
            type="text"
            value={newFood}
            onChange={(e) => setNewFood(e.target.value)}
            placeholder={t('tools.calorieCounter.foodPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.calorieCounter.calories')}
          </label>
          <input
            type="number"
            value={newCalories}
            onChange={(e) => setNewCalories(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <button
          onClick={addEntry}
          disabled={!newFood.trim() || !newCalories}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
        >
          + {t('tools.calorieCounter.addFood')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.calorieCounter.quickAdd')}</h3>
        <div className="flex flex-wrap gap-2">
          {commonFoods.map(food => (
            <button
              key={food.name}
              onClick={() => { setNewFood(food.name); setNewCalories(food.calories.toString()) }}
              className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {food.name} ({food.calories})
            </button>
          ))}
        </div>
      </div>

      {todayEntries.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.calorieCounter.todayLog')}</h3>
          <div className="space-y-2">
            {todayEntries.map(entry => (
              <div key={entry.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div>
                  <div className="font-medium text-sm">{entry.name}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-600">{entry.calories} kcal</span>
                  <button onClick={() => deleteEntry(entry.id)} className="text-red-500">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.calorieCounter.dailyGoal')}
        </label>
        <input
          type="number"
          value={dailyGoal}
          onChange={(e) => setDailyGoal(parseInt(e.target.value) || 2000)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>
    </div>
  )
}
