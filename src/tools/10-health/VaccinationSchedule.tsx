import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Vaccination {
  id: number
  name: string
  dateGiven: string
  nextDue: string
  notes: string
}

export default function VaccinationSchedule() {
  const { t } = useTranslation()
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [newVaccine, setNewVaccine] = useState({
    name: '',
    dateGiven: new Date().toISOString().split('T')[0],
    nextDue: '',
    notes: '',
  })

  const commonVaccines = [
    'COVID-19',
    'Influenza',
    'Tetanus',
    'Hepatitis A',
    'Hepatitis B',
    'MMR',
    'Tdap',
    'Pneumonia',
    'Shingles',
    'HPV',
  ]

  useEffect(() => {
    const saved = localStorage.getItem('vaccination-schedule')
    if (saved) {
      try {
        setVaccinations(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load vaccination data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('vaccination-schedule', JSON.stringify(vaccinations))
  }, [vaccinations])

  const addVaccination = () => {
    if (!newVaccine.name.trim() || !newVaccine.dateGiven) return

    const vaccination: Vaccination = {
      id: Date.now(),
      ...newVaccine,
    }
    setVaccinations([vaccination, ...vaccinations])
    setNewVaccine({
      name: '',
      dateGiven: new Date().toISOString().split('T')[0],
      nextDue: '',
      notes: '',
    })
    setMode('list')
  }

  const deleteVaccination = (id: number) => {
    setVaccinations(vaccinations.filter(v => v.id !== id))
  }

  const getDueStatus = (nextDue: string) => {
    if (!nextDue) return null
    const dueDate = new Date(nextDue)
    const today = new Date()
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { status: 'overdue', color: 'text-red-600 bg-red-50' }
    if (diffDays <= 30) return { status: 'soon', color: 'text-yellow-600 bg-yellow-50' }
    return { status: 'ok', color: 'text-green-600 bg-green-50' }
  }

  const upcomingVaccines = vaccinations.filter(v => {
    if (!v.nextDue) return false
    const dueDate = new Date(v.nextDue)
    const today = new Date()
    const monthLater = new Date()
    monthLater.setMonth(monthLater.getMonth() + 1)
    return dueDate >= today && dueDate <= monthLater
  })

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.vaccinationSchedule.addVaccine')}
          </button>

          {upcomingVaccines.length > 0 && (
            <div className="card p-4 bg-yellow-50 border border-yellow-200">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                {t('tools.vaccinationSchedule.upcoming')}
              </h3>
              <div className="space-y-1">
                {upcomingVaccines.map(v => (
                  <div key={v.id} className="flex justify-between text-sm">
                    <span>{v.name}</span>
                    <span className="text-yellow-700">{v.nextDue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vaccinations.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.vaccinationSchedule.noRecords')}
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700">{t('tools.vaccinationSchedule.records')}</h3>
              {vaccinations.map(vaccine => {
                const dueStatus = getDueStatus(vaccine.nextDue)
                return (
                  <div key={vaccine.id} className={`card p-4 ${dueStatus?.color || ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{vaccine.name}</div>
                        <div className="text-xs text-slate-500">
                          {t('tools.vaccinationSchedule.given')}: {vaccine.dateGiven}
                        </div>
                        {vaccine.nextDue && (
                          <div className="text-xs mt-1">
                            {t('tools.vaccinationSchedule.nextDue')}: {vaccine.nextDue}
                            {dueStatus?.status === 'overdue' && (
                              <span className="ml-2 text-red-600 font-medium">
                                ({t('tools.vaccinationSchedule.overdue')})
                              </span>
                            )}
                          </div>
                        )}
                        {vaccine.notes && (
                          <div className="text-xs text-slate-500 mt-1">{vaccine.notes}</div>
                        )}
                      </div>
                      <button onClick={() => deleteVaccination(vaccine.id)} className="text-red-500">×</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {mode === 'add' && (
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.vaccinationSchedule.vaccineName')} *
            </label>
            <input
              type="text"
              value={newVaccine.name}
              onChange={(e) => setNewVaccine({ ...newVaccine, name: e.target.value })}
              placeholder={t('tools.vaccinationSchedule.namePlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.vaccinationSchedule.commonVaccines')}
            </label>
            <div className="flex flex-wrap gap-2">
              {commonVaccines.map(vaccine => (
                <button
                  key={vaccine}
                  onClick={() => setNewVaccine({ ...newVaccine, name: vaccine })}
                  className={`px-3 py-1.5 rounded text-sm ${
                    newVaccine.name === vaccine ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {vaccine}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.vaccinationSchedule.dateGiven')} *
            </label>
            <input
              type="date"
              value={newVaccine.dateGiven}
              onChange={(e) => setNewVaccine({ ...newVaccine, dateGiven: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.vaccinationSchedule.nextDueDate')}
            </label>
            <input
              type="date"
              value={newVaccine.nextDue}
              onChange={(e) => setNewVaccine({ ...newVaccine, nextDue: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.vaccinationSchedule.notes')}
            </label>
            <textarea
              value={newVaccine.notes}
              onChange={(e) => setNewVaccine({ ...newVaccine, notes: e.target.value })}
              placeholder={t('tools.vaccinationSchedule.notesPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode('list')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button
              onClick={addVaccination}
              disabled={!newVaccine.name.trim() || !newVaccine.dateGiven}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.vaccinationSchedule.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
