import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  category: string
  notes: string
  lastContact: string
  createdAt: string
}

export default function ClientDirectory() {
  const { t } = useTranslation()
  const [clients, setClients] = useState<Client[]>([])
  const [categories, setCategories] = useState<string[]>(['Active', 'Potential', 'Past'])
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    category: 'Active',
    notes: '',
    lastContact: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('client-directory')
    const savedCategories = localStorage.getItem('client-categories')
    if (saved) setClients(JSON.parse(saved))
    if (savedCategories) setCategories(JSON.parse(savedCategories))
  }, [])

  const saveClients = (updated: Client[]) => {
    setClients(updated)
    localStorage.setItem('client-directory', JSON.stringify(updated))
  }

  const saveCategories = (updated: string[]) => {
    setCategories(updated)
    localStorage.setItem('client-categories', JSON.stringify(updated))
  }

  const addClient = () => {
    if (!form.name) return
    const client: Client = {
      id: editingId || Date.now().toString(),
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      address: form.address,
      category: form.category,
      notes: form.notes,
      lastContact: form.lastContact,
      createdAt: new Date().toISOString()
    }

    if (editingId) {
      saveClients(clients.map(c => c.id === editingId ? client : c))
    } else {
      saveClients([client, ...clients])
    }

    resetForm()
  }

  const resetForm = () => {
    setForm({ name: '', company: '', email: '', phone: '', address: '', category: 'Active', notes: '', lastContact: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (client: Client) => {
    setForm({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      address: client.address,
      category: client.category,
      notes: client.notes,
      lastContact: client.lastContact
    })
    setEditingId(client.id)
    setShowForm(true)
  }

  const deleteClient = (id: string) => {
    saveClients(clients.filter(c => c.id !== id))
    if (selectedClient?.id === id) setSelectedClient(null)
  }

  const addCategory = () => {
    const name = prompt(t('tools.clientDirectory.categoryName'))
    if (name && !categories.includes(name)) {
      saveCategories([...categories, name])
    }
  }

  const filteredClients = useMemo(() => {
    let filtered = clients

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.company.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      )
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(c => c.category === filterCategory)
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [clients, searchQuery, filterCategory])

  const categoryColors: Record<string, string> = {
    Active: 'bg-green-100 text-green-700',
    Potential: 'bg-blue-100 text-blue-700',
    Past: 'bg-slate-100 text-slate-700'
  }

  const exportCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Address', 'Category', 'Last Contact', 'Notes']
    const rows = clients.map(c => [c.name, c.company, c.email, c.phone, c.address, c.category, c.lastContact, c.notes])
    const csv = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'clients.csv'
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {categories.map(cat => {
          const count = clients.filter(c => c.category === cat).length
          return (
            <div key={cat} className={`card p-3 text-center ${categoryColors[cat] || 'bg-slate-100'}`}>
              <div className="text-xl font-bold">{count}</div>
              <div className="text-xs">{cat}</div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('tools.clientDirectory.search')}
          className="flex-1 px-3 py-2 border border-slate-300 rounded"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          +
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-300 rounded"
        >
          <option value="all">{t('tools.clientDirectory.allCategories')}</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={addCategory} className="px-3 py-2 bg-slate-100 rounded text-sm">
          + {t('tools.clientDirectory.category')}
        </button>
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('tools.clientDirectory.name')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder={t('tools.clientDirectory.company')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t('tools.clientDirectory.email')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder={t('tools.clientDirectory.phone')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder={t('tools.clientDirectory.address')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="date"
              value={form.lastContact}
              onChange={(e) => setForm({ ...form, lastContact: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('tools.clientDirectory.notes')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={resetForm} className="py-2 bg-slate-100 rounded">
              {t('tools.clientDirectory.cancel')}
            </button>
            <button
              onClick={addClient}
              disabled={!form.name}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingId ? t('tools.clientDirectory.update') : t('tools.clientDirectory.add')}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4 max-h-[400px] overflow-y-auto">
          <h3 className="font-medium text-slate-700 mb-3">
            {t('tools.clientDirectory.clients')} ({filteredClients.length})
          </h3>
          {filteredClients.length === 0 ? (
            <p className="text-center text-slate-500 py-4">{t('tools.clientDirectory.noClients')}</p>
          ) : (
            <div className="space-y-2">
              {filteredClients.map(client => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-2 rounded cursor-pointer ${
                    selectedClient?.id === client.id ? 'bg-blue-100' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{client.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[client.category] || 'bg-slate-100'}`}>
                      {client.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{client.company}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-4">
          {selectedClient ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg">{selectedClient.name}</h3>
                  <p className="text-sm text-slate-500">{selectedClient.company}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(selectedClient)} className="text-blue-500 text-sm">
                    {t('tools.clientDirectory.edit')}
                  </button>
                  <button onClick={() => deleteClient(selectedClient.id)} className="text-red-500 text-sm">
                    {t('tools.clientDirectory.delete')}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {selectedClient.email && (
                  <div>
                    <div className="text-xs text-slate-500">{t('tools.clientDirectory.email')}</div>
                    <a href={`mailto:${selectedClient.email}`} className="text-blue-500">
                      {selectedClient.email}
                    </a>
                  </div>
                )}
                {selectedClient.phone && (
                  <div>
                    <div className="text-xs text-slate-500">{t('tools.clientDirectory.phone')}</div>
                    <a href={`tel:${selectedClient.phone}`} className="text-blue-500">
                      {selectedClient.phone}
                    </a>
                  </div>
                )}
                {selectedClient.address && (
                  <div>
                    <div className="text-xs text-slate-500">{t('tools.clientDirectory.address')}</div>
                    <div>{selectedClient.address}</div>
                  </div>
                )}
                {selectedClient.lastContact && (
                  <div>
                    <div className="text-xs text-slate-500">{t('tools.clientDirectory.lastContact')}</div>
                    <div>{selectedClient.lastContact}</div>
                  </div>
                )}
                {selectedClient.notes && (
                  <div>
                    <div className="text-xs text-slate-500">{t('tools.clientDirectory.notes')}</div>
                    <div className="text-sm">{selectedClient.notes}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">
              {t('tools.clientDirectory.selectClient')}
            </div>
          )}
        </div>
      </div>

      <button onClick={exportCSV} className="w-full py-2 bg-slate-100 rounded text-sm">
        {t('tools.clientDirectory.exportCSV')}
      </button>
    </div>
  )
}
