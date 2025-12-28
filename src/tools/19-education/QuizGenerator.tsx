import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export default function QuizGenerator() {
  const { t } = useTranslation()
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    passingScore: 70,
    showExplanations: true,
  })

  const [questions, setQuestions] = useState<Question[]>([])
  const [showForm, setShowForm] = useState(false)
  const [quizMode, setQuizMode] = useState(false)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [submitted, setSubmitted] = useState(false)

  const addQuestion = (q: Omit<Question, 'id'>) => {
    setQuestions([...questions, { ...q, id: Date.now() }])
    setShowForm(false)
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const startQuiz = () => {
    if (questions.length === 0) return
    setQuizMode(true)
    setAnswers({})
    setSubmitted(false)
  }

  const selectAnswer = (qId: number, optionIndex: number) => {
    if (submitted) return
    setAnswers({ ...answers, [qId]: optionIndex })
  }

  const submitQuiz = () => {
    setSubmitted(true)
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct++
    })
    return Math.round((correct / questions.length) * 100)
  }

  const QuestionForm = () => {
    const [form, setForm] = useState({
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
    })

    const updateOption = (index: number, value: string) => {
      const newOptions = [...form.options]
      newOptions[index] = value
      setForm({ ...form, options: newOptions })
    }

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.quizGenerator.addQuestion')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="Question text"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="space-y-2">
            <label className="text-sm text-slate-500">Options (click to mark correct)</label>
            {form.options.map((opt, index) => (
              <div key={index} className="flex gap-2 items-center">
                <button
                  onClick={() => setForm({ ...form, correctIndex: index })}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${form.correctIndex === index ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300'}`}
                >
                  {form.correctIndex === index && '✓'}
                </button>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            ))}
          </div>
          <input
            type="text"
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            placeholder="Explanation (optional)"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={() => addQuestion(form)}
              disabled={!form.question || form.options.some(o => !o.trim())}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
            >
              Add Question
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (quizMode) {
    const score = calculateScore()
    const passed = score >= quiz.passingScore

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">{quiz.title || 'Quiz'}</h2>
          <button onClick={() => setQuizMode(false)} className="text-blue-500 text-sm">
            Exit Quiz
          </button>
        </div>

        {submitted && (
          <div className={`card p-4 text-center ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-3xl font-bold mb-1">{score}%</div>
            <div className={passed ? 'text-green-600' : 'text-red-600'}>
              {passed ? 'Passed!' : 'Keep practicing!'}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {questions.map((q, qIndex) => {
            const userAnswer = answers[q.id]
            const isCorrect = userAnswer === q.correctIndex

            return (
              <div key={q.id} className="card p-4">
                <div className="font-medium mb-3">
                  {qIndex + 1}. {q.question}
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, oIndex) => {
                    let bgClass = 'bg-slate-50 hover:bg-slate-100'
                    if (submitted) {
                      if (oIndex === q.correctIndex) bgClass = 'bg-green-100'
                      else if (oIndex === userAnswer && !isCorrect) bgClass = 'bg-red-100'
                    } else if (userAnswer === oIndex) {
                      bgClass = 'bg-blue-100'
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => selectAnswer(q.id, oIndex)}
                        className={`w-full p-3 rounded text-left ${bgClass}`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {submitted && quiz.showExplanations && q.explanation && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                    {q.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!submitted ? (
          <button
            onClick={submitQuiz}
            disabled={Object.keys(answers).length !== questions.length}
            className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-slate-300 font-medium"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={startQuiz}
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
          >
            Retry Quiz
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.quizGenerator.settings')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            placeholder="Quiz Title"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            placeholder="Quiz description"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Passing Score:</label>
              <input
                type="number"
                value={quiz.passingScore}
                onChange={(e) => setQuiz({ ...quiz, passingScore: parseInt(e.target.value) || 0 })}
                min={0}
                max={100}
                className="w-16 px-2 py-1 border border-slate-300 rounded"
              />
              <span className="text-sm">%</span>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={quiz.showExplanations}
                onChange={(e) => setQuiz({ ...quiz, showExplanations: e.target.checked })}
              />
              <span className="text-sm">Show explanations</span>
            </label>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Questions</span>
          <span className="font-medium">{questions.length}</span>
        </div>
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          + {t('tools.quizGenerator.addQuestion')}
        </button>
      )}

      {showForm && <QuestionForm />}

      <div className="space-y-2">
        {questions.map((q, index) => (
          <div key={q.id} className="card p-3 flex items-start justify-between">
            <div>
              <div className="font-medium">{index + 1}. {q.question}</div>
              <div className="text-sm text-green-600 mt-1">
                ✓ {q.options[q.correctIndex]}
              </div>
            </div>
            <button onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-600">
              ×
            </button>
          </div>
        ))}
      </div>

      {questions.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Add questions to create your quiz
        </div>
      )}

      {questions.length > 0 && (
        <button onClick={startQuiz} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          {t('tools.quizGenerator.start')}
        </button>
      )}
    </div>
  )
}
