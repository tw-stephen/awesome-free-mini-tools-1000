import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'tile'

export default function ImageWatermark() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [watermarkText, setWatermarkText] = useState('Watermark')
  const [fontSize, setFontSize] = useState(24)
  const [color, setColor] = useState('#ffffff')
  const [opacity, setOpacity] = useState(50)
  const [position, setPosition] = useState<WatermarkPosition>('bottom-right')
  const [rotation, setRotation] = useState(0)
  const [padding, setPadding] = useState(20)
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png')
  const [quality, setQuality] = useState(0.9)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
    }
    img.src = URL.createObjectURL(file)
  }

  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = image.width
    canvas.height = image.height

    // Draw image
    ctx.drawImage(image, 0, 0)

    // Set watermark style
    ctx.globalAlpha = opacity / 100
    ctx.fillStyle = color
    ctx.font = `bold ${fontSize}px Arial, sans-serif`
    ctx.textBaseline = 'middle'

    const textWidth = ctx.measureText(watermarkText).width
    const textHeight = fontSize

    if (position === 'tile') {
      // Tile pattern
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      const spacingX = textWidth + 100
      const spacingY = textHeight + 80

      for (let y = -canvas.height; y < canvas.height * 2; y += spacingY) {
        for (let x = -canvas.width; x < canvas.width * 2; x += spacingX) {
          ctx.fillText(watermarkText, x, y)
        }
      }
      ctx.restore()
    } else {
      // Single watermark
      let x = padding
      let y = padding + textHeight / 2

      switch (position) {
        case 'top-left':
          x = padding
          y = padding + textHeight / 2
          break
        case 'top-right':
          x = canvas.width - textWidth - padding
          y = padding + textHeight / 2
          break
        case 'bottom-left':
          x = padding
          y = canvas.height - padding - textHeight / 2
          break
        case 'bottom-right':
          x = canvas.width - textWidth - padding
          y = canvas.height - padding - textHeight / 2
          break
        case 'center':
          x = (canvas.width - textWidth) / 2
          y = canvas.height / 2
          break
      }

      ctx.save()
      ctx.translate(x + textWidth / 2, y)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.fillText(watermarkText, -textWidth / 2, 0)
      ctx.restore()
    }

    ctx.globalAlpha = 1
  }, [image, watermarkText, fontSize, color, opacity, position, rotation, padding])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const mimeType = `image/${format}`
    const a = document.createElement('a')
    a.download = `watermarked.${format}`
    a.href = canvas.toDataURL(mimeType, quality)
    a.click()
  }

  const positions: { value: WatermarkPosition; label: string }[] = [
    { value: 'top-left', label: t('tools.imageWatermark.topLeft') },
    { value: 'top-right', label: t('tools.imageWatermark.topRight') },
    { value: 'bottom-left', label: t('tools.imageWatermark.bottomLeft') },
    { value: 'bottom-right', label: t('tools.imageWatermark.bottomRight') },
    { value: 'center', label: t('tools.imageWatermark.center') },
    { value: 'tile', label: t('tools.imageWatermark.tile') }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageWatermark.changeImage') : t('tools.imageWatermark.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={downloadImage} disabled={!image}>
          {t('common.download')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[350px] overflow-auto">
            {image ? (
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[350px] shadow-lg"
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <div className="flex items-center justify-center text-slate-400 h-full">
                {t('tools.imageWatermark.placeholder')}
              </div>
            )}
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.imageWatermark.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageWatermark.text')}</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Watermark"
                className="input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageWatermark.position')}</label>
              <div className="grid grid-cols-2 gap-1">
                {positions.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setPosition(p.value)}
                    className={`px-2 py-1 text-xs rounded ${position === p.value ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageWatermark.fontSize')} ({fontSize}px)</label>
              <input
                type="range"
                min="12"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageWatermark.color')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="input flex-1 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageWatermark.opacity')} ({opacity}%)</label>
              <input
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageWatermark.rotation')} ({rotation}°)</label>
              <input
                type="range"
                min="-45"
                max="45"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageWatermark.padding')} ({padding}px)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageWatermark.format')}</label>
              <div className="flex gap-1">
                {(['png', 'jpeg', 'webp'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 px-2 py-1 text-xs rounded ${format === f ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {format !== 'png' && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.imageWatermark.quality')} ({Math.round(quality * 100)}%)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
