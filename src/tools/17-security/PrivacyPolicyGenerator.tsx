import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PrivacyPolicyGenerator() {
  const { t } = useTranslation()
  const [companyName, setCompanyName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [email, setEmail] = useState('')
  const [collectsPersonalData, setCollectsPersonalData] = useState(true)
  const [usesCookies, setUsesCookies] = useState(true)
  const [usesAnalytics, setUsesAnalytics] = useState(true)
  const [sharesData, setSharesData] = useState(false)
  const [hasNewsLetter, setHasNewsletter] = useState(false)
  const [acceptsPayments, setAcceptsPayments] = useState(false)
  const [gdprCompliant, setGdprCompliant] = useState(true)
  const [ccpaCompliant, setCcpaCompliant] = useState(false)

  const generatePolicy = (): string => {
    const company = companyName || '[Company Name]'
    const website = websiteUrl || '[Website URL]'
    const contactEmail = email || '[Contact Email]'
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    let policy = `PRIVACY POLICY

Last updated: ${date}

1. INTRODUCTION

${company} ("we," "us," or "our") operates ${website} (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.

Please read this privacy policy carefully. By using the Service, you agree to the collection and use of information in accordance with this policy.

2. INFORMATION WE COLLECT

`

    if (collectsPersonalData) {
      policy += `Personal Information:
We may collect personal information that you voluntarily provide to us, including:
- Name and contact information (email address, phone number)
- Account credentials
- Profile information
- Communication preferences

`
    }

    if (usesCookies) {
      policy += `Cookies and Tracking Technologies:
We use cookies and similar tracking technologies to collect and store information. These may include:
- Session cookies
- Persistent cookies
- Web beacons
- Pixel tags

You can set your browser to refuse all or some browser cookies.

`
    }

    if (usesAnalytics) {
      policy += `Analytics Data:
We may use third-party analytics services to collect information about your use of our Service, including:
- Pages visited
- Time spent on pages
- Browser type and version
- Device information
- Referring website

`
    }

    policy += `3. HOW WE USE YOUR INFORMATION

We use collected information for various purposes:
- To provide and maintain our Service
- To notify you about changes to our Service
- To provide customer support
- To gather analysis to improve our Service
- To monitor the usage of our Service
- To detect and prevent technical issues

`

    if (sharesData) {
      policy += `4. SHARING YOUR INFORMATION

We may share your information with:
- Service providers who assist in our operations
- Business partners for joint marketing initiatives
- Legal authorities when required by law

We do not sell your personal information.

`
    } else {
      policy += `4. SHARING YOUR INFORMATION

We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy. We may share information with service providers who assist us in operating our Service.

`
    }

    if (hasNewsLetter) {
      policy += `5. EMAIL COMMUNICATIONS

If you subscribe to our newsletter, you will receive periodic emails about our products, services, and promotions. You can unsubscribe at any time by clicking the unsubscribe link in any email.

`
    }

    if (acceptsPayments) {
      policy += `6. PAYMENT INFORMATION

When you make a purchase, your payment information is processed by our third-party payment processor. We do not store your complete payment card information on our servers.

`
    }

    policy += `7. DATA SECURITY

We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.

`

    if (gdprCompliant) {
      policy += `8. YOUR RIGHTS (GDPR)

If you are a resident of the European Economic Area (EEA), you have certain data protection rights:
- The right to access, update, or delete your information
- The right of rectification
- The right to object
- The right of restriction
- The right to data portability
- The right to withdraw consent

`
    }

    if (ccpaCompliant) {
      policy += `9. CALIFORNIA PRIVACY RIGHTS (CCPA)

California residents have specific rights regarding their personal information:
- Right to know what personal information is collected
- Right to delete personal information
- Right to opt-out of the sale of personal information
- Right to non-discrimination

`
    }

    policy += `10. CHILDREN'S PRIVACY

Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13.

11. CHANGES TO THIS POLICY

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.

12. CONTACT US

If you have questions about this Privacy Policy, please contact us:
- Email: ${contactEmail}
- Website: ${website}

---
This privacy policy was generated as a template. Please review and customize it according to your specific needs and consult with a legal professional before use.`

    return policy
  }

  const copyPolicy = () => {
    navigator.clipboard.writeText(generatePolicy())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.privacyPolicyGenerator.info')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.privacyPolicyGenerator.companyName')}</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Company Name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.privacyPolicyGenerator.websiteUrl')}</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.privacyPolicyGenerator.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="privacy@yourcompany.com"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.privacyPolicyGenerator.options')}</h3>
        <div className="space-y-2">
          {[
            { label: 'Collects personal data', value: collectsPersonalData, setter: setCollectsPersonalData },
            { label: 'Uses cookies', value: usesCookies, setter: setUsesCookies },
            { label: 'Uses analytics (Google Analytics, etc.)', value: usesAnalytics, setter: setUsesAnalytics },
            { label: 'Shares data with third parties', value: sharesData, setter: setSharesData },
            { label: 'Has newsletter/email marketing', value: hasNewsLetter, setter: setHasNewsletter },
            { label: 'Accepts online payments', value: acceptsPayments, setter: setAcceptsPayments },
            { label: 'GDPR compliance (EU users)', value: gdprCompliant, setter: setGdprCompliant },
            { label: 'CCPA compliance (California users)', value: ccpaCompliant, setter: setCcpaCompliant },
          ].map((item) => (
            <label key={item.label} className="flex items-center gap-3 p-2 bg-slate-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={item.value}
                onChange={(e) => item.setter(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.privacyPolicyGenerator.preview')}</h3>
          <button
            onClick={copyPolicy}
            className="px-4 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Copy
          </button>
        </div>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
          {generatePolicy()}
        </pre>
      </div>

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.privacyPolicyGenerator.disclaimer')}</h4>
        <p className="text-sm text-slate-600">
          This is a template and should be reviewed by a legal professional before use.
          Privacy requirements vary by jurisdiction and business type.
          This generator provides a starting point but may not cover all legal requirements for your specific situation.
        </p>
      </div>
    </div>
  )
}
