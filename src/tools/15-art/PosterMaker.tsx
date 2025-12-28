import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function PosterMaker() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [headline, setHeadline] = useState('EVENT NAME')
  const [subheadline, setSubheadline] = useState('Join us for something amazing')
  const [date, setDate] = useState('December 31, 2024')
  const [location, setLocation] = useState('City Convention Center')
  const [bgColor, setBgColor] = useState('#1F2937')
  const [accentColor, setAccentColor] = useState('#F59E0B')
  const [textColor, setTextColor] = useState('#ffffff')
  const [template, setTemplate] = useState<'event' | 'sale' | 'announcement' | 'concert'>('event')

  useEffect(() => {
    drawPoster()
  }, [headline, subheadline, date, location, bgColor, accentColor, textColor, template])

  const drawPoster = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 400
    const height = 500
    canvas.width = width
    canvas.height = height

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, bgColor)
    gradient.addColorStop(1, adjustColor(bgColor, -30))
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    switch (template) {
      case 'event':
        drawEventPoster(ctx, width, height)
        break
      case 'sale':
        drawSalePoster(ctx, width, height)
        break
      case 'announcement':
        drawAnnouncementPoster(ctx, width, height)
        break
      case 'concert':
        drawConcertPoster(ctx, width, height)
        break
    }
  }

  const adjustColor = (hex: string, amount: number): string => {
    const num = parseInt(hex.slice(1), 16)
    const r = Math.min(255, Math.max(0, (num >> 16) + amount))
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
  }

  const drawEventPoster = (ctx: CanvasRenderingContext2D, width: number, _height: number) => {
    // Accent bar
    ctx.fillStyle = accentColor
    ctx.fillRect(0, 80, width, 8)

    // Headline
    ctx.fillStyle = textColor
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    wrapText(ctx, headline, width / 2, 180, width - 40, 55)

    // Subheadline
    ctx.fillStyle = accentColor
    ctx.font = '20px Arial'
    ctx.fillText(subheadline, width / 2, 260)

    // Date box
    ctx.fillStyle = accentColor
    ctx.fillRect(width / 2 - 120, 310, 240, 60)
    ctx.fillStyle = bgColor
    ctx.font = 'bold 24px Arial'
    ctx.fillText(date, width / 2, 348)

    // Location
    ctx.fillStyle = textColor
    ctx.font = '18px Arial'
    ctx.fillText(location, width / 2, 420)
  }

  const drawSalePoster = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Starburst background
    ctx.fillStyle = accentColor
    for (let i = 0; i < 12; i++) {
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.rotate((Math.PI * 2 / 12) * i)
      ctx.fillRect(-30, -height, 60, height * 2)
      ctx.restore()
    }

    // Center circle
    ctx.fillStyle = bgColor
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, 150, 0, Math.PI * 2)
    ctx.fill()

    // Text
    ctx.fillStyle = textColor
    ctx.font = 'bold 60px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(headline, width / 2, height / 2 - 20)

    ctx.fillStyle = accentColor
    ctx.font = 'bold 30px Arial'
    ctx.fillText(subheadline, width / 2, height / 2 + 30)

    ctx.fillStyle = textColor
    ctx.font = '18px Arial'
    ctx.fillText(date, width / 2, height / 2 + 70)
  }

  const drawAnnouncementPoster = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Border
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 8
    ctx.strokeRect(20, 20, width - 40, height - 40)

    // Headline
    ctx.fillStyle = accentColor
    ctx.font = 'bold 36px Arial'
    ctx.textAlign = 'center'
    wrapText(ctx, headline, width / 2, 120, width - 80, 45)

    // Decorative line
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(60, 200)
    ctx.lineTo(width - 60, 200)
    ctx.stroke()

    // Subheadline
    ctx.fillStyle = textColor
    ctx.font = '20px Arial'
    wrapText(ctx, subheadline, width / 2, 260, width - 80, 28)

    // Date & Location
    ctx.fillStyle = accentColor
    ctx.font = 'bold 22px Arial'
    ctx.fillText(date, width / 2, 380)
    ctx.fillStyle = textColor
    ctx.font = '18px Arial'
    ctx.fillText(location, width / 2, 420)
  }

  const drawConcertPoster = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Geometric shapes
    ctx.fillStyle = accentColor
    ctx.globalAlpha = 0.3
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(200, 0)
    ctx.lineTo(0, 200)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(width, height)
    ctx.lineTo(width - 200, height)
    ctx.lineTo(width, height - 200)
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = 1

    // Artist name
    ctx.fillStyle = textColor
    ctx.font = 'bold 56px Arial'
    ctx.textAlign = 'center'
    wrapText(ctx, headline, width / 2, 160, width - 40, 65)

    // Tour name
    ctx.fillStyle = accentColor
    ctx.font = 'italic 24px Arial'
    ctx.fillText(subheadline, width / 2, 260)

    // Date
    ctx.fillStyle = textColor
    ctx.font = 'bold 28px Arial'
    ctx.fillText(date, width / 2, 360)

    // Venue
    ctx.font = '20px Arial'
    ctx.fillText(location, width / 2, 400)

    // Bottom accent
    ctx.fillStyle = accentColor
    ctx.fillRect(0, height - 20, width, 20)
  }

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ')
    let line = ''
    let currentY = y

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY)
        line = words[n] + ' '
        currentY += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x, currentY)
  }

  const downloadPoster = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'poster.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const templates = [
    { id: 'event', name: 'Event' },
    { id: 'sale', name: 'Sale' },
    { id: 'announcement', name: 'Announce' },
    { id: 'concert', name: 'Concert' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4">
          <canvas ref={canvasRef} className="border border-slate-200 rounded shadow-lg" />
        </div>
        <button
          onClick={downloadPoster}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.posterMaker.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.posterMaker.template')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {templates.map((temp) => (
            <button
              key={temp.id}
              onClick={() => setTemplate(temp.id as any)}
              className={`py-2 rounded ${
                template === temp.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {temp.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.posterMaker.content')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Headline"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            placeholder="Subheadline"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Date"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.posterMaker.colors')}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.posterMaker.bgColor')}</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.posterMaker.accentColor')}</label>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.posterMaker.textColor')}</label>
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
