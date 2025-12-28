import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Question {
  question: string
  options: { text: string; style: string }[]
}

interface StyleResult {
  name: string
  description: string
  tips: string[]
  percentage: number
}

export default function LearningStyleQuiz() {
  const { t } = useTranslation()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)

  const questions: Question[] = [
    {
      question: 'When learning something new, I prefer to:',
      options: [
        { text: 'Read about it or see diagrams', style: 'visual' },
        { text: 'Listen to an explanation', style: 'auditory' },
        { text: 'Try it hands-on', style: 'kinesthetic' },
        { text: 'Read and take notes', style: 'reading' },
      ],
    },
    {
      question: 'I remember things best when I:',
      options: [
        { text: 'See pictures or charts', style: 'visual' },
        { text: 'Hear them spoken aloud', style: 'auditory' },
        { text: 'Practice or do activities', style: 'kinesthetic' },
        { text: 'Write them down', style: 'reading' },
      ],
    },
    {
      question: 'During lectures, I prefer:',
      options: [
        { text: 'Slides with images and diagrams', style: 'visual' },
        { text: 'Clear verbal explanations', style: 'auditory' },
        { text: 'Interactive demonstrations', style: 'kinesthetic' },
        { text: 'Detailed handouts to follow along', style: 'reading' },
      ],
    },
    {
      question: 'When solving a problem, I:',
      options: [
        { text: 'Visualize the solution', style: 'visual' },
        { text: 'Talk through the steps', style: 'auditory' },
        { text: 'Try different approaches physically', style: 'kinesthetic' },
        { text: 'Write out possible solutions', style: 'reading' },
      ],
    },
    {
      question: 'I get distracted by:',
      options: [
        { text: 'Cluttered or messy environments', style: 'visual' },
        { text: 'Noise and sounds', style: 'auditory' },
        { text: 'Inability to move around', style: 'kinesthetic' },
        { text: 'Lack of written instructions', style: 'reading' },
      ],
    },
    {
      question: 'When assembling furniture, I prefer:',
      options: [
        { text: 'Looking at pictures/diagrams', style: 'visual' },
        { text: 'Having someone explain the steps', style: 'auditory' },
        { text: 'Just starting and figuring it out', style: 'kinesthetic' },
        { text: 'Following written instructions step by step', style: 'reading' },
      ],
    },
    {
      question: 'To memorize a phone number, I would:',
      options: [
        { text: 'See the numbers in my head', style: 'visual' },
        { text: 'Say it out loud repeatedly', style: 'auditory' },
        { text: 'Dial it several times', style: 'kinesthetic' },
        { text: 'Write it down multiple times', style: 'reading' },
      ],
    },
    {
      question: 'When giving directions, I tend to:',
      options: [
        { text: 'Draw a map', style: 'visual' },
        { text: 'Explain verbally', style: 'auditory' },
        { text: 'Use gestures and body movements', style: 'kinesthetic' },
        { text: 'Write out the steps', style: 'reading' },
      ],
    },
    {
      question: 'I enjoy hobbies that involve:',
      options: [
        { text: 'Photography, art, or design', style: 'visual' },
        { text: 'Music, podcasts, or discussion', style: 'auditory' },
        { text: 'Sports, crafts, or building', style: 'kinesthetic' },
        { text: 'Writing, reading, or word games', style: 'reading' },
      ],
    },
    {
      question: 'When studying for an exam, I:',
      options: [
        { text: 'Use flashcards with images', style: 'visual' },
        { text: 'Record and listen to notes', style: 'auditory' },
        { text: 'Practice problems or role-play', style: 'kinesthetic' },
        { text: 'Reread textbooks and notes', style: 'reading' },
      ],
    },
  ]

  const styleInfo: { [key: string]: { name: string; description: string; tips: string[] } } = {
    visual: {
      name: 'Visual Learner',
      description: 'You learn best through seeing. Images, diagrams, charts, and visual representations help you understand and remember information.',
      tips: [
        'Use color-coded notes and highlighters',
        'Create mind maps and diagrams',
        'Watch educational videos',
        'Use flashcards with images',
        'Sit at the front of class to see clearly',
      ],
    },
    auditory: {
      name: 'Auditory Learner',
      description: 'You learn best through listening. Lectures, discussions, and audio materials help you process and retain information.',
      tips: [
        'Record lectures and listen back',
        'Discuss topics with study groups',
        'Read notes aloud',
        'Use podcasts and audiobooks',
        'Explain concepts to others verbally',
      ],
    },
    kinesthetic: {
      name: 'Kinesthetic Learner',
      description: 'You learn best through doing. Hands-on activities, movement, and physical engagement help you understand concepts.',
      tips: [
        'Take frequent study breaks',
        'Use hands-on experiments',
        'Walk while reviewing notes',
        'Create physical models',
        'Role-play scenarios',
      ],
    },
    reading: {
      name: 'Reading/Writing Learner',
      description: 'You learn best through reading and writing. Text-based information, notes, and written materials help you absorb knowledge.',
      tips: [
        'Rewrite notes in your own words',
        'Create detailed outlines',
        'Use textbooks and written guides',
        'Make lists and written summaries',
        'Research topics through articles',
      ],
    },
  }

  const selectAnswer = (style: string) => {
    const newAnswers = [...answers, style]
    setAnswers(newAnswers)

    if (currentQuestion + 1 >= questions.length) {
      setCompleted(true)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const calculateResults = (): StyleResult[] => {
    const counts: { [key: string]: number } = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      reading: 0,
    }

    answers.forEach(style => {
      counts[style]++
    })

    const total = answers.length
    return Object.entries(counts)
      .map(([style, count]) => ({
        ...styleInfo[style],
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
  }

  const restart = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setCompleted(false)
  }

  if (completed) {
    const results = calculateResults()
    const primaryStyle = results[0]

    return (
      <div className="space-y-4">
        <div className="card p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center">
          <div className="text-sm opacity-75 mb-1">Your Primary Learning Style</div>
          <div className="text-2xl font-bold">{primaryStyle.name}</div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">Your Results</h3>
          <div className="space-y-3">
            {results.map((result, i) => (
              <div key={result.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={i === 0 ? 'font-medium' : ''}>{result.name}</span>
                  <span>{result.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full">
                  <div
                    className={`h-3 rounded-full ${
                      i === 0 ? 'bg-purple-500' : 'bg-blue-300'
                    }`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-2">About Your Style</h3>
          <p className="text-slate-600 text-sm">{primaryStyle.description}</p>
        </div>

        <div className="card p-4 bg-green-50">
          <h3 className="font-medium text-green-700 mb-2">Study Tips for {primaryStyle.name}s</h3>
          <ul className="text-sm text-green-600 space-y-1">
            {primaryStyle.tips.map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
        </div>

        {results[1].percentage > 20 && (
          <div className="card p-4 bg-blue-50">
            <h3 className="font-medium text-blue-700 mb-2">Secondary Style: {results[1].name}</h3>
            <p className="text-sm text-blue-600">
              You also show strong {results[1].name.toLowerCase()} tendencies ({results[1].percentage}%).
              Consider combining strategies from both styles.
            </p>
          </div>
        )}

        <button
          onClick={restart}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          Take Quiz Again
        </button>
      </div>
    )
  }

  const current = questions[currentQuestion]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full">
        <div
          className="h-2 bg-purple-500 rounded-full transition-all"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-medium text-center mb-6">{current.question}</h2>
        <div className="space-y-2">
          {current.options.map((option, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(option.style)}
              className="w-full p-4 text-left bg-slate-50 hover:bg-blue-50 hover:border-blue-300 rounded border-2 border-transparent transition-colors"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-slate-500">
        Answer honestly for the most accurate results
      </div>
    </div>
  )
}
