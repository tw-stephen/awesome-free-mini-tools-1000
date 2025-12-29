import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const TEXTS = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump!",
  "The five boxing wizards jump quickly.",
  "Sphinx of black quartz, judge my vow.",
  "Two driven jocks help fax my big quiz.",
  "The job requires extra pluck and zeal from every young wage earner.",
  "A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent.",
  "Crazy Frederick bought many very exquisite opal jewels.",
  "We promptly judged antique ivory buckles for the next prize."
]

export default function TypingSpeedGame() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [input, setInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [bestWpm, setBestWpm] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const difficultyTexts = {
    easy: TEXTS.slice(0, 3),
    medium: TEXTS.slice(3, 7),
    hard: TEXTS.slice(7)
  }

  const startGame = () => {
    const texts = difficultyTexts[difficulty]
    const randomText = texts[Math.floor(Math.random() * texts.length)]
    setText(randomText)
    setInput('')
    setStartTime(null)
    setEndTime(null)
    setIsPlaying(true)
    setErrors(0)
    setAccuracy(100)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (!startTime) {
      setStartTime(Date.now())
    }

    setInput(value)

    // Calculate errors
    let errorCount = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errorCount++
      }
    }
    setErrors(errorCount)

    // Calculate accuracy
    const totalChars = value.length
    const correctChars = totalChars - errorCount
    const acc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100
    setAccuracy(acc)

    // Check if completed
    if (value === text) {
      const end = Date.now()
      setEndTime(end)
      setIsPlaying(false)

      // Calculate WPM
      const timeInMinutes = (end - (startTime || end)) / 60000
      const words = text.split(' ').length
      const calculatedWpm = Math.round(words / timeInMinutes)
      setWpm(calculatedWpm)

      if (calculatedWpm > bestWpm) {
        setBestWpm(calculatedWpm)
      }
    }
  }

  const getCharClass = (index: number): string => {
    if (index >= input.length) return 'text-slate-400'
    if (input[index] === text[index]) return 'text-green-600'
    return 'text-red-600 bg-red-100'
  }

  const calculateLiveWpm = (): number => {
    if (!startTime || input.length === 0) return 0
    const timeInMinutes = (Date.now() - startTime) / 60000
    const words = input.split(' ').filter(w => w).length
    return Math.round(words / timeInMinutes) || 0
  }

  useEffect(() => {
    let interval: number
    if (isPlaying && startTime) {
      interval = window.setInterval(() => {
        setWpm(calculateLiveWpm())
      }, 500)
    }
    return () => clearInterval(interval)
  }, [isPlaying, startTime, input])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              disabled={isPlaying}
              className={`flex-1 py-2 rounded capitalize ${
                difficulty === d ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {t(`tools.typingSpeedGame.${d}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{wpm}</div>
            <div className="text-sm text-slate-500">{t('tools.typingSpeedGame.wpm')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-sm text-slate-500">{t('tools.typingSpeedGame.accuracy')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{bestWpm}</div>
            <div className="text-sm text-slate-500">{t('tools.typingSpeedGame.bestWpm')}</div>
          </div>
        </div>
      </div>

      {isPlaying ? (
        <div className="card p-6">
          <div className="text-lg font-mono leading-relaxed mb-4 p-4 bg-slate-50 rounded">
            {text.split('').map((char, i) => (
              <span key={i} className={getCharClass(i)}>
                {char}
              </span>
            ))}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded text-lg font-mono"
            placeholder={t('tools.typingSpeedGame.startTyping')}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          <div className="flex justify-between mt-4 text-sm text-slate-500">
            <span>{t('tools.typingSpeedGame.errors')}: {errors}</span>
            <span>{input.length}/{text.length} {t('tools.typingSpeedGame.characters')}</span>
          </div>
        </div>
      ) : endTime ? (
        <div className="card p-6 text-center">
          <div className="text-4xl mb-4">
            {wpm >= 60 ? '🏆' : wpm >= 40 ? '🎉' : wpm >= 20 ? '👍' : '💪'}
          </div>
          <h3 className="text-xl font-bold mb-2">{t('tools.typingSpeedGame.completed')}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="text-3xl font-bold text-blue-600">{wpm}</div>
              <div className="text-sm text-slate-500">{t('tools.typingSpeedGame.wordsPerMinute')}</div>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
              <div className="text-sm text-slate-500">{t('tools.typingSpeedGame.accuracyFinal')}</div>
            </div>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.typingSpeedGame.tryAgain')}
          </button>
        </div>
      ) : (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">⌨️</div>
          <h3 className="text-lg font-medium mb-2">{t('tools.typingSpeedGame.title')}</h3>
          <p className="text-slate-500 mb-4">{t('tools.typingSpeedGame.instructions')}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.typingSpeedGame.start')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.typingSpeedGame.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.typingSpeedGame.tip1')}</li>
          <li>* {t('tools.typingSpeedGame.tip2')}</li>
          <li>* {t('tools.typingSpeedGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
