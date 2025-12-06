import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function ImageFlipper() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png')
  const [quality, setQuality] = useState(0.9)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      setFlipH(false)
      setFlipV(false)
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

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    ctx.translate(
      flipH ? canvas.width : 0,
      flipV ? canvas.height : 0
    )
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)

    ctx.drawImage(image, 0, 0)
    ctx.restore()
  }, [image, flipH, flipV])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const mimeType = `image/${format}`
    const flipLabel = [flipH ? 'h' : '', flipV ? 'v' : ''].filter(Boolean).join('-') || 'original'
    const a = document.createElement('a')
    a.download = `flipped-${flipLabel}.${format}`
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

  const reset = () => {
    setFlipH(false)
    setFlipV(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageFlipper.changeImage') : t('tools.imageFlipper.selectImage')}
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
            onClick={() => setFlipH(!flipH)}
            disabled={!image}
            className={`px-3 py-1.5 rounded ${flipH ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'} disabled:opacity-50`}
            title={t('tools.imageFlipper.flipHorizontal')}
          >
            ⇆
          </button>
          <button
            onClick={() => setFlipV(!flipV)}
            disabled={!image}
            className={`px-3 py-1.5 rounded ${flipV ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'} disabled:opacity-50`}
            title={t('tools.imageFlipper.flipVertical')}
          >
            ⇅
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
                {t('tools.imageFlipper.placeholder')}
              </div>
            )}
          </div>

          {image && (
            <div className="text-center text-sm text-slate-500">
              {flipH && flipV
                ? t('tools.imageFlipper.flippedBoth')
                : flipH
                ? t('tools.imageFlipper.flippedH')
                : flipV
                ? t('tools.imageFlipper.flippedV')
                : t('tools.imageFlipper.noFlip')}
            </div>
          )}
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageFlipper.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.imageFlipper.flipOptions')}</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={flipH}
                    onChange={(e) => setFlipH(e.target.checked)}
                    disabled={!image}
                    className="rounded"
                  />
                  <span className="text-sm">{t('tools.imageFlipper.flipHorizontal')}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={flipV}
                    onChange={(e) => setFlipV(e.target.checked)}
                    disabled={!image}
                    className="rounded"
                  />
                  <span className="text-sm">{t('tools.imageFlipper.flipVertical')}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.imageFlipper.quickFlip')}</label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => { setFlipH(true); setFlipV(false) }}
                  disabled={!image}
                  className={`px-2 py-1.5 text-xs rounded ${flipH && !flipV ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'} disabled:opacity-50`}
                >
                  {t('tools.imageFlipper.horizontal')}
                </button>
                <button
                  onClick={() => { setFlipH(false); setFlipV(true) }}
                  disabled={!image}
                  className={`px-2 py-1.5 text-xs rounded ${!flipH && flipV ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'} disabled:opacity-50`}
                >
                  {t('tools.imageFlipper.vertical')}
                </button>
                <button
                  onClick={() => { setFlipH(true); setFlipV(true) }}
                  disabled={!image}
                  className={`px-2 py-1.5 text-xs rounded ${flipH && flipV ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'} disabled:opacity-50`}
                >
                  {t('tools.imageFlipper.both')}
                </button>
                <button
                  onClick={reset}
                  disabled={!image}
                  className="px-2 py-1.5 text-xs rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
                >
                  {t('tools.imageFlipper.reset')}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageFlipper.format')}</label>
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
                <label className="block text-xs text-slate-500 mb-1">{t('tools.imageFlipper.quality')} ({Math.round(quality * 100)}%)</label>
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

            {image && (
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageFlipper.info')}</h4>
                <div className="space-y-1 text-xs text-slate-600">
                  <div>{t('tools.imageFlipper.size')}: {image.width}×{image.height}</div>
                  <div>{t('tools.imageFlipper.flipH')}: {flipH ? '✓' : '✗'}</div>
                  <div>{t('tools.imageFlipper.flipV')}: {flipV ? '✓' : '✗'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
