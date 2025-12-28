import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SecurityCategory {
  id: string
  name: string
  weight: number
  score: number | null
  items: { id: string; text: string; checked: boolean }[]
}

export default function SecurityScorecard() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<SecurityCategory[]>([
    {
      id: 'access',
      name: 'Access Control',
      weight: 20,
      score: null,
      items: [
        { id: 'a1', text: 'Multi-factor authentication enabled', checked: false },
        { id: 'a2', text: 'Role-based access control implemented', checked: false },
        { id: 'a3', text: 'Regular access reviews conducted', checked: false },
        { id: 'a4', text: 'Least privilege principle enforced', checked: false },
        { id: 'a5', text: 'Password policy meets standards', checked: false },
      ],
    },
    {
      id: 'data',
      name: 'Data Protection',
      weight: 25,
      score: null,
      items: [
        { id: 'd1', text: 'Data encrypted at rest', checked: false },
        { id: 'd2', text: 'Data encrypted in transit', checked: false },
        { id: 'd3', text: 'Data classification implemented', checked: false },
        { id: 'd4', text: 'Data backup procedures in place', checked: false },
        { id: 'd5', text: 'Data retention policies defined', checked: false },
      ],
    },
    {
      id: 'network',
      name: 'Network Security',
      weight: 20,
      score: null,
      items: [
        { id: 'n1', text: 'Firewall properly configured', checked: false },
        { id: 'n2', text: 'Intrusion detection/prevention active', checked: false },
        { id: 'n3', text: 'Network segmentation implemented', checked: false },
        { id: 'n4', text: 'VPN for remote access', checked: false },
        { id: 'n5', text: 'Security monitoring in place', checked: false },
      ],
    },
    {
      id: 'endpoint',
      name: 'Endpoint Security',
      weight: 15,
      score: null,
      items: [
        { id: 'e1', text: 'Antivirus/EDR installed', checked: false },
        { id: 'e2', text: 'Devices regularly patched', checked: false },
        { id: 'e3', text: 'Device encryption enabled', checked: false },
        { id: 'e4', text: 'Mobile device management', checked: false },
        { id: 'e5', text: 'USB/removable media controls', checked: false },
      ],
    },
    {
      id: 'incident',
      name: 'Incident Response',
      weight: 10,
      score: null,
      items: [
        { id: 'i1', text: 'Incident response plan exists', checked: false },
        { id: 'i2', text: 'Team trained on procedures', checked: false },
        { id: 'i3', text: 'Regular incident drills conducted', checked: false },
        { id: 'i4', text: 'Communication plan established', checked: false },
        { id: 'i5', text: 'Post-incident review process', checked: false },
      ],
    },
    {
      id: 'awareness',
      name: 'Security Awareness',
      weight: 10,
      score: null,
      items: [
        { id: 'w1', text: 'Security training for all employees', checked: false },
        { id: 'w2', text: 'Phishing simulations conducted', checked: false },
        { id: 'w3', text: 'Security policies documented', checked: false },
        { id: 'w4', text: 'Security newsletter/updates', checked: false },
        { id: 'w5', text: 'Reporting mechanism for concerns', checked: false },
      ],
    },
  ])

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        const newItems = cat.items.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
        const score = Math.round((newItems.filter(i => i.checked).length / newItems.length) * 100)
        return { ...cat, items: newItems, score }
      }
      return cat
    }))
  }

  const calculateOverallScore = (): number => {
    let totalWeight = 0
    let weightedScore = 0

    categories.forEach(cat => {
      if (cat.score !== null) {
        weightedScore += cat.score * cat.weight
        totalWeight += cat.weight
      }
    })

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getGrade = (score: number): string => {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  const overallScore = calculateOverallScore()

  const generateReport = (): string => {
    let report = `SECURITY SCORECARD REPORT\n${'='.repeat(50)}\n\n`
    report += `Date: ${new Date().toLocaleDateString()}\n`
    report += `Overall Score: ${overallScore}% (Grade: ${getGrade(overallScore)})\n\n`

    report += `CATEGORY BREAKDOWN\n${'─'.repeat(40)}\n`
    categories.forEach(cat => {
      const score = cat.score ?? 0
      report += `\n${cat.name} (Weight: ${cat.weight}%): ${score}%\n`
      cat.items.forEach(item => {
        report += `  [${item.checked ? '✓' : ' '}] ${item.text}\n`
      })
    })

    report += `\n${'─'.repeat(40)}\n`
    report += `RECOMMENDATIONS\n`
    categories.forEach(cat => {
      const unchecked = cat.items.filter(i => !i.checked)
      if (unchecked.length > 0) {
        report += `\n${cat.name}:\n`
        unchecked.forEach(item => {
          report += `  • ${item.text}\n`
        })
      }
    })

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className={`card p-6 ${
        overallScore >= 80 ? 'bg-green-50' :
        overallScore >= 60 ? 'bg-yellow-50' :
        overallScore >= 40 ? 'bg-orange-50' : 'bg-red-50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">{t('tools.securityScorecard.overall')}</h3>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              Grade: {getGrade(overallScore)}
            </div>
          </div>
        </div>
        <div className="h-4 bg-white/50 rounded-full overflow-hidden">
          <div
            className={`h-full ${getScoreBgColor(overallScore)} transition-all`}
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {categories.map(cat => (
          <div key={cat.id} className="card p-3 text-center">
            <div className={`text-xl font-bold ${getScoreColor(cat.score ?? 0)}`}>
              {cat.score ?? 0}%
            </div>
            <div className="text-xs text-slate-500">{cat.name}</div>
          </div>
        ))}
      </div>

      {categories.map(cat => (
        <div key={cat.id} className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{cat.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Weight: {cat.weight}%</span>
              <span className={`text-sm font-medium ${getScoreColor(cat.score ?? 0)}`}>
                {cat.score ?? 0}%
              </span>
            </div>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full ${getScoreBgColor(cat.score ?? 0)} transition-all`}
              style={{ width: `${cat.score ?? 0}%` }}
            />
          </div>
          <div className="space-y-2">
            {cat.items.map(item => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(cat.id, item.id)}
                  className="rounded"
                />
                <span className={item.checked ? 'text-green-600' : 'text-slate-600'}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={copyReport}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.securityScorecard.export')}
      </button>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.securityScorecard.info')}</h4>
        <p className="text-sm text-slate-600">
          This scorecard helps evaluate your organization's security posture across
          key areas. Regular assessments help identify gaps and track improvements.
        </p>
      </div>
    </div>
  )
}
