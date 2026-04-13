import { useState } from 'react'

export default function ImageChromaKeyer() {
  const [keyColor, setKeyColor] = useState('#00ff00')
  const [tolerance, setTolerance] = useState(30)

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }

  const { r, g, b } = hexToRgb(keyColor)
  const dominant = r > g && r > b ? 'Red channel' : g > r && g > b ? 'Green channel' : 'Blue channel'

  const spill = tolerance > 50 ? 'High spill suppression needed — consider reducing tolerance.' : 'Spill suppression manageable at this tolerance.'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Chroma Keyer</h2>
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium block mb-1">Key Color</label>
          <input type="color" value={keyColor} onChange={(e) => setKeyColor(e.target.value)}
            className="w-full h-10 border rounded cursor-pointer" />
        </div>
        <div className="w-12 h-10 rounded border" style={{ background: keyColor }} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Tolerance: {tolerance}%</label>
        <input type="range" min={0} max={100} value={tolerance}
          onChange={(e) => setTolerance(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>0 (Exact match)</span><span>100 (Remove all)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-1 text-sm">
        <p><span className="font-medium">Key color:</span> rgb({r}, {g}, {b})</p>
        <p><span className="font-medium">Dominant:</span> {dominant}</p>
        <p><span className="font-medium">Color radius:</span> ±{tolerance} units in RGB space</p>
        <p className="text-gray-600">{spill}</p>
      </div>
    </div>
  )
}
