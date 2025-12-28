import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function VisionTest() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'menu' | 'snellen' | 'color' | 'astigmatism' | 'results'>('menu')
  const [currentLevel, setCurrentLevel] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [colorTestIndex, setColorTestIndex] = useState(0)
  const [colorAnswers, setColorAnswers] = useState<boolean[]>([])

  const snellenLetters = [
    { size: 72, letters: 'E' },
    { size: 60, letters: 'FP' },
    { size: 48, letters: 'TOZ' },
    { size: 36, letters: 'LPED' },
    { size: 30, letters: 'PECFD' },
    { size: 24, letters: 'EDFCZP' },
    { size: 20, letters: 'FELOPZD' },
    { size: 16, letters: 'DEFPOTEC' },
  ]

  const colorTestImages = [
    { number: 12, difficulty: 'easy' },
    { number: 8, difficulty: 'easy' },
    { number: 6, difficulty: 'medium' },
    { number: 29, difficulty: 'easy' },
    { number: 57, difficulty: 'medium' },
    { number: 45, difficulty: 'hard' },
  ]

  const startSnellenTest = () => {
    setMode('snellen')
    setCurrentLevel(0)
    setAnswers([])
  }

  const startColorTest = () => {
    setMode('color')
    setColorTestIndex(0)
    setColorAnswers([])
  }

  const handleSnellenAnswer = (canSee: boolean) => {
    const newAnswers = [...answers, canSee]
    setAnswers(newAnswers)

    if (!canSee || currentLevel >= snellenLetters.length - 1) {
      setMode('results')
    } else {
      setCurrentLevel(currentLevel + 1)
    }
  }

  const handleColorAnswer = (answer: string) => {
    const isCorrect = parseInt(answer) === colorTestImages[colorTestIndex].number
    const newAnswers = [...colorAnswers, isCorrect]
    setColorAnswers(newAnswers)

    if (colorTestIndex >= colorTestImages.length - 1) {
      setMode('results')
    } else {
      setColorTestIndex(colorTestIndex + 1)
    }
  }

  const getVisionScore = () => {
    const level = answers.filter(a => a).length
    const visionScores = ['20/200', '20/100', '20/70', '20/50', '20/40', '20/30', '20/25', '20/20']
    return visionScores[level] || '20/20'
  }

  const generateColorPlate = (number: number) => {
    const dots: { x: number; y: number; r: number; color: string }[] = []
    const bgColors = ['#e8d4a8', '#c9b896', '#d4c4a2', '#dcd0ae']
    const numColors = ['#b64e4e', '#c75050', '#a84545', '#d06060']

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 150
      const y = Math.random() * 150
      const r = 4 + Math.random() * 6
      dots.push({
        x,
        y,
        r,
        color: bgColors[Math.floor(Math.random() * bgColors.length)],
      })
    }

    const numStr = number.toString()
    const centerX = 75
    const centerY = 75

    for (let i = 0; i < 50; i++) {
      const offsetX = (Math.random() - 0.5) * 60
      const offsetY = (Math.random() - 0.5) * 40
      dots.push({
        x: centerX + offsetX,
        y: centerY + offsetY,
        r: 5 + Math.random() * 5,
        color: numColors[Math.floor(Math.random() * numColors.length)],
      })
    }

    return dots
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 bg-yellow-50 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          ⚠️ {t('tools.visionTest.disclaimer')}
        </p>
      </div>

      {mode === 'menu' && (
        <>
          <div className="card p-6 text-center">
            <div className="text-6xl mb-4">👁️</div>
            <h2 className="text-xl font-bold">{t('tools.visionTest.title')}</h2>
            <p className="text-sm text-slate-500 mt-2">{t('tools.visionTest.subtitle')}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={startSnellenTest}
              className="w-full p-4 text-left bg-slate-50 rounded-lg hover:bg-slate-100"
            >
              <div className="font-medium">{t('tools.visionTest.snellenTest')}</div>
              <div className="text-sm text-slate-500">{t('tools.visionTest.snellenDesc')}</div>
            </button>

            <button
              onClick={startColorTest}
              className="w-full p-4 text-left bg-slate-50 rounded-lg hover:bg-slate-100"
            >
              <div className="font-medium">{t('tools.visionTest.colorTest')}</div>
              <div className="text-sm text-slate-500">{t('tools.visionTest.colorDesc')}</div>
            </button>

            <button
              onClick={() => setMode('astigmatism')}
              className="w-full p-4 text-left bg-slate-50 rounded-lg hover:bg-slate-100"
            >
              <div className="font-medium">{t('tools.visionTest.astigmatismTest')}</div>
              <div className="text-sm text-slate-500">{t('tools.visionTest.astigmatismDesc')}</div>
            </button>
          </div>
        </>
      )}

      {mode === 'snellen' && (
        <div className="card p-6 text-center">
          <div className="text-sm text-slate-500 mb-4">
            {t('tools.visionTest.level')} {currentLevel + 1}/{snellenLetters.length}
          </div>
          <div className="text-sm text-slate-500 mb-2">{t('tools.visionTest.standBack')}</div>

          <div
            className="font-bold text-slate-800 my-8 font-mono tracking-widest"
            style={{ fontSize: `${snellenLetters[currentLevel].size}px` }}
          >
            {snellenLetters[currentLevel].letters}
          </div>

          <p className="text-sm text-slate-600 mb-4">{t('tools.visionTest.canYouRead')}</p>

          <div className="flex gap-2">
            <button
              onClick={() => handleSnellenAnswer(true)}
              className="flex-1 py-3 bg-green-500 text-white rounded font-medium"
            >
              {t('tools.visionTest.yes')}
            </button>
            <button
              onClick={() => handleSnellenAnswer(false)}
              className="flex-1 py-3 bg-red-500 text-white rounded font-medium"
            >
              {t('tools.visionTest.no')}
            </button>
          </div>
        </div>
      )}

      {mode === 'color' && (
        <div className="card p-6 text-center">
          <div className="text-sm text-slate-500 mb-4">
            {t('tools.visionTest.plate')} {colorTestIndex + 1}/{colorTestImages.length}
          </div>

          <div className="relative w-48 h-48 mx-auto mb-4 bg-slate-100 rounded-full overflow-hidden">
            <svg viewBox="0 0 150 150" className="w-full h-full">
              {generateColorPlate(colorTestImages[colorTestIndex].number).map((dot, i) => (
                <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={dot.color} />
              ))}
            </svg>
          </div>

          <p className="text-sm text-slate-600 mb-4">{t('tools.visionTest.whatNumber')}</p>

          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
              <button
                key={num}
                onClick={() => handleColorAnswer(num.toString())}
                className="py-3 bg-slate-100 rounded font-medium hover:bg-slate-200"
              >
                {num}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleColorAnswer('-1')}
            className="w-full mt-2 py-2 bg-slate-200 rounded text-sm"
          >
            {t('tools.visionTest.cantSee')}
          </button>
        </div>
      )}

      {mode === 'astigmatism' && (
        <div className="card p-6 text-center">
          <div className="text-sm text-slate-500 mb-4">{t('tools.visionTest.astigmatismInstructions')}</div>

          <div className="w-48 h-48 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180
                const x1 = 50 + 45 * Math.cos(angle)
                const y1 = 50 + 45 * Math.sin(angle)
                const x2 = 50 - 45 * Math.cos(angle)
                const y2 = 50 - 45 * Math.sin(angle)
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="black"
                    strokeWidth="2"
                  />
                )
              })}
            </svg>
          </div>

          <p className="text-sm text-slate-600 mb-4">{t('tools.visionTest.astigmatismQuestion')}</p>

          <button
            onClick={() => setMode('menu')}
            className="px-6 py-2 bg-blue-500 text-white rounded"
          >
            {t('tools.visionTest.done')}
          </button>
        </div>
      )}

      {mode === 'results' && (
        <>
          <div className="card p-6 text-center bg-blue-50">
            <div className="text-6xl mb-4">👁️</div>
            <h2 className="text-xl font-bold mb-4">{t('tools.visionTest.results')}</h2>

            {answers.length > 0 && (
              <div className="mb-4">
                <div className="text-sm text-slate-600">{t('tools.visionTest.visionScore')}</div>
                <div className="text-3xl font-bold text-blue-600">{getVisionScore()}</div>
              </div>
            )}

            {colorAnswers.length > 0 && (
              <div>
                <div className="text-sm text-slate-600">{t('tools.visionTest.colorScore')}</div>
                <div className="text-3xl font-bold text-green-600">
                  {colorAnswers.filter(a => a).length}/{colorAnswers.length}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setMode('menu')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            {t('tools.visionTest.backToMenu')}
          </button>
        </>
      )}
    </div>
  )
}
