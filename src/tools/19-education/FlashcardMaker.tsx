import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Flashcard {
  id: number
  front: string
  back: string
  category: string
}

export default function FlashcardMaker() {
  const { t } = useTranslation()
  const [cards, setCards] = useState<Flashcard[]>([])
  const [newCard, setNewCard] = useState({ front: '', back: '', category: 'General' })
  const [categories, _setCategories] = useState<string[]>(['General', 'Science', 'Math', 'History', 'Language'])
  const [studyMode, setStudyMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')

  const addCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return
    setCards([...cards, { ...newCard, id: Date.now() }])
    setNewCard({ front: '', back: '', category: newCard.category })
  }

  const removeCard = (id: number) => {
    setCards(cards.filter(c => c.id !== id))
  }

  const filteredCards = filterCategory === 'All'
    ? cards
    : cards.filter(c => c.category === filterCategory)

  const startStudy = () => {
    if (filteredCards.length === 0) return
    setStudyMode(true)
    setCurrentIndex(0)
    setShowAnswer(false)
  }

  const nextCard = () => {
    setShowAnswer(false)
    setCurrentIndex((currentIndex + 1) % filteredCards.length)
  }

  const prevCard = () => {
    setShowAnswer(false)
    setCurrentIndex((currentIndex - 1 + filteredCards.length) % filteredCards.length)
  }

  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5)
    setCards(cards.filter(c => !filteredCards.includes(c)).concat(shuffled))
    setCurrentIndex(0)
    setShowAnswer(false)
  }

  const exportCards = () => {
    const data = cards.map(c => `${c.front}\t${c.back}\t${c.category}`).join('\n')
    navigator.clipboard.writeText(data)
  }

  if (studyMode && filteredCards.length > 0) {
    const card = filteredCards[currentIndex]
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {currentIndex + 1} / {filteredCards.length}
          </span>
          <button onClick={() => setStudyMode(false)} className="text-blue-500 text-sm">
            Exit Study Mode
          </button>
        </div>

        <div
          onClick={() => setShowAnswer(!showAnswer)}
          className="card p-8 min-h-[200px] flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-2">{showAnswer ? 'Answer' : 'Question'}</div>
            <div className="text-xl font-medium">
              {showAnswer ? card.back : card.front}
            </div>
            <div className="text-xs text-slate-400 mt-4">Click to flip</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={prevCard} className="flex-1 py-2 bg-slate-200 rounded hover:bg-slate-300">
            Previous
          </button>
          <button onClick={shuffleCards} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">
            Shuffle
          </button>
          <button onClick={nextCard} className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Next
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.flashcardMaker.addCard')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newCard.front}
            onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
            placeholder="Front (Question)"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={newCard.back}
            onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
            placeholder="Back (Answer)"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="flex gap-2">
            <select
              value={newCard.category}
              onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
              className="flex-1 px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={addCard}
              disabled={!newCard.front.trim() || !newCard.back.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
            >
              Add Card
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Filter:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded text-sm"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <span className="font-medium">{filteredCards.length} cards</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {filteredCards.map((card) => (
          <div key={card.id} className="card p-3 flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium">{card.front}</div>
              <div className="text-sm text-slate-500">{card.back}</div>
              <div className="text-xs text-slate-400 mt-1">{card.category}</div>
            </div>
            <button onClick={() => removeCard(card.id)} className="text-red-400 hover:text-red-600">
              ×
            </button>
          </div>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Add flashcards to start studying
        </div>
      )}

      {filteredCards.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={startStudy}
            className="flex-1 py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
          >
            {t('tools.flashcardMaker.study')}
          </button>
          <button onClick={exportCards} className="px-4 py-3 bg-slate-200 rounded hover:bg-slate-300">
            {t('tools.flashcardMaker.export')}
          </button>
        </div>
      )}
    </div>
  )
}
