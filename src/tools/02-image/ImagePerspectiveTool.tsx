import { useState } from 'react'

export default function ImagePerspectiveTool() {
  const [tl, setTl] = useState({ x: 0, y: 0 })
  const [tr, setTr] = useState({ x: 100, y: 0 })
  const [bl, setBl] = useState({ x: 0, y: 100 })
  const [br, setBr] = useState({ x: 100, y: 100 })

  const corners = [
    { label: 'Top-Left', val: tl, set: setTl },
    { label: 'Top-Right', val: tr, set: setTr },
    { label: 'Bottom-Left', val: bl, set: setBl },
    { label: 'Bottom-Right', val: br, set: setBr },
  ]

  const isRectangle = tl.x === bl.x && tr.x === br.x && tl.y === tr.y && bl.y === br.y

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Perspective Tool</h2>
      <div className="grid grid-cols-2 gap-3">
        {corners.map(({ label, val, set }) => (
          <div key={label} className="border rounded p-2">
            <p className="text-xs font-medium mb-1">{label}</p>
            <div className="flex gap-1">
              <input type="number" value={val.x} onChange={(e) => set({ ...val, x: Number(e.target.value) })}
                className="w-full border rounded p-1 text-sm" placeholder="X" />
              <input type="number" value={val.y} onChange={(e) => set({ ...val, y: Number(e.target.value) })}
                className="w-full border rounded p-1 text-sm" placeholder="Y" />
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="font-medium">Perspective Transform Matrix (src → dst)</p>
        <div className="font-mono text-xs bg-white rounded p-2 space-y-1">
          <p>TL: ({tl.x}, {tl.y})  →  TR: ({tr.x}, {tr.y})</p>
          <p>BL: ({bl.x}, {bl.y})  →  BR: ({br.x}, {br.y})</p>
        </div>
        <p className="text-gray-600">{isRectangle ? '✅ Rectangle — no perspective distortion.' : '⚠️ Non-rectangular quadrilateral — perspective warp will be applied.'}</p>
      </div>
    </div>
  )
}
