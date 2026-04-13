import { useState } from 'react'

const blendModes: Record<string, string> = {
  Normal:      'Top layer is placed directly over the bottom layer with no mathematical interaction. Only opacity controls the blend.',
  Multiply:    'Multiplies pixel values. Result is always darker. Black stays black; white is transparent. Great for shadows and overlays.',
  Screen:      'Inverse of Multiply — result is always brighter. Black is transparent; white stays white. Used for glows and light effects.',
  Overlay:     'Combines Multiply and Screen. Dark areas darken further; bright areas brighten. High contrast result. Preserves highlights and shadows.',
  'Soft Light': 'Gentle Overlay variant. Subtle contrast enhancement — darkens darks and lightens lights without harsh clipping.',
}

export default function ImageLayerBlender() {
  const [blendMode, setBlendMode] = useState('Normal')
  const [opacity, setOpacity] = useState(100)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Layer Blender</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Blend Mode</label>
        <select value={blendMode} onChange={(e) => setBlendMode(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(blendModes).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Opacity: {opacity}%</label>
        <input type="range" min={0} max={100} value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>0% (Invisible)</span><span>100% (Opaque)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="font-medium">{blendMode} @ {opacity}%</p>
        <p className="text-gray-700">{blendModes[blendMode]}</p>
        <p className="text-xs text-gray-500 mt-1">CSS equivalent: <code className="bg-white px-1 rounded">mix-blend-mode: {blendMode.toLowerCase().replace(' ', '-')}; opacity: {(opacity / 100).toFixed(2)}</code></p>
      </div>
    </div>
  )
}
