import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ImageHueTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const handleProcess = () => {
    if (!input.trim()) return
    setResult(input)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-1">Hue Shifter</h2>
        <p className="text-sm text-slate-500 mb-4">Shift image hue and tint</p>
        <textarea
          className="w-full p-3 border border-slate-200 rounded-lg text-sm font-mono resize-y"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input..."
          rows={4}
        />
        <button
          onClick={handleProcess}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
        >
          Process
        </button>
      </div>
      {result !== null && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Result</h3>
          <pre className="text-sm bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  )
}
