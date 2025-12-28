import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SlackMessageFormatter() {
  const { t } = useTranslation()
  const [text, setText] = useState('')

  const applyFormat = (prefix: string, suffix: string) => {
    const textarea = document.getElementById('slack-input') as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = text.substring(start, end)

    if (selectedText) {
      const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end)
      setText(newText)
    } else {
      setText(text + prefix + suffix)
    }
  }

  const formatButtons = [
    { label: 'Bold', prefix: '*', suffix: '*' },
    { label: 'Italic', prefix: '_', suffix: '_' },
    { label: 'Strike', prefix: '~', suffix: '~' },
    { label: 'Code', prefix: '`', suffix: '`' },
    { label: 'Code Block', prefix: '```\n', suffix: '\n```' },
    { label: 'Quote', prefix: '> ', suffix: '' },
    { label: 'List', prefix: '• ', suffix: '' },
    { label: 'Numbered', prefix: '1. ', suffix: '' },
  ]

  const insertEmoji = (emoji: string) => {
    setText(text + `:${emoji}:`)
  }

  const commonEmojis = [
    'thumbsup', 'thumbsdown', 'heart', 'fire', 'rocket', 'tada',
    'eyes', 'pray', 'raised_hands', 'clap', 'muscle', 'brain'
  ]

  const insertMention = (type: string) => {
    switch (type) {
      case 'here':
        setText(text + '<!here>')
        break
      case 'channel':
        setText(text + '<!channel>')
        break
      case 'everyone':
        setText(text + '<!everyone>')
        break
    }
  }

  const copyMessage = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.slackMessageFormatter.formatting')}</h3>
        <div className="flex gap-2 flex-wrap">
          {formatButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => applyFormat(btn.prefix, btn.suffix)}
              className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.slackMessageFormatter.mentions')}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => insertMention('here')}
            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
          >
            @here
          </button>
          <button
            onClick={() => insertMention('channel')}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            @channel
          </button>
          <button
            onClick={() => insertMention('everyone')}
            className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            @everyone
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.slackMessageFormatter.emojis')}</h3>
        <div className="flex gap-2 flex-wrap">
          {commonEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => insertEmoji(emoji)}
              className="px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200 font-mono"
            >
              :{emoji}:
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.slackMessageFormatter.message')}</label>
        <textarea
          id="slack-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your Slack message..."
          rows={6}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none font-mono"
        />
        <button
          onClick={copyMessage}
          className="w-full mt-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {t('tools.slackMessageFormatter.copy')}
        </button>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.slackMessageFormatter.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• *bold* for bold text</li>
          <li>• _italic_ for italic text</li>
          <li>• ~strike~ for strikethrough</li>
          <li>• `code` for inline code</li>
        </ul>
      </div>
    </div>
  )
}
