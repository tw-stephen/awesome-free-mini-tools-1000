import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface WordSlot {
  id: string
  type: string
  value: string
}

interface Story {
  title: string
  slots: WordSlot[]
  template: string
}

export default function MadLibs() {
  const { t } = useTranslation()
  const [currentStory, setCurrentStory] = useState<Story | null>(null)
  const [showResult, setShowResult] = useState(false)

  const stories: Story[] = [
    {
      title: 'The Adventurous Trip',
      slots: [
        { id: '1', type: 'adjective', value: '' },
        { id: '2', type: 'noun', value: '' },
        { id: '3', type: 'verb (past tense)', value: '' },
        { id: '4', type: 'place', value: '' },
        { id: '5', type: 'animal', value: '' },
        { id: '6', type: 'exclamation', value: '' }
      ],
      template: 'Last summer, I went on a {1} adventure to find a legendary {2}. I {3} all the way to {4} where I met a talking {5}. It said "{6}!" and we became best friends.'
    },
    {
      title: 'The Magic Potion',
      slots: [
        { id: '1', type: 'color', value: '' },
        { id: '2', type: 'liquid', value: '' },
        { id: '3', type: 'body part', value: '' },
        { id: '4', type: 'verb ending in -ing', value: '' },
        { id: '5', type: 'celebrity', value: '' },
        { id: '6', type: 'number', value: '' }
      ],
      template: 'The wizard mixed a {1} potion made of {2}. When I touched it with my {3}, I started {4} uncontrollably! Then I turned into {5} for exactly {6} minutes.'
    },
    {
      title: 'The New Job',
      slots: [
        { id: '1', type: 'job title', value: '' },
        { id: '2', type: 'company name', value: '' },
        { id: '3', type: 'verb', value: '' },
        { id: '4', type: 'plural noun', value: '' },
        { id: '5', type: 'adjective', value: '' },
        { id: '6', type: 'amount of money', value: '' }
      ],
      template: 'I got a new job as a {1} at {2}. My main responsibility is to {3} all the {4}. The work environment is very {5} and they pay me {6} per hour!'
    },
    {
      title: 'The Restaurant Review',
      slots: [
        { id: '1', type: 'restaurant name', value: '' },
        { id: '2', type: 'adjective', value: '' },
        { id: '3', type: 'food', value: '' },
        { id: '4', type: 'animal', value: '' },
        { id: '5', type: 'emotion', value: '' },
        { id: '6', type: 'rating (1-10)', value: '' }
      ],
      template: 'I dined at {1} last night. The atmosphere was {2} and the {3} tasted like {4}. The waiter made me feel {5}. Overall, I give it a {6} out of 10.'
    }
  ]

  const selectStory = (index: number) => {
    setCurrentStory({
      ...stories[index],
      slots: stories[index].slots.map(s => ({ ...s, value: '' }))
    })
    setShowResult(false)
  }

  const updateSlot = (id: string, value: string) => {
    if (!currentStory) return
    setCurrentStory({
      ...currentStory,
      slots: currentStory.slots.map(s =>
        s.id === id ? { ...s, value } : s
      )
    })
  }

  const generateStory = () => {
    if (!currentStory) return
    const allFilled = currentStory.slots.every(s => s.value.trim())
    if (allFilled) {
      setShowResult(true)
    }
  }

  const getFinalStory = () => {
    if (!currentStory) return ''
    let result = currentStory.template
    currentStory.slots.forEach(slot => {
      result = result.replace(`{${slot.id}}`, `<strong class="text-blue-600">${slot.value}</strong>`)
    })
    return result
  }

  const resetStory = () => {
    if (!currentStory) return
    setCurrentStory({
      ...currentStory,
      slots: currentStory.slots.map(s => ({ ...s, value: '' }))
    })
    setShowResult(false)
  }

  const allFilled = currentStory?.slots.every(s => s.value.trim()) ?? false

  return (
    <div className="space-y-4">
      {!currentStory ? (
        <div className="card p-4">
          <h3 className="font-medium mb-4 text-center">{t('tools.madLibs.selectStory')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {stories.map((story, i) => (
              <button
                key={i}
                onClick={() => selectStory(i)}
                className="p-4 bg-slate-100 rounded-lg hover:bg-slate-200 text-left"
              >
                <div className="text-2xl mb-2">📖</div>
                <div className="font-medium">{story.title}</div>
                <div className="text-sm text-slate-500">{story.slots.length} words needed</div>
              </button>
            ))}
          </div>
        </div>
      ) : !showResult ? (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">📝 {currentStory.title}</h3>
              <button
                onClick={() => setCurrentStory(null)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                ← {t('tools.madLibs.back')}
              </button>
            </div>

            <div className="space-y-3">
              {currentStory.slots.map((slot) => (
                <div key={slot.id}>
                  <label className="text-sm text-slate-500 mb-1 block">
                    {slot.type}
                  </label>
                  <input
                    type="text"
                    value={slot.value}
                    onChange={(e) => updateSlot(slot.id, e.target.value)}
                    placeholder={`Enter a ${slot.type}...`}
                    className="w-full px-4 py-2 border border-slate-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 text-center">
            <button
              onClick={generateStory}
              disabled={!allFilled}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎉 {t('tools.madLibs.createStory')}
            </button>
            {!allFilled && (
              <p className="text-sm text-slate-500 mt-2">
                {t('tools.madLibs.fillAllWords')}
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4 text-center">📖 {currentStory.title}</h3>
            <p
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: getFinalStory() }}
            />
          </div>

          <div className="card p-4 flex gap-2 justify-center">
            <button
              onClick={resetStory}
              className="px-6 py-2 bg-slate-100 rounded font-medium hover:bg-slate-200"
            >
              🔄 {t('tools.madLibs.tryAgain')}
            </button>
            <button
              onClick={() => setCurrentStory(null)}
              className="px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              📚 {t('tools.madLibs.newStory')}
            </button>
          </div>
        </>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.madLibs.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.madLibs.instruction1')}</li>
          <li>• {t('tools.madLibs.instruction2')}</li>
          <li>• {t('tools.madLibs.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
