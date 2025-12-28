import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ImageCropper() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 })
  const [aspectRatio, setAspectRatio] = useState<'free' | '1:1' | '16:9' | '4:3' | '3:2'>('free')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      setCrop({ x: 0, y: 0, width: Math.min(200, img.width), height: Math.min(200, img.height) })
    }
    img.src = URL.createObjectURL(file)
  }

  useEffect(() => {
    if (!image) return
    drawCanvas()
    drawPreview()
  }, [image, crop])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const maxSize = 400
    const scale = Math.min(maxSize / image.width, maxSize / image.height, 1)
    canvas.width = image.width * scale
    canvas.height = image.height * scale

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Clear crop area
    const scaledCrop = {
      x: crop.x * scale,
      y: crop.y * scale,
      width: crop.width * scale,
      height: crop.height * scale,
    }

    ctx.clearRect(scaledCrop.x, scaledCrop.y, scaledCrop.width, scaledCrop.height)
    ctx.drawImage(
      image,
      crop.x, crop.y, crop.width, crop.height,
      scaledCrop.x, scaledCrop.y, scaledCrop.width, scaledCrop.height
    )

    // Crop border
    ctx.strokeStyle = '#3B82F6'
    ctx.lineWidth = 2
    ctx.strokeRect(scaledCrop.x, scaledCrop.y, scaledCrop.width, scaledCrop.height)

    // Corner handles
    const handleSize = 10
    ctx.fillStyle = '#3B82F6'
    const corners = [
      [scaledCrop.x, scaledCrop.y],
      [scaledCrop.x + scaledCrop.width, scaledCrop.y],
      [scaledCrop.x, scaledCrop.y + scaledCrop.height],
      [scaledCrop.x + scaledCrop.width, scaledCrop.y + scaledCrop.height],
    ]
    corners.forEach(([x, y]) => {
      ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize)
    })
  }

  const drawPreview = () => {
    const canvas = previewRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 150
    canvas.height = 150 * (crop.height / crop.width)

    ctx.drawImage(
      image,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, canvas.width, canvas.height
    )
  }

  const handleCropChange = (key: keyof typeof crop, value: number) => {
    if (!image) return

    let newCrop = { ...crop, [key]: value }

    if (aspectRatio !== 'free') {
      const ratios = { '1:1': 1, '16:9': 16/9, '4:3': 4/3, '3:2': 3/2 }
      const ratio = ratios[aspectRatio]

      if (key === 'width') {
        newCrop.height = Math.round(value / ratio)
      } else if (key === 'height') {
        newCrop.width = Math.round(value * ratio)
      }
    }

    // Constrain to image bounds
    newCrop.width = Math.min(newCrop.width, image.width - newCrop.x)
    newCrop.height = Math.min(newCrop.height, image.height - newCrop.y)

    setCrop(newCrop)
  }

  const downloadCropped = () => {
    if (!image) return

    const canvas = document.createElement('canvas')
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(
      image,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, crop.width, crop.height
    )

    const link = document.createElement('a')
    link.download = 'cropped-image.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const aspectRatios = [
    { id: 'free', name: 'Free' },
    { id: '1:1', name: '1:1' },
    { id: '16:9', name: '16:9' },
    { id: '4:3', name: '4:3' },
    { id: '3:2', name: '3:2' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        {!image ? (
          <label className="block w-full py-12 border-2 border-dashed border-slate-300 rounded-lg text-center cursor-pointer hover:border-blue-500">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-slate-600">{t('tools.imageCropper.upload')}</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex gap-4">
            <div className="flex-1">
              <canvas ref={canvasRef} className="max-w-full border border-slate-200 rounded" />
            </div>
            <div className="w-40">
              <div className="text-sm text-slate-500 mb-2">Preview</div>
              <canvas ref={previewRef} className="max-w-full border border-slate-200 rounded bg-white" />
            </div>
          </div>
        )}
      </div>

      {image && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.imageCropper.aspectRatio')}</h3>
            <div className="flex gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id as any)}
                  className={`flex-1 py-2 rounded ${
                    aspectRatio === ratio.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {ratio.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.imageCropper.cropArea')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-500 block mb-1">X: {crop.x}px</label>
                <input
                  type="range"
                  min="0"
                  max={image.width - crop.width}
                  value={crop.x}
                  onChange={(e) => handleCropChange('x', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Y: {crop.y}px</label>
                <input
                  type="range"
                  min="0"
                  max={image.height - crop.height}
                  value={crop.y}
                  onChange={(e) => handleCropChange('y', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Width: {crop.width}px</label>
                <input
                  type="range"
                  min="20"
                  max={image.width - crop.x}
                  value={crop.width}
                  onChange={(e) => handleCropChange('width', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Height: {crop.height}px</label>
                <input
                  type="range"
                  min="20"
                  max={image.height - crop.y}
                  value={crop.height}
                  onChange={(e) => handleCropChange('height', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex gap-2">
              <label className="flex-1 py-2 bg-slate-100 rounded text-center cursor-pointer hover:bg-slate-200">
                {t('tools.imageCropper.changeImage')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={downloadCropped}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t('tools.imageCropper.download')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
