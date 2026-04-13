import { useState } from 'react'

const presets: Record<string, { desc: string; shadow: string; mid: string; highlight: string }> = {
  Linear:    { desc: 'No adjustment. 1:1 input-to-output mapping across all tones.', shadow: '0', mid: '128', highlight: '255' },
  'S-Curve': { desc: 'Classic contrast boost. Shadows darken, highlights brighten, midtones gain punch.', shadow: '10', mid: '128', highlight: '245' },
  Fade:      { desc: 'Lifts blacks and lowers whites for a faded film look with reduced contrast.', shadow: '40', mid: '128', highlight: '215' },
  Boost:     { desc: 'Pushes midtones up sharply — brightens the overall image without clipping highlights.', shadow: '0', mid: '160', highlight: '255' },
}

export default function ImageCurvesTool() {
  const [preset, setPreset] = useState('Linear')
  const p = presets[preset]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Curves Tool</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Curve Preset</label>
        <select value={preset} onChange={(e) => setPreset(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(presets).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-3">
        <p className="text-sm text-gray-700">{p.desc}</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {[['Shadow', p.shadow], ['Midtone', p.mid], ['Highlight', p.highlight]].map(([label, val]) => (
            <div key={label} className="bg-white rounded p-2 text-center">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-semibold">{val}</p>
              <div className="mt-1 h-2 rounded" style={{ background: `rgb(${val},${val},${val})`, border: '1px solid #ccc' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
