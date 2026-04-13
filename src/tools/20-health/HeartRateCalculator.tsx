import { useState } from 'react'

export default function HeartRateCalculator() {
  const [age, setAge] = useState('')
  const [intensity, setIntensity] = useState(70)
  const [result, setResult] = useState<{ max: number; target: number; zone: string } | null>(null)

  const calculate = () => {
    const a = parseInt(age)
    if (!a || a < 10 || a > 100) return
    const max = 220 - a
    const target = Math.round(max * intensity / 100)
    let zone = ''
    if (intensity < 50) zone = 'Resting / Warm-up'
    else if (intensity < 60) zone = 'Zone 1 — Fat Burn (Light)'
    else if (intensity < 70) zone = 'Zone 2 — Aerobic (Moderate)'
    else if (intensity < 80) zone = 'Zone 3 — Cardio (Hard)'
    else if (intensity < 90) zone = 'Zone 4 — Threshold (Very Hard)'
    else zone = 'Zone 5 — VO2 Max (Maximum)'
    setResult({ max, target, zone })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Heart Rate Calculator</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Age (years)</label>
        <input type="number" min={10} max={100} value={age} onChange={(e) => setAge(e.target.value)}
          className="w-full border rounded p-2" placeholder="e.g. 30" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Target Intensity: {intensity}%</label>
        <input type="range" min={50} max={90} value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>50% (Light)</span><span>90% (Max)</span></div>
      </div>
      <button onClick={calculate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Calculate
      </button>
      {result && (
        <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Max HR</p><p className="font-semibold">{result.max} bpm</p></div>
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Target HR</p><p className="font-semibold text-blue-600">{result.target} bpm</p></div>
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Intensity</p><p className="font-semibold">{intensity}%</p></div>
          </div>
          <p className="font-medium text-center">{result.zone}</p>
          <p className="text-xs text-gray-500">Formula: Max HR = 220 − age. Target = Max × intensity%</p>
        </div>
      )}
    </div>
  )
}
