import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Pose {
  id: string
  name: string
  sanskrit: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  benefits: string[]
}

export default function YogaPoseGuide() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null)

  const poses: Pose[] = [
    { id: 'mountain', name: 'Mountain Pose', sanskrit: 'Tadasana', category: 'standing', difficulty: 'beginner', description: 'Stand tall with feet together, arms at sides', benefits: ['Improves posture', 'Strengthens thighs', 'Increases awareness'] },
    { id: 'tree', name: 'Tree Pose', sanskrit: 'Vrksasana', category: 'standing', difficulty: 'beginner', description: 'Balance on one leg with other foot on inner thigh', benefits: ['Improves balance', 'Strengthens legs', 'Opens hips'] },
    { id: 'warrior1', name: 'Warrior I', sanskrit: 'Virabhadrasana I', category: 'standing', difficulty: 'beginner', description: 'Lunge with arms raised overhead', benefits: ['Strengthens legs', 'Opens chest', 'Builds focus'] },
    { id: 'warrior2', name: 'Warrior II', sanskrit: 'Virabhadrasana II', category: 'standing', difficulty: 'beginner', description: 'Lunge with arms extended parallel to floor', benefits: ['Strengthens legs', 'Opens hips', 'Builds stamina'] },
    { id: 'downdog', name: 'Downward Dog', sanskrit: 'Adho Mukha Svanasana', category: 'inversion', difficulty: 'beginner', description: 'Inverted V-shape with hands and feet on floor', benefits: ['Stretches hamstrings', 'Strengthens arms', 'Calms mind'] },
    { id: 'cobra', name: 'Cobra Pose', sanskrit: 'Bhujangasana', category: 'backbend', difficulty: 'beginner', description: 'Lie face down, lift chest with arms support', benefits: ['Strengthens spine', 'Opens chest', 'Reduces fatigue'] },
    { id: 'child', name: 'Child\'s Pose', sanskrit: 'Balasana', category: 'resting', difficulty: 'beginner', description: 'Kneel and fold forward with arms extended', benefits: ['Relaxes body', 'Stretches hips', 'Relieves stress'] },
    { id: 'corpse', name: 'Corpse Pose', sanskrit: 'Savasana', category: 'resting', difficulty: 'beginner', description: 'Lie flat on back in complete relaxation', benefits: ['Deep relaxation', 'Reduces stress', 'Lowers blood pressure'] },
    { id: 'bridge', name: 'Bridge Pose', sanskrit: 'Setu Bandhasana', category: 'backbend', difficulty: 'intermediate', description: 'Lie on back, lift hips with feet flat', benefits: ['Opens chest', 'Strengthens glutes', 'Stretches spine'] },
    { id: 'halfmoon', name: 'Half Moon Pose', sanskrit: 'Ardha Chandrasana', category: 'standing', difficulty: 'intermediate', description: 'Balance on one leg with body horizontal', benefits: ['Improves balance', 'Strengthens core', 'Builds coordination'] },
    { id: 'crow', name: 'Crow Pose', sanskrit: 'Bakasana', category: 'arm_balance', difficulty: 'intermediate', description: 'Balance on hands with knees on triceps', benefits: ['Strengthens arms', 'Improves focus', 'Builds confidence'] },
    { id: 'headstand', name: 'Headstand', sanskrit: 'Sirsasana', category: 'inversion', difficulty: 'advanced', description: 'Balance inverted on forearms and head', benefits: ['Improves circulation', 'Builds core strength', 'Enhances focus'] },
    { id: 'wheelpose', name: 'Wheel Pose', sanskrit: 'Urdhva Dhanurasana', category: 'backbend', difficulty: 'advanced', description: 'Full backbend with hands and feet on floor', benefits: ['Opens chest', 'Increases energy', 'Strengthens arms'] },
    { id: 'lotus', name: 'Lotus Pose', sanskrit: 'Padmasana', category: 'seated', difficulty: 'intermediate', description: 'Seated with legs crossed, feet on thighs', benefits: ['Opens hips', 'Calms mind', 'Improves posture'] },
    { id: 'pigeon', name: 'Pigeon Pose', sanskrit: 'Eka Pada Rajakapotasana', category: 'hip_opener', difficulty: 'intermediate', description: 'One leg bent forward, other extended back', benefits: ['Deep hip stretch', 'Releases tension', 'Opens chest'] },
  ]

  const categories = ['all', 'standing', 'seated', 'backbend', 'inversion', 'arm_balance', 'hip_opener', 'resting']
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

  const filteredPoses = poses.filter(pose => {
    const matchesCategory = selectedCategory === 'all' || pose.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || pose.difficulty === selectedDifficulty
    return matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-4">
      {!selectedPose ? (
        <>
          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.yogaPoseGuide.category')}
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedCategory === cat ? 'bg-purple-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.yogaPoseGuide.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            {difficulties.map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`flex-1 py-2 rounded text-sm ${
                  selectedDifficulty === diff ? 'bg-purple-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t(`tools.yogaPoseGuide.${diff}`)}
              </button>
            ))}
          </div>

          <div className="text-sm text-slate-500">
            {filteredPoses.length} {t('tools.yogaPoseGuide.poses')}
          </div>

          <div className="space-y-2">
            {filteredPoses.map(pose => (
              <div
                key={pose.id}
                onClick={() => setSelectedPose(pose)}
                className="card p-4 cursor-pointer hover:bg-slate-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{pose.name}</div>
                    <div className="text-sm text-purple-600 italic">{pose.sanskrit}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(pose.difficulty)}`}>
                    {t(`tools.yogaPoseGuide.${pose.difficulty}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedPose(null)}
            className="text-sm text-blue-500"
          >
            ← {t('tools.yogaPoseGuide.back')}
          </button>

          <div className="card p-6">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">🧘</div>
              <h2 className="text-2xl font-bold">{selectedPose.name}</h2>
              <p className="text-lg text-purple-600 italic">{selectedPose.sanskrit}</p>
              <span className={`inline-block mt-2 text-xs px-3 py-1 rounded ${getDifficultyColor(selectedPose.difficulty)}`}>
                {t(`tools.yogaPoseGuide.${selectedPose.difficulty}`)}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">{t('tools.yogaPoseGuide.description')}</h3>
                <p className="text-slate-600">{selectedPose.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.yogaPoseGuide.benefits')}</h3>
                <ul className="space-y-1">
                  {selectedPose.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-green-500">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-purple-50 rounded">
                <span className="text-sm text-slate-600">
                  {t('tools.yogaPoseGuide.category')}: {t(`tools.yogaPoseGuide.${selectedPose.category}`)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
