import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Question {
  id: number
  category: string
  question: string
  answer: string
}

export default function ExitInterviewTemplate() {
  const { t } = useTranslation()
  const [employeeName, setEmployeeName] = useState('')
  const [department, setDepartment] = useState('')
  const [lastDay, setLastDay] = useState('')
  const [reason, setReason] = useState('')
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, category: 'Role', question: 'What did you enjoy most about your role?', answer: '' },
    { id: 2, category: 'Role', question: 'What aspects of the job did you find challenging?', answer: '' },
    { id: 3, category: 'Management', question: 'How would you describe your relationship with your manager?', answer: '' },
    { id: 4, category: 'Management', question: 'Did you receive adequate feedback and support?', answer: '' },
    { id: 5, category: 'Culture', question: 'How would you describe the company culture?', answer: '' },
    { id: 6, category: 'Culture', question: 'Did you feel valued and recognized for your contributions?', answer: '' },
    { id: 7, category: 'Growth', question: 'Were there sufficient opportunities for professional development?', answer: '' },
    { id: 8, category: 'Growth', question: 'What could the company do to improve retention?', answer: '' },
    { id: 9, category: 'Future', question: 'Would you consider returning to the company in the future?', answer: '' },
    { id: 10, category: 'Future', question: 'Would you recommend this company to others?', answer: '' },
  ])
  const [additionalComments, setAdditionalComments] = useState('')

  const updateAnswer = (id: number, answer: string) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, answer } : q
    ))
  }

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Date.now(),
      category: 'Custom',
      question: '',
      answer: ''
    }])
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id: number, field: 'category' | 'question', value: string) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const categories = [...new Set(questions.map(q => q.category))]

  const generateReport = (): string => {
    let text = `EXIT INTERVIEW\\n${'='.repeat(50)}\\n\\n`
    text += `Employee: ${employeeName || '[Name]'}\\n`
    text += `Department: ${department || '[Department]'}\\n`
    text += `Last Day: ${lastDay || '[Date]'}\\n`
    text += `Reason for Leaving: ${reason || '[Reason]'}\\n\\n`

    categories.forEach(cat => {
      const catQuestions = questions.filter(q => q.category === cat && (q.question || q.answer))
      if (catQuestions.length > 0) {
        text += `${cat.toUpperCase()}\\n${'─'.repeat(30)}\\n`
        catQuestions.forEach(q => {
          text += `Q: ${q.question}\\n`
          text += `A: ${q.answer || '[No response]'}\\n\\n`
        })
      }
    })

    if (additionalComments) {
      text += `ADDITIONAL COMMENTS\\n${'─'.repeat(30)}\\n${additionalComments}\\n`
    }

    return text
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.exitInterviewTemplate.details')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Employee Name</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Employee name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Last Day</label>
            <input
              type="date"
              value={lastDay}
              onChange={(e) => setLastDay(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Reason for Leaving</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="">Select reason</option>
              <option value="New opportunity">New opportunity</option>
              <option value="Career change">Career change</option>
              <option value="Relocation">Relocation</option>
              <option value="Personal reasons">Personal reasons</option>
              <option value="Compensation">Compensation</option>
              <option value="Work-life balance">Work-life balance</option>
              <option value="Management issues">Management issues</option>
              <option value="Lack of growth">Lack of growth</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.exitInterviewTemplate.questions')}</h3>
          <button
            onClick={addQuestion}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            + Add Question
          </button>
        </div>
        <div className="space-y-4">
          {categories.map(category => (
            <div key={category}>
              <h4 className="text-sm font-medium text-slate-600 mb-2 uppercase">{category}</h4>
              <div className="space-y-3">
                {questions.filter(q => q.category === category).map((question) => (
                  <div key={question.id} className="p-3 bg-slate-50 rounded">
                    <div className="flex gap-2 mb-2">
                      <select
                        value={question.category}
                        onChange={(e) => updateQuestion(question.id, 'category', e.target.value)}
                        className="px-2 py-1 text-sm border border-slate-300 rounded"
                      >
                        {['Role', 'Management', 'Culture', 'Growth', 'Future', 'Custom'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                        placeholder="Question"
                        className="flex-1 px-3 py-1 text-sm border border-slate-300 rounded"
                      />
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="px-2 text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                    <textarea
                      value={question.answer}
                      onChange={(e) => updateAnswer(question.id, e.target.value)}
                      placeholder="Response..."
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.exitInterviewTemplate.comments')}</label>
        <textarea
          value={additionalComments}
          onChange={(e) => setAdditionalComments(e.target.value)}
          placeholder="Additional comments or suggestions..."
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.exitInterviewTemplate.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generateReport()}
        </pre>
        <button
          onClick={copyReport}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.exitInterviewTemplate.copy')}
        </button>
      </div>
    </div>
  )
}
