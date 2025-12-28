import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  category: string
}

export default function SecurityAwarenessQuiz() {
  const { t } = useTranslation()
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [finished, setFinished] = useState(false)

  const questions: Question[] = [
    {
      id: 1,
      category: 'Phishing',
      question: 'You receive an urgent email from your bank asking you to verify your account by clicking a link. What should you do?',
      options: [
        'Click the link immediately - it might be important',
        'Reply to the email with your account details',
        'Go directly to your bank\'s website by typing the URL',
        'Forward it to all your colleagues as a warning',
      ],
      correct: 2,
      explanation: 'Never click links in suspicious emails. Instead, navigate directly to the official website by typing the URL yourself.',
    },
    {
      id: 2,
      category: 'Passwords',
      question: 'Which is the BEST password practice?',
      options: [
        'Use the same strong password for all accounts',
        'Use unique passwords stored in a password manager',
        'Write passwords on sticky notes near your computer',
        'Use simple passwords you can easily remember',
      ],
      correct: 1,
      explanation: 'Using unique passwords for each account and storing them in a password manager is the most secure approach.',
    },
    {
      id: 3,
      category: 'Social Engineering',
      question: 'Someone calls claiming to be IT support and asks for your password. What should you do?',
      options: [
        'Give them the password - IT needs it for maintenance',
        'Ask for their employee ID and call IT to verify',
        'Give them a hint about your password',
        'Change your password first, then give them the old one',
      ],
      correct: 1,
      explanation: 'Legitimate IT staff never need your password. Always verify the caller\'s identity through official channels.',
    },
    {
      id: 4,
      category: 'Physical Security',
      question: 'A visitor asks to use your computer briefly while you step away. What should you do?',
      options: [
        'Let them use it - they seem trustworthy',
        'Lock your computer and offer to help them instead',
        'Stay and watch them use your computer',
        'Give them your password for convenience',
      ],
      correct: 1,
      explanation: 'Always lock your computer when stepping away and never let unauthorized persons use it.',
    },
    {
      id: 5,
      category: 'Data Protection',
      question: 'You need to send sensitive customer data to a colleague. What\'s the best method?',
      options: [
        'Regular email attachment',
        'Encrypted file with password shared separately',
        'Print it and leave it on their desk',
        'Post it in the team chat',
      ],
      correct: 1,
      explanation: 'Sensitive data should be encrypted before transmission, with the password shared through a different channel.',
    },
    {
      id: 6,
      category: 'USB Security',
      question: 'You find a USB drive in the parking lot. What should you do?',
      options: [
        'Plug it into your computer to find the owner',
        'Give it to IT security without plugging it in',
        'Plug it into a public computer',
        'Keep it for personal use',
      ],
      correct: 1,
      explanation: 'Unknown USB devices can contain malware. Always turn them over to IT security.',
    },
    {
      id: 7,
      category: 'WiFi Security',
      question: 'You\'re working from a coffee shop. Which is the safest approach?',
      options: [
        'Use the free public WiFi directly',
        'Use a VPN before connecting to public WiFi',
        'Ask staff for the WiFi password - it must be safe',
        'Disable your firewall for better speed',
      ],
      correct: 1,
      explanation: 'Always use a VPN when connecting to public WiFi to encrypt your traffic.',
    },
    {
      id: 8,
      category: 'Multi-Factor Authentication',
      question: 'What is the primary benefit of two-factor authentication (2FA)?',
      options: [
        'It makes logging in faster',
        'It protects accounts even if passwords are compromised',
        'It eliminates the need for passwords',
        'It is required by law',
      ],
      correct: 1,
      explanation: '2FA adds an extra layer of protection, so even if your password is stolen, your account remains protected.',
    },
    {
      id: 9,
      category: 'Software Updates',
      question: 'A software update notification appears on your work computer. What should you do?',
      options: [
        'Ignore it - updates break things',
        'Install it following company policy',
        'Postpone it indefinitely',
        'Disable automatic updates',
      ],
      correct: 1,
      explanation: 'Security updates patch vulnerabilities. Follow your company\'s update policy to stay protected.',
    },
    {
      id: 10,
      category: 'Reporting',
      question: 'You accidentally clicked a suspicious link. What should you do?',
      options: [
        'Ignore it and hope nothing happens',
        'Report it to IT security immediately',
        'Delete the email and forget about it',
        'Try to fix it yourself',
      ],
      correct: 1,
      explanation: 'Always report security incidents promptly. Early detection helps minimize potential damage.',
    },
  ]

  const startQuiz = () => {
    setStarted(true)
    setCurrentIndex(0)
    setScore(0)
    setAnswers([])
    setFinished(false)
  }

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowExplanation(true)
    setAnswers([...answers, index])
    if (index === questions[currentIndex].correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setFinished(true)
    }
  }

  const currentQuestion = questions[currentIndex]
  const percentage = Math.round((score / questions.length) * 100)

  return (
    <div className="space-y-4">
      {!started ? (
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">🛡️ {t('tools.securityAwarenessQuiz.title')}</h2>
          <p className="text-slate-600 mb-6">
            Test your security awareness with {questions.length} questions covering phishing,
            passwords, social engineering, and more.
          </p>
          <button
            onClick={startQuiz}
            className="px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
          >
            {t('tools.securityAwarenessQuiz.start')}
          </button>
        </div>
      ) : finished ? (
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '📚'} Quiz Complete!
          </h2>
          <div className={`text-5xl font-bold mb-2 ${
            percentage >= 80 ? 'text-green-600' :
            percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {score}/{questions.length}
          </div>
          <p className="text-slate-600 mb-4">
            {percentage >= 80 ? 'Excellent! You have strong security awareness.' :
             percentage >= 60 ? 'Good job! Some areas need improvement.' :
             'Consider reviewing security best practices.'}
          </p>
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden mb-6">
            <div
              className={`h-full ${
                percentage >= 80 ? 'bg-green-500' :
                percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <button
            onClick={startQuiz}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {currentQuestion.category}
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
            <div className="space-y-2">
              {currentQuestion.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-3 text-left rounded border transition-colors ${
                    selectedAnswer === null
                      ? 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                      : i === currentQuestion.correct
                      ? 'border-green-500 bg-green-50'
                      : selectedAnswer === i
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-200 opacity-50'
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {showExplanation && (
            <div className={`card p-4 ${
              selectedAnswer === currentQuestion.correct ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <h4 className="font-medium mb-2">
                {selectedAnswer === currentQuestion.correct ? '✅ Correct!' : '❌ Incorrect'}
              </h4>
              <p className="text-sm text-slate-600">{currentQuestion.explanation}</p>
              <button
                onClick={nextQuestion}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
