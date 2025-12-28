import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Contact {
  id: number
  name: string
  email?: string
  phone?: string
  category: string
  birthday?: string
  notes?: string
  lastContact?: string
}

export default function ContactManager() {
  const { t } = useTranslation()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Personal',
    birthday: '',
    notes: '',
  })

  const categories = ['Personal', 'Work', 'Family', 'Friend', 'Business', 'Other']

  useEffect(() => {
    const saved = localStorage.getItem('contact-manager')
    if (saved) {
      try {
        setContacts(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load contacts')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('contact-manager', JSON.stringify(contacts))
  }, [contacts])

  const addContact = () => {
    if (!newContact.name) return
    const contact: Contact = {
      id: Date.now(),
      name: newContact.name,
      email: newContact.email || undefined,
      phone: newContact.phone || undefined,
      category: newContact.category,
      birthday: newContact.birthday || undefined,
      notes: newContact.notes || undefined,
    }
    setContacts([...contacts, contact])
    setNewContact({ name: '', email: '', phone: '', category: 'Personal', birthday: '', notes: '' })
    setShowAdd(false)
  }

  const deleteContact = (id: number) => {
    setContacts(contacts.filter(c => c.id !== id))
  }

  const markContacted = (id: number) => {
    setContacts(contacts.map(c =>
      c.id === id ? { ...c, lastContact: new Date().toISOString().split('T')[0] } : c
    ))
  }

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = !searchQuery ||
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone?.includes(searchQuery)

      const matchesCategory = filterCategory === 'all' || contact.category === filterCategory

      return matchesSearch && matchesCategory
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [contacts, searchQuery, filterCategory])

  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {}
    contacts.forEach(c => {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1
    })

    const needsContact = contacts.filter(c => {
      if (!c.lastContact) return true
      const last = new Date(c.lastContact)
      const daysSince = Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24))
      return daysSince > 30
    }).length

    return { total: contacts.length, byCategory, needsContact }
  }, [contacts])

  const getDaysSinceContact = (lastContact?: string) => {
    if (!lastContact) return null
    const last = new Date(lastContact)
    return Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-slate-500">{t('tools.contacts.total')}</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{stats.needsContact}</div>
            <div className="text-xs text-slate-500">{t('tools.contacts.needsContact')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{Object.keys(stats.byCategory).length}</div>
            <div className="text-xs text-slate-500">{t('tools.contacts.categories')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('tools.contacts.search')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="all">{t('tools.contacts.all')}</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          + {t('tools.contacts.addContact')}
        </button>
      </div>

      {showAdd && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.contacts.newContact')}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              placeholder={t('tools.contacts.name')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                placeholder={t('tools.contacts.email')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder={t('tools.contacts.phone')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newContact.category}
                onChange={(e) => setNewContact({ ...newContact, category: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="date"
                value={newContact.birthday}
                onChange={(e) => setNewContact({ ...newContact, birthday: e.target.value })}
                placeholder={t('tools.contacts.birthday')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <input
              type="text"
              value={newContact.notes}
              onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
              placeholder={t('tools.contacts.notes')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={addContact}
                className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.contacts.add')}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.contacts.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredContacts.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          {t('tools.contacts.noContacts')}
        </div>
      ) : (
        <div className="card p-4">
          <div className="space-y-2">
            {filteredContacts.map(contact => {
              const daysSince = getDaysSinceContact(contact.lastContact)
              const needsReach = daysSince === null || daysSince > 30

              return (
                <div key={contact.id} className="p-3 bg-slate-50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-slate-500">
                        {contact.category}
                        {contact.email && ` • ${contact.email}`}
                      </div>
                      {contact.phone && (
                        <div className="text-sm text-slate-500">{contact.phone}</div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>

                  {contact.notes && (
                    <p className="text-sm text-slate-600 mb-2">{contact.notes}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${needsReach ? 'text-yellow-600' : 'text-green-600'}`}>
                      {daysSince === null
                        ? t('tools.contacts.neverContacted')
                        : `${daysSince} ${t('tools.contacts.daysAgo')}`}
                    </span>
                    <button
                      onClick={() => markContacted(contact.id)}
                      className="px-3 py-1 bg-green-100 text-green-600 rounded text-sm hover:bg-green-200"
                    >
                      {t('tools.contacts.markContacted')}
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
          {t('tools.contacts.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.contacts.tip1')}</li>
          <li>{t('tools.contacts.tip2')}</li>
          <li>{t('tools.contacts.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
