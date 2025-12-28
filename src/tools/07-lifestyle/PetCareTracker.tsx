import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Pet {
  id: number
  name: string
  type: string
  birthDate?: string
  activities: PetActivity[]
}

interface PetActivity {
  id: number
  type: 'feeding' | 'walk' | 'grooming' | 'vet' | 'medication' | 'playtime'
  date: string
  time: string
  notes?: string
}

export default function PetCareTracker() {
  const { t } = useTranslation()
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedPet, setSelectedPet] = useState<number | null>(null)
  const [showAddPet, setShowAddPet] = useState(false)
  const [newPet, setNewPet] = useState({ name: '', type: 'Dog', birthDate: '' })
  const [newActivity, setNewActivity] = useState({
    type: 'feeding' as PetActivity['type'],
    notes: '',
  })

  const petTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Hamster', 'Rabbit', 'Turtle', 'Other']
  const activityTypes = [
    { id: 'feeding', emoji: '🍽️', label: 'Feeding' },
    { id: 'walk', emoji: '🚶', label: 'Walk' },
    { id: 'grooming', emoji: '✂️', label: 'Grooming' },
    { id: 'vet', emoji: '🏥', label: 'Vet Visit' },
    { id: 'medication', emoji: '💊', label: 'Medication' },
    { id: 'playtime', emoji: '🎾', label: 'Playtime' },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('pet-care-tracker')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setPets(data)
        if (data.length > 0) {
          setSelectedPet(data[0].id)
        }
      } catch (e) {
        console.error('Failed to load pet data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('pet-care-tracker', JSON.stringify(pets))
  }, [pets])

  const addPet = () => {
    if (!newPet.name) return
    const pet: Pet = {
      id: Date.now(),
      name: newPet.name,
      type: newPet.type,
      birthDate: newPet.birthDate || undefined,
      activities: [],
    }
    setPets([...pets, pet])
    setSelectedPet(pet.id)
    setNewPet({ name: '', type: 'Dog', birthDate: '' })
    setShowAddPet(false)
  }

  const deletePet = (id: number) => {
    setPets(pets.filter(p => p.id !== id))
    if (selectedPet === id) {
      setSelectedPet(pets.length > 1 ? pets.find(p => p.id !== id)?.id || null : null)
    }
  }

  const addActivity = () => {
    if (!selectedPet) return
    const now = new Date()
    const activity: PetActivity = {
      id: Date.now(),
      type: newActivity.type,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      notes: newActivity.notes || undefined,
    }
    setPets(pets.map(pet =>
      pet.id === selectedPet
        ? { ...pet, activities: [activity, ...pet.activities] }
        : pet
    ))
    setNewActivity({ type: 'feeding', notes: '' })
  }

  const deleteActivity = (activityId: number) => {
    if (!selectedPet) return
    setPets(pets.map(pet =>
      pet.id === selectedPet
        ? { ...pet, activities: pet.activities.filter(a => a.id !== activityId) }
        : pet
    ))
  }

  const currentPet = useMemo(() => {
    return pets.find(p => p.id === selectedPet)
  }, [pets, selectedPet])

  const getAge = (birthDate?: string) => {
    if (!birthDate) return null
    const birth = new Date(birthDate)
    const today = new Date()
    const years = today.getFullYear() - birth.getFullYear()
    const months = today.getMonth() - birth.getMonth()
    if (years > 0) return `${years} year${years > 1 ? 's' : ''}`
    if (months > 0) return `${months} month${months > 1 ? 's' : ''}`
    return 'Less than a month'
  }

  const todayActivities = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return currentPet?.activities.filter(a => a.date === today) || []
  }, [currentPet])

  const getLastActivity = (type: PetActivity['type']) => {
    const activity = currentPet?.activities.find(a => a.type === type)
    return activity ? `${activity.date} ${activity.time}` : 'Never'
  }

  const getPetEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      Dog: '🐕', Cat: '🐱', Bird: '🐦', Fish: '🐟',
      Hamster: '🐹', Rabbit: '🐰', Turtle: '🐢', Other: '🐾',
    }
    return emojis[type] || '🐾'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {pets.map(pet => (
            <button
              key={pet.id}
              onClick={() => setSelectedPet(pet.id)}
              className={`px-4 py-2 rounded whitespace-nowrap flex items-center gap-2 ${
                selectedPet === pet.id ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              <span>{getPetEmoji(pet.type)}</span>
              <span>{pet.name}</span>
            </button>
          ))}
          <button
            onClick={() => setShowAddPet(true)}
            className="px-4 py-2 bg-green-100 text-green-700 rounded whitespace-nowrap hover:bg-green-200"
          >
            + {t('tools.petCare.addPet')}
          </button>
        </div>
      </div>

      {showAddPet && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.petCare.addPet')}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newPet.name}
              onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              placeholder={t('tools.petCare.petName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newPet.type}
                onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {petTypes.map(type => (
                  <option key={type} value={type}>{getPetEmoji(type)} {type}</option>
                ))}
              </select>
              <input
                type="date"
                value={newPet.birthDate}
                onChange={(e) => setNewPet({ ...newPet, birthDate: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addPet}
                className="flex-1 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
              >
                {t('tools.petCare.add')}
              </button>
              <button
                onClick={() => setShowAddPet(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.petCare.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {currentPet && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <span className="text-2xl">{getPetEmoji(currentPet.type)}</span>
                  {currentPet.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {currentPet.type}
                  {currentPet.birthDate && ` • ${getAge(currentPet.birthDate)} old`}
                </p>
              </div>
              <button
                onClick={() => deletePet(currentPet.id)}
                className="text-slate-400 hover:text-red-500"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {activityTypes.slice(0, 3).map(activity => (
                <div key={activity.id} className="p-2 bg-slate-50 rounded">
                  <div className="text-lg">{activity.emoji}</div>
                  <div className="text-xs text-slate-500">{activity.label}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {getLastActivity(activity.id as PetActivity['type'])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.petCare.logActivity')}
            </h3>
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {activityTypes.map(activity => (
                <button
                  key={activity.id}
                  onClick={() => setNewActivity({ ...newActivity, type: activity.id as PetActivity['type'] })}
                  className={`px-3 py-2 rounded whitespace-nowrap flex items-center gap-1 ${
                    newActivity.type === activity.id ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  <span>{activity.emoji}</span>
                  <span className="text-sm">{activity.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newActivity.notes}
                onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                placeholder={t('tools.petCare.notes')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={addActivity}
                className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.petCare.log')}
              </button>
            </div>
          </div>

          {todayActivities.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.petCare.today')}
              </h3>
              <div className="space-y-2">
                {todayActivities.map(activity => {
                  const activityInfo = activityTypes.find(a => a.id === activity.type)
                  return (
                    <div key={activity.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="flex items-center gap-2">
                        <span>{activityInfo?.emoji}</span>
                        <div>
                          <div className="font-medium text-sm">{activityInfo?.label}</div>
                          <div className="text-xs text-slate-500">{activity.time}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteActivity(activity.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {currentPet.activities.length > todayActivities.length && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.petCare.history')}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {currentPet.activities
                  .filter(a => a.date !== new Date().toISOString().split('T')[0])
                  .slice(0, 20)
                  .map(activity => {
                    const activityInfo = activityTypes.find(a => a.id === activity.type)
                    return (
                      <div key={activity.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <div className="flex items-center gap-2">
                          <span>{activityInfo?.emoji}</span>
                          <div>
                            <div className="font-medium text-sm">{activityInfo?.label}</div>
                            <div className="text-xs text-slate-500">{activity.date} {activity.time}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.petCare.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.petCare.tip1')}</li>
          <li>{t('tools.petCare.tip2')}</li>
          <li>{t('tools.petCare.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
