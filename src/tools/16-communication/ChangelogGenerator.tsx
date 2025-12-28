import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Change {
  id: number
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security'
  description: string
}

interface Release {
  id: number
  version: string
  date: string
  changes: Change[]
}

export default function ChangelogGenerator() {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('')
  const [releases, setReleases] = useState<Release[]>([{
    id: Date.now(),
    version: '1.0.0',
    date: new Date().toISOString().split('T')[0],
    changes: []
  }])

  const addRelease = () => {
    const lastVersion = releases[0]?.version || '1.0.0'
    const parts = lastVersion.split('.').map(Number)
    parts[1] = (parts[1] || 0) + 1
    setReleases([{
      id: Date.now(),
      version: parts.join('.'),
      date: new Date().toISOString().split('T')[0],
      changes: []
    }, ...releases])
  }

  const updateRelease = (id: number, field: 'version' | 'date', value: string) => {
    setReleases(releases.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ))
  }

  const removeRelease = (id: number) => {
    if (releases.length > 1) {
      setReleases(releases.filter(r => r.id !== id))
    }
  }

  const addChange = (releaseId: number) => {
    setReleases(releases.map(r => {
      if (r.id === releaseId) {
        return {
          ...r,
          changes: [...r.changes, { id: Date.now(), type: 'added', description: '' }]
        }
      }
      return r
    }))
  }

  const updateChange = (releaseId: number, changeId: number, field: 'type' | 'description', value: string) => {
    setReleases(releases.map(r => {
      if (r.id === releaseId) {
        return {
          ...r,
          changes: r.changes.map(c =>
            c.id === changeId ? { ...c, [field]: value } : c
          )
        }
      }
      return r
    }))
  }

  const removeChange = (releaseId: number, changeId: number) => {
    setReleases(releases.map(r => {
      if (r.id === releaseId) {
        return { ...r, changes: r.changes.filter(c => c.id !== changeId) }
      }
      return r
    }))
  }

  const typeLabels: Record<string, { label: string; color: string; emoji: string }> = {
    'added': { label: 'Added', color: 'bg-green-100 text-green-700', emoji: '✨' },
    'changed': { label: 'Changed', color: 'bg-blue-100 text-blue-700', emoji: '🔄' },
    'deprecated': { label: 'Deprecated', color: 'bg-yellow-100 text-yellow-700', emoji: '⚠️' },
    'removed': { label: 'Removed', color: 'bg-red-100 text-red-700', emoji: '🗑️' },
    'fixed': { label: 'Fixed', color: 'bg-purple-100 text-purple-700', emoji: '🐛' },
    'security': { label: 'Security', color: 'bg-orange-100 text-orange-700', emoji: '🔒' },
  }

  const generateChangelog = (): string => {
    let text = `# Changelog\\n\\n`
    text += `All notable changes to ${projectName || 'this project'} will be documented here.\\n\\n`

    releases.forEach(release => {
      text += `## [${release.version}] - ${release.date}\\n\\n`

      const changesByType = Object.keys(typeLabels).reduce((acc, type) => {
        const typeChanges = release.changes.filter(c => c.type === type && c.description.trim())
        if (typeChanges.length > 0) {
          acc[type] = typeChanges
        }
        return acc
      }, {} as Record<string, Change[]>)

      Object.entries(changesByType).forEach(([type, changes]) => {
        text += `### ${typeLabels[type].label}\\n`
        changes.forEach(c => {
          text += `- ${c.description}\\n`
        })
        text += '\\n'
      })

      if (Object.keys(changesByType).length === 0) {
        text += '_No changes documented_\\n\\n'
      }
    })

    return text
  }

  const copyChangelog = () => {
    navigator.clipboard.writeText(generateChangelog())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.changelogGenerator.project')}</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{t('tools.changelogGenerator.releases')}</h3>
          <button
            onClick={addRelease}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + New Release
          </button>
        </div>

        <div className="space-y-6">
          {releases.map((release) => (
            <div key={release.id} className="p-4 bg-slate-50 rounded">
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="text-xs text-slate-500">Version</label>
                  <input
                    type="text"
                    value={release.version}
                    onChange={(e) => updateRelease(release.id, 'version', e.target.value)}
                    placeholder="1.0.0"
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-500">Date</label>
                  <input
                    type="date"
                    value={release.date}
                    onChange={(e) => updateRelease(release.id, 'date', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => removeRelease(release.id)}
                    className="px-3 py-2 text-red-500 hover:bg-red-100 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {release.changes.map((change) => (
                  <div key={change.id} className="flex gap-2 items-center">
                    <select
                      value={change.type}
                      onChange={(e) => updateChange(release.id, change.id, 'type', e.target.value)}
                      className={`px-3 py-2 rounded text-sm ${typeLabels[change.type].color}`}
                    >
                      {Object.entries(typeLabels).map(([type, { label, emoji }]) => (
                        <option key={type} value={type}>{emoji} {label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={change.description}
                      onChange={(e) => updateChange(release.id, change.id, 'description', e.target.value)}
                      placeholder="Describe the change..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded"
                    />
                    <button
                      onClick={() => removeChange(release.id, change.id)}
                      className="px-2 text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addChange(release.id)}
                className="w-full py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500 text-sm"
              >
                + Add Change
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.changelogGenerator.summary')}</h3>
        <div className="grid grid-cols-6 gap-2 text-center">
          {Object.entries(typeLabels).map(([type, { label, color, emoji }]) => {
            const count = releases.reduce((sum, r) =>
              sum + r.changes.filter(c => c.type === type && c.description.trim()).length, 0
            )
            return (
              <div key={type} className={`p-2 rounded ${color}`}>
                <span className="text-lg">{emoji}</span>
                <p className="text-xs font-medium">{label}</p>
                <p className="text-lg font-bold">{count}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.changelogGenerator.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generateChangelog()}
        </pre>
        <button
          onClick={copyChangelog}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.changelogGenerator.copy')}
        </button>
      </div>
    </div>
  )
}
