import { useState } from 'react'

export default function ImageLevelsAdjuster() {
  const [black, setBlack] = useState(0)
  const [mid, setMid] = useState(1.0)
  const [white, setWhite] = useState(255)

  const range = white - black
  const clipped = black > 0 || white < 255
  const contrast = range < 200 ? 'High contrast' : range < 240 ? 'Moderate contrast' : 'Low contrast'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Levels Adjuster</h2>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium block mb-1">Black Point: {black}</label>
          <input type="number" min={0} max={254} value={black}
            onChange={(e) => setBlack(Math.min(Number(e.target.value), white - 1))}
            className="w-full border rounded p-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Midpoint: {mid.toFixed(2)}</label>
          <input type="number" min={0.1} max={10} step={0.1} value={mid}
            onChange={(e) => setMid(Number(e.target.value))}
            className="w-full border rounded p-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">White Point: {white}</label>
          <input type="number" min={1} max={255} value={white}
            onChange={(e) => setWhite(Math.max(Number(e.target.value), black + 1))}
            className="w-full border rounded p-2 text-sm" />
        </div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-1 text-sm">
        <p><span className="font-medium">Input range:</span> {black} – {white} ({range} levels)</p>
        <p><span className="font-medium">Contrast:</span> {contrast}</p>
        <p><span className="font-medium">Gamma midpoint:</span> {mid.toFixed(2)} {mid > 1 ? '(brightened)' : mid < 1 ? '(darkened)' : '(neutral)'}</p>
        <p><span className="font-medium">Clipping:</span> {clipped ? `⚠️ ${black > 0 ? `${black} shadow levels clipped` : ''} ${white < 255 ? `${255 - white} highlight levels clipped` : ''}` : 'None'}</p>
      </div>
    </div>
  )
}
