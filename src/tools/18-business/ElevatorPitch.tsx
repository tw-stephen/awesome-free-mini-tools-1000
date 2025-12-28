import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ElevatorPitch() {
  const { t } = useTranslation()
  const [pitch, setPitch] = useState({
    hook: '',
    problem: '',
    solution: '',
    benefit: '',
    differentiator: '',
    callToAction: '',
  })
  const [duration, setDuration] = useState(30)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [savedPitches, setSavedPitches] = useState<string[]>([])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isRunning && timer < duration) {
      interval = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)
    } else if (timer >= duration) {
      setIsRunning(false)
    }
    return () => clearInterval(interval)
  }, [isRunning, timer, duration])

  const generatePitch = (): string => {
    const parts = []
    if (pitch.hook) parts.push(pitch.hook)
    if (pitch.problem) parts.push(`Many people struggle with ${pitch.problem}.`)
    if (pitch.solution) parts.push(`That's why we created ${pitch.solution}.`)
    if (pitch.benefit) parts.push(`It helps you ${pitch.benefit}.`)
    if (pitch.differentiator) parts.push(`Unlike others, ${pitch.differentiator}.`)
    if (pitch.callToAction) parts.push(pitch.callToAction)
    return parts.join(' ')
  }

  const fullPitch = generatePitch()
  const wordCount = fullPitch.split(/\s+/).filter(w => w).length
  const estimatedDuration = Math.ceil(wordCount / 2.5) // ~150 words per minute

  const startTimer = () => {
    setTimer(0)
    setIsRunning(true)
  }

  const stopTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setTimer(0)
    setIsRunning(false)
  }

  const savePitch = () => {
    if (fullPitch && !savedPitches.includes(fullPitch)) {
      setSavedPitches([...savedPitches, fullPitch])
    }
  }

  const copyPitch = () => {
    navigator.clipboard.writeText(fullPitch)
  }

  const fields = [
    { key: 'hook', label: 'Opening Hook', placeholder: 'Did you know that...? / Have you ever...?' },
    { key: 'problem', label: 'Problem Statement', placeholder: 'The problem people face...' },
    { key: 'solution', label: 'Your Solution', placeholder: 'Your product/service name and what it does' },
    { key: 'benefit', label: 'Key Benefit', placeholder: 'What the customer achieves' },
    { key: 'differentiator', label: 'What Makes You Different', placeholder: 'Your unique advantage' },
    { key: 'callToAction', label: 'Call to Action', placeholder: 'What should they do next?' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.elevatorPitch.timer')}</h3>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="px-3 py-1 border border-slate-300 rounded"
          >
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
            <option value={120}>2 minutes</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  timer > duration * 0.8 ? 'bg-red-500' :
                  timer > duration * 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((timer / duration) * 100, 100)}%` }}
              />
            </div>
          </div>
          <span className={`font-mono text-lg ${timer >= duration ? 'text-red-500' : ''}`}>
            {timer}s / {duration}s
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Start Practice
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Stop
            </button>
          )}
          <button
            onClick={resetTimer}
            className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.elevatorPitch.build')}</h3>
        <div className="space-y-3">
          {fields.map(field => (
            <div key={field.key}>
              <label className="text-sm text-slate-500 block mb-1">{field.label}</label>
              <input
                type="text"
                value={pitch[field.key as keyof typeof pitch]}
                onChange={(e) => setPitch({ ...pitch, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {fullPitch && (
        <div className="card p-4 bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.elevatorPitch.preview')}</h3>
            <div className="flex gap-2">
              <span className="text-sm text-slate-500">
                ~{wordCount} words (~{estimatedDuration}s)
              </span>
              <button
                onClick={copyPitch}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
              >
                Copy
              </button>
              <button
                onClick={savePitch}
                className="px-2 py-1 bg-green-500 text-white rounded text-xs"
              >
                Save
              </button>
            </div>
          </div>
          <p className="text-lg leading-relaxed">{fullPitch}</p>
        </div>
      )}

      {savedPitches.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.elevatorPitch.saved')}</h3>
          <div className="space-y-2">
            {savedPitches.map((p, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded text-sm">
                {p}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.elevatorPitch.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Keep it under 60 seconds</li>
          <li>• Practice until it feels natural</li>
          <li>• Speak at a conversational pace</li>
          <li>• End with a clear call to action</li>
        </ul>
      </div>
    </div>
  )
}
