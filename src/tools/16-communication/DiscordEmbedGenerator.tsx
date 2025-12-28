import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function DiscordEmbedGenerator() {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#5865F2')
  const [authorName, setAuthorName] = useState('')
  const [footerText, setFooterText] = useState('')
  const [timestamp, setTimestamp] = useState(false)

  const generateEmbed = () => {
    const embed: Record<string, unknown> = {}

    if (title) embed.title = title
    if (description) embed.description = description
    if (color) embed.color = parseInt(color.replace('#', ''), 16)
    if (authorName) embed.author = { name: authorName }
    if (footerText) embed.footer = { text: footerText }
    if (timestamp) embed.timestamp = new Date().toISOString()

    return JSON.stringify({ embeds: [embed] }, null, 2)
  }

  const copyEmbed = () => {
    navigator.clipboard.writeText(generateEmbed())
  }

  const previewColors = ['#5865F2', '#57F287', '#FEE75C', '#EB459E', '#ED4245', '#9B59B6']

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.discordEmbedGenerator.title')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Embed title"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.discordEmbedGenerator.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Embed description (supports markdown)"
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-2">{t('tools.discordEmbedGenerator.color')}</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-10 cursor-pointer"
          />
          <div className="flex gap-1">
            {previewColors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded border-2 border-white shadow"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.discordEmbedGenerator.author')}</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Author name"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.discordEmbedGenerator.footer')}</label>
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="Footer text"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={timestamp}
            onChange={(e) => setTimestamp(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">{t('tools.discordEmbedGenerator.addTimestamp')}</span>
        </label>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.discordEmbedGenerator.preview')}</h3>
        <div className="bg-[#36393f] p-4 rounded-lg">
          <div
            className="border-l-4 bg-[#2f3136] rounded p-4"
            style={{ borderColor: color }}
          >
            {authorName && (
              <div className="text-xs text-slate-400 mb-2">{authorName}</div>
            )}
            {title && (
              <div className="text-blue-400 font-medium mb-2">{title}</div>
            )}
            {description && (
              <div className="text-slate-200 text-sm">{description}</div>
            )}
            {(footerText || timestamp) && (
              <div className="text-xs text-slate-500 mt-3 flex gap-2">
                {footerText && <span>{footerText}</span>}
                {footerText && timestamp && <span>•</span>}
                {timestamp && <span>{new Date().toLocaleString()}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.discordEmbedGenerator.json')}</h3>
        <pre className="bg-slate-800 text-green-400 p-4 rounded text-xs overflow-x-auto">
          {generateEmbed()}
        </pre>
        <button
          onClick={copyEmbed}
          className="w-full mt-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {t('tools.discordEmbedGenerator.copy')}
        </button>
      </div>
    </div>
  )
}
