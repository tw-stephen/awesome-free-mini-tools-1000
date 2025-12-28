import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Question {
  id: number
  type: 'rating' | 'text' | 'choice' | 'scale'
  question: string
  options?: string[]
}

export default function FeedbackFormBuilder() {
  const { t } = useTranslation()
  const [title, setTitle] = useState('Feedback Form')
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, type: 'rating', question: 'How would you rate your overall experience?' },
  ])

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: Date.now(),
      type,
      question: '',
      options: type === 'choice' ? ['Option 1', 'Option 2'] : undefined,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: number, field: keyof Question, value: string | string[]) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  const generateForm = (): string => {
    let form = `${title}\n${'='.repeat(50)}\n\n`

    questions.forEach((q, i) => {
      form += `${i + 1}. ${q.question || '[Question]'}\n`
      switch (q.type) {
        case 'rating':
          form += '   Rating: [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]\n'
          break
        case 'scale':
          form += '   Scale: 1 ─────────────────── 10\n'
          break
        case 'choice':
          q.options?.forEach((opt) => {
            form += `   [ ] ${opt}\n`
          })
          break
        case 'text':
          form += '   Answer: ________________________________\n'
          break
      }
      form += '\n'
    })

    return form
  }

  const copyForm = () => {
    navigator.clipboard.writeText(generateForm())
  }

  const questionTypes = [
    { id: 'rating', name: 'Star Rating', icon: '*' },
    { id: 'scale', name: 'Scale 1-10', icon: '-' },
    { id: 'choice', name: 'Multiple Choice', icon: '?' },
    { id: 'text', name: 'Open Text', icon: 'T' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.feedbackFormBuilder.title')}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Form title"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.feedbackFormBuilder.addQuestion')}</h3>
        <div className="flex gap-2 flex-wrap">
          {questionTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => addQuestion(type.id as Question['type'])}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
            >
              + {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, index) => (
          <div key={q.id} className="card p-4">
            <div className="flex items-start gap-3">
              <span className="px-2 py-1 bg-slate-100 rounded text-sm font-mono">
                {index + 1}
              </span>
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                    placeholder="Enter your question..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="px-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    X
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded">
                  {q.type === 'rating' && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className="w-8 h-8 border border-slate-300 rounded flex items-center justify-center bg-white">
                          {n}
                        </span>
                      ))}
                    </div>
                  )}
                  {q.type === 'scale' && (
                    <div className="flex items-center gap-2">
                      <span>1</span>
                      <input type="range" min="1" max="10" className="flex-1" disabled />
                      <span>10</span>
                    </div>
                  )}
                  {q.type === 'choice' && (
                    <div className="space-y-2">
                      {q.options?.map((opt, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="radio" disabled className="mt-1" />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...(q.options || [])]
                              newOptions[i] = e.target.value
                              updateQuestion(q.id, 'options', newOptions)
                            }}
                            className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => updateQuestion(q.id, 'options', [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`])}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        + Add option
                      </button>
                    </div>
                  )}
                  {q.type === 'text' && (
                    <textarea
                      placeholder="Open text response..."
                      disabled
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                      rows={2}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.feedbackFormBuilder.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateForm()}
        </pre>
        <button
          onClick={copyForm}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.feedbackFormBuilder.copy')}
        </button>
      </div>
    </div>
  )
}
