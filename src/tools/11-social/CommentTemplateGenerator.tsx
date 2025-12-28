import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Category = 'appreciation' | 'engagement' | 'support' | 'humor' | 'professional' | 'collaboration'
type Tone = 'friendly' | 'enthusiastic' | 'casual' | 'formal'

export default function CommentTemplateGenerator() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<Category>('appreciation')
  const [tone, setTone] = useState<Tone>('friendly')
  const [personName, setPersonName] = useState('')
  const [topic, setTopic] = useState('')
  const [generatedComments, setGeneratedComments] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const templates: Record<Category, Record<Tone, string[]>> = {
    appreciation: {
      friendly: [
        'Love this! {topic} is exactly what I needed to see today.',
        'This is amazing, {name}! Thanks for sharing!',
        'You always bring such great content! This {topic} is incredible.',
        'So grateful you shared this! It made my day.'
      ],
      enthusiastic: [
        'OMG THIS IS INCREDIBLE! {topic} content like this is why I follow you!',
        'WOW! {name}, you absolutely nailed it!',
        'THIS. IS. EVERYTHING! Best {topic} post I\'ve seen!',
        'YESSS! More of this please!'
      ],
      casual: [
        'Nice one! {topic} vibes are on point.',
        'This is cool, {name}.',
        'Digging this {topic} content.',
        'Solid post.'
      ],
      formal: [
        'Thank you for sharing this valuable {topic} content.',
        'I appreciate your insights, {name}.',
        'This is excellent work. Well done.',
        'Very informative post about {topic}.'
      ]
    },
    engagement: {
      friendly: [
        'What\'s your take on {topic}? I\'d love to hear more!',
        'This got me thinking... How did you get into {topic}?',
        'Great point about {topic}! Have you considered...?',
        'I can relate to this! My experience with {topic} was similar.'
      ],
      enthusiastic: [
        'I NEED to know more about {topic}! Can you share details?!',
        '{name}, can we talk about this?! So excited!',
        'Drop more {topic} content! We\'re here for it!',
        'Tell us EVERYTHING! This {topic} is fascinating!'
      ],
      casual: [
        'Curious about {topic} - what else you got?',
        'What made you think of this?',
        'Got any tips on {topic}?',
        'Thoughts on trying this differently?'
      ],
      formal: [
        'I would be interested to learn more about your perspective on {topic}.',
        'Would you be open to discussing this further?',
        'This raises some interesting points about {topic}.',
        'I have a few questions regarding your approach.'
      ]
    },
    support: {
      friendly: [
        'Sending you positive vibes! You\'ve got this!',
        'Here for you, {name}! Keep going!',
        'Remember how amazing you are! This {topic} journey is worth it.',
        'You\'re not alone in this. We\'re all rooting for you!'
      ],
      enthusiastic: [
        'YOU ARE INCREDIBLE! Don\'t ever forget that!',
        '{name}, you\'re going to CRUSH this!',
        'The world needs more of YOU! Keep shining!',
        'Your strength is INSPIRING!'
      ],
      casual: [
        'Hang in there, {name}.',
        'It gets better. Trust the process.',
        'One step at a time with {topic}.',
        'You got this.'
      ],
      formal: [
        'Wishing you all the best with {topic}.',
        'Please know that your efforts are appreciated.',
        'Your perseverance is commendable.',
        'I believe in your ability to succeed.'
      ]
    },
    humor: {
      friendly: [
        'This {topic} content is too good! *screenshots aggressively*',
        '{name}, stop! I can\'t handle this level of awesome!',
        'Adding this to my "things that make me smile" collection!',
        'My phone battery hates me for watching this {topic} on repeat!'
      ],
      enthusiastic: [
        'I\'M SCREAMING! This {topic} content broke me!',
        'HELP! {name} is trying to end me with this content!',
        'This is ILLEGAL levels of good! Call the content police!',
        'My neighbors think I\'m crazy from laughing at this!'
      ],
      casual: [
        'lol this {topic} is gold',
        'dead. just dead. 💀',
        'me irl with {topic}',
        'the accuracy 😂'
      ],
      formal: [
        'This is quite amusing. Well crafted humor about {topic}.',
        'A delightful piece of content. Very clever.',
        'I found myself genuinely entertained.',
        'Your wit regarding {topic} is impressive.'
      ]
    },
    professional: {
      friendly: [
        'Great insights on {topic}! Would love to connect and chat more.',
        'This is the kind of {topic} content I look for. Following!',
        '{name}, your expertise shows! Thanks for this value.',
        'Bookmarking this for my {topic} research!'
      ],
      enthusiastic: [
        'This is GAME-CHANGING for {topic}! Everyone needs to see this!',
        '{name}, you\'re a thought leader for a reason! Brilliant!',
        'This {topic} breakdown is exactly what the industry needs!',
        'Mind = BLOWN! Revolutionary thinking about {topic}!'
      ],
      casual: [
        'Smart take on {topic}.',
        'Good point, hadn\'t thought of it that way.',
        'Useful info on {topic}.',
        'Makes sense. Thanks for sharing.'
      ],
      formal: [
        'Your analysis of {topic} is exceptionally thorough.',
        'This provides valuable insights for industry professionals.',
        'I appreciate the depth of research on {topic}.',
        'This contributes meaningfully to the {topic} discussion.'
      ]
    },
    collaboration: {
      friendly: [
        'Would love to collab on {topic} sometime! DM me?',
        '{name}, let\'s create something together! Your {topic} style + mine would be fire!',
        'This inspired me! Maybe we could work on a {topic} project?',
        'Your {topic} content + my ideas = magic waiting to happen!'
      ],
      enthusiastic: [
        'WE NEED TO COLLAB! {topic} content together would break the internet!',
        '{name}! Imagine us doing a {topic} series! The potential!',
        'Let\'s make {topic} history together! I\'m SO ready!',
        'Dream collab alert! Say yes to {topic} content together!'
      ],
      casual: [
        'We should work on something together.',
        'Open to a {topic} collab?',
        'Let me know if you wanna team up on {topic}.',
        'Could be fun to create something.'
      ],
      formal: [
        'I would be interested in exploring a collaboration on {topic}.',
        'Your work aligns with my interests. Shall we discuss opportunities?',
        'I believe a partnership on {topic} could be mutually beneficial.',
        'Please consider this an invitation to collaborate.'
      ]
    }
  }

  const generate = () => {
    const categoryTemplates = templates[category][tone]
    const results: string[] = []

    for (const template of categoryTemplates) {
      let comment = template
      if (personName) {
        comment = comment.replace(/{name}/g, personName)
      } else {
        comment = comment.replace(/{name},?\s*/g, '')
      }
      if (topic) {
        comment = comment.replace(/{topic}/g, topic)
      } else {
        comment = comment.replace(/{topic}\s*/g, 'this')
      }
      results.push(comment)
    }

    setGeneratedComments(results)
  }

  const copyComment = (comment: string) => {
    navigator.clipboard.writeText(comment)
    setCopied(comment)
    setTimeout(() => setCopied(null), 2000)
  }

  const categoryEmojis: Record<Category, string> = {
    appreciation: '🙏',
    engagement: '💬',
    support: '💪',
    humor: '😂',
    professional: '💼',
    collaboration: '🤝'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.commentTemplateGenerator.category')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['appreciation', 'engagement', 'support', 'humor', 'professional', 'collaboration'] as const).map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                category === c ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {categoryEmojis[c]} {c}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.commentTemplateGenerator.tone')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['friendly', 'enthusiastic', 'casual', 'formal'] as const).map(t => (
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

      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.commentTemplateGenerator.personName')}
          </label>
          <input
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder={t('tools.commentTemplateGenerator.personPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.commentTemplateGenerator.topic')}
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t('tools.commentTemplateGenerator.topicPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <button
        onClick={generate}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        {t('tools.commentTemplateGenerator.generate')}
      </button>

      {generatedComments.length > 0 && (
        <div className="space-y-2">
          {generatedComments.map((comment, index) => (
            <div key={index} className="card p-3 flex items-start justify-between gap-2">
              <p className="flex-1 text-sm">{comment}</p>
              <button
                onClick={() => copyComment(comment)}
                className={`px-2 py-1 text-xs rounded shrink-0 ${
                  copied === comment ? 'bg-green-500 text-white' : 'bg-slate-100'
                }`}
              >
                {copied === comment ? '✓' : t('tools.commentTemplateGenerator.copy')}
              </button>
            </div>
          ))}
          <button
            onClick={generate}
            className="w-full py-2 bg-slate-100 rounded text-sm"
          >
            {t('tools.commentTemplateGenerator.regenerate')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.commentTemplateGenerator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.commentTemplateGenerator.tip1')}</li>
          <li>• {t('tools.commentTemplateGenerator.tip2')}</li>
          <li>• {t('tools.commentTemplateGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
