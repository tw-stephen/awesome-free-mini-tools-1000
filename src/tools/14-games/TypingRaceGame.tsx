import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function TypingRaceGame() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [bestWpm, setBestWpm] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "The five boxing wizards jump quickly.",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz.",
    "The job requires extra pluck and zeal from young workers.",
    "A wizard's job is to vex chumps quickly in fog.",
    "Watch Jeopardy, Alex Trebek's fun TV quiz game.",
    "By Jove, my quick study of lexicography won a prize.",
  ]

  const startGame = () => {
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)]
    setText(randomSentence)
    setUserInput('')
    setStartTime(null)
    setEndTime(null)
    setIsActive(true)
    setWpm(0)
    setAccuracy(100)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Start timer on first keystroke
    if (!startTime && value.length === 1) {
      setStartTime(Date.now())
    }

    setUserInput(value)

    // Calculate accuracy
    let correctChars = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) {
        correctChars++
      }
    }
    setAccuracy(value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100)

    // Calculate WPM
    if (startTime) {
      const timeInMinutes = (Date.now() - startTime) / 60000
      const wordsTyped = value.length / 5 // Standard: 5 chars = 1 word
      setWpm(Math.round(wordsTyped / timeInMinutes))
    }

    // Check if complete
    if (value === text) {
      const finalTime = Date.now()
      setEndTime(finalTime)
      setIsActive(false)

      const timeInMinutes = (finalTime - (startTime || finalTime)) / 60000
      const wordsTyped = text.length / 5
      const finalWpm = Math.round(wordsTyped / timeInMinutes)
      setWpm(finalWpm)

      if (finalWpm > bestWpm) {
        setBestWpm(finalWpm)
      }
    }
  }

  const getCharClass = (index: number) => {
    if (index >= userInput.length) return 'text-slate-400'
    if (userInput[index] === text[index]) return 'text-green-600 bg-green-50'
    return 'text-red-600 bg-red-100'
  }

  const getTimeTaken = () => {
    if (!startTime || !endTime) return 0
    return ((endTime - startTime) / 1000).toFixed(1)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{wpm}</div>
            <div className="text-sm text-slate-500">WPM</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className={`text-2xl font-bold ${accuracy >= 90 ? 'text-green-600' : accuracy >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
              {accuracy}%
            </div>
            <div className="text-sm text-slate-500">{t('tools.typingRaceGame.accuracy')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{bestWpm}</div>
            <div className="text-sm text-slate-500">{t('tools.typingRaceGame.bestWPM')}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">
              {endTime ? getTimeTaken() : isActive && startTime ? ((Date.now() - startTime) / 1000).toFixed(0) : 0}s
            </div>
            <div className="text-sm text-slate-500">{t('tools.typingRaceGame.time')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        {!isActive && !endTime && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⌨️</div>
            <h2 className="text-xl font-bold mb-2">{t('tools.typingRaceGame.title')}</h2>
            <p className="text-slate-500 mb-4">{t('tools.typingRaceGame.description')}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.typingRaceGame.startRace')}
            </button>
          </div>
        )}

        {isActive && (
          <>
            <div className="p-4 bg-slate-50 rounded-lg mb-4 font-mono text-lg leading-relaxed">
              {text.split('').map((char, i) => (
                <span key={i} className={getCharClass(i)}>
                  {char}
                </span>
              ))}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg font-mono text-lg focus:border-blue-500 focus:outline-none"
              placeholder={t('tools.typingRaceGame.startTyping')}
              autoComplete="off"
              spellCheck={false}
            />

            <div className="mt-3 flex justify-between items-center">
              <div className="text-sm text-slate-500">
                {userInput.length}/{text.length} {t('tools.typingRaceGame.characters')}
              </div>
              <div className="w-full max-w-xs mx-4">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(userInput.length / text.length) * 100}%` }}
                  />
                </div>
              </div>
              <button
                onClick={startGame}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                {t('tools.typingRaceGame.restart')}
              </button>
            </div>
          </>
        )}

        {endTime && (
          <div className="text-center py-8 bg-green-50 rounded-lg">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              {t('tools.typingRaceGame.raceComplete')}
            </h2>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{wpm}</div>
                <div className="text-sm text-slate-500">WPM</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-slate-500">{t('tools.typingRaceGame.accuracy')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{getTimeTaken()}s</div>
                <div className="text-sm text-slate-500">{t('tools.typingRaceGame.time')}</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.typingRaceGame.raceAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.typingRaceGame.wpmGuide')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-white rounded flex justify-between">
            <span>{'< 30 WPM'}</span>
            <span>{t('tools.typingRaceGame.beginner')}</span>
          </div>
          <div className="p-2 bg-white rounded flex justify-between">
            <span>30-50 WPM</span>
            <span>{t('tools.typingRaceGame.average')}</span>
          </div>
          <div className="p-2 bg-white rounded flex justify-between">
            <span>50-70 WPM</span>
            <span>{t('tools.typingRaceGame.good')}</span>
          </div>
          <div className="p-2 bg-white rounded flex justify-between">
            <span>{'> 70 WPM'}</span>
            <span>{t('tools.typingRaceGame.expert')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
