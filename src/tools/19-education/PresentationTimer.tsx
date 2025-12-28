import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Section {
  id: number
  name: string
  duration: number
}

export default function PresentationTimer() {
  const { t } = useTranslation()
  const [totalMinutes, setTotalMinutes] = useState(10)
  const [sections, setSections] = useState<Section[]>([])
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60)
  const [currentSection, setCurrentSection] = useState(0)
  const [sectionTimeLeft, setSectionTimeLeft] = useState(0)
  const [newSection, setNewSection] = useState({ name: '', duration: 2 })
  const [warningAt, setWarningAt] = useState(60) // seconds
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (running && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setRunning(false)
            playSound()
            return 0
          }
          if (prev === warningAt + 1) {
            playSound()
          }
          return prev - 1
        })

        if (sections.length > 0) {
          setSectionTimeLeft(prev => {
            if (prev <= 1) {
              // Move to next section
              if (currentSection < sections.length - 1) {
                setCurrentSection(c => c + 1)
                playSound()
                return sections[currentSection + 1]?.duration * 60 || 0
              }
              return 0
            }
            return prev - 1
          })
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [running, timeLeft, sections, currentSection, warningAt])

  const playSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleShAj9NpUABAV5j/')
      audio.play().catch(() => {})
    } catch {}
  }

  const start = () => {
    if (sections.length > 0) {
      setCurrentSection(0)
      setSectionTimeLeft(sections[0].duration * 60)
    }
    setTimeLeft(sections.length > 0
      ? sections.reduce((sum, s) => sum + s.duration * 60, 0)
      : totalMinutes * 60
    )
    setRunning(true)
  }

  const pause = () => setRunning(false)
  const resume = () => setRunning(true)

  const reset = () => {
    setRunning(false)
    setTimeLeft(sections.length > 0
      ? sections.reduce((sum, s) => sum + s.duration * 60, 0)
      : totalMinutes * 60
    )
    setCurrentSection(0)
    setSectionTimeLeft(sections.length > 0 ? sections[0].duration * 60 : 0)
  }

  const addSection = () => {
    if (!newSection.name.trim()) return
    setSections([...sections, { ...newSection, id: Date.now() }])
    setNewSection({ name: '', duration: 2 })
  }

  const removeSection = (id: number) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = (): number => {
    const total = sections.length > 0
      ? sections.reduce((sum, s) => sum + s.duration * 60, 0)
      : totalMinutes * 60
    return ((total - timeLeft) / total) * 100
  }

  const getTimeColor = (): string => {
    if (timeLeft <= 0) return 'text-red-600'
    if (timeLeft <= warningAt) return 'text-orange-500'
    if (timeLeft <= warningAt * 2) return 'text-yellow-500'
    return 'text-slate-800'
  }

  if (running || timeLeft !== (sections.length > 0
    ? sections.reduce((sum, s) => sum + s.duration * 60, 0)
    : totalMinutes * 60)) {
    return (
      <div className="space-y-4">
        <div className="card p-8 text-center">
          <div className={`text-6xl font-bold mb-4 font-mono ${getTimeColor()}`}>
            {formatTime(timeLeft)}
          </div>

          {sections.length > 0 && currentSection < sections.length && (
            <div className="mb-4">
              <div className="text-lg font-medium">{sections[currentSection].name}</div>
              <div className="text-slate-500">{formatTime(sectionTimeLeft)} remaining in section</div>
            </div>
          )}

          <div className="w-full h-3 bg-slate-200 rounded-full mb-4">
            <div
              className={`h-3 rounded-full transition-all ${
                timeLeft <= warningAt ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          {timeLeft <= warningAt && timeLeft > 0 && (
            <div className="text-orange-500 font-medium mb-4 animate-pulse">
              Warning: {formatTime(timeLeft)} remaining!
            </div>
          )}

          {timeLeft === 0 && (
            <div className="text-red-600 text-xl font-bold mb-4">
              Time's Up!
            </div>
          )}
        </div>

        {sections.length > 0 && (
          <div className="card p-4">
            <h3 className="font-medium mb-2">Sections</h3>
            <div className="space-y-1">
              {sections.map((section, i) => (
                <div
                  key={section.id}
                  className={`p-2 rounded flex justify-between ${
                    i === currentSection
                      ? 'bg-blue-100 border-l-4 border-blue-500'
                      : i < currentSection
                        ? 'bg-green-50 text-green-600'
                        : 'bg-slate-50'
                  }`}
                >
                  <span>{section.name}</span>
                  <span className="text-slate-500">{section.duration} min</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {running ? (
            <button
              onClick={pause}
              className="flex-1 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-medium"
            >
              Pause
            </button>
          ) : timeLeft > 0 ? (
            <button
              onClick={resume}
              className="flex-1 py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
            >
              Resume
            </button>
          ) : null}
          <button
            onClick={reset}
            className="flex-1 py-3 bg-slate-200 rounded hover:bg-slate-300 font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.presentationTimer.duration')}</h3>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[5, 10, 15, 20].map(mins => (
            <button
              key={mins}
              onClick={() => setTotalMinutes(mins)}
              className={`py-2 rounded ${
                totalMinutes === mins && sections.length === 0
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>
        <input
          type="number"
          value={totalMinutes}
          onChange={(e) => setTotalMinutes(parseInt(e.target.value) || 1)}
          min={1}
          max={180}
          className="w-full px-3 py-2 border border-slate-300 rounded"
          disabled={sections.length > 0}
        />
        {sections.length > 0 && (
          <div className="text-sm text-slate-500 mt-1">
            Total from sections: {sections.reduce((sum, s) => sum + s.duration, 0)} min
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.presentationTimer.sections')} (Optional)</h3>
        <div className="space-y-2 mb-3">
          {sections.map((section, i) => (
            <div key={section.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <span>{i + 1}. {section.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{section.duration} min</span>
                <button onClick={() => removeSection(section.id)} className="text-red-400 hover:text-red-600">×</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSection.name}
            onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
            placeholder="Section name (e.g., Introduction)"
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="number"
            value={newSection.duration}
            onChange={(e) => setNewSection({ ...newSection, duration: parseInt(e.target.value) || 1 })}
            min={1}
            className="w-20 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={addSection}
            disabled={!newSection.name.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-slate-300"
          >
            Add
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.presentationTimer.warning')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {[30, 60, 120, 300].map(secs => (
            <button
              key={secs}
              onClick={() => setWarningAt(secs)}
              className={`py-2 rounded text-sm ${
                warningAt === secs ? 'bg-orange-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {secs >= 60 ? `${secs / 60} min` : `${secs}s`}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={start}
        className="w-full py-4 bg-green-500 text-white rounded hover:bg-green-600 font-medium text-lg"
      >
        {t('tools.presentationTimer.start')}
      </button>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-blue-700 mb-2">{t('tools.presentationTimer.tips')}</h3>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Add sections to pace your presentation</li>
          <li>• Audio alerts play at section changes</li>
          <li>• Warning alert plays before time ends</li>
        </ul>
      </div>
    </div>
  )
}
