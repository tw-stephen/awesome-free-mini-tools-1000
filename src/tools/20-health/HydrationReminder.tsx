import { useState } from 'react'

export default function HydrationReminder() {
  const [goal, setGoal] = useState(64)
  const [unit, setUnit] = useState<'oz' | 'ml'>('oz')
  const [consumed, setConsumed] = useState(0)
  const [glassSize, setGlassSize] = useState(8)

  const pct = Math.min(100, Math.round((consumed / goal) * 100))
  const remaining = Math.max(0, goal - consumed)
  const glassesLeft = Math.ceil(remaining / glassSize)
  const status = pct >= 100 ? '🎉 Goal met!' : pct >= 75 ? '💧 Almost there!' : pct >= 50 ? '👍 Good progress' : '⚠️ Drink more water'

  const addGlass = () => setConsumed((c) => Math.min(goal * 2, c + glassSize))
  const reset = () => setConsumed(0)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Hydration Reminder</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1">Daily Goal ({unit})</label>
          <input type="number" min={1} value={goal} onChange={(e) => setGoal(Number(e.target.value))}
            className="w-full border rounded p-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Glass Size ({unit})</label>
          <input type="number" min={1} value={glassSize} onChange={(e) => setGlassSize(Number(e.target.value))}
            className="w-full border rounded p-2 text-sm" />
        </div>
      </div>
      <div className="flex gap-2">
        <select value={unit} onChange={(e) => setUnit(e.target.value as 'oz' | 'ml')} className="border rounded p-2 text-sm">
          <option value="oz">oz</option>
          <option value="ml">ml</option>
        </select>
        <button onClick={addGlass} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">+ Add Glass</button>
        <button onClick={reset} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm">Reset</button>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <div className="w-full bg-gray-200 rounded h-4"><div className="bg-blue-400 h-4 rounded transition-all" style={{ width: `${pct}%` }} /></div>
        <p className="font-medium text-center">{status}</p>
        <div className="flex justify-between"><span>{consumed} / {goal} {unit} ({pct}%)</span><span>{glassesLeft} glass{glassesLeft !== 1 ? 'es' : ''} left</span></div>
      </div>
    </div>
  )
}
