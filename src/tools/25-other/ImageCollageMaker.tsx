import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface CollageImage {
  id: string
  src: string
  width: number
  height: number
}

interface CollageSettings {
  layout: 'grid' | 'horizontal' | 'vertical' | 'mosaic'
  columns: number
  gap: number
  backgroundColor: string
  borderRadius: number
  padding: number
}

export default function ImageCollageMaker() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [images, setImages] = useState<CollageImage[]>([])
  const [settings, setSettings] = useState<CollageSettings>({
    layout: 'grid',
    columns: 2,
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    padding: 20
  })
  const [collageUrl, setCollageUrl] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const img = new Image()
      img.onload = () => {
        const newImage: CollageImage = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          src: img.src,
          width: img.width,
          height: img.height
        }
        setImages(prev => [...prev, newImage])
      }
      img.src = URL.createObjectURL(file)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return

    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[newIndex]
    newImages[newIndex] = temp
    setImages(newImages)
  }

  const generateCollage = () => {
    if (images.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { layout, columns, gap, backgroundColor, borderRadius, padding } = settings

    let canvasWidth: number
    let canvasHeight: number
    const cellWidth = 300
    const cellHeight = 300

    if (layout === 'grid') {
      const rows = Math.ceil(images.length / columns)
      canvasWidth = columns * cellWidth + (columns - 1) * gap + padding * 2
      canvasHeight = rows * cellHeight + (rows - 1) * gap + padding * 2
    } else if (layout === 'horizontal') {
      canvasWidth = images.length * cellWidth + (images.length - 1) * gap + padding * 2
      canvasHeight = cellHeight + padding * 2
    } else if (layout === 'vertical') {
      canvasWidth = cellWidth + padding * 2
      canvasHeight = images.length * cellHeight + (images.length - 1) * gap + padding * 2
    } else {
      // Mosaic layout
      const cols = Math.ceil(Math.sqrt(images.length))
      const rows = Math.ceil(images.length / cols)
      canvasWidth = cols * cellWidth + (cols - 1) * gap + padding * 2
      canvasHeight = rows * cellHeight + (rows - 1) * gap + padding * 2
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Fill background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw images
    const drawPromises = images.map((image, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          let x: number, y: number

          if (layout === 'grid') {
            const col = index % columns
            const row = Math.floor(index / columns)
            x = padding + col * (cellWidth + gap)
            y = padding + row * (cellHeight + gap)
          } else if (layout === 'horizontal') {
            x = padding + index * (cellWidth + gap)
            y = padding
          } else if (layout === 'vertical') {
            x = padding
            y = padding + index * (cellHeight + gap)
          } else {
            // Mosaic
            const cols = Math.ceil(Math.sqrt(images.length))
            const col = index % cols
            const row = Math.floor(index / cols)
            x = padding + col * (cellWidth + gap)
            y = padding + row * (cellHeight + gap)
          }

          // Calculate aspect ratio fit
          const scale = Math.min(cellWidth / img.width, cellHeight / img.height)
          const drawWidth = img.width * scale
          const drawHeight = img.height * scale
          const offsetX = x + (cellWidth - drawWidth) / 2
          const offsetY = y + (cellHeight - drawHeight) / 2

          // Draw rounded rectangle clip if needed
          if (borderRadius > 0) {
            ctx.save()
            ctx.beginPath()
            ctx.roundRect(offsetX, offsetY, drawWidth, drawHeight, borderRadius)
            ctx.clip()
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
            ctx.restore()
          } else {
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
          }

          resolve()
        }
        img.src = image.src
      })
    })

    Promise.all(drawPromises).then(() => {
      setCollageUrl(canvas.toDataURL('image/png'))
    })
  }

  useEffect(() => {
    if (images.length > 0) {
      generateCollage()
    } else {
      setCollageUrl(null)
    }
  }, [images, settings])

  const downloadCollage = () => {
    if (!collageUrl) return

    const link = document.createElement('a')
    link.href = collageUrl
    link.download = `collage-${Date.now()}.png`
    link.click()
  }

  const clearAll = () => {
    setImages([])
    setCollageUrl(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {t('tools.imageCollage.addImages')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={downloadCollage} disabled={!collageUrl}>
          {t('tools.imageCollage.download')}
        </Button>
        <Button variant="secondary" onClick={clearAll} disabled={images.length === 0}>
          {t('common.clear')}
        </Button>
        <div className="flex-1" />
        <span className="text-sm text-slate-500">
          {images.length} {t('tools.imageCollage.imagesCount')}
        </span>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          {images.length > 0 && (
            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.imageCollage.imageList')}</label>
              <div className="flex gap-2 flex-wrap p-3 bg-slate-50 rounded-lg">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.src}
                      alt={`Image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded shadow"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => moveImage(index, 'up')}
                          className="w-6 h-6 bg-white rounded text-xs hover:bg-slate-100"
                        >
                          ←
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(image.id)}
                        className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                      {index < images.length - 1 && (
                        <button
                          onClick={() => moveImage(index, 'down')}
                          className="w-6 h-6 bg-white rounded text-xs hover:bg-slate-100"
                        >
                          →
                        </button>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 bg-black/70 text-white text-xs px-1 rounded-tr">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[400px] overflow-auto">
            {collageUrl ? (
              <img
                src={collageUrl}
                alt="Collage Preview"
                className="max-w-full max-h-[400px] shadow-lg rounded object-contain"
              />
            ) : (
              <div className="flex items-center justify-center text-slate-400 h-full">
                {t('tools.imageCollage.placeholder')}
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageCollage.settings')}</h3>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.imageCollage.layout')}</label>
            <select
              value={settings.layout}
              onChange={(e) => setSettings({ ...settings, layout: e.target.value as CollageSettings['layout'] })}
              className="w-full p-2 border border-slate-200 rounded text-sm"
            >
              <option value="grid">{t('tools.imageCollage.layoutGrid')}</option>
              <option value="horizontal">{t('tools.imageCollage.layoutHorizontal')}</option>
              <option value="vertical">{t('tools.imageCollage.layoutVertical')}</option>
              <option value="mosaic">{t('tools.imageCollage.layoutMosaic')}</option>
            </select>
          </div>

          {settings.layout === 'grid' && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.imageCollage.columns')}: {settings.columns}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={settings.columns}
                onChange={(e) => setSettings({ ...settings, columns: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.imageCollage.gap')}: {settings.gap}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={settings.gap}
              onChange={(e) => setSettings({ ...settings, gap: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.imageCollage.padding')}: {settings.padding}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={settings.padding}
              onChange={(e) => setSettings({ ...settings, padding: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.imageCollage.borderRadius')}: {settings.borderRadius}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={settings.borderRadius}
              onChange={(e) => setSettings({ ...settings, borderRadius: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.imageCollage.backgroundColor')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                className="flex-1 p-2 border border-slate-200 rounded text-sm font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageCollage.tips')}</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• {t('tools.imageCollage.tip1')}</li>
              <li>• {t('tools.imageCollage.tip2')}</li>
              <li>• {t('tools.imageCollage.tip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
