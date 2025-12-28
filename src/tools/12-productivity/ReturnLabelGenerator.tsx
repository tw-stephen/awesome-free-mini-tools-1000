import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ReturnInfo {
  returnNumber: string
  originalOrderNumber: string
  customerName: string
  customerAddress: string
  customerCity: string
  customerState: string
  customerZip: string
  merchantName: string
  merchantAddress: string
  merchantCity: string
  merchantState: string
  merchantZip: string
  returnReason: string
  items: string
  instructions: string
}

export default function ReturnLabelGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [info, setInfo] = useState<ReturnInfo>({
    returnNumber: '',
    originalOrderNumber: '',
    customerName: '',
    customerAddress: '',
    customerCity: '',
    customerState: '',
    customerZip: '',
    merchantName: '',
    merchantAddress: '',
    merchantCity: '',
    merchantState: '',
    merchantZip: '',
    returnReason: 'wrong_size',
    items: '',
    instructions: ''
  })

  const returnReasons = [
    'wrong_size',
    'damaged',
    'wrong_item',
    'changed_mind',
    'defective',
    'not_as_described',
    'other'
  ]

  const generateReturnNumber = () => {
    const num = `RET-${Date.now().toString().slice(-10)}`
    setInfo({ ...info, returnNumber: num })
  }

  const drawLabel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 600
    canvas.height = 450

    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Border
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10)

    // Return label header
    ctx.fillStyle = '#dc2626'
    ctx.fillRect(15, 15, canvas.width - 30, 40)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('RETURN LABEL', canvas.width / 2, 42)

    // Return number
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(`Return #: ${info.returnNumber || '[RETURN NUMBER]'}`, 20, 75)
    ctx.textAlign = 'right'
    ctx.fillText(`Order #: ${info.originalOrderNumber || '[ORDER NUMBER]'}`, canvas.width - 20, 75)
    ctx.textAlign = 'left'

    // From section (Customer)
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(15, 90, canvas.width / 2 - 25, 110)

    ctx.fillStyle = '#000000'
    ctx.font = 'bold 11px Arial'
    ctx.fillText('FROM (Customer):', 25, 108)

    ctx.font = '11px Arial'
    let y = 125
    if (info.customerName) { ctx.fillText(info.customerName, 25, y); y += 16 }
    if (info.customerAddress) { ctx.fillText(info.customerAddress, 25, y); y += 16 }
    const customerCity = [info.customerCity, info.customerState, info.customerZip].filter(Boolean).join(', ')
    if (customerCity) { ctx.fillText(customerCity, 25, y) }

    // To section (Merchant)
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 12px Arial'
    ctx.fillText('RETURN TO:', 25, 220)

    ctx.font = 'bold 14px Arial'
    y = 240
    if (info.merchantName) { ctx.fillText(info.merchantName.toUpperCase(), 25, y); y += 20 }

    ctx.font = '12px Arial'
    if (info.merchantAddress) { ctx.fillText(info.merchantAddress.toUpperCase(), 25, y); y += 18 }
    const merchantCity = [info.merchantCity, info.merchantState, info.merchantZip].filter(Boolean).join(', ')
    if (merchantCity) { ctx.fillText(merchantCity.toUpperCase(), 25, y) }

    // Return reason
    ctx.fillStyle = '#fef3c7'
    ctx.fillRect(canvas.width / 2 + 10, 90, canvas.width / 2 - 25, 60)
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 11px Arial'
    ctx.fillText('REASON FOR RETURN:', canvas.width / 2 + 20, 108)
    ctx.font = '12px Arial'
    ctx.fillText(info.returnReason.replace(/_/g, ' ').toUpperCase(), canvas.width / 2 + 20, 130)

    // Items
    if (info.items) {
      ctx.font = 'bold 11px Arial'
      ctx.fillText('ITEMS:', canvas.width / 2 + 20, 170)
      ctx.font = '10px Arial'
      const itemLines = info.items.split('\n').slice(0, 3)
      itemLines.forEach((line, i) => {
        ctx.fillText(line.slice(0, 30), canvas.width / 2 + 20, 188 + i * 14)
      })
    }

    // Barcode area
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(15, canvas.height - 100, canvas.width - 30, 85)

    if (info.returnNumber) {
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('SCAN FOR RETURN PROCESSING', canvas.width / 2, canvas.height - 80)

      // Barcode lines
      for (let i = 0; i < info.returnNumber.length * 2; i++) {
        const x = (canvas.width / 2) - (info.returnNumber.length * 5) + (i * 5)
        const height = (i % 3 === 0) ? 30 : 25
        ctx.fillRect(x, canvas.height - 70, 3, height)
      }

      ctx.font = '14px monospace'
      ctx.fillText(info.returnNumber, canvas.width / 2, canvas.height - 25)
      ctx.textAlign = 'left'
    }

    // Instructions
    if (info.instructions) {
      ctx.font = '9px Arial'
      ctx.fillStyle = '#666666'
      ctx.fillText(`Note: ${info.instructions.slice(0, 60)}`, 20, canvas.height - 108)
    }
  }

  useEffect(() => {
    drawLabel()
  }, [info])

  const downloadLabel = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `return-label-${info.returnNumber || 'draft'}.png`
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
          <title>Return Label</title>
          <style>
            body { margin: 0; padding: 20px; }
            img { max-width: 100%; }
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.returnLabelGenerator.customerInfo')}</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={info.customerName}
              onChange={(e) => setInfo({ ...info, customerName: e.target.value })}
              placeholder={t('tools.returnLabelGenerator.name')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="text"
              value={info.customerAddress}
              onChange={(e) => setInfo({ ...info, customerAddress: e.target.value })}
              placeholder={t('tools.returnLabelGenerator.address')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-3 gap-1">
              <input
                type="text"
                value={info.customerCity}
                onChange={(e) => setInfo({ ...info, customerCity: e.target.value })}
                placeholder={t('tools.returnLabelGenerator.city')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={info.customerState}
                onChange={(e) => setInfo({ ...info, customerState: e.target.value })}
                placeholder={t('tools.returnLabelGenerator.state')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={info.customerZip}
                onChange={(e) => setInfo({ ...info, customerZip: e.target.value })}
                placeholder={t('tools.returnLabelGenerator.zip')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.returnLabelGenerator.merchantInfo')}</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={info.merchantName}
              onChange={(e) => setInfo({ ...info, merchantName: e.target.value })}
              placeholder={t('tools.returnLabelGenerator.merchantName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="text"
              value={info.merchantAddress}
              onChange={(e) => setInfo({ ...info, merchantAddress: e.target.value })}
              placeholder={t('tools.returnLabelGenerator.address')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-3 gap-1">
              <input
                type="text"
                value={info.merchantCity}
                onChange={(e) => setInfo({ ...info, merchantCity: e.target.value })}
                placeholder={t('tools.returnLabelGenerator.city')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={info.merchantState}
                onChange={(e) => setInfo({ ...info, merchantState: e.target.value })}
                placeholder={t('tools.returnLabelGenerator.state')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={info.merchantZip}
                onChange={(e) => setInfo({ ...info, merchantZip: e.target.value })}
                placeholder={t('tools.returnLabelGenerator.zip')}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex gap-1">
            <input
              type="text"
              value={info.returnNumber}
              onChange={(e) => setInfo({ ...info, returnNumber: e.target.value })}
              placeholder={t('tools.returnLabelGenerator.returnNumber')}
              className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <button
              onClick={generateReturnNumber}
              className="px-2 py-2 bg-slate-100 rounded text-xs"
            >
              Gen
            </button>
          </div>
          <input
            type="text"
            value={info.originalOrderNumber}
            onChange={(e) => setInfo({ ...info, originalOrderNumber: e.target.value })}
            placeholder={t('tools.returnLabelGenerator.orderNumber')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={info.returnReason}
            onChange={(e) => setInfo({ ...info, returnReason: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {returnReasons.map(r => (
              <option key={r} value={r}>{t(`tools.returnLabelGenerator.${r}`)}</option>
            ))}
          </select>
        </div>
        <textarea
          value={info.items}
          onChange={(e) => setInfo({ ...info, items: e.target.value })}
          placeholder={t('tools.returnLabelGenerator.itemsToReturn')}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
        />
        <input
          type="text"
          value={info.instructions}
          onChange={(e) => setInfo({ ...info, instructions: e.target.value })}
          placeholder={t('tools.returnLabelGenerator.specialInstructions')}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.returnLabelGenerator.preview')}</h3>
        <div className="flex justify-center bg-slate-100 p-4 rounded">
          <canvas ref={canvasRef} className="max-w-full shadow-lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={downloadLabel} className="py-2 bg-slate-100 rounded font-medium">
          {t('tools.returnLabelGenerator.download')}
        </button>
        <button onClick={printLabel} className="py-2 bg-blue-500 text-white rounded font-medium">
          {t('tools.returnLabelGenerator.print')}
        </button>
      </div>
    </div>
  )
}
