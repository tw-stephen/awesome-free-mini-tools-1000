import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Affirmation {
  text: string
  category: string
}

const affirmations: Affirmation[] = [
  { text: "I am worthy of love and respect.", category: "Self-Worth" },
  { text: "I believe in my ability to succeed.", category: "Confidence" },
  { text: "I am grateful for all that I have.", category: "Gratitude" },
  { text: "I choose to be happy today.", category: "Happiness" },
  { text: "I am capable of achieving my goals.", category: "Goals" },
  { text: "I deserve good things in my life.", category: "Self-Worth" },
  { text: "I am getting stronger every day.", category: "Growth" },
  { text: "I trust the process of life.", category: "Peace" },
  { text: "I am enough just as I am.", category: "Self-Worth" },
  { text: "I attract positive energy into my life.", category: "Positivity" },
  { text: "I am in charge of my own happiness.", category: "Happiness" },
  { text: "I release all negative thoughts and embrace positivity.", category: "Positivity" },
  { text: "I am surrounded by love and support.", category: "Love" },
  { text: "I have the power to create change.", category: "Power" },
  { text: "I forgive myself and others.", category: "Peace" },
  { text: "I am open to new opportunities.", category: "Opportunity" },
  { text: "I am resilient and can overcome challenges.", category: "Strength" },
  { text: "I trust my intuition and inner wisdom.", category: "Wisdom" },
  { text: "I am becoming the best version of myself.", category: "Growth" },
  { text: "I radiate confidence and positivity.", category: "Confidence" },
  { text: "My possibilities are endless.", category: "Opportunity" },
  { text: "I am at peace with my past.", category: "Peace" },
  { text: "I choose to focus on what I can control.", category: "Wisdom" },
  { text: "I am worthy of my dreams.", category: "Goals" },
  { text: "Every day brings new opportunities for growth.", category: "Growth" },
  { text: "I am calm and centered.", category: "Peace" },
  { text: "I embrace my unique qualities.", category: "Self-Worth" },
  { text: "I am creating a life I love.", category: "Goals" },
  { text: "I trust that everything happens for a reason.", category: "Wisdom" },
  { text: "I am grateful for this moment.", category: "Gratitude" },
]

export default function AffirmationGenerator() {
  const { t } = useTranslation()
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null)
  const [favorites, setFavorites] = useState<Affirmation[]>([])
  const [category, setCategory] = useState('all')
  const [customAffirmations, setCustomAffirmations] = useState<Affirmation[]>([])
  const [newAffirmation, setNewAffirmation] = useState('')
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('affirmation-generator')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setFavorites(data.favorites || [])
        setCustomAffirmations(data.custom || [])
      } catch (e) {
        console.error('Failed to load data')
      }
    }
    generateAffirmation()
  }, [])

  useEffect(() => {
    localStorage.setItem('affirmation-generator', JSON.stringify({
      favorites,
      custom: customAffirmations,
    }))
  }, [favorites, customAffirmations])

  const allAffirmations = [...affirmations, ...customAffirmations]
  const categories = Array.from(new Set(allAffirmations.map(a => a.category)))

  const generateAffirmation = () => {
    const filtered = category === 'all'
      ? allAffirmations
      : allAffirmations.filter(a => a.category === category)
    const randomIndex = Math.floor(Math.random() * filtered.length)
    setCurrentAffirmation(filtered[randomIndex] || allAffirmations[0])
  }

  const addCustomAffirmation = () => {
    if (!newAffirmation.trim()) return
    const affirmation: Affirmation = {
      text: newAffirmation,
      category: 'Custom',
    }
    setCustomAffirmations([...customAffirmations, affirmation])
    setNewAffirmation('')
  }

  const toggleFavorite = (affirmation: Affirmation) => {
    const exists = favorites.find(f => f.text === affirmation.text)
    if (exists) {
      setFavorites(favorites.filter(f => f.text !== affirmation.text))
    } else {
      setFavorites([...favorites, affirmation])
    }
  }

  const isFavorite = (affirmation: Affirmation) => {
    return favorites.some(f => f.text === affirmation.text)
  }

  const speakAffirmation = () => {
    if (currentAffirmation && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentAffirmation.text)
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-4">
      {currentAffirmation && !showFavorites && (
        <div className="card p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-xl font-medium text-slate-700 mb-4">
              {currentAffirmation.text}
            </p>
            <span className="inline-block px-3 py-1 bg-white/50 rounded-full text-sm text-slate-500">
              {currentAffirmation.category}
            </span>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => toggleFavorite(currentAffirmation)}
              className={`p-3 rounded-full ${
                isFavorite(currentAffirmation) ? 'bg-red-100 text-red-500' : 'bg-white text-slate-400'
              }`}
            >
              {isFavorite(currentAffirmation) ? '❤️' : '🤍'}
            </button>
            <button
              onClick={speakAffirmation}
              className="p-3 rounded-full bg-white text-slate-400 hover:text-purple-500"
            >
              🔊
            </button>
            <button
              onClick={generateAffirmation}
              className="p-3 rounded-full bg-white text-slate-400 hover:text-green-500"
            >
              🔄
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowFavorites(false)}
            className={`flex-1 py-2 rounded ${
              !showFavorites ? 'bg-purple-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.affirmation.generate')}
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className={`flex-1 py-2 rounded ${
              showFavorites ? 'bg-purple-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.affirmation.favorites')} ({favorites.length})
          </button>
        </div>

        {!showFavorites && (
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.affirmation.category')}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setCategory('all'); generateAffirmation() }}
                className={`px-3 py-1 rounded-full text-sm ${
                  category === 'all' ? 'bg-purple-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t('tools.affirmation.all')}
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); generateAffirmation() }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === cat ? 'bg-purple-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showFavorites && (
        <div className="card p-4">
          {favorites.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {t('tools.affirmation.noFavorites')}
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((affirmation, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-slate-700">{affirmation.text}</p>
                    <span className="text-xs text-slate-400">{affirmation.category}</span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(affirmation)}
                    className="p-2 text-red-500"
                  >
                    ❤️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.affirmation.addCustom')}
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newAffirmation}
            onChange={(e) => setNewAffirmation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomAffirmation()}
            placeholder={t('tools.affirmation.placeholder')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addCustomAffirmation}
            className="px-4 py-2 bg-purple-500 text-white rounded font-medium hover:bg-purple-600"
          >
            +
          </button>
        </div>
        {customAffirmations.length > 0 && (
          <div className="mt-3 space-y-1">
            {customAffirmations.map((a, i) => (
              <div key={i} className="text-sm text-slate-600 flex items-center gap-2">
                <span>• {a.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.affirmation.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.affirmation.tip1')}</li>
          <li>{t('tools.affirmation.tip2')}</li>
          <li>{t('tools.affirmation.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
