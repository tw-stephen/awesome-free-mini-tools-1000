import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function StatusUpdateFormatter() {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('')
  const [status, setStatus] = useState<'on-track' | 'at-risk' | 'blocked' | 'completed'>('on-track')
  const [progress, setProgress] = useState(50)
  const [highlights, setHighlights] = useState('')
  const [nextSteps, setNextSteps] = useState('')
  const [risks, setRisks] = useState('')
  const [format, setFormat] = useState<'standard' | 'brief' | 'detailed'>('standard')

  const statusColors = {
    'on-track': { bg: 'bg-green-100', text: 'text-green-700', emoji: 'On Track' },
    'at-risk': { bg: 'bg-yellow-100', text: 'text-yellow-700', emoji: 'At Risk' },
    'blocked': { bg: 'bg-red-100', text: 'text-red-700', emoji: 'Blocked' },
    'completed': { bg: 'bg-blue-100', text: 'text-blue-700', emoji: 'Completed' },
  }

  const generateUpdate = (): string => {
    const date = new Date().toLocaleDateString()
    const statusInfo = statusColors[status]

    if (format === 'brief') {
      let brief = `${projectName || '[Project]'} | ${statusInfo.emoji} | ${progress}%\n`
      if (highlights) brief += `Latest: ${highlights.split('\n')[0]}\n`
      if (nextSteps) brief += `Next: ${nextSteps.split('\n')[0]}`
      return brief
    }

    let update = `STATUS UPDATE\n${'='.repeat(50)}\n\n`
    update += `Project: ${projectName || '[Project Name]'}\n`
    update += `Date: ${date}\n`
    update += `Status: ${statusInfo.emoji}\n`
    update += `Progress: ${progress}%\n\n`

    if (format === 'detailed') {
      update += `${'─'.repeat(30)}\n`
      update += `[${('█'.repeat(Math.floor(progress / 10)))}${('░'.repeat(10 - Math.floor(progress / 10)))}]\n`
      update += `${'─'.repeat(30)}\n\n`
    }

    if (highlights) {
      update += `HIGHLIGHTS\n${'─'.repeat(30)}\n${highlights}\n\n`
    }

    if (nextSteps) {
      update += `NEXT STEPS\n${'─'.repeat(30)}\n${nextSteps}\n\n`
    }

    if (risks && (status === 'at-risk' || status === 'blocked')) {
      update += `RISKS/BLOCKERS\n${'─'.repeat(30)}\n${risks}\n\n`
    }

    return update
  }

  const copyUpdate = () => {
    navigator.clipboard.writeText(generateUpdate())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.statusUpdateFormatter.project')}</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.statusUpdateFormatter.status')}</h3>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(statusColors) as Array<keyof typeof statusColors>).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded ${
                status === s
                  ? `${statusColors[s].bg} ${statusColors[s].text}`
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {statusColors[s].emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{t('tools.statusUpdateFormatter.progress')}</h3>
          <span className="font-mono">{progress}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="w-full bg-slate-200 rounded-full h-3 mt-2">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.statusUpdateFormatter.format')}</h3>
        <div className="flex gap-2">
          {(['brief', 'standard', 'detailed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`flex-1 py-2 rounded capitalize ${
                format === f ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.statusUpdateFormatter.highlights')}</label>
          <textarea
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder="Key accomplishments, milestones reached..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.statusUpdateFormatter.nextSteps')}</label>
          <textarea
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
            placeholder="Upcoming tasks, planned activities..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
        {(status === 'at-risk' || status === 'blocked') && (
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.statusUpdateFormatter.risks')}</label>
            <textarea
              value={risks}
              onChange={(e) => setRisks(e.target.value)}
              placeholder="Current risks or blockers..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.statusUpdateFormatter.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateUpdate()}
        </pre>
        <button
          onClick={copyUpdate}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.statusUpdateFormatter.copy')}
        </button>
      </div>
    </div>
  )
}
