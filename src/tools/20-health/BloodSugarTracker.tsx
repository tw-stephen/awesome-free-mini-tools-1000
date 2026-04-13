import { useState } from 'react'

export default function BloodSugarTracker() {
  const [sugar, setSugar] = useState('')
  const [readingType, setReadingType] = useState('Fasting')
  const [result, setResult] = useState<{ status: string; color: string; range: string; advice: string } | null>(null)

  const check = () => {
    const val = parseFloat(sugar)
    if (!val || val <= 0) return
    let status = '', color = '', advice = ''
    const range = readingType === 'Fasting' ? '70–99 normal, 100–125 prediabetes, ≥126 diabetes' : '< 140 normal, 140–199 prediabetes, ≥200 diabetes'

    if (readingType === 'Fasting') {
      if (val < 70) { status = 'Low (Hypoglycemia)'; color = 'text-blue-600'; advice = 'Consume fast-acting carbs (juice, glucose tablets). Seek help if severe.' }
      else if (val < 100) { status = 'Normal'; color = 'text-green-600'; advice = 'Your fasting blood sugar is in the healthy range.' }
      else if (val < 126) { status = 'Prediabetes Range'; color = 'text-yellow-600'; advice = 'Diet and exercise changes can prevent progression to type 2 diabetes.' }
      else { status = 'Diabetes Range'; color = 'text-red-600'; advice = 'Consult your doctor promptly for evaluation and management.' }
    } else {
      if (val < 140) { status = 'Normal (Post-meal)'; color = 'text-green-600'; advice = 'Post-meal blood sugar is within healthy range.' }
      else if (val < 200) { status = 'Prediabetes Range'; color = 'text-yellow-600'; advice = 'Consider reducing carbohydrate intake and increasing activity.' }
      else { status = 'Diabetes Range'; color = 'text-red-600'; advice = 'Consult your doctor for proper evaluation.' }
    }
    setResult({ status, color, range, advice })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Blood Sugar Tracker</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1">Reading (mg/dL)</label>
          <input type="number" value={sugar} onChange={(e) => setSugar(e.target.value)}
            className="w-full border rounded p-2" placeholder="e.g. 95" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Reading Type</label>
          <select value={readingType} onChange={(e) => setReadingType(e.target.value)} className="w-full border rounded p-2">
            <option>Fasting</option>
            <option>Post-meal</option>
          </select>
        </div>
      </div>
      <button onClick={check} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Check</button>
      {result && (
        <div className="p-3 bg-gray-100 rounded space-y-1 text-sm">
          <p className={`text-lg font-bold ${result.color}`}>{result.status}</p>
          <p className="text-gray-700">{result.advice}</p>
          <p className="text-xs text-gray-500 mt-1">Reference: {result.range}</p>
        </div>
      )}
    </div>
  )
}
