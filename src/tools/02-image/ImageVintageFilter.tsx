import { useState } from 'react'

const filters: Record<string, { palette: string; desc: string; tone: string }> = {
  Sepia:         { palette: 'Brown/gold', tone: '#c9a96e', desc: 'Classic brown-toned monochrome. Converts to grayscale then applies warm reddish-brown color wash. Timeless 19th-century darkroom look.' },
  Kodachrome:    { palette: 'Vivid warm', tone: '#e07b39', desc: 'Saturated reds, rich greens, and warm skies inspired by Kodak Kodachrome 64 slide film. Iconic 1970s–80s color signature.' },
  Faded:         { palette: 'Washed out', tone: '#a0a090', desc: 'Lifts blacks, reduces contrast, and desaturates slightly. Mimics aged or improperly stored color print film.' },
  'Cross-Process': { palette: 'Cyan+yellow', tone: '#4abfbf', desc: 'Simulates processing slide film in C-41 chemicals. Shifts shadows cyan, highlights yellow, with boosted saturation and contrast.' },
  Lomo:          { palette: 'High contrast', tone: '#c0392b', desc: 'Strong vignette, crushed blacks, boosted reds and yellows. Inspired by Lomography film cameras and LOMO LC-A optics.' },
}

export default function ImageVintageFilter() {
  const [filterPreset, setFilterPreset] = useState('Kodachrome')
  const f = filters[filterPreset]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Vintage Filter</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Filter Preset</label>
        <select value={filterPreset} onChange={(e) => setFilterPreset(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(filters).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded border-2 border-gray-300" style={{ background: f.tone }} />
          <div><p className="font-medium">{filterPreset}</p><p className="text-xs text-gray-500">{f.palette}</p></div>
        </div>
        <p className="text-gray-700">{f.desc}</p>
      </div>
    </div>
  )
}
