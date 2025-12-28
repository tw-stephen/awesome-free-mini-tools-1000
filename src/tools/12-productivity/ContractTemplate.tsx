import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type ContractType = 'freelance' | 'nda' | 'employment' | 'rental' | 'sales'

interface ContractField {
  key: string
  label: string
  type: 'text' | 'date' | 'number' | 'textarea'
}

export default function ContractTemplate() {
  const { t } = useTranslation()
  const [contractType, setContractType] = useState<ContractType>('freelance')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const contractFields: Record<ContractType, ContractField[]> = {
    freelance: [
      { key: 'clientName', label: t('tools.contractTemplate.clientName'), type: 'text' },
      { key: 'freelancerName', label: t('tools.contractTemplate.freelancerName'), type: 'text' },
      { key: 'projectDescription', label: t('tools.contractTemplate.projectDescription'), type: 'textarea' },
      { key: 'startDate', label: t('tools.contractTemplate.startDate'), type: 'date' },
      { key: 'endDate', label: t('tools.contractTemplate.endDate'), type: 'date' },
      { key: 'totalAmount', label: t('tools.contractTemplate.totalAmount'), type: 'number' },
      { key: 'paymentTerms', label: t('tools.contractTemplate.paymentTerms'), type: 'text' }
    ],
    nda: [
      { key: 'partyA', label: t('tools.contractTemplate.partyA'), type: 'text' },
      { key: 'partyB', label: t('tools.contractTemplate.partyB'), type: 'text' },
      { key: 'effectiveDate', label: t('tools.contractTemplate.effectiveDate'), type: 'date' },
      { key: 'duration', label: t('tools.contractTemplate.duration'), type: 'text' },
      { key: 'confidentialInfo', label: t('tools.contractTemplate.confidentialInfo'), type: 'textarea' }
    ],
    employment: [
      { key: 'employerName', label: t('tools.contractTemplate.employerName'), type: 'text' },
      { key: 'employeeName', label: t('tools.contractTemplate.employeeName'), type: 'text' },
      { key: 'position', label: t('tools.contractTemplate.position'), type: 'text' },
      { key: 'startDate', label: t('tools.contractTemplate.startDate'), type: 'date' },
      { key: 'salary', label: t('tools.contractTemplate.salary'), type: 'number' },
      { key: 'benefits', label: t('tools.contractTemplate.benefits'), type: 'textarea' }
    ],
    rental: [
      { key: 'landlordName', label: t('tools.contractTemplate.landlordName'), type: 'text' },
      { key: 'tenantName', label: t('tools.contractTemplate.tenantName'), type: 'text' },
      { key: 'propertyAddress', label: t('tools.contractTemplate.propertyAddress'), type: 'textarea' },
      { key: 'startDate', label: t('tools.contractTemplate.startDate'), type: 'date' },
      { key: 'endDate', label: t('tools.contractTemplate.endDate'), type: 'date' },
      { key: 'monthlyRent', label: t('tools.contractTemplate.monthlyRent'), type: 'number' },
      { key: 'securityDeposit', label: t('tools.contractTemplate.securityDeposit'), type: 'number' }
    ],
    sales: [
      { key: 'sellerName', label: t('tools.contractTemplate.sellerName'), type: 'text' },
      { key: 'buyerName', label: t('tools.contractTemplate.buyerName'), type: 'text' },
      { key: 'itemDescription', label: t('tools.contractTemplate.itemDescription'), type: 'textarea' },
      { key: 'salePrice', label: t('tools.contractTemplate.salePrice'), type: 'number' },
      { key: 'deliveryDate', label: t('tools.contractTemplate.deliveryDate'), type: 'date' },
      { key: 'paymentMethod', label: t('tools.contractTemplate.paymentMethod'), type: 'text' }
    ]
  }

  const generateContract = (): string => {
    const date = new Date().toLocaleDateString()

    const templates: Record<ContractType, string> = {
      freelance: `
FREELANCE SERVICE AGREEMENT

Date: ${date}

This Freelance Service Agreement ("Agreement") is entered into between:

CLIENT: ${fields.clientName || '[Client Name]'}
FREELANCER: ${fields.freelancerName || '[Freelancer Name]'}

1. SERVICES
The Freelancer agrees to provide the following services:
${fields.projectDescription || '[Project Description]'}

2. TERM
Start Date: ${fields.startDate || '[Start Date]'}
End Date: ${fields.endDate || '[End Date]'}

3. COMPENSATION
Total Amount: $${fields.totalAmount || '[Amount]'}
Payment Terms: ${fields.paymentTerms || '[Payment Terms]'}

4. INTELLECTUAL PROPERTY
All work product created by the Freelancer shall become the property of the Client upon full payment.

5. CONFIDENTIALITY
Both parties agree to maintain confidentiality of any proprietary information shared during the project.

6. TERMINATION
Either party may terminate this Agreement with 14 days written notice.

7. GOVERNING LAW
This Agreement shall be governed by applicable laws.

________________________          ________________________
Client Signature                  Freelancer Signature

Date: ________________           Date: ________________
`,
      nda: `
NON-DISCLOSURE AGREEMENT

Effective Date: ${fields.effectiveDate || date}

This Non-Disclosure Agreement ("Agreement") is entered into between:

DISCLOSING PARTY: ${fields.partyA || '[Party A]'}
RECEIVING PARTY: ${fields.partyB || '[Party B]'}

1. DEFINITION OF CONFIDENTIAL INFORMATION
${fields.confidentialInfo || '[Description of Confidential Information]'}

2. OBLIGATIONS
The Receiving Party agrees to:
- Hold all Confidential Information in strict confidence
- Not disclose any Confidential Information to third parties
- Use Confidential Information only for the intended purpose

3. TERM
This Agreement shall remain in effect for ${fields.duration || '[Duration]'}.

4. RETURN OF MATERIALS
Upon termination, all confidential materials must be returned or destroyed.

5. REMEDIES
The Disclosing Party shall be entitled to seek injunctive relief for any breach.

________________________          ________________________
Disclosing Party Signature        Receiving Party Signature

Date: ________________           Date: ________________
`,
      employment: `
EMPLOYMENT CONTRACT

Date: ${date}

This Employment Contract ("Agreement") is entered into between:

EMPLOYER: ${fields.employerName || '[Employer Name]'}
EMPLOYEE: ${fields.employeeName || '[Employee Name]'}

1. POSITION
The Employee is hired for the position of: ${fields.position || '[Position]'}

2. START DATE
Employment begins on: ${fields.startDate || '[Start Date]'}

3. COMPENSATION
Base Salary: $${fields.salary || '[Salary]'} per year

4. BENEFITS
${fields.benefits || '[Benefits Description]'}

5. WORK HOURS
Standard work hours as determined by the Employer.

6. TERMINATION
Either party may terminate this agreement with appropriate notice.

7. CONFIDENTIALITY
Employee agrees to maintain confidentiality of company information.

________________________          ________________________
Employer Signature                Employee Signature

Date: ________________           Date: ________________
`,
      rental: `
RESIDENTIAL LEASE AGREEMENT

Date: ${date}

This Lease Agreement is entered into between:

LANDLORD: ${fields.landlordName || '[Landlord Name]'}
TENANT: ${fields.tenantName || '[Tenant Name]'}

1. PROPERTY
${fields.propertyAddress || '[Property Address]'}

2. TERM
Start Date: ${fields.startDate || '[Start Date]'}
End Date: ${fields.endDate || '[End Date]'}

3. RENT
Monthly Rent: $${fields.monthlyRent || '[Monthly Rent]'}
Due on the 1st of each month

4. SECURITY DEPOSIT
Security Deposit: $${fields.securityDeposit || '[Security Deposit]'}
To be returned within 30 days of lease end, less any deductions.

5. UTILITIES
Tenant is responsible for all utilities unless otherwise specified.

6. MAINTENANCE
Tenant agrees to maintain the property in good condition.

7. PETS
No pets allowed without written consent of Landlord.

________________________          ________________________
Landlord Signature                Tenant Signature

Date: ________________           Date: ________________
`,
      sales: `
SALES CONTRACT

Date: ${date}

This Sales Contract is entered into between:

SELLER: ${fields.sellerName || '[Seller Name]'}
BUYER: ${fields.buyerName || '[Buyer Name]'}

1. DESCRIPTION OF GOODS
${fields.itemDescription || '[Item Description]'}

2. PURCHASE PRICE
Total Price: $${fields.salePrice || '[Sale Price]'}

3. PAYMENT METHOD
${fields.paymentMethod || '[Payment Method]'}

4. DELIVERY
Delivery Date: ${fields.deliveryDate || '[Delivery Date]'}

5. WARRANTIES
Seller warrants that the goods are free from defects.

6. RISK OF LOSS
Risk of loss passes to Buyer upon delivery.

7. DISPUTE RESOLUTION
Any disputes shall be resolved through arbitration.

________________________          ________________________
Seller Signature                  Buyer Signature

Date: ________________           Date: ________________
`
    }

    return templates[contractType].trim()
  }

  const copyContract = () => {
    navigator.clipboard.writeText(generateContract())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const printContract = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Contract</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            pre { white-space: pre-wrap; font-family: 'Times New Roman', serif; }
          </style>
        </head>
        <body>
          <pre>${generateContract()}</pre>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const contractTypes: ContractType[] = ['freelance', 'nda', 'employment', 'rental', 'sales']

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {contractTypes.map(type => (
          <button
            key={type}
            onClick={() => {
              setContractType(type)
              setFields({})
            }}
            className={`px-3 py-1.5 rounded text-sm capitalize ${
              contractType === type ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.contractTemplate.${type}`)}
          </button>
        ))}
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="font-medium text-slate-700">{t('tools.contractTemplate.fillDetails')}</h3>
        {contractFields[contractType].map(field => (
          <div key={field.key}>
            <label className="text-sm text-slate-600 block mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                value={fields[field.key] || ''}
                onChange={(e) => setFields({ ...fields, [field.key]: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              />
            ) : (
              <input
                type={field.type}
                value={fields[field.key] || ''}
                onChange={(e) => setFields({ ...fields, [field.key]: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            )}
          </div>
        ))}
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.contractTemplate.preview')}</h3>
        <pre className="whitespace-pre-wrap text-sm bg-slate-50 p-4 rounded max-h-96 overflow-y-auto font-serif">
          {generateContract()}
        </pre>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={copyContract}
          className={`py-2 rounded font-medium ${copied ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
        >
          {copied ? '✓' : t('tools.contractTemplate.copy')}
        </button>
        <button
          onClick={printContract}
          className="py-2 bg-blue-500 text-white rounded font-medium"
        >
          {t('tools.contractTemplate.print')}
        </button>
      </div>

      <div className="card p-4 bg-yellow-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.contractTemplate.disclaimer')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.contractTemplate.disclaimerText')}
        </p>
      </div>
    </div>
  )
}
