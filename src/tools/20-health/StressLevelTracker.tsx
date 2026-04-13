import { useState } from 'react'

interface Log { level: number; trigger: string; time: string }

export default function StressLevelTracker() {
  const [level, setLevel] = useState(5)
  const [trigger, setTrigger] = useState('')
  const [logs, setLogs] = useState<Log[]>([])

  const logEntry = () => {
    const time = new Date().toLocaleTimeString()
    setLogs([{ level, trigger: trigger || 'Not specified', time }, ...logs].slice(0, 7))
    setTrigger('')
  }

  const avg = logs.length > 0 ? (logs.reduce((s, l) => s + l.level, 0) / logs.length).toFixed(1) : null
  const trend = logs.length >= 2 ? (logs[0].level > logs[1].level ? '↑ Rising' : logs[0].level < logs[1].level ? '↓ Falling' : '→ Stable') : null

  const label = level <= 2 ? 'Very Low' : level <= 4 ? 'Low' : level <= 6 ? 'Moderate' : level <= 8 ? 'High' : 'Very High'
  const color = level <= 3 ? 'text-green-600' : level <= 6 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Stress Level Tracker</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Stress Level: {level}/10 — <span className={color}>{label}</span></label>
        <input type="range" min={1} max={10} value={level}
          onChange={(e) => setLevel(Number(e.target.value))} className="w-full" />
      </div>
      <input value={trigger} onChange={(e) => setTrigger(e.target.value)}
        className="w-full border rounded p-2 text-sm" placeholder="Trigger or note (optional)" />
      <button onClick={logEntry} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Log</button>
      {logs.length > 0 && (
        <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
          <div className="flex justify-between"><span>Average: <strong>{avg}</strong></span>{trend && <span>{trend}</span>}</div>
          <div className="space-y-1">
            {logs.map((l, i) => (
              <div key={i} className="flex justify-between text-xs bg-white rounded p-1 px-2">
                <span>{l.level}/10 — {l.trigger}</span><span className="text-gray-400">{l.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
