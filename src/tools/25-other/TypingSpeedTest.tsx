import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function TypingSpeedTest() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'ready' | 'running' | 'finished'>('ready')
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [duration, setDuration] = useState(60)
  const [timeLeft, setTimeLeft] = useState(60)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is often used to test typing skills.",
    "Programming is the art of telling a computer what to do through a series of instructions. Learning to type faster can significantly improve your coding efficiency.",
    "Practice makes perfect. The more you type, the faster and more accurate you become. Focus on accuracy first, then gradually increase your speed.",
    "Technology has transformed the way we communicate and work. Being able to type quickly is now an essential skill in most professions.",
    "Success is not final, failure is not fatal. It is the courage to continue that counts. Keep practicing and you will see improvement.",
  ]

  const getRandomText = () => {
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
  }

  useEffect(() => {
    setText(getRandomText())
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setStatus('finished')
            setEndTime(Date.now())
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status, timeLeft])

  const startTest = () => {
    setText(getRandomText())
    setUserInput('')
    setStatus('running')
    setStartTime(Date.now())
    setEndTime(null)
    setTimeLeft(duration)
    inputRef.current?.focus()
  }

  const handleInputChange = (value: string) => {
    if (status !== 'running') return
    setUserInput(value)

    if (value.length >= text.length) {
      setStatus('finished')
      setEndTime(Date.now())
    }
  }

  const calculateResults = () => {
    if (!startTime || !endTime) return null

    const timeInMinutes = (endTime - startTime) / 60000
    const words = userInput.trim().split(/\s+/).length
    const wpm = Math.round(words / timeInMinutes)

    let correctChars = 0
    let errors = 0
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correctChars++
      } else {
        errors++
      }
    }

    const accuracy = Math.round((correctChars / userInput.length) * 100) || 0
    const cpm = Math.round(correctChars / timeInMinutes)

    return { wpm, cpm, accuracy, errors, correctChars, totalChars: userInput.length }
  }

  const results = status === 'finished' ? calculateResults() : null

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) return 'text-slate-400'
    if (userInput[index] === text[index]) return 'text-green-600 bg-green-50'
    return 'text-red-600 bg-red-100'
  }

  const getWpmRating = (wpm: number) => {
    if (wpm < 20) return { label: 'Beginner', color: 'text-red-500' }
    if (wpm < 40) return { label: 'Average', color: 'text-yellow-500' }
    if (wpm < 60) return { label: 'Good', color: 'text-blue-500' }
    if (wpm < 80) return { label: 'Fast', color: 'text-green-500' }
    return { label: 'Expert', color: 'text-purple-500' }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.typingSpeedTest.duration')}</h3>
        <div className="flex gap-2">
          {[30, 60, 120].map(d => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              disabled={status === 'running'}
              className={`flex-1 py-2 rounded ${
                duration === d
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 disabled:opacity-50'
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      {status === 'running' && (
        <div className="card p-4 bg-blue-50">
          <div className="flex justify-between items-center">
            <span className="text-blue-700 font-medium">{t('tools.typingSpeedTest.timeLeft')}</span>
            <span className="text-2xl font-bold text-blue-600">{timeLeft}s</span>
          </div>
          <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${(timeLeft / duration) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.typingSpeedTest.textToType')}</h3>
        <div className="p-4 bg-slate-50 rounded font-mono text-lg leading-relaxed">
          {text.split('').map((char, i) => (
            <span key={i} className={getCharacterClass(i)}>
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.typingSpeedTest.typeHere')}</h3>
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={status !== 'running'}
          className="w-full px-3 py-2 border border-slate-300 rounded font-mono min-h-[100px] disabled:bg-slate-100"
          placeholder={status === 'ready' ? t('tools.typingSpeedTest.clickStart') : ''}
        />
      </div>

      {status !== 'running' && (
        <button
          onClick={startTest}
          className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
        >
          {status === 'finished' ? t('tools.typingSpeedTest.tryAgain') : t('tools.typingSpeedTest.start')}
        </button>
      )}

      {results && (
        <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">{t('tools.typingSpeedTest.results')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{results.wpm}</div>
              <div className="text-sm text-slate-500">WPM</div>
              <div className={`text-xs font-medium ${getWpmRating(results.wpm).color}`}>
                {getWpmRating(results.wpm).label}
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{results.accuracy}%</div>
              <div className="text-sm text-slate-500">{t('tools.typingSpeedTest.accuracy')}</div>
            </div>
            <div className="p-4 bg-white rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{results.cpm}</div>
              <div className="text-sm text-slate-500">CPM</div>
            </div>
            <div className="p-4 bg-white rounded-lg text-center">
              <div className="text-3xl font-bold text-red-500">{results.errors}</div>
              <div className="text-sm text-slate-500">{t('tools.typingSpeedTest.errors')}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.typingSpeedTest.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.typingSpeedTest.tip1')}</li>
          <li>{t('tools.typingSpeedTest.tip2')}</li>
          <li>{t('tools.typingSpeedTest.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
