import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Post {
  id: number
  platform: string
  content: string
  date: string
  time: string
  status: 'draft' | 'scheduled' | 'posted'
  hashtags: string[]
}

export default function SocialMediaPlanner() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<Post[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'bg-black' },
    { id: 'facebook', name: 'Facebook', icon: 'f', color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'in', color: 'bg-blue-700' },
    { id: 'tiktok', name: 'TikTok', icon: '♪', color: 'bg-black' },
  ]

  const addPost = (post: Omit<Post, 'id'>) => {
    setPosts([...posts, { ...post, id: Date.now() }])
    setShowForm(false)
  }

  const updateStatus = (id: number, status: Post['status']) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status } : p))
  }

  const deletePost = (id: number) => {
    setPosts(posts.filter(p => p.id !== id))
  }

  const filteredPosts = posts
    .filter(p => filter === 'all' || p.platform === filter || p.status === filter)
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())

  const getStatusColor = (status: Post['status']): string => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-700'
      case 'scheduled': return 'bg-blue-100 text-blue-700'
      case 'posted': return 'bg-green-100 text-green-700'
    }
  }

  const copyCalendar = () => {
    let calendar = `SOCIAL MEDIA CALENDAR\n${'='.repeat(50)}\n\n`
    const grouped = filteredPosts.reduce((acc, post) => {
      if (!acc[post.date]) acc[post.date] = []
      acc[post.date].push(post)
      return acc
    }, {} as Record<string, Post[]>)

    Object.entries(grouped).forEach(([date, datePosts]) => {
      calendar += `${date}\n${'─'.repeat(30)}\n`
      datePosts.forEach(post => {
        calendar += `[${post.time}] ${post.platform.toUpperCase()}: ${post.content}\n`
        if (post.hashtags.length > 0) calendar += `  Hashtags: ${post.hashtags.join(' ')}\n`
      })
      calendar += '\n'
    })
    navigator.clipboard.writeText(calendar)
  }

  const PostForm = () => {
    const [form, setForm] = useState({
      platform: 'twitter',
      content: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      status: 'draft' as Post['status'],
      hashtags: '',
    })

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.socialMediaPlanner.addPost')}</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            {platforms.map(p => (
              <button
                key={p.id}
                onClick={() => setForm({ ...form, platform: p.id })}
                className={`flex-1 py-2 rounded text-center ${form.platform === p.id ? p.color + ' text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                <span className="text-lg">{p.icon}</span>
              </button>
            ))}
          </div>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Post content..." rows={3} className="w-full px-3 py-2 border border-slate-300 rounded resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 border border-slate-300 rounded" />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="px-3 py-2 border border-slate-300 rounded" />
          </div>
          <input type="text" value={form.hashtags} onChange={(e) => setForm({ ...form, hashtags: e.target.value })} placeholder="Hashtags (comma-separated)" className="w-full px-3 py-2 border border-slate-300 rounded" />
          <div className="flex gap-2">
            <button onClick={() => addPost({ ...form, hashtags: form.hashtags.split(',').map(h => h.trim()).filter(h => h) })} disabled={!form.content} className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300">Add Post</button>
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
          <h3 className="font-medium">{t('tools.socialMediaPlanner.stats')}</h3>
          <button onClick={copyCalendar} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">Export</button>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-slate-50 rounded">
            <div className="text-xl font-bold">{posts.length}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="text-xl font-bold text-slate-600">{posts.filter(p => p.status === 'draft').length}</div>
            <div className="text-xs text-slate-500">Drafts</div>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-xl font-bold text-blue-600">{posts.filter(p => p.status === 'scheduled').length}</div>
            <div className="text-xs text-slate-500">Scheduled</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="text-xl font-bold text-green-600">{posts.filter(p => p.status === 'posted').length}</div>
            <div className="text-xs text-slate-500">Posted</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded whitespace-nowrap ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>All</button>
        {platforms.map(p => (
          <button key={p.id} onClick={() => setFilter(p.id)} className={`px-3 py-1 rounded whitespace-nowrap ${filter === p.id ? p.color + ' text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>{p.name}</button>
        ))}
        <button onClick={() => setFilter('draft')} className={`px-3 py-1 rounded whitespace-nowrap ${filter === 'draft' ? 'bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Drafts</button>
        <button onClick={() => setFilter('scheduled')} className={`px-3 py-1 rounded whitespace-nowrap ${filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Scheduled</button>
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          + {t('tools.socialMediaPlanner.addPost')}
        </button>
      )}

      {showForm && <PostForm />}

      <div className="space-y-2">
        {filteredPosts.map(post => {
          const platform = platforms.find(p => p.id === post.platform)
          return (
            <div key={post.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded flex items-center justify-center text-white ${platform?.color || 'bg-slate-500'}`}>{platform?.icon}</span>
                  <div>
                    <div className="font-medium">{platform?.name}</div>
                    <div className="text-sm text-slate-500">{post.date} at {post.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(post.status)}`}>{post.status}</span>
                  <button onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-600 text-sm">Delete</button>
                </div>
              </div>
              <p className="text-sm mb-2">{post.content}</p>
              {post.hashtags.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-2">
                  {post.hashtags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-1">
                {(['draft', 'scheduled', 'posted'] as const).map(status => (
                  <button key={status} onClick={() => updateStatus(post.id, status)} className={`px-2 py-1 rounded text-xs ${post.status === status ? getStatusColor(status) : 'bg-slate-100 hover:bg-slate-200'}`}>{status}</button>
                ))}
              </div>
            </div>
          )
        })}
        {filteredPosts.length === 0 && (
          <div className="card p-8 text-center text-slate-500">No posts to display</div>
        )}
      </div>
    </div>
  )
}
