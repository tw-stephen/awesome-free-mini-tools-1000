import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface OrderItem {
  id: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
}

interface OrderForm {
  id: string
  orderNumber: string
  date: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  billingAddress: string
  items: OrderItem[]
  shippingMethod: string
  shippingCost: number
  notes: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
}

export default function OrderFormCreator() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<OrderForm[]>([])
  const [currentOrder, setCurrentOrder] = useState<OrderForm | null>(null)
  const [copied, setCopied] = useState(false)

  const shippingMethods = ['Standard', 'Express', 'Overnight', 'Pickup']

  useEffect(() => {
    const saved = localStorage.getItem('order-forms')
    if (saved) setOrders(JSON.parse(saved))
  }, [])

  const saveOrders = (updated: OrderForm[]) => {
    setOrders(updated)
    localStorage.setItem('order-forms', JSON.stringify(updated))
  }

  const createOrder = () => {
    const orderNum = `ORD-${Date.now().toString().slice(-8)}`
    const order: OrderForm = {
      id: Date.now().toString(),
      orderNumber: orderNum,
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
      billingAddress: '',
      items: [],
      shippingMethod: 'Standard',
      shippingCost: 0,
      notes: '',
      status: 'pending'
    }
    setCurrentOrder(order)
  }

  const saveOrder = () => {
    if (!currentOrder) return
    const exists = orders.find(o => o.id === currentOrder.id)
    if (exists) {
      saveOrders(orders.map(o => o.id === currentOrder.id ? currentOrder : o))
    } else {
      saveOrders([currentOrder, ...orders])
    }
  }

  const deleteOrder = (id: string) => {
    saveOrders(orders.filter(o => o.id !== id))
    if (currentOrder?.id === id) setCurrentOrder(null)
  }

  const addItem = () => {
    if (!currentOrder) return
    const item: OrderItem = {
      id: Date.now().toString(),
      productName: '',
      sku: '',
      quantity: 1,
      unitPrice: 0
    }
    setCurrentOrder({ ...currentOrder, items: [...currentOrder.items, item] })
  }

  const updateItem = (itemId: string, updates: Partial<OrderItem>) => {
    if (!currentOrder) return
    setCurrentOrder({
      ...currentOrder,
      items: currentOrder.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
    })
  }

  const removeItem = (itemId: string) => {
    if (!currentOrder) return
    setCurrentOrder({
      ...currentOrder,
      items: currentOrder.items.filter(i => i.id !== itemId)
    })
  }

  const subtotal = currentOrder?.items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0) || 0
  const total = subtotal + (currentOrder?.shippingCost || 0)

  const generateText = () => {
    if (!currentOrder) return ''
    let text = `ORDER FORM\n${'='.repeat(50)}\n\n`
    text += `Order Number: ${currentOrder.orderNumber}\n`
    text += `Date: ${currentOrder.date}\n`
    text += `Status: ${currentOrder.status.toUpperCase()}\n\n`
    text += `CUSTOMER INFORMATION\n${'-'.repeat(30)}\n`
    text += `Name: ${currentOrder.customerName}\n`
    text += `Email: ${currentOrder.customerEmail}\n`
    text += `Phone: ${currentOrder.customerPhone}\n\n`
    text += `SHIPPING ADDRESS\n${'-'.repeat(30)}\n`
    text += `${currentOrder.shippingAddress}\n\n`
    text += `ORDER ITEMS\n${'-'.repeat(30)}\n`
    currentOrder.items.forEach((item, i) => {
      text += `${i + 1}. ${item.productName} (SKU: ${item.sku})\n`
      text += `   Qty: ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${(item.quantity * item.unitPrice).toFixed(2)}\n`
    })
    text += `\n${'-'.repeat(30)}\n`
    text += `Subtotal: $${subtotal.toFixed(2)}\n`
    text += `Shipping (${currentOrder.shippingMethod}): $${currentOrder.shippingCost.toFixed(2)}\n`
    text += `TOTAL: $${total.toFixed(2)}\n`
    if (currentOrder.notes) {
      text += `\nNotes: ${currentOrder.notes}\n`
    }
    return text
  }

  const copyOrder = () => {
    navigator.clipboard.writeText(generateText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const printOrder = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order ${currentOrder?.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            pre { white-space: pre-wrap; font-family: monospace; }
          </style>
        </head>
        <body><pre>${generateText()}</pre></body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700'
  }

  return (
    <div className="space-y-4">
      {!currentOrder ? (
        <>
          <button
            onClick={createOrder}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.orderFormCreator.createOrder')}
          </button>

          {orders.length > 0 && (
            <div className="card p-4">
              <h3 className="font-medium text-slate-700 mb-3">{t('tools.orderFormCreator.savedOrders')}</h3>
              <div className="space-y-2">
                {orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div onClick={() => setCurrentOrder(order)} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.orderNumber}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.customerName || 'No customer'} • ${(order.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0) + order.shippingCost).toFixed(2)}
                      </div>
                    </div>
                    <button onClick={() => deleteOrder(order.id)} className="text-red-500">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentOrder(null)} className="px-3 py-2 bg-slate-100 rounded">←</button>
            <span className="font-medium flex-1">{currentOrder.orderNumber}</span>
            <select
              value={currentOrder.status}
              onChange={(e) => setCurrentOrder({ ...currentOrder, status: e.target.value as OrderForm['status'] })}
              className={`px-3 py-2 rounded text-sm ${statusColors[currentOrder.status]}`}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="font-medium text-slate-700">{t('tools.orderFormCreator.customerInfo')}</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={currentOrder.customerName}
                onChange={(e) => setCurrentOrder({ ...currentOrder, customerName: e.target.value })}
                placeholder={t('tools.orderFormCreator.customerName')}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="email"
                value={currentOrder.customerEmail}
                onChange={(e) => setCurrentOrder({ ...currentOrder, customerEmail: e.target.value })}
                placeholder={t('tools.orderFormCreator.email')}
                className="px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="tel"
                value={currentOrder.customerPhone}
                onChange={(e) => setCurrentOrder({ ...currentOrder, customerPhone: e.target.value })}
                placeholder={t('tools.orderFormCreator.phone')}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="date"
                value={currentOrder.date}
                onChange={(e) => setCurrentOrder({ ...currentOrder, date: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <textarea
              value={currentOrder.shippingAddress}
              onChange={(e) => setCurrentOrder({ ...currentOrder, shippingAddress: e.target.value })}
              placeholder={t('tools.orderFormCreator.shippingAddress')}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
          </div>

          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-slate-700">{t('tools.orderFormCreator.items')}</h3>
              <button onClick={addItem} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                + {t('tools.orderFormCreator.addItem')}
              </button>
            </div>
            <div className="space-y-2">
              {currentOrder.items.map((item, index) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded space-y-2">
                  <div className="flex gap-2">
                    <span className="text-slate-400 text-sm w-6">{index + 1}.</span>
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) => updateItem(item.id, { productName: e.target.value })}
                      placeholder={t('tools.orderFormCreator.productName')}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      value={item.sku}
                      onChange={(e) => updateItem(item.id, { sku: e.target.value })}
                      placeholder="SKU"
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                    <button onClick={() => removeItem(item.id)} className="text-red-500">×</button>
                  </div>
                  <div className="flex gap-2 pl-6">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500">Qty:</span>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                        min="1"
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500">Price:</span>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                        min="0"
                        step="0.01"
                        className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                    </div>
                    <span className="text-sm text-slate-600 ml-auto">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              {currentOrder.items.length === 0 && (
                <p className="text-center text-slate-500 py-4 text-sm">{t('tools.orderFormCreator.noItems')}</p>
              )}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <select
                value={currentOrder.shippingMethod}
                onChange={(e) => setCurrentOrder({ ...currentOrder, shippingMethod: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {shippingMethods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">{t('tools.orderFormCreator.shippingCost')}</span>
                <input
                  type="number"
                  value={currentOrder.shippingCost}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, shippingCost: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
            <div className="border-t border-slate-200 pt-3 space-y-1 text-right">
              <div className="text-sm text-slate-600">
                {t('tools.orderFormCreator.subtotal')}: ${subtotal.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600">
                {t('tools.orderFormCreator.shipping')}: ${currentOrder.shippingCost.toFixed(2)}
              </div>
              <div className="text-lg font-bold">
                {t('tools.orderFormCreator.total')}: ${total.toFixed(2)}
              </div>
            </div>
          </div>

          <textarea
            value={currentOrder.notes}
            onChange={(e) => setCurrentOrder({ ...currentOrder, notes: e.target.value })}
            placeholder={t('tools.orderFormCreator.notes')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={copyOrder}
              className={`py-2 rounded ${copied ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
            >
              {copied ? '✓' : t('tools.orderFormCreator.copy')}
            </button>
            <button onClick={printOrder} className="py-2 bg-slate-100 rounded">
              {t('tools.orderFormCreator.print')}
            </button>
            <button onClick={saveOrder} className="py-2 bg-blue-500 text-white rounded">
              {t('tools.orderFormCreator.save')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
