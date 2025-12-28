import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Platform = 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok' | 'github' | 'twitch' | 'discord' | 'snapchat' | 'pinterest' | 'telegram' | 'whatsapp' | 'email'

interface SocialLink {
  platform: Platform
  username: string
  url: string
}

export default function SocialLinkGenerator() {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [customUsernames, setCustomUsernames] = useState<Partial<Record<Platform, string>>>({})
  const [copied, setCopied] = useState<string | null>(null)

  const platformData: Record<Platform, { icon: string; baseUrl: string; placeholder: string }> = {
    instagram: { icon: '📸', baseUrl: 'https://instagram.com/', placeholder: 'username' },
    twitter: { icon: '🐦', baseUrl: 'https://twitter.com/', placeholder: 'username' },
    facebook: { icon: '👤', baseUrl: 'https://facebook.com/', placeholder: 'username or page' },
    linkedin: { icon: '💼', baseUrl: 'https://linkedin.com/in/', placeholder: 'username' },
    youtube: { icon: '🎬', baseUrl: 'https://youtube.com/@', placeholder: 'channel' },
    tiktok: { icon: '🎵', baseUrl: 'https://tiktok.com/@', placeholder: 'username' },
    github: { icon: '💻', baseUrl: 'https://github.com/', placeholder: 'username' },
    twitch: { icon: '🎮', baseUrl: 'https://twitch.tv/', placeholder: 'username' },
    discord: { icon: '💬', baseUrl: 'https://discord.gg/', placeholder: 'invite code' },
    snapchat: { icon: '👻', baseUrl: 'https://snapchat.com/add/', placeholder: 'username' },
    pinterest: { icon: '📌', baseUrl: 'https://pinterest.com/', placeholder: 'username' },
    telegram: { icon: '✈️', baseUrl: 'https://t.me/', placeholder: 'username' },
    whatsapp: { icon: '📱', baseUrl: 'https://wa.me/', placeholder: 'phone number' },
    email: { icon: '📧', baseUrl: 'mailto:', placeholder: 'email@example.com' }
  }

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const getUsername = (platform: Platform) => {
    return customUsernames[platform] || username
  }

  const generatedLinks = useMemo((): SocialLink[] => {
    return selectedPlatforms.map(platform => ({
      platform,
      username: getUsername(platform),
      url: platformData[platform].baseUrl + getUsername(platform)
    })).filter(link => link.username)
  }, [selectedPlatforms, username, customUsernames])

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAllLinks = () => {
    const text = generatedLinks.map(link => `${link.platform}: ${link.url}`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAsHTML = () => {
    const html = generatedLinks.map(link =>
      `<a href="${link.url}" target="_blank">${platformData[link.platform].icon} ${link.platform}</a>`
    ).join('\n')
    navigator.clipboard.writeText(html)
    setCopied('html')
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAsMarkdown = () => {
    const md = generatedLinks.map(link =>
      `- [${link.platform}](${link.url})`
    ).join('\n')
    navigator.clipboard.writeText(md)
    setCopied('markdown')
    setTimeout(() => setCopied(null), 2000)
  }

  const selectAll = () => {
    setSelectedPlatforms(Object.keys(platformData) as Platform[])
  }

  const clearAll = () => {
    setSelectedPlatforms([])
    setCustomUsernames({})
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.socialLinkGenerator.defaultUsername')}
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('tools.socialLinkGenerator.usernamePlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <p className="text-xs text-slate-500 mt-1">
          {t('tools.socialLinkGenerator.usernameHint')}
        </p>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.socialLinkGenerator.selectPlatforms')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs text-blue-500"
            >
              {t('tools.socialLinkGenerator.selectAll')}
            </button>
            <button
              onClick={clearAll}
              className="text-xs text-red-500"
            >
              {t('tools.socialLinkGenerator.clearAll')}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(platformData) as Platform[]).map(platform => (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                selectedPlatforms.includes(platform) ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {platformData[platform].icon} {platform}
            </button>
          ))}
        </div>
      </div>

      {selectedPlatforms.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.socialLinkGenerator.customUsernames')}
          </h3>
          <div className="space-y-2">
            {selectedPlatforms.map(platform => (
              <div key={platform} className="flex items-center gap-2">
                <span className="w-24 text-sm capitalize">
                  {platformData[platform].icon} {platform}
                </span>
                <input
                  type="text"
                  value={customUsernames[platform] || ''}
                  onChange={(e) => setCustomUsernames(prev => ({
                    ...prev,
                    [platform]: e.target.value
                  }))}
                  placeholder={customUsernames[platform] || username || platformData[platform].placeholder}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {generatedLinks.length > 0 && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-slate-700">
                {t('tools.socialLinkGenerator.generatedLinks')} ({generatedLinks.length})
              </h3>
              <button
                onClick={copyAllLinks}
                className={`text-sm px-3 py-1 rounded ${
                  copied === 'all' ? 'bg-green-500 text-white' : 'bg-slate-100'
                }`}
              >
                {copied === 'all' ? '✓' : t('tools.socialLinkGenerator.copyAll')}
              </button>
            </div>
            <div className="space-y-2">
              {generatedLinks.map(link => (
                <div key={link.platform} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span>{platformData[link.platform].icon}</span>
                      <span className="font-medium capitalize">{link.platform}</span>
                    </div>
                    <div className="text-xs text-blue-500 truncate">{link.url}</div>
                  </div>
                  <button
                    onClick={() => copyLink(link.url)}
                    className={`ml-2 px-2 py-1 text-xs rounded shrink-0 ${
                      copied === link.url ? 'bg-green-500 text-white' : 'bg-slate-100'
                    }`}
                  >
                    {copied === link.url ? '✓' : t('tools.socialLinkGenerator.copy')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyAsHTML}
              className={`py-2 rounded text-sm ${
                copied === 'html' ? 'bg-green-500 text-white' : 'bg-slate-100'
              }`}
            >
              {copied === 'html' ? '✓' : t('tools.socialLinkGenerator.copyAsHtml')}
            </button>
            <button
              onClick={copyAsMarkdown}
              className={`py-2 rounded text-sm ${
                copied === 'markdown' ? 'bg-green-500 text-white' : 'bg-slate-100'
              }`}
            >
              {copied === 'markdown' ? '✓' : t('tools.socialLinkGenerator.copyAsMarkdown')}
            </button>
          </div>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.socialLinkGenerator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.socialLinkGenerator.tip1')}</li>
          <li>• {t('tools.socialLinkGenerator.tip2')}</li>
          <li>• {t('tools.socialLinkGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
