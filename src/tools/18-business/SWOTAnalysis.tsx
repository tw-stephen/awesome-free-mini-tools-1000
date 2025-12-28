import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SWOTItem {
  id: number
  text: string
}

interface SWOTData {
  strengths: SWOTItem[]
  weaknesses: SWOTItem[]
  opportunities: SWOTItem[]
  threats: SWOTItem[]
}

export default function SWOTAnalysis() {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('')
  const [swot, setSwot] = useState<SWOTData>({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  })
  const [newItem, setNewItem] = useState({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
  })

  const addItem = (category: keyof SWOTData) => {
    if (newItem[category].trim()) {
      setSwot({
        ...swot,
        [category]: [...swot[category], { id: Date.now(), text: newItem[category] }],
      })
      setNewItem({ ...newItem, [category]: '' })
    }
  }

  const removeItem = (category: keyof SWOTData, id: number) => {
    setSwot({
      ...swot,
      [category]: swot[category].filter(item => item.id !== id),
    })
  }

  const categoryInfo = {
    strengths: { label: 'Strengths', color: 'green', description: 'Internal positive attributes', examples: ['Experienced team', 'Strong brand', 'Proprietary technology'] },
    weaknesses: { label: 'Weaknesses', color: 'red', description: 'Internal negative attributes', examples: ['Limited funding', 'Small team', 'Narrow product line'] },
    opportunities: { label: 'Opportunities', color: 'blue', description: 'External positive factors', examples: ['Market growth', 'New regulations', 'Competitor exit'] },
    threats: { label: 'Threats', color: 'orange', description: 'External negative factors', examples: ['New competitors', 'Economic downturn', 'Changing regulations'] },
  }

  const generateReport = (): string => {
    let report = `SWOT ANALYSIS\n${'='.repeat(50)}\n`
    report += `Project: ${projectName || '[Project Name]'}\n`
    report += `Date: ${new Date().toLocaleDateString()}\n\n`

    Object.entries(categoryInfo).forEach(([key, info]) => {
      const items = swot[key as keyof SWOTData]
      report += `${info.label.toUpperCase()}\n${'─'.repeat(30)}\n`
      if (items.length > 0) {
        items.forEach(item => {
          report += `• ${item.text}\n`
        })
      } else {
        report += '(No items added)\n'
      }
      report += '\n'
    })

    report += `SUMMARY\n${'─'.repeat(30)}\n`
    report += `Strengths: ${swot.strengths.length}\n`
    report += `Weaknesses: ${swot.weaknesses.length}\n`
    report += `Opportunities: ${swot.opportunities.length}\n`
    report += `Threats: ${swot.threats.length}\n`

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  const totalItems = Object.values(swot).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.swotAnalysis.project')}</h3>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project or company name..."
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(Object.entries(categoryInfo) as [keyof SWOTData, typeof categoryInfo.strengths][]).map(([key, info]) => (
          <div
            key={key}
            className={`card p-4 border-t-4 ${
              info.color === 'green' ? 'border-t-green-500' :
              info.color === 'red' ? 'border-t-red-500' :
              info.color === 'blue' ? 'border-t-blue-500' :
              'border-t-orange-500'
            }`}
          >
            <h3 className={`font-medium mb-1 ${
              info.color === 'green' ? 'text-green-600' :
              info.color === 'red' ? 'text-red-600' :
              info.color === 'blue' ? 'text-blue-600' :
              'text-orange-600'
            }`}>
              {info.label}
            </h3>
            <p className="text-xs text-slate-500 mb-3">{info.description}</p>

            <div className="space-y-1 mb-3">
              {swot[key].map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                  <span>{item.text}</span>
                  <button
                    onClick={() => removeItem(key, item.id)}
                    className="text-red-500 hover:text-red-600 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {swot[key].length === 0 && (
                <p className="text-xs text-slate-400 py-2">Examples: {info.examples.join(', ')}</p>
              )}
            </div>

            <div className="flex gap-1">
              <input
                type="text"
                value={newItem[key]}
                onChange={(e) => setNewItem({ ...newItem, [key]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && addItem(key)}
                placeholder={`Add ${info.label.toLowerCase()}...`}
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={() => addItem(key)}
                className={`px-3 py-1 rounded text-sm text-white ${
                  info.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                  info.color === 'red' ? 'bg-red-500 hover:bg-red-600' :
                  info.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                  'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalItems > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.swotAnalysis.summary')}</h3>
            <span className="text-sm text-slate-500">{totalItems} total items</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{swot.strengths.length}</div>
              <div className="text-xs text-slate-500">Strengths</div>
            </div>
            <div className="p-2 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">{swot.weaknesses.length}</div>
              <div className="text-xs text-slate-500">Weaknesses</div>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{swot.opportunities.length}</div>
              <div className="text-xs text-slate-500">Opportunities</div>
            </div>
            <div className="p-2 bg-orange-50 rounded">
              <div className="text-2xl font-bold text-orange-600">{swot.threats.length}</div>
              <div className="text-xs text-slate-500">Threats</div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={copyReport}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.swotAnalysis.export')}
      </button>
    </div>
  )
}
