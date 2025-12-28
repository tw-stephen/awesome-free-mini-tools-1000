import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface InvoiceItem {
  id: number
  description: string
  quantity: number
  unitPrice: number
}

export default function InvoiceGenerator() {
  const { t } = useTranslation()
  const [businessName, setBusinessName] = useState('')
  const [clientName, setClientName] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [newItem, setNewItem] = useState({ description: '', quantity: '1', unitPrice: '' })
  const [taxRate, setTaxRate] = useState('0')

  const addItem = () => {
    const quantity = parseInt(newItem.quantity) || 1
    const unitPrice = parseFloat(newItem.unitPrice) || 0
    if (!newItem.description || unitPrice <= 0) return

    setItems([...items, {
      id: Date.now(),
      description: newItem.description,
      quantity,
      unitPrice,
    }])
    setNewItem({ description: '', quantity: '1', unitPrice: '' })
  }

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id))
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const tax = subtotal * (parseFloat(taxRate) / 100)
    const total = subtotal + tax
    return { subtotal, tax, total }
  }, [items, taxRate])

  const generateInvoice = () => {
    const invoiceContent = `
INVOICE
=====================================
Invoice #: ${invoiceNumber}
Date: ${new Date().toLocaleDateString()}

From: ${businessName || 'Your Business'}
To: ${clientName || 'Client Name'}

-------------------------------------
ITEMS
-------------------------------------
${items.map(item =>
  `${item.description}
   ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${(item.quantity * item.unitPrice).toFixed(2)}`
).join('\n\n')}

-------------------------------------
Subtotal: $${totals.subtotal.toFixed(2)}
Tax (${taxRate}%): $${totals.tax.toFixed(2)}
-------------------------------------
TOTAL: $${totals.total.toFixed(2)}
=====================================
    `.trim()

    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${invoiceNumber}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.invoiceGenerator.businessName')}
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your Business"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.invoiceGenerator.invoiceNumber')}
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.invoiceGenerator.clientName')}
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Client Name"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.invoiceGenerator.items')}
        </h3>

        <div className="space-y-2 mb-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <div>
                <div className="text-sm font-medium">{item.description}</div>
                <div className="text-xs text-slate-500">
                  {item.quantity} × ${item.unitPrice.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            placeholder={t('tools.invoiceGenerator.itemDescription')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="number"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            placeholder="Qty"
            className="w-16 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="number"
            value={newItem.unitPrice}
            onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
            placeholder="Price"
            className="w-24 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.invoiceGenerator.taxRate')}
          </label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="w-20 px-3 py-1 border border-slate-300 rounded text-sm"
          />
          <span className="text-sm text-slate-500">%</span>
        </div>

        <div className="space-y-2 text-sm border-t pt-3">
          <div className="flex justify-between">
            <span>{t('tools.invoiceGenerator.subtotal')}</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('tools.invoiceGenerator.tax')}</span>
            <span>${totals.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>{t('tools.invoiceGenerator.total')}</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={generateInvoice}
        disabled={items.length === 0}
        className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('tools.invoiceGenerator.generate')}
      </button>
    </div>
  )
}
