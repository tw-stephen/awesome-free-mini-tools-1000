import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Note {
  id: string
  title: string
  content: string
  folder: string
  tags: string[]
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export default function NoteTakingApp() {
  const { t } = useTranslation()
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<string[]>(['General'])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFolderInput, setShowFolderInput] = useState(false)
  const [newFolder, setNewFolder] = useState('')

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes-app')
    const savedFolders = localStorage.getItem('notes-folders')
    if (savedNotes) setNotes(JSON.parse(savedNotes))
    if (savedFolders) setFolders(JSON.parse(savedFolders))
  }, [])

  const saveNotes = (updated: Note[]) => {
    setNotes(updated)
    localStorage.setItem('notes-app', JSON.stringify(updated))
  }

  const saveFolders = (updated: string[]) => {
    setFolders(updated)
    localStorage.setItem('notes-folders', JSON.stringify(updated))
  }

  const createNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: t('tools.noteTakingApp.untitled'),
      content: '',
      folder: selectedFolder || 'General',
      tags: [],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveNotes([note, ...notes])
    setSelectedNote(note)
  }

  const updateNote = (field: keyof Note, value: string | boolean | string[]) => {
    if (!selectedNote) return
    const updated = {
      ...selectedNote,
      [field]: value,
      updatedAt: new Date().toISOString()
    }
    setSelectedNote(updated)
    saveNotes(notes.map(n => n.id === updated.id ? updated : n))
  }

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id))
    if (selectedNote?.id === id) setSelectedNote(null)
  }

  const togglePin = (id: string) => {
    saveNotes(notes.map(n =>
      n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n
    ))
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, isPinned: !selectedNote.isPinned })
    }
  }

  const addFolder = () => {
    if (newFolder && !folders.includes(newFolder)) {
      saveFolders([...folders, newFolder])
      setNewFolder('')
      setShowFolderInput(false)
    }
  }

  const deleteFolder = (folder: string) => {
    if (folder === 'General') return
    saveFolders(folders.filter(f => f !== folder))
    saveNotes(notes.map(n => n.folder === folder ? { ...n, folder: 'General' } : n))
    if (selectedFolder === folder) setSelectedFolder(null)
  }

  const filteredNotes = useMemo(() => {
    let filtered = notes

    if (selectedFolder) {
      filtered = filtered.filter(n => n.folder === selectedFolder)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query) ||
        n.tags.some(t => t.toLowerCase().includes(query))
      )
    }

    return filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [notes, selectedFolder, searchQuery])

  const wordCount = selectedNote?.content.split(/\s+/).filter(Boolean).length || 0

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('tools.noteTakingApp.search')}
          className="flex-1 px-3 py-2 border border-slate-300 rounded"
        />
        <button
          onClick={createNote}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          +
        </button>
      </div>

      <div className="card p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm text-slate-700">{t('tools.noteTakingApp.folders')}</span>
          <button
            onClick={() => setShowFolderInput(!showFolderInput)}
            className="text-blue-500 text-sm"
          >
            +
          </button>
        </div>
        {showFolderInput && (
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder={t('tools.noteTakingApp.newFolder')}
              className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              onKeyDown={(e) => e.key === 'Enter' && addFolder()}
            />
            <button onClick={addFolder} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
              {t('tools.noteTakingApp.add')}
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`px-3 py-1 rounded text-sm ${
              selectedFolder === null ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.noteTakingApp.all')} ({notes.length})
          </button>
          {folders.map(folder => {
            const count = notes.filter(n => n.folder === folder).length
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-3 max-h-[400px] overflow-y-auto">
          <h3 className="font-medium text-slate-700 mb-2">
            {t('tools.noteTakingApp.notes')} ({filteredNotes.length})
          </h3>
          {filteredNotes.length === 0 ? (
            <p className="text-center text-slate-500 py-4">{t('tools.noteTakingApp.noNotes')}</p>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-2 rounded cursor-pointer ${
                    selectedNote?.id === note.id ? 'bg-blue-100' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {note.isPinned && <span className="text-yellow-500">📌</span>}
                    <span className="font-medium text-sm truncate">{note.title}</span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {note.content.substring(0, 50) || t('tools.noteTakingApp.noContent')}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                    <span>{note.folder}</span>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-3">
          {selectedNote ? (
            <div className="space-y-3">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => updateNote('title', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
              />
              <div className="flex gap-2">
                <select
                  value={selectedNote.folder}
                  onChange={(e) => updateNote('folder', e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded text-sm"
                >
                  {folders.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <button
                  onClick={() => togglePin(selectedNote.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedNote.isPinned ? 'bg-yellow-100' : 'bg-slate-100'
                  }`}
                >
                  📌 {selectedNote.isPinned ? t('tools.noteTakingApp.unpin') : t('tools.noteTakingApp.pin')}
                </button>
              </div>
              <textarea
                value={selectedNote.content}
                onChange={(e) => updateNote('content', e.target.value)}
                placeholder={t('tools.noteTakingApp.startWriting')}
                className="w-full h-48 px-3 py-2 border border-slate-300 rounded resize-none text-sm"
              />
              <input
                type="text"
                value={selectedNote.tags.join(', ')}
                onChange={(e) => updateNote('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                placeholder={t('tools.noteTakingApp.tagsPlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{wordCount} {t('tools.noteTakingApp.words')}</span>
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="text-red-500"
                >
                  {t('tools.noteTakingApp.delete')}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">
              {t('tools.noteTakingApp.selectNote')}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="card p-2">
          <div className="font-bold">{notes.length}</div>
          <div className="text-xs text-slate-500">{t('tools.noteTakingApp.totalNotes')}</div>
        </div>
        <div className="card p-2">
          <div className="font-bold">{folders.length}</div>
          <div className="text-xs text-slate-500">{t('tools.noteTakingApp.folders')}</div>
        </div>
        <div className="card p-2">
          <div className="font-bold">{notes.filter(n => n.isPinned).length}</div>
          <div className="text-xs text-slate-500">{t('tools.noteTakingApp.pinned')}</div>
        </div>
      </div>
    </div>
  )
}
