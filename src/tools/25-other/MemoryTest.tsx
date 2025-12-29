import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function MemoryTest() {
  const { t } = useTranslation()
  const [gameMode, setGameMode] = useState<'numbers' | 'colors' | 'patterns'>('numbers')
  const [status, setStatus] = useState<'ready' | 'showing' | 'input' | 'result'>('ready')
  const [sequence, setSequence] = useState<string[]>([])
  const [userSequence, setUserSequence] = useState<string[]>([])
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [showIndex, setShowIndex] = useState(-1)

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan']
  const patterns = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond']

  const getColorClass = (color: string) => {
    const classes: Record<string, string> = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-400',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      cyan: 'bg-cyan-500',
    }
    return classes[color] || 'bg-slate-500'
  }

  const getPatternSymbol = (pattern: string) => {
    const symbols: Record<string, string> = {
      circle: 'O',
      square: '#',
      triangle: '^',
      star: '*',
      heart: '<3',
      diamond: '<>',
    }
    return symbols[pattern] || '?'
  }

  const generateSequence = (length: number) => {
    const items = gameMode === 'numbers'
      ? Array.from({ length: 9 }, (_, i) => (i + 1).toString())
      : gameMode === 'colors'
        ? colors
        : patterns

    const newSequence = []
    for (let i = 0; i < length; i++) {
      newSequence.push(items[Math.floor(Math.random() * items.length)])
    }
    return newSequence
  }

  const startGame = () => {
    const newSequence = generateSequence(3 + level)
    setSequence(newSequence)
    setUserSequence([])
    setStatus('showing')
    setShowIndex(0)
  }

  useEffect(() => {
    if (status === 'showing' && showIndex >= 0) {
      if (showIndex < sequence.length) {
        const timer = setTimeout(() => {
          setShowIndex(prev => prev + 1)
        }, 800)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setStatus('input')
          setShowIndex(-1)
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [status, showIndex, sequence.length])

  const handleInput = (item: string) => {
    if (status !== 'input') return

    const newUserSequence = [...userSequence, item]
    setUserSequence(newUserSequence)

    const currentIndex = newUserSequence.length - 1
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      setStatus('result')
      if (score > highScore) {
        setHighScore(score)
      }
      return
    }

    if (newUserSequence.length === sequence.length) {
      setScore(prev => prev + level * 10)
      setLevel(prev => prev + 1)
      setTimeout(() => {
        startGame()
      }, 500)
    }
  }

  const resetGame = () => {
    setLevel(1)
    setScore(0)
    setSequence([])
    setUserSequence([])
    setStatus('ready')
    setShowIndex(-1)
  }

  const renderInputButtons = () => {
    const items = gameMode === 'numbers'
      ? Array.from({ length: 9 }, (_, i) => (i + 1).toString())
      : gameMode === 'colors'
        ? colors
        : patterns

    if (gameMode === 'numbers') {
      return (
        <div className="grid grid-cols-3 gap-2">
          {items.map(item => (
            <button
              key={item}
              onClick={() => handleInput(item)}
              disabled={status !== 'input'}
              className="py-4 bg-slate-100 hover:bg-slate-200 rounded text-2xl font-bold disabled:opacity-50"
            >
              {item}
            </button>
          ))}
        </div>
      )
    }

    if (gameMode === 'colors') {
      return (
        <div className="grid grid-cols-4 gap-2">
          {items.map(item => (
            <button
              key={item}
              onClick={() => handleInput(item)}
              disabled={status !== 'input'}
              className={`h-16 rounded ${getColorClass(item)} hover:opacity-80 disabled:opacity-50`}
            />
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-3 gap-2">
        {items.map(item => (
          <button
            key={item}
            onClick={() => handleInput(item)}
            disabled={status !== 'input'}
            className="py-4 bg-slate-100 hover:bg-slate-200 rounded text-2xl disabled:opacity-50"
          >
            {getPatternSymbol(item)}
          </button>
        ))}
      </div>
    )
  }

  const renderSequenceDisplay = () => {
    if (status === 'showing' && showIndex >= 0 && showIndex < sequence.length) {
      const item = sequence[showIndex]
      if (gameMode === 'numbers') {
        return <div className="text-6xl font-bold text-blue-600">{item}</div>
      }
      if (gameMode === 'colors') {
        return <div className={`w-24 h-24 rounded-full ${getColorClass(item)}`} />
      }
      return <div className="text-6xl">{getPatternSymbol(item)}</div>
    }

    if (status === 'input') {
      return (
        <div className="text-center">
          <div className="text-xl text-slate-600 mb-2">{t('tools.memoryTest.yourTurn')}</div>
          <div className="text-sm text-slate-500">
            {userSequence.length} / {sequence.length}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.memoryTest.gameMode')}</h3>
        <div className="flex gap-2">
          {(['numbers', 'colors', 'patterns'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => {
                setGameMode(mode)
                resetGame()
              }}
              disabled={status !== 'ready' && status !== 'result'}
              className={`flex-1 py-2 rounded capitalize ${
                gameMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 disabled:opacity-50'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-slate-500">{t('tools.memoryTest.level')}</div>
            <div className="text-2xl font-bold text-blue-600">{level}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-500">{t('tools.memoryTest.score')}</div>
            <div className="text-2xl font-bold text-green-600">{score}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">{t('tools.memoryTest.highScore')}</div>
            <div className="text-2xl font-bold text-purple-600">{highScore}</div>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <div className="h-32 flex items-center justify-center">
          {renderSequenceDisplay()}
          {status === 'ready' && (
            <button
              onClick={startGame}
              className="px-8 py-4 bg-green-500 text-white rounded-lg text-xl hover:bg-green-600"
            >
              {t('tools.memoryTest.start')}
            </button>
          )}
          {status === 'result' && (
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500 mb-2">{t('tools.memoryTest.gameOver')}</div>
              <div className="text-slate-600 mb-4">
                {t('tools.memoryTest.finalScore')}: {score}
              </div>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t('tools.memoryTest.playAgain')}
              </button>
            </div>
          )}
        </div>
      </div>

      {status === 'input' && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.memoryTest.enterSequence')}</h3>
          {renderInputButtons()}
        </div>
      )}

      {status === 'input' && userSequence.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.memoryTest.yourInput')}</h3>
          <div className="flex flex-wrap gap-2">
            {userSequence.map((item, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded ${
                  gameMode === 'colors'
                    ? `${getColorClass(item)} text-white`
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {gameMode === 'patterns' ? getPatternSymbol(item) : item}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.memoryTest.howToPlay')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.memoryTest.instruction1')}</li>
          <li>{t('tools.memoryTest.instruction2')}</li>
          <li>{t('tools.memoryTest.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
