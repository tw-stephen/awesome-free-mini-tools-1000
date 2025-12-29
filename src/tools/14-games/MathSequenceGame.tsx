import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type SequenceType = 'arithmetic' | 'geometric' | 'fibonacci' | 'square' | 'cube'
type Difficulty = 'easy' | 'medium' | 'hard'

interface Sequence {
  numbers: number[]
  answer: number
  type: SequenceType
  hint: string
}

export default function MathSequenceGame() {
  const { t } = useTranslation()
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [sequence, setSequence] = useState<Sequence | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showHint, setShowHint] = useState(false)

  const generateSequence = (): Sequence => {
    const types: SequenceType[] = difficulty === 'easy'
      ? ['arithmetic']
      : difficulty === 'medium'
        ? ['arithmetic', 'geometric', 'fibonacci']
        : ['arithmetic', 'geometric', 'fibonacci', 'square', 'cube']

    const type = types[Math.floor(Math.random() * types.length)]
    let numbers: number[] = []
    let answer: number
    let hint: string

    switch (type) {
      case 'arithmetic': {
        const start = Math.floor(Math.random() * 20) + 1
        const diff = Math.floor(Math.random() * 10) + 1
        const len = 5
        for (let i = 0; i < len; i++) {
          numbers.push(start + i * diff)
        }
        answer = start + len * diff
        hint = t('tools.mathSequenceGame.arithmeticHint', { diff })
        break
      }
      case 'geometric': {
        const start = Math.floor(Math.random() * 3) + 2
        const ratio = Math.floor(Math.random() * 2) + 2
        const len = 5
        for (let i = 0; i < len; i++) {
          numbers.push(start * Math.pow(ratio, i))
        }
        answer = start * Math.pow(ratio, len)
        hint = t('tools.mathSequenceGame.geometricHint', { ratio })
        break
      }
      case 'fibonacci': {
        const a = Math.floor(Math.random() * 3) + 1
        const b = Math.floor(Math.random() * 3) + 1
        numbers = [a, b]
        for (let i = 2; i < 6; i++) {
          numbers.push(numbers[i - 1] + numbers[i - 2])
        }
        answer = numbers[numbers.length - 1] + numbers[numbers.length - 2]
        numbers = numbers.slice(0, 5)
        hint = t('tools.mathSequenceGame.fibonacciHint')
        break
      }
      case 'square': {
        const start = Math.floor(Math.random() * 3) + 1
        const len = 5
        for (let i = 0; i < len; i++) {
          numbers.push(Math.pow(start + i, 2))
        }
        answer = Math.pow(start + len, 2)
        hint = t('tools.mathSequenceGame.squareHint')
        break
      }
      case 'cube': {
        const start = Math.floor(Math.random() * 2) + 1
        const len = 4
        for (let i = 0; i < len; i++) {
          numbers.push(Math.pow(start + i, 3))
        }
        answer = Math.pow(start + len, 3)
        hint = t('tools.mathSequenceGame.cubeHint')
        break
      }
    }

    return { numbers, answer, type, hint }
  }

  const nextSequence = () => {
    setSequence(generateSequence())
    setUserAnswer('')
    setFeedback(null)
    setShowHint(false)
  }

  useEffect(() => {
    nextSequence()
  }, [difficulty])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sequence) return

    const answer = parseInt(userAnswer)
    if (answer === sequence.answer) {
      setFeedback('correct')
      const points = (showHint ? 5 : 10) + streak * 2
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      if (score + points > highScore) {
        setHighScore(score + points)
      }
      setTimeout(nextSequence, 1500)
    } else {
      setFeedback('wrong')
      setStreak(0)
    }
  }

  const getTypeName = (type: SequenceType): string => {
    switch (type) {
      case 'arithmetic': return t('tools.mathSequenceGame.typeArithmetic')
      case 'geometric': return t('tools.mathSequenceGame.typeGeometric')
      case 'fibonacci': return t('tools.mathSequenceGame.typeFibonacci')
      case 'square': return t('tools.mathSequenceGame.typeSquare')
      case 'cube': return t('tools.mathSequenceGame.typeCube')
    }
  }

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
              {t(`tools.mathSequenceGame.${d}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.mathSequenceGame.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}</div>
            <div className="text-sm text-slate-500">{t('tools.mathSequenceGame.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{highScore}</div>
            <div className="text-sm text-slate-500">{t('tools.mathSequenceGame.best')}</div>
          </div>
        </div>
      </div>

      {sequence && (
        <div className={`card p-6 ${
          feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : ''
        }`}>
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium mb-4">
              {t('tools.mathSequenceGame.findNext')}
            </h3>

            <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
              {sequence.numbers.map((num, i) => (
                <div
                  key={i}
                  className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-lg text-xl font-bold text-blue-700"
                >
                  {num}
                </div>
              ))}
              <div className="w-14 h-14 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg text-2xl">
                ?
              </div>
            </div>

            {showHint && (
              <div className="text-sm text-blue-600 p-2 bg-blue-50 rounded mb-4">
                {sequence.hint}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 max-w-xs mx-auto mb-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-300 rounded text-2xl text-center font-mono"
              placeholder="?"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              {t('tools.mathSequenceGame.check')}
            </button>
          </form>

          <div className="flex justify-center gap-2">
            {!showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200"
              >
                {t('tools.mathSequenceGame.showHint')}
              </button>
            )}
            <button
              onClick={nextSequence}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200"
            >
              {t('tools.mathSequenceGame.skip')}
            </button>
          </div>

          {feedback === 'correct' && (
            <div className="text-center mt-4">
              <div className="text-green-600 font-bold text-lg">
                {t('tools.mathSequenceGame.correct')}
              </div>
              <div className="text-sm text-slate-500">
                {getTypeName(sequence.type)}
              </div>
            </div>
          )}

          {feedback === 'wrong' && (
            <div className="text-center mt-4 text-red-600 font-bold text-lg">
              {t('tools.mathSequenceGame.tryAgain')}
            </div>
          )}
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.mathSequenceGame.sequenceTypes')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* <strong>{t('tools.mathSequenceGame.typeArithmetic')}:</strong> {t('tools.mathSequenceGame.arithmeticDesc')}</li>
          <li>* <strong>{t('tools.mathSequenceGame.typeGeometric')}:</strong> {t('tools.mathSequenceGame.geometricDesc')}</li>
          <li>* <strong>{t('tools.mathSequenceGame.typeFibonacci')}:</strong> {t('tools.mathSequenceGame.fibonacciDesc')}</li>
        </ul>
      </div>
    </div>
  )
}
