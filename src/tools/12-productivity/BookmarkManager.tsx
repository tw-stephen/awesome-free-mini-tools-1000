import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Bookmark {
  id: string
  title: string
  url: string
  folder: string
  tags: string[]
  favicon: string
  createdAt: string
}

export default function BookmarkManager() {
  const { t } = useTranslation()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [folders, setFolders] = useState<string[]>(['General', 'Work', 'Personal'])
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    url: '',
    folder: 'General',
    tags: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('bookmarks')
    const savedFolders = localStorage.getItem('bookmark-folders')
    if (saved) setBookmarks(JSON.parse(saved))
    if (savedFolders) setFolders(JSON.parse(savedFolders))
  }, [])

  const saveBookmarks = (updated: Bookmark[]) => {
    setBookmarks(updated)
    localStorage.setItem('bookmarks', JSON.stringify(updated))
  }

  const saveFolders = (updated: string[]) => {
    setFolders(updated)
    localStorage.setItem('bookmark-folders', JSON.stringify(updated))
  }

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return domain
    } catch {
      return ''
    }
  }

  const getFavicon = (url: string) => {
    const domain = extractDomain(url)
    return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : ''
  }

  const addBookmark = () => {
    if (!form.title || !form.url) return

    let url = form.url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    const bookmark: Bookmark = {
      id: editingId || Date.now().toString(),
      title: form.title,
      url,
      folder: form.folder,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      favicon: getFavicon(url),
      createdAt: new Date().toISOString()
    }

    if (editingId) {
      saveBookmarks(bookmarks.map(b => b.id === editingId ? bookmark : b))
    } else {
      saveBookmarks([bookmark, ...bookmarks])
    }

    resetForm()
  }

  const resetForm = () => {
    setForm({ title: '', url: '', folder: 'General', tags: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (bookmark: Bookmark) => {
    setForm({
      title: bookmark.title,
      url: bookmark.url,
      folder: bookmark.folder,
      tags: bookmark.tags.join(', ')
    })
    setEditingId(bookmark.id)
    setShowForm(true)
  }

  const deleteBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter(b => b.id !== id))
  }

  const addFolder = (name: string) => {
    if (name && !folders.includes(name)) {
      saveFolders([...folders, name])
    }
  }

  const deleteFolder = (name: string) => {
    if (name === 'General') return
    saveFolders(folders.filter(f => f !== name))
    saveBookmarks(bookmarks.map(b => b.folder === name ? { ...b, folder: 'General' } : b))
    if (selectedFolder === name) setSelectedFolder(null)
  }

  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks

    if (selectedFolder) {
      filtered = filtered.filter(b => b.folder === selectedFolder)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query) ||
        b.tags.some(t => t.toLowerCase().includes(query))
      )
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [bookmarks, selectedFolder, searchQuery])

  const exportBookmarks = () => {
    const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
${folders.map(folder => `  <DT><H3>${folder}</H3>
  <DL><p>
${bookmarks.filter(b => b.folder === folder).map(b => `    <DT><A HREF="${b.url}">${b.title}</A>`).join('\n')}
  </DL><p>`).join('\n')}
</DL><p>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bookmarks.html'
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('tools.bookmarkManager.search')}
          className="flex-1 px-3 py-2 border border-slate-300 rounded"
        />
        <button
          onClick={() => setShowForm(!showForm)}
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
            placeholder={t('tools.bookmarkManager.title')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder={t('tools.bookmarkManager.url')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.folder}
              onChange={(e) => setForm({ ...form, folder: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {folders.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder={t('tools.bookmarkManager.tags')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={resetForm} className="py-2 bg-slate-100 rounded">
              {t('tools.bookmarkManager.cancel')}
            </button>
            <button
              onClick={addBookmark}
              disabled={!form.title || !form.url}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingId ? t('tools.bookmarkManager.update') : t('tools.bookmarkManager.add')}
            </button>
          </div>
        </div>
      )}

      <div className="card p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm text-slate-700">{t('tools.bookmarkManager.folders')}</span>
          <button
            onClick={() => {
              const name = prompt(t('tools.bookmarkManager.newFolderPrompt'))
              if (name) addFolder(name)
            }}
            className="text-blue-500 text-sm"
          >
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`px-3 py-1 rounded text-sm ${
              selectedFolder === null ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.bookmarkManager.all')} ({bookmarks.length})
          </button>
          {folders.map(folder => {
            const count = bookmarks.filter(b => b.folder === folder).length
            return (
              <div key={folder} className="relative group">
                <button
                  onClick={() => setSelectedFolder(folder)}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedFolder === folder ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {folder} ({count})
                </button>
                {folder !== 'General' && (
                  <button
                    onClick={() => deleteFolder(folder)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        {filteredBookmarks.length === 0 ? (
          <p className="text-center text-slate-500 py-4">{t('tools.bookmarkManager.noBookmarks')}</p>
        ) : (
          <div className="space-y-2">
            {filteredBookmarks.map(bookmark => (
              <div key={bookmark.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded hover:bg-slate-100">
                <img
                  src={bookmark.favicon}
                  alt=""
                  className="w-5 h-5"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <div className="flex-1 min-w-0">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline truncate block"
                  >
                    {bookmark.title}
                  </a>
                  <div className="text-xs text-slate-500 truncate">{extractDomain(bookmark.url)}</div>
                  {bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {bookmark.tags.map(tag => (
                        <span key={tag} className="text-xs bg-slate-200 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(bookmark)}
                    className="text-blue-500 text-sm"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
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

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={exportBookmarks}
          className="py-2 bg-slate-100 rounded text-sm"
        >
          {t('tools.bookmarkManager.export')}
        </button>
        <button
          onClick={() => saveBookmarks([])}
          className="py-2 bg-red-100 text-red-600 rounded text-sm"
        >
          {t('tools.bookmarkManager.clearAll')}
        </button>
      </div>
    </div>
  )
}
