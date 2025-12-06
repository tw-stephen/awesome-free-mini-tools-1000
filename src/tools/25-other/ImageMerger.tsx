import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface MergeImage {
  id: string
  src: string
  width: number
  height: number
}

interface MergeSettings {
  direction: 'horizontal' | 'vertical'
  alignment: 'start' | 'center' | 'end'
  gap: number
  backgroundColor: string
  useTransparent: boolean
  resizeMode: 'none' | 'fit-width' | 'fit-height'
}

export default function ImageMerger() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [images, setImages] = useState<MergeImage[]>([])
  const [mergedUrl, setMergedUrl] = useState<string | null>(null)
  const [settings, setSettings] = useState<MergeSettings>({
    direction: 'horizontal',
    alignment: 'center',
    gap: 0,
    backgroundColor: '#ffffff',
    useTransparent: false,
    resizeMode: 'none'
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const img = new Image()
      img.onload = () => {
        const newImage: MergeImage = {
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

  const mergeImages = async () => {
    if (images.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { direction, alignment, gap, backgroundColor, useTransparent, resizeMode } = settings

    // Load all images
    const loadedImages = await Promise.all(
      images.map(img => {
        return new Promise<HTMLImageElement>((resolve) => {
          const image = new Image()
          image.onload = () => resolve(image)
          image.src = img.src
        })
      })
    )

    // Calculate target dimensions based on resize mode
    let targetWidth = 0
    let targetHeight = 0

    if (resizeMode === 'fit-width' && direction === 'vertical') {
      targetWidth = Math.min(...loadedImages.map(img => img.width))
    } else if (resizeMode === 'fit-height' && direction === 'horizontal') {
      targetHeight = Math.min(...loadedImages.map(img => img.height))
    }

    // Calculate dimensions with resizing
    const imageDimensions = loadedImages.map(img => {
      let w = img.width
      let h = img.height

      if (resizeMode === 'fit-width' && targetWidth > 0) {
        const ratio = targetWidth / img.width
        w = targetWidth
        h = img.height * ratio
      } else if (resizeMode === 'fit-height' && targetHeight > 0) {
        const ratio = targetHeight / img.height
        h = targetHeight
        w = img.width * ratio
      }

      return { width: w, height: h }
    })

    // Calculate canvas size
    let canvasWidth: number
    let canvasHeight: number

    if (direction === 'horizontal') {
      canvasWidth = imageDimensions.reduce((sum, dim) => sum + dim.width, 0) + gap * (images.length - 1)
      canvasHeight = Math.max(...imageDimensions.map(dim => dim.height))
    } else {
      canvasWidth = Math.max(...imageDimensions.map(dim => dim.width))
      canvasHeight = imageDimensions.reduce((sum, dim) => sum + dim.height, 0) + gap * (images.length - 1)
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Fill background
    if (!useTransparent) {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    }

    // Draw images
    let offset = 0
    loadedImages.forEach((img, index) => {
      const dim = imageDimensions[index]
      let x = 0
      let y = 0

      if (direction === 'horizontal') {
        x = offset
        if (alignment === 'center') {
          y = (canvasHeight - dim.height) / 2
        } else if (alignment === 'end') {
          y = canvasHeight - dim.height
        }
        offset += dim.width + gap
      } else {
        y = offset
        if (alignment === 'center') {
          x = (canvasWidth - dim.width) / 2
        } else if (alignment === 'end') {
          x = canvasWidth - dim.width
        }
        offset += dim.height + gap
      }

      ctx.drawImage(img, x, y, dim.width, dim.height)
    })

    setMergedUrl(canvas.toDataURL('image/png'))
  }

  useEffect(() => {
    if (images.length > 0) {
      mergeImages()
    } else {
      setMergedUrl(null)
    }
  }, [images, settings])

  const downloadMerged = () => {
    if (!mergedUrl) return

    const link = document.createElement('a')
    link.href = mergedUrl
    link.download = `merged-${Date.now()}.png`
    link.click()
  }

  const clearAll = () => {
    setImages([])
    setMergedUrl(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {t('tools.imageMerger.addImages')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={downloadMerged} disabled={!mergedUrl}>
          {t('common.download')}
        </Button>
        <Button variant="secondary" onClick={clearAll} disabled={images.length === 0}>
          {t('common.clear')}
        </Button>
        <div className="flex-1" />
        <span className="text-sm text-slate-500">
          {images.length} {t('tools.imageMerger.imagesCount')}
        </span>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          {images.length > 0 && (
            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.imageMerger.imageList')}</label>
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

          <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[300px] overflow-auto">
            {mergedUrl ? (
              <img
                src={mergedUrl}
                alt="Merged Result"
                className="max-w-full max-h-[300px] shadow-lg rounded object-contain"
              />
            ) : (
              <div className="flex items-center justify-center text-slate-400 h-full">
                {t('tools.imageMerger.placeholder')}
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageMerger.settings')}</h3>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.imageMerger.direction')}</label>
            <select
              value={settings.direction}
              onChange={(e) => setSettings({ ...settings, direction: e.target.value as 'horizontal' | 'vertical' })}
              className="w-full p-2 border border-slate-200 rounded text-sm"
            >
              <option value="horizontal">{t('tools.imageMerger.horizontal')}</option>
              <option value="vertical">{t('tools.imageMerger.vertical')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.imageMerger.alignment')}</label>
            <select
              value={settings.alignment}
              onChange={(e) => setSettings({ ...settings, alignment: e.target.value as 'start' | 'center' | 'end' })}
              className="w-full p-2 border border-slate-200 rounded text-sm"
            >
              <option value="start">{t('tools.imageMerger.alignStart')}</option>
              <option value="center">{t('tools.imageMerger.alignCenter')}</option>
              <option value="end">{t('tools.imageMerger.alignEnd')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.imageMerger.resizeMode')}</label>
            <select
              value={settings.resizeMode}
              onChange={(e) => setSettings({ ...settings, resizeMode: e.target.value as 'none' | 'fit-width' | 'fit-height' })}
              className="w-full p-2 border border-slate-200 rounded text-sm"
            >
              <option value="none">{t('tools.imageMerger.noResize')}</option>
              <option value="fit-width">{t('tools.imageMerger.fitWidth')}</option>
              <option value="fit-height">{t('tools.imageMerger.fitHeight')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.imageMerger.gap')}: {settings.gap}px
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
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={settings.useTransparent}
                onChange={(e) => setSettings({ ...settings, useTransparent: e.target.checked })}
                className="rounded"
              />
              {t('tools.imageMerger.transparent')}
            </label>
          </div>

          {!settings.useTransparent && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageMerger.backgroundColor')}</label>
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
          )}

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageMerger.tips')}</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• {t('tools.imageMerger.tip1')}</li>
              <li>• {t('tools.imageMerger.tip2')}</li>
              <li>• {t('tools.imageMerger.tip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
