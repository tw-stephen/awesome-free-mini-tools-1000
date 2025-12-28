import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Platform = 'instagram' | 'twitter' | 'tiktok' | 'facebook' | 'linkedin' | 'youtube'

interface ScheduledPost {
  id: string
  date: string
  time: string
  platform: Platform
  content: string
  status: 'draft' | 'scheduled' | 'posted'
}

export default function SocialMediaCalendar() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null)
  const [filter, setFilter] = useState<Platform | 'all'>('all')

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: '12:00',
    platform: 'instagram' as Platform,
    content: '',
    status: 'draft' as 'draft' | 'scheduled' | 'posted'
  })

  useEffect(() => {
    const saved = localStorage.getItem('social-calendar')
    if (saved) setPosts(JSON.parse(saved))
  }, [])

  const savePosts = (updated: ScheduledPost[]) => {
    setPosts(updated)
    localStorage.setItem('social-calendar', JSON.stringify(updated))
  }

  const addPost = () => {
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      ...form
    }
    savePosts([...posts, newPost])
    setShowForm(false)
    resetForm()
  }

  const updatePost = () => {
    if (!editingPost) return
    savePosts(posts.map(p => p.id === editingPost.id ? { ...editingPost, ...form } : p))
    setEditingPost(null)
    resetForm()
  }

  const deletePost = (id: string) => {
    savePosts(posts.filter(p => p.id !== id))
  }

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().slice(0, 10),
      time: '12:00',
      platform: 'instagram',
      content: '',
      status: 'draft'
    })
  }

  const startEdit = (post: ScheduledPost) => {
    setEditingPost(post)
    setForm({
      date: post.date,
      time: post.time,
      platform: post.platform,
      content: post.content,
      status: post.status
    })
  }

  const filteredPosts = posts
    .filter(p => filter === 'all' || p.platform === filter)
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())

  const platformColors: Record<Platform, string> = {
    instagram: 'bg-pink-500',
    twitter: 'bg-blue-400',
    tiktok: 'bg-slate-800',
    facebook: 'bg-blue-600',
    linkedin: 'bg-blue-700',
    youtube: 'bg-red-600'
  }

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-700',
    scheduled: 'bg-blue-100 text-blue-700',
    posted: 'bg-green-100 text-green-700'
  }

  const getPostsForDate = (date: string) => posts.filter(p => p.date === date)

  const getDaysInMonth = (year: number, month: number) => {
    const days = []
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)

    return days
  }

  const currentDate = new Date(selectedDate)
  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 py-2 rounded text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.socialMediaCalendar.listView')}
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex-1 py-2 rounded text-sm ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.socialMediaCalendar.calendarView')}
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {(['all', 'instagram', 'twitter', 'tiktok', 'facebook', 'linkedin', 'youtube'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                filter === p ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 bg-blue-500 text-white rounded text-sm"
        >
          + {t('tools.socialMediaCalendar.addPost')}
        </button>
      </div>

      {(showForm || editingPost) && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.socialMediaCalendar.date')}</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.socialMediaCalendar.time')}</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.socialMediaCalendar.platform')}</label>
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.socialMediaCalendar.status')}</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="draft">{t('tools.socialMediaCalendar.draft')}</option>
                <option value="scheduled">{t('tools.socialMediaCalendar.scheduled')}</option>
                <option value="posted">{t('tools.socialMediaCalendar.posted')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.socialMediaCalendar.content')}</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder={t('tools.socialMediaCalendar.contentPlaceholder')}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { setShowForm(false); setEditingPost(null); resetForm() }}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('tools.socialMediaCalendar.cancel')}
            </button>
            <button
              onClick={editingPost ? updatePost : addPost}
              disabled={!form.content}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingPost ? t('tools.socialMediaCalendar.save') : t('tools.socialMediaCalendar.add')}
            </button>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="card p-4">
          {filteredPosts.length === 0 ? (
            <p className="text-center text-slate-500 py-4">{t('tools.socialMediaCalendar.noPosts')}</p>
          ) : (
            <div className="space-y-2">
              {filteredPosts.map(post => (
                <div key={post.id} className="p-3 bg-slate-50 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${platformColors[post.platform]}`} />
                      <span className="text-xs font-medium capitalize">{post.platform}</span>
                      <span className={`text-xs px-1.5 rounded ${statusColors[post.status]}`}>
                        {t(`tools.socialMediaCalendar.${post.status}`)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(post)} className="text-blue-500 text-xs">
                        {t('tools.socialMediaCalendar.edit')}
                      </button>
                      <button onClick={() => deletePost(post.id)} className="text-red-500 text-xs">×</button>
                    </div>
                  </div>
                  <div className="text-sm mt-1">{post.content.slice(0, 100)}{post.content.length > 100 ? '...' : ''}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(`${post.date}T${post.time}`).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                const d = new Date(selectedDate)
                d.setMonth(d.getMonth() - 1)
                setSelectedDate(d.toISOString().slice(0, 10))
              }}
              className="px-3 py-1 bg-slate-100 rounded"
            >
              ←
            </button>
            <span className="font-medium">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => {
                const d = new Date(selectedDate)
                d.setMonth(d.getMonth() + 1)
                setSelectedDate(d.toISOString().slice(0, 10))
              }}
              className="px-3 py-1 bg-slate-100 rounded"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (!day) return <div key={i} />
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayPosts = getPostsForDate(dateStr)

              return (
                <div
                  key={i}
                  className={`p-2 min-h-[60px] border rounded text-sm ${
                    dateStr === new Date().toISOString().slice(0, 10) ? 'bg-blue-50 border-blue-300' : 'border-slate-200'
                  }`}
                >
                  <div className="font-medium text-xs">{day}</div>
                  {dayPosts.slice(0, 2).map(p => (
                    <div key={p.id} className={`w-full h-1.5 rounded mt-1 ${platformColors[p.platform]}`} />
                  ))}
                  {dayPosts.length > 2 && (
                    <div className="text-xs text-slate-400">+{dayPosts.length - 2}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
