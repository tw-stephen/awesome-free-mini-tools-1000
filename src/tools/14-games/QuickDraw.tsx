import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function QuickDraw() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentWord, setCurrentWord] = useState('')
  const [timeLeft, setTimeLeft] = useState(20)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [brushColor, setBrushColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)

  const words = [
    'sun', 'tree', 'house', 'cat', 'dog', 'flower', 'star', 'moon',
    'fish', 'bird', 'apple', 'car', 'boat', 'heart', 'cloud', 'rain',
    'mountain', 'river', 'book', 'phone', 'glasses', 'hat', 'shoe', 'pizza'
  ]

  const colors = ['#000000', '#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7', '#f97316']

  const startGame = () => {
    setScore(0)
    setRound(0)
    nextRound()
    setIsPlaying(true)
  }

  const nextRound = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(randomWord)
    setTimeLeft(20)
    setRound(prev => prev + 1)
    clearCanvas()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isPlaying) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let x: number, y: number

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.strokeStyle = brushColor
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const handleDone = () => {
    setScore(prev => prev + Math.max(1, timeLeft) * 10)
    if (round < 5) {
      nextRound()
    } else {
      setIsPlaying(false)
    }
  }

  const handleSkip = () => {
    if (round < 5) {
      nextRound()
    } else {
      setIsPlaying(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.quickDraw.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{round}/5</div>
            <div className="text-sm text-slate-500">{t('tools.quickDraw.round')}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-slate-500">{t('tools.quickDraw.time')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        {!isPlaying && round === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✏️</div>
            <h2 className="text-xl font-bold mb-2">{t('tools.quickDraw.title')}</h2>
            <p className="text-slate-500 mb-4">{t('tools.quickDraw.description')}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.quickDraw.startGame')}
            </button>
          </div>
        )}

        {isPlaying && (
          <>
            <div className="text-center mb-4">
              <span className="text-sm text-slate-500">{t('tools.quickDraw.draw')}:</span>
              <div className="text-3xl font-bold text-blue-600">{currentWord.toUpperCase()}</div>
            </div>

            <div className="flex gap-2 mb-2 justify-center flex-wrap">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setBrushColor(color)}
                  className={`w-8 h-8 rounded-full ${brushColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-24"
              />
            </div>

            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="border-2 border-slate-300 rounded-lg bg-white mx-auto cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
            />

            <div className="flex gap-2 mt-4 justify-center">
              <button
                onClick={clearCanvas}
                className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
              >
                {t('tools.quickDraw.clear')}
              </button>
              <button
                onClick={handleDone}
                className="px-6 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
              >
                {t('tools.quickDraw.done')}
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                {t('tools.quickDraw.skip')}
              </button>
            </div>
          </>
        )}

        {!isPlaying && round > 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎨</div>
            <h3 className="text-xl font-bold mb-2">{t('tools.quickDraw.gameOver')}</h3>
            <p className="text-2xl font-bold text-blue-600 mb-4">{score} {t('tools.quickDraw.points')}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.quickDraw.playAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.quickDraw.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.quickDraw.instruction1')}</li>
          <li>• {t('tools.quickDraw.instruction2')}</li>
          <li>• {t('tools.quickDraw.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
