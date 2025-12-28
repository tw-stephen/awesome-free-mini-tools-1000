import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TeamMember {
  id: number
  name: string
  role: string
  hoursPerWeek: number
  vacationDays: number
  otherCommitments: number
}

interface Sprint {
  startDate: string
  endDate: string
  workingDays: number
}

export default function TeamCapacityPlanner() {
  const { t } = useTranslation()
  const [sprintName, setSprintName] = useState('')
  const [sprint, setSprint] = useState<Sprint>({
    startDate: '',
    endDate: '',
    workingDays: 10
  })
  const [hoursPerDay, setHoursPerDay] = useState(8)
  const [focusFactor, setFocusFactor] = useState(80)
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 1, name: '', role: 'Developer', hoursPerWeek: 40, vacationDays: 0, otherCommitments: 0 },
    { id: 2, name: '', role: 'Developer', hoursPerWeek: 40, vacationDays: 0, otherCommitments: 0 },
  ])

  const addMember = () => {
    setMembers([...members, {
      id: Date.now(),
      name: '',
      role: 'Developer',
      hoursPerWeek: 40,
      vacationDays: 0,
      otherCommitments: 0
    }])
  }

  const updateMember = (id: number, field: keyof TeamMember, value: string | number) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const removeMember = (id: number) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id))
    }
  }

  const calculateSprintDays = () => {
    if (!sprint.startDate || !sprint.endDate) return
    const start = new Date(sprint.startDate)
    const end = new Date(sprint.endDate)
    let workDays = 0
    const current = new Date(start)
    while (current <= end) {
      const day = current.getDay()
      if (day !== 0 && day !== 6) workDays++
      current.setDate(current.getDate() + 1)
    }
    setSprint({ ...sprint, workingDays: workDays })
  }

  const getMemberCapacity = (member: TeamMember): number => {
    const dailyHours = member.hoursPerWeek / 5
    const availableDays = sprint.workingDays - member.vacationDays
    const totalHours = availableDays * dailyHours
    const afterCommitments = totalHours - member.otherCommitments
    const withFocus = afterCommitments * (focusFactor / 100)
    return Math.max(0, Math.round(withFocus))
  }

  const totalCapacity = members.reduce((sum, m) => sum + getMemberCapacity(m), 0)
  const avgCapacityPerDay = sprint.workingDays > 0 ? Math.round(totalCapacity / sprint.workingDays) : 0

  const roles = [...new Set(members.map(m => m.role))]

  const generateReport = (): string => {
    let text = `TEAM CAPACITY PLAN\\n${'='.repeat(50)}\\n\\n`
    text += `Sprint: ${sprintName || '[Sprint Name]'}\\n`
    text += `Duration: ${sprint.startDate || 'TBD'} to ${sprint.endDate || 'TBD'}\\n`
    text += `Working Days: ${sprint.workingDays}\\n`
    text += `Focus Factor: ${focusFactor}%\\n\\n`

    text += `TEAM CAPACITY\\n${'─'.repeat(30)}\\n`
    members.forEach(m => {
      const capacity = getMemberCapacity(m)
      text += `${m.name || '[Name]'} (${m.role}): ${capacity} hours\\n`
      if (m.vacationDays > 0) text += `  - Vacation: ${m.vacationDays} days\\n`
      if (m.otherCommitments > 0) text += `  - Other: ${m.otherCommitments} hours\\n`
    })

    text += `\\nSUMMARY\\n${'─'.repeat(30)}\\n`
    text += `Total Capacity: ${totalCapacity} hours\\n`
    text += `Avg Per Day: ${avgCapacityPerDay} hours\\n\\n`

    text += `BY ROLE\\n${'─'.repeat(30)}\\n`
    roles.forEach(role => {
      const roleMembers = members.filter(m => m.role === role)
      const roleCapacity = roleMembers.reduce((sum, m) => sum + getMemberCapacity(m), 0)
      text += `${role}: ${roleMembers.length} members, ${roleCapacity} hours\\n`
    })

    return text
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamCapacityPlanner.sprint')}</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Sprint Name</label>
            <input
              type="text"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              placeholder="e.g., Sprint 12"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Start Date</label>
            <input
              type="date"
              value={sprint.startDate}
              onChange={(e) => {
                setSprint({ ...sprint, startDate: e.target.value })
                if (sprint.endDate) calculateSprintDays()
              }}
              onBlur={calculateSprintDays}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">End Date</label>
            <input
              type="date"
              value={sprint.endDate}
              onChange={(e) => {
                setSprint({ ...sprint, endDate: e.target.value })
                if (sprint.startDate) calculateSprintDays()
              }}
              onBlur={calculateSprintDays}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Working Days</label>
            <input
              type="number"
              value={sprint.workingDays}
              onChange={(e) => setSprint({ ...sprint, workingDays: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamCapacityPlanner.settings')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Hours Per Day</label>
            <input
              type="number"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 8)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Focus Factor (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="50"
                max="100"
                value={focusFactor}
                onChange={(e) => setFocusFactor(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="w-12 text-center font-mono">{focusFactor}%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Account for meetings, interruptions, etc.
            </p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{t('tools.teamCapacityPlanner.team')}</h3>
          <button
            onClick={addMember}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add Member
          </button>
        </div>

        <div className="space-y-3">
          {members.map((member) => {
            const capacity = getMemberCapacity(member)
            return (
              <div key={member.id} className="p-4 bg-slate-50 rounded">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                    placeholder="Name"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  <select
                    value={member.role}
                    onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="QA">QA</option>
                    <option value="Lead">Lead</option>
                    <option value="PM">PM</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    onClick={() => removeMember(member.id)}
                    className="px-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Hours/Week</label>
                    <input
                      type="number"
                      value={member.hoursPerWeek}
                      onChange={(e) => updateMember(member.id, 'hoursPerWeek', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Vacation Days</label>
                    <input
                      type="number"
                      value={member.vacationDays}
                      onChange={(e) => updateMember(member.id, 'vacationDays', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Other (hrs)</label>
                    <input
                      type="number"
                      value={member.otherCommitments}
                      onChange={(e) => updateMember(member.id, 'otherCommitments', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Capacity</label>
                    <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-center font-medium">
                      {capacity} hrs
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{totalCapacity}</p>
          <p className="text-sm text-slate-500">Total Hours</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{avgCapacityPerDay}</p>
          <p className="text-sm text-slate-500">Avg Hours/Day</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{members.length}</p>
          <p className="text-sm text-slate-500">Team Members</p>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamCapacityPlanner.byRole')}</h3>
        <div className="space-y-2">
          {roles.map(role => {
            const roleMembers = members.filter(m => m.role === role)
            const roleCapacity = roleMembers.reduce((sum, m) => sum + getMemberCapacity(m), 0)
            const percentage = totalCapacity > 0 ? Math.round((roleCapacity / totalCapacity) * 100) : 0
            return (
              <div key={role} className="flex items-center gap-3">
                <span className="w-24 text-sm">{role}</span>
                <div className="flex-1 bg-slate-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-24 text-sm text-right">{roleCapacity}h ({percentage}%)</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamCapacityPlanner.report')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generateReport()}
        </pre>
        <button
          onClick={copyReport}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.teamCapacityPlanner.copy')}
        </button>
      </div>
    </div>
  )
}
