import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Note {
  id: number
  title: string
  content: string
  color: string
  pinned: boolean
  createdAt: Date
  updatedAt: Date
}

const colors = [
  '#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#e9d5ff',
  '#fed7aa', '#fecaca', '#ccfbf1', '#f5f5f4',
]

export default function NoteTaking() {
  const { t } = useTranslation()
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editColor, setEditColor] = useState(colors[0])

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('simple-notes')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setNotes(parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt),
        })))
      } catch (e) {
        console.error('Failed to load notes')
      }
    }
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('simple-notes', JSON.stringify(notes))
  }, [notes])

  const createNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: '',
      content: '',
      color: colors[Math.floor(Math.random() * colors.length)],
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setEditTitle('')
    setEditContent('')
    setEditColor(newNote.color)
  }

  const updateNote = () => {
    if (!selectedNote) return

    setNotes(notes.map((note) =>
      note.id === selectedNote.id
        ? {
            ...note,
            title: editTitle,
            content: editContent,
            color: editColor,
            updatedAt: new Date(),
          }
        : note
    ))
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
    }
  }

  const togglePin = (id: number) => {
    setNotes(notes.map((note) =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ))
  }

  const selectNote = (note: Note) => {
    // Save current note first
    if (selectedNote) {
      updateNote()
    }
    setSelectedNote(note)
    setEditTitle(note.title)
    setEditContent(note.content)
    setEditColor(note.color)
  }

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return b.updatedAt.getTime() - a.updatedAt.getTime()
  })

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return t('tools.noteTaking.yesterday')
    } else if (days < 7) {
      return `${days} ${t('tools.noteTaking.daysAgo')}`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('tools.noteTaking.search')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={createNote}
            className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            + {t('tools.noteTaking.newNote')}
          </button>
        </div>

        <div className="text-sm text-slate-500">
          {notes.length} {t('tools.noteTaking.notes')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Notes List */}
        <div className="space-y-2">
          {sortedNotes.length === 0 ? (
            <div className="card p-8 text-center text-slate-500">
              <div className="text-4xl mb-2">📝</div>
              {searchQuery
                ? t('tools.noteTaking.noResults')
                : t('tools.noteTaking.noNotes')
              }
            </div>
          ) : (
            sortedNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => selectNote(note)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedNote?.id === note.id
                    ? 'ring-2 ring-blue-500'
                    : 'hover:shadow-md'
                }`}
                style={{ backgroundColor: note.color }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      {note.pinned && <span className="text-sm">📌</span>}
                      <h3 className="font-medium text-slate-800 truncate">
                        {note.title || t('tools.noteTaking.untitled')}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                      {note.content || t('tools.noteTaking.noContent')}
                    </p>
                    <div className="text-xs text-slate-400 mt-2">
                      {formatDate(note.updatedAt)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNote(note.id)
                    }}
                    className="ml-2 p-1 text-slate-400 hover:text-red-500"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Note Editor */}
        {selectedNote && (
          <div className="card p-4" style={{ backgroundColor: editColor }}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value)
                    updateNote()
                  }}
                  onBlur={updateNote}
                  placeholder={t('tools.noteTaking.titlePlaceholder')}
                  className="flex-1 px-2 py-1 bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none text-lg font-medium"
                />
                <button
                  onClick={() => togglePin(selectedNote.id)}
                  className={`ml-2 p-2 rounded ${selectedNote.pinned ? 'bg-yellow-200' : 'bg-white/50'}`}
                >
                  📌
                </button>
              </div>

              <textarea
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value)
                }}
                onBlur={updateNote}
                placeholder={t('tools.noteTaking.contentPlaceholder')}
                rows={12}
                className="w-full p-2 bg-white/30 border border-slate-200 rounded resize-none focus:outline-none focus:border-blue-500"
              />

              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  {t('tools.noteTaking.color')}
                </label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setEditColor(color)
                        setNotes(notes.map((n) =>
                          n.id === selectedNote.id ? { ...n, color } : n
                        ))
                      }}
                      className={`w-8 h-8 rounded-full border-2 ${
                        editColor === color ? 'border-blue-500' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-400">
                {t('tools.noteTaking.created')}: {selectedNote.createdAt.toLocaleString()}
                <br />
                {t('tools.noteTaking.updated')}: {selectedNote.updatedAt.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.noteTaking.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.noteTaking.tip1')}</li>
          <li>{t('tools.noteTaking.tip2')}</li>
          <li>{t('tools.noteTaking.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
