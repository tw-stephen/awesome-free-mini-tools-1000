import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const COLORS = ['red', 'blue', 'green', 'yellow'] as const
type Color = typeof COLORS[number]

export default function SimonSaysGame() {
  const { t } = useTranslation()
  const [sequence, setSequence] = useState<Color[]>([])
  const [playerSequence, setPlayerSequence] = useState<Color[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShowingSequence, setIsShowingSequence] = useState(false)
  const [activeColor, setActiveColor] = useState<Color | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal')

  const speedSettings = {
    slow: { display: 800, pause: 400 },
    normal: { display: 500, pause: 250 },
    fast: { display: 300, pause: 150 },
  }

  const colorStyles: Record<Color, { bg: string; active: string }> = {
    red: { bg: 'bg-red-500', active: 'bg-red-300' },
    blue: { bg: 'bg-blue-500', active: 'bg-blue-300' },
    green: { bg: 'bg-green-500', active: 'bg-green-300' },
    yellow: { bg: 'bg-yellow-500', active: 'bg-yellow-300' },
  }

  const playSound = (color: Color) => {
    const frequencies: Record<Color, number> = {
      red: 329.63,
      blue: 261.63,
      green: 392.0,
      yellow: 523.25,
    }
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = frequencies[color]
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch {
      // Audio not supported
    }
  }

  const showSequence = useCallback(async () => {
    setIsShowingSequence(true)
    const settings = speedSettings[speed]

    for (const color of sequence) {
      setActiveColor(color)
      playSound(color)
      await new Promise(resolve => setTimeout(resolve, settings.display))
      setActiveColor(null)
      await new Promise(resolve => setTimeout(resolve, settings.pause))
    }

    setIsShowingSequence(false)
  }, [sequence, speed])

  const addToSequence = useCallback(() => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    setSequence(prev => [...prev, randomColor])
  }, [])

  const startGame = () => {
    setSequence([])
    setPlayerSequence([])
    setScore(0)
    setGameOver(false)
    setIsPlaying(true)
    setTimeout(() => {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
      setSequence([randomColor])
    }, 500)
  }

  useEffect(() => {
    if (sequence.length > 0 && isPlaying && !gameOver) {
      showSequence()
    }
  }, [sequence, isPlaying, gameOver, showSequence])

  const handleColorClick = (color: Color) => {
    if (isShowingSequence || !isPlaying || gameOver) return

    setActiveColor(color)
    playSound(color)
    setTimeout(() => setActiveColor(null), 200)

    const newPlayerSequence = [...playerSequence, color]
    setPlayerSequence(newPlayerSequence)

    const currentIndex = newPlayerSequence.length - 1
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      setGameOver(true)
      setIsPlaying(false)
      if (score > highScore) {
        setHighScore(score)
      }
      return
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1
      setScore(newScore)
      setPlayerSequence([])
      setTimeout(addToSequence, 1000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['slow', 'normal', 'fast'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              disabled={isPlaying}
              className={`flex-1 py-2 rounded capitalize ${
                speed === s ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {t(`tools.simonSaysGame.${s}`)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.simonSaysGame.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{highScore}</div>
            <div className="text-sm text-slate-500">{t('tools.simonSaysGame.highScore')}</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => handleColorClick(color)}
              disabled={isShowingSequence || !isPlaying}
              className={`aspect-square rounded-lg transition-all duration-150 ${
                activeColor === color ? colorStyles[color].active : colorStyles[color].bg
              } ${
                isShowingSequence || !isPlaying
                  ? 'cursor-not-allowed opacity-70'
                  : 'hover:opacity-90 active:scale-95'
              } ${activeColor === color ? 'scale-110 shadow-lg' : ''}`}
            />
          ))}
        </div>

        {isShowingSequence && (
          <div className="text-center mt-4 text-slate-500">
            {t('tools.simonSaysGame.watch')}
          </div>
        )}

        {!isShowingSequence && isPlaying && !gameOver && (
          <div className="text-center mt-4 text-slate-500">
            {t('tools.simonSaysGame.yourTurn')} ({playerSequence.length + 1}/{sequence.length})
          </div>
        )}
      </div>

      {gameOver && (
        <div className="card p-4 bg-red-50 text-center">
          <div className="text-xl font-bold text-red-600 mb-2">
            {t('tools.simonSaysGame.gameOver')}
          </div>
          <p className="text-slate-600 mb-4">
            {t('tools.simonSaysGame.finalScore', { score })}
          </p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.simonSaysGame.playAgain')}
          </button>
        </div>
      )}

      {!isPlaying && !gameOver && (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-lg font-medium mb-2">{t('tools.simonSaysGame.title')}</h3>
          <p className="text-slate-500 mb-4">{t('tools.simonSaysGame.instructions')}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.simonSaysGame.start')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.simonSaysGame.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.simonSaysGame.tip1')}</li>
          <li>* {t('tools.simonSaysGame.tip2')}</li>
          <li>* {t('tools.simonSaysGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
