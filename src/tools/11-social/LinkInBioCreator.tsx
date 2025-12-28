import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Theme = 'light' | 'dark' | 'gradient' | 'colorful' | 'minimal'

interface Link {
  id: string
  title: string
  url: string
  icon: string
}

interface Profile {
  name: string
  bio: string
  avatar: string
  theme: Theme
  links: Link[]
}

export default function LinkInBioCreator() {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<Profile>({
    name: '',
    bio: '',
    avatar: '',
    theme: 'light',
    links: []
  })
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: '' })
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)

  const icons = ['🔗', '🌐', '📧', '📱', '💼', '🛒', '📝', '🎵', '📸', '🎬', '💬', '📍']

  useEffect(() => {
    const saved = localStorage.getItem('link-in-bio-profile')
    if (saved) setProfile(JSON.parse(saved))
  }, [])

  const saveProfile = (updated: Profile) => {
    setProfile(updated)
    localStorage.setItem('link-in-bio-profile', JSON.stringify(updated))
  }

  const addLink = () => {
    if (!newLink.title || !newLink.url) return
    const link: Link = {
      id: Date.now().toString(),
      ...newLink,
      icon: newLink.icon || '🔗'
    }
    saveProfile({ ...profile, links: [...profile.links, link] })
    setNewLink({ title: '', url: '', icon: '' })
  }

  const deleteLink = (id: string) => {
    saveProfile({ ...profile, links: profile.links.filter(l => l.id !== id) })
  }

  const moveLink = (id: string, direction: 'up' | 'down') => {
    const index = profile.links.findIndex(l => l.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === profile.links.length - 1) return

    const newLinks = [...profile.links]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]]
    saveProfile({ ...profile, links: newLinks })
  }

  const themeStyles: Record<Theme, { bg: string; card: string; text: string; button: string }> = {
    light: { bg: 'bg-gray-50', card: 'bg-white', text: 'text-gray-900', button: 'bg-gray-900 text-white' },
    dark: { bg: 'bg-gray-900', card: 'bg-gray-800', text: 'text-white', button: 'bg-white text-gray-900' },
    gradient: { bg: 'bg-gradient-to-br from-purple-500 to-pink-500', card: 'bg-white/90', text: 'text-gray-900', button: 'bg-purple-600 text-white' },
    colorful: { bg: 'bg-yellow-400', card: 'bg-white', text: 'text-gray-900', button: 'bg-blue-600 text-white' },
    minimal: { bg: 'bg-white', card: 'bg-gray-100', text: 'text-gray-900', button: 'border-2 border-gray-900 text-gray-900' }
  }

  const generateHTML = () => {
    const theme = themeStyles[profile.theme]
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.name} - Links</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${theme.bg} min-h-screen py-12 px-4">
  <div class="max-w-md mx-auto text-center">
    ${profile.avatar ? `<img src="${profile.avatar}" alt="${profile.name}" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">` : ''}
    <h1 class="text-2xl font-bold ${theme.text} mb-2">${profile.name}</h1>
    <p class="${theme.text} opacity-75 mb-8">${profile.bio}</p>
    <div class="space-y-3">
      ${profile.links.map(link => `
      <a href="${link.url}" target="_blank" class="block ${theme.button} px-6 py-3 rounded-full font-medium hover:opacity-90 transition">
        ${link.icon} ${link.title}
      </a>
      `).join('')}
    </div>
    <p class="mt-8 text-sm opacity-50 ${theme.text}">Made with Link in Bio Creator</p>
  </div>
</body>
</html>`
  }

  const copyHTML = () => {
    navigator.clipboard.writeText(generateHTML())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadHTML = () => {
    const blob = new Blob([generateHTML()], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `${profile.name.replace(/\s+/g, '-').toLowerCase() || 'link-in-bio'}.html`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">
          {t('tools.linkInBioCreator.profile')}
        </h3>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => saveProfile({ ...profile, name: e.target.value })}
          placeholder={t('tools.linkInBioCreator.name')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <textarea
          value={profile.bio}
          onChange={(e) => saveProfile({ ...profile, bio: e.target.value })}
          placeholder={t('tools.linkInBioCreator.bio')}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
        <input
          type="text"
          value={profile.avatar}
          onChange={(e) => saveProfile({ ...profile, avatar: e.target.value })}
          placeholder={t('tools.linkInBioCreator.avatarUrl')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.linkInBioCreator.theme')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['light', 'dark', 'gradient', 'colorful', 'minimal'] as const).map(th => (
            <button
              key={th}
              onClick={() => saveProfile({ ...profile, theme: th })}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                profile.theme === th ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {th}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">
          {t('tools.linkInBioCreator.addLink')}
        </h3>
        <div className="flex gap-2">
          <div className="flex flex-wrap gap-1 max-w-[180px]">
            {icons.map(icon => (
              <button
                key={icon}
                onClick={() => setNewLink({ ...newLink, icon })}
                className={`w-8 h-8 rounded ${
                  newLink.icon === icon ? 'bg-blue-100' : 'bg-slate-100'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              placeholder={t('tools.linkInBioCreator.linkTitle')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              placeholder={t('tools.linkInBioCreator.linkUrl')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <button
              onClick={addLink}
              disabled={!newLink.title || !newLink.url}
              className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.linkInBioCreator.add')}
            </button>
          </div>
        </div>
      </div>

      {profile.links.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.linkInBioCreator.links')} ({profile.links.length})
          </h3>
          <div className="space-y-2">
            {profile.links.map((link, index) => (
              <div key={link.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                <span className="text-xl">{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{link.title}</div>
                  <div className="text-xs text-slate-500 truncate">{link.url}</div>
                </div>
                <button
                  onClick={() => moveLink(link.id, 'up')}
                  disabled={index === 0}
                  className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveLink(link.id, 'down')}
                  disabled={index === profile.links.length - 1}
                  className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex-1 py-3 bg-slate-100 rounded font-medium"
        >
          {showPreview ? t('tools.linkInBioCreator.hidePreview') : t('tools.linkInBioCreator.preview')}
        </button>
        <button
          onClick={downloadHTML}
          disabled={!profile.name}
          className="flex-1 py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
        >
          {t('tools.linkInBioCreator.download')}
        </button>
      </div>

      <button
        onClick={copyHTML}
        disabled={!profile.name}
        className={`w-full py-2 rounded ${
          copied ? 'bg-green-500 text-white' : 'bg-slate-100'
        } disabled:opacity-50`}
      >
        {copied ? t('tools.linkInBioCreator.copied') : t('tools.linkInBioCreator.copyHtml')}
      </button>

      {showPreview && (
        <div className={`card overflow-hidden ${themeStyles[profile.theme].bg}`}>
          <div className="py-8 px-4 text-center">
            {profile.avatar && (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
            )}
            <h2 className={`text-xl font-bold ${themeStyles[profile.theme].text}`}>
              {profile.name || t('tools.linkInBioCreator.yourName')}
            </h2>
            <p className={`${themeStyles[profile.theme].text} opacity-75 mt-1`}>
              {profile.bio || t('tools.linkInBioCreator.yourBio')}
            </p>
            <div className="mt-6 space-y-2">
              {profile.links.map(link => (
                <div
                  key={link.id}
                  className={`${themeStyles[profile.theme].button} px-4 py-2 rounded-full text-sm`}
                >
                  {link.icon} {link.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
