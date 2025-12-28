import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface StoryTemplate {
  genre: string
  template: string
  elements: string[]
}

export default function StoryGenerator() {
  const { t } = useTranslation()
  const [story, setStory] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('fantasy')
  const [generating, setGenerating] = useState(false)

  const characters = ['a brave knight', 'a curious scientist', 'a young wizard', 'a clever detective', 'a mysterious stranger', 'a fearless explorer', 'a kind-hearted robot', 'a talking cat']
  const settings = ['in a magical forest', 'on a distant planet', 'in a hidden underwater city', 'in an ancient castle', 'in a futuristic metropolis', 'on a mysterious island', 'in a parallel dimension']
  const objects = ['a glowing crystal', 'an ancient map', 'a mysterious key', 'a powerful artifact', 'a secret diary', 'a magical compass', 'a legendary sword']
  const conflicts = ['must save the world from', 'discovers a secret about', 'embarks on a quest to find', 'must solve the mystery of', 'races against time to prevent']
  const villains = ['an evil sorcerer', 'a corrupt corporation', 'a dark force', 'a vengeful ghost', 'a mad scientist', 'an ancient curse']
  const endings = ['and learns that true power comes from within.', 'discovering that the real treasure was friendship all along.', 'but realizes the journey was just the beginning.', 'and the world was never the same again.', 'proving that anything is possible with courage.']

  const templates: Record<string, StoryTemplate> = {
    fantasy: {
      genre: 'Fantasy',
      template: 'Once upon a time, {character} lived {setting}. One day, they found {object} and {conflict} {villain}. After many adventures, they succeeded, {ending}',
      elements: ['character', 'setting', 'object', 'conflict', 'villain', 'ending']
    },
    scifi: {
      genre: 'Sci-Fi',
      template: 'In the year 3000, {character} worked {setting}. When they discovered {object}, they knew they {conflict} {villain}. Through innovation and bravery, {ending}',
      elements: ['character', 'setting', 'object', 'conflict', 'villain', 'ending']
    },
    mystery: {
      genre: 'Mystery',
      template: '{character} received a strange message {setting}. With only {object} as a clue, they {conflict} {villain}. In the end, {ending}',
      elements: ['character', 'setting', 'object', 'conflict', 'villain', 'ending']
    },
    adventure: {
      genre: 'Adventure',
      template: 'The adventure began when {character} stumbled upon {object} {setting}. This discovery led them to {conflict} {villain}. Against all odds, {ending}',
      elements: ['character', 'setting', 'object', 'conflict', 'villain', 'ending']
    }
  }

  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

  const generateStory = () => {
    setGenerating(true)

    const template = templates[selectedGenre]
    let generatedStory = template.template
      .replace('{character}', getRandom(characters))
      .replace('{setting}', getRandom(settings))
      .replace('{object}', getRandom(objects))
      .replace('{conflict}', getRandom(conflicts))
      .replace('{villain}', getRandom(villains))
      .replace('{ending}', getRandom(endings))

    // Simulate typing effect
    setStory('')
    let index = 0
    const interval = setInterval(() => {
      if (index < generatedStory.length) {
        setStory(generatedStory.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setGenerating(false)
      }
    }, 30)
  }

  const genres = Object.entries(templates).map(([key, val]) => ({
    id: key,
    name: val.genre,
    emoji: key === 'fantasy' ? '🧙' : key === 'scifi' ? '🚀' : key === 'mystery' ? '🔍' : '🗺️'
  }))

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.storyGenerator.selectGenre')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`p-3 rounded-lg transition-all ${
                selectedGenre === genre.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-2xl">{genre.emoji}</div>
              <div className="text-sm mt-1">{genre.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 text-center">
        <button
          onClick={generateStory}
          disabled={generating}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {generating ? t('tools.storyGenerator.generating') : t('tools.storyGenerator.generate')}
        </button>
      </div>

      {story && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📖</span>
            <h3 className="font-bold text-lg">{t('tools.storyGenerator.yourStory')}</h3>
          </div>
          <p className="text-lg leading-relaxed text-slate-700">
            {story}
            {generating && <span className="animate-pulse">|</span>}
          </p>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.storyGenerator.storyElements')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-700">{t('tools.storyGenerator.characters')}:</span>
            <p className="text-slate-500">{characters.slice(0, 4).join(', ')}...</p>
          </div>
          <div>
            <span className="font-medium text-slate-700">{t('tools.storyGenerator.settings')}:</span>
            <p className="text-slate-500">{settings.slice(0, 3).join(', ')}...</p>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.storyGenerator.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.storyGenerator.aboutText')}
        </p>
      </div>
    </div>
  )
}
