import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface MaintenanceRecord {
  id: string
  vehicleId: string
  date: string
  odometer: number
  type: string
  description: string
  cost: number
  location: string
  notes: string
}

interface Vehicle {
  id: string
  name: string
  make: string
  model: string
  year: number
  currentOdometer: number
  vin: string
  licensePlate: string
}

interface MaintenanceSchedule {
  type: string
  intervalMiles: number
  intervalMonths: number
}

export default function VehicleMaintenanceLog() {
  const { t } = useTranslation()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [records, setRecords] = useState<MaintenanceRecord[]>([])
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)

  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    currentOdometer: 0,
    vin: '',
    licensePlate: ''
  })

  const [recordForm, setRecordForm] = useState({
    date: new Date().toISOString().split('T')[0],
    odometer: 0,
    type: 'oil_change',
    description: '',
    cost: 0,
    location: '',
    notes: ''
  })

  const maintenanceTypes = [
    'oil_change',
    'tire_rotation',
    'brake_service',
    'air_filter',
    'transmission',
    'coolant',
    'battery',
    'spark_plugs',
    'inspection',
    'other'
  ]

  const schedules: MaintenanceSchedule[] = [
    { type: 'oil_change', intervalMiles: 5000, intervalMonths: 6 },
    { type: 'tire_rotation', intervalMiles: 7500, intervalMonths: 6 },
    { type: 'air_filter', intervalMiles: 15000, intervalMonths: 12 },
    { type: 'brake_service', intervalMiles: 30000, intervalMonths: 24 },
    { type: 'transmission', intervalMiles: 60000, intervalMonths: 48 },
    { type: 'coolant', intervalMiles: 30000, intervalMonths: 24 },
    { type: 'spark_plugs', intervalMiles: 60000, intervalMonths: 48 }
  ]

  useEffect(() => {
    const savedVehicles = localStorage.getItem('maintenance-vehicles')
    const savedRecords = localStorage.getItem('maintenance-records')
    if (savedVehicles) {
      const parsed = JSON.parse(savedVehicles)
      setVehicles(parsed)
      if (parsed.length > 0) setSelectedVehicle(parsed[0].id)
    }
    if (savedRecords) setRecords(JSON.parse(savedRecords))
  }, [])

  const saveVehicles = (updated: Vehicle[]) => {
    setVehicles(updated)
    localStorage.setItem('maintenance-vehicles', JSON.stringify(updated))
  }

  const saveRecords = (updated: MaintenanceRecord[]) => {
    setRecords(updated)
    localStorage.setItem('maintenance-records', JSON.stringify(updated))
  }

  const addVehicle = () => {
    if (!vehicleForm.name) return
    const vehicle: Vehicle = {
      id: Date.now().toString(),
      ...vehicleForm
    }
    saveVehicles([...vehicles, vehicle])
    setVehicleForm({ name: '', make: '', model: '', year: new Date().getFullYear(), currentOdometer: 0, vin: '', licensePlate: '' })
    setShowVehicleForm(false)
    if (!selectedVehicle) setSelectedVehicle(vehicle.id)
  }

  const deleteVehicle = (id: string) => {
    saveVehicles(vehicles.filter(v => v.id !== id))
    saveRecords(records.filter(r => r.vehicleId !== id))
    if (selectedVehicle === id) {
      setSelectedVehicle(vehicles.find(v => v.id !== id)?.id || null)
    }
  }

  const addRecord = () => {
    if (!selectedVehicle || !recordForm.type) return
    const record: MaintenanceRecord = {
      id: editingRecordId || Date.now().toString(),
      vehicleId: selectedVehicle,
      ...recordForm
    }
    if (editingRecordId) {
      saveRecords(records.map(r => r.id === editingRecordId ? record : r))
    } else {
      saveRecords([record, ...records])
      // Update vehicle odometer
      if (recordForm.odometer > 0) {
        saveVehicles(vehicles.map(v =>
          v.id === selectedVehicle && recordForm.odometer > v.currentOdometer
            ? { ...v, currentOdometer: recordForm.odometer }
            : v
        ))
      }
    }
    setRecordForm({ date: new Date().toISOString().split('T')[0], odometer: 0, type: 'oil_change', description: '', cost: 0, location: '', notes: '' })
    setShowRecordForm(false)
    setEditingRecordId(null)
  }

  const startEditRecord = (record: MaintenanceRecord) => {
    setRecordForm({
      date: record.date,
      odometer: record.odometer,
      type: record.type,
      description: record.description,
      cost: record.cost,
      location: record.location,
      notes: record.notes
    })
    setEditingRecordId(record.id)
    setShowRecordForm(true)
  }

  const deleteRecord = (id: string) => {
    saveRecords(records.filter(r => r.id !== id))
  }

  const vehicleRecords = useMemo(() => {
    if (!selectedVehicle) return []
    return records
      .filter(r => r.vehicleId === selectedVehicle)
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [records, selectedVehicle])

  const currentVehicle = vehicles.find(v => v.id === selectedVehicle)

  const getUpcomingMaintenance = () => {
    if (!currentVehicle) return []
    const upcoming: { type: string; reason: string; priority: 'high' | 'medium' | 'low' }[] = []

    schedules.forEach(schedule => {
      const lastRecord = vehicleRecords.find(r => r.type === schedule.type)
      if (!lastRecord) {
        upcoming.push({ type: schedule.type, reason: 'Never done', priority: 'high' })
        return
      }

      const milesSince = currentVehicle.currentOdometer - lastRecord.odometer
      const daysSince = Math.floor((Date.now() - new Date(lastRecord.date).getTime()) / (1000 * 60 * 60 * 24))
      const monthsSince = daysSince / 30

      if (milesSince >= schedule.intervalMiles || monthsSince >= schedule.intervalMonths) {
        upcoming.push({ type: schedule.type, reason: 'Overdue', priority: 'high' })
      } else if (milesSince >= schedule.intervalMiles * 0.9 || monthsSince >= schedule.intervalMonths * 0.9) {
        upcoming.push({ type: schedule.type, reason: 'Due soon', priority: 'medium' })
      }
    })

    return upcoming
  }

  const upcomingMaintenance = getUpcomingMaintenance()

  const totalCost = vehicleRecords.reduce((sum, r) => sum + r.cost, 0)

  const typeColors: Record<string, string> = {
    oil_change: 'bg-yellow-100 text-yellow-700',
    tire_rotation: 'bg-blue-100 text-blue-700',
    brake_service: 'bg-red-100 text-red-700',
    air_filter: 'bg-green-100 text-green-700',
    transmission: 'bg-purple-100 text-purple-700',
    coolant: 'bg-cyan-100 text-cyan-700',
    battery: 'bg-orange-100 text-orange-700',
    spark_plugs: 'bg-pink-100 text-pink-700',
    inspection: 'bg-indigo-100 text-indigo-700',
    other: 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          value={selectedVehicle || ''}
          onChange={(e) => setSelectedVehicle(e.target.value || null)}
          className="flex-1 px-3 py-2 border border-slate-300 rounded"
        >
          {vehicles.length === 0 && <option value="">{t('tools.vehicleMaintenanceLog.noVehicles')}</option>}
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.name} ({v.year} {v.make} {v.model})</option>
          ))}
        </select>
        <button
          onClick={() => setShowVehicleForm(!showVehicleForm)}
          className="px-3 py-2 bg-slate-100 rounded text-sm"
        >
          + {t('tools.vehicleMaintenanceLog.vehicle')}
        </button>
      </div>

      {showVehicleForm && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={vehicleForm.name}
              onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
              placeholder={t('tools.vehicleMaintenanceLog.vehicleName')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="number"
              value={vehicleForm.year}
              onChange={(e) => setVehicleForm({ ...vehicleForm, year: parseInt(e.target.value) || 2024 })}
              placeholder={t('tools.vehicleMaintenanceLog.year')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={vehicleForm.make}
              onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
              placeholder={t('tools.vehicleMaintenanceLog.make')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={vehicleForm.model}
              onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
              placeholder={t('tools.vehicleMaintenanceLog.model')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={vehicleForm.currentOdometer || ''}
              onChange={(e) => setVehicleForm({ ...vehicleForm, currentOdometer: parseFloat(e.target.value) || 0 })}
              placeholder={t('tools.vehicleMaintenanceLog.odometer')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={vehicleForm.vin}
              onChange={(e) => setVehicleForm({ ...vehicleForm, vin: e.target.value })}
              placeholder="VIN"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={vehicleForm.licensePlate}
              onChange={(e) => setVehicleForm({ ...vehicleForm, licensePlate: e.target.value })}
              placeholder={t('tools.vehicleMaintenanceLog.licensePlate')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <button
            onClick={addVehicle}
            disabled={!vehicleForm.name}
            className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {t('tools.vehicleMaintenanceLog.addVehicle')}
          </button>
        </div>
      )}

      {currentVehicle && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{currentVehicle.currentOdometer.toLocaleString()}</div>
              <div className="text-xs text-slate-500">{t('tools.vehicleMaintenanceLog.currentMiles')}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-green-600">{vehicleRecords.length}</div>
              <div className="text-xs text-slate-500">{t('tools.vehicleMaintenanceLog.totalRecords')}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-orange-600">${totalCost.toFixed(0)}</div>
              <div className="text-xs text-slate-500">{t('tools.vehicleMaintenanceLog.totalCost')}</div>
            </div>
          </div>

          {upcomingMaintenance.length > 0 && (
            <div className="card p-4 bg-yellow-50">
              <h3 className="font-medium text-slate-700 mb-2">{t('tools.vehicleMaintenanceLog.upcomingMaintenance')}</h3>
              <div className="space-y-1">
                {upcomingMaintenance.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-0.5 rounded ${typeColors[item.type]}`}>
                      {t(`tools.vehicleMaintenanceLog.${item.type}`)}
                    </span>
                    <span className={`text-xs ${item.priority === 'high' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {item.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setRecordForm({ ...recordForm, odometer: currentVehicle.currentOdometer })
              setShowRecordForm(true)
            }}
            className="w-full py-2 bg-blue-500 text-white rounded"
          >
            + {t('tools.vehicleMaintenanceLog.addRecord')}
          </button>

          {showRecordForm && (
            <div className="card p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={recordForm.date}
                  onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded"
                />
                <input
                  type="number"
                  value={recordForm.odometer || ''}
                  onChange={(e) => setRecordForm({ ...recordForm, odometer: parseFloat(e.target.value) || 0 })}
                  placeholder={t('tools.vehicleMaintenanceLog.odometer')}
                  className="px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={recordForm.type}
                  onChange={(e) => setRecordForm({ ...recordForm, type: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded"
                >
                  {maintenanceTypes.map(t => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={recordForm.cost || ''}
                  onChange={(e) => setRecordForm({ ...recordForm, cost: parseFloat(e.target.value) || 0 })}
                  placeholder={t('tools.vehicleMaintenanceLog.cost')}
                  className="px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <input
                type="text"
                value={recordForm.description}
                onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })}
                placeholder={t('tools.vehicleMaintenanceLog.description')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                value={recordForm.location}
                onChange={(e) => setRecordForm({ ...recordForm, location: e.target.value })}
                placeholder={t('tools.vehicleMaintenanceLog.location')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <textarea
                value={recordForm.notes}
                onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                placeholder={t('tools.vehicleMaintenanceLog.notes')}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setShowRecordForm(false)
                    setEditingRecordId(null)
                  }}
                  className="py-2 bg-slate-100 rounded"
                >
                  {t('tools.vehicleMaintenanceLog.cancel')}
                </button>
                <button onClick={addRecord} className="py-2 bg-blue-500 text-white rounded">
                  {editingRecordId ? t('tools.vehicleMaintenanceLog.update') : t('tools.vehicleMaintenanceLog.save')}
                </button>
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="font-medium text-slate-700 mb-3">{t('tools.vehicleMaintenanceLog.history')}</h3>
            {vehicleRecords.length === 0 ? (
              <p className="text-center text-slate-500 py-4">{t('tools.vehicleMaintenanceLog.noRecords')}</p>
            ) : (
              <div className="space-y-2">
                {vehicleRecords.map(record => (
                  <div key={record.id} className="p-3 bg-slate-50 rounded">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className={`text-xs px-2 py-0.5 rounded ${typeColors[record.type]}`}>
                          {record.type.replace(/_/g, ' ')}
                        </span>
                        <div className="font-medium mt-1">{record.description || record.type.replace(/_/g, ' ')}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">${record.cost.toFixed(2)}</div>
                        <div className="text-xs text-slate-500">{record.odometer.toLocaleString()} mi</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mb-2">
                      {record.date} {record.location && `• ${record.location}`}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditRecord(record)} className="text-blue-500 text-xs">
                        {t('tools.vehicleMaintenanceLog.edit')}
                      </button>
                      <button onClick={() => deleteRecord(record.id)} className="text-red-500 text-xs">
                        {t('tools.vehicleMaintenanceLog.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
