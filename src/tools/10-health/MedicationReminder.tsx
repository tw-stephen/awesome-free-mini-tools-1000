import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Medication {
  id: number
  name: string
  dosage: string
  frequency: string
  times: string[]
  notes: string
  takenToday: string[]
}

export default function MedicationReminder() {
  const { t } = useTranslation()
  const [medications, setMedications] = useState<Medication[]>([])
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [today] = useState(new Date().toISOString().split('T')[0])
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: ['08:00'],
    notes: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('medication-reminder')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        const resetMeds = data.map((med: Medication) => ({
          ...med,
          takenToday: data.lastDate === today ? med.takenToday : [],
        }))
        setMedications(resetMeds)
      } catch (e) {
        console.error('Failed to load medications')
      }
    }
  }, [today])

  useEffect(() => {
    localStorage.setItem('medication-reminder', JSON.stringify({ medications, lastDate: today }))
  }, [medications, today])

  const addMedication = () => {
    if (!newMed.name.trim()) return

    const med: Medication = {
      id: Date.now(),
      ...newMed,
      takenToday: [],
    }
    setMedications([...medications, med])
    setNewMed({
      name: '',
      dosage: '',
      frequency: 'daily',
      times: ['08:00'],
      notes: '',
    })
    setMode('list')
  }

  const deleteMedication = (id: number) => {
    setMedications(medications.filter(m => m.id !== id))
  }

  const markTaken = (medId: number, time: string) => {
    setMedications(medications.map(med => {
      if (med.id === medId) {
        const takenToday = med.takenToday.includes(time)
          ? med.takenToday.filter(t => t !== time)
          : [...med.takenToday, time]
        return { ...med, takenToday }
      }
      return med
    }))
  }

  const addTime = () => {
    setNewMed({ ...newMed, times: [...newMed.times, '12:00'] })
  }

  const updateTime = (index: number, value: string) => {
    const times = [...newMed.times]
    times[index] = value
    setNewMed({ ...newMed, times })
  }

  const removeTime = (index: number) => {
    setNewMed({ ...newMed, times: newMed.times.filter((_, i) => i !== index) })
  }

  const totalDoses = medications.reduce((sum, m) => sum + m.times.length, 0)
  const takenDoses = medications.reduce((sum, m) => sum + m.takenToday.length, 0)

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.medicationReminder.addMedication')}
          </button>

          {medications.length > 0 && (
            <div className="card p-4 text-center bg-green-50">
              <div className="text-2xl font-bold text-green-600">
                {takenDoses} / {totalDoses}
              </div>
              <div className="text-sm text-slate-500">{t('tools.medicationReminder.dosesTaken')}</div>
              <div className="h-2 bg-slate-200 rounded-full mt-2">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(takenDoses / totalDoses) * 100}%` }}
                />
              </div>
            </div>
          )}

          {medications.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.medicationReminder.noMedications')}
            </div>
          ) : (
            <div className="space-y-2">
              {medications.map(med => (
                <div key={med.id} className="card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{med.name}</div>
                      <div className="text-sm text-slate-500">{med.dosage}</div>
                    </div>
                    <button onClick={() => deleteMedication(med.id)} className="text-red-500">×</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {med.times.map(time => (
                      <button
                        key={time}
                        onClick={() => markTaken(med.id, time)}
                        className={`px-3 py-1.5 rounded text-sm font-medium ${
                          med.takenToday.includes(time)
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-100'
                        }`}
                      >
                        {time} {med.takenToday.includes(time) ? '✓' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'add' && (
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.medicationReminder.medicationName')} *
            </label>
            <input
              type="text"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              placeholder={t('tools.medicationReminder.namePlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.medicationReminder.dosage')}
            </label>
            <input
              type="text"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              placeholder={t('tools.medicationReminder.dosagePlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.medicationReminder.times')}
            </label>
            <div className="space-y-2">
              {newMed.times.map((time, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTime(i, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  {newMed.times.length > 1 && (
                    <button
                      onClick={() => removeTime(i)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addTime}
                className="text-sm text-blue-500"
              >
                + {t('tools.medicationReminder.addTime')}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.medicationReminder.notes')}
            </label>
            <textarea
              value={newMed.notes}
              onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
              placeholder={t('tools.medicationReminder.notesPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode('list')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button
              onClick={addMedication}
              disabled={!newMed.name.trim()}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.medicationReminder.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
