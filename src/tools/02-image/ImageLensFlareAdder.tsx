import { useState } from 'react'

export default function ImageLensFlareAdder() {
  const [xPos, setXPos] = useState(50)
  const [yPos, setYPos] = useState(20)
  const [intensity, setIntensity] = useState(50)

  const size = Math.round(intensity * 1.5)
  const streaks = intensity > 70 ? 8 : intensity > 40 ? 6 : 4
  const describe = () =>
    `Lens flare at (${xPos}%, ${yPos}%). Intensity ${intensity}% generates a ~${size}px primary glow with ${streaks} anamorphic streaks and ${Math.round(intensity / 10)} secondary ghost elements.`

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Lens Flare Adder</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">X Position: {xPos}%</label>
          <input type="range" min={0} max={100} value={xPos}
            onChange={(e) => setXPos(Number(e.target.value))} className="w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Y Position: {yPos}%</label>
          <input type="range" min={0} max={100} value={yPos}
            onChange={(e) => setYPos(Number(e.target.value))} className="w-full" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Intensity: {intensity}%</label>
        <input type="range" min={0} max={100} value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))} className="w-full" />
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{describe()}</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Primary size</p><p className="font-semibold">{size}px</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Streaks</p><p className="font-semibold">{streaks}</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Ghosts</p><p className="font-semibold">{Math.round(intensity / 10)}</p></div>
        </div>
      </div>
    </div>
  )
}
