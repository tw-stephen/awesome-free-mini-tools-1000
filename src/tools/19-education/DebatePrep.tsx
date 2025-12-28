import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Argument {
  id: number
  point: string
  evidence: string
  rebuttal: string
  strength: 'weak' | 'moderate' | 'strong'
}

export default function DebatePrep() {
  const { t } = useTranslation()
  const [topic, setTopic] = useState('')
  const [position, setPosition] = useState<'for' | 'against'>('for')
  const [arguments_, setArguments] = useState<Argument[]>([])
  const [counterArguments, setCounterArguments] = useState<Argument[]>([])
  const [newArgument, setNewArgument] = useState({
    point: '',
    evidence: '',
    rebuttal: '',
    strength: 'moderate' as 'weak' | 'moderate' | 'strong',
  })
  const [addingTo, setAddingTo] = useState<'main' | 'counter' | null>(null)
  const [openingStatement, setOpeningStatement] = useState('')
  const [closingStatement, setClosingStatement] = useState('')

  const addArgument = (type: 'main' | 'counter') => {
    if (!newArgument.point.trim()) return
    const argument: Argument = { ...newArgument, id: Date.now() }
    if (type === 'main') {
      setArguments([...arguments_, argument])
    } else {
      setCounterArguments([...counterArguments, argument])
    }
    setNewArgument({ point: '', evidence: '', rebuttal: '', strength: 'moderate' })
    setAddingTo(null)
  }

  const removeArgument = (id: number, type: 'main' | 'counter') => {
    if (type === 'main') {
      setArguments(arguments_.filter(a => a.id !== id))
    } else {
      setCounterArguments(counterArguments.filter(a => a.id !== id))
    }
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-700 border-green-300'
      case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'weak': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-slate-100'
    }
  }

  const exportDebate = () => {
    let text = `DEBATE PREPARATION\n${'='.repeat(50)}\n\n`
    text += `Topic: ${topic || 'N/A'}\n`
    text += `Position: ${position.toUpperCase()}\n\n`

    if (openingStatement) {
      text += `OPENING STATEMENT\n${'-'.repeat(20)}\n${openingStatement}\n\n`
    }

    text += `MAIN ARGUMENTS\n${'-'.repeat(20)}\n`
    arguments_.forEach((arg, i) => {
      text += `${i + 1}. ${arg.point} [${arg.strength}]\n`
      if (arg.evidence) text += `   Evidence: ${arg.evidence}\n`
      if (arg.rebuttal) text += `   Anticipated rebuttal: ${arg.rebuttal}\n`
      text += '\n'
    })

    text += `COUNTER-ARGUMENTS TO ADDRESS\n${'-'.repeat(20)}\n`
    counterArguments.forEach((arg, i) => {
      text += `${i + 1}. ${arg.point}\n`
      if (arg.rebuttal) text += `   Our response: ${arg.rebuttal}\n`
      text += '\n'
    })

    if (closingStatement) {
      text += `CLOSING STATEMENT\n${'-'.repeat(20)}\n${closingStatement}\n`
    }

    navigator.clipboard.writeText(text)
  }

  const ArgumentForm = ({ type }: { type: 'main' | 'counter' }) => (
    <div className="card p-4 border-2 border-blue-300 mt-2">
      <h4 className="font-medium mb-3">
        {type === 'main' ? 'Add Argument' : 'Add Counter-Argument'}
      </h4>
      <div className="space-y-2">
        <input
          type="text"
          value={newArgument.point}
          onChange={(e) => setNewArgument({ ...newArgument, point: e.target.value })}
          placeholder={type === 'main' ? 'Your argument point' : 'Opponent\'s potential argument'}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <textarea
          value={newArgument.evidence}
          onChange={(e) => setNewArgument({ ...newArgument, evidence: e.target.value })}
          placeholder={type === 'main' ? 'Supporting evidence or examples' : 'Their likely evidence'}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
        <textarea
          value={newArgument.rebuttal}
          onChange={(e) => setNewArgument({ ...newArgument, rebuttal: e.target.value })}
          placeholder={type === 'main' ? 'Anticipated counter and your response' : 'How to counter this argument'}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
        {type === 'main' && (
          <div>
            <label className="text-sm text-slate-500 block mb-1">Argument Strength</label>
            <div className="flex gap-2">
              {(['weak', 'moderate', 'strong'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setNewArgument({ ...newArgument, strength: s })}
                  className={`flex-1 py-2 rounded capitalize ${
                    newArgument.strength === s ? getStrengthColor(s) : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => addArgument(type)}
            disabled={!newArgument.point.trim()}
            className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            Add
          </button>
          <button
            onClick={() => setAddingTo(null)}
            className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Debate Topic"
          className="w-full px-3 py-2 text-lg font-bold border border-slate-300 rounded mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setPosition('for')}
            className={`flex-1 py-2 rounded ${
              position === 'for' ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            For / Pro
          </button>
          <button
            onClick={() => setPosition('against')}
            className={`flex-1 py-2 rounded ${
              position === 'against' ? 'bg-red-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Against / Con
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.debatePrep.opening')}</h3>
        <textarea
          value={openingStatement}
          onChange={(e) => setOpeningStatement(e.target.value)}
          placeholder="Write your opening statement..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.debatePrep.arguments')} ({arguments_.length})</h3>
          {addingTo !== 'main' && (
            <button
              onClick={() => setAddingTo('main')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              + Add
            </button>
          )}
        </div>
        <div className="space-y-2">
          {arguments_.map((arg, i) => (
            <div key={arg.id} className={`p-3 rounded border ${getStrengthColor(arg.strength)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium">{i + 1}. {arg.point}</div>
                  {arg.evidence && (
                    <div className="text-sm mt-1">
                      <span className="text-slate-500">Evidence:</span> {arg.evidence}
                    </div>
                  )}
                  {arg.rebuttal && (
                    <div className="text-sm mt-1">
                      <span className="text-slate-500">Rebuttal prep:</span> {arg.rebuttal}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeArgument(arg.id, 'main')}
                  className="text-red-400 hover:text-red-600 ml-2"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
        {addingTo === 'main' && <ArgumentForm type="main" />}
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.debatePrep.counterArguments')} ({counterArguments.length})</h3>
          {addingTo !== 'counter' && (
            <button
              onClick={() => setAddingTo('counter')}
              className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
            >
              + Add
            </button>
          )}
        </div>
        <div className="space-y-2">
          {counterArguments.map((arg, i) => (
            <div key={arg.id} className="p-3 rounded border border-orange-200 bg-orange-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-orange-700">{i + 1}. {arg.point}</div>
                  {arg.rebuttal && (
                    <div className="text-sm mt-1 text-green-700">
                      <span className="font-medium">Our response:</span> {arg.rebuttal}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeArgument(arg.id, 'counter')}
                  className="text-red-400 hover:text-red-600 ml-2"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
        {addingTo === 'counter' && <ArgumentForm type="counter" />}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.debatePrep.closing')}</h3>
        <textarea
          value={closingStatement}
          onChange={(e) => setClosingStatement(e.target.value)}
          placeholder="Write your closing statement..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
      </div>

      <button
        onClick={exportDebate}
        className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
      >
        {t('tools.debatePrep.export')}
      </button>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-blue-700 mb-2">{t('tools.debatePrep.tips')}</h3>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Lead with your strongest arguments</li>
          <li>• Anticipate and prepare for counter-arguments</li>
          <li>• Use specific evidence and examples</li>
          <li>• Practice your timing and transitions</li>
        </ul>
      </div>
    </div>
  )
}
