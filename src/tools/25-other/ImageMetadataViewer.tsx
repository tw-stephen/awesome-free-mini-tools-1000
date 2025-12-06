import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface ImageMetadata {
  fileName: string
  fileSize: number
  fileType: string
  width: number
  height: number
  aspectRatio: string
  lastModified: string
  megapixels: number
}

export default function ImageMetadataViewer() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null)

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

  const getAspectRatio = (width: number, height: number) => {
    const divisor = gcd(width, height)
    return `${width / divisor}:${height / divisor}`
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img.src)
      setMetadata({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'unknown',
        width: img.width,
        height: img.height,
        aspectRatio: getAspectRatio(img.width, img.height),
        lastModified: new Date(file.lastModified).toLocaleString(),
        megapixels: parseFloat(((img.width * img.height) / 1000000).toFixed(2))
      })
    }
    img.src = URL.createObjectURL(file)
  }

  const copyMetadata = async () => {
    if (!metadata) return

    const text = `File: ${metadata.fileName}
Size: ${formatSize(metadata.fileSize)}
Type: ${metadata.fileType}
Dimensions: ${metadata.width} × ${metadata.height}
Aspect Ratio: ${metadata.aspectRatio}
Megapixels: ${metadata.megapixels} MP
Last Modified: ${metadata.lastModified}`

    await navigator.clipboard.writeText(text)
  }

  const metadataItems = metadata ? [
    { label: t('tools.imageMetadata.fileName'), value: metadata.fileName },
    { label: t('tools.imageMetadata.fileSize'), value: formatSize(metadata.fileSize) },
    { label: t('tools.imageMetadata.fileType'), value: metadata.fileType },
    { label: t('tools.imageMetadata.dimensions'), value: `${metadata.width} × ${metadata.height}` },
    { label: t('tools.imageMetadata.aspectRatio'), value: metadata.aspectRatio },
    { label: t('tools.imageMetadata.megapixels'), value: `${metadata.megapixels} MP` },
    { label: t('tools.imageMetadata.lastModified'), value: metadata.lastModified }
  ] : []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageMetadata.changeImage') : t('tools.imageMetadata.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={copyMetadata} disabled={!metadata}>
          {t('tools.imageMetadata.copyMetadata')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[350px] overflow-auto">
            {image ? (
              <img
                src={image}
                alt="Preview"
                className="max-w-full max-h-[350px] shadow-lg rounded object-contain"
              />
            ) : (
              <div className="flex items-center justify-center text-slate-400 h-full">
                {t('tools.imageMetadata.placeholder')}
              </div>
            )}
          </div>

          {metadata && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{metadata.width}</div>
                <div className="text-xs text-blue-500">{t('tools.imageMetadata.width')}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{metadata.height}</div>
                <div className="text-xs text-green-500">{t('tools.imageMetadata.height')}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{metadata.megapixels}</div>
                <div className="text-xs text-purple-500">MP</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{formatSize(metadata.fileSize)}</div>
                <div className="text-xs text-orange-500">{t('tools.imageMetadata.size')}</div>
              </div>
            </div>
          )}
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageMetadata.metadata')}</h3>

          {metadata ? (
            <div className="space-y-2">
              {metadataItems.map((item, index) => (
                <div key={index} className="p-2 bg-slate-50 rounded">
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="text-sm text-slate-700 font-medium break-all">{item.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
              {t('tools.imageMetadata.selectHint')}
            </div>
          )}

          {metadata && (
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageMetadata.colorDepth')}</h4>
              <div className="space-y-1 text-xs text-slate-600">
                <div>{t('tools.imageMetadata.totalPixels')}: {(metadata.width * metadata.height).toLocaleString()}</div>
                <div>{t('tools.imageMetadata.orientation')}: {metadata.width > metadata.height ? t('tools.imageMetadata.landscape') : metadata.width < metadata.height ? t('tools.imageMetadata.portrait') : t('tools.imageMetadata.square')}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
