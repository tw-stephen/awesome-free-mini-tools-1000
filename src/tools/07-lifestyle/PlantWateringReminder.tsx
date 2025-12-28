import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Plant {
  id: number
  name: string
  location: string
  wateringInterval: number
  lastWatered: string
  notes?: string
}

export default function PlantWateringReminder() {
  const { t } = useTranslation()
  const [plants, setPlants] = useState<Plant[]>([])
  const [showAddPlant, setShowAddPlant] = useState(false)
  const [newPlant, setNewPlant] = useState({
    name: '',
    location: '',
    wateringInterval: '7',
    notes: '',
  })

  const locations = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony', 'Office', 'Garden']
  const commonPlants = [
    { name: 'Snake Plant', interval: 14 },
    { name: 'Pothos', interval: 7 },
    { name: 'Monstera', interval: 7 },
    { name: 'Peace Lily', interval: 5 },
    { name: 'Spider Plant', interval: 7 },
    { name: 'Cactus', interval: 21 },
    { name: 'Succulent', interval: 14 },
    { name: 'Fern', interval: 3 },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('plant-watering')
    if (saved) {
      try {
        setPlants(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load plants')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('plant-watering', JSON.stringify(plants))
  }, [plants])

  const addPlant = () => {
    if (!newPlant.name) return
    const plant: Plant = {
      id: Date.now(),
      name: newPlant.name,
      location: newPlant.location || 'Living Room',
      wateringInterval: parseInt(newPlant.wateringInterval) || 7,
      lastWatered: new Date().toISOString().split('T')[0],
      notes: newPlant.notes || undefined,
    }
    setPlants([...plants, plant])
    setNewPlant({ name: '', location: '', wateringInterval: '7', notes: '' })
    setShowAddPlant(false)
  }

  const waterPlant = (id: number) => {
    setPlants(plants.map(plant =>
      plant.id === id ? { ...plant, lastWatered: new Date().toISOString().split('T')[0] } : plant
    ))
  }

  const deletePlant = (id: number) => {
    setPlants(plants.filter(plant => plant.id !== id))
  }

  const getDaysUntilWatering = (plant: Plant) => {
    const lastWatered = new Date(plant.lastWatered)
    const nextWatering = new Date(lastWatered.getTime() + plant.wateringInterval * 24 * 60 * 60 * 1000)
    const today = new Date()
    const diff = Math.ceil((nextWatering.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const sortedPlants = useMemo(() => {
    return [...plants].sort((a, b) => getDaysUntilWatering(a) - getDaysUntilWatering(b))
  }, [plants])

  const stats = useMemo(() => {
    const needsWater = plants.filter(p => getDaysUntilWatering(p) <= 0).length
    const upcoming = plants.filter(p => {
      const days = getDaysUntilWatering(p)
      return days > 0 && days <= 2
    }).length
    return { total: plants.length, needsWater, upcoming }
  }, [plants])

  const selectCommonPlant = (plant: typeof commonPlants[0]) => {
    setNewPlant({
      ...newPlant,
      name: plant.name,
      wateringInterval: plant.interval.toString(),
    })
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.total}</div>
            <div className="text-xs text-slate-500">{t('tools.plantWatering.totalPlants')}</div>
          </div>
          <div className="p-3 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{stats.needsWater}</div>
            <div className="text-xs text-slate-500">{t('tools.plantWatering.needsWater')}</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{stats.upcoming}</div>
            <div className="text-xs text-slate-500">{t('tools.plantWatering.upcoming')}</div>
          </div>
        </div>
      </div>

      {!showAddPlant ? (
        <button
          onClick={() => setShowAddPlant(true)}
          className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
        >
          + {t('tools.plantWatering.addPlant')}
        </button>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.plantWatering.addPlant')}
          </h3>

          <div className="flex flex-wrap gap-1 mb-3">
            {commonPlants.map(plant => (
              <button
                key={plant.name}
                onClick={() => selectCommonPlant(plant)}
                className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs hover:bg-green-100"
              >
                {plant.name}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={newPlant.name}
              onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
              placeholder={t('tools.plantWatering.plantName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newPlant.location}
                onChange={(e) => setNewPlant({ ...newPlant, location: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newPlant.wateringInterval}
                  onChange={(e) => setNewPlant({ ...newPlant, wateringInterval: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                />
                <span className="text-sm text-slate-500">{t('tools.plantWatering.days')}</span>
              </div>
            </div>
            <input
              type="text"
              value={newPlant.notes}
              onChange={(e) => setNewPlant({ ...newPlant, notes: e.target.value })}
              placeholder={t('tools.plantWatering.notes')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={addPlant}
                className="flex-1 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
              >
                {t('tools.plantWatering.add')}
              </button>
              <button
                onClick={() => setShowAddPlant(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.plantWatering.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {sortedPlants.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          {t('tools.plantWatering.noPlants')}
        </div>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.plantWatering.yourPlants')}
          </h3>
          <div className="space-y-3">
            {sortedPlants.map(plant => {
              const daysUntil = getDaysUntilWatering(plant)
              const needsWater = daysUntil <= 0
              const soonNeedsWater = daysUntil > 0 && daysUntil <= 2

              return (
                <div
                  key={plant.id}
                  className={`p-3 rounded ${
                    needsWater ? 'bg-red-50 border-2 border-red-200' :
                    soonNeedsWater ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <span className="text-lg">🌱</span>
                        {plant.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {plant.location} • {t('tools.plantWatering.every')} {plant.wateringInterval} {t('tools.plantWatering.days')}
                      </div>
                      {plant.notes && (
                        <div className="text-xs text-slate-400 mt-1">{plant.notes}</div>
                      )}
                    </div>
                    <button
                      onClick={() => deletePlant(plant.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      needsWater ? 'text-red-600' :
                      soonNeedsWater ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {needsWater
                        ? t('tools.plantWatering.waterNow')
                        : `${daysUntil} ${t('tools.plantWatering.daysUntil')}`}
                    </span>
                    <button
                      onClick={() => waterPlant(plant.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center gap-1"
                    >
                      💧 {t('tools.plantWatering.water')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.plantWatering.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.plantWatering.tip1')}</li>
          <li>{t('tools.plantWatering.tip2')}</li>
          <li>{t('tools.plantWatering.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
