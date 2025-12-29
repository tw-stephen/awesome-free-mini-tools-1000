import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type GameMode = 'numbers' | 'letters' | 'both'
type Difficulty = 'easy' | 'medium' | 'hard'

interface Challenge {
  type: 'numbers' | 'letters'
  question: string
  answer: string | number
  timeLimit: number
}

export default function CountdownChallengeGame() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<GameMode>('numbers')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null)
  const [round, setRound] = useState(0)
  const [totalRounds] = useState(10)
  const inputRef = useRef<HTMLInputElement>(null)

  const difficultySettings = {
    easy: { time: 15, maxNum: 20 },
    medium: { time: 10, maxNum: 50 },
    hard: { time: 7, maxNum: 100 }
  }

  const generateNumberChallenge = (): Challenge => {
    const settings = difficultySettings[difficulty]
    const operations = ['+', '-', '*']
    const op = operations[Math.floor(Math.random() * operations.length)]

    let num1: number, num2: number, answer: number

    switch (op) {
      case '+':
        num1 = Math.floor(Math.random() * settings.maxNum) + 1
        num2 = Math.floor(Math.random() * settings.maxNum) + 1
        answer = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * settings.maxNum) + 10
        num2 = Math.floor(Math.random() * Math.min(num1, settings.maxNum))
        answer = num1 - num2
        break
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        answer = num1 * num2
        break
      default:
        num1 = 1
        num2 = 1
        answer = 2
    }

    return {
      type: 'numbers',
      question: `${num1} ${op === '*' ? 'x' : op} ${num2}`,
      answer,
      timeLimit: settings.time
    }
  }

  const WORDS = [
    'CAT', 'DOG', 'SUN', 'RUN', 'TOP', 'HAT', 'BAT', 'RAT',
    'BOOK', 'TREE', 'STAR', 'MOON', 'FISH', 'BIRD', 'CAKE',
    'APPLE', 'BEACH', 'CLOUD', 'DANCE', 'HAPPY', 'MUSIC'
  ]

  const generateLetterChallenge = (): Challenge => {
    const settings = difficultySettings[difficulty]
    const filteredWords = WORDS.filter(w =>
      difficulty === 'easy' ? w.length <= 3 :
      difficulty === 'medium' ? w.length <= 4 :
      true
    )
    const word = filteredWords[Math.floor(Math.random() * filteredWords.length)]

    // Scramble the word
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('')

    return {
      type: 'letters',
      question: scrambled,
      answer: word,
      timeLimit: settings.time + 5
    }
  }

  const nextChallenge = () => {
    if (round >= totalRounds) {
      setIsPlaying(false)
      return
    }

    let newChallenge: Challenge
    if (mode === 'both') {
      newChallenge = Math.random() > 0.5 ? generateNumberChallenge() : generateLetterChallenge()
    } else if (mode === 'letters') {
      newChallenge = generateLetterChallenge()
    } else {
      newChallenge = generateNumberChallenge()
    }

    setChallenge(newChallenge)
    setTimeLeft(newChallenge.timeLimit)
    setUserAnswer('')
    setFeedback(null)
    setRound(prev => prev + 1)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setRound(0)
    setIsPlaying(true)
    setFeedback(null)
    nextChallenge()
  }

  useEffect(() => {
    let timer: number
    if (isPlaying && timeLeft > 0 && !feedback) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setFeedback('timeout')
            setStreak(0)
            setTimeout(nextChallenge, 1500)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft, feedback])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!challenge || feedback) return

    const isCorrect = challenge.type === 'numbers'
      ? parseInt(userAnswer) === challenge.answer
      : userAnswer.toUpperCase() === challenge.answer

    if (isCorrect) {
      setFeedback('correct')
      const timeBonus = Math.floor(timeLeft * 2)
      const points = 10 + streak * 2 + timeBonus
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
    } else {
      setFeedback('wrong')
      setStreak(0)
    }

    setTimeout(nextChallenge, 1500)
  }

  const progress = (round / totalRounds) * 100

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['numbers', 'letters', 'both'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              disabled={isPlaying}
              className={`flex-1 py-2 rounded capitalize text-sm ${
                mode === m ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {t(`tools.countdownChallengeGame.${m}`)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              disabled={isPlaying}
              className={`flex-1 py-2 rounded capitalize text-sm ${
                difficulty === d ? 'bg-purple-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {t(`tools.countdownChallengeGame.${d}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.countdownChallengeGame.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}</div>
            <div className="text-sm text-slate-500">{t('tools.countdownChallengeGame.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{round}/{totalRounds}</div>
            <div className="text-sm text-slate-500">{t('tools.countdownChallengeGame.round')}</div>
          </div>
        </div>
      </div>

      {isPlaying && challenge ? (
        <div className={`card p-6 ${
          feedback === 'correct' ? 'bg-green-50' :
          feedback === 'wrong' ? 'bg-red-50' :
          feedback === 'timeout' ? 'bg-orange-50' : ''
        }`}>
          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Timer */}
          <div className={`text-center mb-4 ${timeLeft <= 3 ? 'animate-pulse' : ''}`}>
            <span className={`text-4xl font-bold ${
              timeLeft <= 3 ? 'text-red-600' : 'text-blue-600'
            }`}>
              {timeLeft}
            </span>
          </div>

          {/* Challenge */}
          <div className="text-center mb-6">
            <div className="text-sm text-slate-500 mb-2">
              {challenge.type === 'numbers'
                ? t('tools.countdownChallengeGame.solveThis')
                : t('tools.countdownChallengeGame.unscramble')}
            </div>
            <div className="text-4xl font-bold font-mono">
              {challenge.question}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-xs mx-auto">
            <input
              ref={inputRef}
              type={challenge.type === 'numbers' ? 'number' : 'text'}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={feedback !== null}
              className="flex-1 px-4 py-3 border border-slate-300 rounded text-2xl text-center font-mono uppercase"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={feedback !== null || !userAnswer}
              className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-blue-300"
            >
              OK
            </button>
          </form>

          {/* Feedback */}
          {feedback && (
            <div className={`text-center mt-4 font-bold text-lg ${
              feedback === 'correct' ? 'text-green-600' :
              feedback === 'wrong' ? 'text-red-600' :
              'text-orange-600'
            }`}>
              {feedback === 'correct' && t('tools.countdownChallengeGame.correct')}
              {feedback === 'wrong' && t('tools.countdownChallengeGame.wrong', { answer: challenge.answer })}
              {feedback === 'timeout' && t('tools.countdownChallengeGame.timeout', { answer: challenge.answer })}
            </div>
          )}
        </div>
      ) : !isPlaying && round > 0 ? (
        <div className="card p-6 text-center">
          <div className="text-4xl mb-4">
            {score >= 150 ? '🏆' : score >= 100 ? '🎉' : score >= 50 ? '👍' : '💪'}
          </div>
          <h3 className="text-xl font-bold mb-2">{t('tools.countdownChallengeGame.gameOver')}</h3>
          <p className="text-3xl font-bold text-blue-600 mb-4">{score} {t('tools.countdownChallengeGame.points')}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.countdownChallengeGame.playAgain')}
          </button>
        </div>
      ) : (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">⏱️</div>
          <h3 className="text-lg font-medium mb-2">{t('tools.countdownChallengeGame.title')}</h3>
          <p className="text-slate-500 mb-4">{t('tools.countdownChallengeGame.instructions')}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.countdownChallengeGame.start')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.countdownChallengeGame.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.countdownChallengeGame.tip1')}</li>
          <li>* {t('tools.countdownChallengeGame.tip2')}</li>
          <li>* {t('tools.countdownChallengeGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
