import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function FlowerMeanings() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const flowers = [
    { name: 'Rose (Red)', meaning: 'Deep love, passion, desire', category: 'love', colors: ['#C41E3A'] },
    { name: 'Rose (Pink)', meaning: 'Gratitude, grace, admiration', category: 'appreciation', colors: ['#FF69B4'] },
    { name: 'Rose (White)', meaning: 'Purity, innocence, new beginnings', category: 'purity', colors: ['#FFFAFA'] },
    { name: 'Rose (Yellow)', meaning: 'Friendship, joy, caring', category: 'friendship', colors: ['#FFD700'] },
    { name: 'Tulip', meaning: 'Perfect love, elegance', category: 'love', colors: ['#FF6347', '#FF69B4', '#9370DB'] },
    { name: 'Lily', meaning: 'Purity, refined beauty', category: 'purity', colors: ['#FFFAFA', '#FF69B4'] },
    { name: 'Sunflower', meaning: 'Adoration, loyalty, longevity', category: 'appreciation', colors: ['#FFD700'] },
    { name: 'Daisy', meaning: 'Innocence, purity, new beginnings', category: 'purity', colors: ['#FFFAFA', '#FFD700'] },
    { name: 'Orchid', meaning: 'Luxury, beauty, strength', category: 'appreciation', colors: ['#DA70D6', '#FFFAFA'] },
    { name: 'Carnation (Red)', meaning: 'Deep love, admiration', category: 'love', colors: ['#FF0000'] },
    { name: 'Carnation (Pink)', meaning: "Mother's love, gratitude", category: 'appreciation', colors: ['#FFC0CB'] },
    { name: 'Carnation (White)', meaning: 'Pure love, good luck', category: 'purity', colors: ['#FFFAFA'] },
    { name: 'Peony', meaning: 'Prosperity, romance, honor', category: 'love', colors: ['#FF69B4', '#FFB6C1'] },
    { name: 'Hydrangea', meaning: 'Gratitude, heartfelt emotions', category: 'appreciation', colors: ['#6495ED', '#FF69B4'] },
    { name: 'Lavender', meaning: 'Devotion, serenity, grace', category: 'friendship', colors: ['#E6E6FA'] },
    { name: 'Chrysanthemum', meaning: 'Loyalty, honesty, friendship', category: 'friendship', colors: ['#FFD700', '#FFFAFA'] },
    { name: 'Iris', meaning: 'Wisdom, hope, trust', category: 'friendship', colors: ['#5D3FD3'] },
    { name: 'Daffodil', meaning: 'New beginnings, rebirth', category: 'purity', colors: ['#FFD700'] },
    { name: 'Jasmine', meaning: 'Sweet love, sensuality', category: 'love', colors: ['#FFFAFA'] },
    { name: 'Forget-me-not', meaning: 'True love, remembrance', category: 'love', colors: ['#7BA7E1'] },
    { name: 'Camellia', meaning: 'Admiration, perfection', category: 'appreciation', colors: ['#FF69B4', '#C41E3A'] },
    { name: 'Gardenia', meaning: 'Purity, sweetness, joy', category: 'purity', colors: ['#FFFAFA'] },
    { name: 'Magnolia', meaning: 'Dignity, nobility, perseverance', category: 'appreciation', colors: ['#FFFAFA', '#FF69B4'] },
    { name: 'Violet', meaning: 'Modesty, faithfulness', category: 'friendship', colors: ['#8B00FF'] },
  ]

  const categories = [
    { id: 'all', name: 'All Flowers', color: 'bg-slate-100 text-slate-700' },
    { id: 'love', name: 'Love & Romance', color: 'bg-red-100 text-red-700' },
    { id: 'friendship', name: 'Friendship', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'appreciation', name: 'Appreciation', color: 'bg-pink-100 text-pink-700' },
    { id: 'purity', name: 'Purity & Innocence', color: 'bg-blue-100 text-blue-700' },
  ]

  const occasions = [
    { name: 'Wedding', flowers: ['Rose (White)', 'Lily', 'Peony', 'Gardenia'] },
    { name: 'Anniversary', flowers: ['Rose (Red)', 'Tulip', 'Orchid'] },
    { name: 'Birthday', flowers: ['Sunflower', 'Daisy', 'Tulip'] },
    { name: 'Sympathy', flowers: ['Lily', 'Chrysanthemum', 'Carnation (White)'] },
    { name: "Mother's Day", flowers: ['Carnation (Pink)', 'Rose (Pink)', 'Peony'] },
    { name: 'Friendship', flowers: ['Rose (Yellow)', 'Chrysanthemum', 'Iris'] },
  ]

  const filteredFlowers = flowers.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.id === category)?.color || 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.flowerMeanings.search')}</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('tools.flowerMeanings.searchPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded mb-3"
        />
        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                selectedCategory === cat.id ? cat.color + ' ring-2 ring-offset-1' : 'bg-slate-50 text-slate-500'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.flowerMeanings.flowers')} ({filteredFlowers.length})
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredFlowers.map(flower => (
            <div
              key={flower.name}
              className="p-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-slate-800">{flower.name}</div>
                  <div className="text-sm text-slate-600 mt-1">{flower.meaning}</div>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs mt-2 ${getCategoryColor(flower.category)}`}>
                    {categories.find(c => c.id === flower.category)?.name}
                  </span>
                </div>
                <div className="flex gap-1">
                  {flower.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-slate-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.flowerMeanings.occasions')}</h3>
        <div className="space-y-3">
          {occasions.map(occ => (
            <div key={occ.name} className="p-3 bg-slate-50 rounded">
              <div className="font-medium text-slate-700 mb-2">{occ.name}</div>
              <div className="flex flex-wrap gap-1">
                {occ.flowers.map(f => (
                  <span
                    key={f}
                    className="px-2 py-1 bg-white text-slate-600 rounded text-xs border"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.flowerMeanings.colorMeanings')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-red-50 rounded">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span className="text-sm font-medium text-red-700">Red</span>
            </div>
            <div className="text-xs text-red-600 mt-1">Love, Passion</div>
          </div>
          <div className="p-2 bg-pink-50 rounded">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-400 rounded-full" />
              <span className="text-sm font-medium text-pink-700">Pink</span>
            </div>
            <div className="text-xs text-pink-600 mt-1">Grace, Gratitude</div>
          </div>
          <div className="p-2 bg-yellow-50 rounded">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full" />
              <span className="text-sm font-medium text-yellow-700">Yellow</span>
            </div>
            <div className="text-xs text-yellow-600 mt-1">Joy, Friendship</div>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white rounded-full border" />
              <span className="text-sm font-medium text-blue-700">White</span>
            </div>
            <div className="text-xs text-blue-600 mt-1">Purity, Innocence</div>
          </div>
          <div className="p-2 bg-purple-50 rounded">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full" />
              <span className="text-sm font-medium text-purple-700">Purple</span>
            </div>
            <div className="text-xs text-purple-600 mt-1">Royalty, Success</div>
          </div>
          <div className="p-2 bg-orange-50 rounded">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded-full" />
              <span className="text-sm font-medium text-orange-700">Orange</span>
            </div>
            <div className="text-xs text-orange-600 mt-1">Energy, Enthusiasm</div>
          </div>
        </div>
      </div>
    </div>
  )
}
