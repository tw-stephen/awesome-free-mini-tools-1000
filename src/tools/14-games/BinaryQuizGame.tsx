import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type QuestionType = 'binaryToDecimal' | 'decimalToBinary' | 'hexToDecimal' | 'decimalToHex'
type Difficulty = 'easy' | 'medium' | 'hard'

interface Question {
  type: QuestionType
  question: string
  answer: string
  options: string[]
}

export default function BinaryQuizGame() {
  const { t } = useTranslation()
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [questionType, setQuestionType] = useState<QuestionType>('binaryToDecimal')
  const [question, setQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [answered, setAnswered] = useState(false)

  const difficultySettings = {
    easy: { maxNum: 15 },
    medium: { maxNum: 63 },
    hard: { maxNum: 255 }
  }

  const generateQuestion = (): Question => {
    const settings = difficultySettings[difficulty]
    const num = Math.floor(Math.random() * settings.maxNum) + 1

    let questionText: string
    let answer: string
    let wrongAnswers: string[]

    switch (questionType) {
      case 'binaryToDecimal':
        questionText = num.toString(2)
        answer = num.toString()
        wrongAnswers = [
          (num + Math.floor(Math.random() * 5) + 1).toString(),
          Math.max(1, num - Math.floor(Math.random() * 5) - 1).toString(),
          (num * 2).toString()
        ]
        break
      case 'decimalToBinary':
        questionText = num.toString()
        answer = num.toString(2)
        wrongAnswers = [
          (num + 1).toString(2),
          Math.max(1, num - 1).toString(2),
          (num * 2).toString(2)
        ]
        break
      case 'hexToDecimal':
        questionText = num.toString(16).toUpperCase()
        answer = num.toString()
        wrongAnswers = [
          (num + Math.floor(Math.random() * 10) + 1).toString(),
          Math.max(1, num - Math.floor(Math.random() * 10) - 1).toString(),
          (num * 2).toString()
        ]
        break
      case 'decimalToHex':
        questionText = num.toString()
        answer = num.toString(16).toUpperCase()
        wrongAnswers = [
          (num + 1).toString(16).toUpperCase(),
          Math.max(1, num - 1).toString(16).toUpperCase(),
          (num * 2).toString(16).toUpperCase()
        ]
        break
    }

    // Remove duplicates and shuffle
    const uniqueOptions = [...new Set([answer, ...wrongAnswers])].slice(0, 4)
    while (uniqueOptions.length < 4) {
      const randNum = Math.floor(Math.random() * settings.maxNum) + 1
      const newOption = questionType.includes('Binary') || questionType.includes('Hex')
        ? questionType.includes('Decimal')
          ? randNum.toString()
          : questionType.includes('Hex')
            ? randNum.toString(16).toUpperCase()
            : randNum.toString(2)
        : randNum.toString()
      if (!uniqueOptions.includes(newOption)) {
        uniqueOptions.push(newOption)
      }
    }

    // Shuffle options
    for (let i = uniqueOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[uniqueOptions[i], uniqueOptions[j]] = [uniqueOptions[j], uniqueOptions[i]]
    }

    return {
      type: questionType,
      question: questionText,
      answer,
      options: uniqueOptions
    }
  }

  const nextQuestion = () => {
    setQuestion(generateQuestion())
    setFeedback(null)
    setAnswered(false)
  }

  useEffect(() => {
    nextQuestion()
  }, [difficulty, questionType])

  const handleAnswer = (selectedAnswer: string) => {
    if (answered) return
    setAnswered(true)

    if (selectedAnswer === question?.answer) {
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

    setTimeout(nextQuestion, 1500)
  }

  const getQuestionLabel = (): string => {
    switch (questionType) {
      case 'binaryToDecimal':
        return t('tools.binaryQuizGame.binaryIs')
      case 'decimalToBinary':
        return t('tools.binaryQuizGame.decimalToBinary')
      case 'hexToDecimal':
        return t('tools.binaryQuizGame.hexIs')
      case 'decimalToHex':
        return t('tools.binaryQuizGame.decimalToHex')
    }
  }

  const getPrefix = (): string => {
    switch (questionType) {
      case 'binaryToDecimal':
        return '0b'
      case 'hexToDecimal':
        return '0x'
      default:
        return ''
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
              {t(`tools.binaryQuizGame.${d}`)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {(['binaryToDecimal', 'decimalToBinary', 'hexToDecimal', 'decimalToHex'] as const).map(type => (
            <button
              key={type}
              onClick={() => setQuestionType(type)}
              className={`flex-1 py-2 rounded text-xs ${
                questionType === type ? 'bg-purple-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {type.includes('binary') ? 'BIN' : 'HEX'}
              {type.includes('ToDecimal') ? ' -> DEC' : ' <- DEC'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.binaryQuizGame.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}</div>
            <div className="text-sm text-slate-500">{t('tools.binaryQuizGame.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{highScore}</div>
            <div className="text-sm text-slate-500">{t('tools.binaryQuizGame.best')}</div>
          </div>
        </div>
      </div>

      {question && (
        <div className={`card p-6 ${
          feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : ''
        }`}>
          <div className="text-center mb-6">
            <p className="text-slate-500 mb-2">{getQuestionLabel()}</p>
            <div className="text-4xl font-mono font-bold">
              {getPrefix()}{question.question}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={answered}
                className={`p-4 rounded-lg text-xl font-mono font-bold transition-all ${
                  answered && option === question.answer
                    ? 'bg-green-500 text-white'
                    : answered && option !== question.answer
                      ? 'bg-slate-200 text-slate-400'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {questionType === 'decimalToBinary' && '0b'}
                {questionType === 'decimalToHex' && '0x'}
                {option}
              </button>
            ))}
          </div>

          {feedback === 'correct' && (
            <div className="text-center mt-4 text-green-600 font-bold text-lg">
              {t('tools.binaryQuizGame.correct')}
            </div>
          )}

          {feedback === 'wrong' && (
            <div className="text-center mt-4 text-red-600 font-bold text-lg">
              {t('tools.binaryQuizGame.wrong', { answer: question.answer })}
            </div>
          )}
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.binaryQuizGame.reference')}</h4>
        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
          <div>
            <div className="text-slate-500 mb-1">{t('tools.binaryQuizGame.binaryHint')}</div>
            <div>0001 = 1</div>
            <div>0010 = 2</div>
            <div>0100 = 4</div>
            <div>1000 = 8</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">{t('tools.binaryQuizGame.hexHint')}</div>
            <div>A = 10</div>
            <div>B = 11</div>
            <div>C = 12</div>
            <div>D = 13, E = 14, F = 15</div>
          </div>
        </div>
      </div>
    </div>
  )
}
