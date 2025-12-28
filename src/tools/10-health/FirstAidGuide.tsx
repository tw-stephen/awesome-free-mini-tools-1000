import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FirstAidTopic {
  id: string
  title: string
  icon: string
  urgency: 'high' | 'medium' | 'low'
  steps: string[]
  warnings: string[]
  callEmergency: boolean
}

export default function FirstAidGuide() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<FirstAidTopic | null>(null)

  const topics: FirstAidTopic[] = [
    {
      id: 'choking',
      title: 'Choking',
      icon: '😰',
      urgency: 'high',
      steps: [
        'Ask "Are you choking?" - if they can\'t speak, act immediately',
        'Stand behind the person and wrap arms around waist',
        'Make a fist with one hand, place thumb side against abdomen above navel',
        'Grasp fist with other hand and thrust inward and upward',
        'Repeat until object is expelled or person becomes unconscious',
      ],
      warnings: ['Call emergency services if person becomes unconscious', 'Do not perform on pregnant women or infants without proper training'],
      callEmergency: true,
    },
    {
      id: 'bleeding',
      title: 'Severe Bleeding',
      icon: '🩸',
      urgency: 'high',
      steps: [
        'Apply direct pressure with clean cloth or bandage',
        'Keep continuous pressure for at least 15 minutes',
        'Elevate wounded area above heart level if possible',
        'Add more bandages if blood soaks through',
        'Secure bandage in place once bleeding slows',
      ],
      warnings: ['Do not remove embedded objects', 'Seek medical help for deep wounds'],
      callEmergency: true,
    },
    {
      id: 'burns',
      title: 'Burns',
      icon: '🔥',
      urgency: 'medium',
      steps: [
        'Remove person from heat source',
        'Cool burn under cool (not cold) running water for 10-20 minutes',
        'Remove jewelry or tight items near burned area',
        'Cover with clean, non-stick bandage',
        'Do not apply ice, butter, or creams',
      ],
      warnings: ['Seek medical help for burns larger than palm size', 'Chemical burns require special treatment'],
      callEmergency: false,
    },
    {
      id: 'cpr',
      title: 'CPR',
      icon: '❤️',
      urgency: 'high',
      steps: [
        'Check for responsiveness - tap and shout',
        'Call emergency services immediately',
        'Place heel of hand on center of chest',
        'Push hard and fast - 30 compressions at 100-120 per minute',
        'Give 2 rescue breaths if trained',
        'Continue until help arrives',
      ],
      warnings: ['Only perform if person is unresponsive and not breathing normally', 'Use AED if available'],
      callEmergency: true,
    },
    {
      id: 'fracture',
      title: 'Fractures',
      icon: '🦴',
      urgency: 'medium',
      steps: [
        'Keep injured area still and supported',
        'Apply ice pack wrapped in cloth to reduce swelling',
        'Immobilize joint above and below injury',
        'Use splint if needed for transport',
        'Seek medical attention',
      ],
      warnings: ['Do not try to straighten broken bone', 'Watch for signs of shock'],
      callEmergency: false,
    },
    {
      id: 'allergic',
      title: 'Allergic Reaction',
      icon: '🤧',
      urgency: 'high',
      steps: [
        'Remove allergen if known and possible',
        'Check if person has epinephrine auto-injector',
        'Help administer epinephrine if available',
        'Have person lie down with legs elevated',
        'Monitor breathing and be prepared for CPR',
      ],
      warnings: ['Anaphylaxis is life-threatening - call emergency immediately', 'Even if symptoms improve, medical evaluation is needed'],
      callEmergency: true,
    },
    {
      id: 'heatstroke',
      title: 'Heat Stroke',
      icon: '🌡️',
      urgency: 'high',
      steps: [
        'Move person to cool area immediately',
        'Remove excess clothing',
        'Cool body with water, ice packs, or wet towels',
        'Focus cooling on head, neck, armpits, groin',
        'Fan the person while misting with water',
      ],
      warnings: ['Heat stroke is medical emergency', 'Do not give fluids if unconscious'],
      callEmergency: true,
    },
    {
      id: 'nosebleed',
      title: 'Nosebleed',
      icon: '👃',
      urgency: 'low',
      steps: [
        'Sit upright and lean slightly forward',
        'Pinch soft part of nose firmly',
        'Maintain pressure for 10-15 minutes',
        'Breathe through mouth',
        'Apply cold compress to bridge of nose',
      ],
      warnings: ['Seek help if bleeding lasts more than 20 minutes', 'Do not tilt head back'],
      callEmergency: false,
    },
  ]

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  )

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-700 border-green-300'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 bg-red-50 border border-red-200">
        <p className="text-sm text-red-700 font-medium">
          ⚠️ {t('tools.firstAidGuide.disclaimer')}
        </p>
      </div>

      {!selectedTopic ? (
        <>
          <div className="card p-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('tools.firstAidGuide.searchPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div className="space-y-2">
            {filteredTopics.map(topic => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`card p-4 cursor-pointer border-l-4 ${getUrgencyColor(topic.urgency)}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{topic.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{topic.title}</div>
                    <div className="text-xs text-slate-500">
                      {topic.callEmergency && `🚨 ${t('tools.firstAidGuide.callEmergency')}`}
                    </div>
                  </div>
                  <span className="text-slate-400">→</span>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-4 text-center">
            <div className="text-4xl mb-2">📞</div>
            <div className="font-bold text-lg">{t('tools.firstAidGuide.emergencyNumbers')}</div>
            <div className="text-sm text-slate-600 mt-2">
              <p>🇺🇸 USA: 911</p>
              <p>🇬🇧 UK: 999</p>
              <p>🇪🇺 EU: 112</p>
              <p>🇹🇼 Taiwan: 119</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedTopic(null)}
            className="text-sm text-blue-500"
          >
            ← {t('tools.firstAidGuide.back')}
          </button>

          <div className={`card p-4 border-l-4 ${getUrgencyColor(selectedTopic.urgency)}`}>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedTopic.icon}</span>
              <div>
                <h2 className="text-xl font-bold">{selectedTopic.title}</h2>
                {selectedTopic.callEmergency && (
                  <div className="text-red-600 font-medium text-sm">
                    🚨 {t('tools.firstAidGuide.callEmergencyNow')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.firstAidGuide.steps')}</h3>
            <ol className="space-y-3">
              {selectedTopic.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {selectedTopic.warnings.length > 0 && (
            <div className="card p-4 bg-yellow-50 border border-yellow-200">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                ⚠️ {t('tools.firstAidGuide.warnings')}
              </h3>
              <ul className="space-y-1">
                {selectedTopic.warnings.map((warning, i) => (
                  <li key={i} className="text-sm text-yellow-700">• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}
