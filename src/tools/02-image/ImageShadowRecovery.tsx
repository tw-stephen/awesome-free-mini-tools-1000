import { useState } from 'react'

export default function ImageShadowRecovery() {
  const [lift, setLift] = useState(0)

  const describe = (l: number) => {
    if (l === 0) return 'No shadow lifting. Dark areas remain at original values.'
    if (l <= 25) return `Gentle lift (${l}%). Subtle brightening of shadows — reduces harsh contrast while keeping midtones stable.`
    if (l <= 50) return `Moderate lift (${l}%). Shadow details become clearly visible. Good for portrait fill-light or backlit scenes.`
    if (l <= 75) return `Strong lift (${l}%). Significantly brightens the darkest areas. May reveal noise in high-ISO images.`
    return `Maximum lift (${l}%). Shadows are heavily brightened. Use noise reduction afterward; aggressive lift amplifies sensor noise.`
  }

  const blackPoint = Math.round(lift * 0.4)
  const eV = (lift / 100 * 2.5).toFixed(1)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Shadow Recovery</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Shadow Lift Amount: {lift}%</label>
        <input type="range" min={0} max={100} value={lift}
          onChange={(e) => setLift(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>0% (Off)</span><span>100% (Max lift)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{describe(lift)}</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Lift</p><p className="font-semibold">{lift}%</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Black point</p><p className="font-semibold">{blackPoint}</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">EV gain</p><p className="font-semibold">+{eV} EV</p></div>
        </div>
      </div>
    </div>
  )
}
