import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CertInfo {
  subject: string
  issuer: string
  validFrom: string
  validTo: string
  daysRemaining: number
  serialNumber: string
  algorithm: string
  keySize: number
  san: string[]
}

export default function SSLCertificateInfo() {
  const { t } = useTranslation()
  const [domain, setDomain] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [certInfo, setCertInfo] = useState<CertInfo | null>(null)
  const [error, setError] = useState('')

  // Simulated certificate check (in production, would use a backend API)
  const checkCertificate = () => {
    if (!domain) return

    setIsChecking(true)
    setError('')
    setCertInfo(null)

    // Simulate API call
    setTimeout(() => {
      // Demo data
      const now = new Date()
      const validFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      const validTo = new Date(now.getTime() + 275 * 24 * 60 * 60 * 1000)
      const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))

      setCertInfo({
        subject: `CN=${domain.replace(/^(https?:\/\/)/, '')}`,
        issuer: 'CN=R3, O=Let\'s Encrypt, C=US',
        validFrom: validFrom.toISOString().split('T')[0],
        validTo: validTo.toISOString().split('T')[0],
        daysRemaining,
        serialNumber: '03:' + Array.from({ length: 17 }, () =>
          Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
        ).join(':'),
        algorithm: 'SHA256withRSA',
        keySize: 2048,
        san: [domain.replace(/^(https?:\/\/)/, ''), `www.${domain.replace(/^(https?:\/\/)/, '')}`],
      })
      setIsChecking(false)
    }, 1500)
  }

  const getStatusColor = (days: number): string => {
    if (days <= 0) return 'text-red-600 bg-red-50'
    if (days <= 30) return 'text-orange-600 bg-orange-50'
    if (days <= 90) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getStatusLabel = (days: number): string => {
    if (days <= 0) return 'Expired'
    if (days <= 30) return 'Expiring Soon'
    if (days <= 90) return 'Valid (Renew Soon)'
    return 'Valid'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.sslCertificateInfo.check')}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="flex-1 px-4 py-3 border border-slate-300 rounded"
            onKeyDown={(e) => e.key === 'Enter' && checkCertificate()}
          />
          <button
            onClick={checkCertificate}
            disabled={!domain || isChecking}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            {isChecking ? 'Checking...' : 'Check'}
          </button>
        </div>
      </div>

      {isChecking && (
        <div className="card p-8 text-center">
          <div className="animate-spin text-4xl mb-4">🔒</div>
          <p className="text-slate-600">Checking SSL certificate...</p>
        </div>
      )}

      {error && (
        <div className="card p-4 bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {certInfo && !isChecking && (
        <>
          <div className={`card p-4 ${getStatusColor(certInfo.daysRemaining)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {certInfo.daysRemaining > 0 ? '✓' : '✗'}
                </span>
                <div>
                  <h3 className="font-bold text-lg">{getStatusLabel(certInfo.daysRemaining)}</h3>
                  <p className="text-sm opacity-80">
                    {certInfo.daysRemaining > 0
                      ? `${certInfo.daysRemaining} days until expiration`
                      : `Expired ${Math.abs(certInfo.daysRemaining)} days ago`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.sslCertificateInfo.details')}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded">
                  <label className="text-xs text-slate-500 block">Subject</label>
                  <span className="font-mono text-sm">{certInfo.subject}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <label className="text-xs text-slate-500 block">Issuer</label>
                  <span className="font-mono text-sm">{certInfo.issuer}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <label className="text-xs text-slate-500 block">Valid From</label>
                  <span className="font-mono text-sm">{certInfo.validFrom}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <label className="text-xs text-slate-500 block">Valid To</label>
                  <span className="font-mono text-sm">{certInfo.validTo}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <label className="text-xs text-slate-500 block">Algorithm</label>
                  <span className="font-mono text-sm">{certInfo.algorithm}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <label className="text-xs text-slate-500 block">Key Size</label>
                  <span className="font-mono text-sm">{certInfo.keySize} bits</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded">
                <label className="text-xs text-slate-500 block mb-1">Serial Number</label>
                <span className="font-mono text-xs break-all">{certInfo.serialNumber}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded">
                <label className="text-xs text-slate-500 block mb-1">Subject Alternative Names (SAN)</label>
                <div className="flex flex-wrap gap-1">
                  {certInfo.san.map((name, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.sslCertificateInfo.recommendations')}</h3>
            <div className="space-y-2">
              {certInfo.daysRemaining <= 30 && (
                <div className="p-3 bg-red-50 rounded text-sm text-red-700">
                  ⚠️ Certificate expires soon! Renew immediately to avoid service disruption.
                </div>
              )}
              {certInfo.keySize < 2048 && (
                <div className="p-3 bg-yellow-50 rounded text-sm text-yellow-700">
                  ⚠️ Key size is below recommended 2048 bits. Consider upgrading.
                </div>
              )}
              {certInfo.algorithm.includes('SHA1') && (
                <div className="p-3 bg-yellow-50 rounded text-sm text-yellow-700">
                  ⚠️ SHA-1 is deprecated. Use SHA-256 or higher.
                </div>
              )}
              {certInfo.daysRemaining > 30 && certInfo.keySize >= 2048 && (
                <div className="p-3 bg-green-50 rounded text-sm text-green-700">
                  ✓ Certificate configuration looks good!
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.sslCertificateInfo.info')}</h4>
        <p className="text-sm text-slate-600 mb-2">
          This is a demonstration tool. For real SSL checks, use:
        </p>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• <strong>SSL Labs:</strong> ssllabs.com/ssltest</li>
          <li>• <strong>OpenSSL:</strong> <code className="bg-white px-1 rounded">openssl s_client -connect example.com:443</code></li>
          <li>• <strong>Browser:</strong> Click lock icon in address bar</li>
        </ul>
      </div>
    </div>
  )
}
