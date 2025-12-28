import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ReceiptItem {
  id: string
  name: string
  quantity: number
  price: number
}

export default function ReceiptMaker() {
  const { t } = useTranslation()
  const [receipt, setReceipt] = useState({
    storeName: '',
    storeAddress: '',
    storePhone: '',
    receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    items: [{ id: '1', name: '', quantity: 1, price: 0 }] as ReceiptItem[],
    paymentMethod: 'cash',
    amountPaid: 0,
    taxRate: 0,
    currency: 'USD'
  })

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'TWD', 'CNY']
  const paymentMethods = ['cash', 'credit', 'debit', 'other']

  const addItem = () => {
    setReceipt(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), name: '', quantity: 1, price: 0 }]
    }))
  }

  const updateItem = (id: string, field: keyof ReceiptItem, value: string | number) => {
    setReceipt(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeItem = (id: string) => {
    if (receipt.items.length > 1) {
      setReceipt(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }))
    }
  }

  const subtotal = receipt.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const tax = subtotal * (receipt.taxRate / 100)
  const total = subtotal + tax
  const change = receipt.amountPaid - total

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: receipt.currency
    }).format(amount)
  }

  const generateReceipt = () => {
    const receiptText = `
${'='.repeat(40)}
${receipt.storeName.toUpperCase().padStart(20 + receipt.storeName.length / 2)}
${receipt.storeAddress}
${receipt.storePhone}
${'='.repeat(40)}
Receipt #: ${receipt.receiptNumber}
Date: ${receipt.date} ${receipt.time}
${'-'.repeat(40)}
ITEMS
${'-'.repeat(40)}
${receipt.items.map(item =>
  `${item.name.padEnd(20)} ${item.quantity}x ${formatCurrency(item.price).padStart(8)} ${formatCurrency(item.quantity * item.price).padStart(10)}`
).join('\n')}
${'-'.repeat(40)}
Subtotal:${formatCurrency(subtotal).padStart(30)}
${receipt.taxRate > 0 ? `Tax (${receipt.taxRate}%):${formatCurrency(tax).padStart(27)}` : ''}
TOTAL:${formatCurrency(total).padStart(33)}
${'-'.repeat(40)}
Payment: ${receipt.paymentMethod.toUpperCase()}
Amount Paid:${formatCurrency(receipt.amountPaid).padStart(27)}
${change >= 0 ? `Change:${formatCurrency(change).padStart(32)}` : ''}
${'='.repeat(40)}
Thank you for your purchase!
${'='.repeat(40)}
`.trim()
    return receiptText
  }

  const copyReceipt = () => {
    navigator.clipboard.writeText(generateReceipt())
  }

  const printReceipt = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              width: 300px;
              margin: 0 auto;
              padding: 20px;
              font-size: 12px;
            }
            pre { white-space: pre-wrap; margin: 0; }
          </style>
        </head>
        <body>
          <pre>${generateReceipt()}</pre>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.receiptMaker.storeInfo')}</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={receipt.storeName}
            onChange={(e) => setReceipt({ ...receipt, storeName: e.target.value })}
            placeholder={t('tools.receiptMaker.storeName')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="text"
            value={receipt.storeAddress}
            onChange={(e) => setReceipt({ ...receipt, storeAddress: e.target.value })}
            placeholder={t('tools.receiptMaker.storeAddress')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="text"
            value={receipt.storePhone}
            onChange={(e) => setReceipt({ ...receipt, storePhone: e.target.value })}
            placeholder={t('tools.receiptMaker.storePhone')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.receiptMaker.receiptDetails')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={receipt.receiptNumber}
            onChange={(e) => setReceipt({ ...receipt, receiptNumber: e.target.value })}
            placeholder={t('tools.receiptMaker.receiptNumber')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={receipt.currency}
            onChange={(e) => setReceipt({ ...receipt, currency: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="date"
            value={receipt.date}
            onChange={(e) => setReceipt({ ...receipt, date: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="time"
            value={receipt.time}
            onChange={(e) => setReceipt({ ...receipt, time: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-slate-700">{t('tools.receiptMaker.items')}</h3>
          <button onClick={addItem} className="text-sm text-blue-500">
            + {t('tools.receiptMaker.addItem')}
          </button>
        </div>
        <div className="space-y-2">
          {receipt.items.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-center">
              <span className="text-xs text-slate-400 w-6">{index + 1}</span>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                placeholder={t('tools.receiptMaker.itemName')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                min="1"
                className="w-16 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="number"
                value={item.price}
                onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-24 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 px-2"
                disabled={receipt.items.length === 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.receiptMaker.payment')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{t('tools.receiptMaker.taxRate')}</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={receipt.taxRate}
                onChange={(e) => setReceipt({ ...receipt, taxRate: parseFloat(e.target.value) || 0 })}
                min="0"
                max="100"
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <span>%</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{t('tools.receiptMaker.paymentMethod')}</label>
            <select
              value={receipt.paymentMethod}
              onChange={(e) => setReceipt({ ...receipt, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {paymentMethods.map(m => (
                <option key={m} value={m}>{t(`tools.receiptMaker.${m}`)}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs text-slate-500 mb-1 block">{t('tools.receiptMaker.amountPaid')}</label>
            <input
              type="number"
              value={receipt.amountPaid}
              onChange={(e) => setReceipt({ ...receipt, amountPaid: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t('tools.receiptMaker.subtotal')}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {receipt.taxRate > 0 && (
            <div className="flex justify-between">
              <span>{t('tools.receiptMaker.tax')} ({receipt.taxRate}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>{t('tools.receiptMaker.total')}</span>
            <span>{formatCurrency(total)}</span>
          </div>
          {receipt.amountPaid > 0 && change >= 0 && (
            <div className="flex justify-between text-green-600">
              <span>{t('tools.receiptMaker.change')}</span>
              <span>{formatCurrency(change)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card p-4 bg-slate-900 text-white font-mono text-xs">
        <pre className="whitespace-pre-wrap overflow-x-auto">{generateReceipt()}</pre>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={copyReceipt}
          className="py-2 bg-slate-100 rounded font-medium"
        >
          {t('tools.receiptMaker.copy')}
        </button>
        <button
          onClick={printReceipt}
          className="py-2 bg-blue-500 text-white rounded font-medium"
        >
          {t('tools.receiptMaker.print')}
        </button>
      </div>
    </div>
  )
}
