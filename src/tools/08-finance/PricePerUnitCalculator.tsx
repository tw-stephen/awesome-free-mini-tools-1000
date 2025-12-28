import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Item {
  id: number
  name: string
  price: string
  quantity: string
  unit: string
}

export default function PricePerUnitCalculator() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Option A', price: '', quantity: '', unit: 'oz' },
    { id: 2, name: 'Option B', price: '', quantity: '', unit: 'oz' },
  ])

  const units = ['oz', 'lb', 'g', 'kg', 'ml', 'L', 'ct', 'pk']

  const addItem = () => {
    setItems([...items, {
      id: Date.now(),
      name: `Option ${String.fromCharCode(65 + items.length)}`,
      price: '',
      quantity: '',
      unit: 'oz',
    }])
  }

  const removeItem = (id: number) => {
    if (items.length <= 2) return
    setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (id: number, field: keyof Item, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const results = useMemo(() => {
    return items.map(item => {
      const price = parseFloat(item.price) || 0
      const quantity = parseFloat(item.quantity) || 0
      const pricePerUnit = quantity > 0 ? price / quantity : 0
      return { ...item, pricePerUnit }
    }).filter(r => r.pricePerUnit > 0)
  }, [items])

  const bestDeal = useMemo(() => {
    if (results.length < 2) return null
    return results.reduce((best, current) =>
      current.pricePerUnit < best.pricePerUnit ? current : best
    )
  }, [results])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.pricePerUnitCalculator.compareItems')}
          </h3>
          <button
            onClick={addItem}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            + {t('tools.pricePerUnitCalculator.addItem')}
          </button>
        </div>

        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="p-3 bg-slate-50 rounded space-y-2">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  className="font-medium bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                />
                {items.length > 2 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-500">{t('tools.pricePerUnitCalculator.price')}</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                    placeholder="5.99"
                    step="0.01"
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t('tools.pricePerUnitCalculator.quantity')}</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                    placeholder="16"
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t('tools.pricePerUnitCalculator.unit')}</label>
                  <select
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  >
                    {units.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {results.length >= 2 && (
        <div className="space-y-3">
          {bestDeal && (
            <div className="card p-4 bg-green-50 text-center">
              <div className="text-sm text-slate-600">{t('tools.pricePerUnitCalculator.bestDeal')}</div>
              <div className="text-2xl font-bold text-green-600">{bestDeal.name}</div>
              <div className="text-sm text-green-500">
                ${bestDeal.pricePerUnit.toFixed(4)}/{bestDeal.unit}
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.pricePerUnitCalculator.comparison')}
            </h3>
            <div className="space-y-2">
              {results
                .sort((a, b) => a.pricePerUnit - b.pricePerUnit)
                .map((result, index) => {
                  const isBest = index === 0
                  const savings = index > 0
                    ? ((result.pricePerUnit - results[0].pricePerUnit) / results[0].pricePerUnit) * 100
                    : 0
                  return (
                    <div
                      key={result.id}
                      className={`flex justify-between items-center p-2 rounded ${
                        isBest ? 'bg-green-100' : 'bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className={`font-medium ${isBest ? 'text-green-700' : ''}`}>
                          {result.name}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          ${result.price} / {result.quantity} {result.unit}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${isBest ? 'text-green-600' : ''}`}>
                          ${result.pricePerUnit.toFixed(4)}/{result.unit}
                        </div>
                        {!isBest && (
                          <div className="text-xs text-red-500">
                            +{savings.toFixed(1)}% more
                          </div>
                        )}
                        {isBest && (
                          <div className="text-xs text-green-500">
                            Best value
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
