import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface ImageFile {
  id: string
  file: File
  original: {
    url: string
    format: string
    size: number
    width: number
    height: number
  }
  converted?: {
    url: string
    blob: Blob
    size: number
  }
}

type ImageFormat = 'png' | 'jpeg' | 'webp' | 'gif' | 'bmp'

export default function ImageFormatConverter() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<ImageFile[]>([])
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('png')
  const [quality, setQuality] = useState(0.9)
  const [isConverting, setIsConverting] = useState(false)

  const formatLabels: Record<ImageFormat, string> = {
    png: 'PNG',
    jpeg: 'JPEG',
    webp: 'WebP',
    gif: 'GIF',
    bmp: 'BMP'
  }

  const getFormatFromMime = (mimeType: string): string => {
    const map: Record<string, string> = {
      'image/png': 'PNG',
      'image/jpeg': 'JPEG',
      'image/webp': 'WebP',
      'image/gif': 'GIF',
      'image/bmp': 'BMP'
    }
    return map[mimeType] || 'Unknown'
  }

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
              url,
              format: getFormatFromMime(file.type),
              size: file.size,
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

  const convertImage = async (imageFile: ImageFile): Promise<ImageFile> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(imageFile)
          return
        }

        // For formats that don't support transparency, fill with white
        if (targetFormat === 'jpeg' || targetFormat === 'bmp') {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        ctx.drawImage(img, 0, 0)

        const mimeType = targetFormat === 'bmp' ? 'image/bmp' : `image/${targetFormat}`
        const useQuality = targetFormat === 'jpeg' || targetFormat === 'webp'

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                ...imageFile,
                converted: {
                  url: URL.createObjectURL(blob),
                  blob,
                  size: blob.size
                }
              })
            } else {
              resolve(imageFile)
            }
          },
          mimeType,
          useQuality ? quality : undefined
        )
      }
      img.src = imageFile.original.url
    })
  }

  const convertAll = async () => {
    setIsConverting(true)
    const converted = await Promise.all(images.map(convertImage))
    setImages(converted)
    setIsConverting(false)
  }

  const downloadImage = (imageFile: ImageFile) => {
    if (!imageFile.converted) return

    const a = document.createElement('a')
    const baseName = imageFile.file.name.replace(/\.[^/.]+$/, '')
    a.download = `${baseName}.${targetFormat}`
    a.href = imageFile.converted.url
    a.click()
  }

  const downloadAll = () => {
    images.forEach((img, index) => {
      if (img.converted) {
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
      if (img.converted) URL.revokeObjectURL(img.converted.url)
    })
    setImages([])
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const hasConverted = images.some(img => img.converted)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {t('tools.imageConverter.addImages')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button onClick={convertAll} disabled={images.length === 0 || isConverting}>
          {isConverting ? t('tools.imageConverter.converting') : t('tools.imageConverter.convertAll')}
        </Button>
        <Button variant="secondary" onClick={downloadAll} disabled={!hasConverted}>
          {t('tools.imageConverter.downloadAll')}
        </Button>
        <Button variant="secondary" onClick={clearAll} disabled={images.length === 0}>
          {t('common.clear')}
        </Button>
        <div className="flex-1" />
        <span className="text-sm text-slate-500">
          {images.length} {t('tools.imageConverter.images')}
        </span>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="border border-slate-200 rounded-lg overflow-hidden bg-white"
                >
                  <div className="aspect-square bg-slate-50 flex items-center justify-center p-2">
                    <img
                      src={img.converted?.url || img.original.url}
                      alt={img.file.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="p-2 border-t border-slate-100">
                    <div className="text-xs text-slate-600 truncate mb-1">{img.file.name}</div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                        {img.original.format}
                      </span>
                      {img.converted && (
                        <>
                          <span className="text-slate-400">→</span>
                          <span className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-600">
                            {formatLabels[targetFormat]}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">{formatSize(img.original.size)}</span>
                      {img.converted && (
                        <>
                          <span className="text-slate-400">→</span>
                          <span className="text-slate-600">{formatSize(img.converted.size)}</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {img.converted && (
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
          ) : (
            <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg text-slate-400">
              {t('tools.imageConverter.placeholder')}
            </div>
          )}
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageConverter.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.imageConverter.targetFormat')}</label>
              <div className="grid grid-cols-2 gap-1">
                {(Object.keys(formatLabels) as ImageFormat[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setTargetFormat(f)}
                    className={`px-2 py-1.5 text-xs rounded ${targetFormat === f ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                  >
                    {formatLabels[f]}
                  </button>
                ))}
              </div>
            </div>

            {(targetFormat === 'jpeg' || targetFormat === 'webp') && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.imageConverter.quality')} ({Math.round(quality * 100)}%)</label>
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

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageConverter.formatInfo')}</h4>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-2 bg-slate-50 rounded">
                  <div className="font-medium">PNG</div>
                  <div className="text-slate-400">{t('tools.imageConverter.pngDesc')}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <div className="font-medium">JPEG</div>
                  <div className="text-slate-400">{t('tools.imageConverter.jpegDesc')}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <div className="font-medium">WebP</div>
                  <div className="text-slate-400">{t('tools.imageConverter.webpDesc')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
