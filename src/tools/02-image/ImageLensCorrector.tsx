import { useState } from 'react'

export default function ImageLensCorrector() {
  const [k1, setK1] = useState(0)
  const [k2, setK2] = useState(0)

  const distType = () => {
    if (k1 > 0.1) return 'Pincushion distortion (k1 > 0). Edges bow inward — common in telephoto lenses.'
    if (k1 < -0.1) return 'Barrel distortion (k1 < 0). Edges bow outward — typical in wide-angle and fisheye lenses.'
    return 'Near-neutral distortion. Minimal correction needed.'
  }

  const correctionStrength = () => {
    const mag = Math.abs(k1) + Math.abs(k2) * 0.5
    if (mag < 0.1) return 'None / Negligible'
    if (mag < 0.3) return 'Light'
    if (mag < 0.6) return 'Moderate'
    return 'Strong'
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Lens Corrector</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Barrel/Pincushion (k1): {k1.toFixed(2)}</label>
        <input type="range" min={-1} max={1} step={0.01} value={k1}
          onChange={(e) => setK1(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>-1.0 (Strong barrel)</span><span>+1.0 (Strong pincushion)</span></div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Secondary Coefficient (k2): {k2.toFixed(2)}</label>
        <input type="range" min={-1} max={1} step={0.01} value={k2}
          onChange={(e) => setK2(Number(e.target.value))} className="w-full" />
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{distType()}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Strength</p><p className="font-semibold">{correctionStrength()}</p></div>
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Model</p><p className="font-semibold font-mono text-xs">r' = r(1+k1r²+k2r⁴)</p></div>
        </div>
      </div>
    </div>
  )
}
