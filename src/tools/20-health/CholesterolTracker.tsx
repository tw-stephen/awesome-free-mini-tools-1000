import { useState } from 'react'

export default function CholesterolTracker() {
  const [ldl, setLdl] = useState('')
  const [hdl, setHdl] = useState('')
  const [total, setTotal] = useState('')
  const [result, setResult] = useState<{ ratio: number; risk: string; color: string; advice: string } | null>(null)

  const analyze = () => {
    const l = parseFloat(ldl), h = parseFloat(hdl), t = parseFloat(total)
    if (!l || !h || !t || h === 0) return
    const ratio = parseFloat((t / h).toFixed(2))
    let risk = '', color = '', advice = ''
    if (ratio < 3.5) { risk = 'Optimal'; color = 'text-green-600'; advice = 'Excellent cholesterol ratio. Keep up healthy habits!' }
    else if (ratio < 5) { risk = 'Borderline'; color = 'text-yellow-600'; advice = 'Moderate risk. Consider reducing saturated fats and increasing exercise.' }
    else if (ratio < 6) { risk = 'High Risk'; color = 'text-orange-600'; advice = 'Elevated cardiovascular risk. Consult your doctor about lifestyle changes.' }
    else { risk = 'Very High Risk'; color = 'text-red-600'; advice = 'Seek medical advice. Medication may be necessary alongside lifestyle changes.' }
    setResult({ ratio, risk, color, advice })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Cholesterol Tracker</h2>
      <div className="grid grid-cols-3 gap-2">
        {[['LDL (mg/dL)', ldl, setLdl], ['HDL (mg/dL)', hdl, setHdl], ['Total (mg/dL)', total, setTotal]].map(([label, val, set]) => (
          <div key={label as string}>
            <label className="text-xs font-medium block mb-1">{label}</label>
            <input type="number" value={val as string} onChange={(e) => (set as (v: string) => void)(e.target.value)}
              className="w-full border rounded p-2 text-sm" placeholder="0" />
          </div>
        ))}
      </div>
      <button onClick={analyze} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Analyze</button>
      {result && (
        <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Total/HDL Ratio</p><p className="font-semibold text-lg">{result.ratio}</p></div>
            <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Risk Level</p><p className={`font-semibold ${result.color}`}>{result.risk}</p></div>
          </div>
          <p className="text-gray-700">{result.advice}</p>
        </div>
      )}
    </div>
  )
}
