import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryMatch() {
  const { t } = useTranslation()
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gridSize, setGridSize] = useState(4)
  const [gameStarted, setGameStarted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [bestTime, setBestTime] = useState<number | null>(null)

  const emojiSets = [
    '🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '⚽', '🏀', '🏈', '🎾', '⚾', '🏐', '🎱', '🏓',
    '🚗', '🚕', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒',
  ]

  const initializeGame = () => {
    const pairs = (gridSize * gridSize) / 2
    const selectedEmojis = emojiSets.slice(0, pairs)
    const cardPairs = [...selectedEmojis, ...selectedEmojis]

    // Shuffle
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]]
    }

    setCards(cardPairs.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    })))
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameStarted(true)
    setStartTime(Date.now())
    setElapsedTime(0)
  }

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (gameStarted && startTime && matches < cards.length / 2) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameStarted, startTime, matches, cards.length])

  useEffect(() => {
    if (matches > 0 && matches === cards.length / 2) {
      if (!bestTime || elapsedTime < bestTime) {
        setBestTime(elapsedTime)
      }
    }
  }, [matches, cards.length, elapsedTime, bestTime])

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return
    if (cards[id].isFlipped || cards[id].isMatched) return

    const newCards = [...cards]
    newCards[id].isFlipped = true
    setCards(newCards)

    const newFlipped = [...flippedCards, id]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      const [first, second] = newFlipped

      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[first].isMatched = true
          matchedCards[second].isMatched = true
          setCards(matchedCards)
          setMatches(matches + 1)
          setFlippedCards([])
        }, 500)
      } else {
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[first].isFlipped = false
          resetCards[second].isFlipped = false
          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isGameComplete = matches === cards.length / 2 && cards.length > 0

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {t('tools.memoryMatch.gridSize')}
            </label>
            <select
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value={2}>2x2 (Easy)</option>
              <option value={4}>4x4 (Medium)</option>
              <option value={6}>6x6 (Hard)</option>
            </select>
          </div>
          <button
            onClick={initializeGame}
            className="px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {cards.length > 0 ? t('tools.memoryMatch.restart') : t('tools.memoryMatch.start')}
          </button>
        </div>
      </div>

      {cards.length > 0 && (
        <>
          <div className="card p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{moves}</div>
                <div className="text-sm text-slate-500">{t('tools.memoryMatch.moves')}</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{matches}/{cards.length / 2}</div>
                <div className="text-sm text-slate-500">{t('tools.memoryMatch.matches')}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">{formatTime(elapsedTime)}</div>
                <div className="text-sm text-slate-500">{t('tools.memoryMatch.time')}</div>
              </div>
            </div>
            {bestTime !== null && (
              <div className="text-center mt-2 text-sm text-slate-500">
                {t('tools.memoryMatch.bestTime')}: {formatTime(bestTime)}
              </div>
            )}
          </div>

          <div className="card p-4">
            <div
              className="grid gap-2 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                maxWidth: gridSize * 80,
              }}
            >
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isFlipped || card.isMatched || flippedCards.length === 2}
                  className={`aspect-square text-3xl rounded-lg transition-all transform ${
                    card.isFlipped || card.isMatched
                      ? 'bg-white border-2 border-slate-300'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } ${card.isMatched ? 'opacity-50' : ''}`}
                  style={{ minHeight: 60 }}
                >
                  {(card.isFlipped || card.isMatched) ? card.emoji : '?'}
                </button>
              ))}
            </div>
          </div>

          {isGameComplete && (
            <div className="card p-6 bg-green-50 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-700 mb-2">
                {t('tools.memoryMatch.congratulations')}
              </h3>
              <p className="text-green-600">
                {t('tools.memoryMatch.completed', { moves, time: formatTime(elapsedTime) })}
              </p>
              <button
                onClick={initializeGame}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
              >
                {t('tools.memoryMatch.playAgain')}
              </button>
            </div>
          )}
        </>
      )}

      {cards.length === 0 && (
        <div className="card p-8 text-center text-slate-400">
          <div className="text-4xl mb-2">🎴</div>
          <p>{t('tools.memoryMatch.clickStart')}</p>
        </div>
      )}
    </div>
  )
}
