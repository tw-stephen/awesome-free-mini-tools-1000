import { useState } from 'react'

export default function ImagePaletteReducer() {
  const [numColors, setNumColors] = useState(16)

  const bitsPerChannel = Math.ceil(Math.log2(numColors))
  const approxFileSize = (numColors <= 16 ? '20-40% smaller' : numColors <= 64 ? '10-20% smaller' : '5-10% smaller')
  const describe = (n: number) => {
    if (n <= 4) return 'Extreme reduction. Image will posterize heavily — useful for pixel art or icon generation.'
    if (n <= 16) return 'Significant palette reduction. Visible color banding; good for small icons or limited-color graphics.'
    if (n <= 64) return 'Moderate reduction. Most photographic images show noticeable dithering but remain recognizable.'
    if (n <= 128) return 'Light reduction. Subtle quality loss; suitable for simple illustrations and flat-color designs.'
    return 'Near-original quality. Minimal color reduction — most images appear virtually unchanged.'
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Palette Reducer</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Number of Colors: {numColors}</label>
        <input type="range" min={2} max={256} value={numColors}
          onChange={(e) => setNumColors(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400"><span>2</span><span>256</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{describe(numColors)}</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Colors</p><p className="font-semibold">{numColors}</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Bits/ch</p><p className="font-semibold">~{bitsPerChannel}</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">File size</p><p className="font-semibold text-xs">{approxFileSize}</p></div>
        </div>
      </div>
    </div>
  )
}
