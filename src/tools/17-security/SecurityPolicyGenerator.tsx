import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PolicySection {
  id: string
  title: string
  enabled: boolean
  content: string
}

export default function SecurityPolicyGenerator() {
  const { t } = useTranslation()
  const [companyName, setCompanyName] = useState('')
  const [policyType, setPolicyType] = useState('general')
  const [sections, setSections] = useState<PolicySection[]>([
    { id: 'purpose', title: 'Purpose', enabled: true, content: '' },
    { id: 'scope', title: 'Scope', enabled: true, content: '' },
    { id: 'passwords', title: 'Password Policy', enabled: true, content: '' },
    { id: 'access', title: 'Access Control', enabled: true, content: '' },
    { id: 'data', title: 'Data Protection', enabled: true, content: '' },
    { id: 'email', title: 'Email & Communication', enabled: true, content: '' },
    { id: 'remote', title: 'Remote Work', enabled: true, content: '' },
    { id: 'incident', title: 'Incident Response', enabled: true, content: '' },
    { id: 'training', title: 'Security Training', enabled: true, content: '' },
    { id: 'compliance', title: 'Compliance', enabled: true, content: '' },
  ])

  const policyTemplates: Record<string, Record<string, string>> = {
    general: {
      purpose: 'This policy establishes the information security requirements for [Company Name] to protect confidential information, maintain system integrity, and ensure business continuity.',
      scope: 'This policy applies to all employees, contractors, consultants, and third parties who have access to [Company Name] information systems and data.',
      passwords: '• Minimum password length: 12 characters\n• Must include uppercase, lowercase, numbers, and symbols\n• Passwords must be changed every 90 days\n• No password reuse for 12 generations\n• Multi-factor authentication required for all remote access',
      access: '• Access granted on a need-to-know basis\n• Role-based access control (RBAC) implemented\n• Access reviews conducted quarterly\n• Immediate revocation upon termination\n• Privileged access requires approval and monitoring',
      data: '• Data classified as Public, Internal, Confidential, or Restricted\n• Encryption required for all data at rest and in transit\n• No sensitive data on personal devices without approval\n• Data backup performed daily\n• Secure disposal of media containing sensitive data',
      email: '• Do not open suspicious attachments or links\n• Report phishing attempts to IT Security\n• Do not send sensitive data via unencrypted email\n• Use company email for business purposes only\n• Enable email encryption for confidential communications',
      remote: '• VPN required for all remote connections\n• Company-approved devices only\n• Secure home network required\n• Lock screen when leaving workstation\n• No work on public WiFi without VPN',
      incident: '• Report security incidents within 1 hour\n• Contact: security@company.com or extension 555\n• Do not attempt to investigate independently\n• Preserve evidence for investigation\n• Follow incident response playbook',
      training: '• Security awareness training upon hire\n• Annual refresher training required\n• Phishing simulation exercises monthly\n• Role-specific training for privileged users\n• Training completion tracked and reported',
      compliance: '• Regular audits conducted annually\n• Compliance with applicable regulations (GDPR, HIPAA, etc.)\n• Policy violations subject to disciplinary action\n• Exceptions require documented approval\n• Policy reviewed and updated annually',
    },
  }

  const toggleSection = (id: string) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ))
  }

  const updateContent = (id: string, content: string) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, content } : s
    ))
  }

  const loadTemplate = () => {
    const template = policyTemplates[policyType]
    setSections(sections.map(s => ({
      ...s,
      content: template[s.id]?.replace(/\[Company Name\]/g, companyName || '[Company Name]') || s.content,
    })))
  }

  const generatePolicy = (): string => {
    const company = companyName || '[Company Name]'
    let policy = `${'═'.repeat(60)}
INFORMATION SECURITY POLICY
${company}
${'═'.repeat(60)}

Document Version: 1.0
Effective Date: ${new Date().toLocaleDateString()}
Last Review: ${new Date().toLocaleDateString()}
Next Review: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}

`

    sections.filter(s => s.enabled && s.content).forEach((section, i) => {
      policy += `${i + 1}. ${section.title.toUpperCase()}
${'─'.repeat(40)}
${section.content}

`
    })

    policy += `${'─'.repeat(40)}
ACKNOWLEDGMENT

I have read and understand the Information Security Policy. I agree to comply with the policies and procedures outlined in this document.

Employee Signature: _________________________ Date: __________

Employee Name (Print): _________________________

${'─'.repeat(40)}
For questions about this policy, contact the Information Security Team.
`

    return policy
  }

  const copyPolicy = () => {
    navigator.clipboard.writeText(generatePolicy())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.securityPolicyGenerator.info')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Company"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Policy Template</label>
            <div className="flex gap-2">
              <select
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              >
                <option value="general">General Security Policy</option>
              </select>
              <button
                onClick={loadTemplate}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Load
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.securityPolicyGenerator.sections')}</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.id} className={`p-3 rounded border ${section.enabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={() => toggleSection(section.id)}
                  className="rounded"
                />
                <span className="font-medium">{section.title}</span>
              </label>
              {section.enabled && (
                <textarea
                  value={section.content}
                  onChange={(e) => updateContent(section.id, e.target.value)}
                  placeholder={`Enter ${section.title.toLowerCase()} content...`}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyPolicy}
          className="flex-1 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          {t('tools.securityPolicyGenerator.copy')}
        </button>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.securityPolicyGenerator.preview')}</h3>
        </div>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generatePolicy()}
        </pre>
      </div>

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.securityPolicyGenerator.disclaimer')}</h4>
        <p className="text-sm text-slate-600">
          This is a template for informational purposes. Security policies should be
          reviewed by legal and compliance teams and customized for your organization's
          specific needs and regulatory requirements.
        </p>
      </div>
    </div>
  )
}
