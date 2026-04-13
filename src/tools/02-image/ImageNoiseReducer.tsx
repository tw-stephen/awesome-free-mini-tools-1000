import { useState } from 'react'

const descriptions: Record<number, string> = {
  1: 'Minimal smoothing — barely perceptible. Preserves nearly all detail and fine textures.',
  2: 'Very light Gaussian blur pass. Smooths faint sensor noise in high-ISO shadows.',
  3: 'Light bilateral filter. Reduces noise while keeping most edges sharp.',
  4: 'Moderate bilateral filter. Good balance for ISO 800–1600 images.',
  5: 'Medium non-local means pass. Analyzes similar patches across the image.',
  6: 'Stronger non-local means. Noticeably smooths chroma noise in low-light shots.',
  7: 'Wavelet-based denoising. Processes luminance and chroma channels separately.',
  8: 'Aggressive wavelet pass. Removes heavy grain but may soften fine detail.',
  9: 'Deep median filter over 7×7 kernel. Strips most noise including salt-and-pepper.',
  10: 'Maximum denoising. Applies stacked passes; output may look painterly or plastic.',
}

export default function ImageNoiseReducer() {
  const [level, setLevel] = useState(1)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Noise Reducer</h2>
      <div className="space-y-1">
        <label className="text-sm font-medium">Noise Reduction Level: {level}</label>
        <input
          type="range" min={1} max={10} value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400"><span>1 (Minimal)</span><span>10 (Maximum)</span></div>
      </div>
      <div className="p-3 bg-gray-100 rounded">
        <p className="font-medium mb-1">Level {level} — {level <= 3 ? 'Light' : level <= 6 ? 'Medium' : level <= 8 ? 'Strong' : 'Maximum'}</p>
        <p className="text-sm text-gray-700">{descriptions[level]}</p>
      </div>
    </div>
  )
}
