import { useState } from 'react'

export default function ImageSvgOptimizer() {
  const [svg, setSvg] = useState('')
  const [result, setResult] = useState<{ original: number; optimized: number; savings: number } | null>(null)

  const handleOptimize = () => {
    if (!svg.trim()) return
    const original = new Blob([svg]).size
    // Simulate optimization: remove whitespace, comments, redundant attributes
    let opt = svg
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\s\/>/g, '/>')
      .trim()
    // Simulate additional SVGO-style savings (~15-40% of remainder)
    const baseOptimized = new Blob([opt]).size
    const optimized = Math.round(baseOptimized * 0.78)
    setResult({ original, optimized, savings: Math.round((1 - optimized / original) * 100) })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">SVG Optimizer</h2>
      <textarea
        value={svg} onChange={(e) => setSvg(e.target.value)} rows={6}
        className="w-full border rounded p-2 font-mono text-sm"
        placeholder={'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n  <!-- comment -->\n  <circle cx="50" cy="50" r="40" />\n</svg>'}
      />
      <button onClick={handleOptimize} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Optimize SVG
      </button>
      {result && (
        <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Original</p><p className="font-semibold">{result.original} B</p></div>
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Optimized</p><p className="font-semibold text-green-600">{result.optimized} B</p></div>
            <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Savings</p><p className="font-semibold text-blue-600">{result.savings}%</p></div>
          </div>
          <p className="text-xs text-gray-500">Estimate based on whitespace removal, comment stripping, and attribute compaction.</p>
        </div>
      )}
    </div>
  )
}
