import { useState } from 'react'

export default function ImageThresholdTool() {
  const [threshold, setThreshold] = useState(128)

  const blackPct = Math.round((threshold / 255) * 100)
  const whitePct = 100 - blackPct

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Threshold Tool</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Threshold Value: {threshold}</label>
        <input type="range" min={0} max={255} value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>0 (All white)</span><span>255 (All black)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black text-white rounded p-3 text-center">
            <p className="text-xs opacity-70">Below {threshold} → Black</p>
            <p className="text-xl font-bold">~{blackPct}%</p>
            <p className="text-xs opacity-70">of pixels</p>
          </div>
          <div className="bg-white border rounded p-3 text-center">
            <p className="text-xs text-gray-500">Above {threshold} → White</p>
            <p className="text-xl font-bold text-gray-800">~{whitePct}%</p>
            <p className="text-xs text-gray-500">of pixels</p>
          </div>
        </div>
        <div className="w-full h-4 rounded overflow-hidden flex">
          <div className="bg-black h-4" style={{ width: `${blackPct}%` }} />
          <div className="bg-white border-t border-b h-4 flex-1" />
        </div>
        <p className="text-xs text-gray-500">
          Converts image to pure black and white. Pixels with luminance ≤ {threshold} become black (0); all others become white (255).
        </p>
      </div>
    </div>
  )
}
