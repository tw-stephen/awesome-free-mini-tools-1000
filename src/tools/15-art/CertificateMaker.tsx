import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function CertificateMaker() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [recipientName, setRecipientName] = useState('John Doe')
  const [title, setTitle] = useState('Certificate of Achievement')
  const [description, setDescription] = useState('for outstanding performance')
  const [date, setDate] = useState(new Date().toLocaleDateString())
  const [organization, setOrganization] = useState('Your Organization')
  const [borderColor, setBorderColor] = useState('#B8860B')
  const [accentColor, setAccentColor] = useState('#1F2937')

  useEffect(() => {
    drawCertificate()
  }, [recipientName, title, description, date, organization, borderColor, accentColor])

  const drawCertificate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 600
    const height = 400
    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = '#FFFEF7'
    ctx.fillRect(0, 0, width, height)

    // Decorative border
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 8
    ctx.strokeRect(15, 15, width - 30, height - 30)
    ctx.lineWidth = 2
    ctx.strokeRect(25, 25, width - 50, height - 50)

    // Corner decorations
    const corners = [
      [30, 30],
      [width - 30, 30],
      [30, height - 30],
      [width - 30, height - 30]
    ]
    ctx.fillStyle = borderColor
    corners.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
    })

    // Title
    ctx.fillStyle = accentColor
    ctx.font = 'bold 28px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText(title, width / 2, 80)

    // Decorative line
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(150, 100)
    ctx.lineTo(width - 150, 100)
    ctx.stroke()

    // "This is to certify that"
    ctx.fillStyle = '#666666'
    ctx.font = '16px Georgia, serif'
    ctx.fillText('This is to certify that', width / 2, 140)

    // Recipient name
    ctx.fillStyle = accentColor
    ctx.font = 'italic bold 36px Georgia, serif'
    ctx.fillText(recipientName, width / 2, 185)

    // Description
    ctx.fillStyle = '#666666'
    ctx.font = '16px Georgia, serif'
    ctx.fillText(description, width / 2, 225)

    // Decorative separator
    ctx.strokeStyle = borderColor
    ctx.beginPath()
    ctx.moveTo(200, 255)
    ctx.lineTo(width - 200, 255)
    ctx.stroke()

    // Date and signature area
    ctx.fillStyle = '#666666'
    ctx.font = '14px Georgia, serif'
    ctx.textAlign = 'left'
    ctx.fillText('Date:', 80, 310)
    ctx.fillText(date, 80, 330)

    ctx.textAlign = 'right'
    ctx.fillText('Signature:', width - 80, 310)

    // Signature line
    ctx.strokeStyle = '#cccccc'
    ctx.beginPath()
    ctx.moveTo(width - 180, 340)
    ctx.lineTo(width - 50, 340)
    ctx.stroke()

    // Organization
    ctx.fillStyle = accentColor
    ctx.font = '14px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText(organization, width / 2, 375)
  }

  const downloadCertificate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'certificate.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const templates = [
    { name: 'Classic', border: '#B8860B', accent: '#1F2937' },
    { name: 'Modern', border: '#3B82F6', accent: '#1F2937' },
    { name: 'Elegant', border: '#7C3AED', accent: '#4C1D95' },
    { name: 'Nature', border: '#059669', accent: '#065F46' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="overflow-x-auto mb-4">
          <canvas
            ref={canvasRef}
            className="border border-slate-200 mx-auto block"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        <button
          onClick={downloadCertificate}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.certificateMaker.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.certificateMaker.content')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.certificateMaker.title')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.certificateMaker.recipient')}</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.certificateMaker.description')}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-500 block mb-1">{t('tools.certificateMaker.date')}</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">{t('tools.certificateMaker.organization')}</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.certificateMaker.templates')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {templates.map((temp) => (
            <button
              key={temp.name}
              onClick={() => {
                setBorderColor(temp.border)
                setAccentColor(temp.accent)
              }}
              className="py-2 rounded text-white text-sm"
              style={{ backgroundColor: temp.border }}
            >
              {temp.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.certificateMaker.colors')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.certificateMaker.borderColor')}</label>
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.certificateMaker.accentColor')}</label>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
