import { useState } from 'react'

const grainTypes: Record<string, string> = {
  Fine:   'Tight, small-grain texture (1-2px) simulating ISO 100-400 film. Adds subtle texture without being distracting.',
  Medium: 'Mid-sized grain (2-4px) similar to ISO 800-1600 film stock like Kodak Tri-X 400 pushed 1 stop.',
  Coarse: 'Large, pronounced grain (4-8px) resembling expired or heavily pushed film. Very visible, gritty texture.',
}

export default function ImageFilmGrainAdder() {
  const [amount, setAmount] = useState(20)
  const [grainType, setGrainType] = useState('Fine')

  const variance = grainType === 'Fine' ? amount * 0.3 : grainType === 'Medium' ? amount * 0.6 : amount
  const luminance = amount > 50 ? 'Affects luminance and chroma channels' : 'Affects luminance channel only'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Film Grain Adder</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Grain Amount: {amount}%</label>
        <input type="range" min={0} max={100} value={amount}
          onChange={(e) => setAmount(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>0% (None)</span><span>100% (Heavy)</span></div>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Grain Type</label>
        <select value={grainType} onChange={(e) => setGrainType(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(grainTypes).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{grainTypes[grainType]}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Noise σ</p><p className="font-semibold">{variance.toFixed(1)}</p></div>
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Channel</p><p className="font-semibold text-xs">{luminance}</p></div>
        </div>
      </div>
    </div>
  )
}
