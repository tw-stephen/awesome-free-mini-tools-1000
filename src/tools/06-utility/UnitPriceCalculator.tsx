import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Item {
  id: number
  name: string
  price: string
  quantity: string
  unit: string
}

export default function UnitPriceCalculator() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: '', price: '', quantity: '', unit: 'oz' },
    { id: 2, name: '', price: '', quantity: '', unit: 'oz' },
  ])

  const units = ['oz', 'lb', 'g', 'kg', 'ml', 'L', 'fl oz', 'gal', 'ct', 'pcs']

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: '', price: '', quantity: '', unit: 'oz' },
    ])
  }

  const removeItem = (id: number) => {
    if (items.length > 2) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: number, field: keyof Item, value: string) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const calculateUnitPrice = (item: Item) => {
    const price = parseFloat(item.price)
    const quantity = parseFloat(item.quantity)
    if (isNaN(price) || isNaN(quantity) || quantity === 0) return null
    return price / quantity
  }

  const getValidItems = () => {
    return items
      .map((item) => ({
        ...item,
        unitPrice: calculateUnitPrice(item),
      }))
      .filter((item) => item.unitPrice !== null)
  }

  const validItems = getValidItems()
  const bestDeal = validItems.length > 0
    ? validItems.reduce((best, item) =>
        (item.unitPrice! < best.unitPrice!) ? item : best
      )
    : null

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.unitPriceCalculator.compareItems')}
        </h3>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="p-3 bg-slate-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  {t('tools.unitPriceCalculator.item')} {index + 1}
                </span>
                {items.length > 2 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    {t('common.remove')}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder={t('tools.unitPriceCalculator.itemName')}
                  className="px-3 py-2 border border-slate-300 rounded text-sm"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                    placeholder={t('tools.unitPriceCalculator.price')}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                  placeholder={t('tools.unitPriceCalculator.quantity')}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                />
                <select
                  value={item.unit}
                  onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded text-sm"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              {calculateUnitPrice(item) !== null && (
                <div className={`mt-2 p-2 rounded text-center ${
                  bestDeal && item.id === bestDeal.id
                    ? 'bg-green-100 text-green-700'
                    : 'bg-white'
                }`}>
                  <span className="text-sm font-medium">
                    ${calculateUnitPrice(item)!.toFixed(4)} / {item.unit}
                  </span>
                  {bestDeal && item.id === bestDeal.id && (
                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                      {t('tools.unitPriceCalculator.bestDeal')}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="w-full mt-4 py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500"
        >
          + {t('tools.unitPriceCalculator.addItem')}
        </button>
      </div>

      {validItems.length >= 2 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.unitPriceCalculator.comparison')}
          </h3>

          <div className="space-y-2">
            {validItems
              .sort((a, b) => a.unitPrice! - b.unitPrice!)
              .map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded ${
                    index === 0 ? 'bg-green-50' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium">
                      {item.name || `${t('tools.unitPriceCalculator.item')} ${items.findIndex(i => i.id === item.id) + 1}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${index === 0 ? 'text-green-600' : 'text-slate-700'}`}>
                      ${item.unitPrice!.toFixed(4)}/{item.unit}
                    </div>
                    <div className="text-xs text-slate-500">
                      ${item.price} / {item.quantity} {item.unit}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {bestDeal && validItems.length > 1 && (
            <div className="mt-4 p-3 bg-green-100 rounded">
              <div className="text-center">
                <div className="text-sm text-green-700">
                  {t('tools.unitPriceCalculator.savingsNote')}
                </div>
                <div className="text-lg font-bold text-green-600">
                  {t('tools.unitPriceCalculator.save')} ${(
                    (validItems[validItems.length - 1].unitPrice! - bestDeal.unitPrice!) *
                    parseFloat(validItems[validItems.length - 1].quantity)
                  ).toFixed(2)} {t('tools.unitPriceCalculator.byChoosing')} {bestDeal.name || t('tools.unitPriceCalculator.bestOption')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.unitPriceCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.unitPriceCalculator.tip1')}</li>
          <li>{t('tools.unitPriceCalculator.tip2')}</li>
          <li>{t('tools.unitPriceCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
