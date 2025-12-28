import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface WaterEntry {
  id: number
  amount: number
  time: string
}

export default function WaterIntakeTracker() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<WaterEntry[]>([])
  const [dailyGoal, setDailyGoal] = useState(2000) // ml
  const [customAmount, setCustomAmount] = useState(250)

  const quickAmounts = [
    { amount: 150, label: 'Small Glass', icon: '🥛' },
    { amount: 250, label: 'Glass', icon: '🥤' },
    { amount: 350, label: 'Large Glass', icon: '🫗' },
    { amount: 500, label: 'Bottle', icon: '🍶' },
  ]

  const addWater = (amount: number) => {
    setEntries([
      ...entries,
      {
        id: Date.now(),
        amount,
        time: new Date().toTimeString().slice(0, 5),
      },
    ])
  }

  const removeEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id))
  }

  const totalIntake = entries.reduce((sum, e) => sum + e.amount, 0)
  const percentage = Math.min((totalIntake / dailyGoal) * 100, 100)
  const remaining = Math.max(dailyGoal - totalIntake, 0)

  const getWaterDrops = () => {
    const drops = Math.ceil((totalIntake / dailyGoal) * 8)
    return Array.from({ length: 8 }, (_, i) => i < drops)
  }

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    const targetByNow = Math.round((hour / 24) * dailyGoal)
    const diff = totalIntake - targetByNow
    if (diff >= 0) return { status: 'good', message: "You're on track!" }
    if (diff > -500) return { status: 'warning', message: "Drink some more water" }
    return { status: 'low', message: "You need to catch up on hydration" }
  }

  const hydrationStatus = getTimeOfDay()

  return (
    <div className="space-y-4">
      <div className="card p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-blue-600">{t('tools.waterIntakeTracker.dailyGoal')}</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value) || 2000)}
              step={100}
              className="w-20 px-2 py-1 text-right border border-blue-300 rounded text-sm"
            />
            <span className="text-sm text-blue-500">ml</span>
          </div>
        </div>

        <div className="flex justify-center gap-1 my-4">
          {getWaterDrops().map((filled, i) => (
            <div
              key={i}
              className={`text-3xl transition-all ${filled ? 'opacity-100' : 'opacity-20'}`}
            >
              💧
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">{totalIntake}</div>
          <div className="text-sm text-blue-500">ml of {dailyGoal} ml</div>
        </div>

        <div className="relative h-4 bg-blue-100 rounded-full overflow-hidden mt-4">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="text-center mt-2">
          {percentage >= 100 ? (
            <span className="text-green-600 font-medium">Goal reached! 🎉</span>
          ) : (
            <span className="text-blue-600">{remaining} ml remaining</span>
          )}
        </div>
      </div>

      <div
        className={`card p-3 ${
          hydrationStatus.status === 'good'
            ? 'bg-green-50 border-green-200'
            : hydrationStatus.status === 'warning'
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="text-center text-sm">
          {hydrationStatus.status === 'good' && '✅ '}
          {hydrationStatus.status === 'warning' && '⚠️ '}
          {hydrationStatus.status === 'low' && '🚨 '}
          {hydrationStatus.message}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map((item) => (
          <button
            key={item.amount}
            onClick={() => addWater(item.amount)}
            className="card p-3 hover:shadow-md transition-shadow text-center"
          >
            <div className="text-2xl">{item.icon}</div>
            <div className="text-xs text-slate-500">{item.label}</div>
            <div className="font-medium text-sm">{item.amount}ml</div>
          </button>
        ))}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.waterIntakeTracker.customAmount')}</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
            step={50}
            min={0}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
            placeholder="Amount in ml"
          />
          <button
            onClick={() => addWater(customAmount)}
            disabled={customAmount <= 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            + Add
          </button>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.waterIntakeTracker.todaysIntake')}</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {entries
              .slice()
              .reverse()
              .map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <div className="flex items-center gap-2">
                    <span>💧</span>
                    <span className="font-medium">{entry.amount} ml</span>
                    <span className="text-sm text-slate-500">at {entry.time}</span>
                  </div>
                  <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600">
                    ×
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-cyan-50">
        <h3 className="font-medium text-cyan-700 mb-2">{t('tools.waterIntakeTracker.tips')}</h3>
        <ul className="text-sm text-cyan-600 space-y-1">
          <li>• Drink a glass of water when you wake up</li>
          <li>• Keep a water bottle at your desk</li>
          <li>• Set hourly reminders to drink</li>
          <li>• Drink before, during, and after exercise</li>
        </ul>
      </div>
    </div>
  )
}
