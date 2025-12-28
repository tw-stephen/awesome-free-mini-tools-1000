import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Question {
  id: number
  type: 'text' | 'textarea' | 'multiple' | 'checkbox' | 'rating' | 'scale'
  question: string
  options: string[]
  required: boolean
}

export default function SurveyCreator() {
  const { t } = useTranslation()
  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    thankYouMessage: 'Thank you for your feedback!',
  })

  const [questions, setQuestions] = useState<Question[]>([])
  const [showForm, setShowForm] = useState(false)

  const questionTypes = [
    { id: 'text', name: 'Short Answer', icon: '📝' },
    { id: 'textarea', name: 'Long Answer', icon: '📄' },
    { id: 'multiple', name: 'Multiple Choice', icon: '⭕' },
    { id: 'checkbox', name: 'Checkboxes', icon: '☑️' },
    { id: 'rating', name: 'Rating', icon: '⭐' },
    { id: 'scale', name: 'Scale (1-10)', icon: '📊' },
  ]

  const addQuestion = (question: Omit<Question, 'id'>) => {
    setQuestions([...questions, { ...question, id: Date.now() }])
    setShowForm(false)
  }

  const updateQuestion = (id: number, field: keyof Question, value: string | string[] | boolean) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q))
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= questions.length) return
    const newQuestions = [...questions]
    ;[newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]]
    setQuestions(newQuestions)
  }

  const duplicateQuestion = (question: Question) => {
    const newQuestion = { ...question, id: Date.now() }
    const index = questions.findIndex(q => q.id === question.id)
    const newQuestions = [...questions]
    newQuestions.splice(index + 1, 0, newQuestion)
    setQuestions(newQuestions)
  }

  const generateSurvey = (): string => {
    let doc = `${'═'.repeat(60)}\n`
    doc += `${survey.title || '[Survey Title]'}\n`
    doc += `${'═'.repeat(60)}\n\n`

    if (survey.description) {
      doc += `${survey.description}\n\n`
    }

    questions.forEach((q, index) => {
      doc += `${index + 1}. ${q.question}${q.required ? ' *' : ''}\n`

      switch (q.type) {
        case 'text':
          doc += `   [Short answer]\n`
          break
        case 'textarea':
          doc += `   [Long answer]\n`
          break
        case 'multiple':
          q.options.forEach(opt => {
            doc += `   ○ ${opt}\n`
          })
          break
        case 'checkbox':
          q.options.forEach(opt => {
            doc += `   ☐ ${opt}\n`
          })
          break
        case 'rating':
          doc += `   ☆ ☆ ☆ ☆ ☆ (1-5 stars)\n`
          break
        case 'scale':
          doc += `   1  2  3  4  5  6  7  8  9  10\n`
          break
      }
      doc += '\n'
    })

    doc += `${'─'.repeat(40)}\n`
    doc += `${survey.thankYouMessage}\n`

    return doc
  }

  const copySurvey = () => {
    navigator.clipboard.writeText(generateSurvey())
  }

  const QuestionForm = () => {
    const [form, setForm] = useState<Omit<Question, 'id'>>({
      type: 'text',
      question: '',
      options: ['Option 1', 'Option 2'],
      required: false,
    })

    const updateOption = (index: number, value: string) => {
      const newOptions = [...form.options]
      newOptions[index] = value
      setForm({ ...form, options: newOptions })
    }

    const addOption = () => {
      setForm({ ...form, options: [...form.options, `Option ${form.options.length + 1}`] })
    }

    const removeOption = (index: number) => {
      if (form.options.length > 2) {
        setForm({ ...form, options: form.options.filter((_, i) => i !== index) })
      }
    }

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.surveyCreator.addQuestion')}</h3>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {questionTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setForm({ ...form, type: type.id as Question['type'] })}
                className={`px-3 py-2 rounded text-sm ${form.type === type.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                {type.icon} {type.name}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="Question text"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          {(form.type === 'multiple' || form.type === 'checkbox') && (
            <div className="space-y-2">
              <label className="text-sm text-slate-500">Options</label>
              {form.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <span className="w-6 text-center text-slate-400">{form.type === 'multiple' ? '○' : '☐'}</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    disabled={form.options.length <= 2}
                    className="text-red-400 hover:text-red-600 disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button onClick={addOption} className="text-blue-500 hover:text-blue-600 text-sm">
                + Add Option
              </button>
            </div>
          )}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.required}
              onChange={(e) => setForm({ ...form, required: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Required</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => addQuestion(form)}
              disabled={!form.question}
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

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.surveyCreator.details')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={survey.title}
            onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
            placeholder="Survey Title"
            className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
          />
          <textarea
            value={survey.description}
            onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
            placeholder="Survey description or instructions"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <input
            type="text"
            value={survey.thankYouMessage}
            onChange={(e) => setSurvey({ ...survey, thankYouMessage: e.target.value })}
            placeholder="Thank you message"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
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
          + {t('tools.surveyCreator.addQuestion')}
        </button>
      )}

      {showForm && <QuestionForm />}

      <div className="space-y-3">
        {questions.map((question, index) => {
          const qType = questionTypes.find(t => t.id === question.type)
          return (
            <div key={question.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{index + 1}.</span>
                  <span className="font-medium">{question.question}</span>
                  {question.required && <span className="text-red-500">*</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveQuestion(index, 'up')} disabled={index === 0} className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↑</button>
                  <button onClick={() => moveQuestion(index, 'down')} disabled={index === questions.length - 1} className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↓</button>
                  <button onClick={() => duplicateQuestion(question)} className="px-2 py-1 text-slate-400 hover:text-slate-600">⧉</button>
                  <button onClick={() => removeQuestion(question.id)} className="px-2 py-1 text-red-400 hover:text-red-600">×</button>
                </div>
              </div>
              <div className="text-sm text-slate-500 mb-2">{qType?.icon} {qType?.name}</div>
              {(question.type === 'multiple' || question.type === 'checkbox') && (
                <div className="space-y-1">
                  {question.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span>{question.type === 'multiple' ? '○' : '☐'}</span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'rating' && (
                <div className="text-yellow-400">☆ ☆ ☆ ☆ ☆</div>
              )}
              {question.type === 'scale' && (
                <div className="flex gap-2 text-sm text-slate-400">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <span key={n} className="w-6 h-6 rounded border flex items-center justify-center">{n}</span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {questions.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Add questions to build your survey
        </div>
      )}

      {questions.length > 0 && (
        <button onClick={copySurvey} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          {t('tools.surveyCreator.export')}
        </button>
      )}
    </div>
  )
}
