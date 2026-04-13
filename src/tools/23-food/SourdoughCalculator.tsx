import { useState } from 'react'

export default function SourdoughCalculator() {
  const [totalWeight, setTotalWeight] = useState(500)
  const [hydration, setHydration] = useState(75)
  const [starterPct, setStarterPct] = useState(20)
  const [result, setResult] = useState<{ flour: number; water: number; starter: number; salt: number } | null>(null)

  const calculate = () => {
    if (totalWeight <= 0) return
    // Baker's math: flour is the base (100%)
    // starter at X% of flour, hydration Y%, salt ~2%
    const starterDecimal = starterPct / 100
    const hydrationDecimal = hydration / 100
    // total = flour + water + starter + salt
    // water from starter (assume 100% hydration starter): starter/2 each flour and water
    // flour = totalWeight / (1 + hydrationDecimal + starterDecimal + 0.02)
    const flour = Math.round(totalWeight / (1 + hydrationDecimal + starterDecimal + 0.02))
    const water = Math.round(flour * hydrationDecimal)
    const starter = Math.round(flour * starterDecimal)
    const salt = Math.round(flour * 0.02)
    setResult({ flour, water, starter, salt })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sourdough Calculator</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Total Dough Weight: {totalWeight}g</label>
        <input type="number" min={100} max={5000} value={totalWeight} onChange={(e) => setTotalWeight(Number(e.target.value))}
          className="w-full border rounded p-2" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Hydration: {hydration}%</label>
        <input type="range" min={60} max={100} value={hydration} onChange={(e) => setHydration(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>60% (Firm)</span><span>100% (Very wet)</span></div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Starter: {starterPct}%</label>
        <input type="range" min={10} max={30} value={starterPct} onChange={(e) => setStarterPct(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>10% (Slow rise)</span><span>30% (Fast rise)</span></div>
      </div>
      <button onClick={calculate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Calculate</button>
      {result && (
        <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
          <p className="font-medium">Recipe for {totalWeight}g dough</p>
          <div className="grid grid-cols-2 gap-2">
            {[['Flour', result.flour, 'bg-amber-50'], ['Water', result.water, 'bg-blue-50'], ['Starter', result.starter, 'bg-green-50'], ['Salt', result.salt, 'bg-red-50']].map(([label, val, bg]) => (
              <div key={label as string} className={`${bg} rounded p-2 text-center border`}>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-bold text-lg">{val}g</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">Starter assumed 100% hydration. Salt at 2% of flour. Totals may differ by ±1g due to rounding.</p>
        </div>
      )}
    </div>
  )
}
