import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Question {
  question: string
  options: string[]
  correct: number
  category: string
}

export default function GeographyQuiz() {
  const { t } = useTranslation()
  const [category, setCategory] = useState('capitals')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [quizzing, setQuizzing] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  const questionBank: { [key: string]: { [key: string]: Question[] } } = {
    capitals: {
      easy: [
        { question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'], correct: 1, category: 'capitals' },
        { question: 'What is the capital of Japan?', options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], correct: 2, category: 'capitals' },
        { question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correct: 2, category: 'capitals' },
        { question: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'], correct: 3, category: 'capitals' },
        { question: 'What is the capital of Italy?', options: ['Rome', 'Milan', 'Venice', 'Florence'], correct: 0, category: 'capitals' },
      ],
      medium: [
        { question: 'What is the capital of South Korea?', options: ['Busan', 'Seoul', 'Incheon', 'Daegu'], correct: 1, category: 'capitals' },
        { question: 'What is the capital of Brazil?', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], correct: 2, category: 'capitals' },
        { question: 'What is the capital of Egypt?', options: ['Alexandria', 'Cairo', 'Luxor', 'Giza'], correct: 1, category: 'capitals' },
        { question: 'What is the capital of India?', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], correct: 1, category: 'capitals' },
        { question: 'What is the capital of Poland?', options: ['Krakow', 'Warsaw', 'Gdansk', 'Wroclaw'], correct: 1, category: 'capitals' },
      ],
      hard: [
        { question: 'What is the capital of Myanmar?', options: ['Yangon', 'Mandalay', 'Naypyidaw', 'Bago'], correct: 2, category: 'capitals' },
        { question: 'What is the capital of Sri Lanka?', options: ['Colombo', 'Kandy', 'Sri Jayawardenepura Kotte', 'Galle'], correct: 2, category: 'capitals' },
        { question: 'What is the capital of Kazakhstan?', options: ['Almaty', 'Astana', 'Shymkent', 'Karaganda'], correct: 1, category: 'capitals' },
        { question: 'What is the capital of Bhutan?', options: ['Paro', 'Thimphu', 'Punakha', 'Phuntsholing'], correct: 1, category: 'capitals' },
        { question: 'What is the capital of Liechtenstein?', options: ['Schaan', 'Vaduz', 'Triesen', 'Balzers'], correct: 1, category: 'capitals' },
      ],
    },
    continents: {
      easy: [
        { question: 'Which continent is Brazil in?', options: ['Africa', 'Europe', 'South America', 'North America'], correct: 2, category: 'continents' },
        { question: 'Which continent is China in?', options: ['Europe', 'Asia', 'Africa', 'Australia'], correct: 1, category: 'continents' },
        { question: 'Which continent is Germany in?', options: ['Asia', 'Africa', 'Europe', 'North America'], correct: 2, category: 'continents' },
        { question: 'Which continent is Egypt in?', options: ['Asia', 'Europe', 'Africa', 'South America'], correct: 2, category: 'continents' },
        { question: 'Which continent is Canada in?', options: ['South America', 'Europe', 'Asia', 'North America'], correct: 3, category: 'continents' },
      ],
      medium: [
        { question: 'Which continent is Turkey primarily in?', options: ['Europe', 'Asia', 'Both Europe and Asia', 'Africa'], correct: 2, category: 'continents' },
        { question: 'Which continent is Madagascar in?', options: ['Asia', 'Africa', 'Australia', 'South America'], correct: 1, category: 'continents' },
        { question: 'Which continent is Papua New Guinea in?', options: ['Asia', 'Australia/Oceania', 'Africa', 'South America'], correct: 1, category: 'continents' },
        { question: 'Which continent is Kazakhstan in?', options: ['Europe', 'Asia', 'Both', 'Africa'], correct: 1, category: 'continents' },
        { question: 'Which continent is Argentina in?', options: ['North America', 'Europe', 'South America', 'Africa'], correct: 2, category: 'continents' },
      ],
      hard: [
        { question: 'Which continent is Suriname in?', options: ['Africa', 'Asia', 'South America', 'Europe'], correct: 2, category: 'continents' },
        { question: 'Which continent is Mauritius in?', options: ['Asia', 'Africa', 'Europe', 'Australia'], correct: 1, category: 'continents' },
        { question: 'Which continent is Georgia (country) in?', options: ['Europe', 'Asia', 'Both', 'Africa'], correct: 2, category: 'continents' },
        { question: 'Which continent is East Timor in?', options: ['Asia', 'Australia/Oceania', 'Both', 'Africa'], correct: 0, category: 'continents' },
        { question: 'Which continent is Réunion in?', options: ['Africa', 'Asia', 'Europe', 'South America'], correct: 0, category: 'continents' },
      ],
    },
    landmarks: {
      easy: [
        { question: 'Where is the Eiffel Tower located?', options: ['London', 'Paris', 'Rome', 'Berlin'], correct: 1, category: 'landmarks' },
        { question: 'Where is the Statue of Liberty located?', options: ['Washington D.C.', 'Los Angeles', 'New York', 'Chicago'], correct: 2, category: 'landmarks' },
        { question: 'Where are the Pyramids of Giza?', options: ['Iraq', 'Jordan', 'Egypt', 'Libya'], correct: 2, category: 'landmarks' },
        { question: 'Where is the Great Wall?', options: ['Japan', 'China', 'Korea', 'Mongolia'], correct: 1, category: 'landmarks' },
        { question: 'Where is Big Ben located?', options: ['Paris', 'London', 'Dublin', 'Edinburgh'], correct: 1, category: 'landmarks' },
      ],
      medium: [
        { question: 'Where is the Taj Mahal located?', options: ['Pakistan', 'India', 'Bangladesh', 'Nepal'], correct: 1, category: 'landmarks' },
        { question: 'Where is Machu Picchu located?', options: ['Chile', 'Bolivia', 'Peru', 'Ecuador'], correct: 2, category: 'landmarks' },
        { question: 'Where is the Colosseum located?', options: ['Greece', 'Rome', 'Spain', 'Turkey'], correct: 1, category: 'landmarks' },
        { question: 'Where is Christ the Redeemer located?', options: ['Mexico', 'Argentina', 'Brazil', 'Colombia'], correct: 2, category: 'landmarks' },
        { question: 'Where is the Sydney Opera House located?', options: ['New Zealand', 'Australia', 'Singapore', 'Hong Kong'], correct: 1, category: 'landmarks' },
      ],
      hard: [
        { question: 'Where is Petra located?', options: ['Egypt', 'Israel', 'Jordan', 'Syria'], correct: 2, category: 'landmarks' },
        { question: 'Where is Angkor Wat located?', options: ['Thailand', 'Vietnam', 'Cambodia', 'Laos'], correct: 2, category: 'landmarks' },
        { question: 'Where is the Alhambra located?', options: ['Portugal', 'Spain', 'Morocco', 'France'], correct: 1, category: 'landmarks' },
        { question: 'Where is Chichen Itza located?', options: ['Guatemala', 'Mexico', 'Honduras', 'Belize'], correct: 1, category: 'landmarks' },
        { question: 'Where is the Terracotta Army located?', options: ['Japan', 'Korea', 'China', 'Vietnam'], correct: 2, category: 'landmarks' },
      ],
    },
  }

  const startQuiz = () => {
    const selectedQuestions = [...questionBank[category][difficulty]]
    for (let i = selectedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]]
    }
    setQuestions(selectedQuestions)
    setCurrentIndex(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setQuizzing(true)
  }

  const selectAnswer = (index: number) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)
    if (index === questions[currentIndex].correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setQuizzing(false)
    } else {
      setCurrentIndex(currentIndex + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    }
  }

  if (quizzing && questions.length > 0) {
    const current = questions[currentIndex]
    const isComplete = currentIndex >= questions.length

    if (isComplete || !current) {
      return (
        <div className="space-y-4">
          <div className="card p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <div className="text-5xl font-bold mb-2">{Math.round((score / questions.length) * 100)}%</div>
            <div className="text-slate-500">
              {score} of {questions.length} correct
            </div>
            <div className="mt-4 text-lg">
              {score === questions.length ? 'Perfect!' : score >= questions.length * 0.8 ? 'Great job!' : score >= questions.length * 0.6 ? 'Good effort!' : 'Keep practicing!'}
            </div>
          </div>
          <button
            onClick={startQuiz}
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
          >
            Try Again
          </button>
          <button
            onClick={() => setQuizzing(false)}
            className="w-full py-2 bg-slate-200 rounded hover:bg-slate-300"
          >
            Change Settings
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="font-medium text-green-600">Score: {score}</span>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-medium text-center mb-6">{current.question}</h2>
          <div className="space-y-2">
            {current.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                disabled={answered}
                className={`w-full p-3 rounded text-left transition-colors ${
                  answered
                    ? index === current.correct
                      ? 'bg-green-500 text-white'
                      : index === selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-100'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {answered && (
          <button
            onClick={nextQuestion}
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
          >
            {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}
          </button>
        )}

        <button
          onClick={() => setQuizzing(false)}
          className="w-full py-2 bg-slate-200 rounded hover:bg-slate-300"
        >
          End Quiz
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.geographyQuiz.category')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(questionBank).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`py-2 rounded capitalize ${
                category === cat ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.geographyQuiz.difficulty')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`py-2 rounded capitalize ${
                difficulty === d ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={startQuiz}
        className="w-full py-4 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium text-lg"
      >
        {t('tools.geographyQuiz.start')}
      </button>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-blue-700 mb-2">Quiz Info</h3>
        <p className="text-sm text-blue-600">
          Test your knowledge of world geography! Answer questions about {category} at the {difficulty} level.
        </p>
      </div>
    </div>
  )
}
