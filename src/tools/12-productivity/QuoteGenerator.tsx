import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Quote {
  text: string
  author: string
  category: string
}

export default function QuoteGenerator() {
  const { t } = useTranslation()
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [favorites, setFavorites] = useState<Quote[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [copied, setCopied] = useState(false)

  const quotes: Quote[] = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivation" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "business" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "motivation" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "motivation" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "wisdom" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "success" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivation" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "wisdom" },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle", category: "business" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "wisdom" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "motivation" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "life" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
    { text: "The purpose of life is not to be happy. It is to be useful.", author: "Ralph Waldo Emerson", category: "wisdom" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "success" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", category: "life" },
    { text: "Go confidently in the direction of your dreams.", author: "Henry David Thoreau", category: "motivation" },
    { text: "Whatever you are, be a good one.", author: "Abraham Lincoln", category: "wisdom" }
  ]

  const categories = ['all', 'motivation', 'business', 'wisdom', 'life', 'success']

  useEffect(() => {
    const saved = localStorage.getItem('favorite-quotes')
    if (saved) setFavorites(JSON.parse(saved))
    getRandomQuote()
  }, [])

  const getRandomQuote = () => {
    const filtered = selectedCategory === 'all'
      ? quotes
      : quotes.filter(q => q.category === selectedCategory)
    const random = filtered[Math.floor(Math.random() * filtered.length)]
    setCurrentQuote(random)
  }

  const saveFavorites = (updated: Quote[]) => {
    setFavorites(updated)
    localStorage.setItem('favorite-quotes', JSON.stringify(updated))
  }

  const toggleFavorite = () => {
    if (!currentQuote) return
    const exists = favorites.some(f => f.text === currentQuote.text)
    if (exists) {
      saveFavorites(favorites.filter(f => f.text !== currentQuote.text))
    } else {
      saveFavorites([...favorites, currentQuote])
    }
  }

  const isFavorite = currentQuote && favorites.some(f => f.text === currentQuote.text)

  const copyQuote = () => {
    if (!currentQuote) return
    navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareQuote = () => {
    if (!currentQuote) return
    const text = `"${currentQuote.text}" - ${currentQuote.author}`
    if (navigator.share) {
      navigator.share({ text })
    } else {
      copyQuote()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat)
              setTimeout(getRandomQuote, 0)
            }}
            className={`px-3 py-1.5 rounded text-sm capitalize ${
              selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.quoteGenerator.${cat}`)}
          </button>
        ))}
      </div>

      <div className="card p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-[200px] flex flex-col items-center justify-center text-center">
        {currentQuote && (
          <>
            <p className="text-xl font-serif italic text-slate-700 mb-4">
              "{currentQuote.text}"
            </p>
            <p className="text-slate-600 font-medium">— {currentQuote.author}</p>
            <span className="text-xs text-slate-400 mt-2 capitalize">{currentQuote.category}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={getRandomQuote}
          className="py-2 bg-blue-500 text-white rounded font-medium"
        >
          🔄
        </button>
        <button
          onClick={toggleFavorite}
          className={`py-2 rounded ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-slate-100'}`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        <button
          onClick={copyQuote}
          className={`py-2 rounded ${copied ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
        >
          {copied ? '✓' : '📋'}
        </button>
        <button
          onClick={shareQuote}
          className="py-2 bg-slate-100 rounded"
        >
          📤
        </button>
      </div>

      {favorites.length > 0 && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-slate-700">{t('tools.quoteGenerator.favorites')} ({favorites.length})</h3>
            <button
              onClick={() => saveFavorites([])}
              className="text-xs text-red-500"
            >
              {t('tools.quoteGenerator.clearAll')}
            </button>
          </div>
          <div className="space-y-2">
            {favorites.map((quote, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded">
                <p className="text-sm italic">"{quote.text}"</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-slate-500">— {quote.author}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`)
                    }}
                    className="text-xs text-blue-500"
                  >
                    {t('tools.quoteGenerator.copy')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-purple-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.quoteGenerator.dailyTip')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.quoteGenerator.tipText')}
        </p>
      </div>
    </div>
  )
}
