import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Platform = 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok'
type PostStatus = 'draft' | 'scheduled' | 'published'

interface ScheduledPost {
  id: string
  content: string
  platforms: Platform[]
  scheduledDate: string
  scheduledTime: string
  status: PostStatus
  hashtags: string[]
  mediaUrl: string
  createdAt: string
}

export default function PostSchedulerMockup() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('all')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const [form, setForm] = useState({
    content: '',
    platforms: [] as Platform[],
    scheduledDate: '',
    scheduledTime: '12:00',
    hashtags: '',
    mediaUrl: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('post-scheduler-posts')
    if (saved) setPosts(JSON.parse(saved))
  }, [])

  const savePosts = (updated: ScheduledPost[]) => {
    setPosts(updated)
    localStorage.setItem('post-scheduler-posts', JSON.stringify(updated))
  }

  const addPost = () => {
    if (!form.content || form.platforms.length === 0 || !form.scheduledDate) return
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content: form.content,
      platforms: form.platforms,
      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,
      status: 'scheduled',
      hashtags: form.hashtags.split(' ').filter(h => h.startsWith('#')),
      mediaUrl: form.mediaUrl,
      createdAt: new Date().toISOString()
    }
    savePosts([...posts, newPost])
    setForm({ content: '', platforms: [], scheduledDate: '', scheduledTime: '12:00', hashtags: '', mediaUrl: '' })
    setShowForm(false)
  }

  const togglePlatform = (p: Platform) => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p]
    }))
  }

  const updateStatus = (id: string, status: PostStatus) => {
    savePosts(posts.map(p => p.id === id ? { ...p, status } : p))
  }

  const deletePost = (id: string) => {
    savePosts(posts.filter(p => p.id !== id))
  }

  const duplicatePost = (post: ScheduledPost) => {
    const newPost: ScheduledPost = {
      ...post,
      id: Date.now().toString(),
      status: 'draft',
      createdAt: new Date().toISOString()
    }
    savePosts([...posts, newPost])
  }

  const filteredPosts = useMemo(() => {
    let filtered = posts
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus)
    }
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`)
      const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`)
      return dateA.getTime() - dateB.getTime()
    })
  }, [posts, filterStatus])

  const platformColors: Record<Platform, string> = {
    instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
    twitter: 'bg-blue-400',
    linkedin: 'bg-blue-700',
    facebook: 'bg-blue-600',
    tiktok: 'bg-black'
  }

  const statusColors: Record<PostStatus, string> = {
    draft: 'bg-slate-100 text-slate-700',
    scheduled: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700'
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (Date | null)[] = []

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getPostsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return posts.filter(p => p.scheduledDate === dateStr)
  }

  const bestTimes: Record<Platform, string[]> = {
    instagram: ['11:00', '14:00', '19:00'],
    twitter: ['09:00', '12:00', '17:00'],
    linkedin: ['07:30', '12:00', '17:00'],
    facebook: ['13:00', '16:00', '20:00'],
    tiktok: ['07:00', '12:00', '19:00']
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 py-2 rounded text-sm ${
            viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-slate-100'
          }`}
        >
          {t('tools.postSchedulerMockup.listView')}
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex-1 py-2 rounded text-sm ${
            viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-slate-100'
          }`}
        >
          {t('tools.postSchedulerMockup.calendarView')}
        </button>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        + {t('tools.postSchedulerMockup.schedulePost')}
      </button>

      {showForm && (
        <div className="card p-4 space-y-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.postSchedulerMockup.newPost')}
          </h3>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder={t('tools.postSchedulerMockup.contentPlaceholder')}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="text-xs text-slate-500 text-right">
            {form.content.length} {t('tools.postSchedulerMockup.characters')}
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.postSchedulerMockup.platforms')}
            </label>
            <div className="flex flex-wrap gap-2">
              {(['instagram', 'twitter', 'linkedin', 'facebook', 'tiktok'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 rounded text-sm capitalize ${
                    form.platforms.includes(p) ? `${platformColors[p]} text-white` : 'bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.postSchedulerMockup.date')}
              </label>
              <input
                type="date"
                value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.postSchedulerMockup.time')}
              </label>
              <input
                type="time"
                value={form.scheduledTime}
                onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          {form.platforms.length > 0 && (
            <div className="text-xs text-slate-500">
              {t('tools.postSchedulerMockup.bestTimes')}: {form.platforms.map(p => `${p}: ${bestTimes[p].join(', ')}`).join(' | ')}
            </div>
          )}

          <input
            type="text"
            value={form.hashtags}
            onChange={(e) => setForm({ ...form, hashtags: e.target.value })}
            placeholder={t('tools.postSchedulerMockup.hashtags')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />

          <input
            type="text"
            value={form.mediaUrl}
            onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
            placeholder={t('tools.postSchedulerMockup.mediaUrl')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('tools.postSchedulerMockup.cancel')}
            </button>
            <button
              onClick={addPost}
              disabled={!form.content || form.platforms.length === 0 || !form.scheduledDate}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.postSchedulerMockup.schedule')}
            </button>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <>
          <div className="flex flex-wrap gap-2">
            {(['all', 'draft', 'scheduled', 'published'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded text-sm capitalize ${
                  filterStatus === s ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="card p-4">
            {filteredPosts.length === 0 ? (
              <p className="text-center text-slate-500 py-4">
                {t('tools.postSchedulerMockup.noPosts')}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredPosts.map(post => (
                  <div key={post.id} className="p-3 bg-slate-50 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-1">
                        {post.platforms.map(p => (
                          <span
                            key={p}
                            className={`w-4 h-4 rounded ${platformColors[p]}`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${statusColors[post.status]}`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">{post.content}</p>
                    {post.hashtags.length > 0 && (
                      <p className="text-xs text-blue-500 mt-1">{post.hashtags.join(' ')}</p>
                    )}
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                      <span>
                        {new Date(post.scheduledDate).toLocaleDateString()} {post.scheduledTime}
                      </span>
                      <div className="flex gap-2">
                        <select
                          value={post.status}
                          onChange={(e) => updateStatus(post.id, e.target.value as PostStatus)}
                          className="text-xs bg-transparent"
                        >
                          <option value="draft">{t('tools.postSchedulerMockup.draft')}</option>
                          <option value="scheduled">{t('tools.postSchedulerMockup.scheduled')}</option>
                          <option value="published">{t('tools.postSchedulerMockup.published')}</option>
                        </select>
                        <button
                          onClick={() => duplicatePost(post)}
                          className="text-blue-500"
                        >
                          {t('tools.postSchedulerMockup.duplicate')}
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-red-500"
                        >
                          {t('tools.postSchedulerMockup.delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {viewMode === 'calendar' && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="px-3 py-1 bg-slate-100 rounded"
            >
              ←
            </button>
            <span className="font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="px-3 py-1 bg-slate-100 rounded"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((day, index) => (
              <div
                key={index}
                className={`min-h-[60px] p-1 rounded text-xs ${
                  day ? 'bg-slate-50' : ''
                }`}
              >
                {day && (
                  <>
                    <div className="font-medium mb-1">{day.getDate()}</div>
                    {getPostsForDate(day).slice(0, 2).map(post => (
                      <div
                        key={post.id}
                        className={`${platformColors[post.platforms[0]]} text-white px-1 rounded truncate mb-0.5`}
                        style={{ fontSize: '10px' }}
                      >
                        {post.scheduledTime}
                      </div>
                    ))}
                    {getPostsForDate(day).length > 2 && (
                      <div className="text-slate-400" style={{ fontSize: '10px' }}>
                        +{getPostsForDate(day).length - 2}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{posts.length}</div>
          <div className="text-xs text-slate-500">{t('tools.postSchedulerMockup.total')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-yellow-600">
            {posts.filter(p => p.status === 'scheduled').length}
          </div>
          <div className="text-xs text-slate-500">{t('tools.postSchedulerMockup.scheduled')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-green-600">
            {posts.filter(p => p.status === 'published').length}
          </div>
          <div className="text-xs text-slate-500">{t('tools.postSchedulerMockup.published')}</div>
        </div>
      </div>
    </div>
  )
}
