import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function StandupFormatter() {
  const { t } = useTranslation()
  const [yesterday, setYesterday] = useState('')
  const [today, setToday] = useState('')
  const [blockers, setBlockers] = useState('')
  const [format, setFormat] = useState<'standard' | 'slack' | 'markdown' | 'minimal'>('standard')
  const [name, setName] = useState('')

  const generateStandup = (): string => {
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

    switch (format) {
      case 'slack':
        let slack = name ? `*${name}'s Standup* - ${date}\n\n` : `*Daily Standup* - ${date}\n\n`
        slack += `:white_check_mark: *Yesterday:*\n${yesterday || '_Nothing to report_'}\n\n`
        slack += `:calendar: *Today:*\n${today || '_Nothing planned_'}\n\n`
        slack += `:no_entry: *Blockers:*\n${blockers || '_None_'}`
        return slack

      case 'markdown':
        let md = name ? `## ${name}'s Standup - ${date}\n\n` : `## Daily Standup - ${date}\n\n`
        md += `### Yesterday\n${yesterday || '*Nothing to report*'}\n\n`
        md += `### Today\n${today || '*Nothing planned*'}\n\n`
        md += `### Blockers\n${blockers || '*None*'}`
        return md

      case 'minimal':
        let min = `${date}\n`
        min += `Done: ${yesterday || '-'}\n`
        min += `Todo: ${today || '-'}\n`
        min += `Blocked: ${blockers || '-'}`
        return min

      default:
        let std = `DAILY STANDUP`
        if (name) std += ` - ${name}`
        std += `\n${date}\n${'─'.repeat(40)}\n\n`
        std += `YESTERDAY:\n${yesterday || 'Nothing to report'}\n\n`
        std += `TODAY:\n${today || 'Nothing planned'}\n\n`
        std += `BLOCKERS:\n${blockers || 'None'}`
        return std
    }
  }

  const copyStandup = () => {
    navigator.clipboard.writeText(generateStandup())
  }

  const formats = [
    { id: 'standard', name: 'Standard' },
    { id: 'slack', name: 'Slack' },
    { id: 'markdown', name: 'Markdown' },
    { id: 'minimal', name: 'Minimal' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-sm text-slate-500 block mb-1">{t('tools.standupFormatter.name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.standupFormatter.format')}</h3>
        <div className="flex gap-2">
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id as typeof format)}
              className={`flex-1 py-2 rounded ${
                format === f.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <span className="w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center text-xs">Y</span>
            {t('tools.standupFormatter.yesterday')}
          </label>
          <textarea
            value={yesterday}
            onChange={(e) => setYesterday(e.target.value)}
            placeholder="What did you complete yesterday?"
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xs">T</span>
            {t('tools.standupFormatter.today')}
          </label>
          <textarea
            value={today}
            onChange={(e) => setToday(e.target.value)}
            placeholder="What will you work on today?"
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <span className="w-6 h-6 bg-red-100 text-red-600 rounded flex items-center justify-center text-xs">B</span>
            {t('tools.standupFormatter.blockers')}
          </label>
          <textarea
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            placeholder="Any blockers or impediments?"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.standupFormatter.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateStandup()}
        </pre>
        <button
          onClick={copyStandup}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.standupFormatter.copy')}
        </button>
      </div>
    </div>
  )
}
