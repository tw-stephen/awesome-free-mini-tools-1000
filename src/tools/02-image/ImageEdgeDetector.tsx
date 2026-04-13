import { useState } from 'react'

const algorithms: Record<string, { complexity: string; desc: string; best: string }> = {
  Sobel:     { complexity: 'O(n)', desc: 'Uses two 3×3 kernels to detect horizontal and vertical gradients. Fast and widely used. Produces smooth, thick edges.', best: 'General purpose edge detection' },
  Canny:     { complexity: 'O(n log n)', desc: 'Multi-stage pipeline: Gaussian blur → gradient → non-maximum suppression → double threshold → hysteresis. Best quality.', best: 'High-quality contour detection' },
  Laplacian: { complexity: 'O(n)', desc: 'Second-order derivative filter using a single kernel. Detects edges in all directions simultaneously. Sensitive to noise.', best: 'Sharpness detection, blob analysis' },
  Prewitt:   { complexity: 'O(n)', desc: 'Similar to Sobel but with equal weight coefficients. Slightly less noise-robust but computationally equivalent.', best: 'Simple directional edge detection' },
}

export default function ImageEdgeDetector() {
  const [algo, setAlgo] = useState('Canny')
  const a = algorithms[algo]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Edge Detector</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Algorithm</label>
        <select value={algo} onChange={(e) => setAlgo(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(algorithms).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Algorithm</p><p className="font-semibold">{algo}</p></div>
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Complexity</p><p className="font-semibold">{a.complexity}</p></div>
        </div>
        <p className="text-sm text-gray-700">{a.desc}</p>
        <p className="text-xs text-gray-500"><span className="font-medium">Best for:</span> {a.best}</p>
      </div>
    </div>
  )
}
