import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Role {
  id: number
  name: string
}

interface Resource {
  id: number
  name: string
}

type Permission = 'none' | 'read' | 'write' | 'admin'

export default function AccessControlMatrix() {
  const { t } = useTranslation()
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Employee' },
    { id: 4, name: 'Guest' },
  ])
  const [resources, setResources] = useState<Resource[]>([
    { id: 1, name: 'User Data' },
    { id: 2, name: 'Financial Records' },
    { id: 3, name: 'Reports' },
    { id: 4, name: 'Settings' },
  ])
  const [permissions, setPermissions] = useState<Record<string, Permission>>({
    '1-1': 'admin', '1-2': 'admin', '1-3': 'admin', '1-4': 'admin',
    '2-1': 'write', '2-2': 'read', '2-3': 'write', '2-4': 'read',
    '3-1': 'read', '3-2': 'none', '3-3': 'read', '3-4': 'none',
    '4-1': 'none', '4-2': 'none', '4-3': 'read', '4-4': 'none',
  })

  const addRole = () => {
    const newRole = { id: Date.now(), name: `Role ${roles.length + 1}` }
    setRoles([...roles, newRole])
    // Initialize permissions for new role
    resources.forEach(r => {
      setPermissions(prev => ({ ...prev, [`${newRole.id}-${r.id}`]: 'none' }))
    })
  }

  const addResource = () => {
    const newResource = { id: Date.now(), name: `Resource ${resources.length + 1}` }
    setResources([...resources, newResource])
    // Initialize permissions for new resource
    roles.forEach(role => {
      setPermissions(prev => ({ ...prev, [`${role.id}-${newResource.id}`]: 'none' }))
    })
  }

  const updateRoleName = (id: number, name: string) => {
    setRoles(roles.map(r => r.id === id ? { ...r, name } : r))
  }

  const updateResourceName = (id: number, name: string) => {
    setResources(resources.map(r => r.id === id ? { ...r, name } : r))
  }

  const updatePermission = (roleId: number, resourceId: number, permission: Permission) => {
    setPermissions({ ...permissions, [`${roleId}-${resourceId}`]: permission })
  }

  const removeRole = (id: number) => {
    if (roles.length > 1) {
      setRoles(roles.filter(r => r.id !== id))
    }
  }

  const removeResource = (id: number) => {
    if (resources.length > 1) {
      setResources(resources.filter(r => r.id !== id))
    }
  }

  const getPermissionColor = (permission: Permission): string => {
    switch (permission) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'write': return 'bg-green-100 text-green-700 border-green-300'
      case 'read': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'none': return 'bg-slate-100 text-slate-400 border-slate-200'
    }
  }

  const generateReport = (): string => {
    let report = `ACCESS CONTROL MATRIX\n${'='.repeat(60)}\n\n`

    roles.forEach(role => {
      report += `${role.name}\n${'─'.repeat(40)}\n`
      resources.forEach(resource => {
        const perm = permissions[`${role.id}-${resource.id}`] || 'none'
        report += `  ${resource.name}: ${perm.toUpperCase()}\n`
      })
      report += '\n'
    })

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.accessControlMatrix.matrix')}</h3>
          <div className="flex gap-2">
            <button onClick={addRole} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
              + Role
            </button>
            <button onClick={addResource} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
              + Resource
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border border-slate-200 bg-slate-50 text-left min-w-[120px]">
                  Role / Resource
                </th>
                {resources.map(resource => (
                  <th key={resource.id} className="p-2 border border-slate-200 bg-slate-50 min-w-[100px]">
                    <input
                      type="text"
                      value={resource.name}
                      onChange={(e) => updateResourceName(resource.id, e.target.value)}
                      className="w-full px-1 py-0.5 border border-transparent hover:border-slate-300 rounded text-center text-sm font-medium"
                    />
                    <button
                      onClick={() => removeResource(resource.id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id}>
                  <td className="p-2 border border-slate-200 bg-slate-50">
                    <input
                      type="text"
                      value={role.name}
                      onChange={(e) => updateRoleName(role.id, e.target.value)}
                      className="w-full px-1 py-0.5 border border-transparent hover:border-slate-300 rounded text-sm font-medium"
                    />
                    <button
                      onClick={() => removeRole(role.id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      remove
                    </button>
                  </td>
                  {resources.map(resource => (
                    <td key={resource.id} className="p-1 border border-slate-200">
                      <select
                        value={permissions[`${role.id}-${resource.id}`] || 'none'}
                        onChange={(e) => updatePermission(role.id, resource.id, e.target.value as Permission)}
                        className={`w-full px-2 py-1 rounded border text-sm ${getPermissionColor(permissions[`${role.id}-${resource.id}`] || 'none')}`}
                      >
                        <option value="none">None</option>
                        <option value="read">Read</option>
                        <option value="write">Write</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.accessControlMatrix.legend')}</h3>
        <div className="flex gap-3 flex-wrap">
          <span className="px-3 py-1 rounded bg-purple-100 text-purple-700 text-sm">Admin - Full control</span>
          <span className="px-3 py-1 rounded bg-green-100 text-green-700 text-sm">Write - Read & modify</span>
          <span className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm">Read - View only</span>
          <span className="px-3 py-1 rounded bg-slate-100 text-slate-400 text-sm">None - No access</span>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.accessControlMatrix.report')}</h3>
          <button onClick={copyReport} className="text-sm text-blue-500 hover:text-blue-600">
            Copy
          </button>
        </div>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generateReport()}
        </pre>
      </div>

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.accessControlMatrix.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Follow the principle of least privilege</li>
          <li>• Regularly review and audit access permissions</li>
          <li>• Document justification for elevated access</li>
          <li>• Consider role hierarchies for complex organizations</li>
        </ul>
      </div>
    </div>
  )
}
