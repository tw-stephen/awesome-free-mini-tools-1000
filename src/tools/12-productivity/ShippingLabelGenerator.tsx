import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ShippingInfo {
  fromName: string
  fromCompany: string
  fromAddress: string
  fromCity: string
  fromState: string
  fromZip: string
  fromCountry: string
  toName: string
  toCompany: string
  toAddress: string
  toCity: string
  toState: string
  toZip: string
  toCountry: string
  weight: string
  dimensions: string
  trackingNumber: string
  service: string
}

export default function ShippingLabelGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [labelSize, setLabelSize] = useState<'4x6' | '4x4' | 'letter'>('4x6')
  const [info, setInfo] = useState<ShippingInfo>({
    fromName: '',
    fromCompany: '',
    fromAddress: '',
    fromCity: '',
    fromState: '',
    fromZip: '',
    fromCountry: 'USA',
    toName: '',
    toCompany: '',
    toAddress: '',
    toCity: '',
    toState: '',
    toZip: '',
    toCountry: 'USA',
    weight: '',
    dimensions: '',
    trackingNumber: '',
    service: 'Standard'
  })

  const services = ['Standard', 'Express', 'Priority', 'Overnight', 'Ground']

  const drawLabel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const sizes = {
      '4x6': { width: 600, height: 400 },
      '4x4': { width: 400, height: 400 },
      'letter': { width: 600, height: 780 }
    }

    canvas.width = sizes[labelSize].width
    canvas.height = sizes[labelSize].height

    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Border
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10)

    // From section
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(15, 15, canvas.width / 2 - 25, 120)

    ctx.fillStyle = '#000000'
    ctx.font = 'bold 12px Arial'
    ctx.fillText('FROM:', 25, 35)

    ctx.font = '11px Arial'
    let y = 55
    if (info.fromName) { ctx.fillText(info.fromName, 25, y); y += 16 }
    if (info.fromCompany) { ctx.fillText(info.fromCompany, 25, y); y += 16 }
    if (info.fromAddress) { ctx.fillText(info.fromAddress, 25, y); y += 16 }
    const fromCityLine = [info.fromCity, info.fromState, info.fromZip].filter(Boolean).join(', ')
    if (fromCityLine) { ctx.fillText(fromCityLine, 25, y); y += 16 }
    if (info.fromCountry) ctx.fillText(info.fromCountry, 25, y)

    // To section
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 14px Arial'
    ctx.fillText('SHIP TO:', 25, 160)

    ctx.font = 'bold 16px Arial'
    y = 185
    if (info.toName) { ctx.fillText(info.toName.toUpperCase(), 25, y); y += 22 }
    if (info.toCompany) { ctx.fillText(info.toCompany.toUpperCase(), 25, y); y += 22 }

    ctx.font = '14px Arial'
    if (info.toAddress) { ctx.fillText(info.toAddress.toUpperCase(), 25, y); y += 20 }
    const toCityLine = [info.toCity, info.toState, info.toZip].filter(Boolean).join(', ')
    if (toCityLine) { ctx.fillText(toCityLine.toUpperCase(), 25, y); y += 20 }
    if (info.toCountry) ctx.fillText(info.toCountry.toUpperCase(), 25, y)

    // Service type
    ctx.fillStyle = '#000000'
    ctx.fillRect(canvas.width - 150, 15, 135, 30)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(info.service.toUpperCase(), canvas.width - 82, 35)
    ctx.textAlign = 'left'

    // Weight and dimensions
    ctx.fillStyle = '#000000'
    ctx.font = '11px Arial'
    if (info.weight) {
      ctx.fillText(`Weight: ${info.weight}`, canvas.width - 150, 65)
    }
    if (info.dimensions) {
      ctx.fillText(`Dims: ${info.dimensions}`, canvas.width - 150, 85)
    }

    // Tracking number barcode area
    if (info.trackingNumber) {
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(15, canvas.height - 80, canvas.width - 30, 65)

      ctx.fillStyle = '#000000'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('TRACKING NUMBER', canvas.width / 2, canvas.height - 60)

      // Simple barcode representation
      ctx.font = '10px monospace'
      for (let i = 0; i < info.trackingNumber.length * 2; i++) {
        const x = (canvas.width / 2) - (info.trackingNumber.length * 4) + (i * 4)
        const height = (i % 3 === 0) ? 25 : 20
        ctx.fillRect(x, canvas.height - 50, 2, height)
      }

      ctx.font = '14px monospace'
      ctx.fillText(info.trackingNumber, canvas.width / 2, canvas.height - 20)
      ctx.textAlign = 'left'
    }
  }

  useEffect(() => {
    drawLabel()
  }, [info, labelSize])

  const downloadLabel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `shipping-label-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const printLabel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shipping Label</title>
          <style>
            body { margin: 0; padding: 20px; }
            img { max-width: 100%; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <img src="${canvas.toDataURL('image/png')}" />
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const generateTrackingNumber = () => {
    const num = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('')
    setInfo({ ...info, trackingNumber: `1Z${num}` })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['4x6', '4x4', 'letter'] as const).map(size => (
          <button
            key={size}
            onClick={() => setLabelSize(size)}
            className={`flex-1 py-2 rounded text-sm ${
              labelSize === size ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.shippingLabelGenerator.from')}</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={info.fromName}
              onChange={(e) => setInfo({ ...info, fromName: e.target.value })}
              placeholder={t('tools.shippingLabelGenerator.name')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="text"
              value={info.fromCompany}
              onChange={(e) => setInfo({ ...info, fromCompany: e.target.value })}
              placeholder={t('tools.shippingLabelGenerator.company')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="text"
              value={info.fromAddress}
              onChange={(e) => setInfo({ ...info, fromAddress: e.target.value })}
              placeholder={t('tools.shippingLabelGenerator.address')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-3 gap-1">
              <input
                type="text"
                value={info.fromCity}
                onChange={(e) => setInfo({ ...info, fromCity: e.target.value })}
                placeholder={t('tools.shippingLabelGenerator.city')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={info.fromState}
                onChange={(e) => setInfo({ ...info, fromState: e.target.value })}
                placeholder={t('tools.shippingLabelGenerator.state')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={info.fromZip}
                onChange={(e) => setInfo({ ...info, fromZip: e.target.value })}
                placeholder={t('tools.shippingLabelGenerator.zip')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.shippingLabelGenerator.to')}</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={info.toName}
              onChange={(e) => setInfo({ ...info, toName: e.target.value })}
              placeholder={t('tools.shippingLabelGenerator.name')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="text"
              value={info.toCompany}
              onChange={(e) => setInfo({ ...info, toCompany: e.target.value })}
              placeholder={t('tools.shippingLabelGenerator.company')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="text"
              value={info.toAddress}
              onChange={(e) => setInfo({ ...info, toAddress: e.target.value })}
              placeholder={t('tools.shippingLabelGenerator.address')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-3 gap-1">
              <input
                type="text"
                value={info.toCity}
                onChange={(e) => setInfo({ ...info, toCity: e.target.value })}
                placeholder={t('tools.shippingLabelGenerator.city')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={info.toState}
                onChange={(e) => setInfo({ ...info, toState: e.target.value })}
                placeholder={t('tools.shippingLabelGenerator.state')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={info.toZip}
                onChange={(e) => setInfo({ ...info, toZip: e.target.value })}
                placeholder={t('tools.shippingLabelGenerator.zip')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-4 gap-2">
          <select
            value={info.service}
            onChange={(e) => setInfo({ ...info, service: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type="text"
            value={info.weight}
            onChange={(e) => setInfo({ ...info, weight: e.target.value })}
            placeholder={t('tools.shippingLabelGenerator.weight')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="text"
            value={info.dimensions}
            onChange={(e) => setInfo({ ...info, dimensions: e.target.value })}
            placeholder={t('tools.shippingLabelGenerator.dimensions')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <div className="flex gap-1">
            <input
              type="text"
              value={info.trackingNumber}
              onChange={(e) => setInfo({ ...info, trackingNumber: e.target.value })}
              placeholder={t('tools.shippingLabelGenerator.tracking')}
              className="flex-1 px-2 py-2 border border-slate-300 rounded text-sm"
            />
            <button
              onClick={generateTrackingNumber}
              className="px-2 py-2 bg-slate-100 rounded text-xs"
            >
              Gen
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.shippingLabelGenerator.preview')}</h3>
        <div className="flex justify-center bg-slate-100 p-4 rounded">
          <canvas ref={canvasRef} className="max-w-full shadow-lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={downloadLabel}
          className="py-2 bg-slate-100 rounded font-medium"
        >
          {t('tools.shippingLabelGenerator.download')}
        </button>
        <button
          onClick={printLabel}
          className="py-2 bg-blue-500 text-white rounded font-medium"
        >
          {t('tools.shippingLabelGenerator.print')}
        </button>
      </div>
    </div>
  )
}
