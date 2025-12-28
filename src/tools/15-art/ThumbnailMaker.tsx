import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ThumbnailMaker() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [title, setTitle] = useState('AMAZING VIDEO')
  const [subtitle, setSubtitle] = useState('Watch Now!')
  const [bgColor1, setBgColor1] = useState('#EF4444')
  const [bgColor2, setBgColor2] = useState('#F59E0B')
  const [textColor, setTextColor] = useState('#ffffff')
  const [style, setStyle] = useState<'gradient' | 'solid' | 'split' | 'pattern'>('gradient')
  const [size, setSize] = useState<'youtube' | 'instagram' | 'twitter'>('youtube')

  const sizes = {
    youtube: { width: 1280, height: 720, name: 'YouTube (1280×720)' },
    instagram: { width: 1080, height: 1080, name: 'Instagram (1080×1080)' },
    twitter: { width: 1200, height: 675, name: 'Twitter (1200×675)' },
  }

  useEffect(() => {
    drawThumbnail()
  }, [title, subtitle, bgColor1, bgColor2, textColor, style, size])

  const drawThumbnail = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = sizes[size]
    // Scale down for preview
    const scale = 300 / width
    canvas.width = width * scale
    canvas.height = height * scale

    const w = canvas.width
    const h = canvas.height

    // Background
    switch (style) {
      case 'gradient':
        const gradient = ctx.createLinearGradient(0, 0, w, h)
        gradient.addColorStop(0, bgColor1)
        gradient.addColorStop(1, bgColor2)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, w, h)
        break
      case 'solid':
        ctx.fillStyle = bgColor1
        ctx.fillRect(0, 0, w, h)
        break
      case 'split':
        ctx.fillStyle = bgColor1
        ctx.fillRect(0, 0, w / 2, h)
        ctx.fillStyle = bgColor2
        ctx.fillRect(w / 2, 0, w / 2, h)
        break
      case 'pattern':
        ctx.fillStyle = bgColor1
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = bgColor2
        for (let y = 0; y < h; y += 20) {
          for (let x = 0; x < w; x += 20) {
            if ((x + y) % 40 === 0) {
              ctx.fillRect(x, y, 10, 10)
            }
          }
        }
        break
    }

    // Text shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 3

    // Title
    ctx.fillStyle = textColor
    ctx.font = `bold ${w * 0.08}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const lines = wrapText(ctx, title, w * 0.8)
    const lineHeight = w * 0.1
    const startY = h / 2 - ((lines.length - 1) * lineHeight) / 2 - (subtitle ? lineHeight / 2 : 0)

    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, startY + i * lineHeight)
    })

    // Subtitle
    if (subtitle) {
      ctx.font = `${w * 0.04}px Arial`
      ctx.fillText(subtitle, w / 2, startY + lines.length * lineHeight + 10)
    }

    ctx.shadowColor = 'transparent'
  }

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    })
    if (currentLine) lines.push(currentLine)

    return lines
  }

  const downloadThumbnail = () => {
    const canvas = document.createElement('canvas')
    const { width, height } = sizes[size]
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw at full resolution
    switch (style) {
      case 'gradient':
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, bgColor1)
        gradient.addColorStop(1, bgColor2)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
        break
      case 'solid':
        ctx.fillStyle = bgColor1
        ctx.fillRect(0, 0, width, height)
        break
      case 'split':
        ctx.fillStyle = bgColor1
        ctx.fillRect(0, 0, width / 2, height)
        ctx.fillStyle = bgColor2
        ctx.fillRect(width / 2, 0, width / 2, height)
        break
      case 'pattern':
        ctx.fillStyle = bgColor1
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = bgColor2
        for (let y = 0; y < height; y += 40) {
          for (let x = 0; x < width; x += 40) {
            if ((x + y) % 80 === 0) {
              ctx.fillRect(x, y, 20, 20)
            }
          }
        }
        break
    }

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 6
    ctx.shadowOffsetY = 6

    ctx.fillStyle = textColor
    ctx.font = `bold ${width * 0.08}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const lines = wrapText(ctx, title, width * 0.8)
    const lineHeight = width * 0.1
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2 - (subtitle ? lineHeight / 2 : 0)

    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight)
    })

    if (subtitle) {
      ctx.font = `${width * 0.04}px Arial`
      ctx.fillText(subtitle, width / 2, startY + lines.length * lineHeight + 20)
    }

    const link = document.createElement('a')
    link.download = `thumbnail-${size}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const styles = [
    { id: 'gradient', name: 'Gradient' },
    { id: 'solid', name: 'Solid' },
    { id: 'split', name: 'Split' },
    { id: 'pattern', name: 'Pattern' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4">
          <canvas ref={canvasRef} className="border border-slate-200 rounded shadow-lg" />
        </div>
        <div className="flex gap-2">
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as any)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          >
            {Object.entries(sizes).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
          <button
            onClick={downloadThumbnail}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.thumbnailMaker.download')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.thumbnailMaker.text')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle (optional)"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.thumbnailMaker.style')}</h3>
        <div className="flex gap-2">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id as any)}
              className={`flex-1 py-2 rounded ${
                style === s.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.thumbnailMaker.colors')}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Color 1</label>
            <input
              type="color"
              value={bgColor1}
              onChange={(e) => setBgColor1(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Color 2</label>
            <input
              type="color"
              value={bgColor2}
              onChange={(e) => setBgColor2(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Text</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
