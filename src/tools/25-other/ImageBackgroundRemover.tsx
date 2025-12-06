import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface RemoverSettings {
  tolerance: number
  feather: number
  targetColor: string
  useAutoDetect: boolean
}

export default function ImageBackgroundRemover() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState<RemoverSettings>({
    tolerance: 30,
    feather: 2,
    targetColor: '#ffffff',
    useAutoDetect: true
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      setResultUrl(null)

      // Store original image data
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          setOriginalImageData(ctx.getImageData(0, 0, img.width, img.height))
        }
      }
    }
    img.src = URL.createObjectURL(file)
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 }
  }

  const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
    return Math.sqrt(
      Math.pow(r1 - r2, 2) +
      Math.pow(g1 - g2, 2) +
      Math.pow(b1 - b2, 2)
    )
  }

  const detectBackgroundColor = (imageData: ImageData): { r: number; g: number; b: number } => {
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height

    // Sample corners and edges
    const samples: { r: number; g: number; b: number }[] = []

    // Sample positions (corners and edges)
    const positions = [
      [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1],
      [Math.floor(width / 2), 0], [Math.floor(width / 2), height - 1],
      [0, Math.floor(height / 2)], [width - 1, Math.floor(height / 2)]
    ]

    positions.forEach(([x, y]) => {
      const idx = (y * width + x) * 4
      samples.push({
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2]
      })
    })

    // Find most common color
    const avgR = Math.round(samples.reduce((sum, c) => sum + c.r, 0) / samples.length)
    const avgG = Math.round(samples.reduce((sum, c) => sum + c.g, 0) / samples.length)
    const avgB = Math.round(samples.reduce((sum, c) => sum + c.b, 0) / samples.length)

    return { r: avgR, g: avgG, b: avgB }
  }

  const removeBackground = () => {
    if (!originalImageData || !canvasRef.current || !previewCanvasRef.current) return

    setIsProcessing(true)

    setTimeout(() => {
      const canvas = canvasRef.current!
      const previewCanvas = previewCanvasRef.current!
      const ctx = canvas.getContext('2d')!
      const previewCtx = previewCanvas.getContext('2d')!

      // Copy original data
      const newImageData = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
      )

      const data = newImageData.data
      const { tolerance, feather, targetColor, useAutoDetect } = settings

      // Get target color
      let target: { r: number; g: number; b: number }
      if (useAutoDetect) {
        target = detectBackgroundColor(originalImageData)
      } else {
        target = hexToRgb(targetColor)
      }

      const maxDistance = (tolerance / 100) * 441.67 // Max distance in RGB space

      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const distance = colorDistance(r, g, b, target.r, target.g, target.b)

        if (distance < maxDistance) {
          // Calculate alpha based on distance and feather
          if (feather > 0 && distance > maxDistance * (1 - feather / 10)) {
            const alpha = Math.round(255 * (distance / maxDistance))
            data[i + 3] = alpha
          } else {
            data[i + 3] = 0 // Fully transparent
          }
        }
      }

      // Apply to canvas
      canvas.width = originalImageData.width
      canvas.height = originalImageData.height
      ctx.putImageData(newImageData, 0, 0)

      // Set preview
      previewCanvas.width = originalImageData.width
      previewCanvas.height = originalImageData.height

      // Draw checkerboard pattern for transparency
      const patternCanvas = document.createElement('canvas')
      patternCanvas.width = 20
      patternCanvas.height = 20
      const patternCtx = patternCanvas.getContext('2d')!
      patternCtx.fillStyle = '#ffffff'
      patternCtx.fillRect(0, 0, 20, 20)
      patternCtx.fillStyle = '#e5e5e5'
      patternCtx.fillRect(0, 0, 10, 10)
      patternCtx.fillRect(10, 10, 10, 10)

      const pattern = previewCtx.createPattern(patternCanvas, 'repeat')
      if (pattern) {
        previewCtx.fillStyle = pattern
        previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height)
      }

      previewCtx.drawImage(canvas, 0, 0)

      setResultUrl(canvas.toDataURL('image/png'))
      setIsProcessing(false)
    }, 100)
  }

  const downloadResult = () => {
    if (!resultUrl) return

    const link = document.createElement('a')
    link.href = resultUrl
    link.download = `bg-removed-${Date.now()}.png`
    link.click()
  }

  const resetImage = () => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (ctx && originalImageData) {
      ctx.putImageData(originalImageData, 0, 0)
    }
    setResultUrl(null)
  }

  useEffect(() => {
    if (image && originalImageData) {
      removeBackground()
    }
  }, [settings])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.bgRemover.changeImage') : t('tools.bgRemover.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={removeBackground} disabled={!image || isProcessing}>
          {isProcessing ? t('tools.bgRemover.processing') : t('tools.bgRemover.remove')}
        </Button>
        <Button variant="secondary" onClick={downloadResult} disabled={!resultUrl}>
          {t('tools.bgRemover.download')}
        </Button>
        <Button variant="secondary" onClick={resetImage} disabled={!image}>
          {t('tools.bgRemover.reset')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.bgRemover.original')}</label>
              <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[250px] overflow-auto">
                {image ? (
                  <img
                    src={image.src}
                    alt="Original"
                    className="max-w-full max-h-[250px] shadow-lg rounded object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center text-slate-400 h-full">
                    {t('tools.bgRemover.placeholder')}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.bgRemover.result')}</label>
              <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[250px] overflow-auto">
                {resultUrl ? (
                  <canvas
                    ref={previewCanvasRef}
                    className="max-w-full max-h-[250px] shadow-lg rounded object-contain"
                    style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain' }}
                  />
                ) : (
                  <div className="flex items-center justify-center text-slate-400 h-full">
                    {image ? t('tools.bgRemover.clickRemove') : t('tools.bgRemover.selectFirst')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {resultUrl && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-lg">✓</span>
                <span className="font-medium">{t('tools.bgRemover.success')}</span>
              </div>
              <p className="text-sm text-green-600 mt-1">{t('tools.bgRemover.successHint')}</p>
            </div>
          )}
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.bgRemover.settings')}</h3>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={settings.useAutoDetect}
                onChange={(e) => setSettings({ ...settings, useAutoDetect: e.target.checked })}
                className="rounded"
              />
              {t('tools.bgRemover.autoDetect')}
            </label>
          </div>

          {!settings.useAutoDetect && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.bgRemover.targetColor')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.targetColor}
                  onChange={(e) => setSettings({ ...settings, targetColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.targetColor}
                  onChange={(e) => setSettings({ ...settings, targetColor: e.target.value })}
                  className="flex-1 p-2 border border-slate-200 rounded text-sm font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.bgRemover.tolerance')}: {settings.tolerance}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={settings.tolerance}
              onChange={(e) => setSettings({ ...settings, tolerance: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{t('tools.bgRemover.precise')}</span>
              <span>{t('tools.bgRemover.loose')}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.bgRemover.feather')}: {settings.feather}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={settings.feather}
              onChange={(e) => setSettings({ ...settings, feather: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{t('tools.bgRemover.sharp')}</span>
              <span>{t('tools.bgRemover.soft')}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.bgRemover.tips')}</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• {t('tools.bgRemover.tip1')}</li>
              <li>• {t('tools.bgRemover.tip2')}</li>
              <li>• {t('tools.bgRemover.tip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
