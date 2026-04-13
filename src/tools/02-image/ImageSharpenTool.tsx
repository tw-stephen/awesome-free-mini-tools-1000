import { useState } from 'react'

export default function ImageSharpenTool() {
  const [amount, setAmount] = useState(0)

  const describe = (v: number) => {
    if (v === 0) return 'No sharpening applied. Image remains as-is.'
    if (v <= 20) return `Subtle edge enhancement (${v}%). Fine detail becomes slightly crisper without visible halos.`
    if (v <= 50) return `Moderate unsharp mask (${v}%). Enhances mid-frequency edges — suitable for portraits and landscapes.`
    if (v <= 75) return `Strong sharpening (${v}%). High-contrast edges are accentuated; thin lines gain definition.`
    return `Aggressive sharpening (${v}%). Maximum edge boost — may introduce halos around high-contrast areas.`
  }

  const radius = (v: number) => (0.5 + v / 100 * 2.5).toFixed(1)
  const threshold = (v: number) => Math.max(0, 10 - Math.round(v / 12))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Sharpen Tool</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Sharpen Amount: {amount}%</label>
        <input type="range" min={0} max={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>0 (None)</span><span>100 (Max)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-1">
        <p className="text-sm text-gray-700">{describe(amount)}</p>
        <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
          <div className="bg-white rounded p-2 text-center"><p className="text-gray-500 text-xs">Amount</p><p className="font-semibold">{amount}%</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-gray-500 text-xs">Radius</p><p className="font-semibold">{radius(amount)} px</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-gray-500 text-xs">Threshold</p><p className="font-semibold">{threshold(amount)}</p></div>
        </div>
      </div>
    </div>
  )
}
