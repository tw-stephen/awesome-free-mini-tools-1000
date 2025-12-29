import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const WORDS = [
  'CAT', 'DOG', 'SUN', 'RUN', 'FUN',
  'BOOK', 'TREE', 'HOME', 'LOVE', 'STAR',
  'APPLE', 'BEACH', 'CLOUD', 'DANCE', 'EARTH',
  'FLOWER', 'GARDEN', 'HAPPY', 'ISLAND', 'JUNGLE',
  'KITCHEN', 'LIBRARY', 'MORNING', 'NETWORK', 'ORANGE'
]

interface Tile {
  id: number
  letter: string
  isUsed: boolean
}

export default function LetterTileGame() {
  const { t } = useTranslation()
  const [targetWord, setTargetWord] = useState('')
  const [tiles, setTiles] = useState<Tile[]>([])
  const [selectedTiles, setSelectedTiles] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [hint, setHint] = useState('')
  const [showHint, setShowHint] = useState(false)

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const generateRound = () => {
    // Select word based on level
    const wordPool = WORDS.filter(w => {
      if (level <= 2) return w.length <= 3
      if (level <= 4) return w.length <= 4
      if (level <= 6) return w.length <= 5
      if (level <= 8) return w.length <= 6
      return true
    })

    const word = wordPool[Math.floor(Math.random() * wordPool.length)]
    setTargetWord(word)

    // Generate tiles with extra letters
    const wordLetters = word.split('')
    const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      .split('')
      .filter(l => !wordLetters.includes(l))

    const extraCount = Math.max(2, Math.min(5, level))
    const shuffledExtra = shuffleArray(extraLetters).slice(0, extraCount)

    const allLetters = shuffleArray([...wordLetters, ...shuffledExtra])
    const newTiles: Tile[] = allLetters.map((letter, index) => ({
      id: index,
      letter,
      isUsed: false
    }))

    setTiles(newTiles)
    setSelectedTiles([])
    setFeedback(null)
    setShowHint(false)
    setHint(word[0] + '...')
  }

  useEffect(() => {
    generateRound()
  }, [level])

  const handleTileClick = (id: number) => {
    if (feedback === 'correct') return

    const tile = tiles.find(t => t.id === id)
    if (!tile || tile.isUsed) return

    setTiles(prev => prev.map(t => t.id === id ? { ...t, isUsed: true } : t))
    setSelectedTiles(prev => [...prev, id])
  }

  const handleRemoveLetter = (index: number) => {
    if (feedback === 'correct') return

    const tileId = selectedTiles[index]
    setTiles(prev => prev.map(t => t.id === tileId ? { ...t, isUsed: false } : t))
    setSelectedTiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleClear = () => {
    setTiles(prev => prev.map(t => ({ ...t, isUsed: false })))
    setSelectedTiles([])
  }

  const handleSubmit = () => {
    const currentWord = selectedTiles
      .map(id => tiles.find(t => t.id === id)?.letter)
      .join('')

    if (currentWord === targetWord) {
      setFeedback('correct')
      const points = targetWord.length * 10 + streak * 5 - (showHint ? 10 : 0)
      setScore(prev => prev + Math.max(points, 5))
      setStreak(prev => prev + 1)

      setTimeout(() => {
        setLevel(prev => prev + 1)
      }, 1500)
    } else {
      setFeedback('wrong')
      setStreak(0)
      setTimeout(() => setFeedback(null), 1000)
    }
  }

  const currentWord = selectedTiles
    .map(id => tiles.find(t => t.id === id)?.letter)
    .join('')

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.letterTileGame.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{level}</div>
            <div className="text-sm text-slate-500">{t('tools.letterTileGame.level')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{streak}</div>
            <div className="text-sm text-slate-500">{t('tools.letterTileGame.streak')}</div>
          </div>
        </div>
      </div>

      <div className={`card p-6 ${
        feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : ''
      }`}>
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium mb-2">
            {t('tools.letterTileGame.findWord')}
          </h3>
          <p className="text-slate-500">
            {targetWord.length} {t('tools.letterTileGame.letters')}
            {showHint && ` - ${t('tools.letterTileGame.startsWithHint')}: ${hint}`}
          </p>
        </div>

        {/* Current word display */}
        <div className="flex justify-center gap-1 mb-6 min-h-[48px]">
          {selectedTiles.length > 0 ? (
            selectedTiles.map((id, index) => {
              const tile = tiles.find(t => t.id === id)
              return (
                <button
                  key={index}
                  onClick={() => handleRemoveLetter(index)}
                  className="w-12 h-12 bg-blue-500 text-white rounded-lg text-xl font-bold hover:bg-blue-600"
                >
                  {tile?.letter}
                </button>
              )
            })
          ) : (
            <div className="text-slate-400 flex items-center">
              {t('tools.letterTileGame.selectLetters')}
            </div>
          )}
        </div>

        {/* Available tiles */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {tiles.map(tile => (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile.id)}
              disabled={tile.isUsed}
              className={`w-12 h-12 rounded-lg text-xl font-bold transition-all ${
                tile.isUsed
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500 hover:scale-105'
              }`}
            >
              {tile.letter}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-2">
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
          >
            {t('tools.letterTileGame.clear')}
          </button>
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
            >
              {t('tools.letterTileGame.hint')}
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={selectedTiles.length === 0}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {t('tools.letterTileGame.check')}
          </button>
        </div>

        {feedback === 'correct' && (
          <div className="text-center mt-4 text-green-600 font-bold text-lg">
            {t('tools.letterTileGame.correct')}
          </div>
        )}

        {feedback === 'wrong' && (
          <div className="text-center mt-4 text-red-600 font-bold text-lg">
            {t('tools.letterTileGame.tryAgain')}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={generateRound}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
        >
          {t('tools.letterTileGame.skip')}
        </button>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.letterTileGame.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.letterTileGame.tip1')}</li>
          <li>* {t('tools.letterTileGame.tip2')}</li>
          <li>* {t('tools.letterTileGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
