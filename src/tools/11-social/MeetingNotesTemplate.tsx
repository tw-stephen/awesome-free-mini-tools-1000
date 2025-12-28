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
  nextMeeting: string
}

export default function MeetingNotesTemplate() {
  const { t } = useTranslation()
  const [meetings, setMeetings] = useState<MeetingNote[]>([])
  const [currentMeeting, setCurrentMeeting] = useState<MeetingNote>({
    id: '',
    title: '',
    date: new Date().toISOString().slice(0, 16),
    attendees: '',
    agenda: '',
    notes: '',
    actionItems: '',
    decisions: '',
    nextMeeting: ''
  })
  const [mode, setMode] = useState<'list' | 'edit'>('list')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('meeting-notes')
    if (saved) setMeetings(JSON.parse(saved))
  }, [])

  const saveMeetings = (updated: MeetingNote[]) => {
    setMeetings(updated)
    localStorage.setItem('meeting-notes', JSON.stringify(updated))
  }

  const newMeeting = () => {
    setCurrentMeeting({
      id: Date.now().toString(),
      title: '',
      date: new Date().toISOString().slice(0, 16),
      attendees: '',
      agenda: '',
      notes: '',
      actionItems: '',
      decisions: '',
      nextMeeting: ''
    })
    setMode('edit')
  }

  const editMeeting = (meeting: MeetingNote) => {
    setCurrentMeeting(meeting)
    setMode('edit')
  }

  const saveMeeting = () => {
    const existing = meetings.find(m => m.id === currentMeeting.id)
    if (existing) {
      saveMeetings(meetings.map(m => m.id === currentMeeting.id ? currentMeeting : m))
    } else {
      saveMeetings([...meetings, currentMeeting])
    }
    setMode('list')
  }

  const deleteMeeting = (id: string) => {
    saveMeetings(meetings.filter(m => m.id !== id))
  }

  const formatNotes = () => {
    return `
# ${currentMeeting.title || 'Meeting Notes'}

**Date:** ${new Date(currentMeeting.date).toLocaleString()}

## Attendees
${currentMeeting.attendees || 'N/A'}

## Agenda
${currentMeeting.agenda || 'N/A'}

## Discussion Notes
${currentMeeting.notes || 'N/A'}

## Decisions Made
${currentMeeting.decisions || 'N/A'}

## Action Items
${currentMeeting.actionItems || 'N/A'}

## Next Meeting
${currentMeeting.nextMeeting || 'TBD'}
    `.trim()
  }

  const copyNotes = () => {
    navigator.clipboard.writeText(formatNotes())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadNotes = () => {
    const blob = new Blob([formatNotes()], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${currentMeeting.title || 'meeting-notes'}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={newMeeting}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.meetingNotesTemplate.newMeeting')}
          </button>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.meetingNotesTemplate.recentMeetings')}
            </h3>
            {meetings.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                {t('tools.meetingNotesTemplate.noMeetings')}
              </p>
            ) : (
              <div className="space-y-2">
                {meetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(meeting => (
                  <div
                    key={meeting.id}
                    className="p-3 bg-slate-50 rounded flex items-center justify-between cursor-pointer hover:bg-slate-100"
                    onClick={() => editMeeting(meeting)}
                  >
                    <div>
                      <div className="font-medium">{meeting.title || t('tools.meetingNotesTemplate.untitled')}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(meeting.date).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteMeeting(meeting.id) }}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {mode === 'edit' && (
        <>
          <button
            onClick={() => setMode('list')}
            className="flex items-center gap-2 text-blue-500"
          >
            ← {t('tools.meetingNotesTemplate.backToList')}
          </button>

          <div className="card p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.meetingNotesTemplate.title')}
                </label>
                <input
                  type="text"
                  value={currentMeeting.title}
                  onChange={(e) => setCurrentMeeting({ ...currentMeeting, title: e.target.value })}
                  placeholder={t('tools.meetingNotesTemplate.titlePlaceholder')}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.meetingNotesTemplate.date')}
                </label>
                <input
                  type="datetime-local"
                  value={currentMeeting.date}
                  onChange={(e) => setCurrentMeeting({ ...currentMeeting, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.meetingNotesTemplate.attendees')}
              </label>
              <input
                type="text"
                value={currentMeeting.attendees}
                onChange={(e) => setCurrentMeeting({ ...currentMeeting, attendees: e.target.value })}
                placeholder={t('tools.meetingNotesTemplate.attendeesPlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.meetingNotesTemplate.agenda')}
              </label>
              <textarea
                value={currentMeeting.agenda}
                onChange={(e) => setCurrentMeeting({ ...currentMeeting, agenda: e.target.value })}
                placeholder={t('tools.meetingNotesTemplate.agendaPlaceholder')}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.meetingNotesTemplate.notes')}
              </label>
              <textarea
                value={currentMeeting.notes}
                onChange={(e) => setCurrentMeeting({ ...currentMeeting, notes: e.target.value })}
                placeholder={t('tools.meetingNotesTemplate.notesPlaceholder')}
                rows={5}
                className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.meetingNotesTemplate.decisions')}
              </label>
              <textarea
                value={currentMeeting.decisions}
                onChange={(e) => setCurrentMeeting({ ...currentMeeting, decisions: e.target.value })}
                placeholder={t('tools.meetingNotesTemplate.decisionsPlaceholder')}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.meetingNotesTemplate.actionItems')}
              </label>
              <textarea
                value={currentMeeting.actionItems}
                onChange={(e) => setCurrentMeeting({ ...currentMeeting, actionItems: e.target.value })}
                placeholder={t('tools.meetingNotesTemplate.actionItemsPlaceholder')}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.meetingNotesTemplate.nextMeeting')}
              </label>
              <input
                type="text"
                value={currentMeeting.nextMeeting}
                onChange={(e) => setCurrentMeeting({ ...currentMeeting, nextMeeting: e.target.value })}
                placeholder={t('tools.meetingNotesTemplate.nextMeetingPlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={saveMeeting}
              className="flex-1 py-3 bg-blue-500 text-white rounded font-medium"
            >
              {t('tools.meetingNotesTemplate.save')}
            </button>
            <button
              onClick={copyNotes}
              className="px-4 py-3 bg-slate-100 rounded"
            >
              {copied ? '✓' : t('tools.meetingNotesTemplate.copy')}
            </button>
            <button
              onClick={downloadNotes}
              className="px-4 py-3 bg-slate-100 rounded"
            >
              {t('tools.meetingNotesTemplate.download')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
