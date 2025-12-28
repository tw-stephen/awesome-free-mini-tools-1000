import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type ContentType = 'instagram' | 'youtube' | 'tiktok' | 'blog' | 'twitter'
type Niche = 'fitness' | 'food' | 'tech' | 'travel' | 'fashion' | 'business' | 'education' | 'entertainment'

interface ContentIdea {
  title: string
  description: string
  format: string
  hook: string
}

export default function ContentIdeasGenerator() {
  const { t } = useTranslation()
  const [platform, setPlatform] = useState<ContentType>('instagram')
  const [niche, setNiche] = useState<Niche>('fitness')
  const [keyword, setKeyword] = useState('')
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [saved, setSaved] = useState<ContentIdea[]>([])

  const contentTemplates: Record<Niche, string[]> = {
    fitness: [
      '5 {keyword} mistakes you\'re making',
      'My {keyword} transformation journey',
      '{keyword} workout you can do at home',
      'What I eat in a day for {keyword}',
      'Beginner\'s guide to {keyword}',
      '{keyword} tips that changed my life',
      'Morning {keyword} routine for busy people',
      '{keyword} vs {keyword}: which is better?'
    ],
    food: [
      'How to make the perfect {keyword}',
      '{keyword} recipe in under 10 minutes',
      'Taste testing viral {keyword}',
      'Secret {keyword} hack restaurants don\'t want you to know',
      '{keyword} on a budget',
      'Rating {keyword} from worst to best',
      'My signature {keyword} recipe',
      '{keyword} meal prep for the week'
    ],
    tech: [
      '{keyword} tips and tricks you didn\'t know',
      'Is {keyword} worth it in 2024?',
      '{keyword} review: honest opinion',
      'Best {keyword} for beginners',
      'How to set up {keyword} step by step',
      '{keyword} vs competitors: comparison',
      'Hidden {keyword} features you need to know',
      'My {keyword} setup tour'
    ],
    travel: [
      'Ultimate {keyword} travel guide',
      '{keyword} on a budget',
      'Hidden gems in {keyword}',
      'What to pack for {keyword}',
      '{keyword} travel mistakes to avoid',
      'Best time to visit {keyword}',
      'Local food you must try in {keyword}',
      '{keyword} itinerary: perfect trip'
    ],
    fashion: [
      'How to style {keyword}',
      '{keyword} outfit ideas for every occasion',
      '{keyword} haul and try-on',
      'Building a {keyword} capsule wardrobe',
      '{keyword} trends for this season',
      'Budget vs luxury {keyword}',
      'Styling {keyword} 5 different ways',
      'My favorite {keyword} pieces'
    ],
    business: [
      'How I grew my {keyword} business',
      '{keyword} tips for entrepreneurs',
      'Common {keyword} mistakes to avoid',
      'How to start a {keyword} business',
      '{keyword} strategies that actually work',
      'Day in the life running a {keyword} business',
      '{keyword} tools I can\'t live without',
      'How to scale your {keyword}'
    ],
    education: [
      '{keyword} explained simply',
      'Learn {keyword} in 10 minutes',
      'Common {keyword} misconceptions',
      '{keyword} study tips and tricks',
      'Everything you need to know about {keyword}',
      '{keyword} for beginners',
      'How I mastered {keyword}',
      '{keyword} crash course'
    ],
    entertainment: [
      'Reacting to {keyword}',
      '{keyword} challenge',
      'Top 10 {keyword} moments',
      '{keyword} storytime',
      'Trying {keyword} for the first time',
      '{keyword} tier list',
      'My thoughts on {keyword}',
      '{keyword} review and rating'
    ]
  }

  const formatsByPlatform: Record<ContentType, string[]> = {
    instagram: ['Carousel Post', 'Reel', 'Story Series', 'Single Image', 'IG Live'],
    youtube: ['Tutorial', 'Vlog', 'Shorts', 'Review', 'Compilation'],
    tiktok: ['Quick Tip', 'Trend Video', 'Tutorial', 'Story Time', 'POV'],
    blog: ['How-To Guide', 'Listicle', 'Review', 'Opinion Piece', 'Case Study'],
    twitter: ['Thread', 'Single Tweet', 'Poll', 'Quote Tweet Series', 'Hot Take']
  }

  const hooks = [
    'You won\'t believe what happened when...',
    'Stop scrolling if you want to learn...',
    'This changed everything for me...',
    'Nobody talks about this, but...',
    'Here\'s what I learned after...',
    'The truth about...',
    'I wish I knew this sooner:',
    'This is your sign to...'
  ]

  const generateIdeas = () => {
    const templates = contentTemplates[niche]
    const formats = formatsByPlatform[platform]
    const kw = keyword || niche

    const generatedIdeas: ContentIdea[] = []

    for (let i = 0; i < 5; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)]
      const format = formats[Math.floor(Math.random() * formats.length)]
      const hook = hooks[Math.floor(Math.random() * hooks.length)]

      generatedIdeas.push({
        title: template.replace(/{keyword}/g, kw),
        description: `Create a ${format.toLowerCase()} about ${kw} in the ${niche} niche.`,
        format,
        hook: hook.replace('...', ` ${kw}...`)
      })
    }

    setIdeas(generatedIdeas)
  }

  const saveIdea = (idea: ContentIdea) => {
    if (!saved.find(s => s.title === idea.title)) {
      setSaved([...saved, idea])
    }
  }

  const removeSaved = (title: string) => {
    setSaved(saved.filter(s => s.title !== title))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.contentIdeasGenerator.platform')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['instagram', 'youtube', 'tiktok', 'blog', 'twitter'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                platform === p ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.contentIdeasGenerator.niche')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['fitness', 'food', 'tech', 'travel', 'fashion', 'business', 'education', 'entertainment'] as const).map(n => (
            <button
              key={n}
              onClick={() => setNiche(n)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                niche === n ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.contentIdeasGenerator.niche${n.charAt(0).toUpperCase() + n.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.contentIdeasGenerator.keyword')}
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t('tools.contentIdeasGenerator.keywordPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <button
        onClick={generateIdeas}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        {t('tools.contentIdeasGenerator.generate')}
      </button>

      {ideas.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.contentIdeasGenerator.ideas')}
          </h3>
          {ideas.map((idea, index) => (
            <div key={index} className="card p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{idea.title}</div>
                  <div className="text-sm text-slate-500 mt-1">{idea.description}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      {idea.format}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2 italic">
                    Hook: "{idea.hook}"
                  </div>
                </div>
                <button
                  onClick={() => saveIdea(idea)}
                  className="text-yellow-500 hover:text-yellow-600 text-lg"
                >
                  {saved.find(s => s.title === idea.title) ? '★' : '☆'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {saved.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.contentIdeasGenerator.savedIdeas')} ({saved.length})
          </h3>
          <div className="space-y-2">
            {saved.map((idea, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm">{idea.title}</span>
                <button
                  onClick={() => removeSaved(idea.title)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
