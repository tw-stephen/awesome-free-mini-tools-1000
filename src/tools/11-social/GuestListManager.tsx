import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type RSVPStatus = 'pending' | 'confirmed' | 'declined' | 'maybe'

interface Guest {
  id: string
  name: string
  email: string
  phone: string
  rsvp: RSVPStatus
  plusOne: boolean
  dietaryRestrictions: string
  notes: string
}

export default function GuestListManager() {
  const { t } = useTranslation()
  const [guests, setGuests] = useState<Guest[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<RSVPStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    rsvp: 'pending' as RSVPStatus,
    plusOne: false,
    dietaryRestrictions: '',
    notes: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('guest-list')
    if (saved) setGuests(JSON.parse(saved))
  }, [])

  const saveGuests = (updated: Guest[]) => {
    setGuests(updated)
    localStorage.setItem('guest-list', JSON.stringify(updated))
  }

  const addGuest = () => {
    if (!form.name) return

    const newGuest: Guest = {
      id: Date.now().toString(),
      ...form
    }

    saveGuests([...guests, newGuest])
    setForm({
      name: '',
      email: '',
      phone: '',
      rsvp: 'pending',
      plusOne: false,
      dietaryRestrictions: '',
      notes: ''
    })
    setShowForm(false)
  }

  const updateGuest = () => {
    if (!editingGuest) return

    const updated = guests.map(g =>
      g.id === editingGuest.id ? { ...editingGuest, ...form } : g
    )
    saveGuests(updated)
    setEditingGuest(null)
    setForm({
      name: '',
      email: '',
      phone: '',
      rsvp: 'pending',
      plusOne: false,
      dietaryRestrictions: '',
      notes: ''
    })
  }

  const deleteGuest = (id: string) => {
    saveGuests(guests.filter(g => g.id !== id))
  }

  const startEdit = (guest: Guest) => {
    setEditingGuest(guest)
    setForm({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      rsvp: guest.rsvp,
      plusOne: guest.plusOne,
      dietaryRestrictions: guest.dietaryRestrictions,
      notes: guest.notes
    })
  }

  const updateRSVP = (id: string, rsvp: RSVPStatus) => {
    const updated = guests.map(g => g.id === id ? { ...g, rsvp } : g)
    saveGuests(updated)
  }

  const filteredGuests = guests.filter(g => {
    const matchesFilter = filter === 'all' || g.rsvp === filter
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.rsvp === 'confirmed').length,
    declined: guests.filter(g => g.rsvp === 'declined').length,
    pending: guests.filter(g => g.rsvp === 'pending').length,
    maybe: guests.filter(g => g.rsvp === 'maybe').length,
    plusOnes: guests.filter(g => g.plusOne && g.rsvp === 'confirmed').length
  }

  const rsvpColors: Record<RSVPStatus, string> = {
    confirmed: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    maybe: 'bg-blue-100 text-blue-700'
  }

  const exportList = () => {
    const csv = [
      'Name,Email,Phone,RSVP,Plus One,Dietary Restrictions,Notes',
      ...guests.map(g =>
        `"${g.name}","${g.email}","${g.phone}","${g.rsvp}","${g.plusOne ? 'Yes' : 'No'}","${g.dietaryRestrictions}","${g.notes}"`
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'guest-list.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-xs text-slate-500">{t('tools.guestListManager.totalGuests')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          <div className="text-xs text-slate-500">{t('tools.guestListManager.confirmed')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-slate-500">{t('tools.guestListManager.pending')}</div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('tools.guestListManager.search')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm"
          >
            + {t('tools.guestListManager.addGuest')}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'confirmed', 'pending', 'maybe', 'declined'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded text-sm ${
                filter === status ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.guestListManager.${status}`)}
            </button>
          ))}
        </div>
      </div>

      {(showForm || editingGuest) && (
        <div className="card p-4 space-y-3">
          <h3 className="font-medium">
            {editingGuest ? t('tools.guestListManager.editGuest') : t('tools.guestListManager.addGuest')}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('tools.guestListManager.name')}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t('tools.guestListManager.email')}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder={t('tools.guestListManager.phone')}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <select
              value={form.rsvp}
              onChange={(e) => setForm({ ...form, rsvp: e.target.value as RSVPStatus })}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="pending">{t('tools.guestListManager.pending')}</option>
              <option value="confirmed">{t('tools.guestListManager.confirmed')}</option>
              <option value="maybe">{t('tools.guestListManager.maybe')}</option>
              <option value="declined">{t('tools.guestListManager.declined')}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.plusOne}
              onChange={(e) => setForm({ ...form, plusOne: e.target.checked })}
              id="plusOne"
            />
            <label htmlFor="plusOne" className="text-sm">{t('tools.guestListManager.plusOne')}</label>
          </div>

          <input
            type="text"
            value={form.dietaryRestrictions}
            onChange={(e) => setForm({ ...form, dietaryRestrictions: e.target.value })}
            placeholder={t('tools.guestListManager.dietaryRestrictions')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />

          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('tools.guestListManager.notes')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
            rows={2}
          />

          <div className="flex gap-2">
            <button
              onClick={() => { setShowForm(false); setEditingGuest(null) }}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('tools.guestListManager.cancel')}
            </button>
            <button
              onClick={editingGuest ? updateGuest : addGuest}
              disabled={!form.name}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingGuest ? t('tools.guestListManager.save') : t('tools.guestListManager.add')}
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        {filteredGuests.length === 0 ? (
          <p className="text-center text-slate-500 py-4">
            {t('tools.guestListManager.noGuests')}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredGuests.map(guest => (
              <div key={guest.id} className="p-3 bg-slate-50 rounded flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {guest.name}
                    {guest.plusOne && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 rounded">+1</span>}
                  </div>
                  <div className="text-xs text-slate-500">{guest.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={guest.rsvp}
                    onChange={(e) => updateRSVP(guest.id, e.target.value as RSVPStatus)}
                    className={`px-2 py-1 rounded text-xs ${rsvpColors[guest.rsvp]}`}
                  >
                    <option value="pending">{t('tools.guestListManager.pending')}</option>
                    <option value="confirmed">{t('tools.guestListManager.confirmed')}</option>
                    <option value="maybe">{t('tools.guestListManager.maybe')}</option>
                    <option value="declined">{t('tools.guestListManager.declined')}</option>
                  </select>
                  <button
                    onClick={() => startEdit(guest)}
                    className="text-blue-500 text-sm"
                  >
                    {t('tools.guestListManager.edit')}
                  </button>
                  <button
                    onClick={() => deleteGuest(guest.id)}
                    className="text-red-500 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {guests.length > 0 && (
        <button
          onClick={exportList}
          className="w-full py-2 bg-slate-100 text-slate-700 rounded"
        >
          {t('tools.guestListManager.exportCSV')}
        </button>
      )}
    </div>
  )
}
