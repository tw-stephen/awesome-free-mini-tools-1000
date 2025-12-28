import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface ExtractedColor {
  hex: string
  count: number
  percentage: number
}

export default function PaletteExtractor() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [colors, setColors] = useState<ExtractedColor[]>([])
  const [colorCount, setColorCount] = useState(5)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      extractColors(img)
    }
    img.src = URL.createObjectURL(file)
  }

  const extractColors = (img: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resize for faster processing
    const maxSize = 100
    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
    canvas.width = img.width * scale
    canvas.height = img.height * scale

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Count colors
    const colorMap: { [key: string]: number } = {}
    const totalPixels = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
      // Quantize to reduce color space
      const r = Math.round(data[i] / 32) * 32
      const g = Math.round(data[i + 1] / 32) * 32
      const b = Math.round(data[i + 2] / 32) * 32
      const hex = rgbToHex(r, g, b)
      colorMap[hex] = (colorMap[hex] || 0) + 1
    }

    // Sort by frequency and take top colors
    const sortedColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, colorCount)
      .map(([hex, count]) => ({
        hex,
        count,
        percentage: Math.round((count / totalPixels) * 100)
      }))

    setColors(sortedColors)
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((x) => {
      const hex = Math.max(0, Math.min(255, x)).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const copyColor = (index: number, hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const exportPalette = () => {
    const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n')
    navigator.clipboard.writeText(`:root {\n${css}\n}`)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        {!image ? (
          <label className="block w-full py-12 border-2 border-dashed border-slate-300 rounded-lg text-center cursor-pointer hover:border-blue-500">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-slate-600">{t('tools.paletteExtractor.upload')}</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        ) : (
          <div>
            <img
              src={image.src}
              alt="Uploaded"
              className="max-w-full max-h-48 mx-auto rounded mb-4"
            />
            <label className="block w-full py-2 bg-slate-100 rounded text-center cursor-pointer hover:bg-slate-200">
              {t('tools.paletteExtractor.change')}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {image && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.paletteExtractor.colorCount')}</h3>
            <select
              value={colorCount}
              onChange={(e) => {
                setColorCount(parseInt(e.target.value))
                if (image) extractColors(image)
              }}
              className="px-3 py-1 border border-slate-300 rounded"
            >
              {[3, 5, 8, 10].map((n) => (
                <option key={n} value={n}>{n} colors</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{t('tools.paletteExtractor.extractedColors')}</h3>
              <button
                onClick={exportPalette}
                className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {t('tools.paletteExtractor.exportCSS')}
              </button>
            </div>

            <div className="flex rounded-lg overflow-hidden h-20 mb-4">
              {colors.map((color, i) => (
                <div
                  key={i}
                  className="cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.hex, flex: color.percentage }}
                  onClick={() => copyColor(i, color.hex)}
                  title={`${color.hex} (${color.percentage}%)`}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-2">
              {colors.map((color, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                    copiedIndex === i ? 'bg-green-50' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => copyColor(i, color.hex)}
                >
                  <div
                    className="w-10 h-10 rounded"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1">
                    <div className="font-mono font-medium">{color.hex.toUpperCase()}</div>
                    <div className="text-sm text-slate-500">{color.percentage}%</div>
                  </div>
                  <div className="text-sm text-slate-400">
                    {copiedIndex === i ? '✓ Copied!' : 'Click to copy'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 bg-slate-800 text-white font-mono text-sm">
            <div className="text-slate-400 mb-2">/* CSS Variables */</div>
            <pre>
              {`:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`}
            </pre>
          </div>
        </>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.paletteExtractor.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.paletteExtractor.aboutText')}
        </p>
      </div>
    </div>
  )
}
