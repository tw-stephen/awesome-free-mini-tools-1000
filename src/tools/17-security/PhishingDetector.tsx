import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AnalysisResult {
  indicator: string
  severity: 'high' | 'medium' | 'low'
  description: string
  found: boolean
}

export default function PhishingDetector() {
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const [mode, setMode] = useState<'url' | 'email'>('url')
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [riskScore, setRiskScore] = useState(0)
  const [analyzed, setAnalyzed] = useState(false)

  const analyzeUrl = (inputUrl: string): AnalysisResult[] => {
    const findings: AnalysisResult[] = []

    // Check for suspicious TLD
    const suspiciousTLDs = ['.xyz', '.top', '.club', '.work', '.loan', '.click', '.tk', '.ml', '.ga']
    const hasSuspiciousTLD = suspiciousTLDs.some(tld => inputUrl.toLowerCase().includes(tld))
    findings.push({
      indicator: 'Suspicious TLD',
      severity: 'medium',
      description: 'Domain uses a TLD commonly associated with phishing',
      found: hasSuspiciousTLD,
    })

    // Check for IP address URL
    const hasIPAddress = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(inputUrl)
    findings.push({
      indicator: 'IP Address URL',
      severity: 'high',
      description: 'URL uses an IP address instead of domain name',
      found: hasIPAddress,
    })

    // Check for URL shorteners
    const shorteners = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly', 'is.gd']
    const hasShortener = shorteners.some(s => inputUrl.toLowerCase().includes(s))
    findings.push({
      indicator: 'URL Shortener',
      severity: 'medium',
      description: 'URL uses a shortening service that hides the real destination',
      found: hasShortener,
    })

    // Check for suspicious keywords
    const suspiciousKeywords = ['login', 'verify', 'update', 'secure', 'account', 'banking', 'confirm']
    const hasSuspiciousKeywords = suspiciousKeywords.some(k => inputUrl.toLowerCase().includes(k))
    findings.push({
      indicator: 'Suspicious Keywords',
      severity: 'low',
      description: 'URL contains keywords commonly used in phishing',
      found: hasSuspiciousKeywords,
    })

    // Check for brand impersonation
    const brands = ['paypal', 'amazon', 'apple', 'microsoft', 'google', 'facebook', 'netflix', 'bank']
    const hasBrandMisspelling = brands.some(brand => {
      const regex = new RegExp(`${brand.split('').join('.?')}`, 'i')
      return regex.test(inputUrl) && !inputUrl.toLowerCase().includes(`.${brand}.`)
    })
    findings.push({
      indicator: 'Brand Impersonation',
      severity: 'high',
      description: 'URL may be impersonating a known brand',
      found: hasBrandMisspelling,
    })

    // Check for excessive subdomains
    const subdomainCount = (inputUrl.match(/\./g) || []).length
    findings.push({
      indicator: 'Excessive Subdomains',
      severity: 'medium',
      description: 'URL has many subdomains, often used to hide real domain',
      found: subdomainCount > 3,
    })

    // Check for @ symbol in URL
    const hasAtSymbol = inputUrl.includes('@')
    findings.push({
      indicator: '@ Symbol in URL',
      severity: 'high',
      description: 'URL contains @ which can be used to trick browsers',
      found: hasAtSymbol,
    })

    return findings
  }

  const analyzeEmail = (content: string): AnalysisResult[] => {
    const findings: AnalysisResult[] = []
    const lowerContent = content.toLowerCase()

    // Check for urgency language
    const urgencyWords = ['urgent', 'immediately', 'suspend', 'expire', 'limited time', 'act now', 'verify now']
    const hasUrgency = urgencyWords.some(w => lowerContent.includes(w))
    findings.push({
      indicator: 'Urgency Language',
      severity: 'medium',
      description: 'Email creates artificial urgency to rush decision',
      found: hasUrgency,
    })

    // Check for threats
    const threatWords = ['suspend', 'terminate', 'delete', 'disable', 'blocked', 'locked']
    const hasThreats = threatWords.some(w => lowerContent.includes(w))
    findings.push({
      indicator: 'Threat Language',
      severity: 'high',
      description: 'Email threatens negative consequences',
      found: hasThreats,
    })

    // Check for requests for sensitive info
    const sensitiveRequests = ['password', 'ssn', 'social security', 'credit card', 'bank account', 'login credentials']
    const requestsSensitive = sensitiveRequests.some(w => lowerContent.includes(w))
    findings.push({
      indicator: 'Requests Sensitive Info',
      severity: 'high',
      description: 'Email asks for sensitive personal information',
      found: requestsSensitive,
    })

    // Check for generic greeting
    const genericGreetings = ['dear customer', 'dear user', 'dear member', 'dear valued']
    const hasGenericGreeting = genericGreetings.some(g => lowerContent.includes(g))
    findings.push({
      indicator: 'Generic Greeting',
      severity: 'low',
      description: 'Email uses impersonal greeting',
      found: hasGenericGreeting,
    })

    // Check for spelling/grammar issues
    const commonMisspellings = ['recieve', 'verifiy', 'accont', 'securty', 'updete']
    const hasMisspellings = commonMisspellings.some(m => lowerContent.includes(m))
    findings.push({
      indicator: 'Spelling Errors',
      severity: 'medium',
      description: 'Email contains spelling mistakes',
      found: hasMisspellings,
    })

    // Check for suspicious links
    const hasLinks = /https?:\/\//.test(content) || content.includes('click here')
    findings.push({
      indicator: 'Contains Links',
      severity: 'low',
      description: 'Email contains links (check where they lead)',
      found: hasLinks,
    })

    // Check for attachments mentioned
    const mentionsAttachment = lowerContent.includes('attachment') || lowerContent.includes('attached')
    findings.push({
      indicator: 'Mentions Attachments',
      severity: 'medium',
      description: 'Email references attachments (be cautious of executable files)',
      found: mentionsAttachment,
    })

    return findings
  }

  const analyze = () => {
    let findings: AnalysisResult[]

    if (mode === 'url') {
      findings = analyzeUrl(url)
    } else {
      findings = analyzeEmail(emailContent)
    }

    setResults(findings)

    // Calculate risk score
    const severityScores = { high: 30, medium: 15, low: 5 }
    const score = findings
      .filter(f => f.found)
      .reduce((sum, f) => sum + severityScores[f.severity], 0)
    setRiskScore(Math.min(100, score))
    setAnalyzed(true)
  }

  const getRiskLevel = (): { label: string; color: string } => {
    if (riskScore >= 60) return { label: 'High Risk', color: 'text-red-600 bg-red-50' }
    if (riskScore >= 30) return { label: 'Medium Risk', color: 'text-yellow-600 bg-yellow-50' }
    if (riskScore > 0) return { label: 'Low Risk', color: 'text-blue-600 bg-blue-50' }
    return { label: 'No Issues Found', color: 'text-green-600 bg-green-50' }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded mb-4">
          <button
            onClick={() => { setMode('url'); setAnalyzed(false) }}
            className={`flex-1 py-2 rounded ${mode === 'url' ? 'bg-white shadow' : ''}`}
          >
            {t('tools.phishingDetector.url')}
          </button>
          <button
            onClick={() => { setMode('email'); setAnalyzed(false) }}
            className={`flex-1 py-2 rounded ${mode === 'email' ? 'bg-white shadow' : ''}`}
          >
            {t('tools.phishingDetector.email')}
          </button>
        </div>

        {mode === 'url' ? (
          <div>
            <label className="text-sm text-slate-500 block mb-1">Suspicious URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setAnalyzed(false) }}
              placeholder="https://suspicious-link.example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
            />
          </div>
        ) : (
          <div>
            <label className="text-sm text-slate-500 block mb-1">Email Content</label>
            <textarea
              value={emailContent}
              onChange={(e) => { setEmailContent(e.target.value); setAnalyzed(false) }}
              placeholder="Paste suspicious email content here..."
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
          </div>
        )}
      </div>

      <button
        onClick={analyze}
        disabled={mode === 'url' ? !url : !emailContent}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300 font-medium"
      >
        {t('tools.phishingDetector.analyze')}
      </button>

      {analyzed && (
        <>
          <div className={`card p-4 ${getRiskLevel().color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{riskScore >= 60 ? '⚠️' : riskScore > 0 ? '⚡' : '✅'}</span>
                <div>
                  <h3 className="font-bold text-lg">{getRiskLevel().label}</h3>
                  <p className="text-sm opacity-80">Risk Score: {riskScore}/100</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.phishingDetector.findings')}</h3>
            <div className="space-y-2">
              {results.map((result, i) => (
                <div
                  key={i}
                  className={`p-3 rounded ${
                    result.found
                      ? result.severity === 'high' ? 'bg-red-50 border border-red-200' :
                        result.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-blue-50 border border-blue-200'
                      : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{result.found ? '⚠️' : '✅'}</span>
                    <span className="font-medium">{result.indicator}</span>
                  </div>
                  <p className="text-sm opacity-80 mt-1">{result.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.phishingDetector.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Never click links in suspicious emails</li>
          <li>• Check the sender's email address carefully</li>
          <li>• Hover over links to see the real destination</li>
          <li>• When in doubt, go directly to the official website</li>
          <li>• Report phishing attempts to your IT team</li>
        </ul>
      </div>
    </div>
  )
}
