import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ThesisType {
  name: string
  template: string
  example: string
}

export default function ThesisStatementBuilder() {
  const { t } = useTranslation()
  const [topic, setTopic] = useState('')
  const [position, setPosition] = useState('')
  const [reasons, setReasons] = useState(['', '', ''])
  const [thesisType, setThesisType] = useState('argumentative')
  const [generatedThesis, setGeneratedThesis] = useState('')

  const thesisTypes: { [key: string]: ThesisType } = {
    argumentative: {
      name: 'Argumentative',
      template: '[Topic] should [position] because [reason 1], [reason 2], and [reason 3].',
      example: 'Schools should require financial literacy education because it prepares students for real-world decisions, reduces future debt, and promotes economic stability.',
    },
    analytical: {
      name: 'Analytical',
      template: 'An analysis of [topic] reveals [position] through [reason 1], [reason 2], and [reason 3].',
      example: 'An analysis of social media usage reveals its negative impact on mental health through increased anxiety, reduced self-esteem, and disrupted sleep patterns.',
    },
    expository: {
      name: 'Expository',
      template: '[Topic] can be understood through [reason 1], [reason 2], and [reason 3].',
      example: 'Climate change can be understood through rising global temperatures, melting ice caps, and increasing extreme weather events.',
    },
    compare: {
      name: 'Compare/Contrast',
      template: 'Although [topic] and [comparison] share [similarity], they differ in [reason 1], [reason 2], and [reason 3].',
      example: 'Although online and traditional education share the goal of student learning, they differ in flexibility, interaction methods, and accessibility.',
    },
  }

  const generateThesis = () => {
    const validReasons = reasons.filter(r => r.trim())
    if (!topic.trim() || validReasons.length === 0) {
      setGeneratedThesis('Please enter a topic and at least one reason.')
      return
    }

    let thesis = ''
    const reasonList = validReasons.length === 1
      ? validReasons[0]
      : validReasons.length === 2
        ? `${validReasons[0]} and ${validReasons[1]}`
        : `${validReasons.slice(0, -1).join(', ')}, and ${validReasons[validReasons.length - 1]}`

    switch (thesisType) {
      case 'argumentative':
        thesis = `${topic} ${position || 'is important'} because ${reasonList}.`
        break
      case 'analytical':
        thesis = `An analysis of ${topic} reveals ${position || 'key insights'} through ${reasonList}.`
        break
      case 'expository':
        thesis = `${topic} can be understood through ${reasonList}.`
        break
      case 'compare':
        thesis = `${topic} demonstrates ${position || 'significant differences'} in ${reasonList}.`
        break
    }

    setGeneratedThesis(thesis)
  }

  const updateReason = (index: number, value: string) => {
    const newReasons = [...reasons]
    newReasons[index] = value
    setReasons(newReasons)
  }

  const copyThesis = () => {
    navigator.clipboard.writeText(generatedThesis)
  }

  const evaluateThesis = (): { score: number; feedback: string[] } => {
    const feedback: string[] = []
    let score = 0

    if (topic.trim()) {
      score += 25
    } else {
      feedback.push('Add a clear topic')
    }

    if (position.trim()) {
      score += 25
    } else {
      feedback.push('Add your position or argument')
    }

    const validReasons = reasons.filter(r => r.trim())
    if (validReasons.length >= 3) {
      score += 50
    } else if (validReasons.length >= 2) {
      score += 35
      feedback.push('Consider adding a third supporting reason')
    } else if (validReasons.length >= 1) {
      score += 20
      feedback.push('Add more supporting reasons')
    } else {
      feedback.push('Add supporting reasons for your argument')
    }

    return { score, feedback }
  }

  const { score, feedback } = evaluateThesis()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.thesisStatementBuilder.type')}</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(thesisTypes).map(([key, type]) => (
            <button
              key={key}
              onClick={() => setThesisType(key)}
              className={`p-2 rounded text-sm ${
                thesisType === key ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
        <div className="mt-3 p-3 bg-slate-50 rounded text-sm">
          <div className="text-slate-500 mb-1">Template:</div>
          <div className="italic">{thesisTypes[thesisType].template}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.thesisStatementBuilder.build')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What is your paper about?"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Position / Claim</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="What are you arguing or proving?"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Supporting Reasons</label>
            {reasons.map((reason, i) => (
              <input
                key={i}
                type="text"
                value={reason}
                onChange={(e) => updateReason(i, e.target.value)}
                placeholder={`Reason ${i + 1}`}
                className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Thesis Strength</h3>
          <span className={`font-bold ${
            score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {score}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full mb-3">
          <div
            className={`h-2 rounded-full transition-all ${
              score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        {feedback.length > 0 && (
          <ul className="text-sm text-slate-500 space-y-1">
            {feedback.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={generateThesis}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.thesisStatementBuilder.generate')}
      </button>

      {generatedThesis && (
        <div className="card p-4 bg-green-50 border-2 border-green-200">
          <h3 className="font-medium mb-2 text-green-700">Your Thesis Statement</h3>
          <p className="text-lg mb-3">{generatedThesis}</p>
          <button
            onClick={copyThesis}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Copy to Clipboard
          </button>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-blue-700 mb-2">Example</h3>
        <p className="text-sm text-blue-600 italic">{thesisTypes[thesisType].example}</p>
      </div>
    </div>
  )
}
