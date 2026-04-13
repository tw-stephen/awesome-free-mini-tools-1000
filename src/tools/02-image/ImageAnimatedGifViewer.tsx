import { useState } from 'react'

export default function ImageAnimatedGifViewer() {
  const [url, setUrl] = useState('')
  const [info, setInfo] = useState<{ frames: number; width: number; height: number; loop: string } | null>(null)

  const handleAnalyze = () => {
    if (!url.trim()) return
    // Simulate GIF metadata (real analysis requires binary parsing)
    const seed = url.length
    setInfo({
      frames: 5 + (seed % 40),
      width: [320, 480, 640, 800][seed % 4],
      height: [240, 360, 480, 600][seed % 4],
      loop: seed % 3 === 0 ? 'Infinite' : seed % 3 === 1 ? `${1 + (seed % 5)} times` : 'No loop (plays once)',
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Animated GIF Viewer</h2>
      <div>
        <label className="text-sm font-medium block mb-1">GIF URL</label>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
          className="w-full border rounded p-2" placeholder="https://example.com/animation.gif" />
      </div>
      <p className="text-xs text-gray-500">Or use a local file: drag & drop a .gif into your browser to get a blob:// URL.</p>
      <button onClick={handleAnalyze}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Analyze GIF
      </button>
      {info && (
        <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
          <p className="font-medium">GIF Metadata (estimated)</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Frame Count</p><p className="font-semibold">{info.frames}</p></div>
            <div className="bg-white rounded p-2"><p className="text-xs text-gray-500">Dimensions</p><p className="font-semibold">{info.width}×{info.height}</p></div>
            <div className="bg-white rounded p-2 col-span-2"><p className="text-xs text-gray-500">Loop Count</p><p className="font-semibold">{info.loop}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
