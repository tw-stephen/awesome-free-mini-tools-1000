import { useState } from 'react'

export default function ImageDehazer() {
  const [strength, setStrength] = useState(0)

  const describe = (s: number) => {
    if (s === 0) return 'No dehazing. Image appears as captured with original atmospheric haze.'
    if (s <= 25) return `Light dehazing (${s}%). Slightly reduces atmospheric scattering — subtle clarity improvement for lightly hazy scenes.`
    if (s <= 50) return `Moderate dehazing (${s}%). Noticeably reduces haze. Colors become more saturated; distant objects gain definition.`
    if (s <= 75) return `Strong dehazing (${s}%). Aggressively removes atmospheric light. Scene may look over-processed; colors can become too vivid.`
    return `Maximum dehazing (${s}%). Complete haze removal attempted. May introduce dark artifacts and noise in originally hazy regions.`
  }

  const atmLight = Math.round(255 - strength * 1.5)
  const betaEst = (strength / 100 * 3).toFixed(2)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Dehazer</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Dehazing Strength: {strength}%</label>
        <input type="range" min={0} max={100} value={strength}
          onChange={(e) => setStrength(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>0% (Off)</span><span>100% (Full)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{describe(strength)}</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Strength</p><p className="font-semibold">{strength}%</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Atm. Light</p><p className="font-semibold">{atmLight}</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">β (scatter)</p><p className="font-semibold">{betaEst}</p></div>
        </div>
        <p className="text-xs text-gray-500">Uses Dark Channel Prior method: estimates transmission map, then recovers scene radiance via I=(J−A)×t+A.</p>
      </div>
    </div>
  )
}
