import { useState } from 'react'

export default function ImageSaturationAdjuster() {
  const [value, setValue] = useState(0)

  const describe = (v: number) => {
    if (v === 0) return 'No change. Colors remain at their original saturation.'
    if (v < -80) return `Extreme desaturation (${v}). Image is nearly grayscale with only faint color hints.`
    if (v < -40) return `Heavy desaturation (${v}). Muted, faded palette — works well for film or vintage looks.`
    if (v < 0) return `Subtle desaturation (${v}). Colors are slightly toned down for a softer, natural feel.`
    if (v <= 40) return `Subtle boost (${v}). Colors appear slightly more vivid without looking unnatural.`
    if (v <= 80) return `Strong boost (${v}). Punchy, vibrant colors — great for travel and landscape photography.`
    return `Extreme boost (${v}). Highly saturated, almost neon colors — use sparingly.`
  }

  const hslShift = (v: number) => (v / 100 * 100).toFixed(0)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Saturation Adjuster</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Saturation: {value > 0 ? `+${value}` : value}</label>
        <input type="range" min={-100} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>-100 (Grayscale)</span><span>+100 (Max vivid)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-1">
        <p className="text-sm text-gray-700">{describe(value)}</p>
        <p className="text-xs text-gray-500 mt-2">HSL saturation delta: {hslShift(value)}% | CSS filter equivalent: saturate({(1 + value / 100).toFixed(2)})</p>
      </div>
    </div>
  )
}
