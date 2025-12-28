import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ContactCardGenerator() {
  const { t } = useTranslation()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [organization, setOrganization] = useState('')
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [mobile, setMobile] = useState('')
  const [website, setWebsite] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [notes, setNotes] = useState('')

  const generateVCard = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${lastName};${firstName};;;`,
      `FN:${firstName} ${lastName}`,
      organization && `ORG:${organization}`,
      title && `TITLE:${title}`,
      email && `EMAIL;TYPE=INTERNET:${email}`,
      phone && `TEL;TYPE=WORK,VOICE:${phone}`,
      mobile && `TEL;TYPE=CELL:${mobile}`,
      website && `URL:${website}`,
      (address || city || country) && `ADR;TYPE=WORK:;;${address};${city};;;${country}`,
      notes && `NOTE:${notes}`,
      'END:VCARD'
    ].filter(Boolean).join('\n')

    return vcard
  }

  const downloadVCard = () => {
    const vcard = generateVCard()
    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${firstName}_${lastName}.vcf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyVCard = () => {
    navigator.clipboard.writeText(generateVCard())
  }

  const isValid = firstName || lastName

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">
          {t('tools.contactCardGenerator.personalInfo')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t('tools.contactCardGenerator.firstName')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t('tools.contactCardGenerator.lastName')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <input
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder={t('tools.contactCardGenerator.organization')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('tools.contactCardGenerator.jobTitle')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">
          {t('tools.contactCardGenerator.contactInfo')}
        </h3>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('tools.contactCardGenerator.email')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('tools.contactCardGenerator.phone')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder={t('tools.contactCardGenerator.mobile')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder={t('tools.contactCardGenerator.website')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">
          {t('tools.contactCardGenerator.address')}
        </h3>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t('tools.contactCardGenerator.streetAddress')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t('tools.contactCardGenerator.city')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={t('tools.contactCardGenerator.country')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.contactCardGenerator.notes')}
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('tools.contactCardGenerator.notesPlaceholder')}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
      </div>

      {isValid && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.contactCardGenerator.preview')}
          </h3>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-lg text-white">
            <div className="text-xl font-bold">{firstName} {lastName}</div>
            {title && <div className="text-sm opacity-90">{title}</div>}
            {organization && <div className="text-sm opacity-80">{organization}</div>}
            <div className="mt-3 space-y-1 text-sm">
              {email && <div>✉ {email}</div>}
              {phone && <div>☎ {phone}</div>}
              {mobile && <div>📱 {mobile}</div>}
              {website && <div>🌐 {website}</div>}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={downloadVCard}
          disabled={!isValid}
          className="flex-1 py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
        >
          {t('tools.contactCardGenerator.downloadVCard')}
        </button>
        <button
          onClick={copyVCard}
          disabled={!isValid}
          className="px-4 py-3 bg-slate-100 rounded disabled:opacity-50"
        >
          {t('tools.contactCardGenerator.copy')}
        </button>
      </div>

      <div className="card p-4 bg-blue-50">
        <p className="text-sm text-blue-700">
          {t('tools.contactCardGenerator.tip')}
        </p>
      </div>
    </div>
  )
}
