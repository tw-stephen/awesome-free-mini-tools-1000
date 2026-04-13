import { useState } from 'react'

export default function ImagePosterizeTool() {
  const [levels, setLevels] = useState(4)

  const stepSize = Math.round(255 / (levels - 1))
  const uniqueColors = Math.pow(levels, 3)

  const describe = (l: number) => {
    if (l === 2) return 'Extreme posterization — only 2 tones per channel (8 total colors). Bold, graphic look.'
    if (l <= 4) return `Strong posterization (${l} levels). Creates a stylized poster or comic-book effect.`
    if (l <= 8) return `Moderate posterization (${l} levels). Visible banding with smooth areas becoming flat color regions.`
    return `Subtle posterization (${l} levels). Gentle tonal simplification — color banding is faint.`
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Posterize Tool</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Number of Levels: {levels}</label>
        <input type="range" min={2} max={16} value={levels}
          onChange={(e) => setLevels(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>2 (Extreme)</span><span>16 (Subtle)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2">
        <p className="text-sm text-gray-700">{describe(levels)}</p>
        <div className="grid grid-cols-3 gap-2 text-sm mt-1">
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Tones/Channel</p><p className="font-semibold">{levels}</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Step Size</p><p className="font-semibold">{stepSize}</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Max Colors</p><p className="font-semibold">{uniqueColors.toLocaleString()}</p></div>
        </div>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: levels }, (_, i) => Math.round(i * 255 / (levels - 1))).map((v) => (
            <div key={v} className="flex-1 h-6 rounded" style={{ background: `rgb(${v},${v},${v})` }} title={`${v}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
