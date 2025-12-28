import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Permission {
  name: string
  description: string
  risk: 'low' | 'medium' | 'high' | 'critical'
  category: string
}

export default function PermissionAnalyzer() {
  const { t } = useTranslation()
  const [platform, setPlatform] = useState<'android' | 'ios' | 'web'>('android')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const permissions: Record<string, Permission[]> = {
    android: [
      { name: 'CAMERA', description: 'Access device camera', risk: 'high', category: 'Hardware' },
      { name: 'MICROPHONE', description: 'Record audio', risk: 'high', category: 'Hardware' },
      { name: 'LOCATION', description: 'Access precise location', risk: 'high', category: 'Location' },
      { name: 'CONTACTS', description: 'Read and modify contacts', risk: 'high', category: 'Personal Data' },
      { name: 'CALENDAR', description: 'Read and modify calendar', risk: 'medium', category: 'Personal Data' },
      { name: 'SMS', description: 'Send and read SMS messages', risk: 'critical', category: 'Communication' },
      { name: 'PHONE', description: 'Make and manage calls', risk: 'high', category: 'Communication' },
      { name: 'STORAGE', description: 'Read and write files', risk: 'medium', category: 'Storage' },
      { name: 'BLUETOOTH', description: 'Connect to Bluetooth devices', risk: 'medium', category: 'Connectivity' },
      { name: 'WIFI', description: 'View WiFi connections', risk: 'low', category: 'Connectivity' },
      { name: 'NOTIFICATIONS', description: 'Show notifications', risk: 'low', category: 'System' },
      { name: 'BACKGROUND_LOCATION', description: 'Access location in background', risk: 'critical', category: 'Location' },
    ],
    ios: [
      { name: 'Camera', description: 'Access camera for photos/video', risk: 'high', category: 'Hardware' },
      { name: 'Microphone', description: 'Record audio', risk: 'high', category: 'Hardware' },
      { name: 'Location Always', description: 'Access location at all times', risk: 'critical', category: 'Location' },
      { name: 'Location When In Use', description: 'Access location while using app', risk: 'medium', category: 'Location' },
      { name: 'Contacts', description: 'Access contacts', risk: 'high', category: 'Personal Data' },
      { name: 'Photos', description: 'Access photo library', risk: 'high', category: 'Personal Data' },
      { name: 'Calendars', description: 'Access calendar events', risk: 'medium', category: 'Personal Data' },
      { name: 'Health', description: 'Access health data', risk: 'critical', category: 'Personal Data' },
      { name: 'Face ID', description: 'Use Face ID authentication', risk: 'medium', category: 'Security' },
      { name: 'Push Notifications', description: 'Send notifications', risk: 'low', category: 'System' },
      { name: 'Tracking', description: 'Track across apps and websites', risk: 'critical', category: 'Privacy' },
    ],
    web: [
      { name: 'Geolocation', description: 'Access user location', risk: 'high', category: 'Location' },
      { name: 'Camera', description: 'Access webcam', risk: 'high', category: 'Hardware' },
      { name: 'Microphone', description: 'Access microphone', risk: 'high', category: 'Hardware' },
      { name: 'Notifications', description: 'Show push notifications', risk: 'low', category: 'System' },
      { name: 'Clipboard', description: 'Read/write clipboard', risk: 'medium', category: 'Privacy' },
      { name: 'Storage', description: 'Store data locally', risk: 'low', category: 'Storage' },
      { name: 'MIDI', description: 'Access MIDI devices', risk: 'low', category: 'Hardware' },
      { name: 'USB', description: 'Access USB devices', risk: 'high', category: 'Hardware' },
      { name: 'Bluetooth', description: 'Access Bluetooth devices', risk: 'medium', category: 'Connectivity' },
    ],
  }

  const togglePermission = (name: string) => {
    setSelectedPermissions(
      selectedPermissions.includes(name)
        ? selectedPermissions.filter(p => p !== name)
        : [...selectedPermissions, name]
    )
  }

  const getRiskColor = (risk: Permission['risk']): string => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'critical': return 'bg-red-100 text-red-700'
    }
  }

  const calculateRiskScore = (): number => {
    const riskValues = { low: 1, medium: 2, high: 3, critical: 4 }
    const selected = permissions[platform].filter(p => selectedPermissions.includes(p.name))
    if (selected.length === 0) return 0
    const total = selected.reduce((sum, p) => sum + riskValues[p.risk], 0)
    return Math.min(100, Math.round((total / (selected.length * 4)) * 100))
  }

  const riskScore = calculateRiskScore()

  const generateReport = (): string => {
    let report = `PERMISSION ANALYSIS REPORT\n${'='.repeat(50)}\n\n`
    report += `Platform: ${platform.toUpperCase()}\n`
    report += `Permissions Analyzed: ${selectedPermissions.length}\n`
    report += `Risk Score: ${riskScore}/100\n\n`

    const selected = permissions[platform].filter(p => selectedPermissions.includes(p.name))
    const grouped = selected.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = []
      acc[p.category].push(p)
      return acc
    }, {} as Record<string, Permission[]>)

    Object.entries(grouped).forEach(([category, perms]) => {
      report += `${category}\n${'─'.repeat(30)}\n`
      perms.forEach(p => {
        report += `[${p.risk.toUpperCase()}] ${p.name}\n  ${p.description}\n`
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
        <h3 className="font-medium mb-3">{t('tools.permissionAnalyzer.platform')}</h3>
        <div className="flex gap-2">
          {(['android', 'ios', 'web'] as const).map((p) => (
            <button
              key={p}
              onClick={() => { setPlatform(p); setSelectedPermissions([]) }}
              className={`flex-1 py-2 rounded ${
                platform === p ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {p === 'ios' ? 'iOS' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.permissionAnalyzer.select')}</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {permissions[platform].map((perm) => (
            <div
              key={perm.name}
              onClick={() => togglePermission(perm.name)}
              className={`p-3 rounded border cursor-pointer ${
                selectedPermissions.includes(perm.name)
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.name)}
                    readOnly
                    className="rounded"
                  />
                  <span className="font-medium">{perm.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs ${getRiskColor(perm.risk)}`}>
                  {perm.risk}
                </span>
              </div>
              <p className="text-sm text-slate-500 ml-6">{perm.description}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedPermissions.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.permissionAnalyzer.riskScore')}</h3>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-slate-500">Overall Risk</span>
              <span className={`font-bold ${
                riskScore < 30 ? 'text-green-600' :
                riskScore < 60 ? 'text-yellow-600' :
                riskScore < 80 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {riskScore}/100
              </span>
            </div>
            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  riskScore < 30 ? 'bg-green-500' :
                  riskScore < 60 ? 'bg-yellow-500' :
                  riskScore < 80 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyReport}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('tools.permissionAnalyzer.copyReport')}
            </button>
            <button
              onClick={() => setSelectedPermissions([])}
              className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.permissionAnalyzer.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Only grant permissions that are essential for app functionality</li>
          <li>• Be cautious of apps requesting many high-risk permissions</li>
          <li>• Regularly review and revoke unnecessary permissions</li>
          <li>• Background location access should be rare</li>
        </ul>
      </div>
    </div>
  )
}
