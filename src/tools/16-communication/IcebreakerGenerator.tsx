import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function IcebreakerGenerator() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<'fun' | 'work' | 'deep' | 'creative'>('fun')
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const questions = {
    fun: [
      "If you could have any superpower, what would it be?",
      "What's the most unusual thing you've ever eaten?",
      "If you were a pizza topping, what would you be?",
      "What's your go-to karaoke song?",
      "If you could live in any TV show, which one?",
      "What's your most useless talent?",
      "If you could only eat one food forever, what would it be?",
      "What's the weirdest dream you've ever had?",
      "If you were a type of weather, what would you be?",
      "What's your guilty pleasure?",
    ],
    work: [
      "What's the best career advice you've received?",
      "What project are you most proud of?",
      "What skill do you want to develop this year?",
      "What's your morning routine?",
      "How do you stay motivated?",
      "What's your favorite thing about your job?",
      "What would your dream job be?",
      "Who has been your biggest professional influence?",
      "What's the best meeting you've ever been in?",
      "How do you unwind after work?",
    ],
    deep: [
      "What's something you've changed your mind about?",
      "What's a life lesson you learned the hard way?",
      "If you could give advice to your younger self, what would it be?",
      "What's something you're grateful for today?",
      "What's a goal you're working towards?",
      "What does success mean to you?",
      "What's something that always makes you happy?",
      "What's a book that changed your perspective?",
      "What legacy do you want to leave?",
      "What's the most important thing in life?",
    ],
    creative: [
      "If you could create a new holiday, what would it celebrate?",
      "What would be the title of your autobiography?",
      "If you could invent something, what would it be?",
      "What would your personal theme song be?",
      "If you had a talk show, who would your first guest be?",
      "What would you name a boat if you owned one?",
      "If you could redesign any everyday object, what would it be?",
      "What would be your signature dish?",
      "If you could start a business, what would it be?",
      "What would you be famous for?",
    ],
  }

  const generateQuestion = () => {
    const categoryQuestions = questions[category]
    const availableQuestions = categoryQuestions.filter(q => !history.includes(q))

    if (availableQuestions.length === 0) {
      setHistory([])
      setCurrentQuestion(categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)])
    } else {
      const newQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
      setCurrentQuestion(newQuestion)
      setHistory([...history, newQuestion])
    }
  }

  const copyQuestion = () => {
    navigator.clipboard.writeText(currentQuestion)
  }

  const categories = [
    { id: 'fun', name: 'Fun & Light', emoji: '' },
    { id: 'work', name: 'Professional', emoji: '' },
    { id: 'deep', name: 'Meaningful', emoji: '' },
    { id: 'creative', name: 'Creative', emoji: '' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.icebreakerGenerator.category')}</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id as typeof category)
                setCurrentQuestion('')
                setHistory([])
              }}
              className={`px-4 py-3 rounded-lg text-left ${
                category === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="font-medium">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generateQuestion}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium text-lg hover:from-blue-600 hover:to-purple-600"
      >
        {t('tools.icebreakerGenerator.generate')}
      </button>

      {currentQuestion && (
        <div className="card p-6">
          <div className="text-xl font-medium text-center mb-4">
            {currentQuestion}
          </div>
          <button
            onClick={copyQuestion}
            className="w-full py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            {t('tools.icebreakerGenerator.copy')}
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.icebreakerGenerator.history')}</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.slice().reverse().map((q, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 rounded text-sm cursor-pointer hover:bg-slate-100"
                onClick={() => navigator.clipboard.writeText(q)}
              >
                {q}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.icebreakerGenerator.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Give everyone time to think before answering</li>
          <li>• Lead by example - answer first to set the tone</li>
          <li>• Keep answers brief in larger groups</li>
        </ul>
      </div>
    </div>
  )
}
