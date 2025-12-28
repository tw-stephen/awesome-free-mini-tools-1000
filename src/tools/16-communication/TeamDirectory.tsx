import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TeamMember {
  id: number
  name: string
  role: string
  email: string
  department: string
}

export default function TeamDirectory() {
  const { t } = useTranslation()
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 1, name: '', role: '', email: '', department: '' },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDept, setFilterDept] = useState('')

  const addMember = () => {
    setMembers([...members, { id: Date.now(), name: '', role: '', email: '', department: '' }])
  }

  const updateMember = (id: number, field: keyof TeamMember, value: string) => {
    setMembers(members.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ))
  }

  const removeMember = (id: number) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id))
    }
  }

  const departments = [...new Set(members.map(m => m.department).filter(Boolean))]

  const filteredMembers = members.filter(m => {
    const matchesSearch = !searchTerm ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !filterDept || m.department === filterDept
    return matchesSearch && matchesDept
  })

  const generateDirectory = (): string => {
    let dir = `TEAM DIRECTORY\n${'='.repeat(50)}\n\n`

    const grouped = members.reduce((acc, m) => {
      const dept = m.department || 'Unassigned'
      if (!acc[dept]) acc[dept] = []
      acc[dept].push(m)
      return acc
    }, {} as Record<string, TeamMember[]>)

    Object.entries(grouped).forEach(([dept, members]) => {
      if (members.some(m => m.name)) {
        dir += `${dept}\n${'─'.repeat(30)}\n`
        members.forEach(m => {
          if (m.name) {
            dir += `• ${m.name}`
            if (m.role) dir += ` - ${m.role}`
            if (m.email) dir += `\n  Email: ${m.email}`
            dir += '\n\n'
          }
        })
      }
    })

    return dir
  }

  const copyDirectory = () => {
    navigator.clipboard.writeText(generateDirectory())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          {departments.length > 0 && (
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.teamDirectory.members')}</h3>
          <span className="text-sm text-slate-500">
            {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <div key={member.id} className="p-3 bg-slate-50 rounded space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                  placeholder="Name"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                  placeholder="Role/Title"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
                <button
                  onClick={() => removeMember(member.id)}
                  className="px-2 text-red-500 hover:bg-red-50 rounded"
                >
                  X
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={member.email}
                  onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                  placeholder="Email"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
                <input
                  type="text"
                  value={member.department}
                  onChange={(e) => updateMember(member.id, 'department', e.target.value)}
                  placeholder="Department"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addMember}
          className="w-full mt-3 py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500"
        >
          + {t('tools.teamDirectory.addMember')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamDirectory.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">
          {generateDirectory()}
        </pre>
        <button
          onClick={copyDirectory}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.teamDirectory.copy')}
        </button>
      </div>
    </div>
  )
}
