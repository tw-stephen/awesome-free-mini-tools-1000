import { useState } from 'react'

export default function YogaTimer() {
  const [sessionMin, setSessionMin] = useState(30)
  const [holdSec, setHoldSec] = useState(30)
  const [result, setResult] = useState<{ poses: number; rest: number; totalPoses: number } | null>(null)

  const calculate = () => {
    const totalSec = sessionMin * 60
    const poseWithRest = holdSec + 5 // 5s transition
    const poses = Math.floor(totalSec / poseWithRest)
    const restTotal = poses * 5
    const totalPoses = poses
    setResult({ poses, rest: restTotal, totalPoses })
  }

  const warmup = Math.round(sessionMin * 0.15)
  const cooldown = Math.round(sessionMin * 0.15)
  const practice = sessionMin - warmup - cooldown

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Yoga Session Timer</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Session Duration: {sessionMin} minutes</label>
        <input type="range" min={10} max={90} value={sessionMin}
          onChange={(e) => setSessionMin(Number(e.target.value))} className="w-full" />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Pose Hold Time: {holdSec} seconds</label>
        <input type="range" min={10} max={120} value={holdSec}
          onChange={(e) => setHoldSec(Number(e.target.value))} className="w-full" />
      </div>
      <button onClick={calculate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Plan Session
      </button>
      {result && (
        <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Warm-up</p><p className="font-semibold">{warmup} min</p></div>
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Practice</p><p className="font-semibold">{practice} min</p></div>
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Cool-down</p><p className="font-semibold">{cooldown} min</p></div>
          </div>
          <p className="text-center font-medium">~{result.totalPoses} poses at {holdSec}s each</p>
        </div>
      )}
    </div>
  )
}
