import { useState } from 'react'

export default function ImageHistogramViewer() {
  const [stats, setStats] = useState<{ r: number; g: number; b: number; avg: number } | null>(null)
  const [fileName, setFileName] = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let r = 0, g = 0, b = 0
      const total = data.length / 4
      for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2] }
      setStats({ r: Math.round(r / total), g: Math.round(g / total), b: Math.round(b / total), avg: Math.round((r + g + b) / total / 3) })
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Histogram Viewer</h2>
      <input type="file" accept="image/*" onChange={handleFile} className="w-full border rounded p-2" />
      {fileName && <p className="text-sm text-gray-500">File: {fileName}</p>}
      {stats && (
        <div className="p-3 bg-gray-100 rounded space-y-2">
          <p className="font-medium">Average Channel Values</p>
          <div className="flex gap-4">
            <span className="text-red-600">R: {stats.r}</span>
            <span className="text-green-600">G: {stats.g}</span>
            <span className="text-blue-600">B: {stats.b}</span>
            <span className="text-gray-700">Avg: {stats.avg}</span>
          </div>
          <div className="space-y-1">
            {[['R', stats.r, 'bg-red-400'], ['G', stats.g, 'bg-green-400'], ['B', stats.b, 'bg-blue-400']].map(([ch, val, cls]) => (
              <div key={ch as string} className="flex items-center gap-2">
                <span className="w-4 text-sm">{ch}</span>
                <div className="flex-1 bg-gray-200 rounded h-4">
                  <div className={`${cls} h-4 rounded`} style={{ width: `${(val as number) / 255 * 100}%` }} />
                </div>
                <span className="text-sm w-8">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
