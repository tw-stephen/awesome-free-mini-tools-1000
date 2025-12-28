import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Clause {
  id: number
  title: string
  content: string
  required: boolean
  included: boolean
}

export default function ContractTemplate() {
  const { t } = useTranslation()
  const [contract, setContract] = useState({
    type: 'service',
    partyA: '',
    partyB: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    endDate: '',
    jurisdiction: '',
  })

  const contractTypes = [
    { id: 'service', name: 'Service Agreement' },
    { id: 'nda', name: 'Non-Disclosure Agreement' },
    { id: 'employment', name: 'Employment Contract' },
    { id: 'freelance', name: 'Freelance Contract' },
    { id: 'partnership', name: 'Partnership Agreement' },
  ]

  const defaultClauses: Clause[] = [
    { id: 1, title: 'Parties', content: 'This agreement is entered into between [Party A] ("First Party") and [Party B] ("Second Party").', required: true, included: true },
    { id: 2, title: 'Scope of Services', content: 'The scope of work includes: [describe services to be provided]', required: true, included: true },
    { id: 3, title: 'Term', content: 'This agreement shall commence on [Start Date] and continue until [End Date] unless terminated earlier.', required: true, included: true },
    { id: 4, title: 'Compensation', content: 'In consideration for the services, [Party A] shall pay [Party B] the amount of $[Amount].', required: true, included: true },
    { id: 5, title: 'Payment Terms', content: 'Payment shall be made within [30] days of invoice receipt via [payment method].', required: false, included: true },
    { id: 6, title: 'Confidentiality', content: 'Both parties agree to maintain strict confidentiality of all proprietary information shared during this engagement.', required: false, included: true },
    { id: 7, title: 'Intellectual Property', content: 'All work product created shall be the sole property of [specify party].', required: false, included: true },
    { id: 8, title: 'Termination', content: 'Either party may terminate this agreement with [30] days written notice.', required: false, included: true },
    { id: 9, title: 'Liability', content: 'Neither party shall be liable for indirect, incidental, or consequential damages.', required: false, included: true },
    { id: 10, title: 'Dispute Resolution', content: 'Any disputes shall be resolved through [arbitration/mediation] in [jurisdiction].', required: false, included: true },
    { id: 11, title: 'Force Majeure', content: 'Neither party shall be liable for delays caused by circumstances beyond reasonable control.', required: false, included: false },
    { id: 12, title: 'Entire Agreement', content: 'This agreement constitutes the entire understanding between the parties.', required: true, included: true },
  ]

  const [clauses, setClauses] = useState<Clause[]>(defaultClauses)

  const toggleClause = (id: number) => {
    setClauses(clauses.map(c => {
      if (c.id === id && !c.required) {
        return { ...c, included: !c.included }
      }
      return c
    }))
  }

  const updateClause = (id: number, content: string) => {
    setClauses(clauses.map(c => c.id === id ? { ...c, content } : c))
  }

  const generateContract = (): string => {
    let doc = `${'═'.repeat(60)}\n`
    doc += `${contractTypes.find(t => t.id === contract.type)?.name.toUpperCase() || 'CONTRACT'}\n`
    doc += `${'═'.repeat(60)}\n\n`

    doc += `Effective Date: ${contract.effectiveDate}\n`
    if (contract.endDate) doc += `End Date: ${contract.endDate}\n`
    if (contract.jurisdiction) doc += `Governing Law: ${contract.jurisdiction}\n`
    doc += '\n'

    const includedClauses = clauses.filter(c => c.included)
    includedClauses.forEach((clause, index) => {
      doc += `${index + 1}. ${clause.title.toUpperCase()}\n`
      doc += `${'─'.repeat(40)}\n`
      let content = clause.content
      content = content.replace('[Party A]', contract.partyA || '[Party A]')
      content = content.replace('[Party B]', contract.partyB || '[Party B]')
      content = content.replace('[Start Date]', contract.effectiveDate)
      content = content.replace('[End Date]', contract.endDate || '[End Date]')
      doc += `${content}\n\n`
    })

    doc += `${'═'.repeat(60)}\n`
    doc += `SIGNATURES\n\n`
    doc += `${contract.partyA || '[Party A]'}\n`
    doc += `Signature: _________________________ Date: _________\n\n`
    doc += `${contract.partyB || '[Party B]'}\n`
    doc += `Signature: _________________________ Date: _________\n`

    return doc
  }

  const copyContract = () => {
    navigator.clipboard.writeText(generateContract())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.contractTemplate.type')}</h3>
        <div className="flex flex-wrap gap-2">
          {contractTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setContract({ ...contract, type: type.id })}
              className={`px-3 py-2 rounded text-sm ${contract.type === type.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.contractTemplate.parties')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={contract.partyA}
            onChange={(e) => setContract({ ...contract, partyA: e.target.value })}
            placeholder="Party A (e.g., Your Company)"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={contract.partyB}
            onChange={(e) => setContract({ ...contract, partyB: e.target.value })}
            placeholder="Party B (e.g., Client/Vendor)"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={contract.effectiveDate}
            onChange={(e) => setContract({ ...contract, effectiveDate: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={contract.endDate}
            onChange={(e) => setContract({ ...contract, endDate: e.target.value })}
            placeholder="End Date (optional)"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={contract.jurisdiction}
            onChange={(e) => setContract({ ...contract, jurisdiction: e.target.value })}
            placeholder="Jurisdiction (e.g., State of California)"
            className="col-span-2 px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.contractTemplate.clauses')}</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {clauses.map(clause => (
            <div key={clause.id} className={`p-3 rounded border ${clause.included ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={clause.included}
                  onChange={() => toggleClause(clause.id)}
                  disabled={clause.required}
                  className="rounded"
                />
                <span className="font-medium">{clause.title}</span>
                {clause.required && <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs">Required</span>}
              </div>
              {clause.included && (
                <textarea
                  value={clause.content}
                  onChange={(e) => updateClause(clause.id, e.target.value)}
                  rows={2}
                  className="w-full px-2 py-1 text-sm bg-white border border-slate-200 rounded resize-none"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-amber-50">
        <h4 className="font-medium text-amber-800 mb-1">{t('tools.contractTemplate.disclaimer')}</h4>
        <p className="text-sm text-amber-700">
          This is a template for reference only. Please consult a legal professional before using any contract.
        </p>
      </div>

      <button
        onClick={copyContract}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.contractTemplate.copy')}
      </button>
    </div>
  )
}
