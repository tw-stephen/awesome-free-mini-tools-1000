import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Document {
  id: number
  type: string
  name: string
  number: string
  expiryDate: string
  issuedBy: string
  notes: string
}

const documentTypes = [
  { id: 'passport', name: 'Passport', icon: '📕' },
  { id: 'visa', name: 'Visa', icon: '📄' },
  { id: 'id', name: 'ID Card', icon: '🪪' },
  { id: 'driver', name: 'Driver License', icon: '🚗' },
  { id: 'insurance', name: 'Travel Insurance', icon: '🛡️' },
  { id: 'health', name: 'Health Card', icon: '🏥' },
  { id: 'vaccination', name: 'Vaccination Record', icon: '💉' },
  { id: 'flight', name: 'Flight Ticket', icon: '✈️' },
  { id: 'hotel', name: 'Hotel Reservation', icon: '🏨' },
  { id: 'rental', name: 'Car Rental', icon: '🚙' },
  { id: 'itinerary', name: 'Itinerary', icon: '📋' },
  { id: 'other', name: 'Other', icon: '📁' },
]

export default function TravelDocOrganizer() {
  const { t } = useTranslation()
  const [documents, setDocuments] = useState<Document[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newDoc, setNewDoc] = useState({
    type: 'passport',
    name: '',
    number: '',
    expiryDate: '',
    issuedBy: '',
    notes: '',
  })
  const [filterType, setFilterType] = useState('all')

  const addOrUpdateDocument = () => {
    if (!newDoc.name.trim()) return

    if (editingId) {
      setDocuments(documents.map(doc =>
        doc.id === editingId ? { ...newDoc, id: editingId } : doc
      ))
      setEditingId(null)
    } else {
      setDocuments([...documents, { ...newDoc, id: Date.now() }])
    }

    setNewDoc({
      type: 'passport',
      name: '',
      number: '',
      expiryDate: '',
      issuedBy: '',
      notes: '',
    })
    setShowForm(false)
  }

  const editDocument = (doc: Document) => {
    setNewDoc({
      type: doc.type,
      name: doc.name,
      number: doc.number,
      expiryDate: doc.expiryDate,
      issuedBy: doc.issuedBy,
      notes: doc.notes,
    })
    setEditingId(doc.id)
    setShowForm(true)
  }

  const removeDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const threeMonths = new Date()
    threeMonths.setMonth(threeMonths.getMonth() + 3)
    return expiry <= threeMonths && expiry > today
  }

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  const filteredDocs = filterType === 'all'
    ? documents
    : documents.filter(doc => doc.type === filterType)

  const expiringDocs = documents.filter(doc => isExpiringSoon(doc.expiryDate))
  const expiredDocs = documents.filter(doc => isExpired(doc.expiryDate))

  const exportDocuments = () => {
    let text = `Travel Documents\n${'='.repeat(40)}\n\n`

    documentTypes.forEach(docType => {
      const typeDocs = documents.filter(d => d.type === docType.id)
      if (typeDocs.length > 0) {
        text += `${docType.icon} ${docType.name}\n`
        text += `${'-'.repeat(30)}\n`
        typeDocs.forEach(doc => {
          text += `  ${doc.name}\n`
          if (doc.number) text += `    Number: ${doc.number}\n`
          if (doc.expiryDate) text += `    Expires: ${doc.expiryDate}\n`
          if (doc.issuedBy) text += `    Issued by: ${doc.issuedBy}\n`
          if (doc.notes) text += `    Notes: ${doc.notes}\n`
          text += '\n'
        })
      }
    })

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'travel-documents.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {(expiringDocs.length > 0 || expiredDocs.length > 0) && (
        <div className="card p-4 bg-yellow-50 border border-yellow-200">
          <h3 className="font-medium text-yellow-700 mb-2">
            ⚠️ {t('tools.travelDocOrganizer.alerts')}
          </h3>
          {expiredDocs.map(doc => (
            <div key={doc.id} className="text-sm text-red-600 flex items-center gap-2">
              <span>🔴</span>
              <span>{doc.name} - {t('tools.travelDocOrganizer.expired')}</span>
            </div>
          ))}
          {expiringDocs.map(doc => (
            <div key={doc.id} className="text-sm text-yellow-600 flex items-center gap-2">
              <span>🟡</span>
              <span>{doc.name} - {t('tools.travelDocOrganizer.expiringSoon')} ({doc.expiryDate})</span>
            </div>
          ))}
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + {t('tools.travelDocOrganizer.addDocument')}
        </button>
      )}

      {showForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">
            {editingId ? t('tools.travelDocOrganizer.editDocument') : t('tools.travelDocOrganizer.addDocument')}
          </h3>
          <div className="space-y-3">
            <select
              value={newDoc.type}
              onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {documentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={newDoc.name}
              onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
              placeholder={t('tools.travelDocOrganizer.documentName')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={newDoc.number}
                onChange={e => setNewDoc({ ...newDoc, number: e.target.value })}
                placeholder={t('tools.travelDocOrganizer.documentNumber')}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="date"
                value={newDoc.expiryDate}
                onChange={e => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <input
              type="text"
              value={newDoc.issuedBy}
              onChange={e => setNewDoc({ ...newDoc, issuedBy: e.target.value })}
              placeholder={t('tools.travelDocOrganizer.issuedBy')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <textarea
              value={newDoc.notes}
              onChange={e => setNewDoc({ ...newDoc, notes: e.target.value })}
              placeholder={t('tools.travelDocOrganizer.notes')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={addOrUpdateDocument}
                disabled={!newDoc.name.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setNewDoc({
                    type: 'passport',
                    name: '',
                    number: '',
                    expiryDate: '',
                    issuedBy: '',
                    notes: '',
                  })
                }}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.travelDocOrganizer.filter')}</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterType === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              All ({documents.length})
            </button>
            {documentTypes.filter(dt => documents.some(d => d.type === dt.id)).map(docType => (
              <button
                key={docType.id}
                onClick={() => setFilterType(docType.id)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  filterType === docType.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <span>{docType.icon}</span>
                <span>{documents.filter(d => d.type === docType.id).length}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filteredDocs.map(doc => {
          const docType = documentTypes.find(dt => dt.id === doc.type)
          const expired = isExpired(doc.expiryDate)
          const expiring = isExpiringSoon(doc.expiryDate)

          return (
            <div
              key={doc.id}
              className={`card p-4 ${
                expired ? 'bg-red-50 border-red-200' :
                expiring ? 'bg-yellow-50 border-yellow-200' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{docType?.icon}</span>
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-sm text-slate-500">{docType?.name}</div>
                    {doc.number && (
                      <div className="text-sm mt-1">
                        <span className="text-slate-500">Number:</span> {doc.number}
                      </div>
                    )}
                    {doc.expiryDate && (
                      <div className={`text-sm ${expired ? 'text-red-600' : expiring ? 'text-yellow-600' : ''}`}>
                        <span className="text-slate-500">Expires:</span> {doc.expiryDate}
                        {expired && ' (Expired)'}
                        {expiring && !expired && ' (Expiring soon)'}
                      </div>
                    )}
                    {doc.issuedBy && (
                      <div className="text-sm">
                        <span className="text-slate-500">Issued by:</span> {doc.issuedBy}
                      </div>
                    )}
                    {doc.notes && (
                      <div className="text-sm text-slate-400 mt-1">{doc.notes}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editDocument(doc)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    x
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {documents.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          <div className="text-4xl mb-2">📁</div>
          {t('tools.travelDocOrganizer.noDocuments')}
        </div>
      )}

      {documents.length > 0 && (
        <button
          onClick={exportDocuments}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t('tools.travelDocOrganizer.export')}
        </button>
      )}
    </div>
  )
}
