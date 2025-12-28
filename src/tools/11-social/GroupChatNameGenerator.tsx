import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type GroupType = 'friends' | 'family' | 'work' | 'sports' | 'gaming' | 'travel' | 'study' | 'random'

export default function GroupChatNameGenerator() {
  const { t } = useTranslation()
  const [groupType, setGroupType] = useState<GroupType>('friends')
  const [members, setMembers] = useState('')
  const [theme, setTheme] = useState('')
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const templates: Record<GroupType, string[]> = {
    friends: [
      'The {theme} Squad',
      'BFFs 4 Ever',
      'The Troublemakers',
      'Chaos Crew',
      'The Hangout Zone',
      'Besties United',
      'Dream Team',
      'The Cool Kids',
      'Friend Zone',
      'Vibes Only'
    ],
    family: [
      'The {name} Family',
      'Family Matters',
      'Home Sweet Home',
      'The Relatives',
      'Family First',
      'Blood is Thicker',
      'Fam Bam',
      'Our Little World',
      'The Clan',
      'Family Reunion'
    ],
    work: [
      'The {theme} Team',
      'Work Besties',
      'Office Squad',
      'Coffee & Deadlines',
      'The Brainstormers',
      'Hustle Mode',
      'Professional Chaos',
      'Workday Warriors',
      'The A-Team',
      '9 to 5 Survivors'
    ],
    sports: [
      '{theme} Warriors',
      'The Champions',
      'Game Day Crew',
      'Team Spirit',
      'Victory Squad',
      'The Athletes',
      'Sports Fanatics',
      'Weekend Warriors',
      'The MVPs',
      'Game On!'
    ],
    gaming: [
      '{theme} Legends',
      'The Noobs',
      'GG Gang',
      'Rage Quitters Anonymous',
      'The Grinders',
      'Pixel Warriors',
      'Game Night Crew',
      'The Respawners',
      'Level Up Squad',
      'Controller Crew'
    ],
    travel: [
      'Wanderlust Gang',
      '{theme} Explorers',
      'The Adventurers',
      'Passport Ready',
      'Globe Trotters',
      'Travel Buddies',
      'Road Trip Crew',
      'Adventure Awaits',
      'The Nomads',
      'Vacation Mode'
    ],
    study: [
      'Study Buddies',
      'The Scholars',
      '{theme} Study Group',
      'Brain Trust',
      'Homework Heroes',
      'The Nerds',
      'Exam Survivors',
      'All-Nighter Crew',
      'The Overachievers',
      'Notes & Vibes'
    ],
    random: [
      'The {theme} Zone',
      'Random Thoughts',
      'Untitled Group',
      'The Irregulars',
      'Organized Chaos',
      'Mystery Inc.',
      'The Collective',
      'Vibe Check',
      'No Filter',
      'The Legends'
    ]
  }

  const emojis: Record<GroupType, string[]> = {
    friends: ['👯', '🤝', '💕', '🎉', '✨'],
    family: ['👨‍👩‍👧‍👦', '🏠', '❤️', '🌳', '👪'],
    work: ['💼', '📊', '☕', '💻', '📈'],
    sports: ['⚽', '🏀', '🎾', '🏆', '💪'],
    gaming: ['🎮', '🕹️', '🎯', '⚔️', '🏆'],
    travel: ['✈️', '🌍', '🗺️', '🏝️', '🎒'],
    study: ['📚', '📝', '🎓', '💡', '✏️'],
    random: ['🌟', '🎲', '🔮', '🌈', '🦄']
  }

  const generate = () => {
    const groupTemplates = templates[groupType]
    const groupEmojis = emojis[groupType]
    const memberList = members.split(',').map(m => m.trim()).filter(m => m)
    const results: string[] = []

    for (let i = 0; i < 10; i++) {
      let name = groupTemplates[Math.floor(Math.random() * groupTemplates.length)]

      // Replace placeholders
      if (theme) {
        name = name.replace(/{theme}/g, theme)
      } else {
        name = name.replace(/{theme}\s*/g, '')
      }

      if (memberList.length > 0) {
        const randomMember = memberList[Math.floor(Math.random() * memberList.length)]
        name = name.replace(/{name}/g, randomMember)
      } else {
        name = name.replace(/{name}\s*/g, 'Our')
      }

      // Add emoji randomly
      if (Math.random() > 0.5) {
        const emoji = groupEmojis[Math.floor(Math.random() * groupEmojis.length)]
        name = `${emoji} ${name} ${emoji}`
      }

      if (!results.includes(name)) {
        results.push(name)
      }
    }

    setGeneratedNames(results)
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
    setCopied(name)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.groupChatNameGenerator.groupType')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['friends', 'family', 'work', 'sports', 'gaming', 'travel', 'study', 'random'] as const).map(type => (
            <button
              key={type}
              onClick={() => setGroupType(type)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                groupType === type ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {emojis[type][0]} {t(`tools.groupChatNameGenerator.type${type.charAt(0).toUpperCase() + type.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.groupChatNameGenerator.members')}
          </label>
          <input
            type="text"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            placeholder={t('tools.groupChatNameGenerator.membersPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.groupChatNameGenerator.theme')}
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder={t('tools.groupChatNameGenerator.themePlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <button
        onClick={generate}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        {t('tools.groupChatNameGenerator.generate')}
      </button>

      {generatedNames.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.groupChatNameGenerator.results')}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {generatedNames.map((name, index) => (
              <div
                key={index}
                className="p-3 bg-slate-50 rounded flex items-center justify-between"
              >
                <span className="font-medium">{name}</span>
                <button
                  onClick={() => copyName(name)}
                  className={`px-3 py-1 text-sm rounded ${
                    copied === name ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}
                >
                  {copied === name ? '✓' : t('tools.groupChatNameGenerator.copy')}
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={generate}
            className="mt-3 w-full py-2 bg-slate-100 rounded text-sm"
          >
            {t('tools.groupChatNameGenerator.regenerate')}
          </button>
        </div>
      )}
    </div>
  )
}
