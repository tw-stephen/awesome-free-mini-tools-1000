import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
}

interface Quiz {
  id: number
  title: string
  questions: Question[]
}

export default function QuizMaker() {
  const { t } = useTranslation()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [mode, setMode] = useState<'list' | 'create' | 'take'>('list')
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [newOptions, setNewOptions] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('quizzes')
    if (saved) {
      try {
        setQuizzes(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load quizzes')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes))
  }, [quizzes])

  const addQuestion = () => {
    if (newQuestion.trim() && newOptions.every(o => o.trim())) {
      setQuestions([...questions, {
        id: Date.now(),
        question: newQuestion.trim(),
        options: newOptions.map(o => o.trim()),
        correctIndex,
      }])
      setNewQuestion('')
      setNewOptions(['', '', '', ''])
      setCorrectIndex(0)
    }
  }

  const saveQuiz = () => {
    if (newTitle.trim() && questions.length > 0) {
      setQuizzes([...quizzes, {
        id: Date.now(),
        title: newTitle.trim(),
        questions,
      }])
      setNewTitle('')
      setQuestions([])
      setMode('list')
    }
  }

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setShowResults(false)
    setMode('take')
  }

  const selectAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = optionIndex
    setUserAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const getScore = () => {
    if (!currentQuiz) return 0
    return currentQuiz.questions.filter((q, i) => q.correctIndex === userAnswers[i]).length
  }

  const deleteQuiz = (id: number) => {
    setQuizzes(quizzes.filter(q => q.id !== id))
  }

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('create')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.quizMaker.createQuiz')}
          </button>

          {quizzes.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.quizMaker.noQuizzes')}
            </div>
          ) : (
            <div className="space-y-2">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="card p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{quiz.title}</div>
                    <div className="text-sm text-slate-500">
                      {quiz.questions.length} {t('tools.quizMaker.questions')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startQuiz(quiz)}
                      className="px-4 py-2 bg-green-500 text-white rounded text-sm"
                    >
                      {t('tools.quizMaker.take')}
                    </button>
                    <button
                      onClick={() => deleteQuiz(quiz.id)}
                      className="px-3 py-2 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'create' && (
        <>
          <div className="card p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.quizMaker.quizTitle')}
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={t('tools.quizMaker.titlePlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.quizMaker.addQuestion')}
            </h3>
            <div>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder={t('tools.quizMaker.questionPlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              {newOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={correctIndex === i}
                    onChange={() => setCorrectIndex(i)}
                    className="w-4 h-4"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const opts = [...newOptions]
                      opts[i] = e.target.value
                      setNewOptions(opts)
                    }}
                    placeholder={`${t('tools.quizMaker.option')} ${i + 1}`}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={addQuestion}
              className="w-full py-2 bg-slate-100 rounded text-sm"
            >
              + {t('tools.quizMaker.addQuestion')}
            </button>
          </div>

          {questions.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                {t('tools.quizMaker.questions')} ({questions.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {questions.map((q, i) => (
                  <div key={q.id} className="p-2 bg-slate-50 rounded text-sm">
                    {i + 1}. {q.question}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => { setMode('list'); setQuestions([]); setNewTitle('') }}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={saveQuiz}
              disabled={!newTitle.trim() || questions.length === 0}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.quizMaker.save')}
            </button>
          </div>
        </>
      )}

      {mode === 'take' && currentQuiz && !showResults && (
        <div className="card p-4">
          <div className="text-sm text-slate-500 mb-2">
            {currentQuestionIndex + 1} / {currentQuiz.questions.length}
          </div>
          <div className="h-2 bg-slate-200 rounded mb-4">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
            />
          </div>

          <h3 className="text-lg font-medium mb-4">
            {currentQuiz.questions[currentQuestionIndex].question}
          </h3>

          <div className="space-y-2 mb-4">
            {currentQuiz.questions[currentQuestionIndex].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={`w-full p-3 text-left rounded border-2 ${
                  userAnswers[currentQuestionIndex] === i
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={nextQuestion}
            disabled={userAnswers[currentQuestionIndex] === undefined}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
          >
            {currentQuestionIndex < currentQuiz.questions.length - 1
              ? t('tools.quizMaker.next')
              : t('tools.quizMaker.finish')}
          </button>
        </div>
      )}

      {mode === 'take' && showResults && currentQuiz && (
        <div className="space-y-4">
          <div className="card p-6 text-center bg-blue-50">
            <div className="text-sm text-slate-600">{t('tools.quizMaker.score')}</div>
            <div className="text-4xl font-bold text-blue-600">
              {getScore()} / {currentQuiz.questions.length}
            </div>
            <div className="text-lg text-slate-600">
              ({Math.round((getScore() / currentQuiz.questions.length) * 100)}%)
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.quizMaker.review')}</h3>
            <div className="space-y-3">
              {currentQuiz.questions.map((q, i) => (
                <div key={q.id} className={`p-3 rounded ${
                  userAnswers[i] === q.correctIndex ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="font-medium text-sm">{q.question}</div>
                  <div className="text-sm mt-1">
                    <span className="text-slate-500">{t('tools.quizMaker.yourAnswer')}:</span>{' '}
                    {q.options[userAnswers[i]]}
                  </div>
                  {userAnswers[i] !== q.correctIndex && (
                    <div className="text-sm text-green-600">
                      {t('tools.quizMaker.correct')}: {q.options[q.correctIndex]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setMode('list')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            {t('tools.quizMaker.backToQuizzes')}
          </button>
        </div>
      )}
    </div>
  )
}
