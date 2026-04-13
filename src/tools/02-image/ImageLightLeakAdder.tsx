import { useState } from 'react'

const leakTypes: Record<string, { color: string; desc: string; hex: string }> = {
  Warm:    { color: 'amber', hex: '#f59e0b', desc: 'Soft golden-orange leak simulating direct sunlight on film. Adds a warm, summery glow to corners and edges.' },
  Cool:    { color: 'blue',  hex: '#3b82f6', desc: 'Pale cyan-blue leak mimicking fluorescent or overcast light on expired film. Creates a cold, dreamy aesthetic.' },
  Rainbow: { color: 'pink',  hex: '#ec4899', desc: 'Multi-color prismatic leak with magenta, cyan, and yellow bands. Resembles double-exposed or light-struck film.' },
  Vintage: { color: 'red',   hex: '#dc2626', desc: 'Deep red-orange leak inspired by 1970s film stock. Produces a nostalgic, aged look with heavy corner burn.' },
}

export default function ImageLightLeakAdder() {
  const [leakType, setLeakType] = useState('Warm')
  const [intensity, setIntensity] = useState(40)
  const l = leakTypes[leakType]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Light Leak Adder</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Leak Type</label>
        <select value={leakType} onChange={(e) => setLeakType(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(leakTypes).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Intensity: {intensity}%</label>
        <input type="range" min={0} max={100} value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))} className="w-full" />
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full border" style={{ background: l.hex }} />
          <span className="font-medium">{leakType} leak @ {intensity}%</span>
        </div>
        <p className="text-gray-700">{l.desc}</p>
        <p className="text-xs text-gray-500">Blend mode: Screen at {intensity}% opacity. Concentrated at image corners and edges.</p>
      </div>
    </div>
  )
}
