import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Shape = 'circle' | 'square' | 'triangle' | 'diamond' | 'pentagon' | 'hexagon'
type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange'

interface ShapeItem {
  shape: Shape
  color: Color
}

export default function ShapeMatcherGame() {
  const { t } = useTranslation()
  const [targetShape, setTargetShape] = useState<ShapeItem | null>(null)
  const [options, setOptions] = useState<ShapeItem[]>([])
  const [matchType, setMatchType] = useState<'shape' | 'color' | 'both'>('shape')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)

  const shapes: Shape[] = ['circle', 'square', 'triangle', 'diamond', 'pentagon', 'hexagon']
  const colors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']

  const colorValues: Record<Color, string> = {
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#22C55E',
    yellow: '#EAB308',
    purple: '#A855F7',
    orange: '#F97316'
  }

  const generateRound = () => {
    const target: ShapeItem = {
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    }
    setTargetShape(target)

    // Generate options including correct answer
    const newOptions: ShapeItem[] = []

    // Add correct match based on match type
    if (matchType === 'shape') {
      newOptions.push({
        shape: target.shape,
        color: colors.filter(c => c !== target.color)[Math.floor(Math.random() * 5)]
      })
    } else if (matchType === 'color') {
      newOptions.push({
        shape: shapes.filter(s => s !== target.shape)[Math.floor(Math.random() * 5)],
        color: target.color
      })
    } else {
      newOptions.push({ ...target })
    }

    // Add wrong options
    while (newOptions.length < 4) {
      const option: ShapeItem = {
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      }

      const isMatch = matchType === 'shape'
        ? option.shape === target.shape
        : matchType === 'color'
          ? option.color === target.color
          : option.shape === target.shape && option.color === target.color

      if (!isMatch && !newOptions.some(o => o.shape === option.shape && o.color === option.color)) {
        newOptions.push(option)
      }
    }

    // Shuffle options
    for (let i = newOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newOptions[i], newOptions[j]] = [newOptions[j], newOptions[i]]
    }

    setOptions(newOptions)
    setFeedback(null)
  }

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setTimeLeft(30)
    setIsPlaying(true)
    generateRound()
  }

  useEffect(() => {
    let timer: number
    if (isPlaying && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false)
            if (score > highScore) {
              setHighScore(score)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft, score, highScore])

  const handleOptionClick = (option: ShapeItem) => {
    if (!isPlaying || feedback) return

    const isMatch = matchType === 'shape'
      ? option.shape === targetShape?.shape
      : matchType === 'color'
        ? option.color === targetShape?.color
        : option.shape === targetShape?.shape && option.color === targetShape?.color

    if (isMatch) {
      setFeedback('correct')
      const points = 10 + streak * 2
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      setTimeout(generateRound, 500)
    } else {
      setFeedback('wrong')
      setStreak(0)
      setTimeout(() => setFeedback(null), 500)
    }
  }

  const renderShape = (item: ShapeItem, size: number = 60) => {
    const color = colorValues[item.color]

    switch (item.shape) {
      case 'circle':
        return (
          <div
            className="rounded-full"
            style={{ width: size, height: size, backgroundColor: color }}
          />
        )
      case 'square':
        return (
          <div
            style={{ width: size, height: size, backgroundColor: color }}
          />
        )
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`
            }}
          />
        )
      case 'diamond':
        return (
          <div
            className="rotate-45"
            style={{ width: size * 0.7, height: size * 0.7, backgroundColor: color }}
          />
        )
      case 'pentagon':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <polygon
              points="50,0 100,38 82,100 18,100 0,38"
              fill={color}
            />
          </svg>
        )
      case 'hexagon':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <polygon
              points="50,0 100,25 100,75 50,100 0,75 0,25"
              fill={color}
            />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['shape', 'color', 'both'] as const).map(type => (
            <button
              key={type}
              onClick={() => {
                setMatchType(type)
                if (isPlaying) generateRound()
              }}
              className={`flex-1 py-2 rounded capitalize ${
                matchType === type ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t(`tools.shapeMatcherGame.match${type.charAt(0).toUpperCase() + type.slice(1)}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-xl font-bold text-blue-600">{score}</div>
            <div className="text-xs text-slate-500">{t('tools.shapeMatcherGame.score')}</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="text-xl font-bold text-green-600">{streak}</div>
            <div className="text-xs text-slate-500">{t('tools.shapeMatcherGame.streak')}</div>
          </div>
          <div className={`p-2 rounded ${timeLeft <= 5 ? 'bg-red-50' : 'bg-yellow-50'}`}>
            <div className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-yellow-600'}`}>
              {timeLeft}s
            </div>
            <div className="text-xs text-slate-500">{t('tools.shapeMatcherGame.time')}</div>
          </div>
          <div className="p-2 bg-purple-50 rounded">
            <div className="text-xl font-bold text-purple-600">{highScore}</div>
            <div className="text-xs text-slate-500">{t('tools.shapeMatcherGame.best')}</div>
          </div>
        </div>
      </div>

      {isPlaying && targetShape ? (
        <div className={`card p-6 ${
          feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : ''
        }`}>
          <div className="text-center mb-6">
            <p className="text-slate-500 mb-4">
              {matchType === 'shape' && t('tools.shapeMatcherGame.findSameShape')}
              {matchType === 'color' && t('tools.shapeMatcherGame.findSameColor')}
              {matchType === 'both' && t('tools.shapeMatcherGame.findExactMatch')}
            </p>
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                {renderShape(targetShape, 80)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="aspect-square p-4 rounded-lg border-2 border-slate-200 hover:border-blue-500 flex items-center justify-center transition-all hover:scale-105"
              >
                {renderShape(option)}
              </button>
            ))}
          </div>
        </div>
      ) : !isPlaying && timeLeft === 0 ? (
        <div className="card p-6 text-center">
          <div className="text-4xl mb-4">
            {score >= 100 ? '🏆' : score >= 50 ? '🎉' : '👍'}
          </div>
          <h3 className="text-xl font-bold mb-2">{t('tools.shapeMatcherGame.gameOver')}</h3>
          <p className="text-slate-500 mb-4">
            {t('tools.shapeMatcherGame.finalScore', { score })}
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.shapeMatcherGame.playAgain')}
          </button>
        </div>
      ) : (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">🔷</div>
          <h3 className="text-lg font-medium mb-2">{t('tools.shapeMatcherGame.title')}</h3>
          <p className="text-slate-500 mb-4">{t('tools.shapeMatcherGame.instructions')}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.shapeMatcherGame.start')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.shapeMatcherGame.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.shapeMatcherGame.tip1')}</li>
          <li>* {t('tools.shapeMatcherGame.tip2')}</li>
          <li>* {t('tools.shapeMatcherGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
