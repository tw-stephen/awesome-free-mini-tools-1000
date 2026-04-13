import { useState } from 'react'

export default function ImageGammaCorrection() {
  const [gamma, setGamma] = useState(1.0)

  const describe = (g: number) => {
    if (g < 0.5) return 'Very dark — only the brightest highlights remain visible. Extreme darkening.'
    if (g < 0.8) return 'Noticeably darkened display. Shadows are crushed; bright areas are preserved.'
    if (g < 0.95) return 'Slightly darkened. Useful for correcting over-bright monitors or images.'
    if (g <= 1.05) return 'Neutral gamma (1.0). No correction applied — linear output.'
    if (g <= 1.5) return 'Slightly brightened midtones. Lifts shadows without clipping highlights.'
    if (g <= 2.2) return 'Significant midtone lift. Approximates standard monitor gamma correction.'
    return 'Very bright output. Midtones and shadows are heavily lifted — highlights may clip.'
  }

  const midOutput = (g: number) => Math.round(Math.pow(128 / 255, 1 / g) * 255)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Gamma Correction</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Gamma: {gamma.toFixed(2)}</label>
        <input type="range" min={0.1} max={3.0} step={0.05} value={gamma}
          onChange={(e) => setGamma(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>0.10 (Darkest)</span><span>3.00 (Brightest)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2">
        <p className="text-sm text-gray-700">{describe(gamma)}</p>
        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Gamma</p><p className="font-semibold">{gamma.toFixed(2)}</p></div>
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Midpoint (128) → output</p><p className="font-semibold">{midOutput(gamma)}</p></div>
        </div>
        <p className="text-xs text-gray-500">Formula: output = input^(1/γ) × 255</p>
      </div>
    </div>
  )
}
