import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface WeatherCondition {
  temp: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'hot' | 'cold'
}

interface PackingItem {
  name: string
  category: string
  essential: boolean
}

const weatherPresets = [
  { id: 'tropical', name: 'Tropical (30+C)', temp: 32, condition: 'hot' as const },
  { id: 'warm', name: 'Warm (20-30C)', temp: 25, condition: 'sunny' as const },
  { id: 'mild', name: 'Mild (10-20C)', temp: 15, condition: 'cloudy' as const },
  { id: 'cool', name: 'Cool (0-10C)', temp: 5, condition: 'cloudy' as const },
  { id: 'cold', name: 'Cold (-10-0C)', temp: -5, condition: 'cold' as const },
  { id: 'freezing', name: 'Freezing (<-10C)', temp: -15, condition: 'snowy' as const },
  { id: 'rainy', name: 'Rainy Season', temp: 22, condition: 'rainy' as const },
]

const getPackingList = (weather: WeatherCondition, tripDays: number): PackingItem[] => {
  const items: PackingItem[] = []

  // Essential items for all trips
  items.push(
    { name: 'Passport/ID', category: 'essentials', essential: true },
    { name: 'Phone & Charger', category: 'essentials', essential: true },
    { name: 'Wallet', category: 'essentials', essential: true },
    { name: 'Medications', category: 'essentials', essential: true },
    { name: 'Toiletries', category: 'essentials', essential: true },
  )

  // Calculate clothing quantities
  const tshirts = Math.ceil(tripDays * 0.8)
  const pants = Math.ceil(tripDays * 0.4)
  const underwear = tripDays + 1
  const socks = tripDays + 1

  // Hot weather (25+C)
  if (weather.temp >= 25) {
    items.push(
      { name: `T-shirts/Tank tops (${tshirts})`, category: 'clothing', essential: true },
      { name: `Shorts (${pants})`, category: 'clothing', essential: true },
      { name: 'Sunglasses', category: 'accessories', essential: true },
      { name: 'Sunscreen', category: 'essentials', essential: true },
      { name: 'Hat/Cap', category: 'accessories', essential: true },
      { name: 'Sandals/Flip-flops', category: 'footwear', essential: true },
      { name: 'Light dress/skirt', category: 'clothing', essential: false },
      { name: 'Swimsuit', category: 'clothing', essential: false },
      { name: 'Insect repellent', category: 'essentials', essential: false },
    )
  }

  // Warm weather (15-25C)
  if (weather.temp >= 15 && weather.temp < 25) {
    items.push(
      { name: `T-shirts (${tshirts})`, category: 'clothing', essential: true },
      { name: `Long pants (${pants})`, category: 'clothing', essential: true },
      { name: 'Light jacket', category: 'clothing', essential: true },
      { name: 'Comfortable walking shoes', category: 'footwear', essential: true },
      { name: 'Light cardigan/sweater', category: 'clothing', essential: false },
    )
  }

  // Cool weather (5-15C)
  if (weather.temp >= 5 && weather.temp < 15) {
    items.push(
      { name: `Long-sleeve shirts (${tshirts})`, category: 'clothing', essential: true },
      { name: `Pants (${pants})`, category: 'clothing', essential: true },
      { name: 'Warm jacket', category: 'clothing', essential: true },
      { name: 'Sweaters (2-3)', category: 'clothing', essential: true },
      { name: 'Closed shoes/boots', category: 'footwear', essential: true },
      { name: 'Light scarf', category: 'accessories', essential: false },
    )
  }

  // Cold weather (<5C)
  if (weather.temp < 5) {
    items.push(
      { name: `Thermal underwear (${Math.ceil(tripDays / 2)})`, category: 'clothing', essential: true },
      { name: `Warm sweaters (${Math.ceil(tshirts / 2)})`, category: 'clothing', essential: true },
      { name: `Warm pants (${pants})`, category: 'clothing', essential: true },
      { name: 'Winter coat', category: 'clothing', essential: true },
      { name: 'Warm boots', category: 'footwear', essential: true },
      { name: 'Warm hat/beanie', category: 'accessories', essential: true },
      { name: 'Gloves', category: 'accessories', essential: true },
      { name: 'Scarf', category: 'accessories', essential: true },
      { name: 'Thick socks', category: 'clothing', essential: true },
      { name: 'Hand warmers', category: 'accessories', essential: false },
    )
  }

  // Rainy weather
  if (weather.condition === 'rainy') {
    items.push(
      { name: 'Rain jacket/Raincoat', category: 'clothing', essential: true },
      { name: 'Umbrella', category: 'accessories', essential: true },
      { name: 'Waterproof bag', category: 'accessories', essential: true },
      { name: 'Waterproof shoes', category: 'footwear', essential: true },
      { name: 'Quick-dry clothes', category: 'clothing', essential: false },
    )
  }

  // Snowy weather
  if (weather.condition === 'snowy') {
    items.push(
      { name: 'Snow boots', category: 'footwear', essential: true },
      { name: 'Waterproof outer layer', category: 'clothing', essential: true },
      { name: 'Snow goggles', category: 'accessories', essential: false },
    )
  }

  // Common clothing
  items.push(
    { name: `Underwear (${underwear})`, category: 'clothing', essential: true },
    { name: `Socks (${socks} pairs)`, category: 'clothing', essential: true },
    { name: 'Sleepwear', category: 'clothing', essential: true },
  )

  return items
}

