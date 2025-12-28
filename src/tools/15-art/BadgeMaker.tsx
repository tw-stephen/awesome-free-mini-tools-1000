import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function BadgeMaker() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [text, setText] = useState('WINNER')
  const [subtext, setSubtext] = useState('2024')
  const [badgeStyle, setBadgeStyle] = useState<'circle' | 'ribbon' | 'star' | 'shield'>('circle')
  const [primaryColor, setPrimaryColor] = useState('#FFD700')
  const [secondaryColor, setSecondaryColor] = useState('#B8860B')
  const [textColor, setTextColor] = useState('#1F2937')

  useEffect(() => {
    drawBadge()
  }, [text, subtext, badgeStyle, primaryColor, secondaryColor, textColor])

  const drawBadge = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 200
    canvas.width = size
    canvas.height = size

    ctx.clearRect(0, 0, size, size)

    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 20

    ctx.fillStyle = primaryColor
    ctx.strokeStyle = secondaryColor
    ctx.lineWidth = 4

    switch (badgeStyle) {
      case 'circle':
        // Outer circle with decorative edge
        ctx.beginPath()
        for (let i = 0; i < 36; i++) {
          const angle = (Math.PI * 2 / 36) * i
          const r = i % 2 === 0 ? radius : radius - 10
          const x = centerX + Math.cos(angle) * r
          const y = centerY + Math.sin(angle) * r
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break

      case 'ribbon':
        // Main circle
        ctx.beginPath()
        ctx.arc(centerX, centerY - 10, radius - 20, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        // Ribbon tails
        ctx.fillStyle = secondaryColor
        ctx.beginPath()
        ctx.moveTo(centerX - 40, centerY + 40)
        ctx.lineTo(centerX - 60, centerY + 80)
        ctx.lineTo(centerX - 40, centerY + 65)
        ctx.lineTo(centerX - 20, centerY + 80)
        ctx.lineTo(centerX - 20, centerY + 40)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(centerX + 40, centerY + 40)
        ctx.lineTo(centerX + 60, centerY + 80)
        ctx.lineTo(centerX + 40, centerY + 65)
        ctx.lineTo(centerX + 20, centerY + 80)
        ctx.lineTo(centerX + 20, centerY + 40)
        ctx.closePath()
        ctx.fill()
        break

      case 'star':
        ctx.beginPath()
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? radius : radius * 0.5
          const angle = (Math.PI * 2 / 10) * i - Math.PI / 2
          const x = centerX + Math.cos(angle) * r
          const y = centerY + Math.sin(angle) * r
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break

      case 'shield':
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - radius)
        ctx.lineTo(centerX + radius, centerY - radius + 30)
        ctx.lineTo(centerX + radius, centerY + 20)
        ctx.quadraticCurveTo(centerX + radius, centerY + radius, centerX, centerY + radius)
        ctx.quadraticCurveTo(centerX - radius, centerY + radius, centerX - radius, centerY + 20)
        ctx.lineTo(centerX - radius, centerY - radius + 30)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break
    }

    // Text
    ctx.fillStyle = textColor
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, centerX, centerY - (subtext ? 10 : 0))

    if (subtext) {
      ctx.font = '16px Arial'
      ctx.fillText(subtext, centerX, centerY + 15)
    }
  }

  const downloadBadge = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `badge-${badgeStyle}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const styles = [
    { id: 'circle', name: 'Circle', icon: '⭕' },
    { id: 'ribbon', name: 'Ribbon', icon: '🎀' },
    { id: 'star', name: 'Star', icon: '⭐' },
    { id: 'shield', name: 'Shield', icon: '🛡️' },
  ]

  const presets = [
    { primary: '#FFD700', secondary: '#B8860B', text: '#1F2937', name: 'Gold' },
    { primary: '#C0C0C0', secondary: '#808080', text: '#1F2937', name: 'Silver' },
    { primary: '#CD7F32', secondary: '#8B4513', text: '#ffffff', name: 'Bronze' },
    { primary: '#3B82F6', secondary: '#1D4ED8', text: '#ffffff', name: 'Blue' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4 text-center">
        <canvas
          ref={canvasRef}
          className="mx-auto"
          style={{ background: 'repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 20px 20px' }}
        />
        <button
          onClick={downloadBadge}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.badgeMaker.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.badgeMaker.text')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
            placeholder="Main text"
          />
          <input
            type="text"
            value={subtext}
            onChange={(e) => setSubtext(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
            placeholder="Subtext (optional)"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.badgeMaker.style')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => setBadgeStyle(s.id as any)}
              className={`p-3 rounded-lg text-center ${
                badgeStyle === s.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-xl">{s.icon}</div>
              <div className="text-xs mt-1">{s.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.badgeMaker.presets')}</h3>
        <div className="flex gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setPrimaryColor(preset.primary)
                setSecondaryColor(preset.secondary)
                setTextColor(preset.text)
              }}
              className="flex-1 py-2 rounded text-white text-sm"
              style={{ backgroundColor: preset.primary }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.badgeMaker.colors')}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.badgeMaker.primary')}</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.badgeMaker.secondary')}</label>
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.badgeMaker.textColor')}</label>
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
