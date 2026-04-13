import { useState } from 'react'

const fermentTimes: Record<string, { minH: number; maxH: number; idealTemp: string; ready: string }> = {
  Yogurt:    { minH: 6, maxH: 12, idealTemp: '40–45°C (104–113°F)', ready: 'Thick, tangy, and set. Shake — if it jiggles as one mass, it\'s ready.' },
  Sauerkraut: { minH: 24 * 3, maxH: 24 * 28, idealTemp: '18–22°C (65–72°F)', ready: 'Tangy, slightly sour, and crisp. Taste daily after day 5.' },
  Kimchi:    { minH: 24 * 1, maxH: 24 * 14, idealTemp: '0–5°C (32–41°F) after 24h', ready: 'Bubbly and tangy. Fresh kimchi in 1–2 days; aged kimchi in 1–2 weeks.' },
  Kombucha:  { minH: 24 * 7, maxH: 24 * 14, idealTemp: '24–28°C (75–82°F)', ready: 'Sweet-tart balance achieved. Taste after day 7. Second ferment for fizz.' },
}

export default function FermentationTimer() {
  const [type, setType] = useState('Yogurt')
  const [startDate, setStartDate] = useState('')
  const [result, setResult] = useState<{ elapsed: string; pct: number; status: string } | null>(null)

  const check = () => {
    if (!startDate) return
    const start = new Date(startDate)
    const now = new Date()
    const elapsedH = (now.getTime() - start.getTime()) / 3600000
    const f = fermentTimes[type]
    const pct = Math.min(100, Math.round((elapsedH / f.minH) * 100))
    const days = Math.floor(elapsedH / 24)
    const hours = Math.floor(elapsedH % 24)
    const elapsed = days > 0 ? `${days}d ${hours}h` : `${Math.floor(elapsedH)}h ${Math.round((elapsedH % 1) * 60)}m`
    const status = elapsedH < f.minH ? `⏳ Fermenting… (${Math.round(f.minH - elapsedH)}h to minimum)` : elapsedH > f.maxH ? '✅ Fully fermented — refrigerate or use soon!' : '🔍 In range — taste test recommended!'
    setResult({ elapsed, pct, status })
  }

  const f = fermentTimes[type]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Fermentation Timer</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1">Ferment Type</label>
          <select value={type} onChange={(e) => { setType(e.target.value); setResult(null) }} className="w-full border rounded p-2">
            {Object.keys(fermentTimes).map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Start Date & Time</label>
          <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded p-2 text-sm" />
        </div>
      </div>
      <button onClick={check} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Check Status</button>
      <div className="p-3 bg-gray-100 rounded text-sm space-y-2">
        <p><span className="font-medium">Ideal temp:</span> {f.idealTemp}</p>
        <p><span className="font-medium">Time range:</span> {f.minH < 48 ? `${f.minH}h` : `${f.minH / 24}d`} – {f.maxH < 48 ? `${f.maxH}h` : `${f.maxH / 24}d`}</p>
        {result && (<><div className="w-full bg-gray-200 rounded h-3"><div className="bg-green-500 h-3 rounded" style={{ width: `${result.pct}%` }} /></div><p className="font-medium">{result.status}</p><p className="text-gray-600">{f.ready}</p></>)}
      </div>
    </div>
  )
}
