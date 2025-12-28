import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function BusinessCardDesigner() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [name, setName] = useState('John Doe')
  const [title, setTitle] = useState('Software Engineer')
  const [company, setCompany] = useState('Tech Company')
  const [email, setEmail] = useState('john@example.com')
  const [phone, setPhone] = useState('+1 234 567 890')
  const [website, setWebsite] = useState('www.example.com')
  const [layout, setLayout] = useState<'classic' | 'modern' | 'minimal' | 'bold'>('classic')
  const [primaryColor, setPrimaryColor] = useState('#3B82F6')
  const [bgColor, setBgColor] = useState('#ffffff')

  useEffect(() => {
    drawCard()
  }, [name, title, company, email, phone, website, layout, primaryColor, bgColor])

  const drawCard = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Standard business card ratio (3.5 x 2 inches)
    const width = 420
    const height = 240
    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    switch (layout) {
      case 'classic':
        // Accent line
        ctx.fillStyle = primaryColor
        ctx.fillRect(0, 0, 8, height)

        // Name
        ctx.fillStyle = '#1F2937'
        ctx.font = 'bold 24px Arial'
        ctx.textAlign = 'left'
        ctx.fillText(name, 30, 50)

        // Title
        ctx.fillStyle = primaryColor
        ctx.font = '14px Arial'
        ctx.fillText(title, 30, 75)

        // Company
        ctx.fillStyle = '#666666'
        ctx.font = '12px Arial'
        ctx.fillText(company, 30, 95)

        // Contact info
        ctx.fillStyle = '#1F2937'
        ctx.font = '12px Arial'
        ctx.fillText(email, 30, 160)
        ctx.fillText(phone, 30, 180)
        ctx.fillText(website, 30, 200)
        break

      case 'modern':
        // Large accent shape
        ctx.fillStyle = primaryColor
        ctx.beginPath()
        ctx.moveTo(width - 100, 0)
        ctx.lineTo(width, 0)
        ctx.lineTo(width, height)
        ctx.lineTo(width - 150, height)
        ctx.closePath()
        ctx.fill()

        // Name
        ctx.fillStyle = '#1F2937'
        ctx.font = 'bold 26px Arial'
        ctx.textAlign = 'left'
        ctx.fillText(name, 30, 60)

        // Title & Company
        ctx.fillStyle = '#666666'
        ctx.font = '14px Arial'
        ctx.fillText(`${title} | ${company}`, 30, 90)

        // Contact with icons
        ctx.fillStyle = '#1F2937'
        ctx.font = '11px Arial'
        ctx.fillText(`📧 ${email}`, 30, 160)
        ctx.fillText(`📱 ${phone}`, 30, 180)
        ctx.fillText(`🌐 ${website}`, 30, 200)
        break

      case 'minimal':
        // Centered layout
        ctx.textAlign = 'center'

        // Name
        ctx.fillStyle = '#1F2937'
        ctx.font = 'bold 24px Arial'
        ctx.fillText(name, width / 2, 70)

        // Title
        ctx.fillStyle = primaryColor
        ctx.font = '14px Arial'
        ctx.fillText(title, width / 2, 95)

        // Line separator
        ctx.strokeStyle = '#e5e7eb'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(width / 4, 120)
        ctx.lineTo(width * 3 / 4, 120)
        ctx.stroke()

        // Contact
        ctx.fillStyle = '#666666'
        ctx.font = '11px Arial'
        ctx.fillText(`${email}  •  ${phone}`, width / 2, 160)
        ctx.fillText(website, width / 2, 185)
        break

      case 'bold':
        // Full color background
        ctx.fillStyle = primaryColor
        ctx.fillRect(0, 0, width, height)

        // Name
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 32px Arial'
        ctx.textAlign = 'left'
        ctx.fillText(name.toUpperCase(), 30, 60)

        // Title
        ctx.font = '16px Arial'
        ctx.fillText(title, 30, 90)

        // Company
        ctx.globalAlpha = 0.7
        ctx.fillText(company, 30, 115)
        ctx.globalAlpha = 1

        // Contact
        ctx.font = '12px Arial'
        ctx.fillText(email, 30, 175)
        ctx.fillText(phone, 30, 195)
        ctx.fillText(website, 30, 215)
        break
    }
  }

  const downloadCard = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'business-card.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const layouts = [
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'bold', name: 'Bold' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            className="border border-slate-200 rounded shadow-lg"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        <button
          onClick={downloadCard}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.businessCardDesigner.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.businessCardDesigner.info')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.businessCardDesigner.name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.businessCardDesigner.title')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.businessCardDesigner.company')}</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.businessCardDesigner.email')}</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.businessCardDesigner.phone')}</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.businessCardDesigner.website')}</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.businessCardDesigner.layout')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {layouts.map((l) => (
            <button
              key={l.id}
              onClick={() => setLayout(l.id as any)}
              className={`py-2 rounded ${
                layout === l.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.businessCardDesigner.colors')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.businessCardDesigner.accentColor')}</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.businessCardDesigner.bgColor')}</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
