import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Platform = 'instagram' | 'twitter' | 'linkedin' | 'tiktok'
type Mood = 'inspiring' | 'funny' | 'informative' | 'casual' | 'professional'
type Category = 'selfie' | 'travel' | 'food' | 'fitness' | 'business' | 'nature' | 'celebration' | 'quote'

export default function CaptionGenerator() {
  const { t } = useTranslation()
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [mood, setMood] = useState<Mood>('casual')
  const [category, setCategory] = useState<Category>('selfie')
  const [keyword, setKeyword] = useState('')
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const templates: Record<Category, Record<Mood, string[]>> = {
    selfie: {
      inspiring: ['Be yourself; everyone else is already taken.', 'Confidence level: selfie with no filter.', 'Believe in your selfie.'],
      funny: ['But first, let me take a selfie.', 'I woke up like this... after 47 tries.', 'Selfie game strong, life game... working on it.'],
      informative: ['Behind every selfie is approximately 47 other selfies that didn\'t make the cut.', 'Studies show selfies boost confidence.'],
      casual: ['Just me being me.', 'Felt cute, might delete later.', 'Current mood:', 'Living my best life.'],
      professional: ['Here\'s to new beginnings.', 'Ready for whatever comes next.', 'Embracing every moment.']
    },
    travel: {
      inspiring: ['Adventure awaits.', 'The world is yours to explore.', 'Wander often, wonder always.', 'Life is short, travel far.'],
      funny: ['I need 6 months vacation, twice a year.', 'My wallet is crying but my soul is happy.', 'Currently accepting travel buddy applications.'],
      informative: ['Pro tip: Always pack snacks.', 'Did you know this place is one of the top destinations?', 'Hidden gem alert!'],
      casual: ['Take me back.', 'Exploring new places.', 'Just passing through.', 'Making memories.'],
      professional: ['Another successful trip.', 'Networking knows no borders.', 'Business and pleasure in perfect harmony.']
    },
    food: {
      inspiring: ['Good food, good mood.', 'Life is too short for bad food.', 'Food is love made visible.'],
      funny: ['I\'m on a seafood diet. I see food and I eat it.', 'Calories don\'t count on vacation.', 'My favorite exercise is eating.'],
      informative: ['Recipe link in bio!', 'Fun fact about this dish:', 'This took 2 hours to make and 5 minutes to eat.'],
      casual: ['Eat. Sleep. Repeat.', 'Foodie life.', 'Currently eating my feelings.', 'Brunch o\'clock.'],
      professional: ['Culinary excellence.', 'Elevated dining experience.', 'Farm to table perfection.']
    },
    fitness: {
      inspiring: ['Strong is the new beautiful.', 'Your only limit is you.', 'Progress, not perfection.', 'Earn your body.'],
      funny: ['Sore today, strong tomorrow... or just sore.', 'Running late counts as cardio, right?', 'I work out because I really like food.'],
      informative: ['Today\'s workout: [details]', 'Pro tip for better form:', 'Remember to stretch!'],
      casual: ['Workout done!', 'No pain, no gain.', 'Getting stronger every day.', 'Gym time is me time.'],
      professional: ['Consistency is key.', 'Investing in my health.', 'Discipline equals freedom.']
    },
    business: {
      inspiring: ['Dream big, work hard.', 'Success is not a destination, it\'s a journey.', 'Building my empire one day at a time.'],
      funny: ['Boss moves only (coffee not included).', 'My brain has too many tabs open.', 'Adulting level: Expert.'],
      informative: ['Exciting announcement coming soon!', 'Behind the scenes of our latest project.', 'Big things happening!'],
      casual: ['Just another day at the office.', 'Working on something exciting.', 'Hustle mode: ON'],
      professional: ['Excellence in everything we do.', 'Grateful for this opportunity.', 'Proud of what we\'ve accomplished.']
    },
    nature: {
      inspiring: ['In every walk with nature, one receives far more than they seek.', 'Nature is the art of God.', 'Find me where the wild things are.'],
      funny: ['I put the \'fun\' in fungi.', 'Nature called, I answered.', 'Tree-mendous views!'],
      informative: ['This species is native to [location].', 'Fun fact: [nature fact]', 'Conservation matters.'],
      casual: ['Vitamin N (Nature).', 'Getting my nature fix.', 'Peace and quiet.', 'Back to basics.'],
      professional: ['Appreciating the beauty around us.', 'Finding balance in nature.', 'Moments of tranquility.']
    },
    celebration: {
      inspiring: ['Here\'s to new beginnings!', 'Celebrating every milestone.', 'Gratitude fills my heart.'],
      funny: ['Time to party like it\'s my birthday... because it is!', 'Pop, fizz, clink!', 'Cake calories don\'t count.'],
      informative: ['Thank you all for the wishes!', 'Grateful for everyone who made this possible.'],
      casual: ['Cheers!', 'Good times with great people.', 'Making memories.', 'Let\'s celebrate!'],
      professional: ['Milestone achieved.', 'Thankful for this journey.', 'Honoring this moment.']
    },
    quote: {
      inspiring: ['Be the change you wish to see.', 'Stars can\'t shine without darkness.', 'Your vibe attracts your tribe.'],
      funny: ['I\'m not lazy, I\'m on energy-saving mode.', 'My bed is my happy place.', 'Coffee: because adulting is hard.'],
      informative: ['Words to live by.', 'Sharing some wisdom today.', 'This quote changed my perspective.'],
      casual: ['Daily reminder:', 'Food for thought.', 'Just saying.', 'Mood:'],
      professional: ['Leadership lesson of the day.', 'Wise words for success.', 'Reflecting on this today.']
    }
  }

  const generate = () => {
    const categoryTemplates = templates[category][mood]
    const results: string[] = []

    for (let i = 0; i < 5; i++) {
      let caption = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)]
      if (keyword) {
        caption = caption.replace(/\[.*?\]/g, keyword)
      }
      if (!results.includes(caption)) {
        results.push(caption)
      }
    }

    // Add hashtag suggestions
    const hashtags = getHashtags()
    results.push(`\n\n${hashtags}`)

    setGeneratedCaptions(results)
  }

  const getHashtags = () => {
    const hashtagSets: Record<Category, string[]> = {
      selfie: ['#selfie', '#me', '#selflove', '#confidence', '#selfcare'],
      travel: ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation'],
      food: ['#food', '#foodie', '#yummy', '#delicious', '#foodporn'],
      fitness: ['#fitness', '#workout', '#gym', '#fitnessmotivation', '#health'],
      business: ['#business', '#entrepreneur', '#success', '#motivation', '#hustle'],
      nature: ['#nature', '#outdoors', '#beautiful', '#naturelovers', '#landscape'],
      celebration: ['#celebration', '#party', '#happy', '#grateful', '#blessed'],
      quote: ['#quotes', '#motivation', '#inspiration', '#wisdom', '#mindset']
    }
    return hashtagSets[category].slice(0, 5).join(' ')
  }

  const copyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption)
    setCopied(caption)
    setTimeout(() => setCopied(null), 2000)
  }

  const charLimits: Record<Platform, number> = {
    instagram: 2200,
    twitter: 280,
    linkedin: 3000,
    tiktok: 300
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.captionGenerator.platform')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['instagram', 'twitter', 'linkedin', 'tiktok'] as const).map(p => (
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
        <div className="text-xs text-slate-500 mt-1">
          {t('tools.captionGenerator.charLimit')}: {charLimits[platform]}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.captionGenerator.category')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['selfie', 'travel', 'food', 'fitness', 'business', 'nature', 'celebration', 'quote'] as const).map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                category === c ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.captionGenerator.category${c.charAt(0).toUpperCase() + c.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.captionGenerator.mood')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['inspiring', 'funny', 'informative', 'casual', 'professional'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                mood === m ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.captionGenerator.mood${m.charAt(0).toUpperCase() + m.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.captionGenerator.keyword')}
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t('tools.captionGenerator.keywordPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <button
        onClick={generate}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        {t('tools.captionGenerator.generate')}
      </button>

      {generatedCaptions.length > 0 && (
        <div className="space-y-2">
          {generatedCaptions.map((caption, index) => (
            <div key={index} className="card p-3 flex items-start justify-between">
              <p className="flex-1 text-sm whitespace-pre-line">{caption}</p>
              <button
                onClick={() => copyCaption(caption)}
                className={`ml-2 px-2 py-1 text-xs rounded ${
                  copied === caption ? 'bg-green-500 text-white' : 'bg-slate-100'
                }`}
              >
                {copied === caption ? '✓' : t('tools.captionGenerator.copy')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
