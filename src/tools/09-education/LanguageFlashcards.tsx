import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Card {
  id: number
  front: string
  back: string
  learned: boolean
  lastReviewed: number
}

interface Deck {
  id: number
  name: string
  language: string
  cards: Card[]
}

export default function LanguageFlashcards() {
  const { t } = useTranslation()
  const [decks, setDecks] = useState<Deck[]>([])
  const [mode, setMode] = useState<'list' | 'study' | 'addDeck' | 'addCard'>('list')
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [newDeck, setNewDeck] = useState({ name: '', language: '' })
  const [newCard, setNewCard] = useState({ front: '', back: '' })

  const languages = ['Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Korean', 'Italian', 'Portuguese', 'Other']

  useEffect(() => {
    const saved = localStorage.getItem('language-flashcards')
    if (saved) {
      try {
        setDecks(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load decks')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('language-flashcards', JSON.stringify(decks))
  }, [decks])

  const createDeck = () => {
    if (!newDeck.name.trim()) return
    const deck: Deck = {
      id: Date.now(),
      name: newDeck.name,
      language: newDeck.language,
      cards: [],
    }
    setDecks([...decks, deck])
    setNewDeck({ name: '', language: '' })
    setMode('list')
  }

  const deleteDeck = (id: number) => {
    setDecks(decks.filter(d => d.id !== id))
  }

  const addCard = () => {
    if (!currentDeck || !newCard.front.trim() || !newCard.back.trim()) return

    const card: Card = {
      id: Date.now(),
      front: newCard.front,
      back: newCard.back,
      learned: false,
      lastReviewed: 0,
    }

    setDecks(decks.map(d =>
      d.id === currentDeck.id ? { ...d, cards: [...d.cards, card] } : d
    ))
    setCurrentDeck({ ...currentDeck, cards: [...currentDeck.cards, card] })
    setNewCard({ front: '', back: '' })
  }

  const startStudy = (deck: Deck) => {
    const cardsToStudy = deck.cards.filter(c => !c.learned)
    if (cardsToStudy.length === 0) return

    setCurrentDeck(deck)
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setMode('study')
  }

  const markCard = (learned: boolean) => {
    if (!currentDeck) return

    const updatedCards = currentDeck.cards.map((c) => {
      const cardToStudy = currentDeck.cards.filter(card => !card.learned)[currentCardIndex]
      if (c.id === cardToStudy?.id) {
        return { ...c, learned, lastReviewed: Date.now() }
      }
      return c
    })

    const updatedDeck = { ...currentDeck, cards: updatedCards }
    setDecks(decks.map(d => d.id === currentDeck.id ? updatedDeck : d))
    setCurrentDeck(updatedDeck)

    const remainingCards = updatedCards.filter(c => !c.learned)
    if (remainingCards.length === 0 || currentCardIndex >= remainingCards.length) {
      setMode('list')
    } else {
      setIsFlipped(false)
    }
  }

  const resetDeck = (deckId: number) => {
    setDecks(decks.map(d => {
      if (d.id === deckId) {
        return {
          ...d,
          cards: d.cards.map(c => ({ ...c, learned: false })),
        }
      }
      return d
    }))
  }

  const cardsToStudy = currentDeck?.cards.filter(c => !c.learned) || []
  const currentCard = cardsToStudy[currentCardIndex]

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('addDeck')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.languageFlashcards.newDeck')}
          </button>

          {decks.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.languageFlashcards.noDecks')}
            </div>
          ) : (
            <div className="space-y-2">
              {decks.map(deck => {
                const learned = deck.cards.filter(c => c.learned).length
                const total = deck.cards.length

                return (
                  <div key={deck.id} className="card p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{deck.name}</div>
                        <div className="text-xs text-slate-500">
                          {deck.language} • {learned}/{total} {t('tools.languageFlashcards.learned')}
                        </div>
                        <div className="h-1 bg-slate-200 rounded mt-2">
                          <div
                            className="h-full bg-green-500 rounded"
                            style={{ width: `${total > 0 ? (learned / total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <button onClick={() => deleteDeck(deck.id)} className="text-red-500 ml-2">×</button>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => { setCurrentDeck(deck); setMode('addCard') }}
                        className="flex-1 py-1 text-sm bg-slate-100 rounded"
                      >
                        + {t('tools.languageFlashcards.addCards')}
                      </button>
                      <button
                        onClick={() => startStudy(deck)}
                        disabled={deck.cards.length === 0 || learned === total}
                        className="flex-1 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
                      >
                        {t('tools.languageFlashcards.study')}
                      </button>
                      {learned > 0 && (
                        <button
                          onClick={() => resetDeck(deck.id)}
                          className="py-1 px-2 text-sm bg-yellow-100 text-yellow-700 rounded"
                        >
                          ↻
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {mode === 'addDeck' && (
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.languageFlashcards.deckName')}
            </label>
            <input
              type="text"
              value={newDeck.name}
              onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder={t('tools.languageFlashcards.deckNamePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.languageFlashcards.language')}
            </label>
            <select
              value={newDeck.language}
              onChange={(e) => setNewDeck({ ...newDeck, language: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="">{t('tools.languageFlashcards.selectLanguage')}</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMode('list')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button onClick={createDeck} disabled={!newDeck.name.trim()} className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
              {t('tools.languageFlashcards.create')}
            </button>
          </div>
        </div>
      )}

      {mode === 'addCard' && currentDeck && (
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-medium mb-3">{currentDeck.name}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('tools.languageFlashcards.front')}
                </label>
                <input
                  type="text"
                  value={newCard.front}
                  onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                  placeholder={t('tools.languageFlashcards.wordPhrase')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('tools.languageFlashcards.back')}
                </label>
                <input
                  type="text"
                  value={newCard.back}
                  onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                  placeholder={t('tools.languageFlashcards.translation')}
                />
              </div>
              <button
                onClick={addCard}
                disabled={!newCard.front.trim() || !newCard.back.trim()}
                className="w-full py-2 bg-green-500 text-white rounded disabled:opacity-50"
              >
                + {t('tools.languageFlashcards.addCard')}
              </button>
            </div>
          </div>

          {currentDeck.cards.length > 0 && (
            <div className="card p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                {currentDeck.cards.length} {t('tools.languageFlashcards.cardsInDeck')}
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {currentDeck.cards.map(card => (
                  <div key={card.id} className="text-sm p-2 bg-slate-50 rounded flex justify-between">
                    <span>{card.front}</span>
                    <span className="text-slate-500">{card.back}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setMode('list')} className="w-full py-2 bg-slate-100 rounded">
            {t('common.done')}
          </button>
        </div>
      )}

      {mode === 'study' && currentDeck && currentCard && (
        <div className="space-y-4">
          <div className="text-center text-sm text-slate-500">
            {currentCardIndex + 1} / {cardsToStudy.length}
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="card p-8 min-h-[200px] flex items-center justify-center cursor-pointer"
          >
            <div className="text-center">
              <div className="text-2xl font-medium">
                {isFlipped ? currentCard.back : currentCard.front}
              </div>
              {!isFlipped && (
                <div className="text-sm text-slate-400 mt-4">
                  {t('tools.languageFlashcards.tapToFlip')}
                </div>
              )}
            </div>
          </div>

          {isFlipped && (
            <div className="flex gap-2">
              <button
                onClick={() => markCard(false)}
                className="flex-1 py-3 bg-red-500 text-white rounded font-medium"
              >
                {t('tools.languageFlashcards.again')}
              </button>
              <button
                onClick={() => markCard(true)}
                className="flex-1 py-3 bg-green-500 text-white rounded font-medium"
              >
                {t('tools.languageFlashcards.gotIt')}
              </button>
            </div>
          )}

          <button onClick={() => setMode('list')} className="w-full py-2 bg-slate-100 rounded">
            {t('tools.languageFlashcards.exitStudy')}
          </button>
        </div>
      )}
    </div>
  )
}
