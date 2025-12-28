import { useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface ImageFile {
  id: string
  file: File
  preview: string
  processed?: string
  status: 'pending' | 'processing' | 'done' | 'error'
}

interface ProcessingOptions {
  resize: boolean
  maxWidth: number
  maxHeight: number
  format: 'original' | 'jpeg' | 'png' | 'webp'
  quality: number
  rotate: number
  flipH: boolean
  flipV: boolean
}

export default function BatchImageProcessor() {
  const { t } = useTranslation()
  const [images, setImages] = useState<ImageFile[]>([])
  const [options, setOptions] = useState<ProcessingOptions>({
    resize: false,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'original',
    quality: 0.9,
    rotate: 0,
    flipH: false,
    flipV: false,
  })
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter((f) => f.type.startsWith('image/'))

    const newImages: ImageFile[] = imageFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
    }))

    setImages((prev) => [...prev, ...newImages])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id)
      if (img) {
        URL.revokeObjectURL(img.preview)
        if (img.processed) URL.revokeObjectURL(img.processed)
      }
      return prev.filter((i) => i.id !== id)
    })
  }

  const processImage = useCallback(
    async (image: ImageFile): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Canvas context not available'))
            return
          }

          let { width, height } = img

          // Resize if enabled
          if (options.resize) {
            const ratio = Math.min(options.maxWidth / width, options.maxHeight / height, 1)
            width = Math.round(width * ratio)
            height = Math.round(height * ratio)
          }

          // Handle rotation
          const needsRotate = options.rotate === 90 || options.rotate === 270
          if (needsRotate) {
            canvas.width = height
            canvas.height = width
          } else {
            canvas.width = width
            canvas.height = height
          }

          ctx.save()

          // Apply transformations
          ctx.translate(canvas.width / 2, canvas.height / 2)
          ctx.rotate((options.rotate * Math.PI) / 180)
          if (options.flipH) ctx.scale(-1, 1)
          if (options.flipV) ctx.scale(1, -1)

          if (needsRotate) {
            ctx.drawImage(img, -height / 2, -width / 2, height, width)
          } else {
            ctx.drawImage(img, -width / 2, -height / 2, width, height)
          }

          ctx.restore()

          // Convert to blob
          let mimeType = image.file.type
          if (options.format !== 'original') {
            mimeType = `image/${options.format}`
          }

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(URL.createObjectURL(blob))
              } else {
                reject(new Error('Failed to create blob'))
              }
            },
            mimeType,
            options.quality
          )
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = image.preview
      })
    },
    [options]
  )

  const processAll = async () => {
    setProcessing(true)

    for (const image of images) {
      if (image.status === 'done') continue

      setImages((prev) =>
        prev.map((i) => (i.id === image.id ? { ...i, status: 'processing' as const } : i))
      )

      try {
        const processed = await processImage(image)
        setImages((prev) =>
          prev.map((i) => (i.id === image.id ? { ...i, processed, status: 'done' as const } : i))
        )
      } catch {
        setImages((prev) =>
          prev.map((i) => (i.id === image.id ? { ...i, status: 'error' as const } : i))
        )
      }
    }

    setProcessing(false)
  }

  const downloadAll = () => {
    images.forEach((image, index) => {
      if (image.processed) {
        const link = document.createElement('a')
        link.href = image.processed
        const ext = options.format === 'original' ? image.file.name.split('.').pop() : options.format
        link.download = `processed_${index + 1}.${ext}`
        link.click()
      }
    })
  }

  const clearAll = () => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.preview)
      if (img.processed) URL.revokeObjectURL(img.processed)
    })
    setImages([])
  }

  const processedCount = images.filter((i) => i.status === 'done').length

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="batch-image-input"
          />
          <label
            htmlFor="batch-image-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.batchImageProcessor.addImages')}
          </label>
          <Button
            variant="primary"
            onClick={processAll}
            disabled={images.length === 0 || processing}
          >
            {processing
              ? t('tools.batchImageProcessor.processing')
              : t('tools.batchImageProcessor.processAll')}
          </Button>
          {processedCount > 0 && (
            <Button onClick={downloadAll}>{t('tools.batchImageProcessor.downloadAll')}</Button>
          )}
          {images.length > 0 && (
            <Button variant="secondary" onClick={clearAll}>
              {t('common.clear')}
            </Button>
          )}
        </div>

        <div className="text-sm text-slate-600">
          {images.length} {t('tools.batchImageProcessor.images')} ({processedCount}{' '}
          {t('tools.batchImageProcessor.processed')})
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.batchImageProcessor.settings')}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={options.resize}
                  onChange={(e) => setOptions({ ...options, resize: e.target.checked })}
                />
                <span className="text-sm">{t('tools.batchImageProcessor.resize')}</span>
              </label>
              {options.resize && (
                <div className="flex gap-2 ml-6">
                  <input
                    type="number"
                    value={options.maxWidth}
                    onChange={(e) => setOptions({ ...options, maxWidth: parseInt(e.target.value) || 0 })}
                    className="w-24 px-2 py-1 border border-slate-200 rounded text-sm"
                    placeholder="Width"
                  />
                  <span className="text-slate-400">×</span>
                  <input
                    type="number"
                    value={options.maxHeight}
                    onChange={(e) => setOptions({ ...options, maxHeight: parseInt(e.target.value) || 0 })}
                    className="w-24 px-2 py-1 border border-slate-200 rounded text-sm"
                    placeholder="Height"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.batchImageProcessor.format')}
              </label>
              <select
                value={options.format}
                onChange={(e) =>
                  setOptions({ ...options, format: e.target.value as ProcessingOptions['format'] })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="original">{t('tools.batchImageProcessor.original')}</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.batchImageProcessor.quality')}: {Math.round(options.quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={options.quality}
                onChange={(e) => setOptions({ ...options, quality: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.batchImageProcessor.rotate')}
              </label>
              <div className="flex gap-2">
                {[0, 90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setOptions({ ...options, rotate: deg })}
                    className={`px-3 py-1 text-sm rounded ${
                      options.rotate === deg
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.flipH}
                  onChange={(e) => setOptions({ ...options, flipH: e.target.checked })}
                />
                <span className="text-sm">{t('tools.batchImageProcessor.flipH')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.flipV}
                  onChange={(e) => setOptions({ ...options, flipV: e.target.checked })}
                />
                <span className="text-sm">{t('tools.batchImageProcessor.flipV')}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.batchImageProcessor.imageList')}
          </h3>

          {images.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              {t('tools.batchImageProcessor.noImages')}
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"
                >
                  <img
                    src={image.processed || image.preview}
                    alt=""
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{image.file.name}</div>
                    <div className="text-xs text-slate-500">
                      {(image.file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {image.status === 'pending' && (
                      <span className="text-xs text-slate-400">
                        {t('tools.batchImageProcessor.pending')}
                      </span>
                    )}
                    {image.status === 'processing' && (
                      <span className="text-xs text-blue-500">
                        {t('tools.batchImageProcessor.processingStatus')}
                      </span>
                    )}
                    {image.status === 'done' && (
                      <span className="text-xs text-green-500">✓</span>
                    )}
                    {image.status === 'error' && (
                      <span className="text-xs text-red-500">✗</span>
                    )}
                    <button
                      onClick={() => removeImage(image.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
