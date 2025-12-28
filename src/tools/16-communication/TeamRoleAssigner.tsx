import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Role {
  id: number
  name: string
  responsibilities: string
  assignee: string
}

export default function TeamRoleAssigner() {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('')
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: 'Project Lead', responsibilities: 'Overall coordination and decision making', assignee: '' },
    { id: 2, name: 'Developer', responsibilities: 'Implementation and coding', assignee: '' },
    { id: 3, name: 'Designer', responsibilities: 'UI/UX design', assignee: '' },
  ])

  const addRole = () => {
    setRoles([...roles, { id: Date.now(), name: '', responsibilities: '', assignee: '' }])
  }

  const updateRole = (id: number, field: keyof Role, value: string) => {
    setRoles(roles.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const removeRole = (id: number) => {
    if (roles.length > 1) setRoles(roles.filter(r => r.id !== id))
  }

  const generateAssignments = (): string => {
    let text = `TEAM ROLE ASSIGNMENTS\n${'='.repeat(50)}\n`
    text += `Project: ${projectName || '[Project Name]'}\n\n`

    roles.forEach(r => {
      if (r.name) {
        text += `${r.name}\n${'─'.repeat(30)}\n`
        text += `Assigned to: ${r.assignee || 'TBD'}\n`
        if (r.responsibilities) text += `Responsibilities: ${r.responsibilities}\n`
        text += '\n'
      }
    })
    return text
  }

  const copyAssignments = () => {
    navigator.clipboard.writeText(generateAssignments())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.teamRoleAssigner.project')}</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamRoleAssigner.roles')}</h3>
        <div className="space-y-3">
          {roles.map((role) => (
            <div key={role.id} className="p-3 bg-slate-50 rounded space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={role.name}
                  onChange={(e) => updateRole(role.id, 'name', e.target.value)}
                  placeholder="Role name"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
                <input
                  type="text"
                  value={role.assignee}
                  onChange={(e) => updateRole(role.id, 'assignee', e.target.value)}
                  placeholder="Assignee"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
                <button onClick={() => removeRole(role.id)} className="px-2 text-red-500">X</button>
              </div>
              <input
                type="text"
                value={role.responsibilities}
                onChange={(e) => updateRole(role.id, 'responsibilities', e.target.value)}
                placeholder="Responsibilities"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          ))}
        </div>
        <button onClick={addRole} className="w-full mt-3 py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500">
          + {t('tools.teamRoleAssigner.addRole')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamRoleAssigner.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">{generateAssignments()}</pre>
        <button onClick={copyAssignments} className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {t('tools.teamRoleAssigner.copy')}
        </button>
      </div>
    </div>
  )
}
