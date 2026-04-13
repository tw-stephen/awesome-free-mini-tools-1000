import { useState } from 'react'

export default function BloodPressureTracker() {
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [result, setResult] = useState<{ category: string; color: string; advice: string } | null>(null)

  const classify = () => {
    const s = parseInt(systolic)
    const d = parseInt(diastolic)
    if (!s || !d || s < 50 || d < 30) return
    let category = '', color = '', advice = ''
    if (s < 120 && d < 80) { category = 'Normal'; color = 'text-green-600'; advice = 'Great! Maintain a healthy lifestyle.' }
    else if (s < 130 && d < 80) { category = 'Elevated'; color = 'text-yellow-600'; advice = 'Lifestyle changes recommended. Monitor regularly.' }
    else if (s < 140 || d < 90) { category = 'High BP — Stage 1'; color = 'text-orange-600'; advice = 'Consult a doctor. Reduce sodium, exercise regularly.' }
    else if (s >= 140 || d >= 90) { category = 'High BP — Stage 2'; color = 'text-red-600'; advice = 'Seek medical attention. Medication may be needed.' }
    if (s >= 180 || d >= 120) { category = 'Hypertensive Crisis'; color = 'text-red-700'; advice = '⚠️ Seek emergency care immediately!' }
    setResult({ category, color, advice })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Blood Pressure Tracker</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1">Systolic (mmHg)</label>
          <input type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)}
            className="w-full border rounded p-2" placeholder="e.g. 120" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Diastolic (mmHg)</label>
          <input type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)}
            className="w-full border rounded p-2" placeholder="e.g. 80" />
        </div>
      </div>
      <button onClick={classify} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Check BP
      </button>
      {result && (
        <div className="p-3 bg-gray-100 rounded space-y-1 text-sm">
          <p className={`text-lg font-bold ${result.color}`}>{result.category}</p>
          <p className="font-mono">{systolic}/{diastolic} mmHg</p>
          <p className="text-gray-700">{result.advice}</p>
        </div>
      )}
    </div>
  )
}
