import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface HashtagCategory {
  id: string
  name: string
  hashtags: string[]
}

export default function HashtagGenerator() {
  const { t } = useTranslation()
  const [topic, setTopic] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const categories: HashtagCategory[] = [
    {
      id: 'general',
      name: t('tools.hashtagGenerator.categoryGeneral'),
      hashtags: ['trending', 'viral', 'fyp', 'foryou', 'explore', 'instagood', 'photooftheday', 'love', 'beautiful', 'happy']
    },
    {
      id: 'business',
      name: t('tools.hashtagGenerator.categoryBusiness'),
      hashtags: ['entrepreneur', 'startup', 'business', 'success', 'motivation', 'hustle', 'smallbusiness', 'marketing', 'branding', 'ceo']
    },
    {
      id: 'fitness',
      name: t('tools.hashtagGenerator.categoryFitness'),
      hashtags: ['fitness', 'workout', 'gym', 'fitnessmotivation', 'fit', 'health', 'training', 'bodybuilding', 'exercise', 'healthy']
    },
    {
      id: 'food',
      name: t('tools.hashtagGenerator.categoryFood'),
      hashtags: ['food', 'foodie', 'foodporn', 'instafood', 'yummy', 'delicious', 'foodphotography', 'cooking', 'homemade', 'recipe']
    },
    {
      id: 'travel',
      name: t('tools.hashtagGenerator.categoryTravel'),
      hashtags: ['travel', 'wanderlust', 'adventure', 'travelgram', 'vacation', 'explore', 'travelphotography', 'trip', 'tourism', 'holiday']
    },
    {
      id: 'fashion',
      name: t('tools.hashtagGenerator.categoryFashion'),
      hashtags: ['fashion', 'style', 'ootd', 'fashionblogger', 'outfit', 'streetstyle', 'fashionista', 'mensfashion', 'womensfashion', 'trendy']
    },
    {
      id: 'tech',
      name: t('tools.hashtagGenerator.categoryTech'),
      hashtags: ['tech', 'technology', 'programming', 'coding', 'developer', 'software', 'ai', 'innovation', 'gadgets', 'digital']
    },
    {
      id: 'photography',
      name: t('tools.hashtagGenerator.categoryPhotography'),
      hashtags: ['photography', 'photo', 'photographer', 'photooftheday', 'nature', 'portrait', 'landscape', 'camera', 'art', 'picoftheday']
    }
  ]

  const generateHashtags = () => {
    const category = categories.find(c => c.id === selectedCategory)
    if (!category) return

    const baseHashtags = [...category.hashtags]
    const topicWords = topic.toLowerCase().split(/\s+/).filter(w => w.length > 2)

    const topicHashtags = topicWords.map(word => word.replace(/[^a-z0-9]/g, ''))

    const combined = [...new Set([...topicHashtags, ...baseHashtags])]
      .filter(h => h.length > 0)
      .slice(0, 30)
      .map(h => `#${h}`)

    setGeneratedHashtags(combined)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHashtags.join(' '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const removeHashtag = (index: number) => {
    setGeneratedHashtags(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.hashtagGenerator.topic')}
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t('tools.hashtagGenerator.topicPlaceholder')}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg text-lg"
        />
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.hashtagGenerator.category')}
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded text-sm ${
                selectedCategory === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generateHashtags}
        className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
      >
        {t('tools.hashtagGenerator.generate')}
      </button>

      {generatedHashtags.length > 0 && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">
              {t('tools.hashtagGenerator.generatedHashtags')} ({generatedHashtags.length})
            </h3>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              {copied ? t('tools.hashtagGenerator.copied') : t('tools.hashtagGenerator.copyAll')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {generatedHashtags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm cursor-pointer hover:bg-blue-200 flex items-center gap-1"
                onClick={() => removeHashtag(index)}
              >
                {tag}
                <span className="text-blue-400 hover:text-red-500">×</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {t('tools.hashtagGenerator.clickToRemove')}
          </p>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.hashtagGenerator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.hashtagGenerator.tip1')}</li>
          <li>• {t('tools.hashtagGenerator.tip2')}</li>
          <li>• {t('tools.hashtagGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
