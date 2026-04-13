import { useState } from 'react'

export default function SleepQualityAnalyzer() {
  const [bedtime, setBedtime] = useState('')
  const [wakeTime, setWakeTime] = useState('')
  const [wakeUps, setWakeUps] = useState(0)
  const [result, setResult] = useState<{ hours: number; score: number; quality: string } | null>(null)

  const analyze = () => {
    if (!bedtime || !wakeTime) return
    const bed = new Date(`2000-01-01 ${bedtime}`)
    let wake = new Date(`2000-01-01 ${wakeTime}`)
    if (wake <= bed) wake = new Date(`2000-01-02 ${wakeTime}`)
    const hours = (wake.getTime() - bed.getTime()) / 3600000
    if (hours <= 0) return
    let score = 100
    if (hours < 6) score -= 30
    else if (hours < 7) score -= 15
    else if (hours > 9) score -= 10
    score -= wakeUps * 10
    score = Math.max(0, Math.min(100, score))
    const quality = score >= 80 ? 'Excellent 😴' : score >= 60 ? 'Good 😊' : score >= 40 ? 'Fair 😐' : 'Poor 😟'
    setResult({ hours: Math.round(hours * 10) / 10, score, quality })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sleep Quality Analyzer</h2>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium block mb-1">Bedtime</label>
          <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className="w-full border rounded p-2" /></div>
        <div><label className="text-sm font-medium block mb-1">Wake Time</label>
          <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="w-full border rounded p-2" /></div>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Night Wake-ups: {wakeUps}</label>
        <input type="range" min={0} max={10} value={wakeUps} onChange={(e) => setWakeUps(Number(e.target.value))} className="w-full" />
      </div>
      <button onClick={analyze} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Analyze</button>
      {result && (
        <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
          <p className="text-lg font-bold text-center">{result.quality}</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Sleep</p><p className="font-semibold">{result.hours}h</p></div>
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Wake-ups</p><p className="font-semibold">{wakeUps}</p></div>
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Score</p><p className="font-semibold">{result.score}/100</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
