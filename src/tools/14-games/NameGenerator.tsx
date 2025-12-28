import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface GeneratedName {
  name: string
  category: string
}

export default function NameGenerator() {
  const { t } = useTranslation()
  const [category, setCategory] = useState('fantasy')
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([])
  const [savedNames, setSavedNames] = useState<string[]>([])

  const nameParts = {
    fantasy: {
      prefixes: ['Ael', 'Dra', 'Gor', 'Mor', 'Syl', 'Thal', 'Vor', 'Zar', 'Fen', 'Kal', 'Lyn', 'Mal', 'Ner', 'Orn', 'Ral', 'Sel'],
      suffixes: ['dor', 'wyn', 'thos', 'iel', 'orn', 'ara', 'ion', 'ius', 'eon', 'ith', 'oth', 'ax', 'ix', 'us', 'as', 'is']
    },
    scifi: {
      prefixes: ['Zyx', 'Kra', 'Nex', 'Vex', 'Xar', 'Qua', 'Pho', 'Cyb', 'Ion', 'Arc', 'Neo', 'Zer', 'Axi', 'Ori', 'Tek', 'Syn'],
      suffixes: ['on', 'ex', 'ix', 'ax', 'ux', 'or', 'ar', 'ir', '7', '-9', 'X', 'prime', 'core', 'flux', 'wave', 'byte']
    },
    villain: {
      prefixes: ['Dark', 'Shadow', 'Death', 'Blood', 'Doom', 'Grim', 'Vile', 'Dread', 'Night', 'Storm', 'Chaos', 'Mal', 'Venom', 'Terror', 'Bane', 'Wraith'],
      suffixes: ['bane', 'lord', 'fang', 'claw', 'skull', 'heart', 'shade', 'rage', 'fury', 'wrath', 'maw', 'blade', 'strike', 'soul', 'reaper', 'master']
    },
    hero: {
      prefixes: ['Star', 'Light', 'Swift', 'Iron', 'Thunder', 'Flame', 'Storm', 'Silver', 'Golden', 'Crystal', 'Brave', 'Noble', 'True', 'Mighty', 'Steel', 'Solar'],
      suffixes: ['heart', 'blade', 'shield', 'hawk', 'wolf', 'knight', 'guard', 'wing', 'fire', 'force', 'storm', 'strike', 'arrow', 'bolt', 'fist', 'spirit']
    },
    username: {
      prefixes: ['Cool', 'Epic', 'Pro', 'Super', 'Mega', 'Ultra', 'Ninja', 'Cyber', 'Tech', 'Code', 'Pixel', 'Retro', 'Neon', 'Alpha', 'Beta', 'Dark'],
      suffixes: ['Master', 'Gamer', 'Player', 'Hero', 'King', 'Warrior', 'Hunter', 'Wolf', 'Dragon', 'Phoenix', '2000', 'XP', 'Pro', 'Elite', 'Max', 'Prime']
    },
    pet: {
      prefixes: ['Fluffy', 'Snuggly', 'Tiny', 'Buddy', 'Lucky', 'Happy', 'Sweet', 'Little', 'Fuzzy', 'Cuddle', 'Wiggly', 'Bouncy', 'Silly', 'Giggly', 'Peppy', 'Zippy'],
      suffixes: ['paws', 'beans', 'whiskers', 'nose', 'tail', 'ears', 'fur', 'pup', 'kins', 'pie', 'bug', 'bear', 'boo', 'muffin', 'cookie', 'button']
    }
  }

  const categories = [
    { id: 'fantasy', name: 'Fantasy', emoji: '🧙' },
    { id: 'scifi', name: 'Sci-Fi', emoji: '🚀' },
    { id: 'villain', name: 'Villain', emoji: '😈' },
    { id: 'hero', name: 'Hero', emoji: '🦸' },
    { id: 'username', name: 'Username', emoji: '🎮' },
    { id: 'pet', name: 'Pet', emoji: '🐾' }
  ]

  const generateNames = () => {
    const parts = nameParts[category as keyof typeof nameParts]
    const newNames: GeneratedName[] = []

    for (let i = 0; i < 8; i++) {
      const prefix = parts.prefixes[Math.floor(Math.random() * parts.prefixes.length)]
      const suffix = parts.suffixes[Math.floor(Math.random() * parts.suffixes.length)]
      newNames.push({
        name: prefix + suffix,
        category
      })
    }

    setGeneratedNames(newNames)
  }

  const saveName = (name: string) => {
    if (!savedNames.includes(name)) {
      setSavedNames(prev => [...prev, name])
    }
  }

  const removeSavedName = (name: string) => {
    setSavedNames(prev => prev.filter(n => n !== name))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.nameGenerator.selectCategory')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`p-3 rounded-lg transition-all ${
                category === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-2xl">{cat.emoji}</div>
              <div className="text-sm mt-1">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 text-center">
        <button
          onClick={generateNames}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          🎲 {t('tools.nameGenerator.generate')}
        </button>
      </div>

      {generatedNames.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.nameGenerator.generatedNames')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {generatedNames.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <span className="font-medium">{item.name}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(item.name)}
                    className="p-1 text-slate-400 hover:text-blue-500"
                    title={t('tools.nameGenerator.copy')}
                  >
                    📋
                  </button>
                  <button
                    onClick={() => saveName(item.name)}
                    className={`p-1 ${savedNames.includes(item.name) ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}
                    title={t('tools.nameGenerator.save')}
                  >
                    ⭐
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedNames.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">⭐ {t('tools.nameGenerator.savedNames')}</h3>
          <div className="flex flex-wrap gap-2">
            {savedNames.map((name, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full"
              >
                <span>{name}</span>
                <button
                  onClick={() => removeSavedName(name)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.nameGenerator.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.nameGenerator.aboutText')}
        </p>
      </div>
    </div>
  )
}
