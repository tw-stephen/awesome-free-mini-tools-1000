import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump! The five boxing wizards jump quickly at dawn.",
  "Sphinx of black quartz judge my vow. Jackdaws love my big sphinx of quartz.",
  "The job requires extra pluck and zeal from every young wage earner.",
  "A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent.",
]

export default function TypingSpeedTest() {
  const { t } = useTranslation()
  const [state, setState] = useState<'ready' | 'typing' | 'done'>('ready')
  const [textIndex, setTextIndex] = useState(0)
  const [input, setInput] = useState('')
  const [timeLimit, setTimeLimit] = useState(60)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [results, setResults] = useState<{ wpm: number; accuracy: number; characters: number; errors: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const targetText = sampleTexts[textIndex]

  useEffect(() => {
    let interval: number | null = null
    if (state === 'typing' && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state, timeLeft])

  const startTest = () => {
    setState('typing')
    setTimeLeft(timeLimit)
    setInput('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const finishTest = () => {
    setState('done')

    const typedWords = input.trim().split(/\s+/).filter(Boolean)

    let correctChars = 0
    let totalChars = 0

    for (let i = 0; i < input.length && i < targetText.length; i++) {
      totalChars++
      if (input[i] === targetText[i]) {
        correctChars++
      }
    }

    const elapsedMinutes = (timeLimit - timeLeft) / 60
    const wordsTyped = typedWords.length
    const wpm = Math.round(wordsTyped / Math.max(elapsedMinutes, 1/60))
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0
    const errors = totalChars - correctChars

    setResults({
      wpm,
      accuracy,
      characters: totalChars,
      errors,
    })
  }

  const handleInput = (value: string) => {
    if (state !== 'typing') return
    setInput(value)

    if (value.length >= targetText.length) {
      finishTest()
    }
  }

  const resetTest = () => {
    setState('ready')
    setResults(null)
    setInput('')
    setTimeLeft(timeLimit)
    setTextIndex((textIndex + 1) % sampleTexts.length)
  }

  const getWpmCategory = (wpm: number) => {
    if (wpm >= 80) return { label: t('tools.typingSpeedTest.professional'), color: 'text-purple-600' }
    if (wpm >= 60) return { label: t('tools.typingSpeedTest.fast'), color: 'text-green-600' }
    if (wpm >= 40) return { label: t('tools.typingSpeedTest.average'), color: 'text-blue-600' }
    if (wpm >= 20) return { label: t('tools.typingSpeedTest.beginner'), color: 'text-yellow-600' }
    return { label: t('tools.typingSpeedTest.learning'), color: 'text-red-600' }
  }

  const renderText = () => {
    return targetText.split('').map((char, index) => {
      let className = 'text-slate-400'
      if (index < input.length) {
        className = input[index] === char ? 'text-green-600' : 'text-red-600 bg-red-100'
      } else if (index === input.length) {
        className = 'text-slate-800 border-b-2 border-blue-500'
      }
      return (
        <span key={index} className={className}>{char}</span>
      )
    })
  }

  return (
    <div className="space-y-4">
      {state === 'ready' && (
        <>
          <div className="card p-4 text-center">
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              {t('tools.typingSpeedTest.title')}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {t('tools.typingSpeedTest.instructions')}
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {[30, 60, 120].map(time => (
                <button
                  key={time}
                  onClick={() => setTimeLimit(time)}
                  className={`px-4 py-2 rounded ${timeLimit === time ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
                >
                  {time}s
                </button>
              ))}
            </div>
            <button
              onClick={startTest}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.typingSpeedTest.start')}
            </button>
          </div>
        </>
      )}

      {state === 'typing' && (
        <>
          <div className="card p-4 text-center">
            <div className="text-4xl font-bold text-blue-600">
              {timeLeft}s
            </div>
            <div className="text-sm text-slate-500">{t('tools.typingSpeedTest.remaining')}</div>
          </div>

          <div className="card p-4">
            <div className="text-lg leading-relaxed font-mono mb-4">
              {renderText()}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg text-lg font-mono focus:outline-none focus:border-blue-500"
              placeholder={t('tools.typingSpeedTest.startTyping')}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>

          <button
            onClick={finishTest}
            className="w-full py-3 bg-slate-200 rounded-lg font-medium hover:bg-slate-300"
          >
            {t('tools.typingSpeedTest.finish')}
          </button>
        </>
      )}

      {state === 'done' && results && (
        <>
          <div className="card p-6 text-center bg-blue-50">
            <div className="text-sm text-slate-600">{t('tools.typingSpeedTest.yourSpeed')}</div>
            <div className="text-5xl font-bold text-blue-600">{results.wpm}</div>
            <div className="text-sm text-slate-500">{t('tools.typingSpeedTest.wpm')}</div>
            <div className={`text-lg font-medium mt-2 ${getWpmCategory(results.wpm).color}`}>
              {getWpmCategory(results.wpm).label}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-2xl font-bold text-green-600">{results.accuracy}%</div>
                <div className="text-xs text-slate-500">{t('tools.typingSpeedTest.accuracy')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-2xl font-bold text-slate-700">{results.characters}</div>
                <div className="text-xs text-slate-500">{t('tools.typingSpeedTest.characters')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-2xl font-bold text-red-600">{results.errors}</div>
                <div className="text-xs text-slate-500">{t('tools.typingSpeedTest.errors')}</div>
              </div>
            </div>
          </div>

          <button
            onClick={resetTest}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
          >
            {t('tools.typingSpeedTest.tryAgain')}
          </button>
        </>
      )}
    </div>
  )
}
