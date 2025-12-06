import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface ImageFile {
  id: string
  file: File
  original: {
    size: number
    url: string
    width: number
    height: number
  }
  compressed?: {
    size: number
    url: string
    blob: Blob
  }
}

export default function ImageCompressor() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<ImageFile[]>([])
  const [quality, setQuality] = useState(0.8)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [maxHeight, setMaxHeight] = useState(1080)
  const [resizeEnabled, setResizeEnabled] = useState(false)
  const [format, setFormat] = useState<'jpeg' | 'webp'>('jpeg')
  const [isCompressing, setIsCompressing] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: ImageFile[] = []

    for (const file of Array.from(files)) {
      const img = new Image()
      const url = URL.createObjectURL(file)

      await new Promise<void>((resolve) => {
        img.onload = () => {
          newImages.push({
            id: Math.random().toString(36).substr(2, 9),
            file,
            original: {
              size: file.size,
              url,
              width: img.width,
              height: img.height
            }
          })
          resolve()
        }
        img.src = url
      })
    }

    setImages(prev => [...prev, ...newImages])
    e.target.value = ''
  }

  const compressImage = async (imageFile: ImageFile): Promise<ImageFile> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img

        if (resizeEnabled) {
          const ratio = Math.min(maxWidth / width, maxHeight / height, 1)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(imageFile)
          return
        }

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                ...imageFile,
                compressed: {
                  size: blob.size,
                  url: URL.createObjectURL(blob),
                  blob
                }
              })
            } else {
              resolve(imageFile)
            }
          },
          `image/${format}`,
          quality
        )
      }
      img.src = imageFile.original.url
    })
  }

  const compressAll = async () => {
    setIsCompressing(true)
    const compressed = await Promise.all(images.map(compressImage))
    setImages(compressed)
    setIsCompressing(false)
  }

  const downloadImage = (imageFile: ImageFile) => {
    if (!imageFile.compressed) return

    const a = document.createElement('a')
    a.download = `compressed-${imageFile.file.name.replace(/\.[^/.]+$/, '')}.${format}`
    a.href = imageFile.compressed.url
    a.click()
  }

  const downloadAll = () => {
    images.forEach((img, index) => {
      if (img.compressed) {
        setTimeout(() => downloadImage(img), index * 200)
      }
    })
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const clearAll = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.original.url)
      if (img.compressed) URL.revokeObjectURL(img.compressed.url)
    })
    setImages([])
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const totalOriginal = images.reduce((sum, img) => sum + img.original.size, 0)
  const totalCompressed = images.reduce((sum, img) => sum + (img.compressed?.size || img.original.size), 0)
  const hasCompressed = images.some(img => img.compressed)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {t('tools.imageCompressor.addImages')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button onClick={compressAll} disabled={images.length === 0 || isCompressing}>
          {isCompressing ? t('tools.imageCompressor.compressing') : t('tools.imageCompressor.compressAll')}
        </Button>
        <Button variant="secondary" onClick={downloadAll} disabled={!hasCompressed}>
          {t('tools.imageCompressor.downloadAll')}
        </Button>
        <Button variant="secondary" onClick={clearAll} disabled={images.length === 0}>
          {t('common.clear')}
        </Button>
        <div className="flex-1" />
        <span className="text-sm text-slate-500">
          {images.length} {t('tools.imageCompressor.images')}
        </span>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          {images.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="border border-slate-200 rounded-lg overflow-hidden bg-white"
                  >
                    <div className="aspect-square bg-slate-50 flex items-center justify-center p-2">
                      <img
                        src={img.compressed?.url || img.original.url}
                        alt={img.file.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="p-2 border-t border-slate-100">
                      <div className="text-xs text-slate-600 truncate mb-1">{img.file.name}</div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">{formatSize(img.original.size)}</span>
                        {img.compressed && (
                          <>
                            <span className="text-slate-400">→</span>
                            <span className={img.compressed.size < img.original.size ? 'text-green-600' : 'text-red-500'}>
                              {formatSize(img.compressed.size)}
                            </span>
                          </>
                        )}
                      </div>
                      {img.compressed && (
                        <div className="text-xs text-center mt-1">
                          <span className={img.compressed.size < img.original.size ? 'text-green-600' : 'text-red-500'}>
                            {img.compressed.size < img.original.size ? '-' : '+'}
                            {Math.abs(Math.round((1 - img.compressed.size / img.original.size) * 100))}%
                          </span>
                        </div>
                      )}
                      <div className="flex gap-1 mt-2">
                        {img.compressed && (
                          <button
                            onClick={() => downloadImage(img)}
                            className="flex-1 px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                          >
                            {t('common.download')}
                          </button>
                        )}
                        <button
                          onClick={() => removeImage(img.id)}
                          className="px-2 py-1 text-xs rounded bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasCompressed && (
                <div className="p-3 bg-slate-100 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">{t('tools.imageCompressor.totalSaved')}</span>
                    <span className="font-medium text-green-600">
                      {formatSize(totalOriginal - totalCompressed)} ({Math.round((1 - totalCompressed / totalOriginal) * 100)}%)
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg text-slate-400">
              {t('tools.imageCompressor.placeholder')}
            </div>
          )}
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageCompressor.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageCompressor.format')}</label>
              <div className="flex gap-1">
                {(['jpeg', 'webp'] as const).map(f => (
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

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageCompressor.quality')} ({Math.round(quality * 100)}%)</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{t('tools.imageCompressor.smaller')}</span>
                <span>{t('tools.imageCompressor.better')}</span>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={resizeEnabled}
                onChange={(e) => setResizeEnabled(e.target.checked)}
                className="rounded"
              />
              {t('tools.imageCompressor.resize')}
            </label>

            {resizeEnabled && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.imageCompressor.maxWidth')}</label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1920)}
                    className="input w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.imageCompressor.maxHeight')}</label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(parseInt(e.target.value) || 1080)}
                    className="input w-full text-sm"
                  />
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageCompressor.summary')}</h4>
                <div className="space-y-1 text-xs text-slate-600">
                  <div>{t('tools.imageCompressor.images')}: {images.length}</div>
                  <div>{t('tools.imageCompressor.totalOriginal')}: {formatSize(totalOriginal)}</div>
                  {hasCompressed && (
                    <div>{t('tools.imageCompressor.totalCompressed')}: {formatSize(totalCompressed)}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
