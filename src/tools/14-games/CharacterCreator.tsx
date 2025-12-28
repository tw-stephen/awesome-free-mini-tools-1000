import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Character {
  face: string
  hair: string
  eyes: string
  mouth: string
  accessory: string
  background: string
}

export default function CharacterCreator() {
  const { t } = useTranslation()
  const [character, setCharacter] = useState<Character>({
    face: '😀',
    hair: '💇',
    eyes: '👀',
    mouth: '👄',
    accessory: '🎩',
    background: 'bg-blue-100'
  })
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([])

  const options = {
    face: ['😀', '😊', '😎', '🤓', '😇', '🥰', '😏', '🤔', '😤', '🥺', '😈', '🤠'],
    hair: ['💇', '💇‍♀️', '👨‍🦱', '👩‍🦱', '👨‍🦰', '👩‍🦰', '👱', '👱‍♀️', '👨‍🦳', '👩‍🦳', '👨‍🦲', '🧑‍🦲'],
    eyes: ['👀', '👁️', '🥽', '👓', '🕶️', '🧿', '👁️‍🗨️', '💀'],
    mouth: ['👄', '💋', '😬', '🦷', '👅', '😛', '🤐', '😮'],
    accessory: ['🎩', '👑', '🎀', '🧢', '⭐', '💎', '🌸', '🦋', '🎭', '🎪', '🎯', '🌈'],
    background: ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100', 'bg-yellow-100', 'bg-red-100', 'bg-orange-100', 'bg-cyan-100']
  }

  const backgroundColors: Record<string, string> = {
    'bg-blue-100': 'Blue',
    'bg-green-100': 'Green',
    'bg-purple-100': 'Purple',
    'bg-pink-100': 'Pink',
    'bg-yellow-100': 'Yellow',
    'bg-red-100': 'Red',
    'bg-orange-100': 'Orange',
    'bg-cyan-100': 'Cyan'
  }

  const randomize = () => {
    const getRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
    setCharacter({
      face: getRandom(options.face),
      hair: getRandom(options.hair),
      eyes: getRandom(options.eyes),
      mouth: getRandom(options.mouth),
      accessory: getRandom(options.accessory),
      background: getRandom(options.background)
    })
  }

  const saveCharacter = () => {
    setSavedCharacters(prev => [...prev, character])
  }

  const deleteCharacter = (index: number) => {
    setSavedCharacters(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className={`w-48 h-48 mx-auto rounded-full ${character.background} flex items-center justify-center mb-4 relative`}>
          <div className="text-6xl relative">
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl">{character.accessory}</span>
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">{character.hair}</span>
            <span>{character.face}</span>
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl opacity-70">{character.eyes}</span>
            <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xl">{character.mouth}</span>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={randomize}
            className="px-4 py-2 bg-purple-500 text-white rounded font-medium hover:bg-purple-600"
          >
            🎲 {t('tools.characterCreator.randomize')}
          </button>
          <button
            onClick={saveCharacter}
            className="px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
          >
            💾 {t('tools.characterCreator.save')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.characterCreator.customize')}</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 mb-2 block">{t('tools.characterCreator.face')}</label>
            <div className="flex flex-wrap gap-2">
              {options.face.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setCharacter(prev => ({ ...prev, face: emoji }))}
                  className={`w-10 h-10 text-xl rounded ${
                    character.face === emoji ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-2 block">{t('tools.characterCreator.hair')}</label>
            <div className="flex flex-wrap gap-2">
              {options.hair.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setCharacter(prev => ({ ...prev, hair: emoji }))}
                  className={`w-10 h-10 text-xl rounded ${
                    character.hair === emoji ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-2 block">{t('tools.characterCreator.eyes')}</label>
            <div className="flex flex-wrap gap-2">
              {options.eyes.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setCharacter(prev => ({ ...prev, eyes: emoji }))}
                  className={`w-10 h-10 text-xl rounded ${
                    character.eyes === emoji ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-2 block">{t('tools.characterCreator.accessory')}</label>
            <div className="flex flex-wrap gap-2">
              {options.accessory.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setCharacter(prev => ({ ...prev, accessory: emoji }))}
                  className={`w-10 h-10 text-xl rounded ${
                    character.accessory === emoji ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-2 block">{t('tools.characterCreator.background')}</label>
            <div className="flex flex-wrap gap-2">
              {options.background.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setCharacter(prev => ({ ...prev, background: bg }))}
                  className={`w-10 h-10 rounded ${bg} ${
                    character.background === bg ? 'ring-2 ring-blue-500' : ''
                  }`}
                  title={backgroundColors[bg]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {savedCharacters.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.characterCreator.savedCharacters')}</h3>
          <div className="flex flex-wrap gap-2">
            {savedCharacters.map((char, i) => (
              <div key={i} className="relative group">
                <div className={`w-16 h-16 rounded-full ${char.background} flex items-center justify-center`}>
                  <span className="text-2xl">{char.face}</span>
                </div>
                <button
                  onClick={() => deleteCharacter(i)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.characterCreator.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.characterCreator.aboutText')}
        </p>
      </div>
    </div>
  )
}
