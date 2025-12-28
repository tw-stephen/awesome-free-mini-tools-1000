import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  fromName: string
  fromAddress: string
  fromEmail: string
  toName: string
  toAddress: string
  toEmail: string
  items: InvoiceItem[]
  notes: string
  taxRate: number
  currency: string
}

export default function InvoiceGenerator() {
  const { t } = useTranslation()
  const printRef = useRef<HTMLDivElement>(null)
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fromName: '',
    fromAddress: '',
    fromEmail: '',
    toName: '',
    toAddress: '',
    toEmail: '',
    items: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }],
    notes: '',
    taxRate: 0,
    currency: 'USD'
  })

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'TWD', 'CNY', 'CAD', 'AUD']

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]
    }))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeItem = (id: string) => {
    if (invoice.items.length > 1) {
      setInvoice(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }))
    }
  }

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = subtotal * (invoice.taxRate / 100)
  const total = subtotal + tax

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.currency
    }).format(amount)
  }

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .title { font-size: 32px; font-weight: bold; color: #1e40af; }
            .info-block { margin-bottom: 20px; }
            .info-block h3 { margin: 0 0 8px 0; font-size: 14px; color: #64748b; }
            .info-block p { margin: 0; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f1f5f9; padding: 12px; text-align: left; font-size: 12px; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            .totals { text-align: right; margin-top: 20px; }
            .totals div { margin: 8px 0; }
            .total-line { font-size: 20px; font-weight: bold; color: #1e40af; }
            .notes { margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 8px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">INVOICE</div>
            <div style="text-align: right;">
              <div style="font-weight: bold;">${invoice.invoiceNumber}</div>
              <div>Date: ${invoice.date}</div>
              <div>Due: ${invoice.dueDate}</div>
            </div>
          </div>
          <div style="display: flex; gap: 40px; margin-bottom: 30px;">
            <div class="info-block" style="flex: 1;">
              <h3>FROM</h3>
              <p><strong>${invoice.fromName}</strong></p>
              <p>${invoice.fromAddress.replace(/\n/g, '<br>')}</p>
              <p>${invoice.fromEmail}</p>
            </div>
            <div class="info-block" style="flex: 1;">
              <h3>TO</h3>
              <p><strong>${invoice.toName}</strong></p>
              <p>${invoice.toAddress.replace(/\n/g, '<br>')}</p>
              <p>${invoice.toEmail}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.unitPrice)}</td>
                  <td>${formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div>Subtotal: ${formatCurrency(subtotal)}</div>
            ${invoice.taxRate > 0 ? `<div>Tax (${invoice.taxRate}%): ${formatCurrency(tax)}</div>` : ''}
            <div class="total-line">Total: ${formatCurrency(total)}</div>
          </div>
          ${invoice.notes ? `<div class="notes"><strong>Notes:</strong><br>${invoice.notes}</div>` : ''}
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
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.invoiceGenerator.invoiceDetails')}</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
              placeholder={t('tools.invoiceGenerator.invoiceNumber')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={invoice.date}
                onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <select
              value={invoice.currency}
              onChange={(e) => setInvoice({ ...invoice, currency: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.invoiceGenerator.taxSettings')}</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={invoice.taxRate}
              onChange={(e) => setInvoice({ ...invoice, taxRate: parseFloat(e.target.value) || 0 })}
              min="0"
              max="100"
              className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <span className="text-slate-500">%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.invoiceGenerator.from')}</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={invoice.fromName}
              onChange={(e) => setInvoice({ ...invoice, fromName: e.target.value })}
              placeholder={t('tools.invoiceGenerator.businessName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <textarea
              value={invoice.fromAddress}
              onChange={(e) => setInvoice({ ...invoice, fromAddress: e.target.value })}
              placeholder={t('tools.invoiceGenerator.address')}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
            />
            <input
              type="email"
              value={invoice.fromEmail}
              onChange={(e) => setInvoice({ ...invoice, fromEmail: e.target.value })}
              placeholder={t('tools.invoiceGenerator.email')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.invoiceGenerator.to')}</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={invoice.toName}
              onChange={(e) => setInvoice({ ...invoice, toName: e.target.value })}
              placeholder={t('tools.invoiceGenerator.clientName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <textarea
              value={invoice.toAddress}
              onChange={(e) => setInvoice({ ...invoice, toAddress: e.target.value })}
              placeholder={t('tools.invoiceGenerator.address')}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
            />
            <input
              type="email"
              value={invoice.toEmail}
              onChange={(e) => setInvoice({ ...invoice, toEmail: e.target.value })}
              placeholder={t('tools.invoiceGenerator.email')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-slate-700">{t('tools.invoiceGenerator.items')}</h3>
          <button onClick={addItem} className="text-sm text-blue-500">
            + {t('tools.invoiceGenerator.addItem')}
          </button>
        </div>
        <div className="space-y-2">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-center">
              <span className="text-xs text-slate-400 w-6">{index + 1}</span>
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                placeholder={t('tools.invoiceGenerator.description')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                min="1"
                className="w-20 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-28 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <span className="w-24 text-right text-sm font-medium">
                {formatCurrency(item.quantity * item.unitPrice)}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 px-2"
                disabled={invoice.items.length === 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <textarea
          value={invoice.notes}
          onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
          placeholder={t('tools.invoiceGenerator.notes')}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
        />
      </div>

      <div className="card p-4 bg-slate-50">
        <div className="space-y-2 text-right">
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.invoiceGenerator.subtotal')}</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600">{t('tools.invoiceGenerator.tax')} ({invoice.taxRate}%)</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>{t('tools.invoiceGenerator.total')}</span>
            <span className="text-blue-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        {t('tools.invoiceGenerator.printInvoice')}
      </button>

      <div ref={printRef} className="hidden" />
    </div>
  )
}
