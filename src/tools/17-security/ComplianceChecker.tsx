import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ComplianceRequirement {
  id: string
  category: string
  requirement: string
  status: 'compliant' | 'partial' | 'non-compliant' | 'na' | null
  notes: string
}

export default function ComplianceChecker() {
  const { t } = useTranslation()
  const [framework, setFramework] = useState<'gdpr' | 'hipaa' | 'pci' | 'soc2'>('gdpr')
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([])

  const frameworks = {
    gdpr: [
      { id: 'g1', category: 'Lawfulness', requirement: 'Personal data processed lawfully, fairly, and transparently' },
      { id: 'g2', category: 'Purpose', requirement: 'Data collected for specified, explicit purposes' },
      { id: 'g3', category: 'Minimization', requirement: 'Data limited to what is necessary' },
      { id: 'g4', category: 'Accuracy', requirement: 'Data kept accurate and up to date' },
      { id: 'g5', category: 'Storage', requirement: 'Data not kept longer than necessary' },
      { id: 'g6', category: 'Security', requirement: 'Appropriate security measures in place' },
      { id: 'g7', category: 'Rights', requirement: 'Data subject access requests handled within 30 days' },
      { id: 'g8', category: 'Rights', requirement: 'Right to erasure implemented' },
      { id: 'g9', category: 'Rights', requirement: 'Data portability supported' },
      { id: 'g10', category: 'Consent', requirement: 'Valid consent obtained where required' },
      { id: 'g11', category: 'Breach', requirement: 'Data breach notification within 72 hours' },
      { id: 'g12', category: 'DPO', requirement: 'Data Protection Officer appointed if required' },
    ],
    hipaa: [
      { id: 'h1', category: 'Administrative', requirement: 'Security officer designated' },
      { id: 'h2', category: 'Administrative', requirement: 'Risk analysis conducted' },
      { id: 'h3', category: 'Administrative', requirement: 'Workforce training provided' },
      { id: 'h4', category: 'Physical', requirement: 'Facility access controls implemented' },
      { id: 'h5', category: 'Physical', requirement: 'Workstation security enforced' },
      { id: 'h6', category: 'Physical', requirement: 'Device and media controls in place' },
      { id: 'h7', category: 'Technical', requirement: 'Access controls implemented' },
      { id: 'h8', category: 'Technical', requirement: 'Audit controls in place' },
      { id: 'h9', category: 'Technical', requirement: 'Transmission security (encryption)' },
      { id: 'h10', category: 'Technical', requirement: 'Integrity controls implemented' },
      { id: 'h11', category: 'BAA', requirement: 'Business Associate Agreements signed' },
      { id: 'h12', category: 'Breach', requirement: 'Breach notification procedures established' },
    ],
    pci: [
      { id: 'p1', category: 'Network', requirement: 'Firewall configuration maintained' },
      { id: 'p2', category: 'Network', requirement: 'No vendor-supplied default passwords' },
      { id: 'p3', category: 'Data', requirement: 'Stored cardholder data protected' },
      { id: 'p4', category: 'Data', requirement: 'Cardholder data encrypted in transit' },
      { id: 'p5', category: 'Malware', requirement: 'Anti-virus software maintained' },
      { id: 'p6', category: 'Systems', requirement: 'Secure systems and applications developed' },
      { id: 'p7', category: 'Access', requirement: 'Access restricted to need-to-know' },
      { id: 'p8', category: 'Access', requirement: 'Unique ID assigned to each person' },
      { id: 'p9', category: 'Physical', requirement: 'Physical access to data restricted' },
      { id: 'p10', category: 'Monitoring', requirement: 'Network access tracked and monitored' },
      { id: 'p11', category: 'Testing', requirement: 'Security systems regularly tested' },
      { id: 'p12', category: 'Policy', requirement: 'Information security policy maintained' },
    ],
    soc2: [
      { id: 's1', category: 'Security', requirement: 'Access controls implemented' },
      { id: 's2', category: 'Security', requirement: 'Logical and physical access restricted' },
      { id: 's3', category: 'Security', requirement: 'Change management process established' },
      { id: 's4', category: 'Security', requirement: 'Risk assessment performed' },
      { id: 's5', category: 'Availability', requirement: 'System availability monitored' },
      { id: 's6', category: 'Availability', requirement: 'Disaster recovery plan tested' },
      { id: 's7', category: 'Confidentiality', requirement: 'Data classification implemented' },
      { id: 's8', category: 'Confidentiality', requirement: 'Data disposal procedures followed' },
      { id: 's9', category: 'Processing', requirement: 'Processing objectives documented' },
      { id: 's10', category: 'Processing', requirement: 'Quality assurance procedures in place' },
      { id: 's11', category: 'Privacy', requirement: 'Privacy notice provided' },
      { id: 's12', category: 'Privacy', requirement: 'Consent obtained where required' },
    ],
  }

  const loadFramework = (fw: typeof framework) => {
    setFramework(fw)
    setRequirements(frameworks[fw].map(r => ({
      ...r,
      status: null,
      notes: '',
    })))
  }

  const updateStatus = (id: string, status: ComplianceRequirement['status']) => {
    setRequirements(requirements.map(r =>
      r.id === id ? { ...r, status } : r
    ))
  }

  const updateNotes = (id: string, notes: string) => {
    setRequirements(requirements.map(r =>
      r.id === id ? { ...r, notes } : r
    ))
  }

  const getScore = (): { percentage: number; compliant: number; total: number } => {
    const applicable = requirements.filter(r => r.status && r.status !== 'na')
    if (applicable.length === 0) return { percentage: 0, compliant: 0, total: 0 }

    const scores = { compliant: 1, partial: 0.5, 'non-compliant': 0 }
    const compliant = applicable.reduce((sum, r) => sum + (scores[r.status as 'compliant' | 'partial' | 'non-compliant'] || 0), 0)

    return {
      percentage: Math.round((compliant / applicable.length) * 100),
      compliant: Math.round(compliant),
      total: applicable.length,
    }
  }

  const getStatusColor = (status: ComplianceRequirement['status']): string => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-700'
      case 'partial': return 'bg-yellow-100 text-yellow-700'
      case 'non-compliant': return 'bg-red-100 text-red-700'
      case 'na': return 'bg-slate-100 text-slate-500'
      default: return 'bg-white'
    }
  }

  const score = getScore()
  const categories = [...new Set(requirements.map(r => r.category))]

  const generateReport = (): string => {
    let report = `COMPLIANCE ASSESSMENT REPORT\n${'='.repeat(60)}\n\n`
    report += `Framework: ${framework.toUpperCase()}\n`
    report += `Date: ${new Date().toLocaleDateString()}\n`
    report += `Score: ${score.percentage}% (${score.compliant}/${score.total})\n\n`

    categories.forEach(cat => {
      report += `${cat.toUpperCase()}\n${'─'.repeat(40)}\n`
      requirements.filter(r => r.category === cat).forEach(r => {
        report += `[${(r.status || 'Not Assessed').toUpperCase()}] ${r.requirement}\n`
        if (r.notes) report += `  Notes: ${r.notes}\n`
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
        <h3 className="font-medium mb-3">{t('tools.complianceChecker.framework')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {(['gdpr', 'hipaa', 'pci', 'soc2'] as const).map((fw) => (
            <button
              key={fw}
              onClick={() => loadFramework(fw)}
              className={`py-2 rounded ${
                framework === fw && requirements.length > 0
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {fw.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {requirements.length > 0 && (
        <>
          <div className={`card p-4 ${
            score.percentage >= 80 ? 'bg-green-50' :
            score.percentage >= 50 ? 'bg-yellow-50' : 'bg-red-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{t('tools.complianceChecker.score')}</h3>
              <span className={`text-2xl font-bold ${
                score.percentage >= 80 ? 'text-green-600' :
                score.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score.percentage}%
              </span>
            </div>
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  score.percentage >= 80 ? 'bg-green-500' :
                  score.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score.percentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>Compliant: {requirements.filter(r => r.status === 'compliant').length}</span>
              <span>Partial: {requirements.filter(r => r.status === 'partial').length}</span>
              <span>Non-Compliant: {requirements.filter(r => r.status === 'non-compliant').length}</span>
            </div>
          </div>

          {categories.map(category => (
            <div key={category} className="card p-4">
              <h3 className="font-medium mb-3">{category}</h3>
              <div className="space-y-2">
                {requirements.filter(r => r.category === category).map(req => (
                  <div key={req.id} className={`p-3 rounded ${getStatusColor(req.status)}`}>
                    <p className="text-sm mb-2">{req.requirement}</p>
                    <div className="flex gap-1 mb-2">
                      {(['compliant', 'partial', 'non-compliant', 'na'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => updateStatus(req.id, status)}
                          className={`px-2 py-1 rounded text-xs ${
                            req.status === status
                              ? status === 'compliant' ? 'bg-green-500 text-white' :
                                status === 'partial' ? 'bg-yellow-500 text-white' :
                                status === 'non-compliant' ? 'bg-red-500 text-white' :
                                'bg-slate-500 text-white'
                              : 'bg-white/50 hover:bg-white'
                          }`}
                        >
                          {status === 'na' ? 'N/A' : status.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={req.notes}
                      onChange={(e) => updateNotes(req.id, e.target.value)}
                      placeholder="Notes..."
                      className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={copyReport}
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
          >
            {t('tools.complianceChecker.export')}
          </button>
        </>
      )}

      {requirements.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Select a compliance framework to begin assessment
        </div>
      )}
    </div>
  )
}
