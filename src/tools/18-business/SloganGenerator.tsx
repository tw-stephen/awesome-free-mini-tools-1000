import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SloganGenerator() {
  const { t } = useTranslation()
  const [brand, setBrand] = useState('')
  const [product, setProduct] = useState('')
  const [keywords, setKeywords] = useState('')
  const [tone, setTone] = useState('professional')
  const [slogans, setSlogans] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  const templates: Record<string, string[]> = {
    professional: [
      '[Brand] - Excellence in Every [Product]',
      '[Brand]: Where Quality Meets [Keyword]',
      'Trust [Brand] for Your [Product] Needs',
      '[Brand] - The [Keyword] Choice',
      'Experience [Keyword] with [Brand]',
      '[Brand]: Defining [Product] Standards',
      'Your [Keyword] Partner - [Brand]',
      '[Brand] - [Keyword] You Can Trust',
    ],
    casual: [
      '[Brand] - Keep It [Keyword]!',
      'Life\u0027s Better with [Brand]',
      '[Brand]: Simply [Keyword]',
      'Get Your [Keyword] On with [Brand]',
      '[Brand] - Because [Keyword] Matters',
      'Just [Brand] It!',
      '[Brand] Makes [Product] Easy',
      'Hello [Keyword], Hello [Brand]',
    ],
    inspiring: [
      '[Brand] - Dare to [Keyword]',
      'Unlock Your [Keyword] with [Brand]',
      '[Brand]: The Future of [Product]',
      'Dream [Keyword]. Choose [Brand].',
      '[Brand] - Where Dreams Meet [Keyword]',
      'Inspire [Keyword] Every Day - [Brand]',
      '[Brand]: Beyond [Product]',
      'Your [Keyword] Journey Starts with [Brand]',
    ],
    playful: [
      '[Brand] - [Keyword] Happens Here!',
      'Oops, We Did It [Keyword]! - [Brand]',
      '[Brand]: [Keyword] Like Never Before',
      'Holy [Keyword]! It\u0027s [Brand]',
      '[Brand] - The [Keyword] Squad',
      'More [Keyword], More [Brand]',
      '[Brand] Makes [Product] Fun!',
      'Let\u0027s Get [Keyword] with [Brand]',
    ],
  }

  const generateSlogans = () => {
    const brandName = brand || 'Brand'
    const productName = product || 'Product'
    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k)
    const keywordToUse = keywordList.length > 0 ? keywordList[Math.floor(Math.random() * keywordList.length)] : 'Quality'

    const toneTemplates = templates[tone] || templates.professional
    const generated = toneTemplates.map(template =>
      template
        .replace(/\[Brand\]/g, brandName)
        .replace(/\[Product\]/g, productName)
        .replace(/\[Keyword\]/g, keywordToUse.charAt(0).toUpperCase() + keywordToUse.slice(1))
    )

    // Shuffle and take random selection
    const shuffled = generated.sort(() => Math.random() - 0.5).slice(0, 6)
    setSlogans(shuffled)
  }

  const toggleFavorite = (slogan: string) => {
    if (favorites.includes(slogan)) {
      setFavorites(favorites.filter(f => f !== slogan))
    } else {
      setFavorites([...favorites, slogan])
    }
  }

  const copySlogan = (slogan: string) => {
    navigator.clipboard.writeText(slogan)
  }

  const copyAllFavorites = () => {
    navigator.clipboard.writeText(favorites.join('\n'))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.sloganGenerator.info')}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Brand Name</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Your brand..."
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Product/Service</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Product or service..."
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Keywords (comma-separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="innovation, quality, trust..."
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Tone</label>
            <div className="flex gap-2">
              {['professional', 'casual', 'inspiring', 'playful'].map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`flex-1 py-2 rounded ${
                    tone === t ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={generateSlogans}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.sloganGenerator.generate')}
      </button>

      {slogans.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.sloganGenerator.results')}</h3>
          <div className="space-y-2">
            {slogans.map((slogan, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-50 rounded"
              >
                <span className="font-medium text-lg">{slogan}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => copySlogan(slogan)}
                    className="px-2 py-1 text-xs bg-slate-200 rounded hover:bg-slate-300"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => toggleFavorite(slogan)}
                    className={`px-2 py-1 text-xs rounded ${
                      favorites.includes(slogan)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    {favorites.includes(slogan) ? '★' : '☆'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="card p-4 bg-yellow-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.sloganGenerator.favorites')} ({favorites.length})</h3>
            <button
              onClick={copyAllFavorites}
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
            >
              Copy All
            </button>
          </div>
          <div className="space-y-1">
            {favorites.map((slogan, i) => (
              <div key={i} className="p-2 bg-white rounded">
                {slogan}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
