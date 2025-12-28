import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function TweetCharacterCounter() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [platform, setPlatform] = useState<'twitter' | 'threads' | 'mastodon'>('twitter')

  const limits = {
    twitter: 280,
    threads: 500,
    mastodon: 500
  }

  const stats = useMemo(() => {
    const limit = limits[platform]
    const charCount = text.length
    const remaining = limit - charCount
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    const urlRegex = /https?:\/\/[^\s]+/g
    const urls = text.match(urlRegex) || []
    const hashtagRegex = /#\w+/g
    const hashtags = text.match(hashtagRegex) || []
    const mentionRegex = /@\w+/g
    const mentions = text.match(mentionRegex) || []

    // Twitter counts URLs as 23 characters
    let adjustedCount = charCount
    if (platform === 'twitter') {
      urls.forEach(url => {
        adjustedCount = adjustedCount - url.length + 23
      })
    }
    const adjustedRemaining = limit - adjustedCount

    return {
      charCount,
      remaining,
      wordCount,
      urlCount: urls.length,
      hashtagCount: hashtags.length,
      mentionCount: mentions.length,
      adjustedCount,
      adjustedRemaining,
      limit
    }
  }, [text, platform])

  const getProgressColor = () => {
    const percent = (stats.adjustedCount / stats.limit) * 100
    if (percent < 80) return 'bg-blue-500'
    if (percent < 100) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTextColor = () => {
    if (stats.adjustedRemaining < 0) return 'text-red-500'
    if (stats.adjustedRemaining < 20) return 'text-yellow-500'
    return 'text-slate-500'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['twitter', 'threads', 'mastodon'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                platform === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('tools.tweetCharacterCounter.placeholder')}
          className="w-full h-40 px-4 py-3 border border-slate-300 rounded-lg resize-none"
        />

        <div className="mt-2">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getProgressColor()}`}
              style={{ width: `${Math.min((stats.adjustedCount / stats.limit) * 100, 100)}%` }}
            />
          </div>
          <div className={`text-right text-sm mt-1 ${getTextColor()}`}>
            {stats.adjustedRemaining} {t('tools.tweetCharacterCounter.remaining')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.charCount}</div>
          <div className="text-xs text-slate-500">{t('tools.tweetCharacterCounter.characters')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.wordCount}</div>
          <div className="text-xs text-slate-500">{t('tools.tweetCharacterCounter.words')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.hashtagCount}</div>
          <div className="text-xs text-slate-500">{t('tools.tweetCharacterCounter.hashtags')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.mentionCount}</div>
          <div className="text-xs text-slate-500">{t('tools.tweetCharacterCounter.mentions')}</div>
        </div>
      </div>

      {stats.urlCount > 0 && platform === 'twitter' && (
        <div className="card p-4 bg-blue-50">
          <p className="text-sm text-blue-700">
            {t('tools.tweetCharacterCounter.urlNote', { count: stats.urlCount })}
          </p>
        </div>
      )}

      {stats.adjustedRemaining < 0 && (
        <div className="card p-4 bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">
            {t('tools.tweetCharacterCounter.overLimit', { count: Math.abs(stats.adjustedRemaining) })}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setText('')}
          className="flex-1 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
        >
          {t('tools.tweetCharacterCounter.clear')}
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(text)}
          className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!text}
        >
          {t('tools.tweetCharacterCounter.copy')}
        </button>
      </div>
    </div>
  )
}
