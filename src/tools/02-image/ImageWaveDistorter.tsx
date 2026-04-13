import { useState } from 'react'

export default function ImageWaveDistorter() {
  const [amplitude, setAmplitude] = useState(10)
  const [frequency, setFrequency] = useState(1.0)

  const wavelength = (1 / frequency).toFixed(2)
  const maxDisplace = amplitude
  const describe = () => {
    if (amplitude <= 5 && frequency <= 1) return 'Gentle ripple — barely visible wave pattern. Subtle texture distortion.'
    if (amplitude <= 15 && frequency <= 2) return 'Moderate wave distortion. Clear undulating effect without losing image readability.'
    if (amplitude > 30 || frequency > 3) return 'Aggressive distortion. Image becomes heavily warped — surreal or psychedelic look.'
    return `Wave distortion with ${amplitude}px amplitude at ${frequency.toFixed(1)} cycles/100px. Visible but controlled warp.`
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Wave Distorter</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Wave Amplitude: {amplitude} px</label>
        <input type="range" min={1} max={50} value={amplitude}
          onChange={(e) => setAmplitude(Number(e.target.value))} className="w-full" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Frequency: {frequency.toFixed(1)}</label>
        <input type="range" min={0.1} max={5.0} step={0.1} value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>0.1 (Long wave)</span><span>5.0 (Short wave)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{describe()}</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Max Offset</p><p className="font-semibold">±{maxDisplace}px</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Wavelength</p><p className="font-semibold">{wavelength}×</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Formula</p><p className="font-semibold text-xs">A·sin(f·x)</p></div>
        </div>
      </div>
    </div>
  )
}
