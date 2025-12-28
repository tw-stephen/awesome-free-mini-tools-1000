import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type CardStyle = 'classic' | 'modern' | 'minimal' | 'bold' | 'creative'

interface CardData {
  name: string
  title: string
  company: string
  email: string
  phone: string
  website: string
  address: string
  linkedin: string
  style: CardStyle
  primaryColor: string
  textColor: string
}

export default function BusinessCardGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [card, setCard] = useState<CardData>({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    linkedin: '',
    style: 'modern',
    primaryColor: '#1e40af',
    textColor: '#1e293b'
  })

  const styles: CardStyle[] = ['classic', 'modern', 'minimal', 'bold', 'creative']

  const drawCard = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Business card dimensions (3.5" x 2" at 150 DPI)
    canvas.width = 525
    canvas.height = 300

    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    switch (card.style) {
      case 'classic':
        // Classic border
        ctx.strokeStyle = card.primaryColor
        ctx.lineWidth = 4
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

        // Name
        ctx.fillStyle = card.textColor
        ctx.font = 'bold 28px Georgia'
        ctx.textAlign = 'center'
        ctx.fillText(card.name, canvas.width / 2, 80)

        // Title
        ctx.font = 'italic 16px Georgia'
        ctx.fillText(card.title, canvas.width / 2, 110)

        // Company
        ctx.font = '14px Georgia'
        ctx.fillStyle = card.primaryColor
        ctx.fillText(card.company, canvas.width / 2, 140)

        // Contact info
        ctx.font = '12px Georgia'
        ctx.fillStyle = card.textColor
        let y = 180
        if (card.email) { ctx.fillText(card.email, canvas.width / 2, y); y += 20 }
        if (card.phone) { ctx.fillText(card.phone, canvas.width / 2, y); y += 20 }
        if (card.website) { ctx.fillText(card.website, canvas.width / 2, y) }
        break

      case 'modern':
        // Side accent
        ctx.fillStyle = card.primaryColor
        ctx.fillRect(0, 0, 8, canvas.height)

        // Name
        ctx.fillStyle = card.textColor
        ctx.font = 'bold 26px Arial'
        ctx.textAlign = 'left'
        ctx.fillText(card.name, 30, 60)

        // Title & Company
        ctx.font = '14px Arial'
        ctx.fillStyle = '#64748b'
        ctx.fillText(`${card.title}${card.company ? ' • ' + card.company : ''}`, 30, 90)

        // Contact section
        ctx.fillStyle = card.textColor
        ctx.font = '12px Arial'
        let my = 140
        if (card.email) { ctx.fillText(`✉ ${card.email}`, 30, my); my += 25 }
        if (card.phone) { ctx.fillText(`☎ ${card.phone}`, 30, my); my += 25 }
        if (card.website) { ctx.fillText(`🌐 ${card.website}`, 30, my); my += 25 }
        if (card.linkedin) { ctx.fillText(`in ${card.linkedin}`, 30, my) }
        break

      case 'minimal':
        // Just text, centered
        ctx.fillStyle = card.textColor
        ctx.textAlign = 'center'

        ctx.font = 'bold 24px Helvetica'
        ctx.fillText(card.name, canvas.width / 2, 100)

        ctx.font = '14px Helvetica'
        ctx.fillStyle = '#94a3b8'
        ctx.fillText(card.title, canvas.width / 2, 130)

        ctx.font = '12px Helvetica'
        ctx.fillStyle = card.primaryColor
        const contact = [card.email, card.phone, card.website].filter(Boolean).join(' | ')
        ctx.fillText(contact, canvas.width / 2, 200)
        break

      case 'bold':
        // Full color background
        ctx.fillStyle = card.primaryColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // White text
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'left'

        ctx.font = 'bold 32px Impact'
        ctx.fillText(card.name.toUpperCase(), 30, 80)

        ctx.font = '16px Arial'
        ctx.fillText(card.title, 30, 115)
        ctx.fillText(card.company, 30, 140)

        ctx.font = '12px Arial'
        let by = 190
        if (card.email) { ctx.fillText(card.email, 30, by); by += 22 }
        if (card.phone) { ctx.fillText(card.phone, 30, by); by += 22 }
        if (card.website) { ctx.fillText(card.website, 30, by) }
        break

      case 'creative':
        // Diagonal design
        ctx.fillStyle = card.primaryColor
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(canvas.width, 0)
        ctx.lineTo(canvas.width, 120)
        ctx.lineTo(0, 180)
        ctx.closePath()
        ctx.fill()

        // Name on colored area
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 28px Arial'
        ctx.textAlign = 'left'
        ctx.fillText(card.name, 30, 60)

        ctx.font = '14px Arial'
        ctx.fillText(card.title, 30, 90)

        // Contact info below
        ctx.fillStyle = card.textColor
        ctx.font = '12px Arial'
        let cy = 220
        const contactItems = [card.email, card.phone, card.website, card.linkedin].filter(Boolean)
        contactItems.forEach(item => {
          ctx.fillText(item, 30, cy)
          cy += 20
        })
        break
    }
  }

  useEffect(() => {
    drawCard()
  }, [card])

  const downloadCard = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `business-card-${card.name || 'untitled'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.businessCardGenerator.personalInfo')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            placeholder={t('tools.businessCardGenerator.name')}
            className="col-span-2 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="text"
            value={card.title}
            onChange={(e) => setCard({ ...card, title: e.target.value })}
            placeholder={t('tools.businessCardGenerator.title')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="text"
            value={card.company}
            onChange={(e) => setCard({ ...card, company: e.target.value })}
            placeholder={t('tools.businessCardGenerator.company')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.businessCardGenerator.contactInfo')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="email"
            value={card.email}
            onChange={(e) => setCard({ ...card, email: e.target.value })}
            placeholder={t('tools.businessCardGenerator.email')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="tel"
            value={card.phone}
            onChange={(e) => setCard({ ...card, phone: e.target.value })}
            placeholder={t('tools.businessCardGenerator.phone')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="text"
            value={card.website}
            onChange={(e) => setCard({ ...card, website: e.target.value })}
            placeholder={t('tools.businessCardGenerator.website')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="text"
            value={card.linkedin}
            onChange={(e) => setCard({ ...card, linkedin: e.target.value })}
            placeholder={t('tools.businessCardGenerator.linkedin')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="text"
            value={card.address}
            onChange={(e) => setCard({ ...card, address: e.target.value })}
            placeholder={t('tools.businessCardGenerator.address')}
            className="col-span-2 px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.businessCardGenerator.style')}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {styles.map(style => (
            <button
              key={style}
              onClick={() => setCard({ ...card, style })}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                card.style === style ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.businessCardGenerator.${style}`)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              {t('tools.businessCardGenerator.primaryColor')}
            </label>
            <input
              type="color"
              value={card.primaryColor}
              onChange={(e) => setCard({ ...card, primaryColor: e.target.value })}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              {t('tools.businessCardGenerator.textColor')}
            </label>
            <input
              type="color"
              value={card.textColor}
              onChange={(e) => setCard({ ...card, textColor: e.target.value })}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.businessCardGenerator.preview')}</h3>
        <div className="flex justify-center bg-slate-100 p-4 rounded">
          <canvas
            ref={canvasRef}
            className="max-w-full shadow-lg rounded"
            style={{ maxHeight: '200px' }}
          />
        </div>
      </div>

      <button
        onClick={downloadCard}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        {t('tools.businessCardGenerator.download')}
      </button>
    </div>
  )
}
