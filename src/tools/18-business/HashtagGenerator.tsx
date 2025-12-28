import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface HashtagGroup {
  id: number
  name: string
  hashtags: string[]
}

export default function HashtagGenerator() {
  const { t } = useTranslation()
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [generatedTags, setGeneratedTags] = useState<string[]>([])
  const [savedGroups, setSavedGroups] = useState<HashtagGroup[]>([])
  const [customTag, setCustomTag] = useState('')

  const platforms = [
    { id: 'instagram', name: 'Instagram', limit: 30, recommended: '9-11' },
    { id: 'twitter', name: 'Twitter/X', limit: 280, recommended: '1-3' },
    { id: 'tiktok', name: 'TikTok', limit: 100, recommended: '3-5' },
    { id: 'linkedin', name: 'LinkedIn', limit: 30, recommended: '3-5' },
    { id: 'facebook', name: 'Facebook', limit: 30, recommended: '1-2' },
    { id: 'youtube', name: 'YouTube', limit: 500, recommended: '5-8' },
  ]

  const hashtagTemplates: Record<string, string[]> = {
    business: ['entrepreneur', 'smallbusiness', 'startup', 'businessowner', 'success', 'motivation', 'hustle', 'entrepreneurlife', 'businesstips', 'growthmindset'],
    marketing: ['digitalmarketing', 'marketing', 'socialmediamarketing', 'contentmarketing', 'marketingtips', 'branding', 'marketingstrategy', 'onlinemarketing', 'seo', 'marketingdigital'],
    fitness: ['fitness', 'workout', 'gym', 'fitnessmotivation', 'fit', 'health', 'training', 'bodybuilding', 'exercise', 'fitlife'],
    food: ['food', 'foodie', 'foodporn', 'instafood', 'yummy', 'delicious', 'cooking', 'homemade', 'foodphotography', 'recipe'],
    travel: ['travel', 'travelgram', 'wanderlust', 'vacation', 'adventure', 'explore', 'instatravel', 'traveling', 'trip', 'travelphotography'],
    fashion: ['fashion', 'style', 'ootd', 'fashionista', 'outfit', 'fashionstyle', 'instafashion', 'stylish', 'fashionblogger', 'streetstyle'],
    photography: ['photography', 'photooftheday', 'photo', 'photographer', 'instagood', 'picoftheday', 'photoshoot', 'portrait', 'naturephotography', 'photographylovers'],
    tech: ['technology', 'tech', 'innovation', 'coding', 'programming', 'developer', 'software', 'ai', 'digital', 'startup'],
  }

  const generateHashtags = () => {
    if (!topic.trim()) return

    const topicLower = topic.toLowerCase()
    let tags: string[] = []

    // Find matching templates
    Object.entries(hashtagTemplates).forEach(([category, categoryTags]) => {
      if (topicLower.includes(category) || category.includes(topicLower)) {
        tags = [...tags, ...categoryTags]
      }
    })

    // Generate topic-based hashtags
    const topicTags = [
      topic.replace(/\s+/g, '').toLowerCase(),
      `${topic.replace(/\s+/g, '').toLowerCase()}life`,
      `${topic.replace(/\s+/g, '').toLowerCase()}tips`,
      `${topic.replace(/\s+/g, '').toLowerCase()}lover`,
      `love${topic.replace(/\s+/g, '').toLowerCase()}`,
    ]

    tags = [...new Set([...tags, ...topicTags])]

    // Add platform-specific popular tags
    if (platform === 'instagram') {
      tags = [...tags, 'instagood', 'instagram', 'instadaily', 'explore', 'viral']
    } else if (platform === 'tiktok') {
      tags = [...tags, 'fyp', 'foryou', 'viral', 'trending', 'foryoupage']
    } else if (platform === 'twitter') {
      tags = [...tags, 'trending', 'viral']
    }

    // Remove duplicates and limit
    const selectedPlatform = platforms.find(p => p.id === platform)
    const limit = selectedPlatform?.id === 'instagram' ? 30 : 15
    setGeneratedTags([...new Set(tags)].slice(0, limit))
  }

  const addCustomTag = () => {
    if (!customTag.trim()) return
    const tag = customTag.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    if (tag && !generatedTags.includes(tag)) {
      setGeneratedTags([...generatedTags, tag])
    }
    setCustomTag('')
  }

  const removeTag = (tag: string) => {
    setGeneratedTags(generatedTags.filter(t => t !== tag))
  }

  const saveGroup = (name: string) => {
    if (!name.trim() || generatedTags.length === 0) return
    setSavedGroups([...savedGroups, { id: Date.now(), name, hashtags: [...generatedTags] }])
  }

  const loadGroup = (group: HashtagGroup) => {
    setGeneratedTags([...group.hashtags])
  }

  const deleteGroup = (id: number) => {
    setSavedGroups(savedGroups.filter(g => g.id !== id))
  }

  const copyHashtags = (format: 'inline' | 'newline') => {
    const formatted = generatedTags.map(t => `#${t}`)
    const text = format === 'inline' ? formatted.join(' ') : formatted.join('\n')
    navigator.clipboard.writeText(text)
  }

  const selectedPlatform = platforms.find(p => p.id === platform)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.hashtagGenerator.generate')}</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            {platforms.map(p => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex-1 py-2 rounded text-sm ${platform === p.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-500">Recommended: {selectedPlatform?.recommended} hashtags</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateHashtags()}
              placeholder="Enter topic or niche (e.g., fitness, marketing)"
              className="flex-1 px-3 py-2 border border-slate-300 rounded"
            />
            <button onClick={generateHashtags} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Generate
            </button>
          </div>
        </div>
      </div>

      {generatedTags.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.hashtagGenerator.results')}</h3>
            <span className={`text-sm ${generatedTags.length > (selectedPlatform?.limit || 30) ? 'text-red-500' : 'text-slate-500'}`}>
              {generatedTags.length}/{selectedPlatform?.limit || 30}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {generatedTags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                #{tag}
                <button onClick={() => removeTag(tag)} className="text-blue-400 hover:text-blue-600">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
              placeholder="Add custom hashtag"
              className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <button onClick={addCustomTag} className="px-3 py-2 bg-slate-200 rounded hover:bg-slate-300 text-sm">Add</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => copyHashtags('inline')} className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
              Copy (Inline)
            </button>
            <button onClick={() => copyHashtags('newline')} className="flex-1 py-2 bg-slate-200 rounded hover:bg-slate-300 text-sm">
              Copy (New Lines)
            </button>
          </div>
        </div>
      )}

      {generatedTags.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.hashtagGenerator.save')}</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Group name (e.g., Fitness Posts)"
              className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  saveGroup((e.target as HTMLInputElement).value)
                  ;(e.target as HTMLInputElement).value = ''
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = (e.target as HTMLButtonElement).previousSibling as HTMLInputElement
                saveGroup(input.value)
                input.value = ''
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {savedGroups.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.hashtagGenerator.saved')}</h3>
          <div className="space-y-2">
            {savedGroups.map(group => (
              <div key={group.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div>
                  <span className="font-medium">{group.name}</span>
                  <span className="text-sm text-slate-500 ml-2">({group.hashtags.length} tags)</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => loadGroup(group)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Load</button>
                  <button onClick={() => deleteGroup(group.id)} className="text-red-400 hover:text-red-600">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.hashtagGenerator.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>Mix popular and niche-specific hashtags</li>
          <li>Use hashtags relevant to your content</li>
          <li>Avoid banned or spammy hashtags</li>
          <li>Save sets for different content types</li>
        </ul>
      </div>
    </div>
  )
}
