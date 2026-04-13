import { useState } from 'react'

export default function Vo2MaxEstimator() {
  const [restingHr, setRestingHr] = useState('')
  const [age, setAge] = useState('')
  const [maxHr, setMaxHr] = useState('')
  const [result, setResult] = useState<{ vo2: number; category: string; color: string } | null>(null)

  const estimate = () => {
    const rhr = parseFloat(restingHr)
    const a = parseInt(age)
    if (!rhr || rhr <= 0) return
    const mhr = maxHr ? parseFloat(maxHr) : a ? 220 - a : null
    if (!mhr) return
    // Uth–Sørensen–Overgaard–Pedersen formula
    const vo2 = parseFloat((15 * mhr / rhr).toFixed(1))
    let category = '', color = ''
    if (vo2 < 25) { category = 'Poor'; color = 'text-red-600' }
    else if (vo2 < 35) { category = 'Below Average'; color = 'text-orange-600' }
    else if (vo2 < 42) { category = 'Average'; color = 'text-yellow-600' }
    else if (vo2 < 50) { category = 'Above Average'; color = 'text-blue-600' }
    else if (vo2 < 60) { category = 'Good'; color = 'text-green-600' }
    else { category = 'Excellent'; color = 'text-green-700' }
    setResult({ vo2, category, color })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">VO₂ Max Estimator</h2>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs font-medium block mb-1">Resting HR (bpm)</label>
          <input type="number" value={restingHr} onChange={(e) => setRestingHr(e.target.value)}
            className="w-full border rounded p-2 text-sm" placeholder="e.g. 60" />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Age (optional)</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
            className="w-full border rounded p-2 text-sm" placeholder="e.g. 30" />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Max HR (optional)</label>
          <input type="number" value={maxHr} onChange={(e) => setMaxHr(e.target.value)}
            className="w-full border rounded p-2 text-sm" placeholder="e.g. 190" />
        </div>
      </div>
      <p className="text-xs text-gray-500">Provide age OR max HR. If both provided, max HR takes priority.</p>
      <button onClick={estimate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Estimate VO₂ Max</button>
      {result && (
        <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">VO₂ Max</p><p className="font-bold text-xl">{result.vo2} <span className="text-xs font-normal">mL/kg/min</span></p></div>
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Category</p><p className={`font-bold text-lg ${result.color}`}>{result.category}</p></div>
          </div>
          <p className="text-xs text-gray-500">Formula: VO₂ max = 15 × (Max HR / Resting HR) — Uth et al. 2004</p>
        </div>
      )}
    </div>
  )
}
