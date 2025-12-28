import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type Style = 'office' | 'gradient' | 'nature' | 'abstract' | 'minimal' | 'bookshelf'
type Resolution = '720p' | '1080p' | '4k'

export default function VideoCallBackgroundGenerator() {
  const { t } = useTranslation()
  const [style, setStyle] = useState<Style>('gradient')
  const [resolution, setResolution] = useState<Resolution>('1080p')
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  const [secondaryColor, setSecondaryColor] = useState('#8b5cf6')
  const [showName, setShowName] = useState(false)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const resolutions: Record<Resolution, { width: number; height: number }> = {
    '720p': { width: 1280, height: 720 },
    '1080p': { width: 1920, height: 1080 },
    '4k': { width: 3840, height: 2160 }
  }

  const downloadBackground = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = resolutions[resolution]
    canvas.width = width
    canvas.height = height

    // Draw based on style
    switch (style) {
      case 'gradient':
        drawGradient(ctx, width, height)
        break
      case 'office':
        drawOffice(ctx, width, height)
        break
      case 'nature':
        drawNature(ctx, width, height)
        break
      case 'abstract':
        drawAbstract(ctx, width, height)
        break
      case 'minimal':
        drawMinimal(ctx, width, height)
        break
      case 'bookshelf':
        drawBookshelf(ctx, width, height)
        break
    }

    // Add name/company overlay if enabled
    if (showName && (name || company)) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(40, height - 120, 400, 80)

      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'left'
      if (name) {
        ctx.font = `bold ${height / 30}px sans-serif`
        ctx.fillText(name, 60, height - 80)
      }
      if (company) {
        ctx.font = `${height / 45}px sans-serif`
        ctx.fillText(company, 60, height - 50)
      }
    }

    // Download
    const link = document.createElement('a')
    link.download = `video-call-background-${style}-${resolution}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const drawGradient = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, primaryColor)
    gradient.addColorStop(1, secondaryColor)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Add subtle pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const r = Math.random() * 100 + 50
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const drawOffice = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Wall
    ctx.fillStyle = '#f5f5f4'
    ctx.fillRect(0, 0, width, height)

    // Window
    ctx.fillStyle = '#87ceeb'
    ctx.fillRect(width * 0.6, height * 0.1, width * 0.35, height * 0.5)
    ctx.strokeStyle = '#d4d4d4'
    ctx.lineWidth = 10
    ctx.strokeRect(width * 0.6, height * 0.1, width * 0.35, height * 0.5)
    ctx.beginPath()
    ctx.moveTo(width * 0.775, height * 0.1)
    ctx.lineTo(width * 0.775, height * 0.6)
    ctx.stroke()
    ctx.moveTo(width * 0.6, height * 0.35)
    ctx.lineTo(width * 0.95, height * 0.35)
    ctx.stroke()

    // Shelf
    ctx.fillStyle = '#a78bfa'
    ctx.fillRect(width * 0.05, height * 0.3, width * 0.25, height * 0.02)

    // Plant
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(width * 0.15, height * 0.25, 30, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#854d0e'
    ctx.fillRect(width * 0.14, height * 0.27, 20, 30)

    // Desk hint at bottom
    ctx.fillStyle = '#78716c'
    ctx.fillRect(0, height * 0.85, width, height * 0.15)
  }

  const drawNature = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6)
    skyGradient.addColorStop(0, '#87ceeb')
    skyGradient.addColorStop(1, '#e0f2fe')
    ctx.fillStyle = skyGradient
    ctx.fillRect(0, 0, width, height * 0.6)

    // Mountains
    ctx.fillStyle = '#64748b'
    ctx.beginPath()
    ctx.moveTo(0, height * 0.5)
    ctx.lineTo(width * 0.3, height * 0.2)
    ctx.lineTo(width * 0.5, height * 0.45)
    ctx.lineTo(width * 0.7, height * 0.15)
    ctx.lineTo(width, height * 0.4)
    ctx.lineTo(width, height * 0.6)
    ctx.lineTo(0, height * 0.6)
    ctx.fill()

    // Trees/grass
    ctx.fillStyle = '#22c55e'
    ctx.fillRect(0, height * 0.55, width, height * 0.45)

    // Trees
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * width
      const y = height * 0.5 + Math.random() * height * 0.2
      ctx.fillStyle = '#166534'
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x - 30, y + 60)
      ctx.lineTo(x + 30, y + 60)
      ctx.fill()
    }

    // Blur effect overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(0, 0, width, height)
  }

  const drawAbstract = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, height)

    // Random shapes
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 200 + 50

      ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 60%, 0.3)`
      ctx.beginPath()
      if (Math.random() > 0.5) {
        ctx.arc(x, y, size, 0, Math.PI * 2)
      } else {
        ctx.rect(x - size / 2, y - size / 2, size, size)
      }
      ctx.fill()
    }

    // Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 2
    for (let i = 0; i < 15; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * width, Math.random() * height)
      ctx.lineTo(Math.random() * width, Math.random() * height)
      ctx.stroke()
    }
  }

  const drawMinimal = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = primaryColor
    ctx.fillRect(0, 0, width, height)

    // Subtle texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2)
    }
  }

  const drawBookshelf = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Wall
    ctx.fillStyle = '#fef3c7'
    ctx.fillRect(0, 0, width, height)

    // Shelf color
    const shelfColor = '#92400e'
    const bookColors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#1e293b']

    // Draw shelves
    const shelfHeight = height / 4
    for (let shelf = 0; shelf < 3; shelf++) {
      const y = shelf * shelfHeight + 100

      // Shelf board
      ctx.fillStyle = shelfColor
      ctx.fillRect(width * 0.1, y + shelfHeight - 20, width * 0.8, 20)

      // Books
      let x = width * 0.12
      while (x < width * 0.88) {
        const bookWidth = 20 + Math.random() * 30
        const bookHeight = shelfHeight - 40 - Math.random() * 40
        const color = bookColors[Math.floor(Math.random() * bookColors.length)]

        ctx.fillStyle = color
        ctx.fillRect(x, y + shelfHeight - 20 - bookHeight, bookWidth, bookHeight)

        // Book spine highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.fillRect(x + 2, y + shelfHeight - 20 - bookHeight + 10, 3, bookHeight - 20)

        x += bookWidth + 2
      }
    }
  }

  const styleIcons: Record<Style, string> = {
    gradient: '🌈',
    office: '🏢',
    nature: '🌿',
    abstract: '🎨',
    minimal: '⬜',
    bookshelf: '📚'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.videoCallBackgroundGenerator.style')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['gradient', 'office', 'nature', 'abstract', 'minimal', 'bookshelf'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                style === s ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {styleIcons[s]} {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.videoCallBackgroundGenerator.resolution')}
        </label>
        <div className="flex gap-2">
          {(['720p', '1080p', '4k'] as const).map(r => (
            <button
              key={r}
              onClick={() => setResolution(r)}
              className={`flex-1 py-2 rounded text-sm ${
                resolution === r ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {r} ({resolutions[r].width}x{resolutions[r].height})
            </button>
          ))}
        </div>
      </div>

      {(style === 'gradient' || style === 'minimal') && (
        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.videoCallBackgroundGenerator.colors')}
          </label>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <span className="text-sm text-slate-600">{t('tools.videoCallBackgroundGenerator.primary')}</span>
            </div>
            {style === 'gradient' && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="text-sm text-slate-600">{t('tools.videoCallBackgroundGenerator.secondary')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card p-4 space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showName}
            onChange={(e) => setShowName(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium text-slate-700">
            {t('tools.videoCallBackgroundGenerator.showName')}
          </span>
        </label>
        {showName && (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('tools.videoCallBackgroundGenerator.name')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t('tools.videoCallBackgroundGenerator.company')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.videoCallBackgroundGenerator.preview')}
        </h3>
        <div
          className="mx-auto rounded overflow-hidden"
          style={{
            width: '100%',
            aspectRatio: '16/9',
            maxWidth: '400px',
            background: style === 'gradient'
              ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
              : style === 'minimal'
              ? primaryColor
              : style === 'nature'
              ? 'linear-gradient(180deg, #87ceeb 0%, #22c55e 60%)'
              : style === 'bookshelf'
              ? '#fef3c7'
              : style === 'abstract'
              ? '#1e293b'
              : '#f5f5f4'
          }}
        >
          <div className="w-full h-full flex items-end justify-start p-2">
            {showName && (name || company) && (
              <div className="bg-black/30 px-2 py-1 rounded text-white text-xs">
                {name && <div className="font-bold">{name}</div>}
                {company && <div className="opacity-75">{company}</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={downloadBackground}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        {t('tools.videoCallBackgroundGenerator.download')}
      </button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
