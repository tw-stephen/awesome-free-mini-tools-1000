import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Question {
  question: string
  options: string[]
  correct: number
  category: string
}

export default function TriviaQuiz() {
  const { t } = useTranslation()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [category, setCategory] = useState<string>('all')

  const questions: Question[] = [
    { question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'], correct: 1, category: 'geography' },
    { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correct: 2, category: 'science' },
    { question: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Rembrandt'], correct: 2, category: 'art' },
    { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3, category: 'geography' },
    { question: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], correct: 1, category: 'science' },
    { question: 'What year did World War II end?', options: ['1943', '1944', '1945', '1946'], correct: 2, category: 'history' },
    { question: 'Which element has the chemical symbol "O"?', options: ['Gold', 'Oxygen', 'Osmium', 'Oganesson'], correct: 1, category: 'science' },
    { question: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correct: 1, category: 'geography' },
    { question: 'Who wrote "Romeo and Juliet"?', options: ['Dickens', 'Shakespeare', 'Austen', 'Hemingway'], correct: 1, category: 'literature' },
    { question: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Titanium'], correct: 2, category: 'science' },
    { question: 'Which country invented pizza?', options: ['France', 'Italy', 'Spain', 'Greece'], correct: 1, category: 'food' },
    { question: 'How many continents are there?', options: ['5', '6', '7', '8'], correct: 2, category: 'geography' },
    { question: 'What is the largest mammal?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippo'], correct: 1, category: 'science' },
    { question: 'Which planet has the most moons?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correct: 1, category: 'science' },
    { question: 'What is the currency of Japan?', options: ['Yuan', 'Won', 'Yen', 'Ringgit'], correct: 2, category: 'geography' },
  ]

  const filteredQuestions = category === 'all'
    ? questions
    : questions.filter(q => q.category === category)

  const categories = ['all', ...new Set(questions.map(q => q.category))]

  const startQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameOver(false)
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === filteredQuestions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setGameOver(true)
    }
  }

  const getScoreMessage = () => {
    const percentage = (score / filteredQuestions.length) * 100
    if (percentage === 100) return t('tools.triviaQuiz.perfect')
    if (percentage >= 80) return t('tools.triviaQuiz.excellent')
    if (percentage >= 60) return t('tools.triviaQuiz.good')
    if (percentage >= 40) return t('tools.triviaQuiz.fair')
    return t('tools.triviaQuiz.needsPractice')
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="card p-4">
        <p className="text-center text-slate-500">{t('tools.triviaQuiz.noQuestions')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!gameOver ? (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-4">
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); startQuiz(); }}
                className="px-3 py-2 border border-slate-300 rounded capitalize"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat === 'all' ? t('tools.triviaQuiz.allCategories') : cat}
                  </option>
                ))}
              </select>
              <span className="text-sm text-slate-500">
                {t('tools.triviaQuiz.score')}: {score}/{filteredQuestions.length}
              </span>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm text-slate-500 mb-1">
                <span>{t('tools.triviaQuiz.question')} {currentQuestion + 1}/{filteredQuestions.length}</span>
                <span className="capitalize">{filteredQuestions[currentQuestion].category}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-lg font-medium mb-4">
              {filteredQuestions[currentQuestion].question}
            </h3>

            <div className="space-y-2">
              {filteredQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-3 text-left rounded border-2 transition-all ${
                    showResult
                      ? index === filteredQuestions[currentQuestion].correct
                        ? 'border-green-500 bg-green-50'
                        : index === selectedAnswer
                          ? 'border-red-500 bg-red-50'
                          : 'border-slate-200'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                  {showResult && index === filteredQuestions[currentQuestion].correct && (
                    <span className="float-right text-green-500">✓</span>
                  )}
                  {showResult && index === selectedAnswer && index !== filteredQuestions[currentQuestion].correct && (
                    <span className="float-right text-red-500">✗</span>
                  )}
                </button>
              ))}
            </div>

            {showResult && (
              <div className="mt-4">
                <div className={`p-3 rounded ${selectedAnswer === filteredQuestions[currentQuestion].correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedAnswer === filteredQuestions[currentQuestion].correct
                    ? t('tools.triviaQuiz.correct')
                    : t('tools.triviaQuiz.incorrectAnswer', { answer: filteredQuestions[currentQuestion].options[filteredQuestions[currentQuestion].correct] })
                  }
                </div>
                <button
                  onClick={nextQuestion}
                  className="w-full mt-3 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
                >
                  {currentQuestion < filteredQuestions.length - 1
                    ? t('tools.triviaQuiz.nextQuestion')
                    : t('tools.triviaQuiz.seeResults')
                  }
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">
            {score === filteredQuestions.length ? '🏆' : score >= filteredQuestions.length * 0.6 ? '🎉' : '📚'}
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('tools.triviaQuiz.quizComplete')}</h2>
          <p className="text-lg mb-2">
            {t('tools.triviaQuiz.yourScore')}: {score}/{filteredQuestions.length}
          </p>
          <p className="text-slate-600 mb-4">{getScoreMessage()}</p>
          <div className="text-4xl font-bold text-blue-600 mb-4">
            {Math.round((score / filteredQuestions.length) * 100)}%
          </div>
          <button
            onClick={startQuiz}
            className="px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.triviaQuiz.playAgain')}
          </button>
        </div>
      )}
    </div>
  )
}
