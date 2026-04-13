import { useState } from 'react'

const directions: Record<string, { angle: string; desc: string }> = {
  North:  { angle: '270°', desc: 'Light comes from the top. Horizontal edges are emphasized; top surfaces appear raised.' },
  South:  { angle: '90°',  desc: 'Light from below. Inverted shadow effect — gives a pushed-in appearance.' },
  East:   { angle: '0°',   desc: 'Light from the right. Vertical edges gain strong relief; left sides are shadowed.' },
  West:   { angle: '180°', desc: 'Light from the left. Classic emboss direction for text and UI elements.' },
  NE:     { angle: '315°', desc: 'Light from upper-right. Diagonal edges at 45° are emphasized most strongly.' },
  NW:     { angle: '225°', desc: 'Light from upper-left. Standard photographic lighting direction — most natural feel.' },
  SE:     { angle: '45°',  desc: 'Light from lower-right. Inverted diagonal — gives a recessed, engraved look.' },
  SW:     { angle: '135°', desc: 'Light from lower-left. Uncommon angle — produces dramatic diagonal shadow relief.' },
}

export default function ImageEmbossTool() {
  const [direction, setDirection] = useState('NW')
  const d = directions[direction]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Emboss Tool</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Light Direction</label>
        <select value={direction} onChange={(e) => setDirection(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(directions).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center text-sm font-semibold text-gray-600">
            {direction}
          </div>
          <div>
            <p className="text-sm font-medium">Angle: {d.angle}</p>
            <p className="text-xs text-gray-500">Convolution kernel rotated to match direction</p>
          </div>
        </div>
        <p className="text-sm text-gray-700">{d.desc}</p>
        <p className="text-xs text-gray-500 mt-1">Result is grayscale with 128 as neutral mid-gray. Edges facing the light source appear bright; opposite edges appear dark.</p>
      </div>
    </div>
  )
}
