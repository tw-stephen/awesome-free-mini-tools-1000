import { useState } from 'react'

const looks: Record<string, { desc: string; shadow: string; highlight: string; saturation: string }> = {
  'Teal & Orange': { desc: 'Hollywood blockbuster staple. Shifts skin tones (orange) against teal/cyan backgrounds. Maximizes complementary color contrast.', shadow: 'teal', highlight: 'orange', saturation: 'Boosted' },
  Blockbuster:     { desc: 'High-contrast, punchy look with slightly crushed blacks, boosted greens, and warm highlights. Action movie aesthetic.', shadow: 'dark green', highlight: 'warm amber', saturation: 'Vivid' },
  Noir:            { desc: 'High-contrast black and white with deep crushed shadows and bright highlights. Classic crime drama and neo-noir style.', shadow: 'black', highlight: 'bright white', saturation: 'Desaturated' },
  'Warm Sunset':   { desc: 'Golden hour glow — warm amber highlights, lifted magenta shadows, slightly reduced blue channel. Romantic and inviting.', shadow: 'magenta', highlight: 'golden amber', saturation: 'Warm boost' },
  'Cold Blue':     { desc: 'Thriller and sci-fi aesthetic. Cool blue-green shadows, desaturated highlights, reduced red channel. Clinical and tense atmosphere.', shadow: 'dark blue', highlight: 'cool white', saturation: 'Desaturated reds' },
}

export default function ImageCinematicLook() {
  const [look, setLook] = useState('Teal & Orange')
  const l = looks[look]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Cinematic Look</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Cinematic Look</label>
        <select value={look} onChange={(e) => setLook(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(looks).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="font-medium">{look}</p>
        <p className="text-gray-700">{l.desc}</p>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Shadows</p><p className="font-semibold text-xs">{l.shadow}</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Highlights</p><p className="font-semibold text-xs">{l.highlight}</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Saturation</p><p className="font-semibold text-xs">{l.saturation}</p></div>
        </div>
      </div>
    </div>
  )
}
