import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LineItem {
  id: number
  description: string
  quantity: number
  rate: number
}

export default function InvoiceGenerator() {
  const { t } = useTranslation()
  const [invoice, setInvoice] = useState({
    number: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    from: { name: '', email: '', address: '' },
    to: { name: '', email: '', address: '' },
    notes: '',
    tax: 0,
  })
  const [items, setItems] = useState<LineItem[]>([{ id: 1, description: '', quantity: 1, rate: 0 }])

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, rate: 0 }])
  }

  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const taxAmount = subtotal * (invoice.tax / 100)
  const total = subtotal + taxAmount

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const generateInvoice = (): string => {
    let inv = `INVOICE\n${'='.repeat(60)}\n\n`
    inv += `Invoice Number: ${invoice.number}\n`
    inv += `Date: ${invoice.date}\n`
    inv += `Due Date: ${invoice.dueDate}\n\n`

    inv += `FROM:\n${invoice.from.name || '[Your Company]'}\n`
    if (invoice.from.email) inv += `${invoice.from.email}\n`
    if (invoice.from.address) inv += `${invoice.from.address}\n`
    inv += '\n'

    inv += `TO:\n${invoice.to.name || '[Client Name]'}\n`
    if (invoice.to.email) inv += `${invoice.to.email}\n`
    if (invoice.to.address) inv += `${invoice.to.address}\n`
    inv += '\n'

    inv += `${'─'.repeat(60)}\n`
    inv += `DESCRIPTION                          QTY    RATE       AMOUNT\n`
    inv += `${'─'.repeat(60)}\n`

    items.forEach(item => {
      const amount = item.quantity * item.rate
      const desc = (item.description || 'Item').padEnd(35).slice(0, 35)
      const qty = item.quantity.toString().padStart(5)
      const rate = formatCurrency(item.rate).padStart(10)
      const amt = formatCurrency(amount).padStart(12)
      inv += `${desc} ${qty} ${rate} ${amt}\n`
    })

    inv += `${'─'.repeat(60)}\n`
    inv += `${''.padStart(40)}Subtotal: ${formatCurrency(subtotal).padStart(15)}\n`
    if (invoice.tax > 0) {
      inv += `${''.padStart(40)}Tax (${invoice.tax}%): ${formatCurrency(taxAmount).padStart(12)}\n`
    }
    inv += `${''.padStart(40)}TOTAL: ${formatCurrency(total).padStart(17)}\n`

    if (invoice.notes) {
      inv += `\nNotes:\n${invoice.notes}\n`
    }

    return inv
  }

  const copyInvoice = () => {
    navigator.clipboard.writeText(generateInvoice())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.invoiceGenerator.details')}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-500">Invoice #</label>
            <input type="text" value={invoice.number} onChange={(e) => setInvoice({ ...invoice, number: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded" />
          </div>
          <div>
            <label className="text-sm text-slate-500">Date</label>
            <input type="date" value={invoice.date} onChange={(e) => setInvoice({ ...invoice, date: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded" />
          </div>
          <div>
            <label className="text-sm text-slate-500">Due Date</label>
            <input type="date" value={invoice.dueDate} onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.invoiceGenerator.from')}</h3>
          <div className="space-y-2">
            <input type="text" value={invoice.from.name} onChange={(e) => setInvoice({ ...invoice, from: { ...invoice.from, name: e.target.value } })} placeholder="Your name/company" className="w-full px-3 py-2 border border-slate-300 rounded" />
            <input type="email" value={invoice.from.email} onChange={(e) => setInvoice({ ...invoice, from: { ...invoice.from, email: e.target.value } })} placeholder="Your email" className="w-full px-3 py-2 border border-slate-300 rounded" />
            <input type="text" value={invoice.from.address} onChange={(e) => setInvoice({ ...invoice, from: { ...invoice.from, address: e.target.value } })} placeholder="Your address" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </div>
        </div>
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.invoiceGenerator.to')}</h3>
          <div className="space-y-2">
            <input type="text" value={invoice.to.name} onChange={(e) => setInvoice({ ...invoice, to: { ...invoice.to, name: e.target.value } })} placeholder="Client name" className="w-full px-3 py-2 border border-slate-300 rounded" />
            <input type="email" value={invoice.to.email} onChange={(e) => setInvoice({ ...invoice, to: { ...invoice.to, email: e.target.value } })} placeholder="Client email" className="w-full px-3 py-2 border border-slate-300 rounded" />
            <input type="text" value={invoice.to.address} onChange={(e) => setInvoice({ ...invoice, to: { ...invoice.to, address: e.target.value } })} placeholder="Client address" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.invoiceGenerator.items')}</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2">
              <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="Description" className="col-span-6 px-3 py-2 border border-slate-300 rounded" />
              <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} min="1" className="col-span-2 px-3 py-2 border border-slate-300 rounded" />
              <input type="number" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))} min="0" step="0.01" placeholder="Rate" className="col-span-2 px-3 py-2 border border-slate-300 rounded" />
              <div className="col-span-1 flex items-center justify-center font-medium">{formatCurrency(item.quantity * item.rate)}</div>
              <button onClick={() => removeItem(item.id)} disabled={items.length === 1} className="col-span-1 text-red-500 hover:text-red-600 disabled:text-slate-300">✕</button>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-3 text-blue-500 hover:text-blue-600 text-sm">+ Add Line Item</button>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500">Notes</label>
            <textarea value={invoice.notes} onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })} placeholder="Payment terms, thank you note..." rows={3} className="w-full px-3 py-2 border border-slate-300 rounded resize-none" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax (%):</span>
              <input type="number" value={invoice.tax} onChange={(e) => setInvoice({ ...invoice, tax: Number(e.target.value) })} min="0" max="100" className="w-20 px-2 py-1 border border-slate-300 rounded text-right" />
            </div>
            {invoice.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax Amount:</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-green-600">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={copyInvoice} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
        {t('tools.invoiceGenerator.copy')}
      </button>
    </div>
  )
}
