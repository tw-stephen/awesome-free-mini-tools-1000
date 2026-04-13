import { useState } from 'react'

const algorithms: Record<string, { quality: string; speed: string; desc: string }> = {
  'Floyd-Steinberg': { quality: '⭐⭐⭐⭐⭐', speed: 'Fast', desc: 'Error-diffusion dithering — spreads quantization error to neighboring pixels. Produces smooth, photographic results with minimal banding.' },
  Ordered:          { quality: '⭐⭐⭐', speed: 'Very Fast', desc: 'Uses a fixed Bayer matrix to create a regular dot pattern. Very fast and deterministic. Output has a screen-print or halftone appearance.' },
  Random:           { quality: '⭐⭐', speed: 'Fastest', desc: 'Adds uniform random noise before quantizing. Crude but eliminates structured patterns. Produces a grainy, noisy look.' },
  Atkinson:         { quality: '⭐⭐⭐⭐', speed: 'Fast', desc: 'Spreads only 75% of the error (vs 100% in Floyd-Steinberg). Preserves highlight detail better. Popularized by Apple\'s Mac QuickDraw.' },
}

export default function ImageDitheringTool() {
  const [algo, setAlgo] = useState('Floyd-Steinberg')
  const a = algorithms[algo]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Dithering Tool</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Dithering Algorithm</label>
        <select value={algo} onChange={(e) => setAlgo(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(algorithms).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Quality</p><p className="font-semibold">{a.quality}</p></div>
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Speed</p><p className="font-semibold">{a.speed}</p></div>
        </div>
        <p className="text-gray-700">{a.desc}</p>
      </div>
    </div>
  )
}
