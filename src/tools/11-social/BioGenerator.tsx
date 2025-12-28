import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function BioGenerator() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [profession, setProfession] = useState('')
  const [interests, setInterests] = useState('')
  const [tone, setTone] = useState<'professional' | 'casual' | 'fun' | 'minimal'>('professional')
  const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'linkedin' | 'tiktok'>('instagram')
  const [generatedBio, setGeneratedBio] = useState('')
  const [copied, setCopied] = useState(false)

  const templates = {
    professional: {
      instagram: [
        `${name} | ${profession}`,
        `Helping people with ${interests}`,
        `DM for collaborations`
      ],
      twitter: [
        `${profession} | ${interests} enthusiast`,
        `Building the future, one ${interests.split(',')[0]?.trim() || 'idea'} at a time`,
        `${name}`
      ],
      linkedin: [
        `${profession} passionate about ${interests}`,
        `Connecting innovative ideas with practical solutions`,
        `Let's build something great together`
      ],
      tiktok: [
        `${name} | ${profession}`,
        `Content about ${interests}`,
        `Follow for more!`
      ]
    },
    casual: {
      instagram: [
        `Hey, I'm ${name}!`,
        `${profession} by day`,
        `${interests} lover`,
        `Let's connect!`
      ],
      twitter: [
        `Just a ${profession} who loves ${interests}`,
        `Tweets about life, ${interests}, and everything in between`,
        `${name}`
      ],
      linkedin: [
        `${profession} | ${interests} aficionado`,
        `Always learning, always growing`,
        `Open to new opportunities!`
      ],
      tiktok: [
        `${name} here!`,
        `Your friendly neighborhood ${profession}`,
        `${interests} content creator`
      ]
    },
    fun: {
      instagram: [
        `${name} reporting for duty!`,
        `Professional ${profession}`,
        `Powered by ${interests.split(',')[0]?.trim() || 'coffee'}`,
        `Drop a follow, you won't regret it!`
      ],
      twitter: [
        `${profession} by day, ${interests} enthusiast by night`,
        `90% ${interests}, 10% random thoughts`,
        `${name}`
      ],
      linkedin: [
        `Making ${profession.toLowerCase()} fun again`,
        `Passionate about ${interests} and good coffee`,
        `Let's chat!`
      ],
      tiktok: [
        `Welcome to the ${name} show!`,
        `${profession} doing ${interests}`,
        `Smash that follow button!`
      ]
    },
    minimal: {
      instagram: [
        `${name}`,
        `${profession}`,
        `${interests}`
      ],
      twitter: [
        `${profession}. ${interests}.`,
        `${name}`
      ],
      linkedin: [
        `${profession}`,
        `${interests}`
      ],
      tiktok: [
        `${name}`,
        `${profession}`
      ]
    }
  }

  const generate = () => {
    const template = templates[tone][platform]
    const bio = template
      .filter(line => line.trim() && !line.includes('undefined'))
      .join('\n')
    setGeneratedBio(bio)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedBio)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const charLimits = {
    instagram: 150,
    twitter: 160,
    linkedin: 2600,
    tiktok: 80
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.bioGenerator.name')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('tools.bioGenerator.namePlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.bioGenerator.profession')}
          </label>
          <input
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder={t('tools.bioGenerator.professionPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.bioGenerator.interests')}
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder={t('tools.bioGenerator.interestsPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.bioGenerator.platform')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['instagram', 'twitter', 'linkedin', 'tiktok'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded text-sm ${
                platform === p ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 mt-2">
          {t('tools.bioGenerator.charLimit')}: {charLimits[platform]}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.bioGenerator.tone')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['professional', 'casual', 'fun', 'minimal'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                tone === t ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        disabled={!name && !profession}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
      >
        {t('tools.bioGenerator.generate')}
      </button>

      {generatedBio && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{t('tools.bioGenerator.result')}</h3>
            <span className={`text-xs ${
              generatedBio.length > charLimits[platform] ? 'text-red-500' : 'text-slate-500'
            }`}>
              {generatedBio.length}/{charLimits[platform]}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded whitespace-pre-line text-sm">
            {generatedBio}
          </div>
          <button
            onClick={copyToClipboard}
            className="mt-3 w-full py-2 bg-green-500 text-white rounded text-sm"
          >
            {copied ? t('tools.bioGenerator.copied') : t('tools.bioGenerator.copy')}
          </button>
        </div>
      )}
    </div>
  )
}
