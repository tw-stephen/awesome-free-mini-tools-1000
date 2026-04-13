import { useState } from 'react'

export default function ImageHighlightRecovery() {
  const [recovery, setRecovery] = useState(0)

  const describe = (r: number) => {
    if (r === 0) return 'No recovery applied. Clipped highlights remain pure white.'
    if (r <= 25) return `Light recovery (${r}%). Recovers slightly blown highlights. Useful for sky and cloud detail.`
    if (r <= 50) return `Moderate recovery (${r}%). Brings back texture in overexposed areas. Good for window light and sunlit surfaces.`
    if (r <= 75) return `Strong recovery (${r}%). Aggressively pulls detail from highlights. May introduce slight color cast in recovered areas.`
    return `Maximum recovery (${r}%). Attempts to reconstruct all clipped areas. Works best on RAW images with retained headroom.`
  }

  const eV = -(recovery / 100 * 2).toFixed(1)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Highlight Recovery</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Recovery Amount: {recovery}%</label>
        <input type="range" min={0} max={100} value={recovery}
          onChange={(e) => setRecovery(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>0% (Off)</span><span>100% (Maximum)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{describe(recovery)}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Recovery</p><p className="font-semibold">{recovery}%</p></div>
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Effective EV shift</p><p className="font-semibold">{eV} EV</p></div>
        </div>
        <p className="text-xs text-gray-500">Best results on 14-bit+ RAW files. JPEG recovery is limited to 1-2 stops due to compressed data.</p>
      </div>
    </div>
  )
}