export default function WeatherPacker() {
  const { t } = useTranslation()
  const [selectedPreset, setSelectedPreset] = useState('warm')
  const [customTemp, setCustomTemp] = useState(25)
  const [tripDays, setTripDays] = useState(7)
  const [isRainy, setIsRainy] = useState(false)
  const [useCustom, setUseCustom] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const getWeather = (): WeatherCondition => {
    if (useCustom) {
      let condition: WeatherCondition['condition'] = 'sunny'
      if (isRainy) condition = 'rainy'
      else if (customTemp < -10) condition = 'snowy'
      else if (customTemp < 5) condition = 'cold'
      else if (customTemp >= 30) condition = 'hot'
      return { temp: customTemp, condition }
    }
    const preset = weatherPresets.find(p => p.id === selectedPreset)
    if (isRainy && preset) {
      return { temp: preset.temp, condition: 'rainy' }
    }
    return preset ? { temp: preset.temp, condition: preset.condition } : { temp: 25, condition: 'sunny' }
  }

  const weather = getWeather()
  const packingList = getPackingList(weather, tripDays)

  const toggleItem = (itemName: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(itemName)) {
      newChecked.delete(itemName)
    } else {
      newChecked.add(itemName)
    }
    setCheckedItems(newChecked)
  }

  const categories = [...new Set(packingList.map(i => i.category))]
  const progress = (checkedItems.size / packingList.length) * 100

  const exportList = () => {
    let text = `Packing List for ${tripDays}-day trip\n`
    text += `Weather: ${weather.temp}°C, ${weather.condition}\n\n`

    categories.forEach(cat => {
      const catItems = packingList.filter(i => i.category === cat)
      text += `${cat.toUpperCase()}\n`
      catItems.forEach(item => {
        text += `[${checkedItems.has(item.name) ? 'x' : ' '}] ${item.name}${item.essential ? ' *' : ''}\n`
      })
      text += '\n'
    })

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'packing-list.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.weatherPacker.tripDuration')}</h3>
        <input
          type="number"
          value={tripDays}
          onChange={e => setTripDays(parseInt(e.target.value) || 1)}
          min={1}
          max={30}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.weatherPacker.weather')}</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useCustom}
              onChange={e => setUseCustom(e.target.checked)}
            />
            {t('tools.weatherPacker.customTemp')}
          </label>
        </div>

        {!useCustom ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {weatherPresets.map(preset => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset.id)}
                className={`p-2 rounded text-sm ${
                  selectedPreset === preset.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={-20}
              max={40}
              value={customTemp}
              onChange={e => setCustomTemp(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="font-bold w-16 text-center">{customTemp}°C</span>
          </div>
        )}

        <label className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            checked={isRainy}
            onChange={e => setIsRainy(e.target.checked)}
          />
          <span>{t('tools.weatherPacker.expectRain')}</span>
        </label>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">{t('tools.weatherPacker.packingProgress')}</span>
          <span className="font-bold">{checkedItems.size}/{packingList.length}</span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {categories.map(category => (
        <div key={category} className="card p-4">
          <h3 className="font-medium mb-3 capitalize">{category}</h3>
          <div className="space-y-2">
            {packingList.filter(i => i.category === category).map(item => (
              <label
                key={item.name}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  checkedItems.has(item.name) ? 'bg-green-50' : 'bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.has(item.name)}
                  onChange={() => toggleItem(item.name)}
                  className="w-5 h-5"
                />
                <span className={checkedItems.has(item.name) ? 'line-through text-slate-400' : ''}>
                  {item.name}
                </span>
                {item.essential && <span className="text-red-500">*</span>}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={exportList}
        className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {t('tools.weatherPacker.export')}
      </button>
    </div>
  )
}
