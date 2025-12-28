import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Card {
  suit: string
  value: string
  symbol: string
  color: string
}

export default function CardShuffler() {
  const { t } = useTranslation()
  const [deck, setDeck] = useState<Card[]>([])
  const [drawnCards, setDrawnCards] = useState<Card[]>([])
  const [shuffling, setShuffling] = useState(false)

  const suits = [
    { name: 'hearts', symbol: '♥', color: 'text-red-500' },
    { name: 'diamonds', symbol: '♦', color: 'text-red-500' },
    { name: 'clubs', symbol: '♣', color: 'text-slate-800' },
    { name: 'spades', symbol: '♠', color: 'text-slate-800' },
  ]

  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

  const createDeck = (): Card[] => {
    const newDeck: Card[] = []
    for (const suit of suits) {
      for (const value of values) {
        newDeck.push({
          suit: suit.name,
          value,
          symbol: suit.symbol,
          color: suit.color,
        })
      }
    }
    return newDeck
  }

  const shuffleDeck = () => {
    setShuffling(true)
    setDrawnCards([])

    setTimeout(() => {
      const newDeck = createDeck()
      // Fisher-Yates shuffle
      for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
      }
      setDeck(newDeck)
      setShuffling(false)
    }, 500)
  }

  const drawCard = () => {
    if (deck.length === 0) return
    const newDeck = [...deck]
    const card = newDeck.pop()!
    setDeck(newDeck)
    setDrawnCards(prev => [card, ...prev])
  }

  const drawMultiple = (count: number) => {
    if (deck.length === 0) return
    const newDeck = [...deck]
    const cards: Card[] = []
    for (let i = 0; i < Math.min(count, newDeck.length); i++) {
      cards.push(newDeck.pop()!)
    }
    setDeck(newDeck)
    setDrawnCards(prev => [...cards, ...prev])
  }

  const resetDeck = () => {
    setDeck([])
    setDrawnCards([])
  }

  const CardDisplay = ({ card, size = 'normal' }: { card: Card; size?: 'normal' | 'small' }) => (
    <div className={`${size === 'small' ? 'w-12 h-16' : 'w-20 h-28'} bg-white border-2 border-slate-300 rounded-lg shadow flex flex-col items-center justify-center`}>
      <span className={`${size === 'small' ? 'text-sm' : 'text-lg'} font-bold ${card.color}`}>
        {card.value}
      </span>
      <span className={`${size === 'small' ? 'text-lg' : 'text-2xl'} ${card.color}`}>
        {card.symbol}
      </span>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={shuffleDeck}
            disabled={shuffling}
            className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-blue-300"
          >
            {shuffling ? t('tools.cardShuffler.shuffling') : t('tools.cardShuffler.shuffle')}
          </button>
          <button
            onClick={drawCard}
            disabled={deck.length === 0}
            className="flex-1 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 disabled:bg-green-300"
          >
            {t('tools.cardShuffler.drawCard')}
          </button>
          <button
            onClick={resetDeck}
            className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            {t('tools.cardShuffler.reset')}
          </button>
        </div>

        {deck.length > 0 && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => drawMultiple(5)}
              disabled={deck.length === 0}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
            >
              {t('tools.cardShuffler.draw5')}
            </button>
            <button
              onClick={() => drawMultiple(7)}
              disabled={deck.length === 0}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
            >
              {t('tools.cardShuffler.draw7')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.cardShuffler.deck')}</h3>
          <span className="text-sm text-slate-500">
            {deck.length} {t('tools.cardShuffler.cardsRemaining')}
          </span>
        </div>

        {deck.length === 0 && drawnCards.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            {t('tools.cardShuffler.clickShuffle')}
          </div>
        ) : deck.length > 0 ? (
          <div className="flex items-center justify-center">
            <div className="relative">
              {deck.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-28 bg-blue-600 border-2 border-blue-700 rounded-lg absolute"
                  style={{ left: i * 2, top: i * 2 }}
                />
              ))}
              <div className="w-20 h-28 bg-blue-600 border-2 border-blue-700 rounded-lg flex items-center justify-center relative">
                <span className="text-white text-2xl">🂠</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            {t('tools.cardShuffler.deckEmpty')}
          </div>
        )}
      </div>

      {drawnCards.length > 0 && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">{t('tools.cardShuffler.drawnCards')}</h3>
            <span className="text-sm text-slate-500">{drawnCards.length} cards</span>
          </div>

          {drawnCards.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-slate-500 mb-2">{t('tools.cardShuffler.lastDrawn')}</div>
              <div className="flex justify-center">
                <CardDisplay card={drawnCards[0]} />
              </div>
            </div>
          )}

          {drawnCards.length > 1 && (
            <div>
              <div className="text-sm text-slate-500 mb-2">{t('tools.cardShuffler.previousCards')}</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {drawnCards.slice(1, 13).map((card, i) => (
                  <CardDisplay key={i} card={card} size="small" />
                ))}
                {drawnCards.length > 13 && (
                  <div className="w-12 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-sm text-slate-500">
                    +{drawnCards.length - 13}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.cardShuffler.cardGames')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-white rounded">{t('tools.cardShuffler.poker')}: 5 cards</div>
          <div className="p-2 bg-white rounded">{t('tools.cardShuffler.blackjack')}: 2 cards</div>
          <div className="p-2 bg-white rounded">{t('tools.cardShuffler.bridge')}: 13 cards</div>
          <div className="p-2 bg-white rounded">{t('tools.cardShuffler.solitaire')}: 7 piles</div>
        </div>
      </div>
    </div>
  )
}
