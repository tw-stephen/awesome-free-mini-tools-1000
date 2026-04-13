import { useState } from 'react'

export default function ImageExposureAdjuster() {
  const [ev, setEv] = useState(0)

  const multiplier = Math.pow(2, ev)
  const stops = Math.abs(ev)
  const direction = ev > 0 ? 'brighter' : ev < 0 ? 'darker' : 'unchanged'

  const describe = (e: number) => {
    if (e === 0) return 'No exposure change. Image renders at original brightness.'
    if (e >= 3) return `+${e} EV: Very bright — equivalent to shooting with the aperture 8× wider. Significant highlight clipping likely.`
    if (e >= 2) return `+${e} EV: Overexposed by 2 stops. Bright areas may clip; useful for high-key photography.`
    if (e >= 1) return `+${e} EV: Slightly overexposed. Lifts shadows and midtones — common compensation for backlit subjects.`
    if (e <= -3) return `${e} EV: Severely underexposed — 8× less light. Heavy shadow noise; mostly for creative dark effects.`
    if (e <= -2) return `${e} EV: 2 stops underexposed. Deep shadows; useful for dramatic low-key or silhouette images.`
    return `${e} EV: Slight underexposure. Brings down blown highlights and creates a moodier image.`
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Exposure Adjuster</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Exposure Value (EV): {ev > 0 ? `+${ev}` : ev}</label>
        <input type="range" min={-4} max={4} step={0.5} value={ev}
          onChange={(e) => setEv(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>-4 EV (Very dark)</span><span>+4 EV (Very bright)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{describe(ev)}</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">EV</p><p className="font-semibold">{ev > 0 ? `+${ev}` : ev}</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Multiplier</p><p className="font-semibold">{multiplier.toFixed(2)}×</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Effect</p><p className="font-semibold">{stops} stop{stops !== 1 ? 's' : ''} {direction}</p></div>
        </div>
      </div>
    </div>
  )
}
