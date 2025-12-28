import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Platform = 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok' | 'youtube' | 'discord'
type Shape = 'circle' | 'square' | 'rounded'

export default function ProfilePictureCropper() {
  const { t } = useTranslation()
  const [image, setImage] = useState<string | null>(null)
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [shape, setShape] = useState<Shape>('circle')
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const platformSizes: Record<Platform, { size: number; label: string }> = {
    instagram: { size: 320, label: 'Instagram (320x320)' },
    twitter: { size: 400, label: 'Twitter/X (400x400)' },
    linkedin: { size: 400, label: 'LinkedIn (400x400)' },
    facebook: { size: 170, label: 'Facebook (170x170)' },
    tiktok: { size: 200, label: 'TikTok (200x200)' },
    youtube: { size: 800, label: 'YouTube (800x800)' },
    discord: { size: 128, label: 'Discord (128x128)' }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }
    reader.readAsDataURL(file)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!image) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!image) return
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    })
  }

  const downloadCropped = () => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = platformSizes[platform].size
    canvas.width = size
    canvas.height = size

    const img = new Image()
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Apply shape clipping
      ctx.save()
      if (shape === 'circle') {
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
        ctx.clip()
      } else if (shape === 'rounded') {
        const radius = size * 0.1
        ctx.beginPath()
        ctx.moveTo(radius, 0)
        ctx.lineTo(size - radius, 0)
        ctx.quadraticCurveTo(size, 0, size, radius)
        ctx.lineTo(size, size - radius)
        ctx.quadraticCurveTo(size, size, size - radius, size)
        ctx.lineTo(radius, size)
        ctx.quadraticCurveTo(0, size, 0, size - radius)
        ctx.lineTo(0, radius)
        ctx.quadraticCurveTo(0, 0, radius, 0)
        ctx.clip()
      }

      // Calculate image dimensions based on zoom and position
      const previewSize = 200 // Preview container size
      const scale = size / previewSize
      const imgSize = Math.max(img.width, img.height) * zoom
      const offsetX = (previewSize - imgSize) / 2 + position.x
      const offsetY = (previewSize - imgSize) / 2 + position.y

      ctx.drawImage(
        img,
        offsetX * scale,
        offsetY * scale,
        imgSize * scale,
        imgSize * scale
      )

      ctx.restore()

      // Download
      const link = document.createElement('a')
      link.download = `profile-${platform}-${size}x${size}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = image
  }

  const resetPosition = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.profilePictureCropper.platform')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['instagram', 'twitter', 'linkedin', 'facebook', 'tiktok', 'youtube', 'discord'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                platform === p ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 mt-2">
          {t('tools.profilePictureCropper.outputSize')}: {platformSizes[platform].size}x{platformSizes[platform].size}px
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.profilePictureCropper.shape')}
        </label>
        <div className="flex gap-2">
          {(['circle', 'square', 'rounded'] as const).map(s => (
            <button
              key={s}
              onClick={() => setShape(s)}
              className={`flex-1 py-2 rounded text-sm capitalize ${
                shape === s ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-500"
        >
          {image ? t('tools.profilePictureCropper.changeImage') : t('tools.profilePictureCropper.uploadImage')}
        </button>
      </div>

      {image && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.profilePictureCropper.preview')}
            </h3>
            <div className="flex justify-center">
              <div
                ref={previewRef}
                className="relative overflow-hidden cursor-move"
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '10%' : 0,
                  border: '2px solid #e2e8f0'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              >
                <img
                  src={image}
                  alt="Preview"
                  draggable={false}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom})`,
                    minWidth: '100%',
                    minHeight: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">
              {t('tools.profilePictureCropper.dragTip')}
            </p>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                {t('tools.profilePictureCropper.zoom')}: {Math.round(zoom * 100)}%
              </label>
              <button
                onClick={resetPosition}
                className="text-xs text-blue-500"
              >
                {t('tools.profilePictureCropper.reset')}
              </button>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={downloadCropped}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            {t('tools.profilePictureCropper.download')} ({platformSizes[platform].size}x{platformSizes[platform].size})
          </button>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.profilePictureCropper.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.profilePictureCropper.tip1')}</li>
          <li>• {t('tools.profilePictureCropper.tip2')}</li>
          <li>• {t('tools.profilePictureCropper.tip3')}</li>
        </ul>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
