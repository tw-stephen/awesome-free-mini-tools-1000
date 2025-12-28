import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Section {
  id: number
  title: string
  content: string
  included: boolean
}

export default function ProposalTemplate() {
  const { t } = useTranslation()
  const [proposal, setProposal] = useState({
    clientName: '',
    projectName: '',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preparedBy: '',
    company: '',
  })

  const defaultSections: Section[] = [
    { id: 1, title: 'Executive Summary', content: 'A brief overview of the proposal and key benefits...', included: true },
    { id: 2, title: 'Problem Statement', content: 'Description of the challenge or opportunity...', included: true },
    { id: 3, title: 'Proposed Solution', content: 'Detailed explanation of your solution...', included: true },
    { id: 4, title: 'Scope of Work', content: 'List of deliverables and what is included/excluded...', included: true },
    { id: 5, title: 'Timeline', content: 'Project phases and milestones...', included: true },
    { id: 6, title: 'Investment', content: 'Pricing breakdown and payment terms...', included: true },
    { id: 7, title: 'About Us', content: 'Company background and qualifications...', included: true },
    { id: 8, title: 'Case Studies', content: 'Relevant past work examples...', included: false },
    { id: 9, title: 'Terms & Conditions', content: 'Legal terms and conditions...', included: true },
    { id: 10, title: 'Next Steps', content: 'How to proceed and contact information...', included: true },
  ]

  const [sections, setSections] = useState<Section[]>(defaultSections)

  const toggleSection = (id: number) => {
    setSections(sections.map(s => s.id === id ? { ...s, included: !s.included } : s))
  }

  const updateSection = (id: number, field: 'title' | 'content', value: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sections.length) return
    const newSections = [...sections]
    ;[newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]]
    setSections(newSections)
  }

  const generateProposal = (): string => {
    let doc = `${'═'.repeat(60)}\n`
    doc += `BUSINESS PROPOSAL\n`
    doc += `${'═'.repeat(60)}\n\n`

    doc += `Project: ${proposal.projectName || '[Project Name]'}\n`
    doc += `Prepared for: ${proposal.clientName || '[Client Name]'}\n`
    doc += `Date: ${proposal.date}\n`
    doc += `Valid Until: ${proposal.validUntil}\n\n`

    doc += `Prepared by: ${proposal.preparedBy || '[Your Name]'}\n`
    if (proposal.company) doc += `Company: ${proposal.company}\n`
    doc += '\n'

    sections.filter(s => s.included).forEach((section, index) => {
      doc += `${'─'.repeat(50)}\n`
      doc += `${index + 1}. ${section.title.toUpperCase()}\n`
      doc += `${'─'.repeat(50)}\n`
      doc += `${section.content}\n\n`
    })

    doc += `${'═'.repeat(60)}\n`
    doc += `© ${new Date().getFullYear()} ${proposal.company || '[Your Company]'}\n`

    return doc
  }

  const copyProposal = () => {
    navigator.clipboard.writeText(generateProposal())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.proposalTemplate.details')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={proposal.clientName}
            onChange={(e) => setProposal({ ...proposal, clientName: e.target.value })}
            placeholder="Client Name"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={proposal.projectName}
            onChange={(e) => setProposal({ ...proposal, projectName: e.target.value })}
            placeholder="Project Name"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={proposal.preparedBy}
            onChange={(e) => setProposal({ ...proposal, preparedBy: e.target.value })}
            placeholder="Prepared By"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={proposal.company}
            onChange={(e) => setProposal({ ...proposal, company: e.target.value })}
            placeholder="Your Company"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={proposal.date}
            onChange={(e) => setProposal({ ...proposal, date: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={proposal.validUntil}
            onChange={(e) => setProposal({ ...proposal, validUntil: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.proposalTemplate.sections')}</h3>
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div key={section.id} className={`p-3 rounded border ${section.included ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={section.included}
                    onChange={() => toggleSection(section.id)}
                    className="rounded"
                  />
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    className="font-medium bg-transparent border-none focus:outline-none"
                  />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
              </div>
              {section.included && (
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                  rows={2}
                  className="w-full px-2 py-1 text-sm bg-white border border-slate-200 rounded resize-none"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h3 className="font-medium mb-2">{t('tools.proposalTemplate.summary')}</h3>
        <p className="text-sm text-slate-600">
          {sections.filter(s => s.included).length} of {sections.length} sections included
        </p>
      </div>

      <button
        onClick={copyProposal}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.proposalTemplate.copy')}
      </button>
    </div>
  )
}
