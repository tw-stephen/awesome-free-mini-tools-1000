import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ApplianceWattageGuide() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: t('tools.applianceWattageGuide.all') },
    { id: 'kitchen', name: t('tools.applianceWattageGuide.kitchen') },
    { id: 'laundry', name: t('tools.applianceWattageGuide.laundry') },
    { id: 'climate', name: t('tools.applianceWattageGuide.climate') },
    { id: 'entertainment', name: t('tools.applianceWattageGuide.entertainment') },
    { id: 'office', name: t('tools.applianceWattageGuide.office') },
    { id: 'personal', name: t('tools.applianceWattageGuide.personal') },
    { id: 'lighting', name: t('tools.applianceWattageGuide.lighting') },
  ]

  const appliances = [
    // Kitchen
    { name: 'Refrigerator', watts: '100-400', typical: 150, category: 'kitchen' },
    { name: 'Freezer', watts: '100-400', typical: 200, category: 'kitchen' },
    { name: 'Microwave', watts: '600-1500', typical: 1000, category: 'kitchen' },
    { name: 'Electric Oven', watts: '2000-5000', typical: 3000, category: 'kitchen' },
    { name: 'Electric Stove', watts: '1000-3000', typical: 2000, category: 'kitchen' },
    { name: 'Toaster', watts: '800-1400', typical: 900, category: 'kitchen' },
    { name: 'Coffee Maker', watts: '800-1400', typical: 1000, category: 'kitchen' },
    { name: 'Dishwasher', watts: '1200-2400', typical: 1800, category: 'kitchen' },
    { name: 'Blender', watts: '300-1000', typical: 500, category: 'kitchen' },
    { name: 'Electric Kettle', watts: '1000-1500', typical: 1200, category: 'kitchen' },
    { name: 'Rice Cooker', watts: '200-500', typical: 350, category: 'kitchen' },
    { name: 'Air Fryer', watts: '800-1500', typical: 1100, category: 'kitchen' },
    { name: 'Instant Pot', watts: '700-1000', typical: 800, category: 'kitchen' },

    // Laundry
    { name: 'Washing Machine', watts: '350-500', typical: 450, category: 'laundry' },
    { name: 'Electric Dryer', watts: '1800-5000', typical: 3000, category: 'laundry' },
    { name: 'Iron', watts: '1000-1800', typical: 1200, category: 'laundry' },
    { name: 'Clothes Steamer', watts: '800-1500', typical: 1000, category: 'laundry' },

    // Climate Control
    { name: 'Central AC', watts: '2000-5000', typical: 3500, category: 'climate' },
    { name: 'Window AC', watts: '500-1500', typical: 1000, category: 'climate' },
    { name: 'Portable AC', watts: '800-1400', typical: 1100, category: 'climate' },
    { name: 'Space Heater', watts: '750-1500', typical: 1500, category: 'climate' },
    { name: 'Electric Fireplace', watts: '750-1500', typical: 1200, category: 'climate' },
    { name: 'Ceiling Fan', watts: '15-75', typical: 50, category: 'climate' },
    { name: 'Box Fan', watts: '50-100', typical: 75, category: 'climate' },
    { name: 'Dehumidifier', watts: '300-700', typical: 500, category: 'climate' },
    { name: 'Humidifier', watts: '30-100', typical: 50, category: 'climate' },

    // Entertainment
    { name: 'LED TV (55")', watts: '80-150', typical: 100, category: 'entertainment' },
    { name: 'Plasma TV', watts: '200-500', typical: 350, category: 'entertainment' },
    { name: 'Gaming Console', watts: '100-200', typical: 150, category: 'entertainment' },
    { name: 'Sound Bar', watts: '30-60', typical: 40, category: 'entertainment' },
    { name: 'Home Theater', watts: '200-400', typical: 300, category: 'entertainment' },
    { name: 'Streaming Device', watts: '3-5', typical: 4, category: 'entertainment' },

    // Office
    { name: 'Desktop Computer', watts: '100-400', typical: 200, category: 'office' },
    { name: 'Laptop', watts: '30-70', typical: 50, category: 'office' },
    { name: 'Monitor (24")', watts: '20-50', typical: 30, category: 'office' },
    { name: 'Printer', watts: '30-50', typical: 40, category: 'office' },
    { name: 'Laser Printer', watts: '300-500', typical: 400, category: 'office' },
    { name: 'Router', watts: '5-20', typical: 10, category: 'office' },

    // Personal Care
    { name: 'Hair Dryer', watts: '1200-1875', typical: 1500, category: 'personal' },
    { name: 'Curling Iron', watts: '20-125', typical: 50, category: 'personal' },
    { name: 'Electric Shaver', watts: '10-20', typical: 15, category: 'personal' },
    { name: 'Electric Toothbrush', watts: '1-3', typical: 2, category: 'personal' },

    // Lighting
    { name: 'Incandescent Bulb (60W)', watts: '60', typical: 60, category: 'lighting' },
    { name: 'CFL Bulb', watts: '13-15', typical: 14, category: 'lighting' },
    { name: 'LED Bulb', watts: '8-12', typical: 10, category: 'lighting' },
    { name: 'Halogen Bulb', watts: '35-50', typical: 43, category: 'lighting' },
    { name: 'Floor Lamp', watts: '60-150', typical: 100, category: 'lighting' },
  ]

  const filteredAppliances = appliances.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getWattageLevel = (watts: number) => {
    if (watts < 100) return { color: 'text-green-600', bg: 'bg-green-100', label: t('tools.applianceWattageGuide.low') }
    if (watts < 500) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: t('tools.applianceWattageGuide.medium') }
    if (watts < 1500) return { color: 'text-orange-600', bg: 'bg-orange-100', label: t('tools.applianceWattageGuide.high') }
    return { color: 'text-red-600', bg: 'bg-red-100', label: t('tools.applianceWattageGuide.veryHigh') }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
          placeholder={t('tools.applianceWattageGuide.searchPlaceholder')}
        />
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded text-sm ${
                selectedCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {filteredAppliances.length} {t('tools.applianceWattageGuide.appliancesFound')}
        </h3>
        <div className="space-y-2">
          {filteredAppliances.map((appliance, index) => {
            const level = getWattageLevel(appliance.typical)
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div>
                  <div className="font-medium text-sm">{appliance.name}</div>
                  <div className="text-xs text-slate-500">{appliance.watts} W</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${level.color}`}>{appliance.typical} W</div>
                  <span className={`text-xs px-2 py-0.5 rounded ${level.bg} ${level.color}`}>
                    {level.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.applianceWattageGuide.wattageGuide')}</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-sm">{t('tools.applianceWattageGuide.lowDesc')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="text-sm">{t('tools.applianceWattageGuide.mediumDesc')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span className="text-sm">{t('tools.applianceWattageGuide.highDesc')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-sm">{t('tools.applianceWattageGuide.veryHighDesc')}</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.applianceWattageGuide.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.applianceWattageGuide.tip1')}</li>
          <li>{t('tools.applianceWattageGuide.tip2')}</li>
          <li>{t('tools.applianceWattageGuide.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
