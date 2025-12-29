import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function RomanNumeralQuiz() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'toRoman' | 'toArabic'>('toRoman')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [question, setQuestion] = useState<{ value: number; roman: string } | null>(null)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showReference, setShowReference] = useState(false)

  const romanNumerals: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ]

  const toRoman = (num: number): string => {
    let result = ''
    for (const [value, symbol] of romanNumerals) {
      while (num >= value) {
        result += symbol
        num -= value
      }
    }
    return result
  }

  const toArabic = (roman: string): number => {
    const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
    let result = 0
    for (let i = 0; i < roman.length; i++) {
      const current = values[roman[i]]
      const next = values[roman[i + 1]]
      if (next && current < next) {
        result -= current
      } else {
        result += current
      }
    }
    return result
  }

  const getMaxValue = () => {
    switch (difficulty) {
      case 'easy': return 50
      case 'medium': return 500
      case 'hard': return 3999
    }
  }

  const generateQuestion = () => {
    const max = getMaxValue()
    const value = Math.floor(Math.random() * max) + 1
    setQuestion({ value, roman: toRoman(value) })
    setAnswer('')
    setFeedback(null)
  }

  useEffect(() => {
    generateQuestion()
  }, [mode, difficulty])

  const checkAnswer = () => {
    if (!question) return

    let isCorrect = false
    if (mode === 'toRoman') {
      isCorrect = answer.toUpperCase() === question.roman
    } else {
      isCorrect = parseInt(answer) === question.value
    }

    setFeedback(isCorrect ? 'correct' : 'wrong')
    setTotal(prev => prev + 1)
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    generateQuestion()
  }

  const resetScore = () => {
    setScore(0)
    setTotal(0)
    generateQuestion()
  }

  const referenceTable = [
    { arabic: 1, roman: 'I' },
    { arabic: 4, roman: 'IV' },
    { arabic: 5, roman: 'V' },
    { arabic: 9, roman: 'IX' },
    { arabic: 10, roman: 'X' },
    { arabic: 40, roman: 'XL' },
    { arabic: 50, roman: 'L' },
    { arabic: 90, roman: 'XC' },
    { arabic: 100, roman: 'C' },
    { arabic: 400, roman: 'CD' },
    { arabic: 500, roman: 'D' },
    { arabic: 900, roman: 'CM' },
    { arabic: 1000, roman: 'M' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.romanNumeralQuiz.settings')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{t('tools.romanNumeralQuiz.mode')}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('toRoman')}
                className={`flex-1 py-2 rounded text-sm ${
                  mode === 'toRoman' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {t('tools.romanNumeralQuiz.toRoman')}
              </button>
              <button
                onClick={() => setMode('toArabic')}
                className={`flex-1 py-2 rounded text-sm ${
                  mode === 'toArabic' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {t('tools.romanNumeralQuiz.toArabic')}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{t('tools.romanNumeralQuiz.difficulty')}</label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded text-sm capitalize ${
                    difficulty === d ? 'bg-purple-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {d} (1-{d === 'easy' ? 50 : d === 'medium' ? 500 : 3999})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.romanNumeralQuiz.score')}</h3>
          <div className="text-lg font-bold">
            <span className="text-green-600">{score}</span>
            <span className="text-slate-400"> / </span>
            <span className="text-slate-600">{total}</span>
            {total > 0 && (
              <span className="text-sm text-slate-500 ml-2">
                ({Math.round((score / total) * 100)}%)
              </span>
            )}
          </div>
        </div>
        <button
          onClick={resetScore}
          className="text-xs text-red-500 hover:text-red-700"
        >
          {t('tools.romanNumeralQuiz.reset')}
        </button>
      </div>

      {question && (
        <div className="card p-6">
          <div className="text-center mb-4">
            <div className="text-sm text-slate-500 mb-2">
              {mode === 'toRoman'
                ? t('tools.romanNumeralQuiz.convertToRoman')
                : t('tools.romanNumeralQuiz.convertToArabic')}
            </div>
            <div className="text-4xl font-bold text-slate-800">
              {mode === 'toRoman' ? question.value : question.roman}
            </div>
          </div>

          <input
            type={mode === 'toArabic' ? 'number' : 'text'}
            value={answer}
            onChange={(e) => setAnswer(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border border-slate-300 rounded text-center text-xl"
            placeholder={mode === 'toRoman' ? 'Enter Roman numeral' : 'Enter number'}
            disabled={feedback !== null}
          />

          {feedback && (
            <div className={`mt-4 p-3 rounded text-center ${
              feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {feedback === 'correct' ? (
                <span>{t('tools.romanNumeralQuiz.correct')}</span>
              ) : (
                <span>
                  {t('tools.romanNumeralQuiz.wrong')}: {mode === 'toRoman' ? question.roman : question.value}
                </span>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {feedback === null ? (
              <button
                onClick={checkAnswer}
                disabled={!answer}
                className="flex-1 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {t('tools.romanNumeralQuiz.check')}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {t('tools.romanNumeralQuiz.next')}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="card p-4">
        <button
          onClick={() => setShowReference(!showReference)}
          className="w-full flex justify-between items-center text-sm font-medium text-slate-700"
        >
          <span>{t('tools.romanNumeralQuiz.reference')}</span>
          <span className="text-slate-400">{showReference ? '-' : '+'}</span>
        </button>

        {showReference && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {referenceTable.map(item => (
              <div key={item.arabic} className="p-2 bg-slate-50 rounded text-center">
                <div className="font-bold text-slate-700">{item.roman}</div>
                <div className="text-xs text-slate-500">{item.arabic}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.romanNumeralQuiz.rules')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.romanNumeralQuiz.rule1')}</li>
          <li>{t('tools.romanNumeralQuiz.rule2')}</li>
          <li>{t('tools.romanNumeralQuiz.rule3')}</li>
        </ul>
      </div>
    </div>
  )
}
