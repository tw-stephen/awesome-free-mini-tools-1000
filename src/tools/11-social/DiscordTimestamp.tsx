import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type TimestampFormat = 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R'

interface FormatInfo {
  code: TimestampFormat
  name: string
  example: string
}

export default function DiscordTimestamp() {
  const { t } = useTranslation()
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [copied, setCopied] = useState<string | null>(null)

  const getTimestamp = () => {
    const dateTime = new Date(`${date}T${time}`)
    return Math.floor(dateTime.getTime() / 1000)
  }

  const timestamp = getTimestamp()

  const formats: FormatInfo[] = [
    { code: 't', name: t('tools.discordTimestamp.shortTime'), example: '9:41 PM' },
    { code: 'T', name: t('tools.discordTimestamp.longTime'), example: '9:41:30 PM' },
    { code: 'd', name: t('tools.discordTimestamp.shortDate'), example: '11/28/2024' },
    { code: 'D', name: t('tools.discordTimestamp.longDate'), example: 'November 28, 2024' },
    { code: 'f', name: t('tools.discordTimestamp.shortDateTime'), example: 'November 28, 2024 9:41 PM' },
    { code: 'F', name: t('tools.discordTimestamp.longDateTime'), example: 'Thursday, November 28, 2024 9:41 PM' },
    { code: 'R', name: t('tools.discordTimestamp.relative'), example: 'in 3 hours' }
  ]

  const getDiscordFormat = (format: TimestampFormat) => {
    return `<t:${timestamp}:${format}>`
  }

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text)
    setCopied(format)
    setTimeout(() => setCopied(null), 2000)
  }

  const setNow = () => {
    const now = new Date()
    setDate(now.toISOString().slice(0, 10))
    setTime(now.toTimeString().slice(0, 5))
  }

  const addTime = (minutes: number) => {
    const dateTime = new Date(`${date}T${time}`)
    dateTime.setMinutes(dateTime.getMinutes() + minutes)
    setDate(dateTime.toISOString().slice(0, 10))
    setTime(dateTime.toTimeString().slice(0, 5))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.discordTimestamp.selectDateTime')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.discordTimestamp.date')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.discordTimestamp.time')}
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={setNow}
            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm"
          >
            {t('tools.discordTimestamp.now')}
          </button>
          <button
            onClick={() => addTime(30)}
            className="px-3 py-1.5 bg-slate-100 rounded text-sm"
          >
            +30m
          </button>
          <button
            onClick={() => addTime(60)}
            className="px-3 py-1.5 bg-slate-100 rounded text-sm"
          >
            +1h
          </button>
          <button
            onClick={() => addTime(60 * 24)}
            className="px-3 py-1.5 bg-slate-100 rounded text-sm"
          >
            +1d
          </button>
          <button
            onClick={() => addTime(60 * 24 * 7)}
            className="px-3 py-1.5 bg-slate-100 rounded text-sm"
          >
            +1w
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.discordTimestamp.unixTimestamp')}
          </h3>
          <button
            onClick={() => copyToClipboard(timestamp.toString(), 'unix')}
            className="text-sm text-blue-500"
          >
            {copied === 'unix' ? t('tools.discordTimestamp.copied') : t('tools.discordTimestamp.copy')}
          </button>
        </div>
        <div className="bg-slate-100 p-3 rounded font-mono text-lg">
          {timestamp}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.discordTimestamp.formats')}
        </h3>
        <div className="space-y-2">
          {formats.map(format => (
            <div
              key={format.code}
              className="flex items-center justify-between p-3 bg-slate-50 rounded"
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{format.name}</div>
                <div className="text-xs text-slate-500">{format.example}</div>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-slate-200 px-2 py-1 rounded">
                  {getDiscordFormat(format.code)}
                </code>
                <button
                  onClick={() => copyToClipboard(getDiscordFormat(format.code), format.code)}
                  className={`px-3 py-1 rounded text-sm ${
                    copied === format.code
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {copied === format.code ? '✓' : t('tools.discordTimestamp.copy')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.discordTimestamp.howToUse')}</h3>
        <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
          <li>{t('tools.discordTimestamp.step1')}</li>
          <li>{t('tools.discordTimestamp.step2')}</li>
          <li>{t('tools.discordTimestamp.step3')}</li>
        </ol>
      </div>
    </div>
  )
}
