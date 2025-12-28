import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Appointment {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  contactName: string
  contactPhone: string
  category: string
  reminder: number
  notes: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export default function AppointmentScheduler() {
  const { t } = useTranslation()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'list'>('day')
  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    contactName: '',
    contactPhone: '',
    category: 'meeting',
    reminder: 30,
    notes: ''
  })

  const categories = ['meeting', 'appointment', 'call', 'personal', 'work', 'other']
  const reminders = [0, 15, 30, 60, 120, 1440]

  useEffect(() => {
    const saved = localStorage.getItem('appointment-scheduler')
    if (saved) setAppointments(JSON.parse(saved))
  }, [])

  const saveAppointments = (updated: Appointment[]) => {
    setAppointments(updated)
    localStorage.setItem('appointment-scheduler', JSON.stringify(updated))
  }

  const addAppointment = () => {
    if (!form.title || !form.date) return
    const appointment: Appointment = {
      id: editingId || Date.now().toString(),
      ...form,
      status: 'scheduled'
    }
    if (editingId) {
      saveAppointments(appointments.map(a => a.id === editingId ? appointment : a))
    } else {
      saveAppointments([...appointments, appointment])
    }
    resetForm()
  }

  const resetForm = () => {
    setForm({
      title: '',
      date: selectedDate,
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      contactName: '',
      contactPhone: '',
      category: 'meeting',
      reminder: 30,
      notes: ''
    })
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (appointment: Appointment) => {
    setForm({
      title: appointment.title,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      location: appointment.location,
      contactName: appointment.contactName,
      contactPhone: appointment.contactPhone,
      category: appointment.category,
      reminder: appointment.reminder,
      notes: appointment.notes
    })
    setEditingId(appointment.id)
    setShowForm(true)
  }

  const updateStatus = (id: string, status: Appointment['status']) => {
    saveAppointments(appointments.map(a => a.id === id ? { ...a, status } : a))
  }

  const deleteAppointment = (id: string) => {
    saveAppointments(appointments.filter(a => a.id !== id))
  }

  const getWeekDates = (date: string) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    const dates = []
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(d)
      newDate.setDate(diff + i)
      dates.push(newDate.toISOString().split('T')[0])
    }
    return dates
  }

  const filteredAppointments = useMemo(() => {
    let filtered = appointments.filter(a => a.status !== 'cancelled')
    if (viewMode === 'day') {
      filtered = filtered.filter(a => a.date === selectedDate)
    } else if (viewMode === 'week') {
      const weekDates = getWeekDates(selectedDate)
      filtered = filtered.filter(a => weekDates.includes(a.date))
    }
    return filtered.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.startTime.localeCompare(b.startTime)
    })
  }, [appointments, selectedDate, viewMode])

  const todayAppointments = appointments.filter(a =>
    a.date === new Date().toISOString().split('T')[0] && a.status === 'scheduled'
  ).length

  const upcomingAppointments = appointments.filter(a =>
    a.date >= new Date().toISOString().split('T')[0] && a.status === 'scheduled'
  ).length

  const categoryColors: Record<string, string> = {
    meeting: 'bg-blue-100 text-blue-700 border-blue-300',
    appointment: 'bg-green-100 text-green-700 border-green-300',
    call: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    personal: 'bg-purple-100 text-purple-700 border-purple-300',
    work: 'bg-orange-100 text-orange-700 border-orange-300',
    other: 'bg-slate-100 text-slate-700 border-slate-300'
  }

  const navigateDate = (direction: number) => {
    const d = new Date(selectedDate)
    if (viewMode === 'week') {
      d.setDate(d.getDate() + direction * 7)
    } else {
      d.setDate(d.getDate() + direction)
    }
    setSelectedDate(d.toISOString().split('T')[0])
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{todayAppointments}</div>
          <div className="text-xs text-slate-500">{t('tools.appointmentScheduler.today')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-green-600">{upcomingAppointments}</div>
          <div className="text-xs text-slate-500">{t('tools.appointmentScheduler.upcoming')}</div>
        </div>
      </div>

      <div className="flex gap-2">
        {(['day', 'week', 'list'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-2 rounded text-sm ${
              viewMode === mode ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.appointmentScheduler.${mode}`)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => navigateDate(-1)} className="px-3 py-2 bg-slate-100 rounded">←</button>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-300 rounded text-center"
        />
        <button onClick={() => navigateDate(1)} className="px-3 py-2 bg-slate-100 rounded">→</button>
        <button
          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          className="px-3 py-2 bg-slate-100 rounded text-sm"
        >
          {t('tools.appointmentScheduler.todayBtn')}
        </button>
        <button
          onClick={() => {
            setForm({ ...form, date: selectedDate })
            setShowForm(true)
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          +
        </button>
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={t('tools.appointmentScheduler.title')}
            className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(c => (
                <option key={c} value={c}>{t(`tools.appointmentScheduler.${c}`)}</option>
              ))}
            </select>
            <select
              value={form.reminder}
              onChange={(e) => setForm({ ...form, reminder: parseInt(e.target.value) })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {reminders.map(r => (
                <option key={r} value={r}>
                  {r === 0 ? t('tools.appointmentScheduler.noReminder') :
                   r < 60 ? `${r} min` :
                   r < 1440 ? `${r/60} hr` : '1 day'}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder={t('tools.appointmentScheduler.location')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              placeholder={t('tools.appointmentScheduler.contactName')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="tel"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              placeholder={t('tools.appointmentScheduler.contactPhone')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('tools.appointmentScheduler.notes')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={resetForm} className="py-2 bg-slate-100 rounded">
              {t('tools.appointmentScheduler.cancel')}
            </button>
            <button
              onClick={addAppointment}
              disabled={!form.title}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingId ? t('tools.appointmentScheduler.update') : t('tools.appointmentScheduler.add')}
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        {viewMode === 'week' && (
          <div className="grid grid-cols-7 gap-1 mb-4 text-center text-xs">
            {getWeekDates(selectedDate).map(date => {
              const d = new Date(date)
              const isToday = date === new Date().toISOString().split('T')[0]
              const hasAppointments = appointments.some(a => a.date === date)
              return (
                <div
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-2 rounded cursor-pointer ${
                    date === selectedDate ? 'bg-blue-500 text-white' :
                    isToday ? 'bg-blue-100' : 'bg-slate-50'
                  }`}
                >
                  <div>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]}</div>
                  <div className="font-medium">{d.getDate()}</div>
                  {hasAppointments && <div className="w-1 h-1 bg-current rounded-full mx-auto mt-1" />}
                </div>
              )
            })}
          </div>
        )}

        {filteredAppointments.length === 0 ? (
          <p className="text-center text-slate-500 py-8">{t('tools.appointmentScheduler.noAppointments')}</p>
        ) : (
          <div className="space-y-2">
            {filteredAppointments.map(appointment => (
              <div
                key={appointment.id}
                className={`p-3 rounded border-l-4 ${categoryColors[appointment.category]}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{appointment.title}</div>
                    <div className="text-xs mt-1">
                      {viewMode !== 'day' && <span className="mr-2">{appointment.date}</span>}
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => updateStatus(appointment.id, 'completed')}
                        className="text-green-500 text-xs"
                      >
                        ✓
                      </button>
                    )}
                    <button onClick={() => startEdit(appointment)} className="text-blue-500 text-xs">
                      {t('tools.appointmentScheduler.edit')}
                    </button>
                    <button onClick={() => deleteAppointment(appointment.id)} className="text-red-500 text-xs">
                      ×
                    </button>
                  </div>
                </div>
                {appointment.location && (
                  <div className="text-xs mt-1 text-slate-600">📍 {appointment.location}</div>
                )}
                {appointment.contactName && (
                  <div className="text-xs mt-1 text-slate-600">👤 {appointment.contactName}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
