import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface BiometricMethod {
  id: string
  name: string
  icon: string
  accuracy: string
  pros: string[]
  cons: string[]
  useCases: string[]
  implementation: string[]
  selected: boolean
}

export default function BiometricAuthGuide() {
  const { t } = useTranslation()
  const [methods, setMethods] = useState<BiometricMethod[]>([
    {
      id: 'fingerprint',
      name: 'Fingerprint Recognition',
      icon: '👆',
      accuracy: '99.9%',
      pros: ['Fast and convenient', 'Widely available', 'Low cost sensors', 'High user acceptance'],
      cons: ['Can be affected by cuts/moisture', 'Spoofing possible with high-quality replicas', 'Sensor wear over time'],
      useCases: ['Mobile device unlock', 'Time & attendance', 'Physical access control', 'Banking apps'],
      implementation: ['Use capacitive or optical sensors', 'Store encrypted templates only', 'Implement liveness detection', 'Provide fallback authentication'],
      selected: false,
    },
    {
      id: 'face',
      name: 'Facial Recognition',
      icon: '😀',
      accuracy: '99.5%',
      pros: ['Contactless', 'Natural and intuitive', 'Works at distance', 'Can use existing cameras'],
      cons: ['Affected by lighting/angles', 'Privacy concerns', 'Potential bias issues', 'Can be fooled by photos'],
      useCases: ['Device unlock', 'Airport security', 'Payment verification', 'Building access'],
      implementation: ['Use 3D depth sensing', 'Implement anti-spoofing measures', 'Consider lighting conditions', 'Address privacy regulations'],
      selected: false,
    },
    {
      id: 'iris',
      name: 'Iris Recognition',
      icon: '👁️',
      accuracy: '99.99%',
      pros: ['Extremely accurate', 'Stable over lifetime', 'Difficult to spoof', 'Works through glasses'],
      cons: ['Higher cost', 'Requires user cooperation', 'Slower capture process', 'Limited device availability'],
      useCases: ['High-security facilities', 'Border control', 'Healthcare', 'Financial institutions'],
      implementation: ['Use near-infrared cameras', 'Ensure proper lighting', 'Implement quality checks', 'Store encrypted templates'],
      selected: false,
    },
    {
      id: 'voice',
      name: 'Voice Recognition',
      icon: '🎤',
      accuracy: '95%',
      pros: ['Remote authentication possible', 'No special hardware needed', 'Natural interaction', 'Works over phone'],
      cons: ['Affected by noise/illness', 'Can be recorded/spoofed', 'Lower accuracy', 'Privacy in public spaces'],
      useCases: ['Phone banking', 'Smart assistants', 'Call center verification', 'Hands-free access'],
      implementation: ['Use text-dependent or independent', 'Implement anti-replay measures', 'Handle background noise', 'Combine with other factors'],
      selected: false,
    },
    {
      id: 'palm',
      name: 'Palm Vein Recognition',
      icon: '✋',
      accuracy: '99.9%',
      pros: ['Highly secure (internal pattern)', 'Difficult to forge', 'Contactless options', 'Works in various conditions'],
      cons: ['Specialized hardware needed', 'Less common', 'Higher implementation cost', 'Requires positioning'],
      useCases: ['Banking ATMs', 'Hospital access', 'Time tracking', 'Secure facilities'],
      implementation: ['Use infrared imaging', 'Ensure consistent positioning', 'Implement liveness detection', 'Maintain sensor cleanliness'],
      selected: false,
    },
    {
      id: 'behavioral',
      name: 'Behavioral Biometrics',
      icon: '⌨️',
      accuracy: '90-95%',
      pros: ['Continuous authentication', 'No extra hardware', 'Hard to imitate', 'Works passively'],
      cons: ['Lower initial accuracy', 'Requires learning period', 'Can vary with context', 'Privacy implications'],
      useCases: ['Fraud detection', 'Continuous auth', 'User verification', 'Risk scoring'],
      implementation: ['Track typing patterns', 'Monitor mouse movements', 'Analyze touch gestures', 'Use as secondary factor'],
      selected: false,
    },
  ])

  const [comparisonMode, setComparisonMode] = useState(false)

  const toggleMethod = (id: string) => {
    setMethods(methods.map(m =>
      m.id === id ? { ...m, selected: !m.selected } : m
    ))
  }

  const selectedMethods = methods.filter(m => m.selected)

  const generateReport = (): string => {
    let report = `BIOMETRIC AUTHENTICATION GUIDE\n${'='.repeat(50)}\n\n`
    report += `Date: ${new Date().toLocaleDateString()}\n\n`

    if (selectedMethods.length > 0) {
      report += `SELECTED METHODS FOR COMPARISON\n${'─'.repeat(40)}\n\n`
      selectedMethods.forEach(method => {
        report += `${method.icon} ${method.name}\n`
        report += `Accuracy: ${method.accuracy}\n\n`
        report += `Pros:\n${method.pros.map(p => `  + ${p}`).join('\n')}\n\n`
        report += `Cons:\n${method.cons.map(c => `  - ${c}`).join('\n')}\n\n`
        report += `Use Cases:\n${method.useCases.map(u => `  • ${u}`).join('\n')}\n\n`
        report += `Implementation Tips:\n${method.implementation.map(i => `  → ${i}`).join('\n')}\n\n`
        report += `${'─'.repeat(40)}\n\n`
      })
    } else {
      report += `All biometric methods included.\n\n`
      methods.forEach(method => {
        report += `${method.name} (${method.accuracy})\n`
      })
    }

    report += `\nBEST PRACTICES\n${'─'.repeat(40)}\n`
    report += `• Always use biometrics as part of multi-factor authentication\n`
    report += `• Never store raw biometric data - use encrypted templates\n`
    report += `• Implement liveness detection to prevent spoofing\n`
    report += `• Provide fallback authentication methods\n`
    report += `• Comply with privacy regulations (GDPR, CCPA, BIPA)\n`
    report += `• Regularly update and test biometric systems\n`

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.biometricAuthGuide.title')}</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={comparisonMode}
              onChange={() => setComparisonMode(!comparisonMode)}
              className="rounded"
            />
            <span className="text-sm">Comparison Mode</span>
          </label>
        </div>
        {comparisonMode && (
          <p className="text-sm text-slate-500">
            Select methods below to compare. Selected: {selectedMethods.length}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {methods.map(method => (
          <div
            key={method.id}
            onClick={() => comparisonMode && toggleMethod(method.id)}
            className={`card p-3 ${comparisonMode ? 'cursor-pointer' : ''} ${
              method.selected ? 'border-2 border-blue-500 bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{method.icon}</span>
              <div>
                <div className="font-medium text-sm">{method.name}</div>
                <div className="text-xs text-green-600">Accuracy: {method.accuracy}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {comparisonMode && selectedMethods.length >= 2 && (
        <div className="card p-4 bg-blue-50">
          <h3 className="font-medium mb-3">Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Aspect</th>
                  {selectedMethods.map(m => (
                    <th key={m.id} className="text-left p-2">{m.icon} {m.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2 font-medium">Accuracy</td>
                  {selectedMethods.map(m => (
                    <td key={m.id} className="p-2 text-green-600">{m.accuracy}</td>
                  ))}
                </tr>
                <tr className="border-t">
                  <td className="p-2 font-medium">Top Pro</td>
                  {selectedMethods.map(m => (
                    <td key={m.id} className="p-2 text-blue-600">{m.pros[0]}</td>
                  ))}
                </tr>
                <tr className="border-t">
                  <td className="p-2 font-medium">Main Con</td>
                  {selectedMethods.map(m => (
                    <td key={m.id} className="p-2 text-orange-600">{m.cons[0]}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {methods.map(method => (
        <div key={method.id} className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{method.icon}</span>
            <div>
              <h3 className="font-medium">{method.name}</h3>
              <span className="text-sm text-green-600">Accuracy: {method.accuracy}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-1">Pros</h4>
              <ul className="text-sm space-y-1">
                {method.pros.map((pro, i) => (
                  <li key={i} className="text-green-600">+ {pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-1">Cons</h4>
              <ul className="text-sm space-y-1">
                {method.cons.map((con, i) => (
                  <li key={i} className="text-red-600">- {con}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-3">
            <h4 className="text-sm font-medium mb-1">Use Cases</h4>
            <div className="flex flex-wrap gap-1">
              {method.useCases.map((use, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                  {use}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Implementation Tips</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              {method.implementation.map((tip, i) => (
                <li key={i}>→ {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.biometricAuthGuide.bestPractices')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Always use biometrics as part of multi-factor authentication</li>
          <li>• Never store raw biometric data - use encrypted templates</li>
          <li>• Implement liveness detection to prevent spoofing</li>
          <li>• Provide fallback authentication methods</li>
          <li>• Comply with privacy regulations (GDPR, CCPA, BIPA)</li>
        </ul>
      </div>

      <button
        onClick={copyReport}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.biometricAuthGuide.export')}
      </button>
    </div>
  )
}
