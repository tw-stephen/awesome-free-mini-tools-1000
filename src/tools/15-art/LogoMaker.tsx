import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function LogoMaker() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [text, setText] = useState('LOGO')
  const [tagline, setTagline] = useState('')
  const [bgColor, setBgColor] = useState('#3B82F6')
  const [textColor, setTextColor] = useState('#ffffff')
  const [fontStyle, setFontStyle] = useState<'bold' | 'italic' | 'normal'>('bold')
  const [layout, setLayout] = useState<'centered' | 'left' | 'stacked'>('centered')
  const [iconType, setIconType] = useState<'none' | 'circle' | 'square' | 'diamond'>('none')

  useEffect(() => {
    drawLogo()
  }, [text, tagline, bgColor, textColor, fontStyle, layout, iconType])

  const drawLogo = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear
    ctx.clearRect(0, 0, width, height)

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    // Draw icon
    ctx.fillStyle = textColor
    if (iconType !== 'none') {
      const iconSize = 40
      const iconX = layout === 'left' ? 30 : width / 2
      const iconY = layout === 'stacked' ? 50 : height / 2 - 30

      ctx.save()
      ctx.translate(iconX, iconY)

      if (iconType === 'circle') {
        ctx.beginPath()
        ctx.arc(0, 0, iconSize / 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (iconType === 'square') {
        ctx.fillRect(-iconSize / 2, -iconSize / 2, iconSize, iconSize)
      } else if (iconType === 'diamond') {
        ctx.rotate(Math.PI / 4)
        ctx.fillRect(-iconSize / 2.5, -iconSize / 2.5, iconSize / 1.25, iconSize / 1.25)
      }
      ctx.restore()
    }

    // Draw text
    const fontWeight = fontStyle === 'bold' ? 'bold' : fontStyle === 'italic' ? 'italic' : 'normal'
    ctx.fillStyle = textColor
    ctx.font = `${fontWeight} 36px Arial`
    ctx.textAlign = layout === 'left' ? 'left' : 'center'
    ctx.textBaseline = 'middle'

    let textX = layout === 'left' ? (iconType !== 'none' ? 80 : 30) : width / 2
    let textY = layout === 'stacked' ? (iconType !== 'none' ? height / 2 + 20 : height / 2) : height / 2

    ctx.fillText(text, textX, textY)

    // Draw tagline
    if (tagline) {
      ctx.font = '14px Arial'
      ctx.fillText(tagline, textX, textY + 30)
    }
  }

  const downloadLogo = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'logo.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const layouts = [
    { id: 'centered', label: 'Centered' },
    { id: 'left', label: 'Left' },
    { id: 'stacked', label: 'Stacked' },
  ]

  const icons = [
    { id: 'none', label: 'None' },
    { id: 'circle', label: '●' },
    { id: 'square', label: '■' },
    { id: 'diamond', label: '◆' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={300}
            height={200}
            className="border border-slate-200 rounded-lg"
          />
        </div>
        <button
          onClick={downloadLogo}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.logoMaker.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.logoMaker.text')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Logo text"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Tagline (optional)"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.logoMaker.colors')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.logoMaker.bgColor')}</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.logoMaker.textColor')}</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.logoMaker.style')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.logoMaker.fontStyle')}</label>
            <div className="flex gap-2">
              {(['normal', 'bold', 'italic'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setFontStyle(style)}
                  className={`flex-1 py-2 rounded ${
                    fontStyle === style ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.logoMaker.layout')}</label>
            <div className="flex gap-2">
              {layouts.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLayout(l.id as any)}
                  className={`flex-1 py-2 rounded ${
                    layout === l.id ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.logoMaker.icon')}</label>
            <div className="flex gap-2">
              {icons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => setIconType(icon.id as any)}
                  className={`flex-1 py-2 rounded ${
                    iconType === icon.id ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {icon.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
