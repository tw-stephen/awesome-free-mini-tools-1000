import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ReadingSpeedTest() {
  const { t } = useTranslation()
  const [testState, setTestState] = useState<'ready' | 'reading' | 'questions' | 'results'>('ready')
  const [startTime, setStartTime] = useState<number>(0)
  const [readingTime, setReadingTime] = useState<number>(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')

  const passages = {
    easy: {
      text: `The sun rose over the mountain, painting the sky in shades of orange and pink. Birds began to sing their morning songs as the world slowly woke up. A gentle breeze rustled the leaves of the trees, carrying the sweet scent of flowers through the air. In the valley below, a small stream flowed peacefully, its waters sparkling in the early morning light. It was the beginning of a beautiful day.`,
      wordCount: 74,
      questions: [
        { question: 'What was painting the sky?', options: ['The moon', 'The sun', 'The clouds', 'The rain'], correct: 1 },
        { question: 'What did the birds do?', options: ['Flew away', 'Went to sleep', 'Sang songs', 'Built nests'], correct: 2 },
        { question: 'What flowed in the valley?', options: ['A river', 'A stream', 'A waterfall', 'A lake'], correct: 1 },
      ],
    },
    medium: {
      text: `The discovery of penicillin in 1928 by Alexander Fleming marked a turning point in medical history. Fleming noticed that a mold called Penicillium notatum had contaminated one of his bacterial cultures and was killing the bacteria around it. This observation led to the development of the first widely-used antibiotic, which has since saved millions of lives. The accidental nature of this discovery reminds us that scientific breakthroughs often come from unexpected places. Fleming's work earned him the Nobel Prize in Physiology or Medicine in 1945, shared with Howard Florey and Ernst Boris Chain, who developed penicillin for mass production.`,
      wordCount: 103,
      questions: [
        { question: 'When was penicillin discovered?', options: ['1918', '1928', '1938', '1945'], correct: 1 },
        { question: 'What killed the bacteria?', options: ['A virus', 'Heat', 'A mold', 'Chemicals'], correct: 2 },
        { question: 'Who won the Nobel Prize?', options: ['Only Fleming', 'Fleming, Florey, and Chain', 'Only Florey', 'Only Chain'], correct: 1 },
        { question: 'What was the discovery described as?', options: ['Planned', 'Expensive', 'Accidental', 'Dangerous'], correct: 2 },
      ],
    },
    hard: {
      text: `Quantum entanglement represents one of the most counterintuitive phenomena in physics, challenging our classical understanding of reality. When two particles become entangled, measuring the state of one particle instantaneously affects the state of the other, regardless of the distance separating them. Einstein famously referred to this as "spooky action at a distance," expressing his discomfort with the implications for locality and causality. Despite his skepticism, numerous experiments have confirmed the reality of entanglement, most notably the work by Alain Aspect in the 1980s. Today, quantum entanglement forms the theoretical foundation for emerging technologies such as quantum computing and quantum cryptography, which promise to revolutionize information processing and secure communication. The phenomenon continues to inspire both scientific inquiry and philosophical debate about the fundamental nature of reality.`,
      wordCount: 133,
      questions: [
        { question: 'What happens when entangled particles are measured?', options: ['Nothing', 'One affects the other instantly', 'They merge together', 'They disappear'], correct: 1 },
        { question: 'What did Einstein call entanglement?', options: ['Brilliant discovery', 'Spooky action', 'Simple physics', 'Future technology'], correct: 1 },
        { question: 'Who confirmed entanglement experimentally?', options: ['Einstein', 'Newton', 'Alain Aspect', 'Bohr'], correct: 2 },
        { question: 'What technologies use quantum entanglement?', options: ['Only computing', 'Only cryptography', 'Computing and cryptography', 'Neither'], correct: 2 },
        { question: 'When was Aspect\'s work done?', options: ['1960s', '1970s', '1980s', '1990s'], correct: 2 },
      ],
    },
  }

  const currentPassage = passages[difficulty]

  const startReading = () => {
    setTestState('reading')
    setStartTime(Date.now())
    setAnswers({})
  }

  const finishReading = () => {
    setReadingTime((Date.now() - startTime) / 1000)
    setTestState('questions')
  }

  const selectAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionIndex]: answerIndex })
  }

  const submitAnswers = () => {
    setTestState('results')
  }

  const calculateResults = () => {
    const minutes = readingTime / 60
    const wpm = Math.round(currentPassage.wordCount / minutes)

    let correctAnswers = 0
    currentPassage.questions.forEach((q, i) => {
      if (answers[i] === q.correct) correctAnswers++
    })
    const comprehension = Math.round((correctAnswers / currentPassage.questions.length) * 100)

    return { wpm, comprehension, correctAnswers, totalQuestions: currentPassage.questions.length }
  }

  const resetTest = () => {
    setTestState('ready')
    setAnswers({})
    setReadingTime(0)
  }

  const getSpeedRating = (wpm: number): string => {
    if (wpm >= 400) return 'Speed Reader'
    if (wpm >= 300) return 'Fast Reader'
    if (wpm >= 200) return 'Average Reader'
    if (wpm >= 150) return 'Below Average'
    return 'Slow Reader'
  }

  if (testState === 'results') {
    const results = calculateResults()
    return (
      <div className="space-y-4">
        <div className="card p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Your Results</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="text-3xl font-bold text-blue-600">{results.wpm}</div>
              <div className="text-sm text-blue-500">Words per Minute</div>
              <div className="text-xs text-slate-500 mt-1">{getSpeedRating(results.wpm)}</div>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <div className="text-3xl font-bold text-green-600">{results.comprehension}%</div>
              <div className="text-sm text-green-500">Comprehension</div>
              <div className="text-xs text-slate-500 mt-1">{results.correctAnswers}/{results.totalQuestions} correct</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Reading time: {readingTime.toFixed(1)} seconds
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">Question Review</h3>
          <div className="space-y-2">
            {currentPassage.questions.map((q, i) => (
              <div key={i} className={`p-3 rounded ${answers[i] === q.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="font-medium">{q.question}</div>
                <div className="text-sm mt-1">
                  Your answer: {q.options[answers[i]]}
                  {answers[i] !== q.correct && (
                    <span className="text-green-600 ml-2">
                      (Correct: {q.options[q.correct]})
                    </span>
                  )}
                </div>
              </div>
            ))}
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

  if (testState === 'questions') {
    return (
      <div className="space-y-4">
        <div className="card p-4 bg-yellow-50">
          <div className="text-center text-yellow-700">
            Reading completed! Now answer the questions below.
          </div>
        </div>

        <div className="space-y-4">
          {currentPassage.questions.map((q, qIndex) => (
            <div key={qIndex} className="card p-4">
              <div className="font-medium mb-3">{qIndex + 1}. {q.question}</div>
              <div className="space-y-2">
                {q.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    onClick={() => selectAnswer(qIndex, oIndex)}
                    className={`w-full p-3 text-left rounded border ${
                      answers[qIndex] === oIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={submitAnswers}
          disabled={Object.keys(answers).length !== currentPassage.questions.length}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium disabled:bg-slate-300"
        >
          Submit Answers
        </button>
      </div>
    )
  }

  if (testState === 'reading') {
    return (
      <div className="space-y-4">
        <div className="card p-4 bg-blue-50 text-center">
          <div className="text-blue-700">Read the passage below, then click "Done Reading"</div>
        </div>

        <div className="card p-6">
          <p className="text-lg leading-relaxed">{currentPassage.text}</p>
        </div>

        <button
          onClick={finishReading}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
        >
          Done Reading
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.readingSpeedTest.difficulty')}</h3>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`flex-1 py-2 rounded capitalize ${
                difficulty === d ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="mt-3 text-sm text-slate-500 text-center">
          {currentPassage.wordCount} words • {currentPassage.questions.length} questions
        </div>
      </div>

      <div className="card p-6 text-center">
        <h3 className="font-medium mb-2">{t('tools.readingSpeedTest.instructions')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 text-left mb-4">
          <li>1. Click "Start Reading" when ready</li>
          <li>2. Read the passage at your normal pace</li>
          <li>3. Click "Done Reading" when finished</li>
          <li>4. Answer comprehension questions</li>
          <li>5. View your reading speed and score</li>
        </ul>
        <button
          onClick={startReading}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          {t('tools.readingSpeedTest.start')}
        </button>
      </div>

      <div className="card p-4 bg-slate-50">
        <h3 className="font-medium mb-2">Average Reading Speeds</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-white rounded">150-200 WPM: Average</div>
          <div className="p-2 bg-white rounded">200-300 WPM: Fast</div>
          <div className="p-2 bg-white rounded">300-400 WPM: Speed Reader</div>
          <div className="p-2 bg-white rounded">400+ WPM: Expert</div>
        </div>
      </div>
    </div>
  )
}
