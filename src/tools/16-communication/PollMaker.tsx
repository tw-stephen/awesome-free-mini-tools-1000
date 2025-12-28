import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PollOption {
  id: number
  text: string
  votes: number
}

export default function PollMaker() {
  const { t } = useTranslation()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<PollOption[]>([
    { id: 1, text: '', votes: 0 },
    { id: 2, text: '', votes: 0 },
  ])
  const [isVoting, setIsVoting] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: Date.now(), text: '', votes: 0 }])
    }
  }

  const updateOption = (id: number, text: string) => {
    setOptions(options.map(opt =>
      opt.id === id ? { ...opt, text } : opt
    ))
  }

  const removeOption = (id: number) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id))
    }
  }

  const startVoting = () => {
    if (question && options.every(opt => opt.text)) {
      setIsVoting(true)
    }
  }

  const vote = (id: number) => {
    setSelectedOption(id)
    setOptions(options.map(opt =>
      opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
    ))
  }

  const resetPoll = () => {
    setIsVoting(false)
    setSelectedOption(null)
    setOptions(options.map(opt => ({ ...opt, votes: 0 })))
  }

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0)

  const copyPollText = () => {
    let text = `Poll: ${question}\n\n`
    options.forEach((opt, i) => {
      text += `${i + 1}. ${opt.text}\n`
    })
    text += '\nReact with corresponding number to vote!'
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      {!isVoting ? (
        <>
          <div className="card p-4">
            <label className="text-sm text-slate-500 block mb-1">{t('tools.pollMaker.question')}</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's your question?"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.pollMaker.options')}</h3>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex gap-2">
                  <span className="px-3 py-2 bg-slate-100 rounded font-mono">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(option.id)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <button
                onClick={addOption}
                className="w-full mt-3 py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500"
              >
                + {t('tools.pollMaker.addOption')}
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyPollText}
              className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200"
            >
              {t('tools.pollMaker.copyText')}
            </button>
            <button
              onClick={startVoting}
              disabled={!question || options.some(opt => !opt.text)}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {t('tools.pollMaker.startPoll')}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="card p-4">
            <h2 className="text-xl font-bold mb-4">{question}</h2>
            <div className="space-y-3">
              {options.map((option) => {
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
                return (
                  <button
                    key={option.id}
                    onClick={() => !selectedOption && vote(option.id)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    } ${selectedOption !== null ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex justify-between mb-1">
                      <span>{option.text}</span>
                      <span className="font-mono">
                        {option.votes} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="mt-4 text-center text-slate-500">
              {t('tools.pollMaker.totalVotes')}: {totalVotes}
            </div>
          </div>

          <button
            onClick={resetPoll}
            className="w-full py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            {t('tools.pollMaker.reset')}
          </button>
        </>
      )}
    </div>
  )
}
