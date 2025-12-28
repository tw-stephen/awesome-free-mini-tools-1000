import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface DataField {
  id: number
  name: string
  example: string
  classification: 'public' | 'internal' | 'confidential' | 'restricted'
  pii: boolean
  phi: boolean
  pci: boolean
}

export default function DataClassifier() {
  const { t } = useTranslation()
  const [fields, setFields] = useState<DataField[]>([
    { id: 1, name: '', example: '', classification: 'internal', pii: false, phi: false, pci: false },
  ])

  const addField = () => {
    setFields([...fields, {
      id: Date.now(),
      name: '',
      example: '',
      classification: 'internal',
      pii: false,
      phi: false,
      pci: false,
    }])
  }

  const updateField = (id: number, field: keyof DataField, value: string | boolean) => {
    setFields(fields.map(f => f.id === id ? { ...f, [field]: value } : f))
  }

  const removeField = (id: number) => {
    if (fields.length > 1) {
      setFields(fields.filter(f => f.id !== id))
    }
  }

  const autoClassify = (id: number) => {
    const field = fields.find(f => f.id === id)
    if (!field) return

    const name = field.name.toLowerCase()
    const example = field.example.toLowerCase()

    let classification: DataField['classification'] = 'internal'
    let pii = false
    let phi = false
    let pci = false

    // PII patterns
    const piiPatterns = ['name', 'email', 'phone', 'address', 'ssn', 'social security', 'dob', 'birthday', 'passport', 'license']
    if (piiPatterns.some(p => name.includes(p) || example.includes(p))) {
      pii = true
      classification = 'confidential'
    }

    // PHI patterns
    const phiPatterns = ['diagnosis', 'medical', 'health', 'patient', 'prescription', 'treatment', 'condition', 'allergy']
    if (phiPatterns.some(p => name.includes(p) || example.includes(p))) {
      phi = true
      classification = 'restricted'
    }

    // PCI patterns
    const pciPatterns = ['credit card', 'card number', 'cvv', 'expiry', 'bank account', 'routing']
    if (pciPatterns.some(p => name.includes(p) || example.includes(p))) {
      pci = true
      classification = 'restricted'
    }

    // SSN pattern
    if (/\d{3}-\d{2}-\d{4}/.test(example)) {
      pii = true
      classification = 'restricted'
    }

    // Credit card pattern
    if (/\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/.test(example)) {
      pci = true
      classification = 'restricted'
    }

    // Email pattern
    if (/@/.test(example)) {
      pii = true
      classification = classification === 'internal' ? 'confidential' : classification
    }

    setFields(fields.map(f => f.id === id ? { ...f, classification, pii, phi, pci } : f))
  }

  const getClassificationColor = (classification: DataField['classification']): string => {
    switch (classification) {
      case 'public': return 'bg-green-100 text-green-700 border-green-300'
      case 'internal': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'confidential': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'restricted': return 'bg-red-100 text-red-700 border-red-300'
    }
  }

  const generateReport = (): string => {
    let report = `DATA CLASSIFICATION REPORT\n${'='.repeat(60)}\n\n`
    report += `Generated: ${new Date().toLocaleString()}\n\n`

    const classifications = ['restricted', 'confidential', 'internal', 'public'] as const
    classifications.forEach(cls => {
      const clsFields = fields.filter(f => f.classification === cls && f.name)
      if (clsFields.length > 0) {
        report += `${cls.toUpperCase()}\n${'─'.repeat(40)}\n`
        clsFields.forEach(f => {
          report += `• ${f.name}`
          const labels = []
          if (f.pii) labels.push('PII')
          if (f.phi) labels.push('PHI')
          if (f.pci) labels.push('PCI')
          if (labels.length) report += ` [${labels.join(', ')}]`
          report += '\n'
        })
        report += '\n'
      }
    })

    report += `SUMMARY\n${'─'.repeat(40)}\n`
    report += `Total Fields: ${fields.filter(f => f.name).length}\n`
    report += `PII Fields: ${fields.filter(f => f.pii).length}\n`
    report += `PHI Fields: ${fields.filter(f => f.phi).length}\n`
    report += `PCI Fields: ${fields.filter(f => f.pci).length}\n`

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.dataClassifier.fields')}</h3>
          <button onClick={addField} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
            + Add Field
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.id} className="p-3 bg-slate-50 rounded space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateField(field.id, 'name', e.target.value)}
                  placeholder="Field name (e.g., email_address)"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
                <button
                  onClick={() => autoClassify(field.id)}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
                >
                  Auto
                </button>
                <button
                  onClick={() => removeField(field.id)}
                  className="px-2 text-red-500"
                >
                  X
                </button>
              </div>
              <input
                type="text"
                value={field.example}
                onChange={(e) => updateField(field.id, 'example', e.target.value)}
                placeholder="Example value (for auto-detection)"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <div className="flex gap-3 items-center">
                <select
                  value={field.classification}
                  onChange={(e) => updateField(field.id, 'classification', e.target.value)}
                  className={`px-3 py-2 rounded border ${getClassificationColor(field.classification)}`}
                >
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="confidential">Confidential</option>
                  <option value="restricted">Restricted</option>
                </select>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={field.pii}
                    onChange={(e) => updateField(field.id, 'pii', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">PII</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={field.phi}
                    onChange={(e) => updateField(field.id, 'phi', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">PHI</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={field.pci}
                    onChange={(e) => updateField(field.id, 'pci', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">PCI</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.dataClassifier.legend')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-green-50 rounded border border-green-200">
            <span className="font-medium text-green-700">Public</span>
            <p className="text-slate-600 text-xs">Can be shared publicly</p>
          </div>
          <div className="p-2 bg-blue-50 rounded border border-blue-200">
            <span className="font-medium text-blue-700">Internal</span>
            <p className="text-slate-600 text-xs">Internal use only</p>
          </div>
          <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
            <span className="font-medium text-yellow-700">Confidential</span>
            <p className="text-slate-600 text-xs">Need-to-know basis</p>
          </div>
          <div className="p-2 bg-red-50 rounded border border-red-200">
            <span className="font-medium text-red-700">Restricted</span>
            <p className="text-slate-600 text-xs">Highly sensitive, regulated</p>
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-slate-500">
          <span><strong>PII:</strong> Personal Identifiable Info</span>
          <span><strong>PHI:</strong> Protected Health Info</span>
          <span><strong>PCI:</strong> Payment Card Industry</span>
        </div>
      </div>

      <button
        onClick={copyReport}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.dataClassifier.copyReport')}
      </button>

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.dataClassifier.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Enter example data to auto-detect classification</li>
          <li>• PII requires special handling under GDPR/CCPA</li>
          <li>• PHI is regulated under HIPAA</li>
          <li>• PCI data requires PCI-DSS compliance</li>
        </ul>
      </div>
    </div>
  )
}
