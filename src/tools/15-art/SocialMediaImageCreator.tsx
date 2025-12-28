import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function SocialMediaImageCreator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [platform, setPlatform] = useState<'instagram-post' | 'instagram-story' | 'facebook' | 'twitter' | 'linkedin'>('instagram-post')
  const [text, setText] = useState('Your Message Here')
  const [subtext, setSubtext] = useState('')
  const [bgColor1, setBgColor1] = useState('#8B5CF6')
  const [bgColor2, setBgColor2] = useState('#EC4899')
  const [textColor, setTextColor] = useState('#ffffff')
  const [template, setTemplate] = useState<'quote' | 'announcement' | 'promo' | 'minimal'>('quote')

  const platforms = {
    'instagram-post': { width: 1080, height: 1080, name: 'Instagram Post' },
    'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story' },
    'facebook': { width: 1200, height: 630, name: 'Facebook' },
    'twitter': { width: 1200, height: 675, name: 'Twitter' },
    'linkedin': { width: 1200, height: 627, name: 'LinkedIn' },
  }

  useEffect(() => {
    drawImage()
  }, [platform, text, subtext, bgColor1, bgColor2, textColor, template])

  const drawImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = platforms[platform]
    const scale = 300 / Math.max(width, height)
    canvas.width = width * scale
    canvas.height = height * scale

    const w = canvas.width
    const h = canvas.height

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, bgColor1)
    gradient.addColorStop(1, bgColor2)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    // Template decorations
    ctx.strokeStyle = textColor
    ctx.globalAlpha = 0.3

    switch (template) {
      case 'quote':
        // Quote marks
        ctx.font = `bold ${w * 0.2}px Georgia`
        ctx.fillStyle = textColor
        ctx.fillText('"', w * 0.1, h * 0.25)
        ctx.fillText('"', w * 0.8, h * 0.85)
        break
      case 'announcement':
        // Border frame
        ctx.lineWidth = 4
        ctx.strokeRect(w * 0.05, h * 0.05, w * 0.9, h * 0.9)
        break
      case 'promo':
        // Star decorations
        for (let i = 0; i < 5; i++) {
          ctx.beginPath()
          ctx.arc(
            Math.random() * w,
            Math.random() * h,
            Math.random() * 10 + 5,
            0, Math.PI * 2
          )
          ctx.fillStyle = textColor
          ctx.fill()
        }
        break
      case 'minimal':
        // Just a subtle line
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(w * 0.3, h * 0.9)
        ctx.lineTo(w * 0.7, h * 0.9)
        ctx.stroke()
        break
    }

    ctx.globalAlpha = 1

    // Main text
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const fontSize = Math.min(w * 0.08, h * 0.08)
    ctx.font = `bold ${fontSize}px Arial`

    const lines = wrapText(ctx, text, w * 0.8)
    const lineHeight = fontSize * 1.3
    const startY = h / 2 - ((lines.length - 1) * lineHeight) / 2 - (subtext ? lineHeight * 0.5 : 0)

    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, startY + i * lineHeight)
    })

    // Subtext
    if (subtext) {
      ctx.font = `${fontSize * 0.5}px Arial`
      ctx.fillText(subtext, w / 2, startY + lines.length * lineHeight + 10)
    }
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

  const downloadImage = () => {
    const { width, height } = platforms[platform]
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Redraw at full resolution
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, bgColor1)
    gradient.addColorStop(1, bgColor2)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = textColor
    ctx.globalAlpha = 0.3

    switch (template) {
      case 'quote':
        ctx.font = `bold ${width * 0.2}px Georgia`
        ctx.fillStyle = textColor
        ctx.fillText('"', width * 0.1, height * 0.25)
        ctx.fillText('"', width * 0.8, height * 0.85)
        break
      case 'announcement':
        ctx.lineWidth = 8
        ctx.strokeRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9)
        break
      case 'promo':
        for (let i = 0; i < 10; i++) {
          ctx.beginPath()
          ctx.arc(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 20 + 10,
            0, Math.PI * 2
          )
          ctx.fillStyle = textColor
          ctx.fill()
        }
        break
      case 'minimal':
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(width * 0.3, height * 0.9)
        ctx.lineTo(width * 0.7, height * 0.9)
        ctx.stroke()
        break
    }

    ctx.globalAlpha = 1
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const fontSize = Math.min(width * 0.08, height * 0.08)
    ctx.font = `bold ${fontSize}px Arial`

    const lines = wrapText(ctx, text, width * 0.8)
    const lineHeight = fontSize * 1.3
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2 - (subtext ? lineHeight * 0.5 : 0)

    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight)
    })

    if (subtext) {
      ctx.font = `${fontSize * 0.5}px Arial`
      ctx.fillText(subtext, width / 2, startY + lines.length * lineHeight + 20)
    }

    const link = document.createElement('a')
    link.download = `social-${platform}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const templates = [
    { id: 'quote', name: 'Quote' },
    { id: 'announcement', name: 'Announce' },
    { id: 'promo', name: 'Promo' },
    { id: 'minimal', name: 'Minimal' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4">
          <canvas ref={canvasRef} className="border border-slate-200 rounded shadow-lg" />
        </div>
        <button
          onClick={downloadImage}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.socialMediaImageCreator.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.socialMediaImageCreator.platform')}</h3>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as any)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        >
          {Object.entries(platforms).map(([key, { name }]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.socialMediaImageCreator.template')}</h3>
        <div className="flex gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id as any)}
              className={`flex-1 py-2 rounded ${
                template === t.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.socialMediaImageCreator.text')}</h3>
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Main text"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <input
            type="text"
            value={subtext}
            onChange={(e) => setSubtext(e.target.value)}
            placeholder="Subtext (optional)"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.socialMediaImageCreator.colors')}</h3>
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
