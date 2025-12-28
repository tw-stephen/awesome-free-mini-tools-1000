import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Quote {
  text: string
  author: string
  category: string
}

const quotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Motivation" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Motivation" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Perseverance" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Perseverance" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama", category: "Happiness" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Action" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "Life" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein", category: "Wisdom" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi", category: "Change" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "Action" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost", category: "Life" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "Perseverance" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West", category: "Life" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison", category: "Perseverance" },
  { text: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", author: "James Cameron", category: "Goals" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "Action" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford", category: "Mindset" },
]

export default function QuoteOfTheDay() {
  const { t } = useTranslation()
  const [todayQuote, setTodayQuote] = useState<Quote | null>(null)
  const [favorites, setFavorites] = useState<Quote[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const saved = localStorage.getItem('quote-of-the-day')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setFavorites(data.favorites || [])

        // Get today's quote based on date
        const today = new Date().toISOString().split('T')[0]
        if (data.lastDate === today && data.todayQuote) {
          setTodayQuote(data.todayQuote)
        } else {
          selectNewQuote()
        }
      } catch (e) {
        selectNewQuote()
      }
    } else {
      selectNewQuote()
    }
  }, [])

  useEffect(() => {
    if (todayQuote) {
      localStorage.setItem('quote-of-the-day', JSON.stringify({
        favorites,
        todayQuote,
        lastDate: new Date().toISOString().split('T')[0],
      }))
    }
  }, [favorites, todayQuote])

  const selectNewQuote = () => {
    const filteredQuotes = category === 'all'
      ? quotes
      : quotes.filter(q => q.category === category)
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length)
    setTodayQuote(filteredQuotes[randomIndex])
  }

  const getRandomQuote = () => {
    const filteredQuotes = category === 'all'
      ? quotes
      : quotes.filter(q => q.category === category)
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length)
    setTodayQuote(filteredQuotes[randomIndex])
  }

  const toggleFavorite = (quote: Quote) => {
    const exists = favorites.find(f => f.text === quote.text)
    if (exists) {
      setFavorites(favorites.filter(f => f.text !== quote.text))
    } else {
      setFavorites([...favorites, quote])
    }
  }

  const isFavorite = (quote: Quote) => {
    return favorites.some(f => f.text === quote.text)
  }

  const categories = Array.from(new Set(quotes.map(q => q.category)))

  const copyQuote = async (quote: Quote) => {
    try {
      await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`)
    } catch (e) {
      console.error('Failed to copy')
    }
  }

  return (
    <div className="space-y-4">
      {todayQuote && !showFavorites && (
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="text-4xl mb-4">"</div>
            <p className="text-xl font-serif italic text-slate-700 mb-4">
              {todayQuote.text}
            </p>
            <p className="text-slate-500">— {todayQuote.author}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-white/50 rounded-full text-sm text-slate-500">
              {todayQuote.category}
            </span>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => toggleFavorite(todayQuote)}
              className={`p-3 rounded-full ${
                isFavorite(todayQuote) ? 'bg-red-100 text-red-500' : 'bg-white text-slate-400'
              }`}
            >
              {isFavorite(todayQuote) ? '❤️' : '🤍'}
            </button>
            <button
              onClick={() => copyQuote(todayQuote)}
              className="p-3 rounded-full bg-white text-slate-400 hover:text-blue-500"
            >
              📋
            </button>
            <button
              onClick={getRandomQuote}
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
              !showFavorites ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.quoteOfDay.today')}
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className={`flex-1 py-2 rounded ${
              showFavorites ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.quoteOfDay.favorites')} ({favorites.length})
          </button>
        </div>

        {!showFavorites && (
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.quoteOfDay.category')}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('all')}
                className={`px-3 py-1 rounded-full text-sm ${
                  category === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t('tools.quoteOfDay.all')}
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === cat ? 'bg-blue-500 text-white' : 'bg-slate-100'
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
              {t('tools.quoteOfDay.noFavorites')}
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((quote, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <p className="italic text-slate-700 mb-2">"{quote.text}"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">— {quote.author}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyQuote(quote)}
                        className="p-2 text-slate-400 hover:text-blue-500"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => toggleFavorite(quote)}
                        className="p-2 text-red-500"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.quoteOfDay.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.quoteOfDay.tip1')}</li>
          <li>{t('tools.quoteOfDay.tip2')}</li>
          <li>{t('tools.quoteOfDay.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
