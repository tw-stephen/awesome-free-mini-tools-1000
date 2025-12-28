import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const sampleTexts = [
  `The sun rose slowly over the mountains, casting long shadows across the valley below. Birds began their morning songs, filling the air with melodious chirps and whistles. A gentle breeze rustled through the leaves of the ancient oak trees that lined the winding path leading to the village. In the distance, smoke began to rise from chimneys as villagers started their daily routines. The smell of fresh bread wafted through the narrow streets, mingling with the crisp morning air. Children could be heard laughing as they made their way to school, their footsteps echoing on the cobblestone roads.`,
  `Technology has revolutionized the way we communicate, work, and live our daily lives. Smartphones have become essential tools that connect us to the world at our fingertips. Social media platforms have transformed how we share information and maintain relationships across vast distances. Artificial intelligence is increasingly being integrated into various aspects of our lives, from virtual assistants to recommendation algorithms. The pace of technological advancement continues to accelerate, presenting both opportunities and challenges for society. As we navigate this digital age, it becomes crucial to balance connectivity with meaningful human interaction.`,
  `The ocean covers more than seventy percent of Earth's surface and contains ninety-seven percent of the planet's water. Marine ecosystems support an incredible diversity of life, from microscopic plankton to the largest animals ever known. Coral reefs, often called the rainforests of the sea, provide habitat for thousands of species. Unfortunately, human activities such as pollution, overfishing, and climate change threaten these delicate ecosystems. Scientists and conservationists work tirelessly to protect and restore marine environments. Understanding the importance of ocean health is essential for the survival of all life on Earth.`
]

export default function ReadingSpeedTest() {
  const { t } = useTranslation()
  const [state, setState] = useState<'ready' | 'reading' | 'done'>('ready')
  const [textIndex, setTextIndex] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [results, setResults] = useState<{ wpm: number; time: number } | null>(null)
  const timerRef = useRef<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const currentText = sampleTexts[textIndex]
  const wordCount = currentText.split(/\s+/).length

  useEffect(() => {
    if (state === 'reading') {
      timerRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 100)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [state, startTime])

  const startTest = () => {
    setStartTime(Date.now())
    setState('reading')
    setElapsedTime(0)
  }

  const finishTest = () => {
    const end = Date.now()
    setState('done')

    const timeInMinutes = (end - startTime) / 60000
    const wpm = Math.round(wordCount / timeInMinutes)

    setResults({
      wpm,
      time: (end - startTime) / 1000,
    })
  }

  const resetTest = () => {
    setState('ready')
    setResults(null)
    setElapsedTime(0)
    setTextIndex((textIndex + 1) % sampleTexts.length)
  }

  const getSpeedCategory = (wpm: number) => {
    if (wpm >= 400) return { label: t('tools.readingSpeedTest.speedReader'), color: 'text-purple-600' }
    if (wpm >= 300) return { label: t('tools.readingSpeedTest.aboveAverage'), color: 'text-green-600' }
    if (wpm >= 200) return { label: t('tools.readingSpeedTest.average'), color: 'text-blue-600' }
    if (wpm >= 150) return { label: t('tools.readingSpeedTest.belowAverage'), color: 'text-yellow-600' }
    return { label: t('tools.readingSpeedTest.slow'), color: 'text-red-600' }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const tenths = Math.floor((ms % 1000) / 100)
    return `${seconds}.${tenths}s`
  }

  return (
    <div className="space-y-4">
      {state === 'ready' && (
        <>
          <div className="card p-4 text-center">
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              {t('tools.readingSpeedTest.instructions')}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {t('tools.readingSpeedTest.instructionsText')}
            </p>
            <button
              onClick={startTest}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.readingSpeedTest.startTest')}
            </button>
          </div>
          <div className="card p-4">
            <div className="text-sm text-slate-500 mb-2">{t('tools.readingSpeedTest.preview')}</div>
            <p className="text-sm text-slate-400 line-clamp-3">{currentText}</p>
            <div className="text-xs text-slate-400 mt-2">{wordCount} {t('tools.readingSpeedTest.words')}</div>
          </div>
        </>
      )}

      {state === 'reading' && (
        <>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-slate-500">
              {wordCount} {t('tools.readingSpeedTest.words')}
            </div>
          </div>

          <div className="card p-4">
            <p className="text-base leading-relaxed text-slate-700">{currentText}</p>
          </div>

          <button
            onClick={finishTest}
            className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
          >
            {t('tools.readingSpeedTest.doneReading')}
          </button>
        </>
      )}

      {state === 'done' && results && (
        <>
          <div className="card p-6 text-center bg-blue-50">
            <div className="text-sm text-slate-600">{t('tools.readingSpeedTest.yourSpeed')}</div>
            <div className="text-5xl font-bold text-blue-600">{results.wpm}</div>
            <div className="text-sm text-slate-500">{t('tools.readingSpeedTest.wpm')}</div>
            <div className={`text-lg font-medium mt-2 ${getSpeedCategory(results.wpm).color}`}>
              {getSpeedCategory(results.wpm).label}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-2xl font-bold text-slate-700">{results.time.toFixed(1)}s</div>
                <div className="text-xs text-slate-500">{t('tools.readingSpeedTest.timeSpent')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-2xl font-bold text-slate-700">{wordCount}</div>
                <div className="text-xs text-slate-500">{t('tools.readingSpeedTest.wordsRead')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.readingSpeedTest.comparison')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.readingSpeedTest.average')}</span>
                <span>200-250 WPM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.readingSpeedTest.fastReader')}</span>
                <span>300-400 WPM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.readingSpeedTest.speedReader')}</span>
                <span>400+ WPM</span>
              </div>
            </div>
          </div>

          <button
            onClick={resetTest}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
          >
            {t('tools.readingSpeedTest.tryAgain')}
          </button>
        </>
      )}
    </div>
  )
}
