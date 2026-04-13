import { useState } from 'react'

export default function ImageSolarizeTool() {
  const [threshold, setThreshold] = useState(128)

  const describe = (t: number) => {
    if (t === 0) return 'Threshold at 0 — all pixels are inverted. Equivalent to a full negative effect.'
    if (t === 255) return 'Threshold at 255 — no pixels are inverted. Image appears unchanged.'
    if (t < 64) return `Low threshold (${t}). Only the darkest shadows are inverted; most of the image flips.`
    if (t < 128) return `Below midpoint (${t}). Majority of image inverted — dramatic, surreal look.`
    if (t === 128) return 'Classic solarize at midpoint (128). Highlights are inverted; shadows remain normal.'
    if (t < 200) return `Above midpoint (${t}). Only bright highlights are inverted — subtle Man Ray effect.`
    return `High threshold (${t}). Only the very brightest areas are affected. Minimal solarization.`
  }

  const solarizeValue = (input: number) => input >= threshold ? 255 - input : input

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Solarize Tool</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Threshold: {threshold}</label>
        <input type="range" min={0} max={255} value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>0 (Full invert)</span><span>255 (No change)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2">
        <p className="text-sm text-gray-700">{describe(threshold)}</p>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: 32 }, (_, i) => Math.round(i * 255 / 31)).map((v) => (
            <div key={v} className="flex-1 h-6" style={{ background: `rgb(${solarizeValue(v)},${solarizeValue(v)},${solarizeValue(v)})` }} />
          ))}
        </div>
        <p className="text-xs text-gray-500">Solarize curve preview (input 0–255 → output)</p>
      </div>
    </div>
  )
}
