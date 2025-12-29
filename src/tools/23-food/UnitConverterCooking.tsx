import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ConversionCategory {
  id: string
  name: string
  icon: string
  units: { id: string; name: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]
}

const categories: ConversionCategory[] = [
  {
    id: 'volume',
    name: 'Volume',
    icon: '🫗',
    units: [
      { id: 'ml', name: 'Milliliters (ml)', toBase: v => v, fromBase: v => v },
      { id: 'l', name: 'Liters (L)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'tsp', name: 'Teaspoons (tsp)', toBase: v => v * 4.929, fromBase: v => v / 4.929 },
      { id: 'tbsp', name: 'Tablespoons (tbsp)', toBase: v => v * 14.787, fromBase: v => v / 14.787 },
      { id: 'floz', name: 'Fluid Ounces (fl oz)', toBase: v => v * 29.574, fromBase: v => v / 29.574 },
      { id: 'cup', name: 'Cups (US)', toBase: v => v * 236.588, fromBase: v => v / 236.588 },
      { id: 'pint', name: 'Pints (US)', toBase: v => v * 473.176, fromBase: v => v / 473.176 },
      { id: 'quart', name: 'Quarts (US)', toBase: v => v * 946.353, fromBase: v => v / 946.353 },
      { id: 'gallon', name: 'Gallons (US)', toBase: v => v * 3785.41, fromBase: v => v / 3785.41 },
    ],
  },
  {
    id: 'weight',
    name: 'Weight',
    icon: '⚖️',
    units: [
      { id: 'g', name: 'Grams (g)', toBase: v => v, fromBase: v => v },
      { id: 'kg', name: 'Kilograms (kg)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'oz', name: 'Ounces (oz)', toBase: v => v * 28.3495, fromBase: v => v / 28.3495 },
      { id: 'lb', name: 'Pounds (lb)', toBase: v => v * 453.592, fromBase: v => v / 453.592 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: '🌡️',
    units: [
      { id: 'c', name: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
      { id: 'f', name: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { id: 'gas', name: 'Gas Mark', toBase: v => (v * 14) + 121, fromBase: v => (v - 121) / 14 },
    ],
  },
]

const quickConversions = [
  { from: '1 cup', to: '236 ml / 16 tbsp' },
  { from: '1 tbsp', to: '15 ml / 3 tsp' },
  { from: '1 oz', to: '28 g' },
  { from: '1 lb', to: '454 g' },
  { from: '350°F', to: '175°C / Gas 4' },
  { from: '400°F', to: '200°C / Gas 6' },
]

const commonMeasurements = [
  { ingredient: 'Flour (all-purpose)', cup: '120g', tbsp: '8g' },
  { ingredient: 'Sugar (granulated)', cup: '200g', tbsp: '12g' },
  { ingredient: 'Brown Sugar (packed)', cup: '220g', tbsp: '14g' },
  { ingredient: 'Butter', cup: '227g (2 sticks)', tbsp: '14g' },
  { ingredient: 'Milk', cup: '240ml', tbsp: '15ml' },
  { ingredient: 'Honey', cup: '340g', tbsp: '21g' },
  { ingredient: 'Salt (table)', cup: '288g', tbsp: '18g' },
  { ingredient: 'Rice (uncooked)', cup: '185g', tbsp: '12g' },
  { ingredient: 'Oats (rolled)', cup: '90g', tbsp: '6g' },
]

export default function UnitConverterCooking() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('volume')
  const [fromUnit, setFromUnit] = useState('cup')
  const [toUnit, setToUnit] = useState('ml')
  const [value, setValue] = useState(1)

  const category = categories.find(c => c.id === selectedCategory)
  const fromUnitData = category?.units.find(u => u.id === fromUnit)
  const toUnitData = category?.units.find(u => u.id === toUnit)

  const convert = () => {
    if (!fromUnitData || !toUnitData) return 0
    const baseValue = fromUnitData.toBase(value)
    return toUnitData.fromBase(baseValue)
  }

  const result = convert()

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setValue(result)
  }

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId)
    const cat = categories.find(c => c.id === catId)
    if (cat && cat.units.length >= 2) {
      setFromUnit(cat.units[0].id)
      setToUnit(cat.units[1].id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.unitConverterCooking.category')}</h3>
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex-1 p-3 rounded text-center ${
                selectedCategory === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-xl">{cat.icon}</div>
              <div className="text-sm mt-1">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-500 mb-1">{t('tools.unitConverterCooking.from')}</label>
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {category?.units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={value}
              onChange={e => setValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded mt-2 text-xl text-right"
              step={0.25}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full"
            >
              ⇄
            </button>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-500 mb-1">{t('tools.unitConverterCooking.to')}</label>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {category?.units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <div className="w-full px-3 py-2 border border-slate-300 rounded mt-2 text-xl text-right bg-slate-50 font-bold text-blue-600">
              {result.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 text-center bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="text-lg opacity-80">
          {value} {fromUnitData?.name.split(' ')[0]} =
        </div>
        <div className="text-4xl font-bold mt-2">
          {result.toFixed(2)} {toUnitData?.name.split(' ')[0]}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.unitConverterCooking.quickReference')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {quickConversions.map((conv, idx) => (
            <div key={idx} className="p-2 bg-slate-50 rounded text-sm">
              <div className="font-medium">{conv.from}</div>
              <div className="text-slate-500">{conv.to}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.unitConverterCooking.commonIngredients')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left">{t('tools.unitConverterCooking.ingredient')}</th>
                <th className="p-2 text-right">1 cup</th>
                <th className="p-2 text-right">1 tbsp</th>
              </tr>
            </thead>
            <tbody>
              {commonMeasurements.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="p-2">{item.ingredient}</td>
                  <td className="p-2 text-right text-slate-600">{item.cup}</td>
                  <td className="p-2 text-right text-slate-600">{item.tbsp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
