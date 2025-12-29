import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type PatternType = 'numbers' | 'shapes' | 'colors'

const SHAPES = ['circle', 'square', 'triangle', 'star', 'diamond', 'hexagon']
const COLORS = ['#EF4444', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899']

export default function PatternRecognitionGame() {
  const { t } = useTranslation()
  const [patternType, setPatternType] = useState<PatternType>('numbers')
  const [pattern, setPattern] = useState<(number | string)[]>([])
  const [options, setOptions] = useState<(number | string)[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<number | string>(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(1)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showHint, setShowHint] = useState(false)

  const generateNumberPattern = (difficulty: number) => {
    const patterns = [
      // Arithmetic
      () => {
        const start = Math.floor(Math.random() * 10) + 1
        const diff = Math.floor(Math.random() * 5) + 1
        const len = 4 + Math.min(difficulty, 3)
        const seq = Array.from({ length: len }, (_, i) => start + i * diff)
        return { sequence: seq.slice(0, -1), answer: seq[seq.length - 1] }
      },
      // Geometric
      () => {
        const start = Math.floor(Math.random() * 3) + 2
        const ratio = Math.floor(Math.random() * 2) + 2
        const len = 4 + Math.min(difficulty, 2)
        const seq = Array.from({ length: len }, (_, i) => start * Math.pow(ratio, i))
        return { sequence: seq.slice(0, -1), answer: seq[seq.length - 1] }
      },
      // Fibonacci-like
      () => {
        const a = Math.floor(Math.random() * 3) + 1
        const b = Math.floor(Math.random() * 3) + 1
        const seq = [a, b]
        for (let i = 2; i < 6; i++) {
          seq.push(seq[i - 1] + seq[i - 2])
        }
        return { sequence: seq.slice(0, -1), answer: seq[seq.length - 1] }
      },
      // Square numbers
      () => {
        const start = Math.floor(Math.random() * 3) + 1
        const len = 5
        const seq = Array.from({ length: len }, (_, i) => Math.pow(start + i, 2))
        return { sequence: seq.slice(0, -1), answer: seq[seq.length - 1] }
      }
    ]

    const patternIndex = Math.floor(Math.random() * Math.min(patterns.length, 1 + difficulty))
    return patterns[patternIndex]()
  }

  const generateShapePattern = (difficulty: number) => {
    const len = 4 + Math.min(difficulty, 2)
    const usedShapes = SHAPES.slice(0, 2 + Math.min(difficulty, 4))

    // Simple repeating pattern
    const repeatLen = 2 + Math.floor(Math.random() * Math.min(difficulty, 2))
    const basePattern = Array.from({ length: repeatLen }, () =>
      usedShapes[Math.floor(Math.random() * usedShapes.length)]
    )

    const sequence: string[] = []
    for (let i = 0; i < len; i++) {
      sequence.push(basePattern[i % repeatLen])
    }

    return { sequence: sequence.slice(0, -1), answer: sequence[sequence.length - 1] }
  }

  const generateColorPattern = (difficulty: number) => {
    const len = 4 + Math.min(difficulty, 2)
    const usedColors = COLORS.slice(0, 2 + Math.min(difficulty, 4))

    const repeatLen = 2 + Math.floor(Math.random() * Math.min(difficulty, 2))
    const basePattern = Array.from({ length: repeatLen }, () =>
      usedColors[Math.floor(Math.random() * usedColors.length)]
    )

    const sequence: string[] = []
    for (let i = 0; i < len; i++) {
      sequence.push(basePattern[i % repeatLen])
    }

    return { sequence: sequence.slice(0, -1), answer: sequence[sequence.length - 1] }
  }

  const generatePattern = () => {
    let result: { sequence: (number | string)[]; answer: number | string }

    switch (patternType) {
      case 'shapes':
        result = generateShapePattern(level)
        break
      case 'colors':
        result = generateColorPattern(level)
        break
      default:
        result = generateNumberPattern(level)
    }

    setPattern(result.sequence)
    setCorrectAnswer(result.answer)

    // Generate wrong options
    let wrongOptions: (number | string)[]
    if (patternType === 'numbers') {
      const answer = result.answer as number
      wrongOptions = [
        answer + Math.floor(Math.random() * 10) + 1,
        answer - Math.floor(Math.random() * 10) - 1,
        answer * 2,
      ].filter(n => n !== answer && n > 0)
    } else if (patternType === 'shapes') {
      wrongOptions = SHAPES.filter(s => s !== result.answer).slice(0, 3)
    } else {
      wrongOptions = COLORS.filter(c => c !== result.answer).slice(0, 3)
    }

    const allOptions = [result.answer, ...wrongOptions.slice(0, 3)]
    setOptions(allOptions.sort(() => Math.random() - 0.5))
    setShowHint(false)
    setFeedback(null)
  }

  useEffect(() => {
    generatePattern()
  }, [patternType, level])

  const handleAnswer = (answer: number | string) => {
    if (answer === correctAnswer) {
      setFeedback('correct')
      setScore(prev => prev + (showHint ? 5 : 10) * level)
      setStreak(prev => prev + 1)
      if (streak > 0 && streak % 3 === 2) {
        setLevel(prev => Math.min(prev + 1, 5))
      }
      setTimeout(generatePattern, 1000)
    } else {
      setFeedback('wrong')
      setStreak(0)
      setTimeout(() => setFeedback(null), 1000)
    }
  }

  const renderShape = (shape: string, size: number = 40) => {
    const style = { width: size, height: size }
    switch (shape) {
      case 'circle':
        return <div className="rounded-full bg-blue-500" style={style} />
      case 'square':
        return <div className="bg-green-500" style={style} />
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid #F59E0B`,
            }}
          />
        )
      case 'star':
        return <div className="text-4xl">⭐</div>
      case 'diamond':
        return <div className="bg-purple-500 rotate-45" style={{ width: size * 0.7, height: size * 0.7 }} />
      case 'hexagon':
        return <div className="text-4xl">⬡</div>
      default:
        return null
    }
  }

  const renderPatternItem = (item: number | string, index: number) => {
    if (patternType === 'numbers') {
      return (
        <div key={index} className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded text-xl font-bold">
          {item}
        </div>
      )
    } else if (patternType === 'shapes') {
      return (
        <div key={index} className="w-12 h-12 flex items-center justify-center">
          {renderShape(item as string)}
        </div>
      )
    } else {
      return (
        <div
          key={index}
          className="w-12 h-12 rounded-full"
          style={{ backgroundColor: item as string }}
        />
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['numbers', 'shapes', 'colors'] as const).map(type => (
            <button
              key={type}
              onClick={() => setPatternType(type)}
              className={`flex-1 py-2 rounded capitalize ${
                patternType === type ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t(`tools.patternRecognitionGame.${type}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.patternRecognitionGame.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}</div>
            <div className="text-sm text-slate-500">{t('tools.patternRecognitionGame.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{level}</div>
            <div className="text-sm text-slate-500">{t('tools.patternRecognitionGame.level')}</div>
          </div>
        </div>
      </div>

      <div className={`card p-6 ${
        feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : ''
      }`}>
        <h3 className="font-medium text-center mb-4">
          {t('tools.patternRecognitionGame.findNext')}
        </h3>

        <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
          {pattern.map((item, i) => renderPatternItem(item, i))}
          <div className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-slate-300 rounded text-2xl">
            ?
          </div>
        </div>

        {feedback === 'correct' && (
          <div className="text-center text-green-600 font-bold mb-4">
            {t('tools.patternRecognitionGame.correct')}
          </div>
        )}

        {feedback === 'wrong' && (
          <div className="text-center text-red-600 font-bold mb-4">
            {t('tools.patternRecognitionGame.tryAgain')}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={feedback === 'correct'}
              className={`p-3 rounded-lg border-2 hover:border-blue-500 transition-colors ${
                patternType === 'numbers' ? 'min-w-[60px] text-xl font-bold' : ''
              }`}
            >
              {patternType === 'numbers' ? (
                option
              ) : patternType === 'shapes' ? (
                renderShape(option as string)
              ) : (
                <div
                  className="w-10 h-10 rounded-full"
                  style={{ backgroundColor: option as string }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200"
            >
              {t('tools.patternRecognitionGame.showHint')}
            </button>
          )}
          <button
            onClick={generatePattern}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200"
          >
            {t('tools.patternRecognitionGame.skip')}
          </button>
        </div>

        {showHint && (
          <div className="mt-4 p-3 bg-yellow-50 rounded text-center text-sm text-yellow-700">
            {t('tools.patternRecognitionGame.hint')}
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.patternRecognitionGame.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.patternRecognitionGame.tip1')}</li>
          <li>* {t('tools.patternRecognitionGame.tip2')}</li>
          <li>* {t('tools.patternRecognitionGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
