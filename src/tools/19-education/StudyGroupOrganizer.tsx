import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Member {
  id: number
  name: string
  email: string
  role: string
}

interface Meeting {
  id: number
  date: string
  time: string
  location: string
  topic: string
  notes: string
}

interface StudyGroup {
  id: number
  name: string
  subject: string
  members: Member[]
  meetings: Meeting[]
}

export default function StudyGroupOrganizer() {
  const { t } = useTranslation()
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [showGroupForm, setShowGroupForm] = useState(false)
  const [newGroup, setNewGroup] = useState({ name: '', subject: '' })
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Member' })
  const [newMeeting, setNewMeeting] = useState({ date: '', time: '', location: '', topic: '', notes: '' })

  const roles = ['Leader', 'Co-leader', 'Note-taker', 'Member']

  const addGroup = () => {
    if (!newGroup.name.trim()) return
    setGroups([...groups, {
      ...newGroup,
      id: Date.now(),
      members: [],
      meetings: [],
    }])
    setNewGroup({ name: '', subject: '' })
    setShowGroupForm(false)
  }

  const removeGroup = (id: number) => {
    setGroups(groups.filter(g => g.id !== id))
    if (selectedGroup === id) setSelectedGroup(null)
  }

  const addMember = () => {
    if (!selectedGroup || !newMember.name.trim()) return
    setGroups(groups.map(g => {
      if (g.id !== selectedGroup) return g
      return {
        ...g,
        members: [...g.members, { ...newMember, id: Date.now() }],
      }
    }))
    setNewMember({ name: '', email: '', role: 'Member' })
  }

  const removeMember = (memberId: number) => {
    if (!selectedGroup) return
    setGroups(groups.map(g => {
      if (g.id !== selectedGroup) return g
      return {
        ...g,
        members: g.members.filter(m => m.id !== memberId),
      }
    }))
  }

  const addMeeting = () => {
    if (!selectedGroup || !newMeeting.date || !newMeeting.topic) return
    setGroups(groups.map(g => {
      if (g.id !== selectedGroup) return g
      return {
        ...g,
        meetings: [...g.meetings, { ...newMeeting, id: Date.now() }],
      }
    }))
    setNewMeeting({ date: '', time: '', location: '', topic: '', notes: '' })
  }

  const removeMeeting = (meetingId: number) => {
    if (!selectedGroup) return
    setGroups(groups.map(g => {
      if (g.id !== selectedGroup) return g
      return {
        ...g,
        meetings: g.meetings.filter(m => m.id !== meetingId),
      }
    }))
  }

  const currentGroup = groups.find(g => g.id === selectedGroup)

  const exportGroup = () => {
    if (!currentGroup) return
    let text = `Study Group: ${currentGroup.name}\n`
    text += `Subject: ${currentGroup.subject}\n\n`
    text += `Members:\n`
    currentGroup.members.forEach(m => {
      text += `- ${m.name} (${m.role})${m.email ? ` - ${m.email}` : ''}\n`
    })
    text += `\nUpcoming Meetings:\n`
    currentGroup.meetings.forEach(m => {
      text += `- ${m.date} ${m.time} at ${m.location}: ${m.topic}\n`
      if (m.notes) text += `  Notes: ${m.notes}\n`
    })
    navigator.clipboard.writeText(text)
  }

  if (selectedGroup && currentGroup) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{currentGroup.name}</h2>
            {currentGroup.subject && (
              <div className="text-sm text-slate-500">{currentGroup.subject}</div>
            )}
          </div>
          <button onClick={() => setSelectedGroup(null)} className="text-blue-500">
            Back to Groups
          </button>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.studyGroupOrganizer.members')} ({currentGroup.members.length})</h3>
          </div>
          <div className="space-y-2 mb-4">
            {currentGroup.members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div>
                  <span className="font-medium">{member.name}</span>
                  <span className="text-sm text-slate-500 ml-2">({member.role})</span>
                  {member.email && (
                    <div className="text-xs text-slate-400">{member.email}</div>
                  )}
                </div>
                <button onClick={() => removeMember(member.id)} className="text-red-400 hover:text-red-600">
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              placeholder="Name"
              className="px-2 py-1 border border-slate-300 rounded text-sm"
            />
            <input
              type="email"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              placeholder="Email"
              className="px-2 py-1 border border-slate-300 rounded text-sm"
            />
            <div className="flex gap-1">
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <button
                onClick={addMember}
                disabled={!newMember.name.trim()}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:bg-slate-300"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.studyGroupOrganizer.meetings')}</h3>
          <div className="space-y-2 mb-4">
            {currentGroup.meetings.map(meeting => (
              <div key={meeting.id} className="p-3 bg-slate-50 rounded">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{meeting.topic}</div>
                    <div className="text-sm text-slate-500">
                      {new Date(meeting.date).toLocaleDateString()}
                      {meeting.time && ` at ${meeting.time}`}
                      {meeting.location && ` • ${meeting.location}`}
                    </div>
                    {meeting.notes && (
                      <div className="text-xs text-slate-400 mt-1">{meeting.notes}</div>
                    )}
                  </div>
                  <button onClick={() => removeMeeting(meeting.id)} className="text-red-400 hover:text-red-600">
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                className="px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <input
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                className="px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={newMeeting.location}
                onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                placeholder="Location"
                className="px-2 py-1 border border-slate-300 rounded text-sm"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMeeting.topic}
                onChange={(e) => setNewMeeting({ ...newMeeting, topic: e.target.value })}
                placeholder="Meeting topic"
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={addMeeting}
                disabled={!newMeeting.date || !newMeeting.topic}
                className="px-4 py-1 bg-blue-500 text-white rounded text-sm disabled:bg-slate-300"
              >
                Add Meeting
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={exportGroup}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
        >
          {t('tools.studyGroupOrganizer.export')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!showGroupForm && (
        <button
          onClick={() => setShowGroupForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.studyGroupOrganizer.createGroup')}
        </button>
      )}

      {showGroupForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.studyGroupOrganizer.createGroup')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              placeholder="Group name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={newGroup.subject}
              onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
              placeholder="Subject (optional)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={addGroup}
                disabled={!newGroup.name.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Create Group
              </button>
              <button
                onClick={() => setShowGroupForm(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {groups.map(group => (
          <div
            key={group.id}
            className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedGroup(group.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{group.name}</div>
                {group.subject && (
                  <div className="text-sm text-slate-500">{group.subject}</div>
                )}
                <div className="text-xs text-slate-400 mt-1">
                  {group.members.length} members • {group.meetings.length} meetings
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeGroup(group.id) }}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && !showGroupForm && (
        <div className="card p-8 text-center text-slate-500">
          Create a study group to get started
        </div>
      )}
    </div>
  )
}
