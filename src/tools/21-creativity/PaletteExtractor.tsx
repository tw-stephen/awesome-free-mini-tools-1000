import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface ColorInfo {
  hex: string
  rgb: { r: number; g: number; b: number }
  count: number
}

export default function PaletteExtractor() {
  const { t } = useTranslation()
  const [imageSrc, setImageSrc] = useState<string>('')
  const [colors, setColors] = useState<ColorInfo[]>([])
  const [paletteSize, setPaletteSize] = useState(6)
  const [isExtracting, setIsExtracting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
      setColors([])
    }
    reader.readAsDataURL(file)
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  }

  const colorDistance = (c1: number[], c2: number[]): number => {
    return Math.sqrt(
      Math.pow(c1[0] - c2[0], 2) +
      Math.pow(c1[1] - c2[1], 2) +
      Math.pow(c1[2] - c2[2], 2)
    )
  }

  const extractColors = () => {
    if (!imageSrc) return

    setIsExtracting(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Scale down for faster processing
      const maxSize = 100
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Collect color data with quantization
      const colorMap = new Map<string, { rgb: number[]; count: number }>()
      const quantize = 24 // Group similar colors

      for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / quantize) * quantize
        const g = Math.round(data[i + 1] / quantize) * quantize
        const b = Math.round(data[i + 2] / quantize) * quantize
        const a = data[i + 3]

        if (a < 128) continue // Skip transparent pixels

        const key = `${r},${g},${b}`
        const existing = colorMap.get(key)
        if (existing) {
          existing.count++
        } else {
          colorMap.set(key, { rgb: [r, g, b], count: 1 })
        }
      }

      // Sort by frequency and get top colors
      const sortedColors = Array.from(colorMap.values())
        .sort((a, b) => b.count - a.count)

      // Filter out similar colors
      const distinctColors: ColorInfo[] = []
      const minDistance = 50

      for (const color of sortedColors) {
        if (distinctColors.length >= paletteSize) break

        const isDifferent = distinctColors.every(
          (existing) => colorDistance(color.rgb, [existing.rgb.r, existing.rgb.g, existing.rgb.b]) > minDistance
        )

        if (isDifferent) {
          distinctColors.push({
            hex: rgbToHex(color.rgb[0], color.rgb[1], color.rgb[2]),
            rgb: { r: color.rgb[0], g: color.rgb[1], b: color.rgb[2] },
            count: color.count,
          })
        }
      }

      setColors(distinctColors)
      setIsExtracting(false)
    }
    img.src = imageSrc
  }

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex)
  }

  const copyAllColors = () => {
    const text = colors.map(c => c.hex).join(', ')
    navigator.clipboard.writeText(text)
  }

  const generateCSS = (): string => {
    return colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n')
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full"
          />

          <div className="flex gap-4 items-center">
            <label className="text-sm">
              {t('tools.paletteExtractor.paletteSize')}:
            </label>
            <input
              type="range"
              min="3"
              max="12"
              value={paletteSize}
              onChange={(e) => setPaletteSize(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium w-8">{paletteSize}</span>
          </div>

          <button
            onClick={extractColors}
            disabled={!imageSrc || isExtracting}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isExtracting ? t('tools.paletteExtractor.extracting') : t('tools.paletteExtractor.extract')}
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {imageSrc && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.paletteExtractor.originalImage')}</h3>
          <img
            src={imageSrc}
            alt="Source"
            className="max-w-full max-h-64 mx-auto rounded"
          />
        </div>
      )}

      {colors.length > 0 && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.paletteExtractor.extractedPalette')}</h3>
            <div className="flex rounded-lg overflow-hidden">
              {colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => copyColor(color.hex)}
                  className="flex-1 h-24 group relative hover:scale-105 transition-transform"
                  style={{ backgroundColor: color.hex }}
                  title={`Click to copy ${color.hex}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <span className="text-white text-xs font-mono">{color.hex}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.paletteExtractor.colorDetails')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => copyColor(color.hex)}
                  className="flex items-center gap-3 p-2 rounded border hover:border-blue-500 transition"
                >
                  <div
                    className="w-10 h-10 rounded"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-left">
                    <div className="font-mono text-sm">{color.hex.toUpperCase()}</div>
                    <div className="text-xs text-gray-500">
                      RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">{t('tools.paletteExtractor.cssVariables')}</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              :root {'{\n'}
              {generateCSS()}
              {'\n}'}
            </pre>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyAllColors}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('common.copy')} {t('tools.paletteExtractor.allColors')}
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(`:root {\n${generateCSS()}\n}`)}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {t('common.copy')} CSS
            </button>
          </div>
        </>
      )}

      {!imageSrc && (
        <div className="card p-12 text-center text-gray-400">
          {t('tools.paletteExtractor.uploadHint')}
        </div>
      )}
    </div>
  )
}
