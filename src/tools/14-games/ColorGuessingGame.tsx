import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Difficulty = 'easy' | 'medium' | 'hard'

interface ColorOption {
  hex: string
  isCorrect: boolean
}

export default function ColorGuessingGame() {
  const { t } = useTranslation()
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [targetColor, setTargetColor] = useState('')
  const [options, setOptions] = useState<ColorOption[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [mode, setMode] = useState<'hex' | 'rgb'>('hex')

  const generateRandomColor = (): string => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase()
  }

  const generateSimilarColor = (baseColor: string, variation: number): string => {
    const r = parseInt(baseColor.slice(1, 3), 16)
    const g = parseInt(baseColor.slice(3, 5), 16)
    const b = parseInt(baseColor.slice(5, 7), 16)

    const newR = Math.max(0, Math.min(255, r + Math.floor(Math.random() * variation * 2) - variation))
    const newG = Math.max(0, Math.min(255, g + Math.floor(Math.random() * variation * 2) - variation))
    const newB = Math.max(0, Math.min(255, b + Math.floor(Math.random() * variation * 2) - variation))

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`.toUpperCase()
  }

  const generateNewRound = () => {
    const correct = generateRandomColor()
    setTargetColor(correct)

    const difficultySettings = {
      easy: { options: 3, variation: 100 },
      medium: { options: 4, variation: 60 },
      hard: { options: 6, variation: 30 }
    }

    const settings = difficultySettings[difficulty]
    const newOptions: ColorOption[] = [{ hex: correct, isCorrect: true }]

    // Generate wrong options
    for (let i = 0; i < settings.options - 1; i++) {
      let wrongColor: string
      do {
        wrongColor = generateSimilarColor(correct, settings.variation)
      } while (newOptions.some(o => o.hex === wrongColor))

      newOptions.push({ hex: wrongColor, isCorrect: false })
    }

    // Shuffle options
    for (let i = newOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newOptions[i], newOptions[j]] = [newOptions[j], newOptions[i]]
    }

    setOptions(newOptions)
    setFeedback(null)
  }

  useEffect(() => {
    generateNewRound()
  }, [difficulty])

  const handleOptionClick = (option: ColorOption) => {
    if (feedback) return

    if (option.isCorrect) {
      setFeedback('correct')
      const points = 10 + streak * 2
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      if (score + points > highScore) {
        setHighScore(score + points)
      }
    } else {
      setFeedback('wrong')
      setStreak(0)
    }

    setTimeout(generateNewRound, 1000)
  }

  const hexToRgb = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgb(${r}, ${g}, ${b})`
  }

  const displayColor = mode === 'hex' ? targetColor : hexToRgb(targetColor)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`flex-1 py-2 rounded capitalize ${
                difficulty === d ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t(`tools.colorGuessingGame.${d}`)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          {(['hex', 'rgb'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded uppercase ${
                mode === m ? 'bg-purple-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.colorGuessingGame.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}</div>
            <div className="text-sm text-slate-500">{t('tools.colorGuessingGame.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{highScore}</div>
            <div className="text-sm text-slate-500">{t('tools.colorGuessingGame.highScore')}</div>
          </div>
        </div>
      </div>

      <div className={`card p-6 ${
        feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : ''
      }`}>
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium mb-2">
            {t('tools.colorGuessingGame.findColor')}
          </h3>
          <div className="text-3xl font-mono font-bold p-4 bg-slate-100 rounded inline-block">
            {displayColor}
          </div>
        </div>

        <div className={`grid gap-3 ${
          difficulty === 'hard' ? 'grid-cols-3' : difficulty === 'medium' ? 'grid-cols-2' : 'grid-cols-3'
        }`}>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={feedback !== null}
              className={`aspect-square rounded-lg transition-all ${
                feedback && option.isCorrect
                  ? 'ring-4 ring-green-500'
                  : feedback === 'wrong' && options[index] === options.find(o => !o.isCorrect && o.hex === option.hex)
                    ? ''
                    : ''
              } hover:scale-105 active:scale-95`}
              style={{ backgroundColor: option.hex }}
            />
          ))}
        </div>

        {feedback === 'correct' && (
          <div className="text-center mt-4 text-green-600 font-bold text-lg">
            {t('tools.colorGuessingGame.correct')} +{10 + (streak - 1) * 2}
          </div>
        )}

        {feedback === 'wrong' && (
          <div className="text-center mt-4 text-red-600 font-bold text-lg">
            {t('tools.colorGuessingGame.wrong')}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={generateNewRound}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
        >
          {t('tools.colorGuessingGame.skip')}
        </button>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.colorGuessingGame.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.colorGuessingGame.tip1')}</li>
          <li>* {t('tools.colorGuessingGame.tip2')}</li>
          <li>* {t('tools.colorGuessingGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
