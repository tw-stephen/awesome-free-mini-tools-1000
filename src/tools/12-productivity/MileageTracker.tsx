import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface MileageEntry {
  id: string
  date: string
  startOdometer: number
  endOdometer: number
  distance: number
  purpose: string
  destination: string
  vehicle: string
  category: 'business' | 'personal' | 'medical' | 'charity'
  notes: string
}

interface Vehicle {
  id: string
  name: string
  currentOdometer: number
}

export default function MileageTracker() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<MileageEntry[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([{ id: '1', name: 'Default Vehicle', currentOdometer: 0 }])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState('1')
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7))
  const [ratePerMile, setRatePerMile] = useState(0.67)
  const [form, setForm] = useState<{
    date: string
    startOdometer: number
    endOdometer: number
    purpose: string
    destination: string
    vehicle: string
    category: 'business' | 'personal' | 'medical' | 'charity'
    notes: string
  }>({
    date: new Date().toISOString().split('T')[0],
    startOdometer: 0,
    endOdometer: 0,
    purpose: '',
    destination: '',
    vehicle: '1',
    category: 'business',
    notes: ''
  })

  useEffect(() => {
    const savedEntries = localStorage.getItem('mileage-entries')
    const savedVehicles = localStorage.getItem('mileage-vehicles')
    const savedRate = localStorage.getItem('mileage-rate')
    if (savedEntries) setEntries(JSON.parse(savedEntries))
    if (savedVehicles) setVehicles(JSON.parse(savedVehicles))
    if (savedRate) setRatePerMile(parseFloat(savedRate))
  }, [])

  const saveEntries = (updated: MileageEntry[]) => {
    setEntries(updated)
    localStorage.setItem('mileage-entries', JSON.stringify(updated))
  }

  const saveVehicles = (updated: Vehicle[]) => {
    setVehicles(updated)
    localStorage.setItem('mileage-vehicles', JSON.stringify(updated))
  }

  const addEntry = () => {
    if (!form.purpose) return
    const distance = form.endOdometer - form.startOdometer
    if (distance <= 0) return

    const entry: MileageEntry = {
      id: editingId || Date.now().toString(),
      ...form,
      distance
    }

    if (editingId) {
      saveEntries(entries.map(e => e.id === editingId ? entry : e))
    } else {
      saveEntries([entry, ...entries])
      // Update vehicle odometer
      saveVehicles(vehicles.map(v =>
        v.id === form.vehicle ? { ...v, currentOdometer: form.endOdometer } : v
      ))
    }
    resetForm()
  }

  const resetForm = () => {
    const vehicle = vehicles.find(v => v.id === selectedVehicle)
    setForm({
      date: new Date().toISOString().split('T')[0],
      startOdometer: vehicle?.currentOdometer || 0,
      endOdometer: vehicle?.currentOdometer || 0,
      purpose: '',
      destination: '',
      vehicle: selectedVehicle,
      category: 'business',
      notes: ''
    })
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (entry: MileageEntry) => {
    setForm({
      date: entry.date,
      startOdometer: entry.startOdometer,
      endOdometer: entry.endOdometer,
      purpose: entry.purpose,
      destination: entry.destination,
      vehicle: entry.vehicle,
      category: entry.category,
      notes: entry.notes
    })
    setEditingId(entry.id)
    setShowForm(true)
  }

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id))
  }

  const addVehicle = () => {
    const name = prompt(t('tools.mileageTracker.vehicleName'))
    if (!name) return
    const vehicle: Vehicle = {
      id: Date.now().toString(),
      name,
      currentOdometer: 0
    }
    saveVehicles([...vehicles, vehicle])
  }

  const filteredEntries = useMemo(() => {
    let filtered = entries
    if (selectedVehicle !== 'all') {
      filtered = filtered.filter(e => e.vehicle === selectedVehicle)
    }
    if (filterMonth) {
      filtered = filtered.filter(e => e.date.startsWith(filterMonth))
    }
    return filtered.sort((a, b) => b.date.localeCompare(a.date))
  }, [entries, selectedVehicle, filterMonth])

  const stats = useMemo(() => {
    const filtered = filteredEntries
    const totalMiles = filtered.reduce((sum, e) => sum + e.distance, 0)
    const businessMiles = filtered.filter(e => e.category === 'business').reduce((sum, e) => sum + e.distance, 0)
    const deduction = businessMiles * ratePerMile
    return { totalMiles, businessMiles, deduction, trips: filtered.length }
  }, [filteredEntries, ratePerMile])

  const categoryColors: Record<string, string> = {
    business: 'bg-blue-100 text-blue-700',
    personal: 'bg-green-100 text-green-700',
    medical: 'bg-red-100 text-red-700',
    charity: 'bg-purple-100 text-purple-700'
  }

  const exportCSV = () => {
    const headers = ['Date', 'Vehicle', 'Start', 'End', 'Distance', 'Purpose', 'Destination', 'Category']
    const rows = filteredEntries.map(e => {
      const vehicle = vehicles.find(v => v.id === e.vehicle)
      return [e.date, vehicle?.name || '', e.startOdometer, e.endOdometer, e.distance, e.purpose, e.destination, e.category]
    })
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mileage-${filterMonth}.csv`
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{stats.trips}</div>
          <div className="text-xs text-slate-500">{t('tools.mileageTracker.trips')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-green-600">{stats.totalMiles.toFixed(1)}</div>
          <div className="text-xs text-slate-500">{t('tools.mileageTracker.totalMiles')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-purple-600">{stats.businessMiles.toFixed(1)}</div>
          <div className="text-xs text-slate-500">{t('tools.mileageTracker.businessMiles')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-orange-600">${stats.deduction.toFixed(2)}</div>
          <div className="text-xs text-slate-500">{t('tools.mileageTracker.deduction')}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-300 rounded"
        >
          <option value="all">{t('tools.mileageTracker.allVehicles')}</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <button onClick={addVehicle} className="px-3 py-2 bg-slate-100 rounded text-sm">
          + {t('tools.mileageTracker.vehicle')}
        </button>
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded"
        />
        <button
          onClick={() => {
            const vehicle = vehicles.find(v => v.id === selectedVehicle) || vehicles[0]
            setForm({
              ...form,
              vehicle: vehicle?.id || '1',
              startOdometer: vehicle?.currentOdometer || 0,
              endOdometer: vehicle?.currentOdometer || 0
            })
            setShowForm(true)
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          +
        </button>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-slate-600">{t('tools.mileageTracker.ratePerMile')}:</span>
          <input
            type="number"
            value={ratePerMile}
            onChange={(e) => {
              const rate = parseFloat(e.target.value) || 0
              setRatePerMile(rate)
              localStorage.setItem('mileage-rate', rate.toString())
            }}
            step="0.01"
            min="0"
            className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
          />
          <span className="text-xs text-slate-500">(IRS 2024: $0.67)</span>
        </div>
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <select
              value={form.vehicle}
              onChange={(e) => {
                const vehicle = vehicles.find(v => v.id === e.target.value)
                setForm({
                  ...form,
                  vehicle: e.target.value,
                  startOdometer: vehicle?.currentOdometer || 0
                })
              }}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('tools.mileageTracker.startOdometer')}</label>
              <input
                type="number"
                value={form.startOdometer}
                onChange={(e) => setForm({ ...form, startOdometer: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('tools.mileageTracker.endOdometer')}</label>
              <input
                type="number"
                value={form.endOdometer}
                onChange={(e) => setForm({ ...form, endOdometer: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('tools.mileageTracker.distance')}</label>
              <div className="px-3 py-2 bg-slate-100 rounded font-medium">
                {(form.endOdometer - form.startOdometer).toFixed(1)} mi
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              placeholder={t('tools.mileageTracker.purpose')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              placeholder={t('tools.mileageTracker.destination')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as MileageEntry['category'] })}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          >
            {Object.keys(categoryColors).map(c => (
              <option key={c} value={c}>{t(`tools.mileageTracker.${c}`)}</option>
            ))}
          </select>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('tools.mileageTracker.notes')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={resetForm} className="py-2 bg-slate-100 rounded">
              {t('tools.mileageTracker.cancel')}
            </button>
            <button
              onClick={addEntry}
              disabled={!form.purpose || form.endOdometer <= form.startOdometer}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingId ? t('tools.mileageTracker.update') : t('tools.mileageTracker.add')}
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        {filteredEntries.length === 0 ? (
          <p className="text-center text-slate-500 py-8">{t('tools.mileageTracker.noEntries')}</p>
        ) : (
          <div className="space-y-2">
            {filteredEntries.map(entry => {
              const vehicle = vehicles.find(v => v.id === entry.vehicle)
              return (
                <div key={entry.id} className="p-3 bg-slate-50 rounded">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{entry.purpose}</div>
                      <div className="text-xs text-slate-500">
                        {entry.date} • {vehicle?.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{entry.distance.toFixed(1)} mi</div>
                      <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[entry.category]}`}>
                        {entry.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 mb-2">
                    {entry.startOdometer.toLocaleString()} → {entry.endOdometer.toLocaleString()}
                    {entry.destination && ` • ${entry.destination}`}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(entry)} className="text-blue-500 text-xs">
                      {t('tools.mileageTracker.edit')}
                    </button>
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-500 text-xs">
                      {t('tools.mileageTracker.delete')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <button onClick={exportCSV} className="w-full py-2 bg-slate-100 rounded text-sm">
        {t('tools.mileageTracker.export')}
      </button>
    </div>
  )
}
