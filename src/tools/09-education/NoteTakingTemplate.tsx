import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Template {
  id: string
  name: string
  sections: string[]
}

interface Note {
  id: number
  templateId: string
  title: string
  content: Record<string, string>
  date: string
}

export default function NoteTakingTemplate() {
  const { t } = useTranslation()
  const [notes, setNotes] = useState<Note[]>([])
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [currentNote, setCurrentNote] = useState<Note | null>(null)

  const templates: Template[] = [
    { id: 'lecture', name: t('tools.noteTakingTemplate.lecture'), sections: ['topic', 'keyPoints', 'questions', 'summary'] },
    { id: 'meeting', name: t('tools.noteTakingTemplate.meeting'), sections: ['attendees', 'agenda', 'discussion', 'actionItems'] },
    { id: 'book', name: t('tools.noteTakingTemplate.book'), sections: ['chapter', 'mainIdeas', 'quotes', 'reflection'] },
    { id: 'research', name: t('tools.noteTakingTemplate.research'), sections: ['source', 'hypothesis', 'findings', 'conclusion'] },
    { id: 'project', name: t('tools.noteTakingTemplate.project'), sections: ['objective', 'tasks', 'progress', 'nextSteps'] },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('note-templates')
    if (saved) {
      try {
        setNotes(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load notes')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('note-templates', JSON.stringify(notes))
  }, [notes])

  const createNewNote = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return

    const newNote: Note = {
      id: Date.now(),
      templateId,
      title: '',
      content: template.sections.reduce((acc, s) => ({ ...acc, [s]: '' }), {}),
      date: new Date().toISOString().split('T')[0],
    }
    setCurrentNote(newNote)
    setMode('edit')
  }

  const saveNote = () => {
    if (!currentNote) return

    const existing = notes.find(n => n.id === currentNote.id)
    if (existing) {
      setNotes(notes.map(n => n.id === currentNote.id ? currentNote : n))
    } else {
      setNotes([currentNote, ...notes])
    }
    setMode('list')
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  const getTemplate = (templateId: string) => templates.find(t => t.id === templateId)

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.noteTakingTemplate.selectTemplate')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => createNewNote(template.id)}
                  className="p-3 bg-slate-50 rounded hover:bg-slate-100 text-left"
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-slate-500">
                    {template.sections.length} {t('tools.noteTakingTemplate.sections')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.noteTakingTemplate.noNotes')}
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700">
                {t('tools.noteTakingTemplate.savedNotes')}
              </h3>
              {notes.map(note => {
                const template = getTemplate(note.templateId)
                return (
                  <div key={note.id} className="card p-4">
                    <div className="flex justify-between items-start">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => { setCurrentNote(note); setMode('edit') }}
                      >
                        <div className="font-medium">
                          {note.title || t('tools.noteTakingTemplate.untitled')}
                        </div>
                        <div className="text-xs text-slate-400">
                          {template?.name} • {note.date}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              })}
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
              placeholder={t('tools.noteTakingTemplate.noteTitle')}
              className="w-full px-3 py-2 border border-slate-300 rounded font-medium text-lg"
            />
          </div>

          {getTemplate(currentNote.templateId)?.sections.map(section => (
            <div key={section} className="card p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t(`tools.noteTakingTemplate.${section}`)}
              </label>
              <textarea
                value={currentNote.content[section] || ''}
                onChange={(e) => setCurrentNote({
                  ...currentNote,
                  content: { ...currentNote.content, [section]: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
                rows={4}
              />
            </div>
          ))}

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
              {t('tools.noteTakingTemplate.save')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
