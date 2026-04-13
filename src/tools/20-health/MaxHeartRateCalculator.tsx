import { useState } from 'react'

export default function MaxHeartRateCalculator() {
  const [age, setAge] = useState('')
  const [result, setResult] = useState<{ hrMax: number; tanaka: number; gulati: number } | null>(null)

  const calculate = () => {
    const a = parseInt(age)
    if (!a || a < 10 || a > 100) return
    setResult({
      hrMax: 220 - a,
      tanaka: Math.round(208 - 0.7 * a),
      gulati: Math.round(206 - 0.88 * a),
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Max Heart Rate Calculator</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Age (years)</label>
        <input type="number" min={10} max={100} value={age} onChange={(e) => setAge(e.target.value)}
          className="w-full border rounded p-2" placeholder="e.g. 35" />
      </div>
      <button onClick={calculate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Calculate</button>
      {result && (
        <div className="p-3 bg-gray-100 rounded space-y-3 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between bg-white rounded p-2">
              <span><span className="font-medium">Fox (220 − age)</span><span className="text-gray-500 text-xs ml-2">Most common</span></span>
              <span className="font-bold text-blue-600">{result.hrMax} bpm</span>
            </div>
            <div className="flex justify-between bg-white rounded p-2">
              <span><span className="font-medium">Tanaka (208 − 0.7×age)</span><span className="text-gray-500 text-xs ml-2">Validated study</span></span>
              <span className="font-bold text-blue-600">{result.tanaka} bpm</span>
            </div>
            <div className="flex justify-between bg-white rounded p-2">
              <span><span className="font-medium">Gulati (206 − 0.88×age)</span><span className="text-gray-500 text-xs ml-2">For women</span></span>
              <span className="font-bold text-blue-600">{result.gulati} bpm</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">These are estimates. Individual max HR can vary ±10–20 bpm. Use a graded exercise test for precision.</p>
        </div>
      )}
    </div>
  )
}
