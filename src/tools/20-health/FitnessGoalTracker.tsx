import { useState } from 'react'

export default function FitnessGoalTracker() {
  const [goalType, setGoalType] = useState('Weight Loss')
  const [targetDate, setTargetDate] = useState('')
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState<{ days: number; pct: number; status: string } | null>(null)

  const goalOptions = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'Strength']

  const calculate = () => {
    const pct = Math.min(100, Math.max(0, parseFloat(progress) || 0))
    const today = new Date()
    const target = new Date(targetDate)
    if (!targetDate || isNaN(target.getTime())) return
    const days = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    let status = days < 0 ? '❌ Goal date has passed' : pct >= 100 ? '🎉 Goal achieved!' : pct > 75 ? '🔥 Almost there!' : pct > 40 ? '💪 Good progress' : '🚀 Just getting started'
    setResult({ days: Math.max(0, days), pct, status })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Fitness Goal Tracker</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Goal Type</label>
        <select value={goalType} onChange={(e) => setGoalType(e.target.value)} className="w-full border rounded p-2">
          {goalOptions.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Target Date</label>
        <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Current Progress (%)</label>
        <input type="number" min={0} max={100} value={progress} onChange={(e) => setProgress(e.target.value)}
          className="w-full border rounded p-2" placeholder="0–100" />
      </div>
      <button onClick={calculate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Track</button>
      {result && (
        <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
          <p className="font-medium">{result.status}</p>
          <div className="w-full bg-gray-200 rounded h-3"><div className="bg-blue-500 h-3 rounded" style={{ width: `${result.pct}%` }} /></div>
          <div className="flex justify-between"><span>{result.pct}% complete</span><span>{result.days} days remaining</span></div>
        </div>
      )}
    </div>
  )
}
