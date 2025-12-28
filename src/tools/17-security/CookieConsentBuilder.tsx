import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CookieCategory {
  id: string
  name: string
  description: string
  required: boolean
  enabled: boolean
}

export default function CookieConsentBuilder() {
  const { t } = useTranslation()
  const [siteName, setSiteName] = useState('')
  const [privacyUrl, setPrivacyUrl] = useState('')
  const [style, setStyle] = useState<'banner' | 'popup' | 'corner'>('banner')
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [categories, setCategories] = useState<CookieCategory[]>([
    { id: 'necessary', name: 'Necessary', description: 'Essential cookies for basic site functionality', required: true, enabled: true },
    { id: 'analytics', name: 'Analytics', description: 'Cookies that help us understand how visitors interact with our website', required: false, enabled: false },
    { id: 'marketing', name: 'Marketing', description: 'Cookies used for targeted advertising and marketing', required: false, enabled: false },
    { id: 'preferences', name: 'Preferences', description: 'Cookies that remember your preferences and settings', required: false, enabled: false },
  ])

  const toggleCategory = (id: string) => {
    setCategories(categories.map(c =>
      c.id === id && !c.required ? { ...c, enabled: !c.enabled } : c
    ))
  }

  const generateHTML = (): string => {
    const site = siteName || 'Our website'
    const privacy = privacyUrl || '/privacy-policy'
    const bgColor = theme === 'dark' ? '#1f2937' : '#ffffff'
    const textColor = theme === 'dark' ? '#ffffff' : '#1f2937'
    const positionCSS = position === 'top' ? 'top: 0;' : 'bottom: 0;'

    let styleCSS = ''
    if (style === 'banner') {
      styleCSS = `position: fixed; ${positionCSS} left: 0; right: 0; width: 100%;`
    } else if (style === 'popup') {
      styleCSS = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 500px; width: 90%;'
    } else {
      styleCSS = `position: fixed; ${positionCSS} right: 20px; max-width: 400px;`
    }

    return `<!-- Cookie Consent Banner -->
<div id="cookie-consent" style="
  ${styleCSS}
  background-color: ${bgColor};
  color: ${textColor};
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  font-family: system-ui, -apple-system, sans-serif;
  border-radius: ${style === 'banner' ? '0' : '8px'};
">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h3 style="margin: 0 0 10px 0; font-size: 18px;">Cookie Preferences</h3>
    <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">
      ${site} uses cookies to enhance your browsing experience.
      <a href="${privacy}" style="color: ${theme === 'dark' ? '#60a5fa' : '#2563eb'};">Learn more</a>
    </p>

    <div style="margin-bottom: 15px;">
${categories.map(c => `      <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; cursor: ${c.required ? 'not-allowed' : 'pointer'};">
        <input type="checkbox" ${c.enabled ? 'checked' : ''} ${c.required ? 'disabled' : ''}
          data-cookie-category="${c.id}"
          style="width: 18px; height: 18px;">
        <span>
          <strong>${c.name}</strong>${c.required ? ' (Required)' : ''}<br>
          <small style="opacity: 0.7;">${c.description}</small>
        </span>
      </label>`).join('\n')}
    </div>

    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <button onclick="acceptAllCookies()" style="
        background-color: #2563eb;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
      ">Accept All</button>
      <button onclick="acceptSelectedCookies()" style="
        background-color: ${theme === 'dark' ? '#374151' : '#e5e7eb'};
        color: ${textColor};
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
      ">Accept Selected</button>
      <button onclick="rejectOptionalCookies()" style="
        background-color: transparent;
        color: ${textColor};
        border: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
      ">Reject Optional</button>
    </div>
  </div>
</div>

<script>
function acceptAllCookies() {
  setCookieConsent({ necessary: true, analytics: true, marketing: true, preferences: true });
  hideBanner();
}

function acceptSelectedCookies() {
  const consent = { necessary: true };
  document.querySelectorAll('[data-cookie-category]').forEach(el => {
    consent[el.dataset.cookieCategory] = el.checked;
  });
  setCookieConsent(consent);
  hideBanner();
}

function rejectOptionalCookies() {
  setCookieConsent({ necessary: true, analytics: false, marketing: false, preferences: false });
  hideBanner();
}

function setCookieConsent(consent) {
  localStorage.setItem('cookieConsent', JSON.stringify(consent));
  // Trigger your cookie logic here based on consent
  console.log('Cookie consent saved:', consent);
}

function hideBanner() {
  document.getElementById('cookie-consent').style.display = 'none';
}

// Check if consent already given
if (localStorage.getItem('cookieConsent')) {
  hideBanner();
}
</script>`
  }

  const copyHTML = () => {
    navigator.clipboard.writeText(generateHTML())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.cookieConsentBuilder.settings')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.cookieConsentBuilder.siteName')}</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Your Website Name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.cookieConsentBuilder.privacyUrl')}</label>
            <input
              type="text"
              value={privacyUrl}
              onChange={(e) => setPrivacyUrl(e.target.value)}
              placeholder="/privacy-policy"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.cookieConsentBuilder.appearance')}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as 'banner' | 'popup' | 'corner')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="banner">Full Banner</option>
              <option value="popup">Center Popup</option>
              <option value="corner">Corner Box</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as 'top' | 'bottom')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="bottom">Bottom</option>
              <option value="top">Top</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.cookieConsentBuilder.categories')}</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`p-3 rounded border cursor-pointer ${
                cat.enabled ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
              } ${cat.required ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{cat.name}</span>
                  {cat.required && <span className="ml-2 text-xs text-slate-500">(Required)</span>}
                </div>
                <input
                  type="checkbox"
                  checked={cat.enabled}
                  disabled={cat.required}
                  readOnly
                  className="rounded"
                />
              </div>
              <p className="text-sm text-slate-500 mt-1">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.cookieConsentBuilder.code')}</h3>
          <button
            onClick={copyHTML}
            className="px-4 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Copy HTML
          </button>
        </div>
        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto max-h-64 overflow-y-auto">
          {generateHTML()}
        </pre>
      </div>

      <div className="card p-4 bg-green-50">
        <h4 className="font-medium mb-2">{t('tools.cookieConsentBuilder.gdprTips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Allow users to reject non-essential cookies</li>
          <li>• Don't pre-check optional cookie categories</li>
          <li>• Provide clear information about each cookie type</li>
          <li>• Link to your full privacy policy</li>
          <li>• Make it easy to change preferences later</li>
        </ul>
      </div>
    </div>
  )
}
