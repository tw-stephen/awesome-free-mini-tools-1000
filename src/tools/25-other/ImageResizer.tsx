import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function ImageResizer() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 })
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [lockRatio, setLockRatio] = useState(true)
  const [resizeMode, setResizeMode] = useState<'pixels' | 'percentage'>('pixels')
  const [percentage, setPercentage] = useState(100)
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png')
  const [quality, setQuality] = useState(0.9)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      setOriginalSize({ width: img.width, height: img.height })
      setWidth(img.width)
      setHeight(img.height)
      setPercentage(100)
    }
    img.src = URL.createObjectURL(file)
  }

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (lockRatio && originalSize.width > 0) {
      const ratio = originalSize.height / originalSize.width
      setHeight(Math.round(newWidth * ratio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (lockRatio && originalSize.height > 0) {
      const ratio = originalSize.width / originalSize.height
      setWidth(Math.round(newHeight * ratio))
    }
  }

  const handlePercentageChange = (newPercentage: number) => {
    setPercentage(newPercentage)
    setWidth(Math.round(originalSize.width * newPercentage / 100))
    setHeight(Math.round(originalSize.height * newPercentage / 100))
  }

  const resizeImage = () => {
    if (!image) return null

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(image, 0, 0, width, height)

    return canvas
  }

  const downloadResized = () => {
    const canvas = resizeImage()
    if (!canvas) return

    const mimeType = `image/${format}`
    const a = document.createElement('a')
    a.download = `resized-${width}x${height}.${format}`
    a.href = canvas.toDataURL(mimeType, quality)
    a.click()
  }

  const presets = [
    { name: 'HD', w: 1280, h: 720 },
    { name: 'Full HD', w: 1920, h: 1080 },
    { name: '4K', w: 3840, h: 2160 },
    { name: 'Instagram', w: 1080, h: 1080 },
    { name: 'Twitter', w: 1200, h: 675 },
    { name: 'Facebook', w: 1200, h: 630 },
    { name: 'Thumbnail', w: 150, h: 150 },
    { name: 'Icon', w: 64, h: 64 }
  ]

  const percentagePresets = [25, 50, 75, 100, 150, 200]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageResizer.changeImage') : t('tools.imageResizer.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={downloadResized} disabled={!image}>
          {t('common.download')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[300px] overflow-auto">
            {image ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={image.src}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    width: 'auto',
                    height: 'auto'
                  }}
                  className="shadow-lg rounded"
                />
                <div className="text-sm text-slate-500">
                  {t('tools.imageResizer.original')}: {originalSize.width}×{originalSize.height} → {t('tools.imageResizer.new')}: {width}×{height}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center text-slate-400">
                {t('tools.imageResizer.placeholder')}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">{t('tools.imageResizer.presets')}</label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {presets.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setWidth(preset.w)
                    setHeight(preset.h)
                    setLockRatio(false)
                  }}
                  disabled={!image}
                  className="px-2 py-1.5 text-xs rounded border border-slate-200 hover:border-slate-300 disabled:opacity-50"
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-slate-400">{preset.w}×{preset.h}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageResizer.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageResizer.mode')}</label>
              <div className="flex gap-1">
                <button
                  onClick={() => setResizeMode('pixels')}
                  className={`flex-1 px-2 py-1 text-xs rounded ${resizeMode === 'pixels' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  {t('tools.imageResizer.pixels')}
                </button>
                <button
                  onClick={() => setResizeMode('percentage')}
                  className={`flex-1 px-2 py-1 text-xs rounded ${resizeMode === 'percentage' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  {t('tools.imageResizer.percentage')}
                </button>
              </div>
            </div>

            {resizeMode === 'pixels' ? (
              <>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.imageResizer.width')}</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
                    className="input w-full text-sm"
                    disabled={!image}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.imageResizer.height')}</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 1)}
                    className="input w-full text-sm"
                    disabled={!image}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={lockRatio}
                    onChange={(e) => setLockRatio(e.target.checked)}
                    className="rounded"
                  />
                  {t('tools.imageResizer.lockRatio')}
                </label>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.imageResizer.scale')} ({percentage}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    value={percentage}
                    onChange={(e) => handlePercentageChange(parseInt(e.target.value))}
                    className="w-full"
                    disabled={!image}
                  />
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {percentagePresets.map(p => (
                    <button
                      key={p}
                      onClick={() => handlePercentageChange(p)}
                      disabled={!image}
                      className={`px-2 py-1 text-xs rounded ${percentage === p ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'} disabled:opacity-50`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </>
            )}

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageResizer.format')}</label>
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
                <label className="block text-xs text-slate-500 mb-1">{t('tools.imageResizer.quality')} ({Math.round(quality * 100)}%)</label>
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
                <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageResizer.info')}</h4>
                <div className="space-y-1 text-xs text-slate-600">
                  <div>{t('tools.imageResizer.original')}: {originalSize.width}×{originalSize.height}</div>
                  <div>{t('tools.imageResizer.new')}: {width}×{height}</div>
                  <div>{t('tools.imageResizer.ratio')}: {((width / originalSize.width) * 100).toFixed(1)}%</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
