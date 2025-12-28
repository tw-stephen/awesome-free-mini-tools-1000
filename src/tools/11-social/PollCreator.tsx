import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PollOption {
  id: string
  text: string
  votes: number
}

export default function PollCreator() {
  const { t } = useTranslation()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '', votes: 0 },
    { id: '2', text: '', votes: 0 }
  ])
  const [mode, setMode] = useState<'create' | 'preview' | 'results'>('create')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: Date.now().toString(), text: '', votes: 0 }])
    }
  }

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(o => o.id !== id))
    }
  }

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, text } : o))
  }

  const vote = (id: string) => {
    setSelectedOption(id)
    setOptions(options.map(o => o.id === id ? { ...o, votes: o.votes + 1 } : o))
    setMode('results')
  }

  const resetPoll = () => {
    setOptions(options.map(o => ({ ...o, votes: 0 })))
    setSelectedOption(null)
    setMode('preview')
  }

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0)

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  const generateShareText = () => {
    let text = `📊 ${question}\n\n`
    options.forEach((o, i) => {
      if (o.text) {
        text += `${String.fromCharCode(65 + i)}. ${o.text}\n`
      }
    })
    return text
  }

  const copyPoll = () => {
    navigator.clipboard.writeText(generateShareText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isValid = question.trim() && options.filter(o => o.text.trim()).length >= 2

  return (
    <div className="space-y-4">
      {mode === 'create' && (
        <>
          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.pollCreator.question')}
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('tools.pollCreator.questionPlaceholder')}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-lg"
            />
          </div>

          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              {t('tools.pollCreator.options')}
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex gap-2">
                  <span className="w-8 h-10 flex items-center justify-center bg-slate-100 rounded text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={t('tools.pollCreator.optionPlaceholder', { n: index + 1 })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(option.id)}
                      className="px-3 text-red-500 hover:bg-red-50 rounded"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <button
                onClick={addOption}
                className="mt-3 text-sm text-blue-500 hover:text-blue-600"
              >
                + {t('tools.pollCreator.addOption')}
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode('preview')}
              disabled={!isValid}
              className="flex-1 py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
            >
              {t('tools.pollCreator.preview')}
            </button>
            <button
              onClick={copyPoll}
              disabled={!isValid}
              className="px-4 py-3 bg-slate-100 rounded font-medium disabled:opacity-50"
            >
              {copied ? '✓' : t('tools.pollCreator.copy')}
            </button>
          </div>
        </>
      )}

      {mode === 'preview' && (
        <>
          <button
            onClick={() => setMode('create')}
            className="flex items-center gap-2 text-blue-500"
          >
            ← {t('tools.pollCreator.backToEdit')}
          </button>

          <div className="card p-4">
            <h2 className="text-lg font-bold mb-4">{question}</h2>
            <div className="space-y-2">
              {options.filter(o => o.text.trim()).map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => vote(option.id)}
                  className="w-full p-3 text-left border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
                >
                  <span className="font-medium text-blue-600 mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option.text}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-3">
              {t('tools.pollCreator.clickToVote')}
            </p>
          </div>
        </>
      )}

      {mode === 'results' && (
        <>
          <button
            onClick={() => setMode('create')}
            className="flex items-center gap-2 text-blue-500"
          >
            ← {t('tools.pollCreator.backToEdit')}
          </button>

          <div className="card p-4">
            <h2 className="text-lg font-bold mb-4">{question}</h2>
            <div className="space-y-3">
              {options.filter(o => o.text.trim()).map((option, index) => {
                const percent = getPercentage(option.votes)
                const isSelected = selectedOption === option.id

                return (
                  <div key={option.id} className="relative">
                    <div
                      className={`absolute inset-0 rounded-lg ${
                        isSelected ? 'bg-blue-100' : 'bg-slate-100'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                    <div className="relative p-3 flex justify-between items-center">
                      <span>
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option.text}
                        {isSelected && <span className="ml-2">✓</span>}
                      </span>
                      <span className="font-bold">{percent}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-sm text-slate-500 mt-3">
              {totalVotes} {t('tools.pollCreator.totalVotes')}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetPoll}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('tools.pollCreator.voteAgain')}
            </button>
            <button
              onClick={copyPoll}
              className="flex-1 py-2 bg-blue-500 text-white rounded"
            >
              {copied ? t('tools.pollCreator.copied') : t('tools.pollCreator.sharePoll')}
            </button>
          </div>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <p className="text-sm text-blue-700">
          {t('tools.pollCreator.note')}
        </p>
      </div>
    </div>
  )
}
