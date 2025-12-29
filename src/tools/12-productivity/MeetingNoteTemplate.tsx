import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface MeetingNote {
  id: string
  title: string
  date: string
  attendees: string
  agenda: string
  notes: string
  actionItems: string
  decisions: string
  nextSteps: string
  createdAt: string
}

export default function MeetingNoteTemplate() {
  const { t } = useTranslation()
  const [notes, setNotes] = useState<MeetingNote[]>([])
  const [currentNote, setCurrentNote] = useState<MeetingNote | null>(null)
  const [showList, setShowList] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('meeting-notes')
    if (saved) setNotes(JSON.parse(saved))
  }, [])

  const saveNotes = (updated: MeetingNote[]) => {
    setNotes(updated)
    localStorage.setItem('meeting-notes', JSON.stringify(updated))
  }

  const createNew = () => {
    const note: MeetingNote = {
      id: Date.now().toString(),
      title: '',
      date: new Date().toISOString().split('T')[0],
      attendees: '',
      agenda: '',
      notes: '',
      actionItems: '',
      decisions: '',
      nextSteps: '',
      createdAt: new Date().toISOString()
    }
    setCurrentNote(note)
    setShowList(false)
  }

  const saveCurrentNote = () => {
    if (!currentNote) return
    const existing = notes.find(n => n.id === currentNote.id)
    let updated: MeetingNote[]
    if (existing) {
      updated = notes.map(n => n.id === currentNote.id ? currentNote : n)
    } else {
      updated = [currentNote, ...notes]
    }
    saveNotes(updated)
  }

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id)
    saveNotes(updated)
    if (currentNote?.id === id) {
      setCurrentNote(null)
      setShowList(true)
    }
  }

  const updateField = (field: keyof MeetingNote, value: string) => {
    if (!currentNote) return
    setCurrentNote({ ...currentNote, [field]: value })
  }

  const exportNote = () => {
    if (!currentNote) return
    let text = `# ${currentNote.title || 'Meeting Notes'}\n\n`
    text += `**Date:** ${currentNote.date}\n\n`
    text += `**Attendees:**\n${currentNote.attendees}\n\n`
    text += `## Agenda\n${currentNote.agenda}\n\n`
    text += `## Discussion Notes\n${currentNote.notes}\n\n`
    text += `## Decisions Made\n${currentNote.decisions}\n\n`
    text += `## Action Items\n${currentNote.actionItems}\n\n`
    text += `## Next Steps\n${currentNote.nextSteps}\n`

    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meeting-notes-${currentNote.date}.md`
    a.click()
  }

  const copyToClipboard = async () => {
    if (!currentNote) return
    let text = `${currentNote.title || 'Meeting Notes'}\n\n`
    text += `Date: ${currentNote.date}\n\n`
    text += `Attendees:\n${currentNote.attendees}\n\n`
    text += `Agenda:\n${currentNote.agenda}\n\n`
    text += `Notes:\n${currentNote.notes}\n\n`
    text += `Decisions:\n${currentNote.decisions}\n\n`
    text += `Action Items:\n${currentNote.actionItems}\n\n`
    text += `Next Steps:\n${currentNote.nextSteps}`

    await navigator.clipboard.writeText(text)
    alert(t('tools.meetingNoteTemplate.copied'))
  }

  if (showList) {
    return (
      <div className="space-y-4">
        <button
          onClick={createNew}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
        >
          {t('tools.meetingNoteTemplate.newNote')}
        </button>

        <div className="space-y-2">
          {notes.length === 0 ? (
            <div className="card p-8 text-center text-slate-400">
              {t('tools.meetingNoteTemplate.noNotes')}
            </div>
          ) : (
            notes.map(note => (
              <div key={note.id} className="card p-3">
                <div className="flex justify-between items-start">
                  <button
                    onClick={() => {
                      setCurrentNote(note)
                      setShowList(false)
                    }}
                    className="text-left flex-1"
                  >
                    <div className="font-medium">{note.title || t('tools.meetingNoteTemplate.untitled')}</div>
                    <div className="text-sm text-slate-500">{note.date}</div>
                    {note.attendees && (
                      <div className="text-xs text-slate-400 truncate">{note.attendees}</div>
                    )}
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-500 text-sm ml-2"
                  >
                    {t('tools.meetingNoteTemplate.delete')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => {
            saveCurrentNote()
            setShowList(true)
          }}
          className="flex-1 py-2 bg-slate-100 rounded"
        >
          {t('tools.meetingNoteTemplate.backToList')}
        </button>
        <button
          onClick={saveCurrentNote}
          className="flex-1 py-2 bg-green-500 text-white rounded"
        >
          {t('tools.meetingNoteTemplate.save')}
        </button>
      </div>

      <div className="card p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.meetingNoteTemplate.title')}
          </label>
          <input
            type="text"
            value={currentNote?.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder={t('tools.meetingNoteTemplate.titlePlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">
              {t('tools.meetingNoteTemplate.date')}
            </label>
            <input
              type="date"
              value={currentNote?.date || ''}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.meetingNoteTemplate.attendees')}
          </label>
          <textarea
            value={currentNote?.attendees || ''}
            onChange={(e) => updateField('attendees', e.target.value)}
            placeholder={t('tools.meetingNoteTemplate.attendeesPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-16"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.meetingNoteTemplate.agenda')}
          </label>
          <textarea
            value={currentNote?.agenda || ''}
            onChange={(e) => updateField('agenda', e.target.value)}
            placeholder={t('tools.meetingNoteTemplate.agendaPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-24"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.meetingNoteTemplate.notes')}
          </label>
          <textarea
            value={currentNote?.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder={t('tools.meetingNoteTemplate.notesPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-32"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.meetingNoteTemplate.decisions')}
          </label>
          <textarea
            value={currentNote?.decisions || ''}
            onChange={(e) => updateField('decisions', e.target.value)}
            placeholder={t('tools.meetingNoteTemplate.decisionsPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-20"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.meetingNoteTemplate.actionItems')}
          </label>
          <textarea
            value={currentNote?.actionItems || ''}
            onChange={(e) => updateField('actionItems', e.target.value)}
            placeholder={t('tools.meetingNoteTemplate.actionItemsPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-24"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.meetingNoteTemplate.nextSteps')}
          </label>
          <textarea
            value={currentNote?.nextSteps || ''}
            onChange={(e) => updateField('nextSteps', e.target.value)}
            placeholder={t('tools.meetingNoteTemplate.nextStepsPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-20"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyToClipboard}
          className="flex-1 py-2 bg-slate-100 rounded"
        >
          {t('tools.meetingNoteTemplate.copy')}
        </button>
        <button
          onClick={exportNote}
          className="flex-1 py-2 bg-blue-500 text-white rounded"
        >
          {t('tools.meetingNoteTemplate.export')}
        </button>
      </div>
    </div>
  )
}
