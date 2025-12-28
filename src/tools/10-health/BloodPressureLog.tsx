import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface BPEntry {
  id: number
  systolic: number
  diastolic: number
  pulse: number
  date: string
  time: string
  notes: string
}

export default function BloodPressureLog() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<BPEntry[]>([])
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [newEntry, setNewEntry] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    notes: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('blood-pressure-log')
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load BP data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('blood-pressure-log', JSON.stringify(entries))
  }, [entries])

  const getCategory = (systolic: number, diastolic: number) => {
    if (systolic < 90 || diastolic < 60) {
      return { label: t('tools.bloodPressureLog.low'), color: 'text-blue-600', bg: 'bg-blue-50' }
    } else if (systolic < 120 && diastolic < 80) {
      return { label: t('tools.bloodPressureLog.normal'), color: 'text-green-600', bg: 'bg-green-50' }
    } else if (systolic < 130 && diastolic < 80) {
      return { label: t('tools.bloodPressureLog.elevated'), color: 'text-yellow-600', bg: 'bg-yellow-50' }
    } else if (systolic < 140 || diastolic < 90) {
      return { label: t('tools.bloodPressureLog.highStage1'), color: 'text-orange-600', bg: 'bg-orange-50' }
    } else if (systolic < 180 || diastolic < 120) {
      return { label: t('tools.bloodPressureLog.highStage2'), color: 'text-red-600', bg: 'bg-red-50' }
    } else {
      return { label: t('tools.bloodPressureLog.crisis'), color: 'text-red-700', bg: 'bg-red-100' }
    }
  }

  const addEntry = () => {
    const sys = parseInt(newEntry.systolic)
    const dia = parseInt(newEntry.diastolic)
    if (isNaN(sys) || isNaN(dia)) return

    const entry: BPEntry = {
      id: Date.now(),
      systolic: sys,
      diastolic: dia,
      pulse: parseInt(newEntry.pulse) || 0,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: newEntry.notes,
    }
    setEntries([entry, ...entries])
    setNewEntry({ systolic: '', diastolic: '', pulse: '', notes: '' })
    setMode('list')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const last7Entries = entries.slice(0, 7)
  const avgSystolic = last7Entries.length > 0
    ? Math.round(last7Entries.reduce((sum, e) => sum + e.systolic, 0) / last7Entries.length)
    : 0
  const avgDiastolic = last7Entries.length > 0
    ? Math.round(last7Entries.reduce((sum, e) => sum + e.diastolic, 0) / last7Entries.length)
    : 0

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.bloodPressureLog.addReading')}
          </button>

          {entries.length > 0 && (
            <div className="card p-4 text-center">
              <div className="text-sm text-slate-600">{t('tools.bloodPressureLog.average')}</div>
              <div className="text-3xl font-bold text-slate-700">
                {avgSystolic}/{avgDiastolic}
              </div>
              <div className="text-sm text-slate-500">mmHg</div>
              <div className={`text-lg font-medium mt-1 ${getCategory(avgSystolic, avgDiastolic).color}`}>
                {getCategory(avgSystolic, avgDiastolic).label}
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.bloodPressureLog.categories')}</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between p-1 bg-blue-50 rounded">
                <span className="text-blue-600">{t('tools.bloodPressureLog.low')}</span>
                <span>&lt; 90/60</span>
              </div>
              <div className="flex justify-between p-1 bg-green-50 rounded">
                <span className="text-green-600">{t('tools.bloodPressureLog.normal')}</span>
                <span>&lt; 120/80</span>
              </div>
              <div className="flex justify-between p-1 bg-yellow-50 rounded">
                <span className="text-yellow-600">{t('tools.bloodPressureLog.elevated')}</span>
                <span>120-129 / &lt;80</span>
              </div>
              <div className="flex justify-between p-1 bg-orange-50 rounded">
                <span className="text-orange-600">{t('tools.bloodPressureLog.highStage1')}</span>
                <span>130-139 / 80-89</span>
              </div>
              <div className="flex justify-between p-1 bg-red-50 rounded">
                <span className="text-red-600">{t('tools.bloodPressureLog.highStage2')}</span>
                <span>≥140 / ≥90</span>
              </div>
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.bloodPressureLog.noReadings')}
            </div>
          ) : (
            <div className="space-y-2">
              {entries.slice(0, 20).map(entry => {
                const cat = getCategory(entry.systolic, entry.diastolic)
                return (
                  <div key={entry.id} className={`card p-4 ${cat.bg}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-2xl font-bold">
                          {entry.systolic}/{entry.diastolic}
                          {entry.pulse > 0 && <span className="text-sm font-normal text-slate-500 ml-2">♡ {entry.pulse}</span>}
                        </div>
                        <div className="text-xs text-slate-500">{entry.date} {entry.time}</div>
                        <div className={`text-sm font-medium ${cat.color}`}>{cat.label}</div>
                      </div>
                      <button onClick={() => deleteEntry(entry.id)} className="text-red-500">×</button>
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
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.bloodPressureLog.systolic')} *
              </label>
              <input
                type="number"
                value={newEntry.systolic}
                onChange={(e) => setNewEntry({ ...newEntry, systolic: e.target.value })}
                placeholder="120"
                className="w-full px-3 py-2 border border-slate-300 rounded text-lg text-center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.bloodPressureLog.diastolic')} *
              </label>
              <input
                type="number"
                value={newEntry.diastolic}
                onChange={(e) => setNewEntry({ ...newEntry, diastolic: e.target.value })}
                placeholder="80"
                className="w-full px-3 py-2 border border-slate-300 rounded text-lg text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.bloodPressureLog.pulse')}
            </label>
            <input
              type="number"
              value={newEntry.pulse}
              onChange={(e) => setNewEntry({ ...newEntry, pulse: e.target.value })}
              placeholder="72"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.bloodPressureLog.notes')}
            </label>
            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode('list')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button
              onClick={addEntry}
              disabled={!newEntry.systolic || !newEntry.diastolic}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.bloodPressureLog.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
