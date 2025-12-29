import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const EMOJI_SETS = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  food: ['🍎', '🍊', '🍋', '🍇', '🍓', '🫐', '🍕', '🍔', '🌮', '🍣', '🍰', '🧁'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '⛳', '🥊', '🏊', '🚴', '🏄'],
  nature: ['🌸', '🌻', '🌹', '🌺', '🌈', '⭐', '🌙', '☀️', '🌊', '🔥', '❄️', '🌲']
}

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export default function EmojiMemoryGame() {
  const { t } = useTranslation()
  const [emojiSet, setEmojiSet] = useState<keyof typeof EMOJI_SETS>('animals')
  const [gridSize, setGridSize] = useState<4 | 6>(4)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [bestTime, setBestTime] = useState<Record<string, number>>({})

  const initializeGame = () => {
    const pairCount = (gridSize * gridSize) / 2
    const emojis = EMOJI_SETS[emojiSet].slice(0, pairCount)
    const cardPairs = [...emojis, ...emojis]

    // Shuffle
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]]
    }

    const newCards: Card[] = cardPairs.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }))

    setCards(newCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setIsPlaying(true)
    setStartTime(Date.now())
    setElapsedTime(0)
  }

  useEffect(() => {
    let interval: number
    if (isPlaying && startTime) {
      interval = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, startTime])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      const firstCard = cards[first]
      const secondCard = cards[second]

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            )
          )
          setMatches(prev => prev + 1)
          setFlippedCards([])

          // Check if game is complete
          const newMatches = matches + 1
          const totalPairs = (gridSize * gridSize) / 2
          if (newMatches === totalPairs) {
            setIsPlaying(false)
            const key = `${emojiSet}-${gridSize}`
            const currentBest = bestTime[key] || Infinity
            if (elapsedTime < currentBest) {
              setBestTime(prev => ({ ...prev, [key]: elapsedTime }))
            }
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }, [flippedCards, cards, matches, gridSize, elapsedTime, emojiSet, bestTime])

  const handleCardClick = (id: number) => {
    if (!isPlaying) return
    if (flippedCards.length === 2) return
    if (flippedCards.includes(id)) return
    if (cards[id].isMatched) return
    if (cards[id].isFlipped) return

    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    )
    setFlippedCards(prev => [...prev, id])

    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const totalPairs = (gridSize * gridSize) / 2
  const isComplete = matches === totalPairs && !isPlaying && cards.length > 0

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(Object.keys(EMOJI_SETS) as (keyof typeof EMOJI_SETS)[]).map(set => (
            <button
              key={set}
              onClick={() => {
                setEmojiSet(set)
                setCards([])
                setIsPlaying(false)
              }}
              className={`flex-1 py-2 rounded capitalize text-sm ${
                emojiSet === set ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {EMOJI_SETS[set][0]} {set}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          {([4, 6] as const).map(size => (
            <button
              key={size}
              onClick={() => {
                setGridSize(size)
                setCards([])
                setIsPlaying(false)
              }}
              className={`flex-1 py-2 rounded ${
                gridSize === size ? 'bg-purple-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{moves}</div>
            <div className="text-sm text-slate-500">{t('tools.emojiMemoryGame.moves')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{matches}/{totalPairs}</div>
            <div className="text-sm text-slate-500">{t('tools.emojiMemoryGame.pairs')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{formatTime(elapsedTime)}</div>
            <div className="text-sm text-slate-500">{t('tools.emojiMemoryGame.time')}</div>
          </div>
        </div>
      </div>

      {cards.length > 0 ? (
        <div className="card p-4">
          <div
            className="grid gap-2 max-w-md mx-auto"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-lg text-3xl flex items-center justify-center transition-all duration-300 ${
                  card.isFlipped || card.isMatched
                    ? 'bg-white border-2 border-blue-500 scale-100'
                    : 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700'
                } ${card.isMatched ? 'opacity-60' : ''}`}
              >
                {card.isFlipped || card.isMatched ? card.emoji : ''}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">
            {EMOJI_SETS[emojiSet].slice(0, 4).join('')}
          </div>
          <h3 className="text-lg font-medium mb-2">{t('tools.emojiMemoryGame.title')}</h3>
          <p className="text-slate-500 mb-4">{t('tools.emojiMemoryGame.instructions')}</p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={initializeGame}
          className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {cards.length > 0 ? t('tools.emojiMemoryGame.restart') : t('tools.emojiMemoryGame.start')}
        </button>
      </div>

      {isComplete && (
        <div className="card p-4 bg-green-50 text-center">
          <div className="text-2xl mb-2">🎉</div>
          <div className="text-xl font-bold text-green-700 mb-2">
            {t('tools.emojiMemoryGame.congratulations')}
          </div>
          <p className="text-slate-600">
            {t('tools.emojiMemoryGame.completedIn', { moves, time: formatTime(elapsedTime) })}
          </p>
          {bestTime[`${emojiSet}-${gridSize}`] && (
            <p className="text-sm text-slate-500 mt-2">
              {t('tools.emojiMemoryGame.bestTime')}: {formatTime(bestTime[`${emojiSet}-${gridSize}`])}
            </p>
          )}
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.emojiMemoryGame.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.emojiMemoryGame.tip1')}</li>
          <li>* {t('tools.emojiMemoryGame.tip2')}</li>
          <li>* {t('tools.emojiMemoryGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
