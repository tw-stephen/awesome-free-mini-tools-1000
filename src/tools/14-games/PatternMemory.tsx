import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function PatternMemory() {
  const { t } = useTranslation()
  const [pattern, setPattern] = useState<number[]>([])
  const [userPattern, setUserPattern] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShowingPattern, setIsShowingPattern] = useState(false)
  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [level, setLevel] = useState(1)

  const gridSize = 9 // 3x3 grid
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-cyan-500', 'bg-indigo-500']

  const startGame = () => {
    setPattern([])
    setUserPattern([])
    setScore(0)
    setLevel(1)
    setGameOver(false)
    setIsPlaying(true)
    addToPattern([])
  }

  const addToPattern = (currentPattern: number[]) => {
    const newCell = Math.floor(Math.random() * gridSize)
    const newPattern = [...currentPattern, newCell]
    setPattern(newPattern)
    showPattern(newPattern)
  }

  const showPattern = async (patternToShow: number[]) => {
    setIsShowingPattern(true)
    setUserPattern([])

    for (let i = 0; i < patternToShow.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600))
      setActiveCell(patternToShow[i])
      await new Promise(resolve => setTimeout(resolve, 400))
      setActiveCell(null)
    }

    await new Promise(resolve => setTimeout(resolve, 300))
    setIsShowingPattern(false)
  }

  const handleCellClick = (cellIndex: number) => {
    if (isShowingPattern || gameOver) return

    setActiveCell(cellIndex)
    setTimeout(() => setActiveCell(null), 200)

    const newUserPattern = [...userPattern, cellIndex]
    setUserPattern(newUserPattern)

    // Check if correct
    const currentIndex = newUserPattern.length - 1
    if (pattern[currentIndex] !== cellIndex) {
      // Wrong!
      setGameOver(true)
      setIsPlaying(false)
      if (score > highScore) {
        setHighScore(score)
      }
      return
    }

    // Check if pattern complete
    if (newUserPattern.length === pattern.length) {
      setScore(prev => prev + level * 10)
      setLevel(prev => prev + 1)
      setTimeout(() => addToPattern(pattern), 1000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.patternMemory.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{level}</div>
            <div className="text-sm text-slate-500">{t('tools.patternMemory.level')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{highScore}</div>
            <div className="text-sm text-slate-500">{t('tools.patternMemory.highScore')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        {!isPlaying && !gameOver && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-xl font-bold mb-2">{t('tools.patternMemory.title')}</h2>
            <p className="text-slate-500 mb-4">{t('tools.patternMemory.description')}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.patternMemory.startGame')}
            </button>
          </div>
        )}

        {(isPlaying || gameOver) && (
          <>
            <div className="text-center mb-4">
              {isShowingPattern ? (
                <span className="text-lg font-medium text-blue-600">
                  {t('tools.patternMemory.watchPattern')}
                </span>
              ) : !gameOver ? (
                <span className="text-lg font-medium text-green-600">
                  {t('tools.patternMemory.yourTurn')} ({userPattern.length}/{pattern.length})
                </span>
              ) : null}
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {Array.from({ length: gridSize }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  disabled={isShowingPattern || gameOver}
                  className={`aspect-square rounded-lg transition-all transform ${
                    activeCell === i
                      ? `${colors[i]} scale-95`
                      : 'bg-slate-200 hover:bg-slate-300'
                  } ${isShowingPattern ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
              ))}
            </div>

            {gameOver && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg text-center">
                <div className="text-4xl mb-2">😔</div>
                <h3 className="text-xl font-bold text-red-700 mb-2">
                  {t('tools.patternMemory.gameOver')}
                </h3>
                <p className="text-red-600">
                  {t('tools.patternMemory.reachedLevel', { level })}
                </p>
                {score === highScore && score > 0 && (
                  <p className="text-green-600 font-bold mt-1">🏆 {t('tools.patternMemory.newHighScore')}</p>
                )}
                <button
                  onClick={startGame}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
                >
                  {t('tools.patternMemory.playAgain')}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.patternMemory.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.patternMemory.instruction1')}</li>
          <li>• {t('tools.patternMemory.instruction2')}</li>
          <li>• {t('tools.patternMemory.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
