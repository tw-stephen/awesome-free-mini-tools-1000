import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TeamMember {
  id: number
  name: string
  capacity: number
  tasks: { name: string; hours: number }[]
}

export default function WorkloadBalancer() {
  const { t } = useTranslation()
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 1, name: 'Alice', capacity: 40, tasks: [] },
    { id: 2, name: 'Bob', capacity: 40, tasks: [] },
    { id: 3, name: 'Charlie', capacity: 40, tasks: [] },
  ])
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskHours, setNewTaskHours] = useState(8)
  const [selectedMember, setSelectedMember] = useState<number | null>(null)

  const addMember = () => {
    setMembers([...members, {
      id: Date.now(),
      name: '',
      capacity: 40,
      tasks: []
    }])
  }

  const updateMember = (id: number, field: 'name' | 'capacity', value: string | number) => {
    setMembers(members.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ))
  }

  const removeMember = (id: number) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id))
    }
  }

  const addTask = () => {
    if (!newTaskName.trim() || selectedMember === null) return
    setMembers(members.map(m => {
      if (m.id === selectedMember) {
        return { ...m, tasks: [...m.tasks, { name: newTaskName.trim(), hours: newTaskHours }] }
      }
      return m
    }))
    setNewTaskName('')
    setNewTaskHours(8)
  }

  const removeTask = (memberId: number, taskIndex: number) => {
    setMembers(members.map(m => {
      if (m.id === memberId) {
        return { ...m, tasks: m.tasks.filter((_, i) => i !== taskIndex) }
      }
      return m
    }))
  }

  const getWorkload = (m: TeamMember): number => {
    return m.tasks.reduce((sum, t) => sum + t.hours, 0)
  }

  const getUtilization = (m: TeamMember): number => {
    if (m.capacity === 0) return 0
    return Math.round((getWorkload(m) / m.capacity) * 100)
  }

  const getStatusColor = (util: number): string => {
    if (util > 100) return 'bg-red-500'
    if (util > 80) return 'bg-yellow-500'
    if (util > 50) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const totalCapacity = members.reduce((sum, m) => sum + m.capacity, 0)
  const totalWorkload = members.reduce((sum, m) => sum + getWorkload(m), 0)
  const avgUtilization = totalCapacity > 0 ? Math.round((totalWorkload / totalCapacity) * 100) : 0

  const generateReport = (): string => {
    let text = `WORKLOAD BALANCE REPORT\\n${'='.repeat(50)}\\n\\n`
    text += `Team Overview\\n${'─'.repeat(30)}\\n`
    text += `Total Capacity: ${totalCapacity} hours\\n`
    text += `Total Workload: ${totalWorkload} hours\\n`
    text += `Average Utilization: ${avgUtilization}%\\n\\n`

    members.forEach(m => {
      const util = getUtilization(m)
      const workload = getWorkload(m)
      const status = util > 100 ? '⚠️ OVERLOADED' : util > 80 ? '⚡ HIGH' : '✓ OK'
      text += `${m.name || '[Name]'} ${status}\\n${'─'.repeat(30)}\\n`
      text += `Capacity: ${m.capacity}h | Workload: ${workload}h | ${util}%\\n`
      if (m.tasks.length > 0) {
        text += 'Tasks:\\n'
        m.tasks.forEach(t => {
          text += `  • ${t.name} (${t.hours}h)\\n`
        })
      }
      text += '\\n'
    })

    return text
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.workloadBalancer.overview')}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded">
            <p className="text-2xl font-bold">{members.length}</p>
            <p className="text-sm text-slate-500">Team Members</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded">
            <p className="text-2xl font-bold">{totalWorkload}h</p>
            <p className="text-sm text-slate-500">Total Workload</p>
          </div>
          <div className={`text-center p-3 rounded ${
            avgUtilization > 100 ? 'bg-red-100' : avgUtilization > 80 ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
            <p className="text-2xl font-bold">{avgUtilization}%</p>
            <p className="text-sm text-slate-500">Avg Utilization</p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.workloadBalancer.addTask')}</h3>
        <div className="flex gap-2">
          <select
            value={selectedMember || ''}
            onChange={(e) => setSelectedMember(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            <option value="">Select member</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name || 'Unnamed'}</option>
            ))}
          </select>
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Task name"
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="number"
            value={newTaskHours}
            onChange={(e) => setNewTaskHours(parseInt(e.target.value) || 0)}
            className="w-20 px-3 py-2 border border-slate-300 rounded"
          />
          <span className="py-2 text-slate-500">hrs</span>
          <button
            onClick={addTask}
            disabled={!selectedMember || !newTaskName.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.workloadBalancer.team')}</h3>
          <button
            onClick={addMember}
            className="px-3 py-1 text-sm bg-slate-100 rounded hover:bg-slate-200"
          >
            + Add Member
          </button>
        </div>
        <div className="space-y-4">
          {members.map((member) => {
            const util = getUtilization(member)
            const workload = getWorkload(member)
            return (
              <div key={member.id} className="p-4 bg-slate-50 rounded">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                    placeholder="Member name"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={member.capacity}
                      onChange={(e) => updateMember(member.id, 'capacity', parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-slate-300 rounded"
                    />
                    <span className="text-slate-500">h capacity</span>
                  </div>
                  <button
                    onClick={() => removeMember(member.id)}
                    className="px-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{workload}h / {member.capacity}h</span>
                    <span className={util > 100 ? 'text-red-600' : util > 80 ? 'text-yellow-600' : 'text-green-600'}>
                      {util}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${getStatusColor(util)}`}
                      style={{ width: `${Math.min(util, 100)}%` }}
                    />
                  </div>
                </div>

                {member.tasks.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {member.tasks.map((task, i) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                        <span>{task.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">{task.hours}h</span>
                          <button
                            onClick={() => removeTask(member.id, i)}
                            className="text-red-400 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.workloadBalancer.report')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generateReport()}
        </pre>
        <button
          onClick={copyReport}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.workloadBalancer.copy')}
        </button>
      </div>
    </div>
  )
}
