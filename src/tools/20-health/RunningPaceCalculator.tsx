import { useState } from 'react'

export default function RunningPaceCalculator() {
  const [distance, setDistance] = useState('')
  const [time, setTime] = useState('')
  const [unit, setUnit] = useState<'km' | 'mi'>('km')
  const [result, setResult] = useState<{ paceMin: number; paceSec: number; speed: number } | null>(null)

  const calculate = () => {
    const dist = parseFloat(distance)
    const parts = time.split(':').map(Number)
    if (!dist || parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return
    const hours = parts.length === 3 ? parts[0] : 0
    const minutes = parts.length === 3 ? parts[1] : parts[0]
    const seconds = parts.length === 3 ? parts[2] : parts[1]
    const totalMin = hours * 60 + minutes + seconds / 60
    const paceDecimal = totalMin / dist
    const paceMin = Math.floor(paceDecimal)
    const paceSec = Math.round((paceDecimal - paceMin) * 60)
    const speed = parseFloat((dist / (totalMin / 60)).toFixed(2))
    setResult({ paceMin, paceSec, speed })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Running Pace Calculator</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1">Distance</label>
          <div className="flex gap-1">
            <input type="number" step="0.01" value={distance} onChange={(e) => setDistance(e.target.value)}
              className="flex-1 border rounded p-2 text-sm" placeholder="0.0" />
            <select value={unit} onChange={(e) => setUnit(e.target.value as 'km' | 'mi')} className="border rounded p-2 text-sm">
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Time (hh:mm:ss or mm:ss)</label>
          <input type="text" value={time} onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded p-2 text-sm" placeholder="e.g. 25:30 or 1:05:30" />
        </div>
      </div>
      <button onClick={calculate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Calculate Pace</button>
      {result && (
        <div className="p-3 bg-gray-100 rounded text-sm space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded p-2 text-center">
              <p className="text-xs text-gray-500">Pace per {unit}</p>
              <p className="font-bold text-lg">{result.paceMin}:{result.paceSec.toString().padStart(2, '0')} min/{unit}</p>
            </div>
            <div className="bg-white rounded p-2 text-center">
              <p className="text-xs text-gray-500">Speed</p>
              <p className="font-bold text-lg">{result.speed} {unit}/h</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
