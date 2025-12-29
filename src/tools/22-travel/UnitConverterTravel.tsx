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
    id: 'temperature',
    name: 'Temperature',
    icon: '🌡️',
    units: [
      { id: 'celsius', name: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
      { id: 'fahrenheit', name: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    ],
  },
  {
    id: 'distance',
    name: 'Distance',
    icon: '📏',
    units: [
      { id: 'km', name: 'Kilometers (km)', toBase: v => v, fromBase: v => v },
      { id: 'miles', name: 'Miles (mi)', toBase: v => v * 1.60934, fromBase: v => v / 1.60934 },
      { id: 'meters', name: 'Meters (m)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'feet', name: 'Feet (ft)', toBase: v => v * 0.0003048, fromBase: v => v / 0.0003048 },
      { id: 'yards', name: 'Yards (yd)', toBase: v => v * 0.0009144, fromBase: v => v / 0.0009144 },
    ],
  },
  {
    id: 'weight',
    name: 'Weight',
    icon: '⚖️',
    units: [
      { id: 'kg', name: 'Kilograms (kg)', toBase: v => v, fromBase: v => v },
      { id: 'lb', name: 'Pounds (lb)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { id: 'g', name: 'Grams (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'oz', name: 'Ounces (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: '🫗',
    units: [
      { id: 'liters', name: 'Liters (L)', toBase: v => v, fromBase: v => v },
      { id: 'gallons', name: 'US Gallons (gal)', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      { id: 'ml', name: 'Milliliters (mL)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'floz', name: 'Fluid Ounces (fl oz)', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
      { id: 'cups', name: 'Cups', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: '🚗',
    units: [
      { id: 'kmh', name: 'km/h', toBase: v => v, fromBase: v => v },
      { id: 'mph', name: 'mph', toBase: v => v * 1.60934, fromBase: v => v / 1.60934 },
      { id: 'ms', name: 'm/s', toBase: v => v * 3.6, fromBase: v => v / 3.6 },
      { id: 'knots', name: 'Knots', toBase: v => v * 1.852, fromBase: v => v / 1.852 },
    ],
  },
  {
    id: 'clothing',
    name: 'Clothing Size',
    icon: '👕',
    units: [
      { id: 'us', name: 'US Size', toBase: v => v, fromBase: v => v },
      { id: 'uk', name: 'UK Size', toBase: v => v, fromBase: v => v },
      { id: 'eu', name: 'EU Size', toBase: v => (v - 32) / 2, fromBase: v => v * 2 + 32 },
    ],
  },
  {
    id: 'shoe',
    name: 'Shoe Size',
    icon: '👟',
    units: [
      { id: 'us_m', name: 'US Men', toBase: v => v, fromBase: v => v },
      { id: 'us_w', name: 'US Women', toBase: v => v - 1.5, fromBase: v => v + 1.5 },
      { id: 'uk', name: 'UK', toBase: v => v + 0.5, fromBase: v => v - 0.5 },
      { id: 'eu', name: 'EU', toBase: v => (v - 33) / 1.5, fromBase: v => v * 1.5 + 33 },
      { id: 'cm', name: 'CM', toBase: v => (v - 18) / 0.847, fromBase: v => v * 0.847 + 18 },
    ],
  },
]

const quickConversions = [
  { from: '°F', to: '°C', formula: '(°F - 32) × 5/9' },
  { from: 'miles', to: 'km', formula: 'mi × 1.609' },
  { from: 'lb', to: 'kg', formula: 'lb × 0.454' },
  { from: 'gal', to: 'L', formula: 'gal × 3.785' },
  { from: 'mph', to: 'km/h', formula: 'mph × 1.609' },
  { from: 'ft', to: 'm', formula: 'ft × 0.305' },
]

export default function UnitConverterTravel() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('temperature')
  const [fromUnit, setFromUnit] = useState('fahrenheit')
  const [toUnit, setToUnit] = useState('celsius')
  const [value, setValue] = useState(72)

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
      setFromUnit(cat.units[1].id)
      setToUnit(cat.units[0].id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.unitConverterTravel.category')}</h3>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`p-2 rounded text-center ${
                selectedCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-xl">{cat.icon}</div>
              <div className="text-xs mt-1 truncate">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-500 mb-1">{t('tools.unitConverterTravel.from')}</label>
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
            <label className="block text-sm text-slate-500 mb-1">{t('tools.unitConverterTravel.to')}</label>
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

      <div className="card p-6 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="text-lg opacity-80">
          {value} {fromUnitData?.name.split(' ')[0]} =
        </div>
        <div className="text-4xl font-bold mt-2">
          {result.toFixed(2)} {toUnitData?.name.split(' ')[0]}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.unitConverterTravel.quickReference')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {quickConversions.map((conv, idx) => (
            <div key={idx} className="p-2 bg-slate-50 rounded text-sm">
              <div className="font-medium">{conv.from} → {conv.to}</div>
              <div className="text-slate-500 text-xs">{conv.formula}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.unitConverterTravel.commonValues')}</h3>
        {selectedCategory === 'temperature' && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-blue-50 rounded">0°C = 32°F (Freezing)</div>
            <div className="p-2 bg-green-50 rounded">20°C = 68°F (Room temp)</div>
            <div className="p-2 bg-yellow-50 rounded">30°C = 86°F (Hot day)</div>
            <div className="p-2 bg-red-50 rounded">37°C = 98.6°F (Body temp)</div>
          </div>
        )}
        {selectedCategory === 'distance' && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-slate-50 rounded">1 km = 0.62 mi</div>
            <div className="p-2 bg-slate-50 rounded">1 mi = 1.61 km</div>
            <div className="p-2 bg-slate-50 rounded">100 m = 328 ft</div>
            <div className="p-2 bg-slate-50 rounded">1 yd = 0.91 m</div>
          </div>
        )}
        {selectedCategory === 'weight' && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-slate-50 rounded">1 kg = 2.2 lb</div>
            <div className="p-2 bg-slate-50 rounded">50 kg = 110 lb</div>
            <div className="p-2 bg-slate-50 rounded">1 oz = 28.3 g</div>
            <div className="p-2 bg-slate-50 rounded">100 lb = 45.4 kg</div>
          </div>
        )}
        {selectedCategory === 'volume' && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-slate-50 rounded">1 L = 0.26 gal</div>
            <div className="p-2 bg-slate-50 rounded">1 gal = 3.79 L</div>
            <div className="p-2 bg-slate-50 rounded">1 cup = 237 mL</div>
            <div className="p-2 bg-slate-50 rounded">1 fl oz = 30 mL</div>
          </div>
        )}
      </div>
    </div>
  )
}
