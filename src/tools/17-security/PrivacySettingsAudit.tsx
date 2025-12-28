import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AuditItem {
  category: string
  setting: string
  current: 'secure' | 'warning' | 'insecure' | 'unknown'
  recommendation: string
}

export default function PrivacySettingsAudit() {
  const { t } = useTranslation()
  const [platform, setPlatform] = useState<'browser' | 'google' | 'facebook' | 'apple'>('browser')
  const [auditComplete, setAuditComplete] = useState(false)
  const [items, setItems] = useState<AuditItem[]>([])

  const browserChecks: AuditItem[] = [
    { category: 'Tracking', setting: 'Do Not Track header', current: 'unknown', recommendation: 'Enable in browser settings' },
    { category: 'Tracking', setting: 'Third-party cookies', current: 'warning', recommendation: 'Block third-party cookies' },
    { category: 'Tracking', setting: 'Fingerprinting protection', current: 'unknown', recommendation: 'Use Firefox or Brave for better protection' },
    { category: 'Location', setting: 'Location access', current: 'warning', recommendation: 'Only allow for specific sites' },
    { category: 'Media', setting: 'Camera access', current: 'secure', recommendation: 'Deny by default, allow per-site' },
    { category: 'Media', setting: 'Microphone access', current: 'secure', recommendation: 'Deny by default, allow per-site' },
    { category: 'Notifications', setting: 'Push notifications', current: 'warning', recommendation: 'Review and remove unwanted sites' },
    { category: 'History', setting: 'Browsing history', current: 'warning', recommendation: 'Consider auto-clearing after sessions' },
    { category: 'Passwords', setting: 'Password manager', current: 'unknown', recommendation: 'Use a dedicated password manager' },
    { category: 'Extensions', setting: 'Extension permissions', current: 'warning', recommendation: 'Audit extension access regularly' },
  ]

  const googleChecks: AuditItem[] = [
    { category: 'Activity', setting: 'Web & App Activity', current: 'warning', recommendation: 'Pause or set auto-delete' },
    { category: 'Activity', setting: 'Location History', current: 'insecure', recommendation: 'Pause this tracking' },
    { category: 'Activity', setting: 'YouTube History', current: 'warning', recommendation: 'Set auto-delete to 3 months' },
    { category: 'Ads', setting: 'Ad personalization', current: 'warning', recommendation: 'Turn off for more privacy' },
    { category: 'Data', setting: 'Data sharing with partners', current: 'unknown', recommendation: 'Review shared access in Security settings' },
    { category: 'Security', setting: '2-Step Verification', current: 'unknown', recommendation: 'Enable for all accounts' },
    { category: 'Security', setting: 'Security checkup', current: 'unknown', recommendation: 'Run quarterly' },
    { category: 'Apps', setting: 'Third-party app access', current: 'warning', recommendation: 'Remove apps you no longer use' },
  ]

  const facebookChecks: AuditItem[] = [
    { category: 'Profile', setting: 'Profile visibility', current: 'warning', recommendation: 'Set to Friends only' },
    { category: 'Profile', setting: 'Contact info visibility', current: 'insecure', recommendation: 'Hide from public' },
    { category: 'Ads', setting: 'Off-Facebook activity', current: 'insecure', recommendation: 'Clear history and turn off' },
    { category: 'Ads', setting: 'Ad preferences', current: 'warning', recommendation: 'Opt out of interest-based ads' },
    { category: 'Apps', setting: 'Connected apps', current: 'warning', recommendation: 'Remove unused app connections' },
    { category: 'Location', setting: 'Location services', current: 'warning', recommendation: 'Disable unless needed' },
    { category: 'Recognition', setting: 'Face recognition', current: 'unknown', recommendation: 'Turn off' },
    { category: 'Security', setting: 'Login alerts', current: 'unknown', recommendation: 'Enable for all devices' },
  ]

  const appleChecks: AuditItem[] = [
    { category: 'Tracking', setting: 'App Tracking Transparency', current: 'secure', recommendation: 'Keep enabled (Ask App Not to Track)' },
    { category: 'Location', setting: 'Location Services', current: 'warning', recommendation: 'Use While Using App only' },
    { category: 'Siri', setting: 'Siri & Search suggestions', current: 'warning', recommendation: 'Review what data Siri can access' },
    { category: 'Analytics', setting: 'Analytics sharing', current: 'warning', recommendation: 'Turn off Share Analytics' },
    { category: 'Ads', setting: 'Personalized Ads', current: 'warning', recommendation: 'Turn off in Privacy settings' },
    { category: 'Security', setting: 'Two-Factor Authentication', current: 'unknown', recommendation: 'Enable for Apple ID' },
    { category: 'Privacy', setting: 'Mail Privacy Protection', current: 'unknown', recommendation: 'Enable to hide IP and block trackers' },
    { category: 'Safari', setting: 'Prevent Cross-Site Tracking', current: 'secure', recommendation: 'Keep enabled' },
  ]

  const runAudit = () => {
    let checkItems: AuditItem[] = []
    switch (platform) {
      case 'browser': checkItems = browserChecks; break
      case 'google': checkItems = googleChecks; break
      case 'facebook': checkItems = facebookChecks; break
      case 'apple': checkItems = appleChecks; break
    }
    setItems(checkItems)
    setAuditComplete(true)
  }

  const getStatusColor = (status: AuditItem['current']): string => {
    switch (status) {
      case 'secure': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'insecure': return 'bg-red-50 border-red-200'
      case 'unknown': return 'bg-slate-50 border-slate-200'
    }
  }

  const getStatusIcon = (status: AuditItem['current']): string => {
    switch (status) {
      case 'secure': return '✓'
      case 'warning': return '⚠'
      case 'insecure': return '✗'
      case 'unknown': return '?'
    }
  }

  const getScore = (): number => {
    const scores = { secure: 100, warning: 50, insecure: 0, unknown: 25 }
    const total = items.reduce((sum, item) => sum + scores[item.current], 0)
    return Math.round(total / items.length)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.privacySettingsAudit.platform')}</h3>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: 'browser', label: 'Browser' },
            { id: 'google', label: 'Google' },
            { id: 'facebook', label: 'Facebook/Meta' },
            { id: 'apple', label: 'Apple' },
          ] as const).map((p) => (
            <button
              key={p.id}
              onClick={() => { setPlatform(p.id); setAuditComplete(false) }}
              className={`py-3 rounded ${
                platform === p.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={runAudit}
        className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
      >
        {t('tools.privacySettingsAudit.run')}
      </button>

      {auditComplete && items.length > 0 && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{t('tools.privacySettingsAudit.score')}</h3>
              <span className={`text-2xl font-bold ${
                getScore() >= 70 ? 'text-green-600' :
                getScore() >= 40 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {getScore()}/100
              </span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  getScore() >= 70 ? 'bg-green-500' :
                  getScore() >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${getScore()}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-slate-500">
              <span>{items.filter(i => i.current === 'secure').length} secure</span>
              <span>{items.filter(i => i.current === 'warning').length} warnings</span>
              <span>{items.filter(i => i.current === 'insecure').length} insecure</span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.privacySettingsAudit.findings')}</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.map((item, i) => (
                <div key={i} className={`p-3 rounded border ${getStatusColor(item.current)}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getStatusIcon(item.current)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.setting}</span>
                        <span className="text-xs text-slate-500">({item.category})</span>
                      </div>
                      <p className="text-sm mt-1 opacity-80">{item.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.privacySettingsAudit.note')}</h4>
        <p className="text-sm text-slate-600">
          This is a checklist tool to guide your privacy review. Actual settings must be
          changed on the respective platform. Click on each recommendation to learn more
          about the setting and how to change it.
        </p>
      </div>
    </div>
  )
}
