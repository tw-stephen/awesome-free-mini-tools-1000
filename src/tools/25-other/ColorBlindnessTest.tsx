import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ColorBlindnessTest() {
  const { t } = useTranslation()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [showResults, setShowResults] = useState(false)

  const plates = [
    {
      id: 1,
      number: '12',
      bgColors: ['#74B254', '#5B9A3D', '#8CC269'],
      dotColor: '#CD6E4A',
      options: ['12', '17', '70', 'Nothing'],
      normalAnswer: '12',
      deutanAnswer: '17',
      protanAnswer: '17',
    },
    {
      id: 2,
      number: '8',
      bgColors: ['#9FCC6D', '#B7D87A', '#82BA52'],
      dotColor: '#E08850',
      options: ['8', '3', '6', 'Nothing'],
      normalAnswer: '8',
      deutanAnswer: '3',
      protanAnswer: '3',
    },
    {
      id: 3,
      number: '6',
      bgColors: ['#D97F4E', '#E89860', '#C76A3B'],
      dotColor: '#7AB54E',
      options: ['6', '5', '9', 'Nothing'],
      normalAnswer: '6',
      deutanAnswer: '5',
      protanAnswer: '5',
    },
    {
      id: 4,
      number: '29',
      bgColors: ['#84B554', '#6DA343', '#97C264'],
      dotColor: '#DA7F50',
      options: ['29', '70', '26', 'Nothing'],
      normalAnswer: '29',
      deutanAnswer: '70',
      protanAnswer: '70',
    },
    {
      id: 5,
      number: '57',
      bgColors: ['#D88B55', '#C77844', '#E69E68'],
      dotColor: '#7CB550',
      options: ['57', '35', '55', 'Nothing'],
      normalAnswer: '57',
      deutanAnswer: '35',
      protanAnswer: '35',
    },
    {
      id: 6,
      number: '5',
      bgColors: ['#8BC459', '#75B347', '#9DD16B'],
      dotColor: '#D87F4D',
      options: ['5', '2', '8', 'Nothing'],
      normalAnswer: '5',
      deutanAnswer: '2',
      protanAnswer: '2',
    },
    {
      id: 7,
      number: '3',
      bgColors: ['#D48852', '#C17540', '#E49B65'],
      dotColor: '#80B855',
      options: ['3', '5', '8', 'Nothing'],
      normalAnswer: '3',
      deutanAnswer: '5',
      protanAnswer: '5',
    },
    {
      id: 8,
      number: '15',
      bgColors: ['#7AB651', '#68A43F', '#8CC863'],
      dotColor: '#D8844F',
      options: ['15', '17', '71', 'Nothing'],
      normalAnswer: '15',
      deutanAnswer: '17',
      protanAnswer: '17',
    },
  ]

  const generateDots = (plate: typeof plates[0]) => {
    const dots = []
    const size = 200
    const numDots = 150

    for (let i = 0; i < numDots; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const r = 4 + Math.random() * 6

      const isNumber = isInNumber(x, y, size, plate.number)
      const bgColorIndex = Math.floor(Math.random() * plate.bgColors.length)

      dots.push({
        cx: x,
        cy: y,
        r,
        fill: isNumber ? plate.dotColor : plate.bgColors[bgColorIndex],
      })
    }

    return dots
  }

  const isInNumber = (x: number, y: number, size: number, number: string) => {
    const centerX = size / 2
    const centerY = size / 2
    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > size * 0.35) return false

    const angle = Math.atan2(dy, dx)
    const normalizedDistance = distance / (size * 0.35)

    if (number === '12') {
      if (dx < -10) {
        return Math.abs(dy) < 30 && dx > -35
      } else if (dx > 5) {
        const s = Math.sin(angle * 2)
        return normalizedDistance < 0.8 && (Math.abs(dy) < 35)
      }
    }

    return normalizedDistance < 0.6 && Math.random() > 0.3
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)

    if (currentQuestion < plates.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateResults = () => {
    let normalCorrect = 0
    let deutanPattern = 0
    let protanPattern = 0

    plates.forEach((plate, i) => {
      const answer = answers[i]
      if (answer === plate.normalAnswer) normalCorrect++
      if (answer === plate.deutanAnswer) deutanPattern++
      if (answer === plate.protanAnswer) protanPattern++
    })

    if (normalCorrect >= 6) {
      return {
        result: 'normal',
        title: t('tools.colorBlindnessTest.normalVision'),
        description: t('tools.colorBlindnessTest.normalDesc'),
        color: 'text-green-600',
        bg: 'bg-green-50',
      }
    } else if (deutanPattern >= 5 || protanPattern >= 5) {
      return {
        result: 'deficiency',
        title: t('tools.colorBlindnessTest.possibleDeficiency'),
        description: t('tools.colorBlindnessTest.deficiencyDesc'),
        color: 'text-orange-600',
        bg: 'bg-orange-50',
      }
    } else {
      return {
        result: 'inconclusive',
        title: t('tools.colorBlindnessTest.inconclusive'),
        description: t('tools.colorBlindnessTest.inconclusiveDesc'),
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      }
    }
  }

  const restartTest = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
  }

  const currentPlate = plates[currentQuestion]
  const dots = currentPlate ? generateDots(currentPlate) : []

  if (showResults) {
    const result = calculateResults()
    return (
      <div className="space-y-4">
        <div className={`card p-6 ${result.bg}`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${result.color} mb-2`}>{result.title}</div>
            <p className="text-slate-600">{result.description}</p>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.colorBlindnessTest.yourAnswers')}</h3>
          <div className="space-y-2">
            {plates.map((plate, i) => (
              <div
                key={plate.id}
                className={`flex justify-between items-center p-2 rounded ${
                  answers[i] === plate.normalAnswer ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <span className="text-slate-600">Plate {i + 1}</span>
                <span className={answers[i] === plate.normalAnswer ? 'text-green-600' : 'text-red-600'}>
                  {answers[i]} {answers[i] === plate.normalAnswer ? '(Correct)' : `(Normal: ${plate.normalAnswer})`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={restartTest}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {t('tools.colorBlindnessTest.retake')}
        </button>

        <div className="card p-4 bg-yellow-50">
          <p className="text-sm text-yellow-700">
            {t('tools.colorBlindnessTest.disclaimer')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.colorBlindnessTest.progress')}</h3>
          <span className="text-sm text-slate-500">{currentQuestion + 1} / {plates.length}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${((currentQuestion + 1) / plates.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card p-6">
        <div className="text-center mb-4">
          <p className="text-slate-600">{t('tools.colorBlindnessTest.whatNumber')}</p>
        </div>

        <div className="flex justify-center mb-6">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="rounded-full border-4 border-slate-200"
          >
            <circle cx="100" cy="100" r="100" fill={currentPlate.bgColors[0]} />
            {dots.map((dot, i) => (
              <circle
                key={i}
                cx={dot.cx}
                cy={dot.cy}
                r={dot.r}
                fill={dot.fill}
              />
            ))}
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {currentPlate.options.map(option => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="py-3 bg-slate-100 hover:bg-slate-200 rounded text-lg font-medium transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.colorBlindnessTest.instructions')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.colorBlindnessTest.instruction1')}</li>
          <li>{t('tools.colorBlindnessTest.instruction2')}</li>
          <li>{t('tools.colorBlindnessTest.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
