import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ContentItem {
  id: number
  title: string
  type: string
  channel: string
  date: string
  status: 'idea' | 'draft' | 'review' | 'scheduled' | 'published'
  assignee: string
  notes: string
}

export default function ContentCalendar() {
  const { t } = useTranslation()
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [filter, setFilter] = useState('all')
  const [items, setItems] = useState<ContentItem[]>([])
  const [showForm, setShowForm] = useState(false)

  const contentTypes = ['Blog Post', 'Video', 'Podcast', 'Infographic', 'Newsletter', 'Social Post', 'Webinar', 'Case Study', 'eBook', 'Press Release']
  const channels = ['Website', 'YouTube', 'Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'Email', 'Podcast']
  const statuses = ['idea', 'draft', 'review', 'scheduled', 'published'] as const

  const addItem = (item: Omit<ContentItem, 'id'>) => {
    setItems([...items, { ...item, id: Date.now() }])
    setShowForm(false)
  }

  const updateItem = (id: number, field: keyof ContentItem, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id))
  }

  const getStatusColor = (status: ContentItem['status']): string => {
    const colors = {
      idea: 'bg-purple-100 text-purple-600',
      draft: 'bg-yellow-100 text-yellow-600',
      review: 'bg-orange-100 text-orange-600',
      scheduled: 'bg-blue-100 text-blue-600',
      published: 'bg-green-100 text-green-600',
    }
    return colors[status]
  }

  const filteredItems = items
    .filter(i => filter === 'all' || i.status === filter || i.type === filter || i.channel === filter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const getCalendarDays = () => {
    const today = new Date()
    const days = []
    for (let i = -7; i <= 21; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }

  const generateCalendar = (): string => {
    let doc = `CONTENT CALENDAR\n${'═'.repeat(50)}\n\n`
    doc += `Total Items: ${items.length}\n`
    doc += `By Status:\n`
    statuses.forEach(s => {
      const count = items.filter(i => i.status === s).length
      if (count > 0) doc += `  ${s}: ${count}\n`
    })
    doc += '\n'

    doc += `CONTENT SCHEDULE\n${'─'.repeat(40)}\n`
    const grouped = filteredItems.reduce((acc, item) => {
      if (!acc[item.date]) acc[item.date] = []
      acc[item.date].push(item)
      return acc
    }, {} as Record<string, ContentItem[]>)

    Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).forEach(([date, dateItems]) => {
      doc += `\n${date}\n`
      dateItems.forEach(item => {
        doc += `  [${item.status.toUpperCase()}] ${item.title}\n`
        doc += `    Type: ${item.type} | Channel: ${item.channel}\n`
        if (item.assignee) doc += `    Assignee: ${item.assignee}\n`
      })
    })

    return doc
  }

  const copyCalendar = () => {
    navigator.clipboard.writeText(generateCalendar())
  }

  const ContentForm = () => {
    const [form, setForm] = useState({
      title: '',
      type: contentTypes[0],
      channel: channels[0],
      date: new Date().toISOString().split('T')[0],
      status: 'idea' as ContentItem['status'],
      assignee: '',
      notes: '',
    })

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.contentCalendar.addContent')}</h3>
        <div className="space-y-3">
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Content Title" className="w-full px-3 py-2 border border-slate-300 rounded" />
          <div className="grid grid-cols-3 gap-3">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 border border-slate-300 rounded">
              {contentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className="px-3 py-2 border border-slate-300 rounded">
              {channels.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 border border-slate-300 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ContentItem['status'] })} className="px-3 py-2 border border-slate-300 rounded">
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <input type="text" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} placeholder="Assignee" className="px-3 py-2 border border-slate-300 rounded" />
          </div>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={2} className="w-full px-3 py-2 border border-slate-300 rounded resize-none" />
          <div className="flex gap-2">
            <button onClick={() => addItem(form)} disabled={!form.title} className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300">Add Content</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.contentCalendar.overview')}</h3>
          <div className="flex gap-2">
            <button onClick={() => setView('list')} className={`px-3 py-1 rounded text-sm ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>List</button>
            <button onClick={() => setView('calendar')} className={`px-3 py-1 rounded text-sm ${view === 'calendar' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Calendar</button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 text-center">
          {statuses.map(status => (
            <div key={status} className="p-2 bg-slate-50 rounded">
              <div className="text-xl font-bold">{items.filter(i => i.status === status).length}</div>
              <div className="text-xs text-slate-500 capitalize">{status}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>All</button>
        {statuses.map(status => (
          <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1 rounded text-sm whitespace-nowrap capitalize ${filter === status ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>{status}</button>
        ))}
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          + {t('tools.contentCalendar.addContent')}
        </button>
      )}

      {showForm && <ContentForm />}

      {view === 'list' && (
        <div className="space-y-2">
          {filteredItems.map(item => (
            <div key={item.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.title}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(item.status)}`}>{item.status}</span>
                  </div>
                  <div className="text-sm text-slate-500">{item.type} • {item.channel} • {item.date}</div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">×</button>
              </div>
              {item.assignee && <div className="text-sm text-slate-500 mb-2">Assigned to: {item.assignee}</div>}
              <div className="flex gap-1">
                {statuses.map(status => (
                  <button key={status} onClick={() => updateItem(item.id, 'status', status)} className={`px-2 py-1 rounded text-xs capitalize ${item.status === status ? getStatusColor(status) : 'bg-slate-100 hover:bg-slate-200'}`}>{status}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'calendar' && (
        <div className="card p-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {getCalendarDays().map(date => {
              const dateItems = items.filter(i => i.date === date)
              const isToday = date === new Date().toISOString().split('T')[0]
              return (
                <div key={date} className={`w-24 flex-shrink-0 p-2 rounded ${isToday ? 'bg-blue-50 border-2 border-blue-300' : 'bg-slate-50'}`}>
                  <div className="text-xs text-slate-500 text-center mb-1">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                  <div className="space-y-1">
                    {dateItems.slice(0, 3).map(item => (
                      <div key={item.id} className={`text-xs p-1 rounded truncate ${getStatusColor(item.status)}`} title={item.title}>
                        {item.title}
                      </div>
                    ))}
                    {dateItems.length > 3 && (
                      <div className="text-xs text-slate-500 text-center">+{dateItems.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {items.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Add content to plan your editorial calendar
        </div>
      )}

      {items.length > 0 && (
        <button onClick={copyCalendar} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          {t('tools.contentCalendar.export')}
        </button>
      )}
    </div>
  )
}
