import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Note {
  id: number
  title: string
  date: string
  cues: string
  notes: string
  summary: string
}

export default function CornellNotes() {
  const { t } = useTranslation()
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [mode, setMode] = useState<'list' | 'edit'>('list')

  useEffect(() => {
    const saved = localStorage.getItem('cornell-notes')
    if (saved) {
      try {
        setNotes(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load notes')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cornell-notes', JSON.stringify(notes))
  }, [notes])

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: t('tools.cornellNotes.untitled'),
      date: new Date().toISOString().split('T')[0],
      cues: '',
      notes: '',
      summary: '',
    }
    setCurrentNote(newNote)
    setMode('edit')
  }

  const saveNote = () => {
    if (currentNote) {
      const existing = notes.find(n => n.id === currentNote.id)
      if (existing) {
        setNotes(notes.map(n => n.id === currentNote.id ? currentNote : n))
      } else {
        setNotes([currentNote, ...notes])
      }
      setMode('list')
    }
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  const editNote = (note: Note) => {
    setCurrentNote(note)
    setMode('edit')
  }

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={createNewNote}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.cornellNotes.newNote')}
          </button>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.cornellNotes.about')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('tools.cornellNotes.description')}
            </p>
          </div>

          {notes.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.cornellNotes.noNotes')}
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map(note => (
                <div key={note.id} className="card p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 cursor-pointer" onClick={() => editNote(note)}>
                      <div className="font-medium">{note.title}</div>
                      <div className="text-xs text-slate-400">{note.date}</div>
                      {note.summary && (
                        <div className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {note.summary}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-500 ml-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'edit' && currentNote && (
        <>
          <div className="card p-4">
            <input
              type="text"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              placeholder={t('tools.cornellNotes.title')}
              className="w-full px-3 py-2 border border-slate-300 rounded font-medium text-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1 card p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('tools.cornellNotes.cues')}
              </label>
              <textarea
                value={currentNote.cues}
                onChange={(e) => setCurrentNote({ ...currentNote, cues: e.target.value })}
                placeholder={t('tools.cornellNotes.cuesPlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
                rows={12}
              />
            </div>

            <div className="col-span-2 card p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('tools.cornellNotes.notes')}
              </label>
              <textarea
                value={currentNote.notes}
                onChange={(e) => setCurrentNote({ ...currentNote, notes: e.target.value })}
                placeholder={t('tools.cornellNotes.notesPlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
                rows={12}
              />
            </div>
          </div>

          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.cornellNotes.summary')}
            </label>
            <textarea
              value={currentNote.summary}
              onChange={(e) => setCurrentNote({ ...currentNote, summary: e.target.value })}
              placeholder={t('tools.cornellNotes.summaryPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode('list')}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={saveNote}
              className="flex-1 py-2 bg-blue-500 text-white rounded"
            >
              {t('tools.cornellNotes.save')}
            </button>
          </div>

          <div className="card p-4 bg-blue-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.cornellNotes.howToUse')}
            </h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p><strong>{t('tools.cornellNotes.cues')}:</strong> {t('tools.cornellNotes.cuesTip')}</p>
              <p><strong>{t('tools.cornellNotes.notes')}:</strong> {t('tools.cornellNotes.notesTip')}</p>
              <p><strong>{t('tools.cornellNotes.summary')}:</strong> {t('tools.cornellNotes.summaryTip')}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
