import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Category = 'reactions' | 'emotions' | 'gestures' | 'status' | 'objects' | 'celebration' | 'work' | 'all'

interface EmojiItem {
  emoji: string
  name: string
  shortcode: string
  category: Exclude<Category, 'all'>
}

export default function SlackEmojiPicker() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [copied, setCopied] = useState<string | null>(null)
  const [recentEmojis, setRecentEmojis] = useState<string[]>([])

  const emojis: EmojiItem[] = [
    // Reactions
    { emoji: '👍', name: 'Thumbs Up', shortcode: ':+1:', category: 'reactions' },
    { emoji: '👎', name: 'Thumbs Down', shortcode: ':-1:', category: 'reactions' },
    { emoji: '👏', name: 'Clapping', shortcode: ':clap:', category: 'reactions' },
    { emoji: '🙌', name: 'Raising Hands', shortcode: ':raised_hands:', category: 'reactions' },
    { emoji: '💯', name: 'Hundred', shortcode: ':100:', category: 'reactions' },
    { emoji: '🔥', name: 'Fire', shortcode: ':fire:', category: 'reactions' },
    { emoji: '✅', name: 'Check Mark', shortcode: ':white_check_mark:', category: 'reactions' },
    { emoji: '❌', name: 'Cross Mark', shortcode: ':x:', category: 'reactions' },
    { emoji: '⭐', name: 'Star', shortcode: ':star:', category: 'reactions' },
    { emoji: '❤️', name: 'Red Heart', shortcode: ':heart:', category: 'reactions' },

    // Emotions
    { emoji: '😀', name: 'Grinning', shortcode: ':grinning:', category: 'emotions' },
    { emoji: '😂', name: 'Joy', shortcode: ':joy:', category: 'emotions' },
    { emoji: '🥳', name: 'Partying Face', shortcode: ':partying_face:', category: 'emotions' },
    { emoji: '🤔', name: 'Thinking', shortcode: ':thinking_face:', category: 'emotions' },
    { emoji: '😅', name: 'Sweat Smile', shortcode: ':sweat_smile:', category: 'emotions' },
    { emoji: '😭', name: 'Crying', shortcode: ':sob:', category: 'emotions' },
    { emoji: '🥹', name: 'Holding Tears', shortcode: ':face_holding_back_tears:', category: 'emotions' },
    { emoji: '😱', name: 'Scream', shortcode: ':scream:', category: 'emotions' },
    { emoji: '🤯', name: 'Mind Blown', shortcode: ':exploding_head:', category: 'emotions' },
    { emoji: '😴', name: 'Sleeping', shortcode: ':sleeping:', category: 'emotions' },

    // Gestures
    { emoji: '👋', name: 'Wave', shortcode: ':wave:', category: 'gestures' },
    { emoji: '🤝', name: 'Handshake', shortcode: ':handshake:', category: 'gestures' },
    { emoji: '👀', name: 'Eyes', shortcode: ':eyes:', category: 'gestures' },
    { emoji: '🙏', name: 'Pray', shortcode: ':pray:', category: 'gestures' },
    { emoji: '✌️', name: 'Victory', shortcode: ':v:', category: 'gestures' },
    { emoji: '🤞', name: 'Fingers Crossed', shortcode: ':crossed_fingers:', category: 'gestures' },
    { emoji: '💪', name: 'Muscle', shortcode: ':muscle:', category: 'gestures' },
    { emoji: '🫡', name: 'Salute', shortcode: ':saluting_face:', category: 'gestures' },
    { emoji: '🤷', name: 'Shrug', shortcode: ':shrug:', category: 'gestures' },
    { emoji: '🙈', name: 'See No Evil', shortcode: ':see_no_evil:', category: 'gestures' },

    // Status
    { emoji: '🟢', name: 'Online', shortcode: ':large_green_circle:', category: 'status' },
    { emoji: '🔴', name: 'Busy', shortcode: ':red_circle:', category: 'status' },
    { emoji: '🟡', name: 'Away', shortcode: ':large_yellow_circle:', category: 'status' },
    { emoji: '⚪', name: 'Offline', shortcode: ':white_circle:', category: 'status' },
    { emoji: '🎯', name: 'Target', shortcode: ':dart:', category: 'status' },
    { emoji: '🚧', name: 'Construction', shortcode: ':construction:', category: 'status' },
    { emoji: '🔒', name: 'Locked', shortcode: ':lock:', category: 'status' },
    { emoji: '🔓', name: 'Unlocked', shortcode: ':unlock:', category: 'status' },
    { emoji: '⏰', name: 'Alarm', shortcode: ':alarm_clock:', category: 'status' },
    { emoji: '📍', name: 'Pin', shortcode: ':round_pushpin:', category: 'status' },

    // Objects
    { emoji: '💻', name: 'Laptop', shortcode: ':computer:', category: 'objects' },
    { emoji: '📱', name: 'Phone', shortcode: ':iphone:', category: 'objects' },
    { emoji: '☕', name: 'Coffee', shortcode: ':coffee:', category: 'objects' },
    { emoji: '📝', name: 'Memo', shortcode: ':memo:', category: 'objects' },
    { emoji: '📊', name: 'Chart', shortcode: ':bar_chart:', category: 'objects' },
    { emoji: '📁', name: 'Folder', shortcode: ':file_folder:', category: 'objects' },
    { emoji: '🔗', name: 'Link', shortcode: ':link:', category: 'objects' },
    { emoji: '📧', name: 'Email', shortcode: ':email:', category: 'objects' },
    { emoji: '🎧', name: 'Headphones', shortcode: ':headphones:', category: 'objects' },
    { emoji: '🔔', name: 'Bell', shortcode: ':bell:', category: 'objects' },

    // Celebration
    { emoji: '🎉', name: 'Party Popper', shortcode: ':tada:', category: 'celebration' },
    { emoji: '🎊', name: 'Confetti', shortcode: ':confetti_ball:', category: 'celebration' },
    { emoji: '🎈', name: 'Balloon', shortcode: ':balloon:', category: 'celebration' },
    { emoji: '🏆', name: 'Trophy', shortcode: ':trophy:', category: 'celebration' },
    { emoji: '🥇', name: 'Gold Medal', shortcode: ':first_place_medal:', category: 'celebration' },
    { emoji: '🎁', name: 'Gift', shortcode: ':gift:', category: 'celebration' },
    { emoji: '🥂', name: 'Champagne', shortcode: ':champagne:', category: 'celebration' },
    { emoji: '🌟', name: 'Glowing Star', shortcode: ':star2:', category: 'celebration' },
    { emoji: '✨', name: 'Sparkles', shortcode: ':sparkles:', category: 'celebration' },
    { emoji: '💫', name: 'Dizzy', shortcode: ':dizzy:', category: 'celebration' },

    // Work
    { emoji: '🚀', name: 'Rocket', shortcode: ':rocket:', category: 'work' },
    { emoji: '💡', name: 'Light Bulb', shortcode: ':bulb:', category: 'work' },
    { emoji: '⚡', name: 'Lightning', shortcode: ':zap:', category: 'work' },
    { emoji: '🔧', name: 'Wrench', shortcode: ':wrench:', category: 'work' },
    { emoji: '🛠️', name: 'Hammer Wrench', shortcode: ':hammer_and_wrench:', category: 'work' },
    { emoji: '📈', name: 'Chart Up', shortcode: ':chart_with_upwards_trend:', category: 'work' },
    { emoji: '📉', name: 'Chart Down', shortcode: ':chart_with_downwards_trend:', category: 'work' },
    { emoji: '🎯', name: 'Bullseye', shortcode: ':dart:', category: 'work' },
    { emoji: '📌', name: 'Pushpin', shortcode: ':pushpin:', category: 'work' },
    { emoji: '🔍', name: 'Search', shortcode: ':mag:', category: 'work' }
  ]

  const filteredEmojis = useMemo(() => {
    return emojis.filter(e => {
      const matchesCategory = category === 'all' || e.category === category
      const matchesSearch = !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.shortcode.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [category, search])

  const copyEmoji = (emoji: string, format: 'emoji' | 'shortcode') => {
    const item = emojis.find(e => e.emoji === emoji)
    if (!item) return

    const textToCopy = format === 'emoji' ? emoji : item.shortcode
    navigator.clipboard.writeText(textToCopy)
    setCopied(emoji)
    setTimeout(() => setCopied(null), 1500)

    // Update recent
    setRecentEmojis(prev => {
      const filtered = prev.filter(e => e !== emoji)
      return [emoji, ...filtered].slice(0, 10)
    })
  }

  const categoryEmojis: Record<Category, string> = {
    all: '🎨',
    reactions: '👍',
    emotions: '😀',
    gestures: '👋',
    status: '🟢',
    objects: '💻',
    celebration: '🎉',
    work: '🚀'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('tools.slackEmojiPicker.search')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'reactions', 'emotions', 'gestures', 'status', 'objects', 'celebration', 'work'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded text-sm ${
                category === cat ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {categoryEmojis[cat]} {cat === 'all' ? t('tools.slackEmojiPicker.all') : cat}
            </button>
          ))}
        </div>
      </div>

      {recentEmojis.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            {t('tools.slackEmojiPicker.recent')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentEmojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => copyEmoji(emoji, 'emoji')}
                className={`w-10 h-10 rounded text-xl hover:bg-slate-100 ${
                  copied === emoji ? 'bg-green-100' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.slackEmojiPicker.emojis')} ({filteredEmojis.length})
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {filteredEmojis.map(item => (
            <div
              key={item.emoji}
              className={`relative group p-2 rounded hover:bg-slate-100 cursor-pointer ${
                copied === item.emoji ? 'bg-green-100' : ''
              }`}
            >
              <div
                onClick={() => copyEmoji(item.emoji, 'emoji')}
                className="text-2xl text-center"
              >
                {item.emoji}
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10">
                <div className="bg-slate-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  {item.name}
                  <div className="text-slate-400">{item.shortcode}</div>
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyEmoji(item.emoji, 'emoji') }}
                      className="px-1.5 py-0.5 bg-blue-500 rounded text-[10px]"
                    >
                      Emoji
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyEmoji(item.emoji, 'shortcode') }}
                      className="px-1.5 py-0.5 bg-purple-500 rounded text-[10px]"
                    >
                      Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredEmojis.length === 0 && (
          <p className="text-center text-slate-500 py-4">
            {t('tools.slackEmojiPicker.noResults')}
          </p>
        )}
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.slackEmojiPicker.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.slackEmojiPicker.tip1')}</li>
          <li>• {t('tools.slackEmojiPicker.tip2')}</li>
          <li>• {t('tools.slackEmojiPicker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
