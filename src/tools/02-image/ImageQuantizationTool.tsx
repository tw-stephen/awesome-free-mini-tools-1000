import { useState } from 'react'

const algos: Record<string, string> = {
  'Median Cut': 'Recursively splits the color space by cutting the axis with the largest range. Fast and widely used in GIF/PNG encoders.',
  'K-Means':    'Iteratively refines cluster centers to minimize total color distance. Produces perceptually optimal palettes but is slower and non-deterministic.',
  Octree:       'Builds an octree of colors in RGB space and prunes nodes to reach the target count. Very memory-efficient; used in many image editors.',
}

export default function ImageQuantizationTool() {
  const [numColors, setNumColors] = useState(16)
  const [algo, setAlgo] = useState('Median Cut')

  const iterations = algo === 'K-Means' ? Math.ceil(numColors * 0.8) : 1
  const complexity = algo === 'K-Means' ? `O(n·k·i) where k=${numColors}, i≈${iterations}` : algo === 'Octree' ? 'O(n log n)' : 'O(n log k)'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Quantization Tool</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Number of Colors: {numColors}</label>
        <input type="range" min={2} max={256} value={numColors}
          onChange={(e) => setNumColors(Number(e.target.value))} className="w-full" />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Algorithm</label>
        <select value={algo} onChange={(e) => setAlgo(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(algos).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{algos[algo]}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Target palette</p><p className="font-semibold">{numColors} colors</p></div>
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Complexity</p><p className="font-semibold text-xs">{complexity}</p></div>
        </div>
      </div>
    </div>
  )
}
