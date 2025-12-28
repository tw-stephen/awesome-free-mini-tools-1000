import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Flashcard {
  id: number
  front: string
  back: string
}

export default function FlashcardMaker() {
  const { t } = useTranslation()
  const [cards, setCards] = useState<Flashcard[]>([])
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [mode, setMode] = useState<'create' | 'study'>('create')

  useEffect(() => {
    const saved = localStorage.getItem('flashcards')
    if (saved) {
      try {
        setCards(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load flashcards')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(cards))
  }, [cards])

  const addCard = () => {
    if (newFront.trim() && newBack.trim()) {
      setCards([...cards, { id: Date.now(), front: newFront, back: newBack }])
      setNewFront('')
      setNewBack('')
    }
  }

  const deleteCard = (id: number) => {
    setCards(cards.filter(c => c.id !== id))
  }

  const nextCard = () => {
    setShowBack(false)
    setCurrentIndex((currentIndex + 1) % cards.length)
  }

  const prevCard = () => {
    setShowBack(false)
    setCurrentIndex((currentIndex - 1 + cards.length) % cards.length)
  }

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
    setShowBack(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('create')}
          className={`flex-1 py-2 rounded font-medium ${mode === 'create' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.flashcardMaker.create')}
        </button>
        <button
          onClick={() => { setMode('study'); setCurrentIndex(0); setShowBack(false) }}
          disabled={cards.length === 0}
          className={`flex-1 py-2 rounded font-medium ${mode === 'study' ? 'bg-blue-500 text-white' : 'bg-slate-100'} disabled:opacity-50`}
        >
          {t('tools.flashcardMaker.study')} ({cards.length})
        </button>
      </div>

      {mode === 'create' && (
        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.flashcardMaker.front')}
              </label>
              <textarea
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                placeholder={t('tools.flashcardMaker.frontPlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.flashcardMaker.back')}
              </label>
              <textarea
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                placeholder={t('tools.flashcardMaker.backPlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
                rows={2}
              />
            </div>
            <button
              onClick={addCard}
              className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              + {t('tools.flashcardMaker.addCard')}
            </button>
          </div>

          {cards.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.flashcardMaker.yourCards')} ({cards.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cards.map((card) => (
                  <div key={card.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{card.front}</div>
                      <div className="text-xs text-slate-500 truncate">{card.back}</div>
                    </div>
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="ml-2 text-red-500 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'study' && cards.length > 0 && (
        <div className="space-y-4">
          <div className="text-center text-sm text-slate-500">
            {currentIndex + 1} / {cards.length}
          </div>

          <div
            className="card p-8 min-h-48 flex items-center justify-center cursor-pointer transition-all"
            onClick={() => setShowBack(!showBack)}
          >
            <div className="text-center">
              <div className={`text-lg ${showBack ? 'text-blue-600' : 'text-slate-800'}`}>
                {showBack ? cards[currentIndex].back : cards[currentIndex].front}
              </div>
              <div className="text-xs text-slate-400 mt-4">
                {showBack ? t('tools.flashcardMaker.clickToFlip') : t('tools.flashcardMaker.clickToReveal')}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevCard}
              className="flex-1 py-2 bg-slate-100 rounded font-medium hover:bg-slate-200"
            >
              ← {t('tools.flashcardMaker.prev')}
            </button>
            <button
              onClick={shuffleCards}
              className="px-4 py-2 bg-slate-100 rounded font-medium hover:bg-slate-200"
            >
              🔀
            </button>
            <button
              onClick={nextCard}
              className="flex-1 py-2 bg-slate-100 rounded font-medium hover:bg-slate-200"
            >
              {t('tools.flashcardMaker.next')} →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
