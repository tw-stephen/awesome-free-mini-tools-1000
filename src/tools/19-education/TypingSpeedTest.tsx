import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function TypingSpeedTest() {
  const { t } = useTranslation()
  const [testState, setTestState] = useState<'ready' | 'typing' | 'results'>('ready')
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)
  const [duration, setDuration] = useState(60)
  const [timeLeft, setTimeLeft] = useState(duration)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice.",
    "Programming is the art of telling a computer what to do. Good code is like a good joke, it needs no explanation.",
    "Technology is best when it brings people together. In the digital age, learning to type efficiently is more important than ever.",
    "Success is not final, failure is not fatal. It is the courage to continue that counts. Keep practicing and you will improve.",
    "The only way to do great work is to love what you do. If you have not found it yet, keep looking and do not settle.",
  ]

  useEffect(() => {
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)])
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (testState === 'typing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [testState, timeLeft])

  const startTest = () => {
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)])
    setUserInput('')
    setTestState('typing')
    setStartTime(Date.now())
    setTimeLeft(duration)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const finishTest = () => {
    setEndTime(Date.now())
    setTestState('results')
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setUserInput(value)

    if (value.length >= text.length) {
      finishTest()
    }
  }

  const calculateResults = () => {
    const timeInMinutes = (endTime - startTime) / 60000
    const wordsTyped = userInput.trim().split(/\s+/).length
    const wpm = Math.round(wordsTyped / timeInMinutes)

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

    return { wpm, accuracy, correctChars, errors, totalChars: userInput.length }
  }

  const getCharClass = (index: number): string => {
    if (index >= userInput.length) return 'text-slate-400'
    if (userInput[index] === text[index]) return 'text-green-600'
    return 'bg-red-200 text-red-800'
  }

  const resetTest = () => {
    setTestState('ready')
    setUserInput('')
    setTimeLeft(duration)
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)])
  }

  const getSpeedRating = (wpm: number): { label: string; color: string } => {
    if (wpm >= 80) return { label: 'Professional', color: 'text-purple-600' }
    if (wpm >= 60) return { label: 'Fast', color: 'text-green-600' }
    if (wpm >= 40) return { label: 'Average', color: 'text-blue-600' }
    if (wpm >= 20) return { label: 'Beginner', color: 'text-yellow-600' }
    return { label: 'Needs Practice', color: 'text-red-600' }
  }

  if (testState === 'results') {
    const results = calculateResults()
    const rating = getSpeedRating(results.wpm)

    return (
      <div className="space-y-4">
        <div className="card p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Test Complete!</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="text-4xl font-bold text-blue-600">{results.wpm}</div>
              <div className="text-sm text-blue-500">Words per Minute</div>
              <div className={`text-xs mt-1 ${rating.color}`}>{rating.label}</div>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <div className="text-4xl font-bold text-green-600">{results.accuracy}%</div>
              <div className="text-sm text-green-500">Accuracy</div>
              <div className="text-xs text-slate-500 mt-1">{results.errors} errors</div>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">Statistics</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 bg-slate-50 rounded flex justify-between">
              <span className="text-slate-500">Characters typed:</span>
              <span className="font-medium">{results.totalChars}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded flex justify-between">
              <span className="text-slate-500">Correct characters:</span>
              <span className="font-medium">{results.correctChars}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded flex justify-between">
              <span className="text-slate-500">Errors:</span>
              <span className="font-medium">{results.errors}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded flex justify-between">
              <span className="text-slate-500">Time:</span>
              <span className="font-medium">{duration - timeLeft}s</span>
            </div>
          </div>
        </div>

        <button
          onClick={resetTest}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (testState === 'typing') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{timeLeft}s</div>
          <button onClick={finishTest} className="text-blue-500">
            Finish Early
          </button>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(userInput.length / text.length) * 100}%` }}
          />
        </div>

        <div className="card p-4 font-mono text-lg leading-relaxed">
          {text.split('').map((char, index) => (
            <span key={index} className={getCharClass(index)}>
              {char}
            </span>
          ))}
        </div>

        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInput}
          className="w-full px-3 py-2 border-2 border-blue-300 rounded font-mono text-lg resize-none"
          rows={4}
          placeholder="Start typing here..."
          autoFocus
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.typingSpeedTest.duration')}</h3>
        <div className="flex gap-2">
          {[30, 60, 120].map(d => (
            <button
              key={d}
              onClick={() => { setDuration(d); setTimeLeft(d) }}
              className={`flex-1 py-2 rounded ${
                duration === d ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      <div className="card p-6 text-center">
        <h3 className="font-medium mb-3">{t('tools.typingSpeedTest.instructions')}</h3>
        <p className="text-sm text-slate-600 mb-4">
          Type the text as quickly and accurately as possible.
          The test will end when time runs out or when you finish the text.
        </p>
        <button
          onClick={startTest}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          {t('tools.typingSpeedTest.start')}
        </button>
      </div>

      <div className="card p-4 bg-slate-50">
        <h3 className="font-medium mb-2">Typing Speed Benchmarks</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-white rounded">20-30 WPM: Beginner</div>
          <div className="p-2 bg-white rounded">40-50 WPM: Average</div>
          <div className="p-2 bg-white rounded">60-70 WPM: Fast</div>
          <div className="p-2 bg-white rounded">80+ WPM: Professional</div>
        </div>
      </div>
    </div>
  )
}
