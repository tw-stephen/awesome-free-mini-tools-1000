import { useState } from 'react'

export default function ImageClarityEnhancer() {
  const [clarity, setClarity] = useState(0)

  const describe = (c: number) => {
    if (c === 0) return 'No clarity adjustment. Midtone contrast is unchanged.'
    if (c < -50) return `Strong negative clarity (${c}). Blurs midtone edges — creates a soft, dreamy glow effect. Popular for skin retouching.`
    if (c < 0) return `Negative clarity (${c}). Gently softens midtone transitions. Slightly flatters skin tones in portraits.`
    if (c <= 30) return `Subtle clarity boost (${c}). Adds crispness to midtone edges. Enhances texture in landscapes and architecture.`
    if (c <= 70) return `Moderate clarity (${c}). Strong midtone edge enhancement — punchy textures. Use carefully on skin.`
    return `High clarity (${c}). Aggressive midtone contrast. Great for gritty, editorial, or HDR-style looks.`
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Clarity Enhancer</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Clarity: {clarity > 0 ? `+${clarity}` : clarity}</label>
        <input type="range" min={-100} max={100} value={clarity}
          onChange={(e) => setClarity(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>-100 (Soft glow)</span><span>+100 (Max texture)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{describe(clarity)}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Affect zone</p><p className="font-semibold">Midtones (64–192)</p></div>
          <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Technique</p><p className="font-semibold text-xs">Unsharp mask (large radius)</p></div>
        </div>
        <p className="text-xs text-gray-500">Clarity uses a large-radius (50–100px) unsharp mask targeting midtone frequencies, unlike sharpening which targets fine detail.</p>
      </div>
    </div>
  )
}
