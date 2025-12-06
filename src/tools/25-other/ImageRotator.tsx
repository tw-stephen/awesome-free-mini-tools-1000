import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function ImageRotator() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [rotation, setRotation] = useState(0)
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png')
  const [quality, setQuality] = useState(0.9)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      setRotation(0)
    }
    img.src = URL.createObjectURL(file)
  }

  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const radians = (rotation * Math.PI) / 180
    const sin = Math.abs(Math.sin(radians))
    const cos = Math.abs(Math.cos(radians))

    const newWidth = image.width * cos + image.height * sin
    const newHeight = image.width * sin + image.height * cos

    canvas.width = newWidth
    canvas.height = newHeight

    ctx.clearRect(0, 0, newWidth, newHeight)
    ctx.save()
    ctx.translate(newWidth / 2, newHeight / 2)
    ctx.rotate(radians)
    ctx.drawImage(image, -image.width / 2, -image.height / 2)
    ctx.restore()
  }, [image, rotation])

  const rotateBy = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const mimeType = `image/${format}`
    const a = document.createElement('a')
    a.download = `rotated-${rotation}deg.${format}`
    a.href = canvas.toDataURL(mimeType, quality)
    a.click()
  }

  const copyToClipboard = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png')
      })
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const quickRotations = [
    { label: '90°', value: 90 },
    { label: '180°', value: 180 },
    { label: '270°', value: 270 },
    { label: '-90°', value: -90 }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageRotator.changeImage') : t('tools.imageRotator.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex gap-1">
          <button
            onClick={() => rotateBy(-90)}
            disabled={!image}
            className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
            title={t('tools.imageRotator.rotateLeft')}
          >
            ↺
          </button>
          <button
            onClick={() => rotateBy(90)}
            disabled={!image}
            className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
            title={t('tools.imageRotator.rotateRight')}
          >
            ↻
          </button>
        </div>
        <Button variant="secondary" onClick={copyToClipboard} disabled={!image}>
          {t('common.copy')}
        </Button>
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
                {t('tools.imageRotator.placeholder')}
              </div>
            )}
          </div>

          {image && (
            <div className="text-center text-sm text-slate-500">
              {t('tools.imageRotator.currentRotation')}: {rotation}°
            </div>
          )}
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageRotator.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageRotator.rotation')} ({rotation}°)</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full"
                disabled={!image}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageRotator.preciseRotation')}</label>
              <input
                type="number"
                min="-360"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value) || 0)}
                className="input w-full text-sm"
                disabled={!image}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.imageRotator.quickRotate')}</label>
              <div className="grid grid-cols-2 gap-1">
                {quickRotations.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRotation(r.value)}
                    disabled={!image}
                    className={`px-2 py-1.5 text-xs rounded ${rotation === r.value ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'} disabled:opacity-50`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageRotator.format')}</label>
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
                <label className="block text-xs text-slate-500 mb-1">{t('tools.imageRotator.quality')} ({Math.round(quality * 100)}%)</label>
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

            <button
              onClick={() => setRotation(0)}
              disabled={!image || rotation === 0}
              className="w-full px-3 py-1.5 text-xs rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
            >
              {t('tools.imageRotator.reset')}
            </button>

            {image && (
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageRotator.info')}</h4>
                <div className="space-y-1 text-xs text-slate-600">
                  <div>{t('tools.imageRotator.original')}: {image.width}×{image.height}</div>
                  <div>{t('tools.imageRotator.rotation')}: {rotation}°</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
