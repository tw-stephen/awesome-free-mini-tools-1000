import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export default function ImageCropper() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [aspectRatio, setAspectRatio] = useState<string>('free')
  const [scale, setScale] = useState(1)
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png')
  const [quality, setQuality] = useState(0.9)

  const aspectRatios: { [key: string]: number | null } = {
    'free': null,
    '1:1': 1,
    '4:3': 4/3,
    '3:2': 3/2,
    '16:9': 16/9,
    '9:16': 9/16,
    '2:3': 2/3,
    '3:4': 3/4
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      const container = containerRef.current
      if (container) {
        const containerWidth = container.clientWidth - 32
        const containerHeight = 400
        const imgScale = Math.min(containerWidth / img.width, containerHeight / img.height, 1)
        setScale(imgScale)

        const displayWidth = img.width * imgScale
        const displayHeight = img.height * imgScale
        const cropSize = Math.min(displayWidth, displayHeight) * 0.6
        setCropArea({
          x: (displayWidth - cropSize) / 2,
          y: (displayHeight - cropSize) / 2,
          width: cropSize,
          height: cropSize
        })
      }
    }
    img.src = URL.createObjectURL(file)
  }

  const handleMouseDown = (e: React.MouseEvent, action: 'drag' | string) => {
    e.preventDefault()
    const rect = (e.target as HTMLElement).closest('.crop-container')?.getBoundingClientRect()
    if (!rect) return

    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })

    if (action === 'drag') {
      setIsDragging(true)
    } else {
      setIsResizing(action)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && !isResizing) return
    if (!image) return

    const rect = (e.target as HTMLElement).closest('.crop-container')?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const dx = x - dragStart.x
    const dy = y - dragStart.y

    const maxWidth = image.width * scale
    const maxHeight = image.height * scale

    if (isDragging) {
      setCropArea(prev => ({
        ...prev,
        x: Math.max(0, Math.min(maxWidth - prev.width, prev.x + dx)),
        y: Math.max(0, Math.min(maxHeight - prev.height, prev.y + dy))
      }))
    } else if (isResizing) {
      const ratio = aspectRatios[aspectRatio]

      setCropArea(prev => {
        let newArea = { ...prev }

        if (isResizing.includes('e')) {
          newArea.width = Math.max(20, Math.min(maxWidth - prev.x, prev.width + dx))
        }
        if (isResizing.includes('w')) {
          const newWidth = Math.max(20, Math.min(prev.x + prev.width, prev.width - dx))
          newArea.x = prev.x + prev.width - newWidth
          newArea.width = newWidth
        }
        if (isResizing.includes('s')) {
          newArea.height = Math.max(20, Math.min(maxHeight - prev.y, prev.height + dy))
        }
        if (isResizing.includes('n')) {
          const newHeight = Math.max(20, Math.min(prev.y + prev.height, prev.height - dy))
          newArea.y = prev.y + prev.height - newHeight
          newArea.height = newHeight
        }

        if (ratio) {
          if (isResizing.includes('e') || isResizing.includes('w')) {
            newArea.height = newArea.width / ratio
          } else {
            newArea.width = newArea.height * ratio
          }
        }

        return newArea
      })
    }

    setDragStart({ x, y })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(null)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
      setIsResizing(null)
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  const cropImage = () => {
    if (!image) return null

    const canvas = document.createElement('canvas')
    const realX = cropArea.x / scale
    const realY = cropArea.y / scale
    const realWidth = cropArea.width / scale
    const realHeight = cropArea.height / scale

    canvas.width = realWidth
    canvas.height = realHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(image, realX, realY, realWidth, realHeight, 0, 0, realWidth, realHeight)
    return canvas
  }

  const downloadCropped = () => {
    const canvas = cropImage()
    if (!canvas) return

    const mimeType = `image/${format}`
    const a = document.createElement('a')
    a.download = `cropped.${format}`
    a.href = canvas.toDataURL(mimeType, quality)
    a.click()
  }

  const copyToClipboard = async () => {
    const canvas = cropImage()
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

  const presetSizes = [
    { name: '1:1', w: 200, h: 200 },
    { name: '4:3', w: 200, h: 150 },
    { name: '16:9', w: 200, h: 112 },
    { name: '9:16', w: 112, h: 200 }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageCropper.changeImage') : t('tools.imageCropper.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={copyToClipboard} disabled={!image}>
          {t('common.copy')}
        </Button>
        <Button variant="secondary" onClick={downloadCropped} disabled={!image}>
          {t('common.download')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4" ref={containerRef}>
          <div
            className="crop-container relative bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center"
            style={{ minHeight: 400 }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {image ? (
              <div className="relative" style={{ width: image.width * scale, height: image.height * scale }}>
                <img
                  src={image.src}
                  alt="Original"
                  style={{ width: image.width * scale, height: image.height * scale }}
                  draggable={false}
                />
                <div
                  className="absolute inset-0 bg-black/50 pointer-events-none"
                  style={{
                    clipPath: `polygon(
                      0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
                      ${cropArea.x}px ${cropArea.y}px,
                      ${cropArea.x}px ${cropArea.y + cropArea.height}px,
                      ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px,
                      ${cropArea.x + cropArea.width}px ${cropArea.y}px,
                      ${cropArea.x}px ${cropArea.y}px
                    )`
                  }}
                />
                <div
                  className="absolute border-2 border-white cursor-move"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.width,
                    height: cropArea.height,
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0)'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'drag')}
                >
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-white/30" />
                    ))}
                  </div>

                  {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map(dir => (
                    <div
                      key={dir}
                      className="absolute w-3 h-3 bg-white border border-slate-400 rounded-sm"
                      style={{
                        cursor: `${dir}-resize`,
                        ...(dir.includes('n') ? { top: -6 } : {}),
                        ...(dir.includes('s') ? { bottom: -6 } : {}),
                        ...(dir.includes('w') ? { left: -6 } : {}),
                        ...(dir.includes('e') ? { right: -6 } : {}),
                        ...(dir === 'n' || dir === 's' ? { left: '50%', marginLeft: -6 } : {}),
                        ...(dir === 'w' || dir === 'e' ? { top: '50%', marginTop: -6 } : {})
                      }}
                      onMouseDown={(e) => handleMouseDown(e, dir)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 p-8 text-center">
                {t('tools.imageCropper.placeholder')}
              </div>
            )}
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageCropper.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageCropper.aspectRatio')}</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="input w-full text-sm"
              >
                {Object.keys(aspectRatios).map(ratio => (
                  <option key={ratio} value={ratio}>
                    {ratio === 'free' ? t('tools.imageCropper.free') : ratio}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.imageCropper.quickAspect')}</label>
              <div className="grid grid-cols-4 gap-1">
                {presetSizes.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setAspectRatio(preset.name)
                      if (image) {
                        const maxWidth = image.width * scale
                        const maxHeight = image.height * scale
                        const newWidth = Math.min(preset.w, maxWidth)
                        const newHeight = Math.min(preset.h, maxHeight)
                        setCropArea(prev => ({
                          ...prev,
                          width: newWidth,
                          height: newHeight
                        }))
                      }
                    }}
                    className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageCropper.format')}</label>
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
                <label className="block text-xs text-slate-500 mb-1">{t('tools.imageCropper.quality')} ({Math.round(quality * 100)}%)</label>
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
                <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageCropper.info')}</h4>
                <div className="space-y-1 text-xs text-slate-600">
                  <div>{t('tools.imageCropper.original')}: {image.width}×{image.height}</div>
                  <div>{t('tools.imageCropper.cropSize')}: {Math.round(cropArea.width / scale)}×{Math.round(cropArea.height / scale)}</div>
                  <div>{t('tools.imageCropper.position')}: ({Math.round(cropArea.x / scale)}, {Math.round(cropArea.y / scale)})</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
